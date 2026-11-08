import type { HasilKatalog, ItemKatalog } from '@/shared/katalog';

export interface Termuat {
  kunci: string;
  data: ItemKatalog[];
  total: number;
  halaman: number;
}

export const PESAN_GALAT_UMUM = 'The actions could not be loaded. Please try again.';

export function gabungHalaman(
  lama: Termuat | null,
  kunci: string,
  h: HasilKatalog,
): Termuat | null {
  if (!lama || lama.kunci !== kunci) return lama;
  return {
    ...lama,
    data: [...lama.data, ...h.data],
    total: h.total,
    halaman: h.halaman,
  };
}

export type HasilMuatLagi =
  | { status: 'ok'; halaman: HasilKatalog }
  | { status: 'gagal'; pesan: string };

export async function muatHalamanBerikut(
  ambil: (halaman: number) => Promise<HasilKatalog>,
  halamanSekarang: number,
): Promise<HasilMuatLagi> {
  try {
    return { status: 'ok', halaman: await ambil(halamanSekarang + 1) };
  } catch (e) {
    return {
      status: 'gagal',
      pesan: e instanceof Error && e.message ? e.message : PESAN_GALAT_UMUM,
    };
  }
}
