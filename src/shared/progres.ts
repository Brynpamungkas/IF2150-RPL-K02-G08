import {
  periksaBerkasDokumentasi,
  type BerkasDiperiksa,
} from '@/shared/dokumentasi';

/**
 * Aturan pembaruan progres project (UC09, KF23-KF25, issue #36).
 *
 * Modul ini murni, sehingga dipakai bersama oleh peladen (ProgresController,
 * C38) dan peramban (FormProgresProjectView, C37): pesan kesalahan sebelum dan
 * sesudah formulir terkirim selalu sama.
 */

/**
 * Status pelaksanaan, mengikuti enum `project.status_pelaksanaan` dan
 * `progres_project.status_pelaksanaan`. Empat nilai ini keputusan tim.
 */
export const STATUS_PELAKSANAAN = [
  'persiapan',
  'berjalan',
  'ditunda',
  'selesai',
] as const;
export type StatusPelaksanaan = (typeof STATUS_PELAKSANAAN)[number];

/**
 * Kolom `dokumentasi_url` hanya 500 karakter dan menampung semua alamat berkas
 * satu pembaruan, jadi jumlah berkas dibatasi.
 */
export const BATAS_BERKAS_PROGRES = 5;
export const BATAS_PROGRES = {
  milestone: 255,
  catatan: 2000,
  danaTerpakai: 9_999_999_999_999.99,
} as const;

/** Isian formulir apa adanya (semua teks), sebelum divalidasi. */
export type MentahProgres = {
  milestone: string;
  statusPelaksanaan: string;
  catatan: string;
  persentase: string;
  danaTerpakai: string;
};

/** Isian yang sudah valid dan bertipe. */
export type MasukanProgres = {
  milestone: string;
  statusPelaksanaan: StatusPelaksanaan;
  catatan: string | null;
  persentase: number | null;
  danaTerpakai: number | null;
};

export type KolomProgres =
  | 'milestone'
  | 'statusPelaksanaan'
  | 'catatan'
  | 'persentase'
  | 'danaTerpakai'
  | 'dokumentasi';

export type GalatFormProgres = Partial<Record<KolomProgres, string>>;

/** Satu pembaruan progres sebagaimana dikirim API kepada peramban. */
export type PembaruanProgresDto = {
  idProgres: string;
  idProject: string;
  idPengguna: string;
  milestone: string;
  statusPelaksanaan: StatusPelaksanaan;
  catatan: string;
  persentase: number | null;
  danaTerpakai: number | null;
  /** Alamat berkas dokumentasi, kosong bila tidak ada. */
  dokumentasi: string[];
  timestampPembaruan: string;
};

function teks(nilai: FormDataEntryValue | null): string {
  return typeof nilai === 'string' ? nilai.trim() : '';
}

/**
 * Membaca isian dan berkas dari `FormData` (multipart). Kolom berkas kosong
 * yang dikirim peramban (ukuran 0) dibuang.
 */
export function bacaFormProgres(formData: FormData): {
  mentah: MentahProgres;
  berkas: File[];
} {
  return {
    mentah: {
      milestone: teks(formData.get('milestone')),
      statusPelaksanaan: teks(formData.get('statusPelaksanaan')),
      catatan: teks(formData.get('catatan')),
      persentase: teks(formData.get('persentase')),
      danaTerpakai: teks(formData.get('danaTerpakai')),
    },
    berkas: formData
      .getAll('dokumentasi')
      .filter((nilai): nilai is File => typeof nilai !== 'string')
      .filter((berkas) => berkas.size > 0 || berkas.name !== ''),
  };
}

export function isStatusPelaksanaan(nilai: string): nilai is StatusPelaksanaan {
  return (STATUS_PELAKSANAAN as readonly string[]).includes(nilai);
}

/**
 * Memeriksa isian pembaruan progres (KF23). Milestone dan status pelaksanaan
 * wajib; catatan, persentase, dan dana terpakai boleh kosong.
 */
export function validasiProgres(
  mentah: MentahProgres,
):
  | { valid: true; data: MasukanProgres }
  | { valid: false; galat: GalatFormProgres } {
  const galat: GalatFormProgres = {};

  if (!mentah.milestone) galat.milestone = 'Milestone wajib diisi.';
  else if (mentah.milestone.length > BATAS_PROGRES.milestone)
    galat.milestone = `Milestone maksimal ${BATAS_PROGRES.milestone} karakter.`;

  if (!isStatusPelaksanaan(mentah.statusPelaksanaan))
    galat.statusPelaksanaan = `Pilih salah satu status pelaksanaan: ${STATUS_PELAKSANAAN.join(', ')}.`;

  if (mentah.catatan.length > BATAS_PROGRES.catatan)
    galat.catatan = `Catatan maksimal ${BATAS_PROGRES.catatan} karakter.`;

  let persentase: number | null = null;
  if (mentah.persentase) {
    persentase = /^\d{1,3}$/.test(mentah.persentase)
      ? Number(mentah.persentase)
      : Number.NaN;
    if (Number.isNaN(persentase) || persentase > 100) {
      galat.persentase = 'Persentase harus berupa bilangan bulat 0 sampai 100.';
    }
  }

  let danaTerpakai: number | null = null;
  if (mentah.danaTerpakai) {
    danaTerpakai = /^\d{1,13}(\.\d{1,2})?$/.test(mentah.danaTerpakai)
      ? Number(mentah.danaTerpakai)
      : Number.NaN;
    if (
      Number.isNaN(danaTerpakai) ||
      danaTerpakai > BATAS_PROGRES.danaTerpakai
    ) {
      galat.danaTerpakai =
        'Dana terpakai harus berupa angka tanpa pemisah ribuan, misalnya 9800000.';
    }
  }

  if (
    Object.keys(galat).length > 0 ||
    !isStatusPelaksanaan(mentah.statusPelaksanaan)
  ) {
    return { valid: false, galat };
  }

  return {
    valid: true,
    data: {
      milestone: mentah.milestone,
      statusPelaksanaan: mentah.statusPelaksanaan,
      catatan: mentah.catatan || null,
      persentase,
      danaTerpakai,
    },
  };
}

/**
 * Memeriksa semua berkas dokumentasi sekaligus sebelum ada yang disimpan,
 * supaya satu berkas yang salah tidak meninggalkan berkas lain yatim di disk.
 * Mengembalikan pesan kesalahan, atau `undefined` bila semuanya lolos.
 */
export function periksaBerkasProgres(
  berkas: BerkasDiperiksa[],
): string | undefined {
  if (berkas.length > BATAS_BERKAS_PROGRES) {
    return `Maksimal ${BATAS_BERKAS_PROGRES} berkas dokumentasi per pembaruan.`;
  }
  for (const satu of berkas) {
    const hasil = periksaBerkasDokumentasi(satu);
    if (!hasil.valid) return `${satu.nama || 'Berkas'}: ${hasil.pesan}`;
  }
  return undefined;
}
