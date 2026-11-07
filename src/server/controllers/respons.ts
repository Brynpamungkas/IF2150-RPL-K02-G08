/** Pendukung Controller: bentuk respons JSON, pembacaan token sesi, dan pemetaan galat. */
import type { ApiGagal, ApiSukses } from '@/shared/dto';
import { GalatAplikasi, PESAN_GALAT, STATUS_HTTP } from '@/shared/galat';

const NAMA_COOKIE_SESI = 'klimpool_sesi';

export function sukses<T>(data: T, status = 200): Response {
  return Response.json({ ok: true, data } satisfies ApiSukses<T>, { status });
}

/** Galat yang dikenal dipetakan ke kode dan status HTTP. Galat lain menjadi 500 tanpa membocorkan detail. */
export function gagal(e: unknown): Response {
  if (e instanceof GalatAplikasi) {
    return Response.json(
      { ok: false, kode: e.kode, pesan: e.message } satisfies ApiGagal,
      { status: STATUS_HTTP[e.kode] },
    );
  }
  console.error('[klimpool] galat tak terduga:', e);
  return Response.json(
    {
      ok: false,
      kode: 'GALAT_SERVER',
      pesan: PESAN_GALAT.GALAT_SERVER,
    } satisfies ApiGagal,
    { status: STATUS_HTTP.GALAT_SERVER },
  );
}

export function pesanDariGalat(e: unknown): string {
  return e instanceof GalatAplikasi ? e.message : PESAN_GALAT.GALAT_SERVER;
}

export function ambilTokenSesi(req: Request): string | null {
  const cookie = req.headers.get('cookie');
  if (!cookie) return null;
  for (const bagian of cookie.split(';')) {
    const [nama, ...sisa] = bagian.trim().split('=');
    if (nama === NAMA_COOKIE_SESI) return decodeURIComponent(sisa.join('='));
  }
  return null;
}

export async function bacaJson(req: Request): Promise<unknown> {
  try {
    return await req.json();
  } catch {
    throw new GalatAplikasi('PERMINTAAN_TIDAK_VALID');
  }
}
