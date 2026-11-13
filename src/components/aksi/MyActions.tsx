import Link from 'next/link';
import { LABEL_STATUS_AKSI, type Aksi } from '@/shared/aksi';
import { TombolPengajuan } from './TombolPengajuan';

/** Isi slot `aksi` pada FormRiwayatView (#58); tidak mengganti halaman Account tim. */
export function MyActions({ aksi }: { aksi: Aksi[] }) {
  return (
    <section aria-label="My Actions" className="grid gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2>My Actions</h2>
        <Link href="/start" className="btn btn-primary">
          Buat aksi
        </Link>
      </div>
      {aksi.length === 0 && (
        <p className="notice info">
          Belum ada project atau campaign milik Anda. Mulai aksi pertama Anda.
        </p>
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
