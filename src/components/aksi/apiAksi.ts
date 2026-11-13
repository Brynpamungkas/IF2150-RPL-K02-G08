import { GalatValidasi } from '@/shared/galat';

export async function apiAksi<T>(
  url: string,
  badan?: unknown,
  method = 'POST',
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(url, {
      credentials: 'same-origin',
      cache: 'no-store',
      ...(badan !== undefined
        ? {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(badan),
          }
        : {}),
    });
  } catch {
    throw new GalatValidasi(
      'Koneksi gagal. Isian Anda tetap tersimpan di halaman ini. Coba lagi.',
      503,
    );
  }
  const hasil = await response.json();
  if (!response.ok)
    throw new GalatValidasi(
      hasil.pesan ?? 'Permintaan gagal. Coba lagi.',
      response.status,
      hasil.galat,
    );
  return hasil as T;
}
