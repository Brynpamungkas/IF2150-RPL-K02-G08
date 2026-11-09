import type { Metadata } from 'next';
import { connection } from 'next/server';
import { HalamanBuktiView } from '@/components/views/DonasiView';

export const metadata: Metadata = {
  title: 'Donation receipt | KlimPooL',
};

/**
 * Halaman bukti transaksi (KF17). Dirender saat request (connection) dan boleh
 * memblokir navigasi (instant = false) karena bergantung pada params dinamis,
 * sama dengan pola halaman detail. Data diambil client lewat API (Algo-122).
 */
export const instant = false;

export default async function HalamanBukti({
  params,
}: {
  params: Promise<{ idTransaksi: string }>;
}) {
  await connection();
  const { idTransaksi } = await params;
  const id = decodeURIComponent(idTransaksi);
  return <HalamanBuktiView key={id} idTransaksi={id} />;
}
