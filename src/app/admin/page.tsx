import { DaftarPengajuan } from '@/components/aksi/DaftarPengajuan';
import { sesiAksi } from '@/server/auth/aksesAksi';
import { halamanAksi } from '@/server/halamanAksi';
import { AksiService } from '@/server/services/AksiService';

export default async function Page() {
  return halamanAksi(async () => {
    const aksi = await AksiService.antrean(await sesiAksi());
    return (
      <div className="wrap grid gap-7 py-12">
        <header>
          <h1>Verifikasi aksi</h1>
          <p>Project dan campaign yang menunggu ditinjau.</p>
        </header>
        <DaftarPengajuan aksi={aksi} />
      </div>
    );
  });
}
