import { cookies } from 'next/headers';

/**
 * Pengganti sementara untuk pembacaan sesi login.
 *
 * TODO(#14): ganti dengan pembacaan sesi yang sebenarnya begitu
 * "Implement login, sesi, dan pembatasan akses (API)" selesai. Seluruh
 * pemanggil cukup memakai `getIdPenggunaSaatIni()`, sehingga penggantian
 * terbatas pada berkas ini saja.
 *
 * Selama pengembangan, id pengguna dibaca dari cookie `klimpool_dev_user`.
 * Contoh pengujian dengan akun dari seed (`docs/M8` dan `db/migrations/002_seed.sql`):
 *
 *   document.cookie = 'klimpool_dev_user=u2';  // Sari, pembuat project "mgv"
 *   document.cookie = 'klimpool_dev_user=u1';  // Andi, volunteer
 *   document.cookie = 'klimpool_dev_user=u3';  // Review Team, admin
 *
 * Tanpa cookie tersebut, pengguna dianggap belum login.
 */
export async function getIdPenggunaSaatIni(): Promise<string | null> {
  const jar = await cookies();
  const nilai = jar.get('klimpool_dev_user')?.value?.trim();
  return nilai ? nilai : null;
}
