import type { DetailAksi } from '@/shared/detail';
import { persenBatang, rupiah } from '@/shared/explore';

export function PanelDana({ detail }: { detail: DetailAksi }) {
  if (detail.rincianDana.length === 0) {
    return (
      <div className="empty">
        <h3>No fund breakdown yet</h3>
      </div>
    );
  }

  return (
    <>
      <div className="table-wrap">
        <table className="fund">
          <thead>
            <tr>
              <th>Item</th>
              <th className="r">Planned</th>
              <th className="r">Share</th>
            </tr>
          </thead>
          <tbody>
            {detail.rincianDana.map((r) => (
              <tr key={r.uraian}>
                <td>{r.uraian}</td>
                <td className="r num">
                  <b>{rupiah(r.nominal)}</b>
                </td>
                <td className="r num">
                  {persenBatang(r.nominal, detail.targetDana)}%
                </td>
              </tr>
            ))}
            <tr>
              <td>
                <b>Total target</b>
              </td>
              <td className="r num">
                <b>{rupiah(detail.targetDana)}</b>
              </td>
              <td className="r">100%</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="notice info" style={{ marginTop: 20 }}>
        <strong>Funds spent so far: {rupiah(detail.danaTerpakai)}</strong>
        <span>Taken from the organizer&apos;s latest progress report.</span>
      </div>
    </>
  );
}
