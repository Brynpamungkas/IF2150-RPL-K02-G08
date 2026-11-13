import type { ReactNode } from 'react';
import Link from 'next/link';
import { GalatValidasi } from '@/shared/galat';

/** Galat akses yang aman ditampilkan; gangguan database tetap menuju error boundary Next. */
export async function halamanAksi(muat: () => Promise<ReactNode>) {
  try {
    return await muat();
  } catch (error) {
    if (!(error instanceof GalatValidasi)) throw error;
    return (
      <div className="wrap py-12">
        <h1>Akses aksi</h1>
        <p role="alert" className="notice warn">
          {error.message}
        </p>
        {error.status === 401 && (
          <p>Gunakan tombol Log in untuk masuk dengan akun yang sesuai.</p>
        )}
        <Link href="/" className="btn btn-light">
          Kembali ke beranda
        </Link>
      </div>
    );
  }
}
