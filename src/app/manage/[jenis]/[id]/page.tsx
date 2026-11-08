import Link from 'next/link';
import { DetailAksiPrivat } from '@/components/aksi/DetailAksiPrivat';
import { FormAksi } from '@/components/aksi/FormAksi';
import { TombolPengajuan } from '@/components/aksi/TombolPengajuan';
import { sesiAksi, wajibPeranAksi } from '@/server/auth/aksesAksi';
import { parameterAksi } from '@/server/controllers/AksiController';
import { halamanAksi } from '@/server/halamanAksi';
import { AksiService } from '@/server/services/AksiService';
import { dapatDiedit } from '@/shared/aksi';

// Navbar bersama membaca usePathname di luar Suspense; batasi opt-out ke route ini.
export const instant = false;

export default async function Page({
  params,
}: {
  params: Promise<{ jenis: string; id: string }>;
}) {
  return halamanAksi(async () => {
    const { jenis, id } = await params;
    const pengguna = await sesiAksi();
    wajibPeranAksi(pengguna, 'pembuat_project');
    const aksi = await AksiService.lihat(
      pengguna,
      parameterAksi(jenis, id),
      id,
    );
    return (
      <div className="wrap py-12">
        <div className="mx-auto grid max-w-3xl gap-7">
          <Link href="/my-actions">← My Actions</Link>
          <header>
            <h1>{aksi.judul}</h1>
            <p>Detail privat untuk pembuat. Bukan halaman publik.</p>
          </header>
          <DetailAksiPrivat aksi={aksi} />
          <TombolPengajuan aksi={aksi} />
          {dapatDiedit(aksi.status) && (
            <section className="grid gap-5">
              <h2>Kelola Draft</h2>
              <p>Simpan perubahan sebelum mengajukan verifikasi.</p>
              <FormAksi
                key={JSON.stringify(aksi)}
                jenis={aksi.jenis}
                aksi={aksi}
              />
            </section>
          )}
        </div>
      </div>
    );
  });
}
