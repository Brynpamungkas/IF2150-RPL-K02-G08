import type { RowDataPacket } from 'mysql2/promise';
import { cookies } from 'next/headers';
import { query } from '@/server/db';
import { GalatValidasi } from '@/shared/galat';

export interface PenggunaAksi {
  id: string;
  peran: 'pembuat_project' | 'admin' | 'volunteer';
}

/** Adapter UC02–UC04 selama PR login belum terintegrasi. Tidak menerima dev cookie. */
export async function sesiAksi(request?: Request): Promise<PenggunaAksi> {
  let token: string | undefined;
  if (request) {
    const pasangan = request.headers
      .get('cookie')
      ?.split(';')
      .map((nilai) => nilai.trim())
      .find((nilai) => nilai.startsWith('klimpool_sesi='));
    try {
      token = pasangan
        ? decodeURIComponent(pasangan.slice('klimpool_sesi='.length))
        : undefined;
    } catch {
      throw new GalatValidasi('Silakan login terlebih dahulu.', 401);
    }
  } else token = (await cookies()).get('klimpool_sesi')?.value;
  if (!token || token.length > 64)
    throw new GalatValidasi('Silakan login terlebih dahulu.', 401);
  const [baris] = await query<RowDataPacket & PenggunaAksi>(
    `
    SELECT p.id_pengguna AS id, p.peran FROM sesi_login s
    JOIN pengguna p ON p.id_pengguna = s.id_pengguna
    JOIN akun a ON a.id_pengguna = p.id_pengguna
    WHERE s.id_sesi = ? AND s.status_sesi = 'aktif'
      AND s.waktu_kedaluwarsa > UTC_TIMESTAMP() AND s.waktu_mulai <= UTC_TIMESTAMP()
      AND a.status_akun = 'aktif'`,
    [token],
  );
  if (!baris)
    throw new GalatValidasi('Sesi berakhir. Silakan login kembali.', 401);
  return { id: baris.id, peran: baris.peran };
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
  if (
    request.headers.get('sec-fetch-site') === 'cross-site' ||
    (asal !== null && asal !== new URL(request.url).origin)
  ) {
    throw new GalatValidasi('Asal permintaan tidak diizinkan.', 403);
  }
}
