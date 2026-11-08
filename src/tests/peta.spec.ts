import { describe, expect, it, vi } from 'vitest';
import {
  PetaController,
  bacaPermintaan,
} from '@/server/controllers/peta.controller';
import { GalatValidasi } from '@/server/controllers/pencarian.controller';
import type { BarisSebaran } from '@/server/repositories/peta.repository';
import {
  PetaWilayah,
  pecahKoordinat,
  type SumberSebaran,
} from '@/server/services/peta.service';

function baris(ubah: Record<string, unknown> = {}): BarisSebaran {
  return {
    tipe: 'project',
    id: 'p1',
    judul: 'Judul',
    kota: 'Demak',
    provinsi: 'Jawa Tengah',
    kategori: 'Clean water',
    latitude: '-6.9',
    longitude: '110.5',
    target_dana: '1000',
    dana_terkumpul: '250',
    ...ubah,
  } as unknown as BarisSebaran;
}

function sumber() {
  return {
    sebaranProject: vi.fn(async () => [baris()]),
    sebaranCampaign: vi.fn(async () => [baris({ tipe: 'campaign', id: 'c1' })]),
  } satisfies SumberSebaran;
}

const SEKARANG = () => new Date('2026-11-07T20:00:00Z');

describe('pecahKoordinat', () => {
  it('membaca "lat,lng"', () => {
    expect(pecahKoordinat('-6.9, 110.5')).toEqual({ lat: -6.9, lng: 110.5 });
  });
  it('menolak format salah dan di luar rentang', () => {
    expect(pecahKoordinat('abc')).toBeNull();
    expect(pecahKoordinat('95,10')).toBeNull();
    expect(pecahKoordinat('10,190')).toBeNull();
    expect(pecahKoordinat('')).toBeNull();
  });
});

describe('PetaWilayah', () => {
  it('radius 0 memanggil sumber tanpa wilayah dan mengubah angka', async () => {
    const repo = sumber();
    const hasil = await new PetaWilayah(
      '',
      0,
      repo,
      SEKARANG,
    ).tampilkanSebaranProject();
    expect(repo.sebaranProject).toHaveBeenCalledWith(undefined);
    expect(hasil[0]).toMatchObject({
      latitude: -6.9,
      longitude: 110.5,
      targetDana: 1000,
      danaTerkumpul: 250,
    });
  });

  it('radius > 0 meneruskan wilayah dalam kilometer', async () => {
    const repo = sumber();
    await new PetaWilayah(
      '-6.9,110.5',
      25,
      repo,
      SEKARANG,
    ).tampilkanSebaranProject();
    expect(repo.sebaranProject).toHaveBeenCalledWith({
      lat: -6.9,
      lng: 110.5,
      radiusKm: 25,
    });
  });

  it('campaign memakai tanggal hari ini zona WIB', async () => {
    const repo = sumber();
    await new PetaWilayah('', 0, repo, SEKARANG).tampilkanSebaranCampaign();
    expect(repo.sebaranCampaign).toHaveBeenCalledWith('2026-11-08', undefined);
  });

  it('radius > 0 dengan pusat tidak valid ditolak', async () => {
    await expect(
      new PetaWilayah('xx', 5, sumber(), SEKARANG).tampilkanSebaranProject(),
    ).rejects.toThrow('koordinatPusat');
  });
});

describe('bacaPermintaan', () => {
  const q = (s: string) => new URLSearchParams(s);

  it('bawaan', () => {
    expect(bacaPermintaan(q(''))).toEqual({
      jenis: 'semua',
      koordinatPusat: '',
      radius: 0,
    });
  });
  it('membaca jenis, pusat, dan radius', () => {
    expect(
      bacaPermintaan(q('jenis=project&pusat=-6.9,110.5&radius=30')),
    ).toEqual({
      jenis: 'project',
      koordinatPusat: '-6.9,110.5',
      radius: 30,
    });
  });
  it.each([
    'jenis=lain',
    'radius=-1',
    'radius=abc',
    'radius=99999',
    'radius=10',
    'radius=10&pusat=salah',
  ])('menolak %s', (s) => {
    expect(() => bacaPermintaan(q(s))).toThrow(GalatValidasi);
  });
});

describe('PetaController.getSebaran', () => {
  it('menggabungkan project dan campaign', async () => {
    const repo = sumber();
    const c = new PetaController(
      (k, r) => new PetaWilayah(k, r, repo, SEKARANG),
    );
    const hasil = await c.getSebaran(new URLSearchParams());
    expect(hasil.map((t) => t.tipe)).toEqual(['project', 'campaign']);
  });

  it('jenis=project tidak menyentuh campaign', async () => {
    const repo = sumber();
    const c = new PetaController(
      (k, r) => new PetaWilayah(k, r, repo, SEKARANG),
    );
    const hasil = await c.getSebaran(new URLSearchParams('jenis=project'));
    expect(hasil).toHaveLength(1);
    expect(repo.sebaranCampaign).not.toHaveBeenCalled();
  });
});
