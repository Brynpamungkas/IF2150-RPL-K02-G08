import { isGalatValidasi } from '@/shared/galat';

/**
 * Menjalankan aksi route handler dan menerjemahkan galat menjadi respons JSON.
 * `GalatValidasi` menjadi 4xx dengan pesannya; galat lain menjadi 500 tanpa
 * membocorkan detail internal.
 */
export async function jalankan(
  aksi: () => Promise<Response>,
  konteksLog: string,
): Promise<Response> {
  try {
    return await aksi();
  } catch (galat) {
    if (isGalatValidasi(galat)) {
      return Response.json(
        galat.rincian
          ? { pesan: galat.message, galat: galat.rincian }
          : { pesan: galat.message },
        { status: galat.status },
      );
    }
    console.error(konteksLog, galat);
    return Response.json(
      { pesan: 'Terjadi kesalahan pada peladen.' },
      { status: 500 },
    );
  }
}

/** Membaca badan JSON; badan kosong atau rusak menjadi `null`. */
export async function bacaJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}
