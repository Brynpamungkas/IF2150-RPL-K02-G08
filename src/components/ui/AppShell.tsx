'use client';

import { useRouter } from 'next/navigation';
import { Suspense, useState, type ReactNode } from 'react';
import { rupiah } from '@/components/views/DonasiView/format';
import { panggilApi } from '@/components/views/DonasiView/panggilApi';
import type { NavUser } from '@/shared/types';
import { FormTopupView } from '../views/TopupView/FormTopupView';
import { Footer } from './Footer';
import { Navbar } from './Navbar';
import { useSesi } from './SesiContext';
import { SesiProvider } from './SesiProvider';
import { ToastProvider, useToast } from './Toast';

function Shell({ children }: { children: ReactNode }) {
  const { pengguna, bukaAuth, setPengguna, muatUlang } = useSesi();
  const { showToast } = useToast();
  const router = useRouter();
  const [topup, setTopup] = useState(false);

  const user: NavUser | null = pengguna
    ? {
        nama: pengguna.nama,
        email: pengguna.email,
        peran: pengguna.peran,
        saldo: pengguna.saldo ?? 0,
      }
    : null;

  async function keluar() {
    await panggilApi('/api/auth/keluar', { method: 'POST' });
    setPengguna(null);
    showToast("You're logged out.");
    router.push('/');
    router.refresh();
  }

  return (
    <>
      <Suspense
        fallback={
          <div className="nav-shell" role="status">
            <div className="wrap">
              <div className="nav">
                <span className="small muted">Loading navigation…</span>
              </div>
            </div>
          </div>
        }
      >
        <Navbar
          user={user}
          onLoginClick={() => bukaAuth('masuk')}
          onSignupClick={() => bukaAuth('daftar')}
          onTopupClick={() => setTopup(true)}
          onLogoutClick={keluar}
        />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />

      {topup ? (
        <FormTopupView
          onTutup={() => setTopup(false)}
          onBerhasil={(h) => {
            // Saldo navbar berasal dari sesi klien; halaman dari data server.
            void muatUlang();
            router.refresh();
            showToast(
              <>
                Balance topped up by <b>{rupiah(h.nominal)}</b>.
              </>,
              'ok',
            );
          }}
        />
      ) : null}
    </>
  );
}

/** Kerangka bersama semua halaman: navbar, footer, modal, toast, dan sesi login. */
export function AppShell({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      <SesiProvider>
        <Shell>{children}</Shell>
      </SesiProvider>
    </ToastProvider>
  );
}
