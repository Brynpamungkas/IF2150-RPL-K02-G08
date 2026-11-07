import { randomUUID } from 'node:crypto';

import type { PendaftaranRelawan } from '@/models/PendaftaranRelawan';
import { withTransaction } from '@/server/db';
import {
  adaPendaftaran,
  ambilPendaftaran,
  cariProject,
  daftarPendaftarProject,
  hitungDiterima,
  kunciProject,
  penggunaAda,
  simpanKeputusan,
  simpanPendaftaran,
} from '@/server/repositories/pendaftaranRelawanRepository';
import { GalatValidasi } from '@/shared/galat';
import {
  bersihkanForm,
  formatDataDiri,
  formatJadwal,
  formatKeahlian,
  isKeputusan,
  validasiFormPendaftaran,
} from '@/shared/relawan';

/**
 * Aturan bisnis relawan (UC07 dan UC08, KF19-KF21, issue #31 dan #33).
 * Dipanggil `RelawanController` (C34); seluruh pemeriksaan akses dilakukan di
 * sini lewat query, bukan lewat penyembunyian tombol di antarmuka.
 */

function wajibMasuk(idPengguna: string | null): string {
  if (!idPengguna) {
    throw new GalatValidasi('Silakan masuk terlebih dahulu.', 401);
  }
  return idPengguna;
}

/** Kode galat MySQL untuk pelanggaran UNIQUE KEY. */
function galatDuplikat(galat: unknown): boolean {
  return (galat as { code?: string } | null)?.code === 'ER_DUP_ENTRY';
}

const PESAN_SUDAH_DAFTAR = 'Anda sudah mendaftar pada project ini.';

/**
 * UC07: mendaftarkan pengguna sebagai relawan sebuah project.
 *
 * Urutan pemeriksaan: sudah masuk, formulir lengkap, project terbit, bukan
 * project sendiri, pendaftaran dibuka, belum pernah mendaftar, kuota belum
 * penuh. Kuota dihitung dari relawan berstatus `accepted`.
 */
export async function daftarRelawan(
  idPengguna: string | null,
  idProject: string,
  masukan: unknown,
): Promise<PendaftaranRelawan> {
  const idVolunteer = wajibMasuk(idPengguna);

  const form = bersihkanForm(masukan);
  const galatForm = validasiFormPendaftaran(form);
  if (Object.keys(galatForm).length > 0) {
    throw new GalatValidasi(
      'Data pendaftaran belum lengkap atau tidak valid.',
      400,
      galatForm,
    );
  }

  if (!(await penggunaAda(idVolunteer))) {
    throw new GalatValidasi('Akun tidak dikenal. Silakan masuk kembali.', 401);
  }

  const idPendaftaran = `V-${randomUUID().slice(0, 8)}`;

  try {
    await withTransaction(async (conn) => {
      const project = await kunciProject(conn, idProject);
      if (!project || !project.terpublikasi) {
        throw new GalatValidasi('Project tidak ditemukan.', 404);
      }
      if (project.idPembuat === idVolunteer) {
        throw new GalatValidasi(
          'Anda tidak dapat mendaftar sebagai relawan pada project milik sendiri.',
          403,
        );
      }
      if (!project.pendaftaranDibuka) {
        throw new GalatValidasi(
          'Pendaftaran relawan pada project ini sudah ditutup.',
          409,
        );
      }
      if (await adaPendaftaran(conn, idVolunteer, idProject)) {
        throw new GalatValidasi(PESAN_SUDAH_DAFTAR, 409);
      }
      if ((await hitungDiterima(conn, idProject)) >= project.kuota) {
        throw new GalatValidasi('Kuota relawan project ini sudah penuh.', 409);
      }

      await simpanPendaftaran(conn, {
        idPendaftaran,
        idVolunteer,
        idProject,
        dataDiri: formatDataDiri(form.dataDiri),
        keahlian: formatKeahlian(form.keahlian),
        pengalaman: form.pengalaman,
        ketersediaanJadwal: formatJadwal(form.jadwal),
      });
    });
  } catch (galat) {
    // Lapis pengaman terakhir: UNIQUE KEY (id_volunteer, id_project) di basis data.
    if (galatDuplikat(galat)) {
      throw new GalatValidasi(PESAN_SUDAH_DAFTAR, 409);
    }
    throw galat;
  }

  return {
    idPendaftaran,
    idVolunteer,
    idProject,
    dataDiri: formatDataDiri(form.dataDiri),
    keahlian: formatKeahlian(form.keahlian),
    pengalaman: form.pengalaman,
    ketersediaanJadwal: formatJadwal(form.jadwal),
    status: 'pending',
    tanggalDaftar: new Date(),
    tanggalKeputusan: null,
  };
}

/**
 * UC08: daftar pendaftar sebuah project, hanya untuk pemiliknya (KF21).
 * Project tanpa pendaftar menghasilkan daftar kosong, bukan galat.
 */
export async function daftarPendaftar(
  idPengguna: string | null,
  idProject: string,
): Promise<PendaftaranRelawan[]> {
  const idPemilik = wajibMasuk(idPengguna);

  const project = await cariProject(idProject);
  if (!project) {
    throw new GalatValidasi('Project tidak ditemukan.', 404);
  }
  if (project.idPembuat !== idPemilik) {
    throw new GalatValidasi(
      'Hanya pembuat project yang dapat melihat daftar pendaftar.',
      403,
    );
  }

  return daftarPendaftarProject(idProject);
}

/**
 * UC08: pemilik project menerima atau menolak satu pendaftaran (KF21).
 *
 * Keputusan hanya dapat dijatuhkan pada pendaftaran yang masih `pending`.
 * Menerima juga diperiksa terhadap kuota, karena kuota dapat berubah sejak
 * pendaftaran diajukan.
 */
export async function putuskanPendaftaran(
  idPengguna: string | null,
  idProject: string,
  idPendaftaran: string,
  keputusan: unknown,
): Promise<PendaftaranRelawan> {
  const idPemilik = wajibMasuk(idPengguna);

  if (!isKeputusan(keputusan)) {
    throw new GalatValidasi('Keputusan harus "accepted" atau "rejected".', 400);
  }

  return withTransaction(async (conn) => {
    const project = await kunciProject(conn, idProject);
    if (!project) {
      throw new GalatValidasi('Project tidak ditemukan.', 404);
    }
    if (project.idPembuat !== idPemilik) {
      throw new GalatValidasi(
        'Hanya pembuat project yang dapat memberi keputusan.',
        403,
      );
    }

    const pendaftaran = await ambilPendaftaran(conn, idPendaftaran);
    // Pendaftaran milik project lain diperlakukan sama seperti tidak ada.
    if (!pendaftaran || pendaftaran.idProject !== idProject) {
      throw new GalatValidasi('Pendaftaran tidak ditemukan.', 404);
    }
    if (pendaftaran.status !== 'pending') {
      throw new GalatValidasi(
        'Pendaftaran ini sudah diputuskan dan tidak dapat diubah.',
        409,
      );
    }
    if (
      keputusan === 'accepted' &&
      (await hitungDiterima(conn, idProject)) >= project.kuota
    ) {
      throw new GalatValidasi(
        'Kuota relawan sudah penuh, pendaftaran tidak dapat diterima.',
        409,
      );
    }

    await simpanKeputusan(conn, idPendaftaran, keputusan);
    const diperbarui = await ambilPendaftaran(conn, idPendaftaran);
    if (!diperbarui) {
      throw new Error('Pendaftaran hilang setelah keputusan disimpan.');
    }
    return diperbarui;
  });
}
