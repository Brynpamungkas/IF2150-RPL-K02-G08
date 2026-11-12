import { cookies } from 'next/headers';
import type { PenggunaUmum } from '@/models/PenggunaUmum';
import { NAMA_COOKIE_SESI } from '@/server/sesi';
import { AutentikasiService } from '@/server/services/AutentikasiService';
import type { Peran } from '@/shared/autentikasi';
import { GalatAplikasi } from '@/shared/galatDonasi';

const service = new AutentikasiService();

/**
 * Pengguna pemilik cookie sesi, atau null bila tamu, sesi berakhir/kedaluwarsa,
 * atau akun nonaktif (cekStatusLogin). Untuk halaman yang tetap publik bagi tamu.
 * Di page.tsx, panggil di dalam komponen yang dibungkus <Suspense> karena
 * membaca cookie (aturan cacheComponents).
 */
export async function penggunaSaatIni(): Promise<PenggunaUmum | null> {
  const jar = await cookies();
  return service.penggunaDariSesi(jar.get(NAMA_COOKIE_SESI)?.value);
}

/**
 * Pastikan ada pengguna login, kalau tidak lempar GalatAplikasi('BELUM_LOGIN').
 * Panggil di awal controller modul lain: const pengguna = await requireLogin();
 */
export async function requireLogin(): Promise<PenggunaUmum> {
  const pengguna = await penggunaSaatIni();
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
