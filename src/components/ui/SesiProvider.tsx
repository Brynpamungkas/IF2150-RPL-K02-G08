'use client';

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { AuthModal } from '@/components/views/AuthModal';
import { panggilApi } from '@/components/views/DonasiView/panggilApi';
import type { PenggunaDto } from '@/shared/autentikasi';
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
  /** Aksi yang menunggu login berhasil (lihat NilaiSesi.bukaAuth). */
  const lanjutan = useRef<(() => void) | null>(null);

  const [versiSaldo, setVersiSaldo] = useState(0);

  const muatUlang = useCallback(async () => {
    const res = await panggilApi<PenggunaDto | null>('/api/auth/saya');
    setPengguna(res.ok ? res.data : null);
    setVersiSaldo((v) => v + 1);
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
      bukaAuth: (tab = 'masuk', alasan, aksi) => {
        lanjutan.current = aksi ?? null;
        setAuth({ tab, alasan });
      },
      setPengguna,
      muatUlang,
      versiSaldo,
    }),
    [pengguna, muatUlang, versiSaldo],
  );

  return (
    <SesiContext.Provider value={nilai}>
      {children}
      <AuthModal
        tab={auth?.tab ?? null}
        alasan={auth?.alasan}
        onGantiTab={(tab) => setAuth((a) => ({ tab, alasan: a?.alasan }))}
        onTutup={() => {
          lanjutan.current = null;
          setAuth(null);
        }}
        onBerhasil={() => {
          const aksi = lanjutan.current;
          lanjutan.current = null;
          setAuth(null);
          aksi?.();
        }}
      />
    </SesiContext.Provider>
  );
}
