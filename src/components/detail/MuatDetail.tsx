import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { DetailCampaignView } from '@/components/views/DetailCampaignView';
import { DetailProjectView } from '@/components/views/DetailProjectView';
import { getIdPenggunaSaatIni } from '@/server/auth/sesiSementara';
import { DetailService } from '@/server/services/detail.service';
import type { TipeItem } from '@/shared/katalog';

export async function MuatDetail({
  tipe,
  params,
}: {
  tipe: TipeItem;
  params: Promise<{ id: string }>;
}) {
  await connection();
  const { id } = await params;
  // sesi dipakai hanya untuk instruksi relawan (KF22); tanpa sesi, halaman tetap publik.
  const idPengguna = await getIdPenggunaSaatIni();
  const detail = await new DetailService().ambil(tipe, id, idPengguna);
  if (!detail) notFound();

  return tipe === 'project' ? (
    <DetailProjectView detail={detail} />
  ) : (
    <DetailCampaignView detail={detail} />
  );
}
