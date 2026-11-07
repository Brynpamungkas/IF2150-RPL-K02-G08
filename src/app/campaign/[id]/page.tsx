import type { Metadata } from 'next';
import { MuatDetail } from '@/components/detail/MuatDetail';

export const instant = false;

export const metadata: Metadata = {
  title: 'Campaign detail | KlimPooL',
};

export default function HalamanCampaign({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <MuatDetail tipe="campaign" params={params} />;
}
