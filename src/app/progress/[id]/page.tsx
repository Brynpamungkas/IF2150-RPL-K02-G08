import Link from 'next/link';
import { ProgresAksi } from '@/components/aksi/ProgresAksi';
import { sesiAksi, wajibPeranAksi } from '@/server/auth/aksesAksi';
import { halamanAksi } from '@/server/halamanAksi';
import { AksiService } from '@/server/services/AksiService';
import { DetailService } from '@/server/services/detail.service';
import { GalatValidasi } from '@/shared/galat';

/** Penghubung My Actions ke form progres tim; bukan implementasi ulang UC09. */
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return halamanAksi(async () => {
    const pengguna = await sesiAksi();
    wajibPeranAksi(pengguna, 'pembuat_project');
    const { id } = await params;
    const aksi = await AksiService.lihat(pengguna, 'project', id);
    if (aksi.status !== 'terpublikasi') {
      throw new GalatValidasi(
        'Progres hanya tersedia untuk project terpublikasi.',
        409,
      );
    }
    const detail = await new DetailService().ambil('project', id);
    if (!detail) throw new GalatValidasi('Aksi tidak ditemukan.', 404);
    return (
      <div className="wrap mx-auto grid max-w-3xl gap-6 py-12">
        <Link href="/account">← My activity</Link>
        <h1>Progres: {aksi.judul}</h1>
        <ProgresAksi
          id={id}
          judul={aksi.judul}
          status={detail.statusPelaksanaan}
        />
        <Link href={`/project/${id}`} className="btn btn-light">
          Lihat project publik
        </Link>
      </div>
    );
  });
}
