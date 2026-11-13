import Link from 'next/link';
import { DetailAksiPrivat } from '@/components/aksi/DetailAksiPrivat';
import { KeputusanPengajuan } from '@/components/aksi/KeputusanPengajuan';
import { sesiAksi, wajibPeranAksi } from '@/server/auth/aksesAksi';
import { parameterAksi } from '@/server/controllers/AksiController';
import { halamanAksi } from '@/server/halamanAksi';
import { AksiService } from '@/server/services/AksiService';

// Navbar bersama membaca usePathname di luar Suspense; batasi opt-out ke route ini.
export const instant = false;

export default async function Page({
  params,
}: {
  params: Promise<{ jenis: string; id: string }>;
}) {
  return halamanAksi(async () => {
    const pengguna = await sesiAksi();
    wajibPeranAksi(pengguna, 'admin');
    const { jenis, id } = await params;
    const aksi = await AksiService.lihat(
      pengguna,
      parameterAksi(jenis, id),
      id,
    );
    return (
      <div className="wrap py-12">
        <div className="mx-auto grid max-w-3xl gap-7">
          <Link href="/admin">← Daftar pengajuan</Link>
          <h1>{aksi.judul}</h1>
          <p>Pembuat: {aksi.idPembuat}</p>
          <DetailAksiPrivat aksi={aksi} />
          <KeputusanPengajuan aksi={aksi} />
        </div>
      </div>
    );
  });
}
