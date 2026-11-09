'use client';

import { useState, type ReactNode } from 'react';
import type { HasilDonasi, JenisTujuan } from '@/shared/donasi';
import { useToast } from '../../ui/Toast';
import { DetailBuktiTransaksiView } from './DetailBuktiTransaksiView';
import { FormDonasiView } from './FormDonasiView';
import { rupiah } from './format';

interface PropsAlurDonasi {
  jenisTujuan: JenisTujuan;
  idTujuan: string;
  /** Isi tombol; bawaan: ikon hati + "Donate now". */
  children?: ReactNode;
  className?: string;
  /** Setelah donasi berhasil, mis. untuk memperbarui saldo navbar dan dana terkumpul. */
  onSelesai?: (hasil: HasilDonasi) => void;
  /** TODO(#14): sambungkan ke modal login (I-02). */
  onPerluLogin?: () => void;
  /** Sambungkan saat modal top up (I-07) tersedia. */
  onTopup?: () => void;
  /** Sambungkan saat halaman My activity (KF27) tersedia. */
  onLihatRiwayat?: () => void;
}

function IkonHati() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
    </svg>
  );
}

/**
 * Alur UC06 lengkap untuk dipasang di halaman detail campaign/project:
 * tombol "Donate now" (tekanDonasi) -> FormDonasiView (C30) -> DetailBuktiTransaksiView (C31).
 */
export function AlurDonasi({
  jenisTujuan,
  idTujuan,
  children,
  className = 'btn btn-primary btn-block',
  onSelesai,
  onPerluLogin,
  onTopup,
  onLihatRiwayat,
}: PropsAlurDonasi) {
  const [formTerbuka, setFormTerbuka] = useState(false);
  const [hasil, setHasil] = useState<HasilDonasi | null>(null);
  const { showToast } = useToast();

  // tekanDonasi (C30): menerima pilihan tujuan donasi dan meminta formulir.
  function tekanDonasi() {
    setFormTerbuka(true);
  }

  function selesaiDonasi(h: HasilDonasi, nominal: number) {
    setFormTerbuka(false);
    setHasil(h);
    onSelesai?.(h);
    showToast(
      <>
        Donation of <b>{rupiah(nominal)}</b> recorded.
      </>,
      'ok',
    );
  }

  return (
    <>
      <button type="button" className={className} onClick={tekanDonasi}>
        {children ?? (
          <>
            <IkonHati /> Donate now
          </>
        )}
      </button>

      {formTerbuka ? (
        <FormDonasiView
          jenisTujuan={jenisTujuan}
          idTujuan={idTujuan}
          onTutup={() => setFormTerbuka(false)}
          onBerhasil={selesaiDonasi}
          onPerluLogin={onPerluLogin}
          onTopup={onTopup}
        />
      ) : null}

      {hasil ? (
        <DetailBuktiTransaksiView
          key={hasil.idTransaksi}
          idTransaksi={hasil.idTransaksi}
          ringkasan={hasil}
          onTutup={() => setHasil(null)}
          onLihatRiwayat={onLihatRiwayat}
        />
      ) : null}
    </>
  );
}
