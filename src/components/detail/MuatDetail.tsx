import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { DetailCampaignView } from '@/components/views/DetailCampaignView';
import { DetailProjectView } from '@/components/views/DetailProjectView';
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
  const detail = await new DetailService().ambil(tipe, id);
  if (!detail) notFound();

  return tipe === 'project' ? (
    <DetailProjectView detail={detail} />
  ) : (
    <DetailCampaignView detail={detail} />
  );
}
