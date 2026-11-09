import type { ReactNode } from 'react';
import { BarProgres } from '@/components/ui/BarProgres';
import { formatTanggal, type DetailAksi } from '@/shared/detail';
import { persenBatang, rupiah } from '@/shared/explore';

interface PanelSampingProps {
  detail: DetailAksi;
  pemilik?: ReactNode;
  donasi?: ReactNode;
  relawan?: ReactNode;
}

export function PanelSamping({
  detail,
  pemilik,
  donasi,
  relawan,
}: PanelSampingProps) {
  const persen = persenBatang(detail.danaTerkumpul, detail.targetDana);
  const kuota = detail.kuotaRelawan ?? 0;
  const diterima = detail.relawanDiterima ?? 0;

  return (
    <aside className="side" aria-label="Support this action">
      <div>
        <b className="num raised">{rupiah(detail.danaTerkumpul)}</b>
        <p className="of">
          raised of a <b>{rupiah(detail.targetDana)}</b> target
        </p>
      </div>
      <BarProgres persen={persen} besar />
      <div className="kv">
        <div>
          <b className="num">{persen}%</b>
          <span>funded</span>
        </div>
        <div>
          <b className="num">{detail.jumlahDonasi}</b>
          <span>donations</span>
        </div>
        <div>
          <b className="num">{Math.max(0, detail.sisaHari ?? 0)}</b>
          <span>days left</span>
        </div>
      </div>
      {pemilik}
      {donasi}
      {detail.tipe === 'project' && (
        <div className="relawan">
          <div className="baris">
            <b>Volunteers</b>
            <span className="num">
              <b>{diterima}</b> of {kuota} people
            </span>
          </div>
          <BarProgres persen={persenBatang(diterima, kuota)} warna="#B7832F" />
          {relawan}
        </div>
      )}
      <p className="small muted">
        Organized by <b className="oleh">{detail.penyelenggara}</b>
        {detail.diverifikasi &&
          ` · reviewed ${formatTanggal(detail.diverifikasi)}`}
      </p>
    </aside>
  );
}
