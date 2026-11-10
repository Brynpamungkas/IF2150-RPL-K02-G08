'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import {
  kelompokkanPerBulan,
  saringRiwayat,
  type FilterRiwayat,
  type ItemRiwayat,
} from '@/shared/riwayat';
import { rupiah, waktuLokal } from '../DonasiView/format';
import { DetailRiwayatView } from './DetailRiwayatView';
import { IkonGrafik, IkonHati } from './ikon';
import { LABEL_STATUS_TRANSAKSI } from './label';
import { mintaRiwayat } from './mintaRiwayat';

/**
 * Isi tab Activity history pada halaman Account (bagian C39 FormRiwayatView,
 * UC10, KF27). Acuan: `pageDash` dan `histRow` pada KlimPooL-prototype-final.
 * Mengambil riwayat sekali dari GET /api/riwayat, lalu menyaring dan
 * mengelompokkan per bulan di sisi klien (I-10.12, I-10.13).
 *
 * Filter Top-ups dan Volunteering pada prototipe belum ditampilkan karena
 * API riwayat (#38) baru mencakup transaksi donasi dan progres.
 */

const PILIHAN_FILTER: { nilai: FilterRiwayat; label: string }[] = [
  { nilai: 'semua', label: 'All' },
  { nilai: 'transaksi', label: 'Donations' },
  { nilai: 'progres', label: 'Progress' },
];

type Keadaan =
  | { tahap: 'memuat' }
  | { tahap: 'gagal'; status: number; pesan: string }
  | { tahap: 'siap'; riwayat: ItemRiwayat[] };

