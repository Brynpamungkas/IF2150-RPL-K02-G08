import { connection } from 'next/server';
import { DemoDonasi } from './DemoDonasi';

/**
 * Halaman demo UC06 (sementara, sampai halaman detail campaign/project tersambung).
 * Pola sama dengan halaman detail: dirender saat request (connection) dan boleh
 * memblokir navigasi (instant = false), karena bergantung pada params dinamis.
 */
export const instant = false;

export default async function HalamanDonasi({
  params,
}: {
  params: Promise<{ jenis: string; id: string }>;
}) {
  await connection();
  const { jenis, id } = await params;
  return <DemoDonasi jenis={jenis} id={decodeURIComponent(id)} />;
}
