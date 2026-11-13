import type { PoolConnection, RowDataPacket } from 'mysql2/promise';

import type { PendaftaranRelawan } from '@/models/PendaftaranRelawan';
import { query } from '@/server/db';
import type { StatusPendaftaran } from '@/shared/relawan';

/**
 * Akses basis data untuk pendaftaran relawan (UC07, UC08, issue #31 dan #33).
 * Hanya SQL; aturan bisnis berada di `relawanService`.
 *
 * Fungsi yang menerima `conn` harus dipanggil di dalam `withTransaction`.
 */

type BarisPendaftaran = RowDataPacket & {
  id_pendaftaran: string;
  id_volunteer: string;
  id_project: string;
  data_diri: string;
  keahlian: string | null;
  pengalaman: string | null;
  ketersediaan_jadwal: string | null;
  status_pendaftaran: StatusPendaftaran;
  tanggal_daftar: Date;
  tanggal_keputusan: Date | null;
};

type BarisProject = RowDataPacket & {
  id_project: string;
  id_pembuat: string;
  status: string;
  status_pendaftaran_project: 'dibuka' | 'ditutup';
  kuota_relawan: number;
};

type BarisJumlah = RowDataPacket & { jumlah: number };

/**
 * Bagian tabel `project` yang dibutuhkan fitur relawan.
 * TODO: pindahkan ke repository `Project` (C02) bila model tersebut sudah ada.
 */
export type RingkasanProject = {
  idProject: string;
  idPembuat: string;
  terpublikasi: boolean;
  pendaftaranDibuka: boolean;
  kuota: number;
};

function dariBaris(baris: BarisPendaftaran): PendaftaranRelawan {
  return {
    idPendaftaran: baris.id_pendaftaran,
    idVolunteer: baris.id_volunteer,
    idProject: baris.id_project,
    dataDiri: baris.data_diri,
    keahlian: baris.keahlian,
    pengalaman: baris.pengalaman,
    ketersediaanJadwal: baris.ketersediaan_jadwal,
    status: baris.status_pendaftaran,
    tanggalDaftar: baris.tanggal_daftar,
    tanggalKeputusan: baris.tanggal_keputusan,
  };
}

function dariBarisProject(baris: BarisProject): RingkasanProject {
  return {
    idProject: baris.id_project,
    idPembuat: baris.id_pembuat,
    terpublikasi: baris.status === 'terpublikasi',
    pendaftaranDibuka: baris.status_pendaftaran_project === 'dibuka',
    kuota: baris.kuota_relawan,
  };
}

const KOLOM_PENDAFTARAN = `id_pendaftaran, id_volunteer, id_project, data_diri, keahlian,
  pengalaman, ketersediaan_jadwal, status_pendaftaran, tanggal_daftar, tanggal_keputusan`;

/**
 * Mengambil project dan mengunci barisnya sampai transaksi selesai.
 * Penguncian ini menyerialkan dua pendaftaran atau keputusan yang datang
 * bersamaan pada project yang sama, sehingga hitungan kuota tidak salah.
 */
export async function kunciProject(
  conn: PoolConnection,
  idProject: string,
): Promise<RingkasanProject | null> {
  const [baris] = await conn.query<BarisProject[]>(
    `SELECT id_project, id_pembuat, status, status_pendaftaran_project, kuota_relawan
       FROM project WHERE id_project = ? FOR UPDATE`,
    [idProject],
  );
  return baris[0] ? dariBarisProject(baris[0]) : null;
}

/** Mengambil project tanpa penguncian, untuk pemeriksaan kepemilikan. */
export async function cariProject(
  idProject: string,
): Promise<RingkasanProject | null> {
  const baris = await query<BarisProject>(
    `SELECT id_project, id_pembuat, status, status_pendaftaran_project, kuota_relawan
       FROM project WHERE id_project = ?`,
    [idProject],
  );
  return baris[0] ? dariBarisProject(baris[0]) : null;
}

export async function penggunaAda(idPengguna: string): Promise<boolean> {
  const baris = await query<RowDataPacket>(
    'SELECT 1 FROM pengguna WHERE id_pengguna = ?',
    [idPengguna],
  );
  return baris.length > 0;
}

/** Jumlah relawan yang sudah diterima pada sebuah project. */
export async function hitungDiterima(
  conn: PoolConnection,
  idProject: string,
): Promise<number> {
  const [baris] = await conn.query<BarisJumlah[]>(
    `SELECT COUNT(*) AS jumlah FROM pendaftaran_relawan
      WHERE id_project = ? AND status_pendaftaran = 'accepted'`,
    [idProject],
  );
  return Number(baris[0]?.jumlah ?? 0);
}

