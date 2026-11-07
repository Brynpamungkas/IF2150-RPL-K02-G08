import { GalatAplikasi } from '@/shared/galat';

/** C12 Akun */
export interface Akun {
  idAkun: string;
  idPengguna: string;
  email: string;
  passwordHash: string;
  statusAkun: 'aktif' | 'nonaktif';
  tanggalDibuat: Date;
}

const POLA_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PANJANG_NAMA_MIN = 3;
export const PANJANG_PASSWORD_MIN = 8;
export const PANJANG_PASSWORD_MAKS = 72; // batas masukan bcrypt

export const PESAN_EMAIL_SALAH =
  'That email format looks wrong. Example: name@email.com';

/** "Budi@Mail.com " dan "budi@mail.com" adalah akun yang sama. */
export function normalisasiEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function formatEmailValid(email: string): boolean {
  return email !== '' && email.length <= 255 && POLA_EMAIL.test(email);
}

export function validasiKelengkapanInput(
  nama: string,
  email: string,
  password: string,
): void {
  const namaBersih = nama.trim();
  if (namaBersih.length < PANJANG_NAMA_MIN) {
    throw new GalatAplikasi(
      'VALIDASI',
      `Enter your full name, at least ${PANJANG_NAMA_MIN} letters.`,
      'nama',
    );
  }
  if (namaBersih.length > 100) {
    throw new GalatAplikasi('VALIDASI', 'Full name is too long.', 'nama');
  }
  if (!formatEmailValid(normalisasiEmail(email))) {
    throw new GalatAplikasi('VALIDASI', PESAN_EMAIL_SALAH, 'email');
  }
  if (password.length < PANJANG_PASSWORD_MIN) {
    throw new GalatAplikasi(
      'VALIDASI',
      `Passwords need at least ${PANJANG_PASSWORD_MIN} characters.`,
      'password',
    );
  }
  if (password.length > PANJANG_PASSWORD_MAKS) {
    throw new GalatAplikasi('VALIDASI', 'Password is too long.', 'password');
  }
}
