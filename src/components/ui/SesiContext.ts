'use client';

import { useCallback, useContext, createContext } from 'react';
import type { PenggunaDto } from '@/shared/autentikasi';

export type TabAuth = 'masuk' | 'daftar';

export interface NilaiSesi {
  /** undefined = masih dimuat, null = tamu. */
  pengguna: PenggunaDto | null | undefined;
  /**
   * Buka modal login/daftar. `alasan` (opsional) tampil di bawah judul.
   * `lanjutan` (opsional) dijalankan setelah login/daftar berhasil, agar
   * pengguna langsung melanjutkan aksi yang tadi memerlukan login (#15).
   * Bila modal ditutup tanpa login, `lanjutan` dibuang.
   */
  bukaAuth: (tab?: TabAuth, alasan?: string, lanjutan?: () => void) => void;
  setPengguna: (p: PenggunaDto | null) => void;
  muatUlang: () => Promise<void>;
}

export const SesiContext = createContext<NilaiSesi | null>(null);

export function useSesi(): NilaiSesi {
  const nilai = useContext(SesiContext);
  if (!nilai) throw new Error('useSesi harus dipakai di dalam SesiProvider.');
  return nilai;
}

/**
 * Untuk aksi yang butuh login (donasi, daftar relawan, dsb.):
 *
 *   const wajibLogin = useWajibLogin();
 *   <button onClick={() => wajibLogin('Log in to volunteer.', bukaForm)}>
 *
 * Sudah login: `aksi` langsung jalan. Tamu: modal login terbuka, lalu `aksi`
 * jalan setelah login berhasil. Selama status sesi masih dimuat, `aksi`
 * langsung jalan; server tetap menolak lewat BELUM_LOGIN bila perlu.
 * Di luar SesiProvider (mis. pengujian), `aksi` langsung jalan.
 */
export function useWajibLogin(): (alasan: string, aksi: () => void) => void {
  const sesi = useContext(SesiContext);
  return useCallback(
    (alasan, aksi) => {
      if (sesi?.pengguna === null) sesi.bukaAuth('masuk', alasan, aksi);
      else aksi();
    },
    [sesi],
  );
}
