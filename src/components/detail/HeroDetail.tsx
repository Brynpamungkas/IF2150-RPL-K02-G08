import Link from 'next/link';
import { ChipStatus, ChipTipe } from '@/components/ui/Chip';
import { IkonLokasi } from '@/components/ui/Ikon';
import { posisiFoto, type DetailAksi } from '@/shared/detail';
import { fotoBesar } from '@/shared/explore';

export function HeroDetail({ detail }: { detail: DetailAksi }) {
  return (
    <section className="detail-hero">
      <div className="wrap">
        <div className="crumbs">
          <Link href="/explore">Explore</Link>
          <span>/</span>
          <span>{detail.kategori}</span>
        </div>
        <div className="chips">
          <ChipTipe tipe={detail.tipe} />
          <span className="chip soft">{detail.kategori}</span>
          <ChipStatus item={detail} />
        </div>
        <h1>{detail.judul}</h1>
        <p className="by">
          <IkonLokasi />
          <b>
            {detail.kota}, {detail.provinsi}
          </b>
        </p>
        <div className="detail-img">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={fotoBesar(detail)}
            alt={`${detail.judul}, ${detail.kota}`}
            style={{ objectPosition: posisiFoto(detail.id) }}
          />
        </div>
      </div>
    </section>
  );
}
