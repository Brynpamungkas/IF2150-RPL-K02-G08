export type KodeGalat =
  | 'VALIDASI'
  | 'EMAIL_TERPAKAI'
  | 'KREDENSIAL_SALAH'
  | 'AKUN_NONAKTIF'
  | 'BELUM_LOGIN'
  | 'DILARANG'
  | 'INTERNAL';

export const STATUS_HTTP: Record<KodeGalat, number> = {
  VALIDASI: 400,
  EMAIL_TERPAKAI: 409,
  KREDENSIAL_SALAH: 401,
  AKUN_NONAKTIF: 403,
  BELUM_LOGIN: 401,
  DILARANG: 403,
  INTERNAL: 500,
};

/** Galat yang aman ditampilkan ke pengguna; galat lain dianggap bug server. */
export class GalatAplikasi extends Error {
  readonly kode: KodeGalat;
  /** Nama kolom form yang salah, bila ada. */
  readonly bidang?: string;

  constructor(kode: KodeGalat, pesan: string, bidang?: string) {
    super(pesan);
    this.name = 'GalatAplikasi';
    this.kode = kode;
    this.bidang = bidang;
  }
}
