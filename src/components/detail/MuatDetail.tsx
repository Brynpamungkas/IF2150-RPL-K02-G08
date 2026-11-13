import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { DetailCampaignView } from '@/components/views/DetailCampaignView';
import { DetailProjectView } from '@/components/views/DetailProjectView';
import { getIdPenggunaSaatIni } from '@/server/auth/sesiSementara';
import { DetailService } from '@/server/services/detail.service';
import { bacaTabDetail } from '@/shared/detail';
import type { TipeItem } from '@/shared/katalog';

export async function MuatDetail({
  tipe,
  params,
  searchParams,
}: {
  tipe: TipeItem;
  params: Promise<{ id: string }>;
  /** `?tab=` memilih tab awal, mis. dari tombol "See use of funds" di riwayat. */
  searchParams: Promise<{ tab?: string | string[] }>;
}) {
  await connection();
  const { id } = await params;
  const tabAwal = bacaTabDetail((await searchParams).tab);
  // sesi dipakai hanya untuk instruksi relawan (KF22); tanpa sesi, halaman tetap publik.
  const idPengguna = await getIdPenggunaSaatIni();
  const detail = await new DetailService().ambil(tipe, id, idPengguna);
  if (!detail) notFound();

  return tipe === 'project' ? (
    <DetailProjectView detail={detail} tabAwal={tabAwal} />
  ) : (
    <DetailCampaignView detail={detail} tabAwal={tabAwal} />
  );
}
