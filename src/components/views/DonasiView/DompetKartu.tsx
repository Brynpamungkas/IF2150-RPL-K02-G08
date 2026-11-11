'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '../../ui/Toast';
import { FormTopupView } from '../TopupView/FormTopupView';
import { rupiah } from './format';

interface DompetKartuProps {
  /** Saldo donasi donatur yang sedang login (C04 Donatur). */
  saldoDonasi: number;
  /** Dana yang masuk ke aksi yang ia selenggarakan. Dipisah dari saldo donasi. */
  saldoGalang: number;
}

/**
 * Kartu dompet pada halaman Account (KF27).
 * Tombol "Top up" membuka modal top-up simulasi (Tabel B.1 baris 1); setelah berhasil
 * saldo pada kartu langsung diganti dengan saldo terbaru dari server.
 */
export function DompetKartu({ saldoDonasi, saldoGalang }: DompetKartuProps) {
  const [saldo, setSaldo] = useState(saldoDonasi);
  const [topupTerbuka, setTopupTerbuka] = useState(false);
  const { showToast } = useToast();
  const router = useRouter();

  return (
    <div className="mt-7 grid gap-4 md:grid-cols-2">
      <section className="grid gap-2 rounded-[20px] border-[1.5px] border-[#2D4F2D] bg-[#2D4F2D] p-[22px] text-white">
        <h2 className="text-base font-extrabold text-[#D7E2D2]">
          Donation balance
        </h2>
        <p className="font-serif text-4xl leading-[1.1]" aria-live="polite">
          {rupiah(saldo)}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-[15px] text-[#D7E2D2]">Used for donations</span>
          <button
            type="button"
            onClick={() => setTopupTerbuka(true)}
            className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full border-[1.5px] border-white bg-white px-[18px] text-[15px] font-extrabold text-[#2D4F2D] hover:bg-[#E9EFE4]"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="size-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            Top up
          </button>
        </div>
      </section>

      <section className="grid gap-2 rounded-[20px] border-[1.5px] border-[#DCE0D6] bg-white p-[22px]">
        <h2 className="text-base font-extrabold">Fundraising balance</h2>
        <p className="font-serif text-4xl leading-[1.1]">
          {rupiah(saldoGalang)}
        </p>
        <p className="text-[15px] text-[#4A544B]">
          Funds donated to actions you organize. Kept separate from your
          donation balance.
        </p>
      </section>

      {topupTerbuka ? (
        <FormTopupView
          onTutup={() => setTopupTerbuka(false)}
          onBerhasil={(h) => {
            setSaldo(h.saldoSesudah);
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
    </div>
  );
}