export async function adaPendaftaran(
  conn: PoolConnection,
  idVolunteer: string,
  idProject: string,
): Promise<boolean> {
  const [baris] = await conn.query<RowDataPacket[]>(
    'SELECT 1 FROM pendaftaran_relawan WHERE id_volunteer = ? AND id_project = ?',
    [idVolunteer, idProject],
  );
  return baris.length > 0;
}

/** Menyimpan pendaftaran baru dengan status `pending` (KF20). */
export async function simpanPendaftaran(
  conn: PoolConnection,
  data: {
    idPendaftaran: string;
    idVolunteer: string;
    idProject: string;
    dataDiri: string;
    keahlian: string;
    pengalaman: string;
    ketersediaanJadwal: string;
  },
): Promise<void> {
  await conn.execute(
    `INSERT INTO pendaftaran_relawan
       (id_pendaftaran, id_volunteer, id_project, data_diri, keahlian,
        pengalaman, ketersediaan_jadwal, status_pendaftaran)
     VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
    [
      data.idPendaftaran,
      data.idVolunteer,
      data.idProject,
      data.dataDiri,
      data.keahlian,
      data.pengalaman,
      data.ketersediaanJadwal,
    ],
  );
}

export async function ambilPendaftaran(
  conn: PoolConnection,
  idPendaftaran: string,
): Promise<PendaftaranRelawan | null> {
  const [baris] = await conn.query<BarisPendaftaran[]>(
    `SELECT ${KOLOM_PENDAFTARAN} FROM pendaftaran_relawan WHERE id_pendaftaran = ?`,
    [idPendaftaran],
  );
  return baris[0] ? dariBaris(baris[0]) : null;
}

/** Menyimpan keputusan pemilik project beserta waktunya (KF21). */
export async function simpanKeputusan(
  conn: PoolConnection,
  idPendaftaran: string,
  status: StatusPendaftaran,
): Promise<void> {
  await conn.execute(
    `UPDATE pendaftaran_relawan
        SET status_pendaftaran = ?, tanggal_keputusan = NOW()
      WHERE id_pendaftaran = ?`,
    [status, idPendaftaran],
  );
}

/** Seluruh pendaftar sebuah project, yang terbaru lebih dulu. */
export async function daftarPendaftarProject(
  idProject: string,
): Promise<PendaftaranRelawan[]> {
  const baris = await query<BarisPendaftaran>(
    `SELECT ${KOLOM_PENDAFTARAN} FROM pendaftaran_relawan
      WHERE id_project = ? ORDER BY tanggal_daftar DESC, id_pendaftaran`,
    [idProject],
  );
  return baris.map(dariBaris);
}

/** Satu pendaftaran milik relawan beserta ringkasan project-nya. */
export type PendaftaranDenganProject = PendaftaranRelawan & {
  namaProject: string;
  kota: string;
  provinsi: string;
  jadwalMulai: string | null;
  jadwalSelesai: string | null;
  lokasiKumpul: string | null;
};

type BarisDenganProject = BarisPendaftaran & {
  nama_project: string;
  kota: string;
  provinsi: string;
  jadwal_mulai: string | null;
  jadwal_selesai: string | null;
  lokasi_kumpul: string | null;
};

/** Seluruh pendaftaran seorang relawan, yang terbaru lebih dulu. */
export async function daftarPendaftaranSaya(
  idVolunteer: string,
): Promise<PendaftaranDenganProject[]> {
  const baris = await query<BarisDenganProject>(
    `SELECT pr.id_pendaftaran, pr.id_volunteer, pr.id_project, pr.data_diri,
            pr.keahlian, pr.pengalaman, pr.ketersediaan_jadwal,
            pr.status_pendaftaran, pr.tanggal_daftar, pr.tanggal_keputusan,
            p.nama AS nama_project, p.kota, p.provinsi,
            DATE_FORMAT(p.jadwal_mulai, '%Y-%m-%d') AS jadwal_mulai,
            DATE_FORMAT(p.jadwal_selesai, '%Y-%m-%d') AS jadwal_selesai,
            p.lokasi_kumpul
       FROM pendaftaran_relawan pr
       JOIN project p ON p.id_project = pr.id_project
      WHERE pr.id_volunteer = ?
      ORDER BY pr.tanggal_daftar DESC, pr.id_pendaftaran DESC`,
    [idVolunteer],
  );
  return baris.map((b) => ({
    ...dariBaris(b),
    namaProject: b.nama_project,
    kota: b.kota,
    provinsi: b.provinsi,
    jadwalMulai: b.jadwal_mulai,
    jadwalSelesai: b.jadwal_selesai,
    lokasiKumpul: b.lokasi_kumpul,
  }));
}
