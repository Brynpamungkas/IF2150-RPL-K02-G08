import { randomUUID } from 'node:crypto';

import type { ProgresProject } from '@/models/ProgresProject';
import { withTransaction } from '@/server/db';
import {
  ambilPeran,
  ambilProjectProgres,
  daftarProgresProject,
  simpanPembaruan,
} from '@/server/repositories/progresRepository';
import {
  bolehMelihatDokumentasi,
  simpanDokumentasiProgres,
} from '@/server/services/dokumentasiService';
import { getPenyimpananDokumentasi } from '@/server/storage/dokumentasiStorage';
import { GalatValidasi } from '@/shared/galat';
import {
  periksaBerkasProgres,
  validasiProgres,
  type MentahProgres,
} from '@/shared/progres';

/**
 * Aturan bisnis progres project (UC09, KF23-KF25, issue #36).
 * Dipanggil `ProgresController` (C38).
 */

/** Panjang kolom `progres_project.dokumentasi_url`. */
const BATAS_KOLOM_DOKUMENTASI = 500;

function wajibMasuk(idPengguna: string | null): string {
  if (!idPengguna) {
    throw new GalatValidasi('Silakan masuk terlebih dahulu.', 401);
  }
  return idPengguna;
}

/**
 * UC09: menyimpan satu pembaruan progres.
 *
 * Hanya pembuat project terkait atau Admin Sistem yang boleh (KF25). Berkas
 * dokumentasi disimpan lebih dulu, lalu baris progres dan keadaan terbaru
 * project ditulis dalam satu transaksi (KF23, KF24). Bila penulisan gagal,
 * berkas yang sudah tersimpan dihapus lagi agar tidak ada berkas yatim.
 */
export async function perbaruiProgres(
  idPengguna: string | null,
  idProject: string,
  masukan: { mentah: MentahProgres; berkas: File[] },
): Promise<ProgresProject> {
  const idPembaru = wajibMasuk(idPengguna);

  const hasil = validasiProgres(masukan.mentah);
  const galatForm: Record<string, string> = hasil.valid
    ? {}
    : { ...hasil.galat };
  const galatBerkas = periksaBerkasProgres(
    masukan.berkas.map((berkas) => ({
      nama: berkas.name,
      tipe: berkas.type,
      ukuran: berkas.size,
    })),
  );
  if (galatBerkas) galatForm.dokumentasi = galatBerkas;
  if (!hasil.valid || Object.keys(galatForm).length > 0) {
    throw new GalatValidasi(
      'Data progres belum lengkap atau tidak valid.',
      400,
      galatForm,
    );
  }

  const project = await ambilProjectProgres(idProject);
  if (!project) {
    throw new GalatValidasi('Project tidak ditemukan.', 404);
  }
  if (project.idPembuat !== idPembaru) {
    const peran = await ambilPeran(idPembaru);
    if (peran === null) {
      throw new GalatValidasi(
        'Akun tidak dikenal. Silakan masuk kembali.',
        401,
      );
    }
    if (peran !== 'admin') {
      throw new GalatValidasi(
        'Hanya pembuat project atau Admin Sistem yang dapat memperbarui progres.',
        403,
      );
    }
  }
  if (!project.terpublikasi) {
    throw new GalatValidasi(
      'Progres hanya dapat diperbarui pada project yang sudah terpublikasi.',
      409,
    );
  }

  const tersimpan: { nama: string; url: string }[] = [];
  try {
    for (const berkas of masukan.berkas) {
      tersimpan.push(await simpanDokumentasiProgres(idProject, berkas));
    }

    const dokumentasiUrl =
      tersimpan.length > 0 ? tersimpan.map((b) => b.url).join(', ') : null;
    if (dokumentasiUrl && dokumentasiUrl.length > BATAS_KOLOM_DOKUMENTASI) {
      throw new GalatValidasi(
        'Terlalu banyak berkas dokumentasi dalam satu pembaruan.',
        400,
        { dokumentasi: 'Kurangi jumlah berkas dokumentasi.' },
      );
    }

    const progres: ProgresProject = {
      idProgres: `PRG-${randomUUID().slice(0, 8)}`,
      idProject,
      idPengguna: idPembaru,
      milestone: hasil.data.milestone,
      statusPelaksanaan: hasil.data.statusPelaksanaan,
      catatan: hasil.data.catatan,
      persentase: hasil.data.persentase,
      danaTerpakai: hasil.data.danaTerpakai,
      dokumentasiUrl,
      timestampPembaruan: new Date(),
    };
    await withTransaction((conn) => simpanPembaruan(conn, progres));
    return progres;
  } catch (galat) {
    const penyimpanan = getPenyimpananDokumentasi();
    await Promise.allSettled(
      tersimpan.map((berkas) => penyimpanan.hapus(idProject, berkas.nama)),
    );
    throw galat;
  }
}

/**
 * UC09: riwayat progres sebuah project, yang terbaru lebih dulu.
 * Aturan lihatnya sama dengan dokumentasi: project terpublikasi terbuka untuk
 * umum, selain itu hanya pembuatnya dan Admin Sistem (KF14).
 */
export async function riwayatProgres(
  idPengguna: string | null,
  idProject: string,
): Promise<ProgresProject[]> {
  if (!(await bolehMelihatDokumentasi(idProject, idPengguna))) {
    throw new GalatValidasi(
      'Progres project ini hanya dapat dilihat pembuat project dan Admin Sistem.',
      403,
    );
  }
  return daftarProgresProject(idProject);
}
