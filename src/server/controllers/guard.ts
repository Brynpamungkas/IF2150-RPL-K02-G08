import { cookies } from 'next/headers';
import type { PenggunaUmum } from '@/models/PenggunaUmum';
import { NAMA_COOKIE_SESI } from '@/server/sesi';
import { AutentikasiService } from '@/server/services/AutentikasiService';
import type { Peran } from '@/shared/autentikasi';
import { GalatAplikasi } from '@/shared/galatDonasi';

const service = new AutentikasiService();

/**
 * Pastikan ada pengguna login, kalau tidak lempar GalatAplikasi('BELUM_LOGIN').
 * Panggil di awal controller modul lain: const pengguna = await requireLogin();
 * Di page.tsx, panggil di dalam komponen yang dibungkus <Suspense> karena
 * membaca cookie (aturan cacheComponents).
 */
export async function requireLogin(): Promise<PenggunaUmum> {
  const jar = await cookies();
  const pengguna = await service.penggunaDariSesi(
    jar.get(NAMA_COOKIE_SESI)?.value,
  );
  if (!pengguna) {
    throw new GalatAplikasi('BELUM_LOGIN', 'Please log in to continue.');
  }
  return pengguna;
}

/** Seperti requireLogin(), tetapi membatasi peran; lempar 'DILARANG' bila tidak cocok. */
export async function requireRole(
  ...diizinkan: Peran[]
): Promise<PenggunaUmum> {
  const pengguna = await requireLogin();
  service.pastikanPeran(pengguna, diizinkan);
  return pengguna;
}
