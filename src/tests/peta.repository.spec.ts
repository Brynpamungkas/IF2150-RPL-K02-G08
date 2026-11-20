import { beforeEach, describe, expect, it, vi } from 'vitest';

const query = vi.fn();
vi.mock('@/server/db', () => ({ query: (...a: unknown[]) => query(...a) }));

import { PetaRepository } from '@/server/repositories/peta.repository';

const hitungTanya = (sql: string) => (sql.match(/\?/g) ?? []).length;

beforeEach(() => {
  query.mockReset();
  query.mockResolvedValue([]);
});

describe('PetaRepository.sebaranProject (Q-101, Q-102)', () => {
  it('tanpa wilayah: hanya project terpublikasi berkoordinat, tanpa syarat radius', async () => {
    await new PetaRepository().sebaranProject();
    const [sql, params] = query.mock.calls[0];
    expect(String(sql)).toContain('FROM project');
    expect(String(sql)).toContain("status = 'terpublikasi'");
    expect(String(sql)).toContain('latitude IS NOT NULL AND longitude IS NOT NULL');
    expect(String(sql)).not.toContain('ST_Distance_Sphere');
    expect(params).toEqual([]);
  });

  it('dengan wilayah: menambah ST_Distance_Sphere, urutan bujur lalu lintang, radius dalam meter', async () => {
    await new PetaRepository().sebaranProject({
      lat: -6.9,
      lng: 110.5,
      radiusKm: 30,
    });
    const [sql, params] = query.mock.calls[0];
    expect(String(sql)).toContain(
      'ST_Distance_Sphere(POINT(longitude, latitude), POINT(?, ?)) <= ?',
    );
    expect(params).toEqual([110.5, -6.9, 30_000]);
    expect(hitungTanya(String(sql))).toBe(params.length);
  });

  it('mengembalikan baris dari basis data apa adanya', async () => {
    const baris = [{ tipe: 'project', id: 'mgv' }];
    query.mockResolvedValue(baris);
    expect(await new PetaRepository().sebaranProject()).toBe(baris);
  });
});

describe('PetaRepository.sebaranCampaign (Q-103, Q-104)', () => {
  it('tanpa wilayah: hanya campaign terpublikasi yang periodenya belum berakhir', async () => {
    await new PetaRepository().sebaranCampaign('2026-11-20');
    const [sql, params] = query.mock.calls[0];
    expect(String(sql)).toContain('FROM campaign');
    expect(String(sql)).toContain("status = 'terpublikasi'");
    expect(String(sql)).toContain('periode_selesai >= ?');
    expect(String(sql)).not.toContain('ST_Distance_Sphere');
    expect(params).toEqual(['2026-11-20']);
  });

  it('dengan wilayah: tanggal tetap parameter pertama, radius pecahan diubah ke meter', async () => {
    await new PetaRepository().sebaranCampaign('2026-11-20', {
      lat: -9.65,
      lng: 120.26,
      radiusKm: 0.5,
    });
    const [sql, params] = query.mock.calls[0];
    expect(String(sql)).toContain('ST_Distance_Sphere');
    expect(params).toEqual(['2026-11-20', 120.26, -9.65, 500]);
    expect(hitungTanya(String(sql))).toBe(params.length);
  });
});
