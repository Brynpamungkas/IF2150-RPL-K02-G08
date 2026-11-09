'use client';

import { createContext, useContext } from 'react';
import type { PenggunaDto } from '@/shared/autentikasi';

export type TabAuth = 'masuk' | 'daftar';

export interface NilaiSesi {
  /** undefined = masih dimuat, null = tamu. */
  pengguna: PenggunaDto | null | undefined;
  /** Buka modal login/daftar; alasan (opsional) tampil di bawah judul. */
  bukaAuth: (tab?: TabAuth, alasan?: string) => void;
  setPengguna: (p: PenggunaDto | null) => void;
  muatUlang: () => Promise<void>;
}

export const SesiContext = createContext<NilaiSesi | null>(null);

export function useSesi(): NilaiSesi {
  const nilai = useContext(SesiContext);
  if (!nilai) throw new Error('useSesi harus dipakai di dalam SesiProvider.');
  return nilai;
}
