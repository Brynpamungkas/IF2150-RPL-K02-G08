'use client';

import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { panggilApi } from '@/components/views/DonasiView/panggilApi';
import type { NavUser } from '@/shared/types';
import { FormTopupView } from '../views/TopupView/FormTopupView';
import { Footer } from './Footer';
import { Navbar } from './Navbar';
import { useSesi } from './SesiContext';
import { SesiProvider } from './SesiProvider';
import { ToastProvider, useToast } from './Toast';

const rupiah = (n: number) => 'Rp' + Math.round(n).toLocaleString('en-US');

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
      <Navbar
        user={user}
        onLoginClick={() => bukaAuth('masuk')}
        onSignupClick={() => bukaAuth('daftar')}
        onTopupClick={() => setTopup(true)}
        onLogoutClick={keluar}
      />
      <main className="flex-1">{children}</main>
      <Footer />

      {topup ? (
        <FormTopupView
          onTutup={() => setTopup(false)}
          onBerhasil={(h) => {
            // Saldo di navbar dibaca dari sesi klien, jadi sesi dimuat ulang;
            // router.refresh() menyegarkan data server di halaman aktif.
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
