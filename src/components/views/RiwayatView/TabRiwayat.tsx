'use client';

import { useEffect, useState } from 'react';
import {
  kelompokkanPerBulan,
  saringRiwayat,
  type FilterRiwayat,
  type ItemRiwayat,
} from '@/shared/riwayat';
import { rupiah, waktuLokal } from '../format';
import { DetailRiwayatView } from './DetailRiwayatView';
import { LABEL_STATUS_PELAKSANAAN, LABEL_STATUS_TRANSAKSI } from './label';
import { mintaRiwayat } from './mintaRiwayat';

/**
 * Isi tab Activity history pada halaman Account (bagian C39 FormRiwayatView,
 * UC10, KF27). Mengambil riwayat sekali dari GET /api/riwayat, lalu menyaring
 * dan mengelompokkan per bulan di sisi klien (I-10.12, I-10.13).
 */

const PILIHAN_FILTER: { nilai: FilterRiwayat; label: string }[] = [
  { nilai: 'semua', label: 'All' },
  { nilai: 'transaksi', label: 'Donations' },
  { nilai: 'progres', label: 'Progress' },
];

const PESAN_KOSONG: Record<FilterRiwayat, { judul: string; isi: string }> = {
  semua: {
    judul: 'No activity yet',
    isi: 'Your donations and progress updates from actions you organize or volunteer for will appear here.',
  },
  transaksi: {
    judul: 'No donations yet',
    isi: 'Donations you make will appear here with their transaction ID and status.',
  },
  progres: {
    judul: 'No progress updates yet',
    isi: 'Updates from actions you organize or were accepted to volunteer for will appear here.',
  },
};

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
    <div className="grid gap-6">
      <div
        role="group"
        aria-label="Filter activity"
        className="flex w-fit max-w-full flex-wrap gap-1 rounded-full border-[1.5px] border-[#DCE0D6] bg-white p-1"
      >
        {PILIHAN_FILTER.map(({ nilai, label }) => {
          const aktif = filter === nilai;
          return (
            <button
              key={nilai}
              type="button"
              aria-pressed={aktif}
              onClick={() => setFilter(nilai)}
              className={`min-h-[44px] rounded-full px-4 text-base font-extrabold transition-colors ${
                aktif
                  ? 'bg-[#3F6B3E] text-white'
                  : 'text-[#1F2420] hover:bg-[#E5ECDC]'
              }`}
            >
              {label}
            </button>
          );
        })}
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
            riwayat={saringRiwayat(keadaan.riwayat, filter)}
            filter={filter}
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
  riwayat,
  filter,
  onPilih,
}: {
  riwayat: ItemRiwayat[];
  filter: FilterRiwayat;
  onPilih: (item: ItemRiwayat) => void;
}) {
  // tampilkanPesanRiwayatKosong (UC10 Alt 1).
  if (riwayat.length === 0) {
    const pesan = PESAN_KOSONG[filter];
    return (
      <div className="grid justify-items-center gap-3 rounded-[20px] border-[1.5px] border-dashed border-[#C3CBB8] bg-white px-7 py-10 text-center">
        <span
          aria-hidden="true"
          className="grid size-14 place-items-center rounded-2xl bg-[#E5ECDC] text-[#3F6B3E]"
        >
          <IkonJam />
        </span>
        <h3 className="text-[22px] font-extrabold">{pesan.judul}</h3>
        <p className="max-w-[52ch] text-[#4A544B]">{pesan.isi}</p>
      </div>
    );
  }

  return (
    <div className="grid gap-7">
      {kelompokkanPerBulan(riwayat).map((kelompok) => (
        <section key={kelompok.kunci} aria-label={kelompok.label}>
          <h3 className="mb-3 text-[15px] font-extrabold uppercase tracking-[0.08em] text-[#4A544B]">
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

/** pilihRiwayat: satu entri yang dapat dipilih untuk membuka detail. */
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
      className="flex w-full items-center gap-4 rounded-[18px] border-[1.5px] border-[#DCE0D6] bg-white px-[18px] py-4 text-left transition-colors hover:border-[#3F6B3E]"
    >
      <span
        aria-hidden="true"
        className="grid size-11 shrink-0 place-items-center rounded-[14px] bg-[#E5ECDC] text-[#2D4F2D]"
      >
        {transaksi ? <IkonHati /> : <IkonGrafik />}
      </span>

      <span className="grid min-w-0 flex-1 gap-0.5">
        <span className="font-extrabold text-[#1F2420] [overflow-wrap:anywhere]">
          {judul}
        </span>
        <span className="text-[15px] text-[#4A544B] [overflow-wrap:anywhere]">
          {keterangan}
        </span>
      </span>

      {transaksi ? (
        <span className="grid shrink-0 justify-items-end gap-0.5">
          <span className="text-[17px] font-extrabold text-[#B3261E]">
            −{rupiah(item.nominal)}
          </span>
          <span
            className={`text-[15px] font-extrabold ${
              item.status === 'berhasil' ? 'text-[#1F2420]' : 'text-[#B3261E]'
            }`}
          >
            {LABEL_STATUS_TRANSAKSI[item.status]}
          </span>
        </span>
      ) : (
        <span className="shrink-0 rounded-full bg-[#E5ECDC] px-3 py-1 text-sm font-extrabold text-[#2D4F2D]">
          {item.persentase !== null
            ? `${item.persentase}% complete`
            : LABEL_STATUS_PELAKSANAAN[item.statusPelaksanaan]}
        </span>
      )}
    </button>
  );
}

function KerangkaMemuat() {
  return (
    <div className="grid gap-3" aria-label="Loading activity">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-[78px] animate-pulse rounded-[18px] border-[1.5px] border-[#DCE0D6] bg-[#F7F6F2] motion-reduce:animate-none"
        />
      ))}
    </div>
  );
}

function IkonHati() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    >
      <path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z" />
    </svg>
  );
}

function IkonGrafik() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M4 20h16M7 16v-4M11 16V8M15 16v-6M19 16v-2" />
    </svg>
  );
}

function IkonJam() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-7"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7v5l3.2 2" />
    </svg>
  );
}
