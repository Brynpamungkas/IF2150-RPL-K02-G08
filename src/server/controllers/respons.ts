/** Pendukung Controller: bentuk respons JSON, pembacaan body, dan pemetaan galat. */
import { unstable_rethrow } from 'next/navigation';
import type { ApiGagal, ApiSukses } from '@/shared/donasi';
import { GalatAplikasi, PESAN_GALAT, STATUS_HTTP } from '@/shared/galatDonasi';

/** Header untuk respons berisi data pribadi (mis. bukti transaksi): jangan disimpan cache bersama. */
export const TANPA_CACHE: HeadersInit = {
  'Cache-Control': 'private, no-store',
};

export function sukses<T>(
  data: T,
  status = 200,
  headers?: HeadersInit,
): Response {
  return Response.json({ ok: true, data } satisfies ApiSukses<T>, {
    status,
    headers,
  });
}

/** Galat yang dikenal dipetakan ke kode dan status HTTP. Galat lain menjadi 500 tanpa membocorkan detail. */
export function gagal(e: unknown, headers?: HeadersInit): Response {
  // Sinyal internal Next.js (mis. cookies() saat prerender dengan cacheComponents)
  // harus diteruskan, bukan diubah menjadi 500.
  unstable_rethrow(e);
  if (e instanceof GalatAplikasi) {
    return Response.json(
      { ok: false, kode: e.kode, pesan: e.message } satisfies ApiGagal,
      { status: STATUS_HTTP[e.kode], headers },
    );
  }
  console.error('[klimpool] galat tak terduga:', e);
  return Response.json(
    {
      ok: false,
      kode: 'GALAT_SERVER',
      pesan: PESAN_GALAT.GALAT_SERVER,
    } satisfies ApiGagal,
    { status: STATUS_HTTP.GALAT_SERVER, headers },
  );
}

export function pesanDariGalat(e: unknown): string {
  return e instanceof GalatAplikasi ? e.message : PESAN_GALAT.GALAT_SERVER;
}

export async function bacaJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    throw new GalatAplikasi('PERMINTAAN_TIDAK_VALID');
  }
}
