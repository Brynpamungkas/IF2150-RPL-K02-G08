import { rupiah } from '../format';

interface DompetKartuProps {
  /** Saldo donasi donatur yang sedang login (C04 Donatur). */
  saldoDonasi: number;
  /** Dana yang masuk ke aksi yang ia selenggarakan. Dipisah dari saldo donasi. */
  saldoGalang: number;
}

/**
 * Kartu dompet pada halaman Account (KF27).
 * Hanya tampilan: angka diterima lewat props, belum ada akses data.
 */
export function DompetKartu({ saldoDonasi, saldoGalang }: DompetKartuProps) {
  return (
    <div className="mt-7 grid gap-4 md:grid-cols-2">
      <section className="grid gap-2 rounded-[20px] border-[1.5px] border-[#2D4F2D] bg-[#2D4F2D] p-[22px] text-white">
        <h2 className="text-base font-extrabold text-[#D7E2D2]">
          Donation balance
        </h2>
        <p className="font-serif text-4xl leading-[1.1]">
          {rupiah(saldoDonasi)}
        </p>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-[15px] text-[#D7E2D2]">Used for donations</span>
          {/* TODO: sambungkan ke modal Top up saat issue-nya dikerjakan. */}
          <button
            type="button"
            disabled
            title="Coming soon"
            className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full border-[1.5px] border-[#E7E9E4] bg-[#E7E9E4] px-[18px] text-[15px] font-extrabold text-[#6B726A] disabled:cursor-not-allowed"
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
    </div>
  );
}
