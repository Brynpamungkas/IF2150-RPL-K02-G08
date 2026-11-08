'use client';

import { useEffect, useState } from 'react';
import type {
  ApiGagal,
  BuktiDTO,
  HasilDonasi,
  StatusTransaksi,
} from '@/shared/dto';
import { Modal } from '../../ui/Modal';
import { rupiah, waktuLokal } from '../format';
import { panggilApi } from '../panggilApi';

interface Props {
  idTransaksi: string;
  /** Ringkasan dari respons donasi; hanya ada bila struk dibuka tepat setelah berdonasi. */
  ringkasan?: HasilDonasi;
  onTutup: () => void;
}

const LABEL_STATUS: Record<StatusTransaksi, string> = {
  berhasil: 'Successful',
  gagal: 'Failed',
};

/** C31 - DetailBuktiTransaksiView (Boundary). Struk donasi (prototipe: receipt). */
export function DetailBuktiTransaksiView({
  idTransaksi,
  ringkasan,
  onTutup,
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
        `${ringkasan.persentasePencapaian}% (${rupiah(ringkasan.danaTerkumpul)})`,
      ]);
    }

    return (
      <div className="grid justify-items-center gap-3.5 text-center">
        <span className="grid size-[72px] place-items-center rounded-full bg-[#E3F1E1] text-[#2F7D32]">
          <svg
            viewBox="0 0 24 24"
            className="size-9"
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

        <p className="text-[19px] text-[#4A544B]">
          Thank you. <b className="text-[#1F2420]">{rupiah(r.nominal)}</b> has
          gone to <b className="text-[#1F2420]">{r.namaTujuan}</b>.
        </p>

        <dl className="grid w-full grid-cols-[auto_1fr] gap-x-4 gap-y-2.5 rounded-2xl bg-[#F7F6F2] p-[18px] text-left">
          {baris.map(([k, v]) => (
            <div key={k} className="contents">
              <dt className="font-bold text-[#4A544B]">{k}</dt>
              <dd
                className={`m-0 break-words text-right font-extrabold ${
                  k === 'Status' && r.statusTransaksi === 'berhasil'
                    ? 'text-[#2F7D32]'
                    : ''
                }`}
              >
                {v}
              </dd>
            </div>
          ))}
        </dl>

        <button
          type="button"
          onClick={onTutup}
          className="btn btn-primary btn-block"
        >
          Done
        </button>
      </div>
    );
  }

  return (
    <Modal open onClose={onTutup} title="Donation successful">
      {!bukti && !galat ? <p className="muted">Loading receipt…</p> : null}
      {galat ? (
        <div className="notice bad" role="alert">
          <strong>Receipt not available</strong>
          <span>{galat.pesan}</span>
        </div>
      ) : null}
      {bukti ? tampilkanBukti(bukti) : null}
    </Modal>
  );
}
