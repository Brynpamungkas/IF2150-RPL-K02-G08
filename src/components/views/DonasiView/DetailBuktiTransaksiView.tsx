'use client';

import { useEffect, useState } from 'react';
import type {
  ApiGagal,
  BuktiDTO,
  HasilDonasi,
  StatusTransaksi,
} from '@/shared/donasi';
import { Modal } from '../../ui/Modal';
import { rupiah, waktuLokal } from './format';
import { persenTampil } from './logikaDonasi';
import { panggilApi } from './panggilApi';

interface Props {
  idTransaksi: string;
  /** Ringkasan dari respons donasi; hanya ada bila struk dibuka tepat setelah berdonasi. */
  ringkasan?: HasilDonasi;
  onTutup: () => void;
  /** Bila ada, tampil tombol "View history" (halaman My activity, KF27). */
  onLihatRiwayat?: () => void;
}

const LABEL_STATUS: Record<StatusTransaksi, string> = {
  berhasil: 'Successful',
  gagal: 'Failed',
};

/** C31 - DetailBuktiTransaksiView (Boundary). Struk donasi (prototipe: mDonate, cabang receipt). */
export function DetailBuktiTransaksiView({
  idTransaksi,
  ringkasan,
  onTutup,
  onLihatRiwayat,
}: Props) {
  const [bukti, setBukti] = useState<BuktiDTO | null>(null);
  const [galat, setGalat] = useState<ApiGagal | null>(null);

  // bukaBukti: meminta bukti transaksi berdasarkan ID transaksi.
  useEffect(() => {
    let batal = false;
    panggilApi<BuktiDTO>(
      `/api/donasi/bukti/${encodeURIComponent(idTransaksi)}`,
    ).then((h) => {
      if (batal) return;
      if (h.ok) setBukti(h.data);
      else setGalat(h);
    });
    return () => {
      batal = true;
    };
  }, [idTransaksi]);

  // tampilkanBukti: Donatur, tujuan dana, nominal, waktu, dan status transaksi.
  function tampilkanBukti(b: BuktiDTO) {
    const r = b.rincian;
    const baris: [string, string][] = [
      ['Transaction ID', b.idTransaksi],
      ['Time', waktuLokal(r.tanggal)],
      ['Status', LABEL_STATUS[r.statusTransaksi]],
      ['Donor', r.namaDonatur],
      ['Destination', r.namaTujuan],
      ['Amount', rupiah(r.nominal)],
    ];
    if (r.pesan) baris.push(['Message', r.pesan]);
    if (ringkasan) {
      baris.push(['Remaining balance', rupiah(ringkasan.saldoSesudah)]);
      baris.push([
        'Target reached',
        `${persenTampil(ringkasan.persentasePencapaian)}% (${rupiah(ringkasan.danaTerkumpul)})`,
      ]);
    }

    return (
      <div className="receipt">
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

        <dl>
          {baris.map(([k, v]) => (
            <div key={k} className="contents">
              <dt>{k}</dt>
              <dd
                style={
                  k === 'Status' && r.statusTransaksi === 'berhasil'
                    ? { color: 'var(--ok)' }
                    : undefined
                }
              >
                {v}
              </dd>
            </div>
          ))}
        </dl>

        <div className="form-actions justify-center">
          <button type="button" className="btn btn-primary" onClick={onTutup}>
            Done
          </button>
          {onLihatRiwayat ? (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onLihatRiwayat}
            >
              View history
            </button>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <Modal open onClose={onTutup} title="Donation successful">
      {!bukti && !galat ? <p className="muted">Loading receipt…</p> : null}
      {galat ? (
        <>
          <div className="notice bad" role="alert">
            <strong>Receipt not available</strong>
            <span>{galat.pesan}</span>
          </div>
          <button
            type="button"
            className="btn btn-primary btn-block"
            onClick={onTutup}
          >
            Done
          </button>
        </>
      ) : null}
      {bukti ? tampilkanBukti(bukti) : null}
    </Modal>
  );
}
