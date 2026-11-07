'use client';

import { useMemo, useState, type ReactNode } from 'react';
import Link from 'next/link';
import {
  LEBAR_PETA,
  PATH_PULAU,
  TINGGI_PETA,
  aturPin,
  letakPopup,
  type TitikSebaran,
} from '@/shared/peta';
import {
  fotoAksi,
  hrefDetail,
  persenBatang,
  rupiahRingkas,
  WARNA_PIN,
} from '@/shared/explore';
import { BarProgres } from '@/components/ui/BarProgres';
import { ChipTipe } from '@/components/ui/Chip';
import { IkonPanah } from '@/components/ui/Ikon';

interface PetaSebaranProps {
  titik: TitikSebaran[];
  terpilihId?: string | null;
  sorotId?: string | null;
  onPilih?: (id: string | null) => void;
  aksiPopup?: (titik: TitikSebaran) => ReactNode;
}

export function PetaSebaran({
  titik,
  terpilihId,
  sorotId = null,
  onPilih,
  aksiPopup,
}: PetaSebaranProps) {
  const terkontrol = terpilihId !== undefined;
  const [lokal, setLokal] = useState<string | null>(null);
  const aktifId = terkontrol ? terpilihId : lokal;

  const pilih = (id: string | null) => {
    if (!terkontrol) setLokal(id);
    onPilih?.(id);
  };

  const posisi = useMemo(() => aturPin(titik), [titik]);
  const terpilih = titik.find((t) => t.id === aktifId) ?? null;

  const garis: ReactNode[] = [];
  for (let x = 0; x <= LEBAR_PETA; x += 80) {
    garis.push(<line key={`x${x}`} x1={x} y1={0} x2={x} y2={TINGGI_PETA} />);
  }
  for (let y = 0; y <= TINGGI_PETA; y += 70) {
    garis.push(<line key={`y${y}`} x1={0} y1={y} x2={LEBAR_PETA} y2={y} />);
  }

  return (
    <div className="map-col">
      <div className="map-box">
        <div style={{ position: 'relative' }}>
          <svg
            className="map-svg"
            viewBox={`0 0 ${LEBAR_PETA} ${TINGGI_PETA}`}
            role="img"
            aria-label="Map of climate actions across Indonesia"
          >
            <g className="grid">{garis}</g>
            <path className="island" d={PATH_PULAU} />
            {titik.map((t) => {
              const [x, y] = posisi[t.id];
              const warna = WARNA_PIN[t.tipe];
              const aktif = aktifId === t.id || sorotId === t.id;
              return (
                <g
                  key={`${t.tipe}-${t.id}`}
                  className={`pin${aktif ? ' on' : ''}`}
                  style={{ color: warna }}
                  tabIndex={0}
                  role="button"
                  aria-label={`${t.judul}, ${t.kota}`}
                  onClick={() => pilih(aktifId === t.id ? null : t.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      pilih(aktifId === t.id ? null : t.id);
                    }
                  }}
                >
                  <circle className="halo" cx={x} cy={y} r={20} />
                  <circle className="dot" cx={x} cy={y} r={10} fill={warna} />
                </g>
              );
            })}
          </svg>

          {terpilih && (
            <PopupPin
              titik={terpilih}
              posisi={posisi[terpilih.id]}
              onTutup={() => pilih(null)}
              aksi={aksiPopup?.(terpilih)}
            />
          )}
        </div>

        <div className="map-legend">
          <span>
            <i style={{ background: WARNA_PIN.project }} />
            Project
          </span>
          <span>
            <i style={{ background: WARNA_PIN.campaign }} />
            Fundraising campaign
          </span>
        </div>
      </div>
      <p className="small muted" style={{ marginTop: 10 }}>
        Tap a pin on the map to see a summary. The map covers Indonesia only.
      </p>
    </div>
  );
}

function PopupPin({
  titik,
  posisi,
  onTutup,
  aksi,
}: {
  titik: TitikSebaran;
  posisi: [number, number];
  onTutup: () => void;
  aksi: ReactNode;
}) {
  const { kiri, atas, dibawah } = letakPopup(posisi[0], posisi[1]);
  const persen = persenBatang(titik.danaTerkumpul, titik.targetDana);

  return (
    <div
      className="map-pop"
      style={{
        left: `${kiri}%`,
        ...(dibawah
          ? { top: `calc(${atas}% + 18px)` }
          : { bottom: `calc(${100 - atas}% + 18px)` }),
      }}
    >
      <button className="x" onClick={onTutup} aria-label="Close">
        ×
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={fotoAksi(titik)} alt="" />
      <div>
        <ChipTipe tipe={titik.tipe} />{' '}
      </div>
      <strong style={{ fontSize: 17 }}>{titik.judul}</strong>
      <span className="small muted">
        {titik.kota} · {titik.provinsi}
      </span>
      <BarProgres persen={persen} />
      <span className="small">
        <b>{rupiahRingkas(titik.danaTerkumpul)}</b> of{' '}
        {rupiahRingkas(titik.targetDana)}
      </span>
      <Link href={hrefDetail(titik)} className="btn btn-primary btn-sm">
        View details <IkonPanah />
      </Link>
      {aksi}
    </div>
  );
}
