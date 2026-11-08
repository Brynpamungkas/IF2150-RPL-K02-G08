'use client';

import { Suspense, useState, type ReactNode } from 'react';
import type { NavUser } from '@/shared/types';
import { Footer } from './Footer';
import { Modal } from './Modal';
import { Navbar } from './Navbar';
import { ToastProvider, useToast } from './Toast';

type ModalAktif = 'login' | 'register' | 'topup' | null;

function Shell({
  user,
  children,
}: {
  user: NavUser | null;
  children: ReactNode;
}) {
  const [modal, setModal] = useState<ModalAktif>(null);
  const { showToast } = useToast();

  const judul =
    modal === 'register'
      ? 'Create an account'
      : modal === 'topup'
        ? 'Top up balance'
        : 'Log in to KlimPooL';

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
          onLoginClick={() => setModal('login')}
          onSignupClick={() => setModal('register')}
          onTopupClick={() => setModal('topup')}
          // TODO(#14): panggil logout sungguhan (akhiriSesi)
          onLogoutClick={() =>
            showToast('Logout belum tersambung (issue #14).', 'info')
          }
        />
      </Suspense>
      <main className="flex-1">{children}</main>
      <Footer />

      {/* TODO(#14): ganti isi modal ini dengan form Log in / Sign up.
          Modal top up diisi oleh pemilik fitur donasi/saldo. */}
      <Modal
        open={modal !== null}
        onClose={() => setModal(null)}
        title={judul}
        subtitle={
          modal === 'register'
            ? 'One account to donate, volunteer, and organize actions.'
            : undefined
        }
      >
        <p className="muted">
          {modal === 'topup'
            ? 'Form top up belum dikerjakan.'
            : 'Form login dan pendaftaran dikerjakan di issue #14.'}
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
