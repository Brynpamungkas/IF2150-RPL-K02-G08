/**
 * Kontrak galat yang dipakai bersama oleh client dan server.
 *
 * Ada dua bentuk galat:
 * - GalatValidasi: galat masukan pengguna dengan status HTTP dan pesan bebas
 *   (dipakai modul relawan dan dokumentasi, lihat server/http.ts).
 * - GalatAplikasi: galat berkode tetap (KodeGalat) beserta pesan untuk pengguna
 *   (bahasa Inggris, mengikuti prototipe) dan pemetaan ke status HTTP
 *   (dipakai modul donasi, lihat server/controllers/respons.ts).
 */

/* ---------- GalatValidasi ---------- */

/**
 * Galat yang disebabkan masukan pengguna, bukan kesalahan sistem.
 *
 * Lapisan service melempar galat ini agar route handler dapat
 * menerjemahkannya menjadi respons 4xx beserta pesan yang aman ditampilkan,
 * sementara galat lain tetap menjadi 500 tanpa membocorkan detail internal.
 */
export class GalatValidasi extends Error {
  /** Kode HTTP yang sesuai, misalnya 400 untuk masukan salah atau 403 untuk akses ditolak. */
  readonly status: number;

  /** Pesan per kolom formulir, bila galat berasal dari validasi formulir. */
  readonly rincian?: Record<string, string>;

  constructor(pesan: string, status = 400, rincian?: Record<string, string>) {
    super(pesan);
    this.name = 'GalatValidasi';
    this.status = status;
    this.rincian = rincian;
  }
}

/** True bila galat berasal dari masukan pengguna. */
export function isGalatValidasi(galat: unknown): galat is GalatValidasi {
  return galat instanceof GalatValidasi;
}

/* ---------- GalatAplikasi (berkode) ---------- */

export type KodeGalat =
  | 'BELUM_LOGIN'
  | 'VALIDASI'
  | 'EMAIL_TERPAKAI'
  | 'KREDENSIAL_SALAH'
  | 'AKUN_NONAKTIF'
  | 'DILARANG'
  | 'BUKAN_DONATUR'
  | 'PERMINTAAN_TIDAK_VALID'
  | 'NOMINAL_TIDAK_VALID'
  | 'SALDO_KURANG'
  | 'TUJUAN_TIDAK_DITEMUKAN'
  | 'TUJUAN_DITUTUP'
  | 'DUPLIKAT'
  | 'TRANSAKSI_GAGAL'
  | 'TIDAK_DITEMUKAN'
  | 'GALAT_SERVER'
  | 'GAGAL_KONEKSI'; // hanya dibuat di sisi client saat fetch gagal

export const PESAN_GALAT: Record<KodeGalat, string> = {
  BELUM_LOGIN: 'Please log in first.',
  VALIDASI: 'Please check the highlighted fields and try again.',
  EMAIL_TERPAKAI: 'This email is already registered.',
  KREDENSIAL_SALAH:
    "The email or password doesn't match. Check them and try again.",
  AKUN_NONAKTIF: 'This account is not active.',
  DILARANG: 'You do not have access to this page.',
  BUKAN_DONATUR: 'This account does not have a donation balance.',
  PERMINTAAN_TIDAK_VALID: 'The data sent is incomplete or invalid.',
  NOMINAL_TIDAK_VALID:
    'The donation amount must be more than Rp0 and no more than Rp1,000,000,000.',
  SALDO_KURANG: 'Insufficient balance for this donation.',
  TUJUAN_TIDAK_DITEMUKAN: 'The campaign or project could not be found.',
  TUJUAN_DITUTUP:
    'This campaign or project has ended or closed, so the donation cannot be processed.',
  DUPLIKAT:
    'This donation request was already processed. Duplicate donation rejected.',
  TRANSAKSI_GAGAL:
    'The whole process was cancelled. Your balance is unchanged and no transaction was recorded.',
  TIDAK_DITEMUKAN: 'The requested data could not be found.',
  GALAT_SERVER: 'Something went wrong on the server. Please try again later.',
  GAGAL_KONEKSI:
    'The connection dropped. Press Try again; your donation will only be processed once.',
};

export const STATUS_HTTP: Record<KodeGalat, number> = {
  BELUM_LOGIN: 401,
  VALIDASI: 400,
  EMAIL_TERPAKAI: 409,
  KREDENSIAL_SALAH: 401,
  AKUN_NONAKTIF: 403,
  DILARANG: 403,
  BUKAN_DONATUR: 403,
  PERMINTAAN_TIDAK_VALID: 400,
  NOMINAL_TIDAK_VALID: 422,
  SALDO_KURANG: 422,
  TUJUAN_TIDAK_DITEMUKAN: 404,
  TUJUAN_DITUTUP: 409,
  DUPLIKAT: 409,
  TRANSAKSI_GAGAL: 500,
  TIDAK_DITEMUKAN: 404,
  GALAT_SERVER: 500,
  GAGAL_KONEKSI: 503,
};

export class GalatAplikasi extends Error {
  constructor(
    readonly kode: KodeGalat,
    pesan: string = PESAN_GALAT[kode],
    /** Nama kolom form yang salah, bila ada (dipakai form login dan daftar). */
    readonly bidang?: string,
  ) {
    super(pesan);
    this.name = 'GalatAplikasi';
  }
}
