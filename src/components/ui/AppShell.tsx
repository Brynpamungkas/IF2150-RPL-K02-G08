'use client';

import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { panggilApi } from '@/components/views/panggilApi';
import type { NavUser } from '@/shared/types';
import { Footer } from './Footer';
import { Modal } from './Modal';
import { Navbar } from './Navbar';
import { useSesi } from './SesiContext';
import { SesiProvider } from './SesiProvider';
import { ToastProvider, useToast } from './Toast';

function Shell({ children }: { children: ReactNode }) {
  const { pengguna, bukaAuth, setPengguna } = useSesi();
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
    await panggilApi('/api/auth/keluar', 'POST');
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

      <Modal
        open={topup}
        onClose={() => setTopup(false)}
        title="Top up balance"
      >
        <p className="muted">Form top up belum dikerjakan.</p>
      </Modal>
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
