import type { ResponsApi } from '@/shared/dto';

/** Satu-satunya jalan dari View ke server. Tidak pernah melempar galat. */
export async function panggilApi<T>(
  url: string,
  metode: 'GET' | 'POST' = 'GET',
  isi?: unknown,
): Promise<ResponsApi<T>> {
  try {
    const res = await fetch(url, {
      method: metode,
      headers:
        isi === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: isi === undefined ? undefined : JSON.stringify(isi),
      cache: 'no-store',
    });
    return (await res.json()) as ResponsApi<T>;
  } catch {
    return {
      ok: false,
      galat: {
        kode: 'JARINGAN',
        pesan: 'Cannot reach the server. Check your connection.',
      },
    };
  }
}
