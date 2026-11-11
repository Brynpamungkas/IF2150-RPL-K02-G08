/**
 * Pemanggil API riwayat (/api/riwayat/*) dari View.
 *
 * Endpoint riwayat memakai bentuk respons modul progres (`{ ...data }` saat
 * berhasil, `{ pesan }` saat gagal), bukan `ApiHasil` milik modul donasi,
 * sehingga tidak memakai `panggilApi`.
 */
export type HasilMinta<T> =
  { ok: true; data: T } | { ok: false; status: number; pesan: string };

const PESAN_KONEKSI =
  'Could not reach the server. Check your connection and try again.';
const PESAN_UMUM =
  'Something went wrong on the server. Please try again later.';

export async function mintaRiwayat<T>(
  url: string,
  signal?: AbortSignal,
): Promise<HasilMinta<T>> {
  let res: Response;
  try {
    res = await fetch(url, { credentials: 'same-origin', signal });
  } catch (e) {
    if (signal?.aborted) throw e;
    return { ok: false, status: 0, pesan: PESAN_KONEKSI };
  }

  const badan = (await res.json().catch(() => null)) as
    (T & { pesan?: string }) | null;
  if (res.ok && badan) return { ok: true, data: badan };
  return {
    ok: false,
    status: res.status,
    pesan: badan?.pesan ?? PESAN_UMUM,
  };
}
