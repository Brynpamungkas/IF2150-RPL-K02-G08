import type { BuktiDTO, HasilDonasi } from '@/shared/donasi';
import { barisArsip, barisBukti } from './barisBukti';
import { rupiah } from './format';

interface Props {
  bukti: BuktiDTO;
  ringkasan?: HasilDonasi;
  /** 'baru' = tepat setelah donasi (ada centang dan ucapan), 'arsip' = dibuka ulang. */
  varian: 'baru' | 'arsip';
}

/** Tampilan bukti (prototipe .receipt) tanpa fetch; dipakai modal dan halaman bukti. */
export function KartuBukti({ bukti, ringkasan, varian }: Props) {
  const r = bukti.rincian;
  const baris =
    varian === 'baru' ? barisBukti(bukti, ringkasan) : barisArsip(bukti);
  return (
    // Varian arsip rata kiri seperti modal "Activity details" (prototipe mHist).
    <div
      className="receipt"
      style={varian === 'arsip' ? { display: 'block' } : undefined}
    >
      {varian === 'baru' ? (
        <>
          <span className="tick">
            <svg
              viewBox="0 0 24 24"
              width="36"
              height="36"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <p className="text-[19px] text-[var(--ink-2)]">
            Thank you. <b className="text-[var(--ink)]">{rupiah(r.nominal)}</b>{' '}
            has gone to <b className="text-[var(--ink)]">{r.namaTujuan}</b>.
          </p>
        </>
      ) : null}

      <dl>
        {baris.map((b) => (
          <div key={b.label} className="contents">
            <dt>{b.label}</dt>
            <dd style={b.nada === 'ok' ? { color: 'var(--ok)' } : undefined}>
              {b.nilai}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