export function TabRiwayat() {
  const [keadaan, setKeadaan] = useState<Keadaan>({ tahap: 'memuat' });
  const [percobaan, setPercobaan] = useState(0);
  const [filter, setFilter] = useState<FilterRiwayat>('semua');
  const [terpilih, setTerpilih] = useState<ItemRiwayat | null>(null);

  // tampilkanDaftarRiwayat: ambil riwayat milik pengguna yang login.
  useEffect(() => {
    const kendali = new AbortController();
    mintaRiwayat<{ riwayat: ItemRiwayat[] }>('/api/riwayat', kendali.signal)
      .then((h) => {
        setKeadaan(
          h.ok
            ? { tahap: 'siap', riwayat: h.data.riwayat }
            : { tahap: 'gagal', status: h.status, pesan: h.pesan },
        );
      })
      .catch(() => {
        // Dibatalkan karena komponen dilepas atau dicoba ulang.
      });
    return () => kendali.abort();
  }, [percobaan]);

  function cobaLagi() {
    setKeadaan({ tahap: 'memuat' });
    setPercobaan((n) => n + 1);
  }

  return (
    <div>
      <div className="mb-[18px] flex flex-wrap">
        <div
          role="group"
          aria-label="Filter history"
          className="inline-flex max-w-full flex-wrap rounded-full border-[1.5px] border-[#DCE0D6] bg-white p-1"
        >
          {PILIHAN_FILTER.map(({ nilai, label }) => {
            const aktif = filter === nilai;
            return (
              <button
                key={nilai}
                type="button"
                aria-pressed={aktif}
                onClick={() => setFilter(nilai)}
                className={`min-h-[44px] rounded-full px-4 py-2 text-[15px] font-extrabold min-[721px]:min-h-0 ${
                  aktif ? 'bg-[#3F6B3E] text-white' : 'text-[#4A544B]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      <div aria-live="polite" aria-busy={keadaan.tahap === 'memuat'}>
        {keadaan.tahap === 'memuat' ? <KerangkaMemuat /> : null}

        {keadaan.tahap === 'gagal' ? (
          <div className="notice bad" role="alert">
            <strong>
              {keadaan.status === 401
                ? 'Please log in to see your activity'
                : 'Activity history could not be loaded'}
            </strong>
            <span>{keadaan.pesan}</span>
            {keadaan.status !== 401 ? (
              <button
                type="button"
                onClick={cobaLagi}
                className="btn btn-light btn-sm mt-2 w-fit"
              >
                Try again
              </button>
            ) : null}
          </div>
        ) : null}

        {keadaan.tahap === 'siap' ? (
          <DaftarRiwayat
            semua={keadaan.riwayat}
            filter={filter}
            onTampilkanSemua={() => setFilter('semua')}
            onPilih={setTerpilih}
          />
        ) : null}
      </div>

      {terpilih ? (
        <DetailRiwayatView item={terpilih} onTutup={() => setTerpilih(null)} />
      ) : null}
    </div>
  );
}

function DaftarRiwayat({
  semua,
  filter,
  onTampilkanSemua,
  onPilih,
}: {
  semua: ItemRiwayat[];
  filter: FilterRiwayat;
  onTampilkanSemua: () => void;
  onPilih: (item: ItemRiwayat) => void;
}) {
  // tampilkanPesanRiwayatKosong (UC10 Alt 1): pengguna belum punya riwayat sama sekali.
  if (semua.length === 0) {
    return (
      <div className={KELAS_KOSONG}>
        <span
          aria-hidden="true"
          className="grid size-14 place-items-center rounded-2xl bg-[#E5ECDC] text-[#3F6B3E]"
        >
          <IkonGrafik />
        </span>
        <h3 className="text-[22px] font-extrabold">Your history is empty</h3>
        <p className="max-w-[48ch] text-[#4A544B]">
          You have not donated, volunteered, or created an action yet.
          Everything you do will be listed here, newest first.
        </p>
        <Link href="/explore" className="btn btn-primary">
          Start exploring
        </Link>
      </div>
    );
  }

  const riwayat = saringRiwayat(semua, filter);
  if (riwayat.length === 0) {
    return (
      <div className={KELAS_KOSONG}>
        <h3 className="text-[22px] font-extrabold">
          No activity in this category yet
        </h3>
        <button
          type="button"
          onClick={onTampilkanSemua}
          className="btn btn-ghost"
        >
          Show everything
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {kelompokkanPerBulan(riwayat).map((kelompok) => (
        <section
          key={kelompok.kunci}
          aria-labelledby={`riwayat-${kelompok.kunci}`}
          className="grid gap-3"
        >
          <h3
            id={`riwayat-${kelompok.kunci}`}
            className="mb-0.5 mt-3 text-sm font-extrabold uppercase tracking-[0.06em] text-[#4A544B]"
          >
            {kelompok.label}
          </h3>
          <ul className="grid gap-3">
            {kelompok.item.map((item) => (
              <li key={`${item.jenis}-${item.id}`}>
                <BarisRiwayat item={item} onPilih={onPilih} />
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

const KELAS_KOSONG =
  'grid justify-items-center gap-3 rounded-[20px] border-[1.5px] border-dashed border-[#C3CBB8] bg-white px-7 py-10 text-center';

/** pilihRiwayat: satu entri yang dapat dipilih untuk membuka detail (histRow). */
function BarisRiwayat({
  item,
  onPilih,
}: {
  item: ItemRiwayat;
  onPilih: (item: ItemRiwayat) => void;
}) {
  const transaksi = item.jenis === 'transaksi';
  const judul = transaksi
    ? `Donation to ${item.namaTujuan ?? 'a removed action'}`
    : item.milestone;
  const keterangan = transaksi
    ? `${waktuLokal(item.waktu)} · ${item.id}`
    : `${item.namaProject} · ${waktuLokal(item.waktu)}`;

  return (
    <button
      type="button"
      onClick={() => onPilih(item)}
      aria-haspopup="dialog"
      className="grid w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-4 rounded-2xl border-[1.5px] border-[#DCE0D6] bg-white px-[18px] py-4 text-left hover:border-[#3F6B3E] min-[721px]:grid-cols-[auto_minmax(0,1fr)_auto]"
    >
      <span
        aria-hidden="true"
        className="grid size-[46px] place-items-center rounded-[14px] bg-[#E5ECDC] text-[#2D4F2D]"
      >
        {transaksi ? <IkonHati /> : <IkonGrafik />}
      </span>

      <span className="grid min-w-0">
        <span className="text-[17px] font-extrabold text-[#1F2420] [overflow-wrap:anywhere]">
          {judul}
        </span>
        <span className="text-[15px] text-[#4A544B] [overflow-wrap:anywhere]">
          {keterangan}
        </span>
      </span>

      <span className="col-start-2 text-left text-[17px] font-extrabold min-[721px]:col-start-auto min-[721px]:text-right">
        {transaksi ? (
          <span className="text-[#B3261E] tabular-nums">
            −{rupiah(item.nominal)}
            <small className="block text-sm font-bold text-[#4A544B]">
              {LABEL_STATUS_TRANSAKSI[item.status]}
            </small>
          </span>
        ) : item.persentase !== null ? (
          <span className="inline-flex whitespace-nowrap rounded-full bg-[#E5ECDC] px-3 py-1 text-sm font-extrabold text-[#2D4F2D]">
            {item.persentase}% complete
          </span>
        ) : null}
      </span>
    </button>
  );
}

function KerangkaMemuat() {
  return (
    <div className="grid gap-3" aria-label="Loading activity">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-[80px] animate-pulse rounded-2xl border-[1.5px] border-[#DCE0D6] bg-[#F7F6F2] motion-reduce:animate-none"
        />
      ))}
    </div>
  );
}
