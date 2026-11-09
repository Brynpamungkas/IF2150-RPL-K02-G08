'use client';

import { createPortal } from 'react-dom';
import type { BuktiDTO } from '@/shared/donasi';
import { barisBukti, judulCetak } from './barisBukti';
import { waktuLokal } from './format';

/**
 * Lembar khusus cetak (AC3). Di-render lewat portal sebagai anak langsung <body>;
 * tersembunyi di layar dan hanya tampil di @media print (lihat globals.css),
 * sehingga hanya lembar ini yang tercetak, bukan modal atau halaman di belakangnya.
 * Hanya dipasang setelah data bukti ada, jadi tidak pernah dirender di server.
 */
export function LembarCetakBukti({ bukti }: { bukti: BuktiDTO }) {
  return createPortal(
    <div className="lembar-cetak" role="document" aria-hidden="true">
      <header>
        <p className="lembar-merek">KlimPooL</p>
        <h1>Donation receipt</h1>
      </header>
      <dl>
        <dt>Receipt ID</dt>
        <dd>{bukti.idBukti}</dd>
        {barisBukti(bukti).map((b) => (
          <div key={b.label} className="contents">
            <dt>{b.label}</dt>
            <dd>{b.nilai}</dd>
          </div>
        ))}
      </dl>
      <p className="lembar-catatan">
        Printed on {waktuLokal(new Date().toISOString())}. This receipt is
        generated automatically by KlimPooL.
      </p>
    </div>,
    document.body,
  );
}

/** Membuka dialog cetak browser (AC3) dengan judul dokumen sebagai nama berkas saran. */
export function cetakBukti(bukti: BuktiDTO): void {
  const judulAsli = document.title;
  document.title = judulCetak(bukti);
  window.addEventListener(
    'afterprint',
    () => {
      document.title = judulAsli;
    },
    { once: true },
  );
  window.print();
}

function IkonPrinter() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="18"
      height="18"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 9V3h12v6M6 18H4a1 1 0 0 1-1-1v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6a1 1 0 0 1-1 1h-2" />
      <path d="M6 14h12v7H6z" />
    </svg>
  );
}

/** Tombol "Print receipt". Gaya bawaan ghost; varian arsip memakai hijau (btn-primary). */
export function TombolCetakBukti({
  bukti,
  className = 'btn btn-ghost',
}: {
  bukti: BuktiDTO;
  className?: string;
}) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => cetakBukti(bukti)}
    >
      <IkonPrinter /> Print receipt
    </button>
  );
}
