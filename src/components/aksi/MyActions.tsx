import Link from 'next/link';
import { LABEL_STATUS_AKSI, type Aksi } from '@/shared/aksi';
import { TombolPengajuan } from './TombolPengajuan';

/** Isi slot `aksi` pada FormRiwayatView (#58); tidak mengganti halaman Account tim. */
export function MyActions({
  aksi,
  bolehBuat = true,
}: {
  aksi: Aksi[];
  bolehBuat?: boolean;
}) {
  return (
    <section aria-label="My Actions" className="grid gap-5">
      {bolehBuat ? (
        <Link
          href="/start"
          className="btn btn-primary w-fit gap-2 rounded-full px-6"
        >
          <span aria-hidden="true" className="text-[22px] leading-none">
            +
          </span>
          New submission
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="btn btn-primary w-fit gap-2 rounded-full px-6 opacity-60"
          title="Creating actions is available to project creators."
        >
          <span aria-hidden="true" className="text-[22px] leading-none">
            +
          </span>
          New submission
        </button>
      )}
      {aksi.length === 0 && (
        <div className="grid min-h-[226px] justify-items-center content-center gap-3 rounded-[20px] border border-dashed border-[#DCE0D6] bg-white px-6 py-10 text-center">
          <span aria-hidden="true" className="mb-1 text-[28px] leading-none">
            +
          </span>
          <h2 className="text-[22px] font-extrabold">
            You haven&apos;t created an action yet
          </h2>
          <p className="max-w-[52ch] text-[18px] leading-relaxed text-[#4A544B]">
            Have a climate action plan? Submit a project or a fundraising
            campaign.
          </p>
        </div>
      )}
      {aksi.map((item) => (
        <article
          key={`${item.jenis}-${item.id}`}
          className="grid gap-4 rounded-[20px] border border-line bg-white p-6"
        >
          <header>
            <p className="small muted">
              {item.jenis === 'project' ? 'Project' : 'Campaign'} ·{' '}
              {LABEL_STATUS_AKSI[item.status]}
            </p>
            <h3>{item.judul}</h3>
            <p className="small muted">ID: {item.id}</p>
          </header>
          {item.alasanPenolakan && (
            <p className="notice bad">
              Alasan penolakan: {item.alasanPenolakan}
            </p>
          )}
          <div className="flex flex-wrap gap-3">
            <Link
              href={`/manage/${item.jenis}/${item.id}`}
              className="btn btn-light"
            >
              Kelola
            </Link>
            {item.jenis === 'project' && item.status === 'terpublikasi' && (
              <Link href={`/progress/${item.id}`} className="btn btn-light">
                Progres
              </Link>
            )}
            <TombolPengajuan aksi={item} />
          </div>
        </article>
      ))}
    </section>
  );
}
