'use client';

import {
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';

/**
 * C39 FormRiwayatView: kerangka tab pada halaman Account (UC10, KF27).
 *
 * Komponen ini hanya menyediakan tab dan tempat isi. Isi tiap tab dikerjakan
 * anggota yang bertanggung jawab atas fiturnya, lalu dipasang lewat props:
 *   riwayat -> tab Activity history (tampilkanDaftarRiwayat, pilihRiwayat,
 *              tampilkanPesanRiwayatKosong, filter)
 *   relawan -> tab Volunteer applications
 *   aksi    -> tab My actions
 * Selama props kosong, tab menampilkan penanda "coming soon".
 */

type KunciTab = 'riwayat' | 'relawan' | 'aksi';

const DAFTAR_TAB: { kunci: KunciTab; label: string }[] = [
  { kunci: 'riwayat', label: 'Activity history' },
  { kunci: 'relawan', label: 'Volunteer applications' },
  { kunci: 'aksi', label: 'My actions' },
];

interface FormRiwayatViewProps {
  riwayat?: ReactNode;
  relawan?: ReactNode;
  aksi?: ReactNode;
}

function TempatFitur({ judul }: { judul: string }) {
  return (
    <div className="grid justify-items-center gap-3 rounded-[20px] border-[1.5px] border-dashed border-[#C3CBB8] bg-white px-7 py-10 text-center">
      <h3 className="text-[22px] font-extrabold">{judul}</h3>
      <p className="max-w-[48ch] text-[#4A544B]">
        This section is coming soon.
      </p>
    </div>
  );
}

export function FormRiwayatView({
  riwayat,
  relawan,
  aksi,
}: FormRiwayatViewProps) {
  const idDasar = useId();
  const [aktif, setAktif] = useState<KunciTab>('riwayat');
  const tombolRef = useRef<Record<KunciTab, HTMLButtonElement | null>>({
    riwayat: null,
    relawan: null,
    aksi: null,
  });

  const isi: Record<KunciTab, ReactNode> = {
    riwayat: riwayat ?? <TempatFitur judul="Activity history" />,
    relawan: relawan ?? <TempatFitur judul="Volunteer applications" />,
    aksi: aksi ?? <TempatFitur judul="My actions" />,
  };

  // Pola tab WAI-ARIA: panah kiri/kanan, Home, dan End memindahkan tab aktif.
  function pindahDenganKeyboard(
    e: KeyboardEvent<HTMLButtonElement>,
    indeks: number,
  ) {
    const jumlah = DAFTAR_TAB.length;
    let tujuan: number | null = null;
    if (e.key === 'ArrowRight') tujuan = (indeks + 1) % jumlah;
    else if (e.key === 'ArrowLeft') tujuan = (indeks - 1 + jumlah) % jumlah;
    else if (e.key === 'Home') tujuan = 0;
    else if (e.key === 'End') tujuan = jumlah - 1;
    if (tujuan === null) return;

    const tab = DAFTAR_TAB[tujuan];
    if (!tab) return;
    e.preventDefault();
    setAktif(tab.kunci);
    tombolRef.current[tab.kunci]?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Account sections"
        className="mb-7 flex gap-1.5 overflow-x-auto border-b-[1.5px] border-[#DCE0D6]"
      >
        {DAFTAR_TAB.map(({ kunci, label }, indeks) => {
          const terpilih = aktif === kunci;
          return (
            <button
              key={kunci}
              ref={(el) => {
                tombolRef.current[kunci] = el;
              }}
              type="button"
              role="tab"
              id={`${idDasar}-tab-${kunci}`}
              aria-selected={terpilih}
              aria-controls={`${idDasar}-panel-${kunci}`}
              tabIndex={terpilih ? 0 : -1}
              onClick={() => setAktif(kunci)}
              onKeyDown={(e) => pindahDenganKeyboard(e, indeks)}
              className={`-mb-[1.5px] whitespace-nowrap border-b-[3px] px-4 py-3.5 text-[17px] font-extrabold ${
                terpilih
                  ? 'border-[#3F6B3E] text-[#1F2420]'
                  : 'border-transparent text-[#4A544B] hover:text-[#1F2420]'
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      <div
        role="tabpanel"
        id={`${idDasar}-panel-${aktif}`}
        aria-labelledby={`${idDasar}-tab-${aktif}`}
        tabIndex={0}
      >
        {isi[aktif]}
      </div>
    </div>
  );
}
