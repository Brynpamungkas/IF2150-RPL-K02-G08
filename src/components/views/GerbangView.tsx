'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';
import { useSesi } from '@/components/ui/SesiContext';

const IkonGembok = () => (
  <svg
    width="34"
    height="34"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    aria-hidden="true"
  >
    <rect x="5" y="10" width="14" height="10" rx="2" />
    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
  </svg>
);

/** Halaman "harus login": tampil saat pengunjung membuka halaman yang butuh akun. */
export function HarusLoginView({ pesan }: { pesan: string }) {
  const { bukaAuth } = useSesi();
  return (
    <div className="gate">
      <div
        className="ic"
        style={{ background: 'var(--sage)', color: 'var(--forest)' }}
      >
        <IkonGembok />
      </div>
      <h1>{pesan}</h1>
      <p className="lead">This page requires a KlimPooL account.</p>
      <div className="form-actions" style={{ justifyContent: 'center' }}>
        <button className="btn btn-primary" onClick={() => bukaAuth('masuk')}>
          Log in
        </button>
        <button className="btn btn-ghost" onClick={() => bukaAuth('daftar')}>
          Create an account
        </button>
      </div>
    </div>
  );
}

/** Halaman "akses ditolak": pengguna sudah login tetapi perannya tidak cukup. */
export function AksesDitolakView({
  judul,
  children,
  kembaliKe = '/',
}: {
  judul: string;
  children?: ReactNode;
  kembaliKe?: string;
}) {
  return (
    <div className="gate">
      <div className="ic">
        <IkonGembok />
      </div>
      <h1>{judul}</h1>
      {children && <p className="lead">{children}</p>}
      <Link className="btn btn-primary" href={kembaliKe}>
        Go back
      </Link>
    </div>
  );
}
