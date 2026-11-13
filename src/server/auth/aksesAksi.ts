import { cookies } from 'next/headers';
import { AutentikasiService } from '@/server/services/AutentikasiService';
import { NAMA_COOKIE_SESI } from '@/server/sesi';
import { GalatValidasi } from '@/shared/galat';

export interface PenggunaAksi {
  id: string;
  peran: 'pembuat_project' | 'admin' | 'volunteer';
}

/** Adapter DTO UC02–UC04 ke layanan autentikasi resmi; tidak menerima dev cookie. */
export async function sesiAksi(request?: Request): Promise<PenggunaAksi> {
  let token: string | undefined;
  if (request) {
    const pasangan = request.headers
      .get('cookie')
      ?.split(';')
      .map((nilai) => nilai.trim())
      .find((nilai) => nilai.startsWith(`${NAMA_COOKIE_SESI}=`));
    try {
      token = pasangan
        ? decodeURIComponent(pasangan.slice(NAMA_COOKIE_SESI.length + 1))
        : undefined;
    } catch {
      throw new GalatValidasi('Silakan login terlebih dahulu.', 401);
    }
  } else token = (await cookies()).get(NAMA_COOKIE_SESI)?.value;
  if (!token || token.length > 64)
    throw new GalatValidasi('Silakan login terlebih dahulu.', 401);
  const pengguna = await new AutentikasiService().penggunaDariSesi(token);
  if (!pengguna)
    throw new GalatValidasi('Sesi berakhir. Silakan login kembali.', 401);
  return { id: pengguna.idPengguna, peran: pengguna.peran };
}

export function wajibPeranAksi(
  pengguna: PenggunaAksi,
  peran: 'admin' | 'pembuat_project',
): void {
  if (pengguna.peran !== peran)
    throw new GalatValidasi('Anda tidak memiliki akses ke fitur ini.', 403);
}

/** Cookie bukan bukti persetujuan lintas situs. API non-browser tetap dapat memakai sesi. */
export function periksaAsalAksi(request: Request): void {
  const asal = request.headers.get('origin');
  const url = new URL(request.url);
  // Next dapat menormalisasi hostname internal (localhost) berbeda dari Host browser.
  // Host berasal dari request HTTP; jangan percaya X-Forwarded-Host dari klien.
  const asalDiharapkan = `${url.protocol}//${request.headers.get('host') ?? url.host}`;
  if (
    request.headers.get('sec-fetch-site') === 'cross-site' ||
    (asal !== null && asal !== asalDiharapkan)
  ) {
    throw new GalatValidasi('Asal permintaan tidak diizinkan.', 403);
  }
}
