'use client';

import Link from 'next/link';
import { KartuBukti } from './KartuBukti';
import { LembarCetakBukti, TombolCetakBukti } from './LembarCetakBukti';
import { useBukti } from './useBukti';

/**
 * Halaman bukti transaksi (C31) dengan URL tetap /donasi/bukti/:idTransaksi,
 * untuk dibuka ulang dari riwayat donasi dan dicetak.
 */
export function HalamanBuktiView({ idTransaksi }: { idTransaksi: string }) {
  const keadaan = useBukti(idTransaksi);

  return (
    <div className="bg-[var(--cream)] px-5 py-10">
      <article className="mx-auto grid max-w-[640px] gap-5 rounded-[20px] border-[1.5px] border-[var(--line)] bg-white p-7">
        <Link href="/history" className="link-arrow">
          <span aria-hidden="true">←</span> Back to my activity
        </Link>
        <h1 className="font-serif text-[clamp(30px,5vw,40px)] font-medium leading-[1.1] tracking-[-0.02em]">
          Donation receipt
        </h1>

        {keadaan.status === 'memuat' ? (
          <p className="muted">Loading receipt…</p>
        ) : null}

        {keadaan.status === 'gagal' ? (
          <div className="notice bad" role="alert">
            <strong>Receipt not available</strong>
            <span>{keadaan.galat.pesan}</span>
          </div>
        ) : null}

        {keadaan.status === 'ada' ? (
          <>
            <KartuBukti bukti={keadaan.bukti} varian="arsip" />
            <div className="form-actions justify-end">
              <TombolCetakBukti
                bukti={keadaan.bukti}
                className="btn btn-primary"
              />
            </div>
            <LembarCetakBukti bukti={keadaan.bukti} />
          </>
        ) : null}
      </article>
    </div>
  );
}
