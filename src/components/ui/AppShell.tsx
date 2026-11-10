'use client';

import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import { panggilApi } from '@/components/views/DonasiView/panggilApi';
import type { NavUser } from '@/shared/types';
import { FormTopupView } from '../views/TopupView/FormTopupView';
import { Footer } from './Footer';
import { Modal } from './Modal';
import { Navbar } from './Navbar';
import { useSesi } from './SesiContext';
import { SesiProvider } from './SesiProvider';
import { ToastProvider, useToast } from './Toast';

type ModalAktif = 'login' | 'register' | 'topup' | null;

const rupiah = (n: number) => 'Rp' + Math.round(n).toLocaleString('en-US');

function Shell({
  user,
  children,
}: {
  user: NavUser | null;
  children: ReactNode;
}) {
  const [modal, setModal] = useState<ModalAktif>(null);
  const { showToast } = useToast();
  const router = useRouter();

  const judul =
    modal === 'register' ? 'Create an account' : 'Log in to KlimPooL';
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

      {modal === 'topup' ? (
        <FormTopupView
          onTutup={() => setModal(null)}
          onBerhasil={(h) => {
            // Muat ulang data server (mis. saldo di navbar) tanpa reload penuh.
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

      {/* TODO(#14): ganti isi modal ini dengan form Log in / Sign up. */}
      <Modal
        open={modal === 'login' || modal === 'register'}
        onClose={() => setModal(null)}
        title={judul}
        subtitle={
          modal === 'register'
            ? 'One account to donate, volunteer, and organize actions.'
            : undefined
        }
      >
        <p className="muted">
          Form login dan pendaftaran dikerjakan di issue #14.
        </p>
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
