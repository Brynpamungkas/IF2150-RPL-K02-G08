'use client';

import { useRouter } from 'next/navigation';
import { useState, type ReactNode } from 'react';
import type { NavUser } from '@/shared/types';
import { FormTopupView } from '../views/TopupView/FormTopupView';
import { Footer } from './Footer';
import { Modal } from './Modal';
import { Navbar } from './Navbar';
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

  return (
    <>
      <Navbar
        user={user}
        onLoginClick={() => setModal('login')}
        onSignupClick={() => setModal('register')}
        onTopupClick={() => setModal('topup')}
        // TODO(#14): panggil logout sungguhan (akhiriSesi)
        onLogoutClick={() =>
          showToast('Logout belum tersambung (issue #14).', 'info')
        }
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
      </Modal>
    </>
  );
}

/**
 * Kerangka bersama semua halaman: navbar, footer, modal, dan toast.
 * Dipasang sekali di app/layout.tsx.
 */
export function AppShell({
  user,
  children,
}: {
  user: NavUser | null;
  children: ReactNode;
}) {
  return (
    <ToastProvider>
      <Shell user={user}>{children}</Shell>
    </ToastProvider>
  );
}
