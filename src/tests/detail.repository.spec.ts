import { beforeEach, describe, expect, it, vi } from 'vitest';

const query = vi.fn();
vi.mock('@/server/db', () => ({ query: (...a: unknown[]) => query(...a) }));

import { DetailRepository } from '@/server/repositories/detail.repository';

beforeEach(() => query.mockReset());

describe('DetailRepository: titik kumpul tidak bocor ke data publik (KF22)', () => {
  it('query detail project dan campaign tidak memilih lokasi_kumpul', async () => {
    query.mockResolvedValue([]);
    const repo = new DetailRepository();
    await repo.cariProject('p1');
    await repo.cariCampaign('c1');
    for (const [sql] of query.mock.calls) {
      expect(String(sql)).not.toMatch(/lokasi_kumpul/i);
    }
  });

  it('instruksiRelawan mensyaratkan pendaftaran accepted milik pengguna di WHERE', async () => {
    query.mockResolvedValue([{ lokasi: 'Balai desa' }]);
    const hasil = await new DetailRepository().instruksiRelawan('p1', 'u1');
    const [sql, params] = query.mock.calls[0];
    expect(hasil).toBe('Balai desa');
    expect(String(sql)).toMatch(/r\.status_pendaftaran = 'accepted'/);
    expect(String(sql)).toMatch(/r\.id_volunteer = \?/);
    expect(String(sql)).toMatch(/p\.status = 'terpublikasi'/);
    expect(params).toEqual(['p1', 'u1']);
  });

  it('tanpa baris (bukan relawan diterima) hasilnya null', async () => {
    query.mockResolvedValue([]);
    expect(
      await new DetailRepository().instruksiRelawan('p1', 'u9'),
    ).toBeNull();
  });
});
