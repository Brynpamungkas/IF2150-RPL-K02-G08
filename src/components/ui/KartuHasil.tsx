'use client';

import Link from 'next/link';
import type { ItemKatalog } from '@/shared/katalog';
import {
  fotoAksi,
  hrefDetail,
  persenBatang,
  rupiahRingkas,
  teksLokasi,
  teksRelawan,
} from '@/shared/explore';
import { kunciTitik } from '@/shared/peta';
import { BarProgres } from './BarProgres';
import { ChipStatus, ChipTipe } from './Chip';
import { IkonLokasi } from './Ikon';

interface KartuHasilProps {
  item: ItemKatalog;
  /** kartu yang pin-nya sedang dipilih di peta */
  terpilih?: boolean;
  animasi?: boolean;
  /** kunci titik (kunciTitik: tipe + id), bukan id saja. */
  onHover?: (kunci: string) => void;
}

/** satu hasil pencarian (row-card di prototipe). seluruh kartu adalah tautan ke halaman detail. */
export function KartuHasil({
  item,
  terpilih = false,
  animasi = false,
  onHover,
}: KartuHasilProps) {
  const persen = persenBatang(item.danaTerkumpul, item.targetDana);
  const relawan = teksRelawan(item);

  return (
    <Link
      href={hrefDetail(item)}
      className={`row-card${terpilih ? ' on' : ''}`}
      onMouseEnter={() => onHover?.(kunciTitik(item))}
      onFocus={() => onHover?.(kunciTitik(item))}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={fotoAksi(item)} alt="" loading="lazy" />
      <div className="body">
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          <ChipTipe tipe={item.tipe} />
          <ChipStatus item={item} />
        </div>
        <h3>{item.judul}</h3>
        <span
          className="loc small muted"
          style={{
            display: 'flex',
            gap: 6,
            alignItems: 'center',
            fontWeight: 600,
          }}
        >
          <IkonLokasi />
          {teksLokasi(item)}
        </span>
        <BarProgres persen={persen} animasi={animasi} />
        <span className="small">
          <b>{rupiahRingkas(item.danaTerkumpul)}</b> of{' '}
          {rupiahRingkas(item.targetDana)} · <b>{persen}%</b>
          {relawan ? ` · ${relawan}` : ''}
        </span>
      </div>
    </Link>
  );
}
