import { periksaAsalAksi, sesiAksi } from '@/server/auth/aksesAksi';
import { bacaJson, jalankan } from '@/server/http';
import { AksiService } from '@/server/services/AksiService';
import { parameterAksi } from './AksiController';

export function ajukan(
  request: Request,
  jenis: string,
  id: string,
): Promise<Response> {
  return jalankan(async () => {
    periksaAsalAksi(request);
    const tipe = parameterAksi(jenis, id);
    const aksi = await AksiService.ajukan(await sesiAksi(request), tipe, id);
    return Response.json(
      { aksi },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  }, '[verifikasi] ajukan');
}

export function antrean(request: Request): Promise<Response> {
  return jalankan(
    async () =>
      Response.json(
        { aksi: await AksiService.antrean(await sesiAksi(request)) },
        { headers: { 'Cache-Control': 'no-store' } },
      ),
    '[verifikasi] antrean',
  );
}

export function putuskan(
  request: Request,
  jenis: string,
  id: string,
): Promise<Response> {
  return jalankan(async () => {
    periksaAsalAksi(request);
    const tipe = parameterAksi(jenis, id);
    const pengguna = await sesiAksi(request);
    const aksi = await AksiService.putuskan(
      pengguna,
      tipe,
      id,
      await bacaJson(request),
    );
    return Response.json(
      { aksi },
      { headers: { 'Cache-Control': 'no-store' } },
    );
  }, '[verifikasi] keputusan');
}
