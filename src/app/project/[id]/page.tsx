import type { Metadata } from 'next';
import { MuatDetail } from '@/components/detail/MuatDetail';

export const instant = false;

export const metadata: Metadata = {
  title: 'Project detail | KlimPooL',
};

export default function HalamanProject({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return <MuatDetail tipe="project" params={params} />;
}
