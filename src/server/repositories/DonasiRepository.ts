/**
 * Akses basis data untuk C04 Donatur, C06 TransaksiDonasi, dan C07 BuktiTransaksi.
 * Nomor query mengikuti DPPL (Q-105 s.d. Q-114, Q-119).
 */
import type { PoolConnection, RowDataPacket } from 'mysql2/promise';
import { BuktiTransaksi } from '@/models/BuktiTransaksi';
import { Donatur } from '@/models/Donatur';
import type { TransaksiDonasi } from '@/models/TransaksiDonasi';
import type {
  JenisTujuan,
  RincianBukti,
  RingkasanTransaksi,
  StatusTransaksi,
} from '@/shared/dto';
import { execute, query } from '../db';

interface BarisDonatur extends RowDataPacket {
  id_donatur: string;
  nama: string;
  email: string | null;
  saldo: number;
}

interface BarisJumlah extends RowDataPacket {
  jumlah: number;
}

interface BarisDetail extends RowDataPacket {
  id_transaksi: string;
  jenis_tujuan: JenisTujuan;
  id_tujuan: string;
  nominal: number;
  tanggal: Date;
  status_transaksi: StatusTransaksi;
  nama_donatur: string;
  nama_tujuan: string | null;
}

interface BarisRiwayat extends RowDataPacket {
  id_transaksi: string;
  jenis_tujuan: JenisTujuan;
  id_tujuan: string;
  nominal: number;
  tanggal: Date;
  status_transaksi: StatusTransaksi;
  nama_tujuan: string | null;
}

interface BarisBukti extends RowDataPacket {
  id_bukti: string;
  rincian: string;
}

// nama ada di tabel pengguna dan email di tabel akun (skema 001), bukan di donatur.
const SELECT_DONATUR = `
  SELECT d.id_donatur, u.nama, a.email, d.saldo
    FROM donatur d
    JOIN pengguna u ON u.id_pengguna = d.id_donatur
    LEFT JOIN akun a ON a.id_pengguna = d.id_donatur
   WHERE d.id_donatur = ?`;

const JOIN_TUJUAN = `
    LEFT JOIN project p ON t.jenis_tujuan = 'project' AND p.id_project = t.id_tujuan
    LEFT JOIN campaign c ON t.jenis_tujuan = 'campaign' AND c.id_campaign = t.id_tujuan`;

const keDonatur = (b: BarisDonatur) =>
  new Donatur(b.id_donatur, b.nama, b.email, Number(b.saldo));

