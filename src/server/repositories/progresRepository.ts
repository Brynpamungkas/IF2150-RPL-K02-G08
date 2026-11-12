import type { PoolConnection, RowDataPacket } from 'mysql2/promise';

import type { ProgresProject } from '@/models/ProgresProject';
import { query } from '@/server/db';
import type { StatusPelaksanaan } from '@/shared/progres';

/**
 * Akses basis data untuk progres project (UC09, issue #36).
 * Hanya SQL; aturan bisnis berada di `progresService`.
 */

type BarisProgres = RowDataPacket & {
  id_progres: string;
  id_project: string;
  id_pengguna: string;
  milestone: string;
  status_pelaksanaan: StatusPelaksanaan;
  catatan: string | null;
  persentase: number | null;
  dana_terpakai: number | null;
  dokumentasi_url: string | null;
  timestamp_pembaruan: Date;
};

type BarisProject = RowDataPacket & { id_pembuat: string; status: string };
type BarisPeran = RowDataPacket & { peran: string };

/**
 * Bagian tabel `project` yang dibutuhkan fitur progres.
 * TODO: pindahkan ke repository `Project` (C02) bila model tersebut sudah ada.
 */
export type RingkasanProjectProgres = {
  idPembuat: string;
  terpublikasi: boolean;
};

function dariBaris(baris: BarisProgres): ProgresProject {
  return {
    idProgres: baris.id_progres,
    idProject: baris.id_project,
    idPengguna: baris.id_pengguna,
    milestone: baris.milestone,
    statusPelaksanaan: baris.status_pelaksanaan,
    catatan: baris.catatan,
    persentase: baris.persentase,
    danaTerpakai: baris.dana_terpakai,
    dokumentasiUrl: baris.dokumentasi_url,
    timestampPembaruan: baris.timestamp_pembaruan,
  };
}

export async function ambilProjectProgres(
  idProject: string,
): Promise<RingkasanProjectProgres | null> {
  const [baris] = await query<BarisProject>(
    'SELECT id_pembuat, status FROM project WHERE id_project = ?',
    [idProject],
  );
  return baris
    ? {
        idPembuat: baris.id_pembuat,
        terpublikasi: baris.status === 'terpublikasi',
      }
    : null;
}

/** Peran pengguna, atau `null` bila akunnya tidak ada. */
export async function ambilPeran(idPengguna: string): Promise<string | null> {
  const [baris] = await query<BarisPeran>(
    'SELECT peran FROM pengguna WHERE id_pengguna = ?',
    [idPengguna],
  );
  return baris?.peran ?? null;
}

/**
 * Menyimpan satu pembaruan sebagai baris baru dan menyalin keadaan terbarunya
 * ke tabel `project` (milestone, status pelaksanaan, waktu pembaruan), agar
 * halaman detail tidak perlu membaca seluruh riwayat.
 * Harus dipanggil di dalam `withTransaction`.
 */
