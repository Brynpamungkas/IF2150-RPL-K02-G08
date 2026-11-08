'use client';

import { useEffect, useState, type ReactNode } from 'react';
import type {
  DetailProgresRiwayat,
  DetailTransaksiRiwayat,
  ItemRiwayat,
} from '@/shared/riwayat';
import { Modal } from '../../ui/Modal';
import { rupiah, waktuLokal } from '../format';
import { LABEL_STATUS_PELAKSANAAN, LABEL_STATUS_TRANSAKSI } from './label';
import { mintaRiwayat } from './mintaRiwayat';

interface Props {
  /** Entri yang dipilih pada daftar riwayat. */
  item: ItemRiwayat;
  onTutup: () => void;
}

type Detail =
  | { jenis: 'transaksi'; data: DetailTransaksiRiwayat }
  | { jenis: 'progres'; data: DetailProgresRiwayat };

type Keadaan =
  | { tahap: 'memuat' }
  | { tahap: 'gagal'; pesan: string }
  | { tahap: 'siap'; detail: Detail };

/**
 * C40 DetailRiwayatView (UC10, KF27). Modal rincian satu entri riwayat:
 * transaksi dari GET /api/riwayat/transaksi/[id], progres dari
 * GET /api/riwayat/progres/[id].
 */
export function DetailRiwayatView({ item, onTutup }: Props) {
  const [keadaan, setKeadaan] = useState<Keadaan>({ tahap: 'memuat' });

  useEffect(() => {
    const kendali = new AbortController();
    const id = encodeURIComponent(item.id);

    const permintaan: Promise<Keadaan> =
      item.jenis === 'transaksi'
        ? mintaRiwayat<{ transaksi: DetailTransaksiRiwayat }>(
            `/api/riwayat/transaksi/${id}`,
            kendali.signal,
          ).then((h) =>
            h.ok
              ? {
                  tahap: 'siap',
                  detail: { jenis: 'transaksi', data: h.data.transaksi },
                }
              : { tahap: 'gagal', pesan: h.pesan },
          )
        : mintaRiwayat<{ progres: DetailProgresRiwayat }>(
            `/api/riwayat/progres/${id}`,
            kendali.signal,
          ).then((h) =>
            h.ok
              ? {
                  tahap: 'siap',
                  detail: { jenis: 'progres', data: h.data.progres },
                }
              : { tahap: 'gagal', pesan: h.pesan },
          );

    permintaan.then(setKeadaan).catch(() => {
      // Dibatalkan karena modal ditutup.
    });
    return () => kendali.abort();
  }, [item.jenis, item.id]);

  const judul =
    item.jenis === 'transaksi' ? 'Donation details' : 'Progress update';

  return (
    <Modal open onClose={onTutup} title={judul} subtitle={item.id}>
      {keadaan.tahap === 'memuat' ? (
        <p className="muted" role="status">
          Loading details…
        </p>
      ) : null}

      {keadaan.tahap === 'gagal' ? (
        <div className="notice bad" role="alert">
          <strong>Details not available</strong>
          <span>{keadaan.pesan}</span>
        </div>
      ) : null}

      {keadaan.tahap === 'siap' ? (
        <div className="grid gap-4">
          {keadaan.detail.jenis === 'transaksi' ? (
            <RincianTransaksi data={keadaan.detail.data} />
          ) : (
            <RincianProgres data={keadaan.detail.data} />
          )}
          <button
            type="button"
            onClick={onTutup}
            className="btn btn-primary btn-block"
          >
            Close
          </button>
        </div>
      ) : null}
    </Modal>
  );
}

function RincianTransaksi({ data }: { data: DetailTransaksiRiwayat }) {
  const berhasil = data.statusTransaksi === 'berhasil';
  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <KotakAngka label="Amount" nilai={rupiah(data.nominal)} />
        <KotakAngka
          label="Status"
          nilai={LABEL_STATUS_TRANSAKSI[data.statusTransaksi]}
          warna={berhasil ? 'text-[#2F7D32]' : 'text-[#B3261E]'}
        />
      </div>
      <DaftarRincian
        baris={[
          ['Transaction ID', data.idTransaksi],
          ['Time', waktuLokal(data.tanggal)],
          ['Donor', data.namaDonatur],
          [
            data.jenisTujuan === 'campaign' ? 'Campaign' : 'Action',
            data.namaTujuan,
          ],
        ]}
      />
    </>
  );
}

function RincianProgres({ data }: { data: DetailProgresRiwayat }) {
  const baris: [string, ReactNode][] = [
    ['Action', data.namaProject],
    ['Milestone', data.milestone],
    ['Updated', waktuLokal(data.timestampPembaruan)],
  ];
  if (data.danaTerpakai !== null) {
    baris.push(['Funds used', rupiah(data.danaTerpakai)]);
  }
  if (data.catatan) baris.push(['Notes', data.catatan]);

  return (
    <>
      <div className="grid grid-cols-2 gap-3">
        <KotakAngka
          label="Status"
          nilai={LABEL_STATUS_PELAKSANAAN[data.statusPelaksanaan]}
        />
        <KotakAngka
          label="Completion"
          nilai={data.persentase !== null ? `${data.persentase}%` : '–'}
        />
      </div>
      <DaftarRincian baris={baris} />
      {data.dokumentasi.length > 0 ? (
        <div className="grid gap-2">
          <h3 className="text-base font-extrabold">Documentation</h3>
          <ul className="grid gap-1.5">
            {data.dokumentasi.map((url, i) => (
              <li key={url}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-[#3F6B3E] underline underline-offset-2 hover:text-[#2D4F2D]"
                >
                  File {i + 1}
                  <span className="sr-only"> (opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}

function KotakAngka({
  label,
  nilai,
  warna = 'text-[#1F2420]',
}: {
  label: string;
  nilai: string;
  warna?: string;
}) {
  return (
    <div className="grid gap-1 rounded-2xl bg-[#F7F6F2] p-4">
      <span className="text-sm font-bold text-[#4A544B]">{label}</span>
      <strong className={`text-[20px] font-extrabold ${warna}`}>{nilai}</strong>
    </div>
  );
}

function DaftarRincian({ baris }: { baris: [string, ReactNode][] }) {
  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2.5 rounded-2xl bg-[#F7F6F2] p-[18px]">
      {baris.map(([k, v]) => (
        <div key={k} className="contents">
          <dt className="font-bold text-[#4A544B]">{k}</dt>
          <dd className="m-0 text-right font-extrabold [overflow-wrap:anywhere]">
            {v}
          </dd>
        </div>
      ))}
    </dl>
  );
}
