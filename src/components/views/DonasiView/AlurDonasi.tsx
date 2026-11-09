'use client';

import { useContext, useState, type ReactNode } from 'react';
import type { HasilDonasi, JenisTujuan } from '@/shared/donasi';
import { SesiContext, useWajibLogin } from '../../ui/SesiContext';
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
  /**
   * Bawaan: buka modal login (I-02), lalu buka lagi formulir setelah login
   * berhasil. Isi hanya bila halaman butuh perilaku lain.
   */
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
  const sesi = useContext(SesiContext);
  const wajibLogin = useWajibLogin();
  const PESAN_LOGIN = 'Log in to donate. Your donation form opens right after.';

  // tekanDonasi (C30): menerima pilihan tujuan donasi dan meminta formulir.
  // Tamu diminta login dulu, lalu formulir terbuka otomatis (#15).
  function tekanDonasi() {
    wajibLogin(PESAN_LOGIN, () => setFormTerbuka(true));
  }

  // Server menjawab BELUM_LOGIN (mis. sesi kedaluwarsa): login, lalu lanjutkan.
  const perluLogin =
    onPerluLogin ??
    (sesi
      ? () => {
          setFormTerbuka(false);
          sesi.bukaAuth('masuk', PESAN_LOGIN, () => setFormTerbuka(true));
        }
      : undefined);

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
          onPerluLogin={perluLogin}
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
