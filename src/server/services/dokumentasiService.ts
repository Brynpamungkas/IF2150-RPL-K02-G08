import type { RowDataPacket } from 'mysql2/promise';

import { query } from '@/server/db';
import {
  getPenyimpananDokumentasi,
  type BerkasTersimpan,
  type IsiBerkas,
} from '@/server/storage/dokumentasiStorage';
import { GalatValidasi } from '@/shared/galat';

/**
 * Aturan akses berkas dokumentasi progres (UC09, KF24, issue #12).
 *
 * Penyimpanan hanya tahu cara menulis dan membaca berkas; keputusan siapa yang
 * boleh melihat berkas berada di sini, dan ditegakkan lewat query ke basis
 * data, bukan lewat penyembunyian tautan di antarmuka.
 */

type BarisProject = RowDataPacket & {
  id_pembuat: string;
  status: string;
};

type BarisPeran = RowDataPacket & { peran: string };

/**
 * Menyimpan satu berkas dokumentasi milik sebuah project.
 * Dipakai `ProgresController` (C38) saat memproses pembaruan progres (issue #36).
 */
export async function simpanDokumentasiProgres(
  idProject: string,
  berkas: File,
): Promise<BerkasTersimpan> {
  return getPenyimpananDokumentasi().simpan(idProject, berkas);
}

/**
 * Memeriksa hak akses atas dokumentasi sebuah project.
 *
 * Project yang sudah terpublikasi dokumentasinya terbuka untuk umum, sejalan
 * dengan KF14 yang menyatakan kegiatan terpublikasi beserta informasi
 * lengkapnya dapat dilihat pengguna. Project yang masih draft, menunggu
 * verifikasi, atau ditolak hanya dapat dilihat pembuatnya dan Admin Sistem.
 */
export async function bolehMelihatDokumentasi(
  idProject: string,
  idPengguna: string | null,
): Promise<boolean> {
  const [project] = await query<BarisProject>(
    'SELECT id_pembuat, status FROM project WHERE id_project = ?',
    [idProject],
  );

  if (!project) {
    throw new GalatValidasi('Project tidak ditemukan.', 404);
  }

  if (project.status === 'terpublikasi') return true;
  if (!idPengguna) return false;
  if (project.id_pembuat === idPengguna) return true;

  const [pengguna] = await query<BarisPeran>(
    'SELECT peran FROM pengguna WHERE id_pengguna = ?',
    [idPengguna],
  );
  return pengguna?.peran === 'admin';
}

/**
 * Mengambil isi berkas dokumentasi setelah hak akses dipastikan.
 * Mengembalikan `null` bila berkasnya memang tidak ada.
 */
export async function ambilDokumentasiProgres(
  idProject: string,
  nama: string,
  idPengguna: string | null,
): Promise<IsiBerkas | null> {
  if (!(await bolehMelihatDokumentasi(idProject, idPengguna))) {
    throw new GalatValidasi(
      'Dokumentasi ini hanya dapat dilihat pembuat project dan Admin Sistem.',
      403,
    );
  }
  return getPenyimpananDokumentasi().baca(idProject, nama);
}
