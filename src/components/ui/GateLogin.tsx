'use client';

import { useSesi } from './SesiContext';

interface GateLoginProps {
  /** Judul halaman penghalang, mis. "Log in to see your activity". */
  pesan: string;
}

/**
 * Halaman penghalang untuk pengguna yang belum login (acuan: gateLogin di
 * prototipe). Tombolnya membuka modal auth; setelah login, halaman dirender
 * ulang (router.refresh di formulir) sehingga isinya langsung tampil.
 */
export function GateLogin({ pesan }: GateLoginProps) {
  const { bukaAuth } = useSesi();
  return (
    <div className="mx-auto grid max-w-[640px] justify-items-center gap-4 px-5 py-28 text-center">
      <div
        aria-hidden="true"
        className="grid size-[72px] place-items-center rounded-[22px] bg-[#E5ECDC] text-[#3F6B3E]"
      >
        <svg
          viewBox="0 0 24 24"
          className="size-8"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="4" y="11" width="16" height="10" rx="2" />
          <path d="M8 11V7a4 4 0 0 1 8 0v4" />
        </svg>
      </div>
      <h1 className="font-serif text-4xl font-medium leading-[1.08] tracking-tight md:text-[44px]">
        {pesan}
      </h1>
      <p className="text-[19px] text-[#4A544B]">
        This page requires a KlimPooL account.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => bukaAuth('masuk')}
          className="inline-flex min-h-[50px] items-center justify-center rounded-full bg-[#3F6B3E] px-6 text-base font-extrabold text-white hover:bg-[#2D4F2D]"
        >
          Log in
        </button>
        <button
          type="button"
          onClick={() => bukaAuth('daftar')}
          className="inline-flex min-h-[50px] items-center justify-center rounded-full border-[1.5px] border-[#DCE0D6] px-6 text-base font-extrabold hover:border-[#3F6B3E] hover:text-[#3F6B3E]"
        >
          Create an account
        </button>
      </div>
    </div>
  );
}
