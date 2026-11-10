/**
 * Galat berkode untuk modul donasi (UC06) dan autentikasi (UC01), dipakai bersama client dan server.
 * Berisi kode galat, pesan untuk pengguna (bahasa Inggris, mengikuti prototipe),
 * dan pemetaan ke status HTTP (lihat server/controllers/respons.ts).
 */

export type KodeGalat =
  | 'BELUM_LOGIN'
  | 'VALIDASI'
  | 'EMAIL_TERPAKAI'
  | 'KREDENSIAL_SALAH'
  | 'DILARANG'
  | 'BUKAN_DONATUR'
  | 'PERMINTAAN_TIDAK_VALID'
  | 'NOMINAL_TIDAK_VALID'
  | 'NOMINAL_TOPUP_TIDAK_VALID'
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
  DILARANG: 'You do not have access to this page.',
  BUKAN_DONATUR: 'This account does not have a donation balance.',
  PERMINTAAN_TIDAK_VALID: 'The data sent is incomplete or invalid.',
  NOMINAL_TIDAK_VALID:
    'The donation amount must be more than Rp0 and no more than Rp1,000,000,000.',
  NOMINAL_TOPUP_TIDAK_VALID:
    'The top-up amount must be a whole number from Rp10,000 to Rp10,000,000.',
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
  DILARANG: 403,
  BUKAN_DONATUR: 403,
  PERMINTAAN_TIDAK_VALID: 400,
  NOMINAL_TIDAK_VALID: 422,
  NOMINAL_TOPUP_TIDAK_VALID: 422,
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
