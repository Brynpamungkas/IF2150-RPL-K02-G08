'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/Modal';
import type { TabAuth } from '@/components/ui/SesiContext';
import { FormLoginView } from './FormLoginView';
import { FormPendaftaranView } from './FormPendaftaranView';

interface AuthModalProps {
  tab: TabAuth | null;
  alasan?: string;
  onGantiTab: (tab: TabAuth) => void;
  /** Modal ditutup tanpa login. */
  onTutup: () => void;
  /** Login/daftar berhasil; menjalankan aksi lanjutan bila ada. */
  onBerhasil: () => void;
}

/** Modal Log in / Sign up dengan dua tab. */
export function AuthModal({
  tab,
  alasan,
  onGantiTab,
  onTutup,
  onBerhasil,
}: AuthModalProps) {
  const [emailAwal, setEmailAwal] = useState('');
  const daftar = tab === 'daftar';

  return (
    <Modal
      open={tab !== null}
      onClose={onTutup}
      title={daftar ? 'Create an account' : 'Log in to KlimPooL'}
      subtitle={
        alasan ??
        (daftar
          ? 'One account to donate, volunteer, and organize actions.'
          : undefined)
      }
    >
      <div className="auth-tabs" role="tablist">
        {(['masuk', 'daftar'] as const).map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={tab === t}
            className={tab === t ? 'on' : ''}
            onClick={() => onGantiTab(t)}
          >
            {t === 'masuk' ? 'Log in' : 'Sign up'}
          </button>
        ))}
      </div>
      {daftar ? (
        <FormPendaftaranView
          onSelesai={onBerhasil}
          onMasukDenganEmail={(email) => {
            setEmailAwal(email);
            onGantiTab('masuk');
          }}
        />
      ) : (
        <FormLoginView emailAwal={emailAwal} onSelesai={onBerhasil} />
      )}
    </Modal>
  );
}
