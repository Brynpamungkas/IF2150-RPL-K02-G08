import { IkonDokumen } from '@/components/ui/Ikon';
import { formatJam, formatTanggal, type ProgresItem } from '@/shared/detail';
import { LABEL_PELAKSANAAN, rupiah } from '@/shared/explore';

const KELAS_STATUS = {
  persiapan: 'ok',
  berjalan: 'ok',
  ditunda: 'warn',
  selesai: 'info',
} as const;

export function PanelProgres({ progres }: { progres: ProgresItem[] }) {
  if (progres.length === 0) {
    return (
      <div className="empty">
        <h3>No progress reports yet</h3>
        <p>The first report will appear here once the activity starts.</p>
      </div>
    );
  }

  return (
    <div className="tl">
      {progres.map((p) => (
        <div key={p.id} className="tl-item">
          <div className="when">
            {formatTanggal(p.waktu)}
            <br />
            <span style={{ fontWeight: 600 }}>{formatJam(p.waktu)}</span>
          </div>
          <div className="what">
            <div className="judul-progres">
              <h4>{p.milestone}</h4>
              <span className={`chip ${KELAS_STATUS[p.status]}`}>
                {LABEL_PELAKSANAAN[p.status]}
              </span>
            </div>
            {p.catatan && <p>{p.catatan}</p>}
            {p.persentase !== null && (
              <p className="small">
                <b>{p.persentase}% complete</b>
                {p.danaTerpakai ? ` · ${rupiah(p.danaTerpakai)} spent` : ''}
              </p>
            )}
            {p.dokumen.length > 0 && (
              <div className="docs">
                {p.dokumen.map((d) =>
                  d.href ? (
                    <a
                      key={d.href}
                      className="doc"
                      href={d.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`${d.nama} (opens in a new tab)`}
                    >
                      <IkonDokumen />
                      {d.nama}
                    </a>
                  ) : (
                    <span key={d.nama} className="doc">
                      <IkonDokumen />
                      {d.nama}
                    </span>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
