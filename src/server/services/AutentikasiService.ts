/**
 * STUB milik Orang 1 (Autentikasi). Hanya kontrak yang dipakai alur donasi:
 * memastikan pengguna sudah login. Ganti dengan implementasi sebenarnya.
 */
import { GalatAplikasi } from '@/shared/galat';
import { UserRepository } from '../repositories/UserRepository';

export interface PenggunaLogin {
  idPengguna: string;
}

export const AutentikasiService = {
  /** @throws BELUM_LOGIN bila token kosong, tidak dikenal, atau sesi sudah kedaluwarsa. */
  async wajibLogin(tokenSesi: string | null): Promise<PenggunaLogin> {
    if (!tokenSesi) throw new GalatAplikasi('BELUM_LOGIN');
    const idPengguna = await UserRepository.getSesiAktif(tokenSesi);
    if (!idPengguna) throw new GalatAplikasi('BELUM_LOGIN');
    return { idPengguna };
  },
};
