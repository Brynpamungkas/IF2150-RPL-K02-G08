/**
 * Aturan berkas dokumentasi progres project (UC09, KF24, issue #12).
 *
 * Modul ini murni: tidak menyentuh basis data maupun sistem berkas, sehingga
 * aman diimpor komponen peramban (FormProgresProjectView, C37) maupun kode
 * peladen. Dengan begitu pesan kesalahan yang dilihat pengguna sebelum dan
 * sesudah berkas terkirim selalu sama.
 */

/**
 * Batas ukuran satu berkas dokumentasi.
 * DPPL Tabel 4.2 menetapkan berkas unggahan maksimal 50 MB.
 */
export const DOKUMENTASI_MAKS_BYTE = 50 * 1024 * 1024;

/** Tipe MIME yang diterima, dipetakan ke ekstensi yang dipakai saat menyimpan. */
export const DOKUMENTASI_TIPE_DIIZINKAN: Readonly<Record<string, string>> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'application/pdf': 'pdf',
};

/** Ekstensi yang mungkin dihasilkan penyimpanan, dipakai untuk memvalidasi nama berkas. */
export const DOKUMENTASI_EKSTENSI_DIIZINKAN: readonly string[] = Array.from(
  new Set(Object.values(DOKUMENTASI_TIPE_DIIZINKAN)),
);

/** Nilai atribut `accept` untuk `<input type="file">` pada C37. */
export const DOKUMENTASI_ACCEPT = Object.keys(DOKUMENTASI_TIPE_DIIZINKAN).join(
  ',',
);

/** Keterangan singkat untuk ditampilkan di bawah kolom unggahan. */
export const DOKUMENTASI_PETUNJUK = `Gambar (JPG, PNG, WebP) atau PDF, maksimal ${formatUkuran(
  DOKUMENTASI_MAKS_BYTE,
)}.`;

/** Bagian berkas yang diperiksa. Sengaja bukan `File` agar dapat diuji tanpa peramban. */
export type BerkasDiperiksa = {
  nama: string;
  tipe: string;
  ukuran: number;
};

export type HasilPemeriksaan =
  { valid: true; ekstensi: string } | { valid: false; pesan: string };

/** Mengubah jumlah byte menjadi teks pendek, misalnya `2,4 MB`. */
export function formatUkuran(byte: number): string {
  if (byte < 1024) return `${byte} B`;
  const kb = byte / 1024;
  if (kb < 1024) return `${kb.toFixed(kb < 10 ? 1 : 0).replace('.', ',')} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(mb < 10 ? 1 : 0).replace('.', ',')} MB`;
}

/**
 * Memeriksa satu berkas dokumentasi terhadap batas format dan ukuran (KF24).
 * Mengembalikan ekstensi yang akan dipakai bila lolos, atau pesan yang siap
 * ditampilkan kepada pengguna bila ditolak.
 */
export function periksaBerkasDokumentasi(
  berkas: BerkasDiperiksa,
): HasilPemeriksaan {
  if (!berkas.nama || berkas.ukuran <= 0) {
    return {
      valid: false,
      pesan: 'Berkas dokumentasi kosong atau gagal terbaca.',
    };
  }

  if (berkas.ukuran > DOKUMENTASI_MAKS_BYTE) {
    return {
      valid: false,
      pesan: `Ukuran berkas ${formatUkuran(berkas.ukuran)} melebihi batas ${formatUkuran(
        DOKUMENTASI_MAKS_BYTE,
      )}.`,
    };
  }

  const ekstensi = DOKUMENTASI_TIPE_DIIZINKAN[berkas.tipe];
  if (!ekstensi) {
    return {
      valid: false,
      pesan:
        'Format berkas tidak didukung. Unggah gambar (JPG, PNG, WebP) atau PDF.',
    };
  }

  return { valid: true, ekstensi };
}
