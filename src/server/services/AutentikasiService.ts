/**
 * STUB milik modul Autentikasi (#14). Hanya kontrak yang dipakai alur donasi:
 * memastikan pengguna sudah login. Memakai getIdPenggunaSaatIni() yang sama dengan
 * modul relawan, sehingga penggantian ke sesi sungguhan cukup dilakukan di sesiSementara.ts.
 */
import { GalatAplikasi } from '@/shared/galatDonasi';
import { getIdPenggunaSaatIni } from '../auth/sesiSementara';

export interface PenggunaLogin {
  idPengguna: string;
}

export const AutentikasiService = {
  /** @throws BELUM_LOGIN bila belum login. TODO(#14): ganti dengan sesi sungguhan. */
  async wajibLogin(): Promise<PenggunaLogin> {
    const idPengguna = await getIdPenggunaSaatIni();
    if (!idPengguna) throw new GalatAplikasi('BELUM_LOGIN');
    return { idPengguna };
  },
};
