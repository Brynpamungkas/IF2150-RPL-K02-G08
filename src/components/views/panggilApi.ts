import type { ApiHasil } from '@/shared/dto';
import { PESAN_GALAT } from '@/shared/galat';

/**
 * Satu-satunya jalan View ke server (batas Client-Server).
 * Kegagalan jaringan diubah menjadi galat GAGAL_KONEKSI agar View bisa menawarkan "Coba lagi".
 */
export async function panggilApi<T>(
  url: string,
  init?: RequestInit,
): Promise<ApiHasil<T>> {
  try {
    const res = await fetch(url, { credentials: 'same-origin', ...init });
    return (await res.json()) as ApiHasil<T>;
  } catch {
    return {
      ok: false,
      kode: 'GAGAL_KONEKSI',
      pesan: PESAN_GALAT.GAGAL_KONEKSI,
    };
  }
}
