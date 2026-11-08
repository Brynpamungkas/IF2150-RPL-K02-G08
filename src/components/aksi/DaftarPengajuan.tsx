import Link from 'next/link';
import type { Aksi } from '@/shared/aksi';

export function DaftarPengajuan({ aksi }: { aksi: Aksi[] }) {
  return (
    <section aria-label="Daftar pengajuan" className="grid gap-5">
      {aksi.length === 0 && (
        <p className="notice info">
          Tidak ada pengajuan yang menunggu verifikasi.
        </p>
      )}
      {aksi.map((item) => (
        <article
          key={`${item.jenis}-${item.id}`}
          className="grid gap-3 rounded-[20px] border border-line bg-white p-6"
        >
          <p className="small muted">
            {item.jenis === 'project' ? 'Project' : 'Campaign'} · Menunggu
            Verifikasi
          </p>
          <h2>{item.judul}</h2>
          <p>
            {item.kota}, {item.provinsi}
          </p>
          <p className="small muted">
            Pembuat: {item.idPembuat} · Diajukan: {item.tanggalPengajuan}
          </p>
          <Link
            href={`/admin/pengajuan/${item.jenis}/${item.id}`}
            className="btn btn-primary"
          >
            Tinjau pengajuan
          </Link>
        </article>
      ))}
    </section>
  );
}
