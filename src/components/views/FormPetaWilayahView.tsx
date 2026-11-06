'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import type { ItemKatalog } from '@/shared/katalog';
import {
  LEBAR_PETA,
  PATH_PULAU,
  TINGGI_PETA,
  aturPin,
  letakPopup,
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

interface FormPetaWilayahViewProps {
  hasil: ItemKatalog[];
  terpilihId: string | null;
  sorotId: string | null;
  onPilih: (id: string | null) => void;
}

interface ItemBerpin extends ItemKatalog {
  latitude: number;
  longitude: number;
}

const adaKoordinat = (i: ItemKatalog): i is ItemBerpin =>
  i.latitude !== null && i.longitude !== null;

export function FormPetaWilayahView({
  hasil,
  terpilihId,
  sorotId,
  onPilih,
}: FormPetaWilayahViewProps) {
  const pin = useMemo(
    () => hasil.filter((i) => i.terbukaDonasi).filter(adaKoordinat),
    [hasil],
  );
  const posisi = useMemo(
    () =>
      aturPin(
        pin.map((i) => ({
          id: i.id,
          latitude: i.latitude,
          longitude: i.longitude,
        })),
      ),
    [pin],
  );
  const terpilih = pin.find((i) => i.id === terpilihId) ?? null;

  const garis: React.ReactNode[] = [];
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
            {pin.map((i) => {
              const [x, y] = posisi[i.id];
              const warna = WARNA_PIN[i.tipe];
              const aktif = terpilihId === i.id || sorotId === i.id;
              return (
                <g
                  key={i.id}
                  className={`pin${aktif ? ' on' : ''}`}
                  style={{ color: warna }}
                  tabIndex={0}
                  role="button"
                  aria-label={`${i.judul}, ${i.kota}`}
                  onClick={() => onPilih(terpilihId === i.id ? null : i.id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      onPilih(terpilihId === i.id ? null : i.id);
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
              item={terpilih}
              posisi={posisi[terpilih.id]}
              onTutup={() => onPilih(null)}
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
  item,
  posisi,
  onTutup,
}: {
  item: ItemBerpin;
  posisi: [number, number];
  onTutup: () => void;
}) {
  const { kiri, atas, dibawah } = letakPopup(posisi[0], posisi[1]);
  const persen = persenBatang(item.danaTerkumpul, item.targetDana);

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
      <img src={fotoAksi(item)} alt="" />
      <div>
        <ChipTipe tipe={item.tipe} />{' '}
      </div>
      <strong style={{ fontSize: 17 }}>{item.judul}</strong>
      <span className="small muted">
        {item.kota} · {item.provinsi}
      </span>
      <BarProgres persen={persen} />
      <span className="small">
        <b>{rupiahRingkas(item.danaTerkumpul)}</b> of{' '}
        {rupiahRingkas(item.targetDana)}
      </span>
      <Link href={hrefDetail(item)} className="btn btn-primary btn-sm">
        View details <IkonPanah />
      </Link>
    </div>
  );
}
