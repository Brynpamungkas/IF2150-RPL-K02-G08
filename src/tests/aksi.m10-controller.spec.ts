import { beforeEach, describe, expect, it, vi } from 'vitest';
import { buatCampaign } from '@/server/controllers/CampaignController';
import { buatProject } from '@/server/controllers/ProjectController';
import {
  kelolaAksi,
  milikSaya,
  parameterAksi,
} from '@/server/controllers/AksiController';
import {
  ajukan,
  antrean,
  putuskan,
} from '@/server/controllers/VerifikasiController';
import { GalatValidasi } from '@/shared/galat';
import { aksiUji, dataAksi } from './fixtures/aksi';

const { service, sesi, asal } = vi.hoisted(() => ({
  service: {
    buat: vi.fn(),
    lihat: vi.fn(),
    ubah: vi.fn(),
    milikSaya: vi.fn(),
    ajukan: vi.fn(),
    antrean: vi.fn(),
    putuskan: vi.fn(),
  },
  sesi: vi.fn(),
  asal: vi.fn(),
}));
vi.mock('@/server/services/AksiService', () => ({ AksiService: service }));
vi.mock('@/server/auth/aksesAksi', () => ({
  sesiAksi: sesi,
  periksaAsalAksi: asal,
}));
const user = { id: 'owner', peran: 'pembuat_project' };
function request(badan: unknown = dataAksi) {
  return new Request('http://localhost/api/campaigns', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(badan),
  });
}
beforeEach(() => {
  vi.resetAllMocks();
  sesi.mockResolvedValue(user);
  for (const name of ['buat', 'lihat', 'ubah', 'ajukan', 'putuskan'] as const)
    service[name].mockResolvedValue(aksiUji());
  service.milikSaya.mockResolvedValue([]);
  service.antrean.mockResolvedValue([]);
});

describe('HIUPL C19 CampaignController', () => {
  it('C19-UT01 pembuatan sah didelegasikan sebagai campaign dan menghasilkan 201 no-store', async () => {
    const req = request();
    const response = await buatCampaign(req);
    expect(response.status).toBe(201);
    expect(response.headers.get('Cache-Control')).toBe('no-store');
    expect(service.buat).toHaveBeenCalledWith(user, 'campaign', dataAksi);
    expect(asal).toHaveBeenCalledWith(req);
  });
  it('C19-UT02 sesi hilang menghasilkan 401 dan service tidak dipanggil', async () => {
    sesi.mockRejectedValue(new GalatValidasi('Silakan login.', 401));
    expect((await buatCampaign(request())).status).toBe(401);
    expect(service.buat).not.toHaveBeenCalled();
  });
  it('C19-UT03 validasi service dikembalikan sebagai 400 dengan pesan per kolom', async () => {
    service.buat.mockRejectedValue(
      new GalatValidasi('Data tidak valid.', 400, {
        targetDana: 'Dana harus positif.',
      }),
    );
    const response = await buatCampaign(request());
    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      pesan: 'Data tidak valid.',
      galat: { targetDana: 'Dana harus positif.' },
    });
  });
  it('C19-UT04 getDetailCampaign privat didelegasikan dengan sesi pemanggil', async () => {
    const response = await kelolaAksi(request(), 'campaign', 'aksi-1');
    expect(response.status).toBe(200);
    expect(service.lihat).toHaveBeenCalledWith(user, 'campaign', 'aksi-1');
  });
});
describe('HIUPL C22 ProjectController', () => {
  it('C22-UT01 informasi dasar didelegasikan sebagai project', async () => {
    const data = { ...dataAksi, tahap: 'informasi' };
    expect((await buatProject(request(data))).status).toBe(201);
    expect(service.buat).toHaveBeenCalledWith(user, 'project', data);
  });
  it('C22-UT02 isiKebutuhan/perbaruiInformasi memakai PATCH dan ID yang sama', async () => {
    const response = await kelolaAksi(
      request({ kebutuhan: 'Bibit' }),
      'project',
      'aksi-1',
      true,
    );
    expect(response.status).toBe(200);
    expect(service.ubah).toHaveBeenCalledWith(user, 'project', 'aksi-1', {
      kebutuhan: 'Bibit',
    });
  });
  it('C22-UT03 parameter jenis dan ID berbahaya ditolak 404', () => {
    for (const [jenis, id] of [
      ['project; DROP TABLE project', 'aksi-1'],
      ['project', "x' OR 1=1"],
      ['project', 'x'.repeat(37)],
    ])
      expect(() => parameterAksi(jenis, id)).toThrow();
  });
  it('C22-UT04 JSON rusak menjadi null dan galat hak akses tidak menjadi sukses', async () => {
    service.buat.mockRejectedValue(
      new GalatValidasi('Badan tidak valid.', 400),
    );
    const req = new Request('http://localhost/api/projects', {
      method: 'POST',
      body: '{',
    });
    expect((await buatProject(req)).status).toBe(400);
    expect(service.buat).toHaveBeenCalledWith(user, 'project', null);
    service.ubah.mockRejectedValue(new GalatValidasi('Tidak ditemukan.', 404));
    expect(
      (await kelolaAksi(request(), 'project', 'aksi-1', true)).status,
    ).toBe(404);
  });
});
describe('HIUPL C26 VerifikasiController', () => {
  it('C26-UT07 pengajuan, antrean dan keputusan meneruskan sesi/jenis/ID yang benar', async () => {
    const req = request({ keputusan: 'setujui' });
    expect((await ajukan(req, 'project', 'aksi-1')).status).toBe(200);
    expect(service.ajukan).toHaveBeenCalledWith(user, 'project', 'aksi-1');
    expect((await antrean(req)).status).toBe(200);
    expect(service.antrean).toHaveBeenCalledWith(user);
    expect((await putuskan(req, 'project', 'aksi-1')).status).toBe(200);
    expect(service.putuskan).toHaveBeenCalledWith(user, 'project', 'aksi-1', {
      keputusan: 'setujui',
    });
  });
  it('C26-UT08 non-admin/asal salah/konflik status dikembalikan sebagai 403/409', async () => {
    service.antrean.mockRejectedValue(new GalatValidasi('Admin saja.', 403));
    expect((await antrean(request())).status).toBe(403);
    service.putuskan.mockRejectedValue(
      new GalatValidasi('Sudah diputuskan.', 409),
    );
    expect((await putuskan(request(), 'project', 'aksi-1')).status).toBe(409);
    asal.mockImplementation(() => {
      throw new GalatValidasi('Asal ditolak.', 403);
    });
    expect((await ajukan(request(), 'project', 'aksi-1')).status).toBe(403);
  });
  it('C26-UT09 gangguan internal menjadi 500 tanpa membocorkan rincian database', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      service.putuskan.mockRejectedValue(
        new Error('secret database connection'),
      );
      const response = await putuskan(request(), 'project', 'aksi-1');
      expect(response.status).toBe(500);
      expect(await response.json()).toEqual({
        pesan: 'Terjadi kesalahan pada peladen.',
      });
    } finally {
      log.mockRestore();
    }
  });
  it('C10-UT05 endpoint My Actions mengembalikan daftar milik pengguna dengan no-store', async () => {
    const response = await milikSaya(request());
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ aksi: [] });
    expect(service.milikSaya).toHaveBeenCalledWith(user);
  });
});
