import { formatTanggal, plural, type DetailAksi } from '@/shared/detail';

export function PanelTentang({ detail }: { detail: DetailAksi }) {
  const project = detail.tipe === 'project';
  const rentang = `${formatTanggal(detail.mulai)} – ${formatTanggal(detail.selesai)}`;

  return (
    <div className="prose">
      <p style={{ fontSize: 19 }}>{detail.deskripsi}</p>
      {detail.tujuan && (
        <>
          <h3>What this action aims to achieve</h3>
          <p>
            <b>{detail.tujuan}</b>
          </p>
        </>
      )}
      {project && (
        <>
          <h3>Schedule and location</h3>
          <div className="need-grid">
            <div className="need">
              <h4>Activity schedule</h4>
              <ul>
                <li>
                  <b>{rentang}</b>
                </li>
              </ul>
            </div>
            <div className="need">
              <h4>Area</h4>
              <p>
                {detail.kota}, {detail.provinsi}
              </p>
            </div>
            <div className="need">
              <h4>Meeting point</h4>
              {detail.instruksiRelawan ? (
                <p>{detail.instruksiRelawan.lokasiKumpul}</p>
              ) : (
                <p className="small muted">
                  The exact meeting point is shared with accepted volunteers.
                </p>
              )}
            </div>
          </div>
        </>
      )}
      <h3>{project ? 'Activity' : 'Fundraising'} period</h3>
      <p>
        <b>{rentang}</b>
        {detail.belumMulai
          ? ` · starts on ${formatTanggal(detail.mulai)}`
          : detail.sisaHari !== null && detail.sisaHari >= 0
            ? ` · ${plural(detail.sisaHari, 'day')} left`
            : ' · ended'}
      </p>
    </div>
  );
}