export const DonasiRepository = {
  /* ---------- Donatur (C04) ---------- */

  /** Q-105 (ditambah nama dan email). Di luar transaksi; untuk menampilkan formulir. */
  async getDonatur(idDonatur: string): Promise<Donatur | null> {
    const [b] = await query<BarisDonatur>(SELECT_DONATUR, [idDonatur]);
    return b ? keDonatur(b) : null;
  },

  /**
   * Q-109. Membaca sekaligus mengunci baris saldo donatur sampai transaksi selesai,
   * sehingga donasi bersamaan dari donatur yang sama antre (KF15). Hanya baris
   * donatur yang dikunci (FOR UPDATE OF d) agar tabel pengguna/akun tidak ikut terkunci.
   */
  async kunciDonatur(
    conn: PoolConnection,
    idDonatur: string,
  ): Promise<Donatur | null> {
    const [b] = await query<BarisDonatur>(
      `${SELECT_DONATUR} FOR UPDATE OF d`,
      [idDonatur],
      conn,
    );
    return b ? keDonatur(b) : null;
  },

  /**
   * Q-106 (Algo-104). Syarat saldo >= ? di WHERE membuat pemeriksaan dan pengurangan
   * satu pernyataan atomik, jadi saldo tidak pernah negatif walau ada donasi bersamaan.
   * @returns false bila saldo tidak cukup.
   */
  async kurangiSaldo(
    conn: PoolConnection,
    idDonatur: string,
    nominal: number,
  ): Promise<boolean> {
    const hasil = await execute(
      'UPDATE donatur SET saldo = saldo - ? WHERE id_donatur = ? AND saldo >= ?',
      [nominal, idDonatur, nominal],
      conn,
    );
    return hasil.affectedRows > 0;
  },

  /* ---------- TransaksiDonasi (C06) ---------- */

  /** Q-107 (Algo-106). true bila idempotency key SUDAH terdaftar, yaitu duplikat (KF18). */
  async validasiDuplikasi(idempotencyKey: string): Promise<boolean> {
    const [b] = await query<BarisJumlah>(
      'SELECT COUNT(*) AS jumlah FROM transaksi_donasi WHERE idempotency_key = ?',
      [idempotencyKey],
    );
    return Number(b?.jumlah ?? 0) > 0;
  },

  /**
   * Q-108 (Algo-107). Unique index idempotency_key menolak permintaan kembar yang
   * lolos Q-107 bersamaan (ER_DUP_ENTRY), sehingga transaksinya di-rollback.
   */
  async simpanTransaksi(
    conn: PoolConnection,
    t: TransaksiDonasi,
  ): Promise<void> {
    await execute(
      `INSERT INTO transaksi_donasi
         (id_transaksi, id_donatur, id_tujuan, jenis_tujuan, idempotency_key,
          nominal, tanggal, status_transaksi)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        t.idTransaksi,
        t.idDonatur,
        t.idTujuan,
        t.jenisTujuan,
        t.idempotencyKey,
        t.nominal,
        t.tanggal,
        t.statusTransaksi,
      ],
      conn,
    );
  },

  /** Q-110 (Algo-109). Riwayat donasi satu donatur, terbaru lebih dulu (KF17, KF27). */
  async getRiwayatTransaksi(idDonatur: string): Promise<RingkasanTransaksi[]> {
    const baris = await query<BarisRiwayat>(
      `SELECT t.id_transaksi, t.jenis_tujuan, t.id_tujuan, t.nominal, t.tanggal,
              t.status_transaksi, COALESCE(p.nama, c.judul) AS nama_tujuan
         FROM transaksi_donasi t ${JOIN_TUJUAN}
        WHERE t.id_donatur = ?
        ORDER BY t.tanggal DESC`,
      [idDonatur],
    );
    return baris.map((b) => ({
      idTransaksi: b.id_transaksi,
      jenisTujuan: b.jenis_tujuan,
      idTujuan: b.id_tujuan,
      namaTujuan: b.nama_tujuan,
      nominal: Number(b.nominal),
      tanggal: new Date(b.tanggal).toISOString(),
      statusTransaksi: b.status_transaksi,
    }));
  },

  /**
   * Q-111 (Algo-110) / Q-112. Rincian satu transaksi beserta nama donatur dan tujuan.
   * Bila idDonatur diisi, hanya transaksi milik donatur itu yang dikembalikan.
   */
  async getDetailTransaksi(
    idTransaksi: string,
    idDonatur?: string,
  ): Promise<Omit<RincianBukti, 'pesan'> | null> {
    const [b] = await query<BarisDetail>(
      `SELECT t.id_transaksi, t.jenis_tujuan, t.id_tujuan, t.nominal, t.tanggal,
              t.status_transaksi, u.nama AS nama_donatur,
              COALESCE(p.nama, c.judul) AS nama_tujuan
         FROM transaksi_donasi t
         JOIN pengguna u ON u.id_pengguna = t.id_donatur ${JOIN_TUJUAN}
        WHERE t.id_transaksi = ?${idDonatur ? ' AND t.id_donatur = ?' : ''}`,
      idDonatur ? [idTransaksi, idDonatur] : [idTransaksi],
    );
    if (!b) return null;
    return {
      namaDonatur: b.nama_donatur,
      namaTujuan: b.nama_tujuan ?? b.id_tujuan,
      jenisTujuan: b.jenis_tujuan,
      nominal: Number(b.nominal),
      tanggal: new Date(b.tanggal).toISOString(),
      statusTransaksi: b.status_transaksi,
    };
  },

  /** Q-119. Memastikan transaksi milik donatur yang login. */
  async milikDonatur(idTransaksi: string, idDonatur: string): Promise<boolean> {
    const [b] = await query<BarisJumlah>(
      'SELECT COUNT(*) AS jumlah FROM transaksi_donasi WHERE id_transaksi = ? AND id_donatur = ?',
      [idTransaksi, idDonatur],
    );
    return Number(b?.jumlah ?? 0) > 0;
  },

  /* ---------- BuktiTransaksi (C07) ---------- */

  /** Q-113. Unique id_transaksi: pemanggilan ulang tidak membuat bukti ganda. */
  async simpanBukti(bukti: BuktiTransaksi): Promise<void> {
    await execute(
      `INSERT INTO bukti_transaksi (id_bukti, id_transaksi, rincian)
       VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE id_bukti = id_bukti`,
      [bukti.idBukti, bukti.idTransaksi, JSON.stringify(bukti.rincian)],
    );
  },

  /** Q-114. Baris mentah bukti (rincian masih berupa teks). */
  async getBukti(
    idTransaksi: string,
  ): Promise<{ idBukti: string; rincian: string } | null> {
    const [b] = await query<BarisBukti>(
      'SELECT id_bukti, rincian FROM bukti_transaksi WHERE id_transaksi = ?',
      [idTransaksi],
    );
    return b ? { idBukti: b.id_bukti, rincian: b.rincian } : null;
  },
};