export async function simpanPembaruan(
  conn: PoolConnection,
  progres: ProgresProject,
): Promise<void> {
  await conn.execute(
    `INSERT INTO progres_project
       (id_progres, id_project, id_pengguna, milestone, status_pelaksanaan,
        catatan, persentase, dana_terpakai, dokumentasi_url, timestamp_pembaruan)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      progres.idProgres,
      progres.idProject,
      progres.idPengguna,
      progres.milestone,
      progres.statusPelaksanaan,
      progres.catatan,
      progres.persentase,
      progres.danaTerpakai,
      progres.dokumentasiUrl,
      progres.timestampPembaruan,
    ],
  );
  await conn.execute(
    `UPDATE project
        SET milestone = ?, status_pelaksanaan = ?, timestamp_pembaruan = ?
      WHERE id_project = ?`,
    [
      progres.milestone,
      progres.statusPelaksanaan,
      progres.timestampPembaruan,
      progres.idProject,
    ],
  );
}

/** Ringkasan satu pembaruan progres untuk daftar riwayat pengguna (Q-136). */
export type RingkasanProgresPengguna = {
  idProgres: string;
  idProject: string;
  namaProject: string;
  milestone: string;
  statusPelaksanaan: StatusPelaksanaan;
  persentase: number | null;
  timestampPembaruan: Date;
};

type BarisRingkasanProgres = RowDataPacket & {
  id_progres: string;
  id_project: string;
  nama_project: string;
  milestone: string;
  status_pelaksanaan: StatusPelaksanaan;
  persentase: number | null;
  timestamp_pembaruan: Date;
};

/**
 * Syarat akses riwayat progres (KF27): pengguna pembuat project, atau relawan
 * yang pendaftarannya sudah `accepted`. Dua parameter `?` diisi id pengguna.
 */
const SYARAT_PROGRES_PENGGUNA = `(
      p.id_pembuat = ?
      OR EXISTS (SELECT 1 FROM pendaftaran_relawan r
                  WHERE r.id_project = p.id_project
                    AND r.id_volunteer = ?
                    AND r.status_pendaftaran = 'accepted'))`;

/** Q-136 (Algo-143). Progres project milik atau yang diikuti pengguna, terbaru lebih dulu. */
export async function daftarProgresPengguna(
  idPengguna: string,
): Promise<RingkasanProgresPengguna[]> {
  const baris = await query<BarisRingkasanProgres>(
    `SELECT g.id_progres, g.id_project, g.milestone, g.status_pelaksanaan,
            g.persentase, g.timestamp_pembaruan, p.nama AS nama_project
       FROM progres_project g
       JOIN project p ON p.id_project = g.id_project
      WHERE ${SYARAT_PROGRES_PENGGUNA}
      ORDER BY g.timestamp_pembaruan DESC, g.id_progres DESC`,
    [idPengguna, idPengguna],
  );
  return baris.map((b) => ({
    idProgres: b.id_progres,
    idProject: b.id_project,
    namaProject: b.nama_project,
    milestone: b.milestone,
    statusPelaksanaan: b.status_pelaksanaan,
    persentase: b.persentase,
    timestampPembaruan: b.timestamp_pembaruan,
  }));
}

/**
 * Q-137 (Algo-144). Satu pembaruan progres bila pengguna berhak melihatnya.
 * Progres yang tidak boleh dilihat dikembalikan sebagai `null`, sama seperti
 * progres yang tidak ada, agar keberadaannya tidak bocor.
 */
export async function ambilProgresPengguna(
  idProgres: string,
  idPengguna: string,
): Promise<{ progres: ProgresProject; namaProject: string } | null> {
  const [baris] = await query<BarisProgres & { nama_project: string }>(
    `SELECT g.id_progres, g.id_project, g.id_pengguna, g.milestone,
            g.status_pelaksanaan, g.catatan, g.persentase, g.dana_terpakai,
            g.dokumentasi_url, g.timestamp_pembaruan, p.nama AS nama_project
       FROM progres_project g
       JOIN project p ON p.id_project = g.id_project
      WHERE g.id_progres = ? AND ${SYARAT_PROGRES_PENGGUNA}`,
    [idProgres, idPengguna, idPengguna],
  );
  return baris
    ? { progres: dariBaris(baris), namaProject: baris.nama_project }
    : null;
}

/** Seluruh riwayat progres sebuah project, yang terbaru lebih dulu. */
export async function daftarProgresProject(
  idProject: string,
): Promise<ProgresProject[]> {
  const baris = await query<BarisProgres>(
    `SELECT id_progres, id_project, id_pengguna, milestone, status_pelaksanaan,
            catatan, persentase, dana_terpakai, dokumentasi_url, timestamp_pembaruan
       FROM progres_project
      WHERE id_project = ?
      ORDER BY timestamp_pembaruan DESC, id_progres DESC`,
    [idProject],
  );
  return baris.map(dariBaris);
}
