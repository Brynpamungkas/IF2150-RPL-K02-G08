'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { AuthModal } from '@/components/views/AuthModal';
import { panggilApi } from '@/components/views/panggilApi';
import type { PenggunaDto } from '@/shared/dto';
import { SesiContext, type NilaiSesi, type TabAuth } from './SesiContext';

/**
 * Layout bersifat statis (cacheComponents), jadi status login dibaca di klien
 * lewat GET /api/auth/saya. Keputusan akses yang sebenarnya ada di server (guard.ts).
 */
export function SesiProvider({ children }: { children: ReactNode }) {
  const [pengguna, setPengguna] = useState<PenggunaDto | null | undefined>(
    undefined,
  );
  const [auth, setAuth] = useState<{ tab: TabAuth; alasan?: string } | null>(
    null,
  );

  const muatUlang = useCallback(async () => {
    const res = await panggilApi<PenggunaDto | null>('/api/auth/saya');
    setPengguna(res.ok ? res.data : null);
  }, []);

  useEffect(() => {
    let batal = false;
    panggilApi<PenggunaDto | null>('/api/auth/saya').then((res) => {
      if (!batal) setPengguna(res.ok ? res.data : null);
    });
    return () => {
      batal = true;
    };
  }, []);

  const nilai = useMemo<NilaiSesi>(
    () => ({
      pengguna,
      bukaAuth: (tab = 'masuk', alasan) => setAuth({ tab, alasan }),
      setPengguna,
      muatUlang,
    }),
    [pengguna, muatUlang],
  );

  return (
    <SesiContext.Provider value={nilai}>
      {children}
      <AuthModal
        tab={auth?.tab ?? null}
        alasan={auth?.alasan}
        onGantiTab={(tab) => setAuth({ tab })}
        onTutup={() => setAuth(null)}
      />
    </SesiContext.Provider>
  );
}
