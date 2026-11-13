import { MyActions } from '@/components/aksi/MyActions';
import { sesiAksi } from '@/server/auth/aksesAksi';
import { halamanAksi } from '@/server/halamanAksi';
import { AksiService } from '@/server/services/AksiService';

export default async function Page() {
  return halamanAksi(async () => (
    <div className="wrap py-12">
      <MyActions aksi={await AksiService.milikSaya(await sesiAksi())} />
    </div>
  ));
}
