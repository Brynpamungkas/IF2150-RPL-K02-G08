import type { DetailAksi } from '@/shared/detail';
import { rupiah } from '@/shared/explore';

export function PanelKebutuhan({ detail }: { detail: DetailAksi }) {
  const kuota = detail.kuotaRelawan ?? 0;
  const diterima = detail.relawanDiterima ?? 0;

  return (
    <div className="need-grid">
      <div className="need">
        <h4>Funds</h4>
        <p>
          <b style={{ fontSize: 22 }}>{rupiah(detail.targetDana)}</b>
        </p>
        <p className="small muted">
          See the breakdown in the Use of funds tab.
        </p>
      </div>
      {detail.tipe === 'project' ? (
        <>
          <div className="need">
            <h4>Volunteers</h4>
            <p>
              <b style={{ fontSize: 22 }}>{kuota} people</b>
            </p>
            <p className="small muted">
              {diterima} accepted · {Math.max(0, kuota - diterima)} spots left
            </p>
          </div>
          <div className="need">
            <h4>Supplies</h4>
            <ul>
              {detail.logistik.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </div>
          <div className="need">
            <h4>Skills wanted</h4>
            <div className="checks">
              {detail.keahlian.map((k) => (
                <span key={k} className="chip soft">
                  {k}
                </span>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="need">
          <h4>Type of support</h4>
          <p>
            This campaign <b>only accepts donations</b> and does not take
            volunteers.
          </p>
        </div>
      )}
    </div>
  );
}
