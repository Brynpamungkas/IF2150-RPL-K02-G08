import { keDto } from '@/models/ProgresProject';
import { DonasiRepository } from '@/server/repositories/DonasiRepository';
import {
  ambilProgresPengguna,
  daftarProgresPengguna,
} from '@/server/repositories/progresRepository';
import { GalatValidasi } from '@/shared/galat';
import {
  daftarTopupPengguna,
  daftarRiwayatRelawan,
} from '@/server/repositories/riwayatTambahanRepository';
import {
  gabungkanRiwayat,
  type DetailProgresRiwayat,
  type DetailTransaksiRiwayat,
  type FilterRiwayat,
  type ItemRiwayat,
  type ItemRiwayatProgres,
  type ItemRiwayatTransaksi,
} from '@/shared/riwayat';

/**
 * Aturan riwayat donasi, top-up, pendaftaran relawan dan progres.
 * Dipanggil `RiwayatController` (C41).
 *
 * Kepemilikan data selalu diperiksa di dalam kueri (`id_donatur = ?`, syarat
 * `id_volunteer = ?`, pembuat/relawan diterima), dengan id dari sesi, bukan klien.
 * Data milik orang lain diperlakukan sama seperti data yang tidak ada.
 */

function wajibMasuk(idPengguna: string | null): string {
  if (!idPengguna) {
    throw new GalatValidasi('Silakan masuk terlebih dahulu.', 401);
  }
  return idPengguna;
}

/**
 * Algo-129: riwayat pengguna yang login, terbaru lebih dulu.
 * Daftar kosong adalah hasil yang sah (UC10 Alt 1), bukan galat.
 */
export async function riwayatPengguna(
  idPengguna: string | null,
  filter: FilterRiwayat,
): Promise<ItemRiwayat[]> {
  const id = wajibMasuk(idPengguna);

  const termasuk = (jenis: FilterRiwayat) =>
    filter === 'semua' || filter === jenis;
  const [transaksi, progres, topup, relawan] = await Promise.all([
    termasuk('transaksi') ? DonasiRepository.getRiwayatTransaksi(id) : [],
    termasuk('progres') ? daftarProgresPengguna(id) : [],
    termasuk('topup') ? daftarTopupPengguna(id) : [],
    termasuk('relawan') ? daftarRiwayatRelawan(id) : [],
  ]);

  return gabungkanRiwayat(
    transaksi.map((t): ItemRiwayatTransaksi => ({
      jenis: 'transaksi',
      id: t.idTransaksi,
      waktu: t.tanggal,
      jenisTujuan: t.jenisTujuan,
      idTujuan: t.idTujuan,
      namaTujuan: t.namaTujuan,
      nominal: t.nominal,
      status: t.statusTransaksi,
    })),
    progres.map((g): ItemRiwayatProgres => ({
      jenis: 'progres',
      id: g.idProgres,
      waktu: g.timestampPembaruan.toISOString(),
      idProject: g.idProject,
      namaProject: g.namaProject,
      milestone: g.milestone,
      statusPelaksanaan: g.statusPelaksanaan,
      persentase: g.persentase,
    })),
    topup,
    relawan,
  );
}

/** Algo-130 / Algo-110: rincian satu transaksi milik pengguna yang login. */
export async function detailTransaksi(
  idPengguna: string | null,
  idTransaksi: string,
): Promise<DetailTransaksiRiwayat> {
  const id = wajibMasuk(idPengguna);
  const rincian = await DonasiRepository.getDetailTransaksi(idTransaksi, id);
  if (!rincian) {
    throw new GalatValidasi('Transaksi tidak ditemukan.', 404);
  }
  return { idTransaksi, ...rincian };
}

/** Algo-130 / Algo-144: rincian satu pembaruan progres yang boleh dilihat pengguna. */
export async function detailProgres(
  idPengguna: string | null,
  idProgres: string,
): Promise<DetailProgresRiwayat> {
  const id = wajibMasuk(idPengguna);
  const hasil = await ambilProgresPengguna(idProgres, id);
  if (!hasil) {
    throw new GalatValidasi('Progres tidak ditemukan.', 404);
  }
  return { ...keDto(hasil.progres), namaProject: hasil.namaProject };
}
