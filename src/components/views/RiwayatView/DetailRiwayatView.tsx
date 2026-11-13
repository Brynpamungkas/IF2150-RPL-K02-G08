'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import type {
  DetailProgresRiwayat,
  DetailTransaksiRiwayat,
  ItemRiwayat,
  ItemRiwayatTransaksi,
  ItemRiwayatProgres,
  ItemRiwayatTopup,
  ItemRiwayatRelawan,
} from '@/shared/riwayat';
import { LABEL_STATUS_RELAWAN } from '@/shared/riwayat';
import { Modal } from '../../ui/Modal';
import { LembarCetakBukti, TombolCetakBukti } from '../DonasiView/LembarCetakBukti';
import { rupiah, waktuLokal } from '../DonasiView/format';
import { useBukti } from '../DonasiView/useBukti';
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
 * C40 DetailRiwayatView (UC10, KF27). Modal rincian satu entri riwayat
 * (acuan: `mHist` pada KlimPooL-prototype-final). Transaksi diambil dari
 * GET /api/riwayat/transaksi/[id], progres dari GET /api/riwayat/progres/[id].
 *
 * Rincian donasi punya tombol "See use of funds" dan "See progress", rincian
 * progres punya "Open all updates". Ketiganya membuka tab terkait di halaman
 * detail tujuannya (`?tab=`, lihat bacaTabDetail).
 */
export function DetailRiwayatView({ item, onTutup }: Props) {
  if (item.jenis === 'topup' || item.jenis === 'relawan') {
    return <DetailAktivitasTambahan item={item} onTutup={onTutup} />;
  }
  return <DetailDonasiProgres item={item} onTutup={onTutup} />;
}

function DetailDonasiProgres({
  item,
  onTutup,
}: {
  item: ItemRiwayatTransaksi | ItemRiwayatProgres;
  onTutup: () => void;
}) {
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

  // Prototipe: judul progres = nama milestone, selain itu "Activity details".
  const judul = item.jenis === 'progres' ? item.milestone : 'Activity details';

  return (
    <Modal open onClose={onTutup} title={judul}>
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
        keadaan.detail.jenis === 'transaksi' ? (
          <>
            <RincianTransaksi data={keadaan.detail.data} />
            {item.jenis === 'transaksi' ? <AksiTransaksi item={item} /> : null}
          </>
        ) : (
          <RincianProgres data={keadaan.detail.data} />
        )
      ) : null}
    </Modal>
  );
}

function RincianTransaksi({ data }: { data: DetailTransaksiRiwayat }) {
  const baris: [string, string, string?][] = [
    ['Transaction ID', data.idTransaksi],
    ['Type', 'Donation'],
    ['Recipient', data.namaTujuan],
    ['Amount', rupiah(data.nominal)],
    ['Time', waktuLokal(data.tanggal)],
    [
      'Status',
      LABEL_STATUS_TRANSAKSI[data.statusTransaksi],
      data.statusTransaksi === 'berhasil' ? 'text-[#2F7D32]' : 'text-[#B3261E]',
    ],
  ];

  return (
    <dl className="m-0 grid grid-cols-[auto_1fr] gap-x-4 gap-y-2.5 rounded-2xl bg-[#F7F6F2] p-[18px] text-left">
      {baris.map(([k, v, warna]) => (
        <div key={k} className="contents">
          <dt className="font-bold text-[#4A544B]">{k}</dt>
          <dd
            className={`m-0 break-words text-right font-extrabold ${warna ?? ''}`}
          >
            {v}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/**
 * Tombol ke halaman detail project/campaign penerima donasi (prototipe mHist)
 * di kiri, dan "Print receipt" di kanan bawah. Tujuan tidak ditampilkan bila
 * sudah dihapus, karena halamannya tidak ada lagi.
 */
function AksiTransaksi({ item }: { item: ItemRiwayatTransaksi }) {
  const keadaan = useBukti(item.id);
  const dasar =
    item.namaTujuan === null
      ? null
      : `/${item.jenisTujuan}/${encodeURIComponent(item.idTujuan)}`;

  return (
    <>
      <div className="form-actions">
        {dasar ? (
          <>
            <Link href={`${dasar}?tab=funds`} className="btn btn-ghost">
              See use of funds
            </Link>
            <Link href={`${dasar}?tab=progress`} className="btn btn-ghost">
              See progress
            </Link>
          </>
        ) : null}
        {keadaan.status === 'ada' ? (
          <span className="ml-auto">
            <TombolCetakBukti
              bukti={keadaan.bukti}
              className="btn btn-primary"
            />
          </span>
        ) : null}
      </div>
      {keadaan.status === 'ada' ? (
        <LembarCetakBukti bukti={keadaan.bukti} />
      ) : null}
    </>
  );
}

function RincianProgres({ data }: { data: DetailProgresRiwayat }) {
  const baris: [string, string][] = [
    ['Action', data.namaProject],
    ['Recorded', waktuLokal(data.timestampPembaruan)],
    ['Status', LABEL_STATUS_PELAKSANAAN[data.statusPelaksanaan]],
  ];
  if (data.persentase !== null)
    baris.push(['Completion', `${data.persentase}%`]);
  if (data.danaTerpakai !== null) {
    baris.push(['Funds spent', rupiah(data.danaTerpakai)]);
  }

  return (
    <div className="grid gap-3.5">
      <div className="grid gap-2 rounded-2xl bg-[#F7F6F2] px-[18px] py-4">
        {baris.map(([k, v]) => (
          <div key={k} className="flex justify-between gap-2.5 text-base">
            <span>{k}</span>
            <b className="text-right text-[17px] [overflow-wrap:anywhere]">
              {v}
            </b>
          </div>
        ))}
      </div>

      {data.catatan ? <p>{data.catatan}</p> : null}

      {/* Progres hanya dimiliki project, jadi tujuannya selalu /project/[id]. */}
      <Link
        href={`/project/${encodeURIComponent(data.idProject)}?tab=progress`}
        className="btn btn-ghost"
      >
        Open all updates
      </Link>
    </div>
  );
}

function DetailAktivitasTambahan({
  item,
  onTutup,
}: {
  item: ItemRiwayatTopup | ItemRiwayatRelawan;
  onTutup: () => void;
}) {
  const baris: [string, string][] =
    item.jenis === 'topup'
      ? [
          ['Transaction ID', item.id],
          ['Type', 'Top-up'],
          ['Amount', rupiah(item.nominal)],
          ['Method', item.metode],
          ['Time', waktuLokal(item.waktu)],
          ['Status', 'Successful'],
        ]
      : [
          ['Application ID', item.id],
          ['Action', item.namaProject],
          ['Type', 'Volunteering'],
          ['Applied', waktuLokal(item.waktu)],
          ['Status', LABEL_STATUS_RELAWAN[item.status]],
          ...(item.tanggalKeputusan
            ? [
                ['Decision recorded', waktuLokal(item.tanggalKeputusan)] as [
                  string,
                  string,
                ],
              ]
            : []),
        ];
  return (
    <Modal open onClose={onTutup} title="Activity details">
      <dl className="m-0 grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2.5 rounded-2xl bg-[#F7F6F2] p-[18px]">
        {baris.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="font-bold text-[#4A544B]">{label}</dt>
            <dd className="m-0 break-words text-right font-extrabold">
              {value}
            </dd>
          </div>
        ))}
      </dl>
      {item.jenis === 'relawan' && (
        <Link
          href={`/project/${encodeURIComponent(item.idProject)}`}
          className="btn btn-ghost mt-4"
        >
          View project
        </Link>
      )}
    </Modal>
  );
}
