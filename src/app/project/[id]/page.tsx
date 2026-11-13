import type { Metadata } from 'next';
import { MuatDetail } from '@/components/detail/MuatDetail';

export const instant = false;

export const metadata: Metadata = {
  title: 'Project detail | KlimPooL',
};

export default function HalamanProject({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string | string[] }>;
}) {
  return (
    <MuatDetail tipe="project" params={params} searchParams={searchParams} />
  );
}
