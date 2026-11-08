'use client';

import type { FormEvent } from 'react';
import {
  OPSI_PERIODE,
  OPSI_STATUS,
  OPSI_TIPE,
  type FilterExplore,
  type PeriodeUI,
  type StatusUI,
  type TipeUI,
} from '@/shared/explore';
import { IkonCari } from '@/components/ui/Ikon';

interface FormPencarianViewProps {
  teks: string;
  onTeks: (teks: string) => void;
  onCari: () => void;
  filter: FilterExplore;
  onFilter: (ubah: Partial<FilterExplore>) => void;
  kategori: readonly string[];
  provinsi: readonly string[];
}

function denganNilai(daftar: readonly string[], nilai: string): string[] {
  return nilai && !daftar.includes(nilai) ? [...daftar, nilai] : [...daftar];
}

export function FormPencarianView({
  teks,
  onTeks,
  onCari,
  filter,
  onFilter,
  kategori,
  provinsi,
}: FormPencarianViewProps) {
  const kirim = (e: FormEvent) => {
    e.preventDefault();
    onCari();
  };

  return (
    <div className="filters">
      <form className="search" role="search" onSubmit={kirim}>
        <IkonCari />
        <input
          id="q"
          type="search"
          placeholder="Search mangrove, Demak, clean water…"
          value={teks}
          onChange={(e) => onTeks(e.target.value)}
          aria-label="Keyword"
        />
        <button className="btn btn-primary btn-sm" type="submit">
          Search
        </button>
      </form>

      <div className="f-row">
        <div className="seg" role="group" aria-label="Type">
          {OPSI_TIPE.map((o) => (
            <button
              key={o.nilai}
              type="button"
              className={filter.type === o.nilai ? 'on' : ''}
              aria-pressed={filter.type === o.nilai}
              onClick={() => onFilter({ type: o.nilai as TipeUI })}
            >
              {o.label}
            </button>
          ))}
        </div>

        <select
          className="sel"
          id="fcat"
          aria-label="Category"
          value={filter.cat}
          onChange={(e) => onFilter({ cat: e.target.value })}
        >
          <option value="">All categories</option>
          {denganNilai(kategori, filter.cat).map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        <select
          className="sel"
          id="fprov"
          aria-label="Province"
          value={filter.prov}
          onChange={(e) => onFilter({ prov: e.target.value })}
        >
          <option value="">All provinces</option>
          {denganNilai(provinsi, filter.prov).map((p) => (
            <option key={p}>{p}</option>
          ))}
        </select>

        <select
          className="sel"
          id="fstatus"
          aria-label="Status"
          value={filter.status}
          onChange={(e) => onFilter({ status: e.target.value as StatusUI })}
        >
          {OPSI_STATUS.map((o) => (
            <option key={o.nilai} value={o.nilai}>
              {o.label}
            </option>
          ))}
        </select>

        <select
          className="sel"
          id="fperiod"
          aria-label="Activity period"
          value={filter.period}
          onChange={(e) => onFilter({ period: e.target.value as PeriodeUI })}
        >
          {OPSI_PERIODE.map((o) => (
            <option key={o.nilai} value={o.nilai}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
