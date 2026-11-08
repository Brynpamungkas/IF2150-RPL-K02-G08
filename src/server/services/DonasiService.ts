import { BuktiTransaksi } from '@/models/BuktiTransaksi';
import { TransaksiDonasi } from '@/models/TransaksiDonasi';
import type {
  BuktiDTO,
  FormDonasiInfo,
  HasilDonasi,
  JenisTujuan,
  PermintaanDonasi,
  RingkasanTransaksi,
} from '@/shared/dto';
import { GalatAplikasi } from '@/shared/galat';
import { adalahKunciGanda, withTransaction } from '../db';
import { CampaignProjectRepository } from '../repositories/CampaignProjectRepository';
import { DonasiRepository } from '../repositories/DonasiRepository';

/**
 * Mengoordinasikan C04 Donatur, C06 TransaksiDonasi, dan C07 BuktiTransaksi untuk UC06
 * (KF15-KF18, KF26). Dipanggil oleh DonasiController setelah login diperiksa,
 * sehingga idDonatur selalu berasal dari sesi, bukan dari klien.
 */
export const DonasiService = {
  /** Algo-120. Data modal donasi: nama tujuan dan saldo donatur. */
  async bukaFormDonasi(
    idDonatur: string,
    jenis: JenisTujuan,
    idTujuan: string,
  ): Promise<FormDonasiInfo> {
    const tujuan = await CampaignProjectRepository.cekStatus(jenis, idTujuan);
    if (!tujuan) throw new GalatAplikasi('TUJUAN_TIDAK_DITEMUKAN');
    if (!tujuan.aktif) throw new GalatAplikasi('TUJUAN_DITUTUP');

    const donatur = await DonasiRepository.getDonatur(idDonatur);
    if (!donatur) throw new GalatAplikasi('BUKAN_DONATUR');

    return {
      tujuan: { jenis, id: tujuan.id, nama: tujuan.nama },
      saldo: donatur.getSaldo(),
    };
  },

  /**
   * Algo-121 + Algo-108. Urutan:
   *   1. validasiNominal (Algo-105) dan validasiDuplikasi (Algo-106) sebelum transaksi.
   *   2. Satu transaksi MySQL: SELECT ... FOR UPDATE saldo (Q-109), kurangi saldo dengan
   *      WHERE saldo >= ? (Q-106), tambah dana tujuan (Q-124/Q-125), catat transaksi (Q-108).
   *      Galat di tahap mana pun me-rollback semuanya (KF16).
   *   3. Setelah commit: cetak bukti (Algo-111). Kegagalan di sini tidak membatalkan donasi;
   *      bukti dibentuk ulang saat diminta (lihat getBuktiTransaksi).
   */
  async prosesDonasi(
    idDonatur: string,
    minta: PermintaanDonasi,
  ): Promise<HasilDonasi> {
    const { jenisTujuan, idTujuan, nominal, idempotencyKey } = minta;

    if (!TransaksiDonasi.validasiNominal(nominal)) {
      throw new GalatAplikasi('NOMINAL_TIDAK_VALID');
    }
    if (await DonasiRepository.validasiDuplikasi(idempotencyKey)) {
      throw new GalatAplikasi('DUPLIKAT');
    }

    let hasil: HasilDonasi;
    try {
      hasil = await withTransaction(async (conn) => {
        // 1. Kunci baris donatur: donasi bersamaan dari donatur ini menunggu giliran.
        const donatur = await DonasiRepository.kunciDonatur(conn, idDonatur);
        if (!donatur) throw new GalatAplikasi('BUKAN_DONATUR');
        if (!donatur.cukupUntuk(nominal)) {
          throw new GalatAplikasi('SALDO_KURANG');
        }

        // 2. Kurangi saldo (pengaman kedua: WHERE saldo >= ?).
        if (!(await DonasiRepository.kurangiSaldo(conn, idDonatur, nominal))) {
          throw new GalatAplikasi('SALDO_KURANG');
        }
        donatur.kurangiSaldo(nominal);

        // 3. Tambah dana tujuan; status/periode diperiksa ulang secara atomik.
        const diterima = await CampaignProjectRepository.tambahDana(
          conn,
          jenisTujuan,
          idTujuan,
          nominal,
        );
        if (!diterima) throw new GalatAplikasi('TUJUAN_DITUTUP');

        // 4. Catat transaksi dengan ID unik (KF17).
        const transaksi = TransaksiDonasi.buatTransaksi(
          idDonatur,
          idTujuan,
          jenisTujuan,
          nominal,
          idempotencyKey,
        );
        await DonasiRepository.simpanTransaksi(conn, transaksi);

        // KF26: persentase capaian dihitung dari dana terbaru (sudah termasuk donasi ini).
        const capaian = await CampaignProjectRepository.hitungPersentaseCapaian(
          jenisTujuan,
          idTujuan,
          conn,
        );

        return {
          idTransaksi: transaksi.idTransaksi,
          saldoSesudah: donatur.getSaldo(),
          ...capaian,
        };
      });
    } catch (e) {
      if (e instanceof GalatAplikasi) throw e;
      // Dua permintaan dengan key sama lolos Q-107 bersamaan: unique index menolak yang kedua.
      if (adalahKunciGanda(e)) throw new GalatAplikasi('DUPLIKAT');
      console.error('[klimpool] donasi dibatalkan karena gangguan:', e);
      throw new GalatAplikasi('TRANSAKSI_GAGAL');
    }

    try {
      await cetakBukti(hasil.idTransaksi, minta.pesan?.trim() || null);
    } catch (e) {
      console.error(
        '[klimpool] bukti transaksi gagal dibuat, akan dibuat ulang:',
        e,
      );
    }
    return hasil;
  },

  /** Algo-122. Bukti hanya untuk donatur pemilik transaksi (Q-119). */
  async getBuktiTransaksi(
    idDonatur: string,
    idTransaksi: string,
  ): Promise<BuktiDTO> {
    if (!(await DonasiRepository.milikDonatur(idTransaksi, idDonatur))) {
      throw new GalatAplikasi('TIDAK_DITEMUKAN');
    }

    let baris = await DonasiRepository.getBukti(idTransaksi);
    if (!baris) {
      await cetakBukti(idTransaksi, null);
      baris = await DonasiRepository.getBukti(idTransaksi);
    }
    if (!baris) throw new GalatAplikasi('TIDAK_DITEMUKAN');

    // Data seed menyimpan rincian sebagai teks bebas; bentuk ulang dari transaksinya.
    let rincian = BuktiTransaksi.uraiRincian(baris.rincian);
    if (!rincian) {
      const detail = await DonasiRepository.getDetailTransaksi(idTransaksi);
      if (!detail) throw new GalatAplikasi('TIDAK_DITEMUKAN');
      rincian = { ...detail, pesan: null };
    }
    return new BuktiTransaksi(
      baris.idBukti,
      idTransaksi,
      rincian,
    ).tampilkanBukti();
  },

  /** Algo-109. Riwayat donasi donatur (KF17); dipakai juga oleh modul Riwayat. */
  async getRiwayatTransaksi(idDonatur: string): Promise<RingkasanTransaksi[]> {
    return DonasiRepository.getRiwayatTransaksi(idDonatur);
  },
};

/** Algo-111 (Q-112 + Q-113). Idempoten: aman dipanggil ulang untuk transaksi yang sama. */
async function cetakBukti(
  idTransaksi: string,
  pesan: string | null,
): Promise<void> {
  const detail = await DonasiRepository.getDetailTransaksi(idTransaksi);
  if (!detail) throw new GalatAplikasi('TIDAK_DITEMUKAN');
  const bukti = BuktiTransaksi.cetakBukti(idTransaksi, { ...detail, pesan });
  await DonasiRepository.simpanBukti(bukti);
}
