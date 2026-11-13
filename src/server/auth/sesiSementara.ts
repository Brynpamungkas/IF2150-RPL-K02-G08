import { penggunaSaatIni } from '@/server/controllers/guard';

/**
 * Id pengguna yang sedang login, atau null bila tamu (issue #14).
 *
 * Dibaca dari cookie sesi `klimpool_sesi` yang dibuat saat login, lewat
 * `penggunaSaatIni()` di guard.ts, sehingga sesi berakhir, kedaluwarsa, atau
 * akun nonaktif dianggap belum login. Cookie dev `klimpool_dev_user` tidak
 * lagi diterima; untuk pengujian, login dengan akun seed (lihat README).
 *
 * Nama berkas dipertahankan agar pemanggil lama (relawan, dokumentasi, halaman
 * detail, progres) tidak perlu diubah.
 */
export async function getIdPenggunaSaatIni(): Promise<string | null> {
  return (await penggunaSaatIni())?.idPengguna ?? null;
}
