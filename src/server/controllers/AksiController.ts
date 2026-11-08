import { periksaAsalAksi, sesiAksi } from '@/server/auth/aksesAksi';
import { bacaJson, jalankan } from '@/server/http';
import { AksiService } from '@/server/services/AksiService';
import { adalahJenisAksi, type JenisAksi } from '@/shared/aksi';
import { GalatValidasi } from '@/shared/galat';

export function parameterAksi(jenis: string, id: string): JenisAksi {
  if (!adalahJenisAksi(jenis) || !/^[a-zA-Z0-9_-]{1,36}$/.test(id)) {
    throw new GalatValidasi('Aksi tidak ditemukan.', 404);
  }
  return jenis;
}

export function buatAksi(
  request: Request,
  jenis: JenisAksi,
): Promise<Response> {
  return jalankan(async () => {
    periksaAsalAksi(request);
    const pengguna = await sesiAksi(request);
    const aksi = await AksiService.buat(
      pengguna,
      jenis,
      await bacaJson(request),
    );
    return Response.json(
      { aksi },
      { status: 201, headers: { 'Cache-Control': 'no-store' } },
    );
  }, '[aksi] buat');
}

export function kelolaAksi(
  request: Request,
  jenis: string,
  id: string,
  ubah = false,
): Promise<Response> {
  return jalankan(async () => {
    const tipe = parameterAksi(jenis, id);
    if (ubah) periksaAsalAksi(request);
    const pengguna = await sesiAksi(request);
    const aksi = ubah
      ? await AksiService.ubah(pengguna, tipe, id, await bacaJson(request))
      : await AksiService.lihat(pengguna, tipe, id);
    return Response.json(
      { aksi },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  }, '[aksi] kelola');
}

export function milikSaya(request: Request): Promise<Response> {
  return jalankan(
    async () =>
      Response.json(
        { aksi: await AksiService.milikSaya(await sesiAksi(request)) },
        { headers: { 'Cache-Control': 'no-store' } },
      ),
    '[aksi] milik saya',
  );
}
