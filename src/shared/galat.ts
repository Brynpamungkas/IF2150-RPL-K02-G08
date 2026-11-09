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
