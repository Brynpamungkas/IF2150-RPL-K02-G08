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
