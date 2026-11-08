import { describe, expect, it } from 'vitest';
import {
  SQL_PROVINSI,
  bangunKueri,
  escapeLike,
} from '@/server/repositories/katalog.repository';
import type { FilterKatalog } from '@/shared/katalog';

const tanggal = { hariIni: '2026-11-06', batasSegera: '2027-02-04' };
const dasar: FilterKatalog = { tipe: 'semua', halaman: 1, batas: 20 };

const hitungTanya = (sql: string) => (sql.match(/\?/g) ?? []).length;

describe('bangunKueri', () => {
  it('hanya mengambil data berstatus terpublikasi dari project dan campaign (KF14)', () => {
    const { sqlData, sqlTotal } = bangunKueri(dasar, tanggal);
    for (const sql of [sqlData, sqlTotal]) {
      expect(sql).toContain('FROM project p');
      expect(sql).toContain('FROM campaign c');
      expect(sql.match(/status = 'terpublikasi'/g)).toHaveLength(2);
    }
  });

  it('tanpa filter tidak ada klausa WHERE di luar sumber', () => {
    const { sqlTotal, paramsTotal } = bangunKueri(dasar, tanggal);
    expect(sqlTotal).not.toMatch(/\)\s+k\s+WHERE/);
    expect(paramsTotal).toEqual([]);
  });

  it('jumlah tanda tanya selalu sama dengan jumlah parameter, untuk semua kombinasi filter', () => {
    const kombinasi: FilterKatalog[] = [
      dasar,
      { ...dasar, kataKunci: 'mangrove' },
      { ...dasar, tipe: 'project', kategori: 'Clean water' },
      { ...dasar, lokasi: 'Jawa Tengah', status: 'donasi' },
      { ...dasar, status: 'relawan', periode: 'berjalan' },
      { ...dasar, status: 'selesai', periode: 'lalu' },
      { ...dasar, periode: 'segera', halaman: 3, batas: 10 },
      {
        kataKunci: 'air',
        tipe: 'campaign',
        kategori: 'Disaster relief',
        lokasi: 'Sulawesi Selatan',
        status: 'donasi',
        periode: 'berjalan',
        halaman: 2,
        batas: 5,
      },
    ];
    for (const filter of kombinasi) {
      const k = bangunKueri(filter, tanggal);
      expect(hitungTanya(k.sqlData)).toBe(k.paramsData.length);
      expect(hitungTanya(k.sqlTotal)).toBe(k.paramsTotal.length);
    }
  });

  it('kata kunci, kategori, dan lokasi tidak pernah masuk ke teks SQL (anti SQL injection)', () => {
    const jahat = "x'; DROP TABLE project; --";
    const k = bangunKueri(
      { ...dasar, kataKunci: jahat, kategori: jahat, lokasi: jahat },
      tanggal,
    );
    expect(k.sqlData).not.toContain('DROP TABLE');
    expect(k.sqlTotal).not.toContain('DROP TABLE');
    expect(k.paramsData).toContain(jahat);
  });

  it('beberapa filter digabung dengan AND', () => {
    const { sqlTotal } = bangunKueri(
      {
        ...dasar,
        tipe: 'project',
        kategori: 'Clean water',
        lokasi: 'Jawa Barat',
      },
      tanggal,
    );
    expect(sqlTotal).toContain('k.tipe = ?');
    expect(sqlTotal).toContain('k.kategori = ?');
    expect(sqlTotal).toContain('(k.provinsi = ? OR k.kota = ?)');
    expect(sqlTotal.match(/ AND /g)!.length).toBeGreaterThanOrEqual(2);
  });

  it('paginasi: batas dan offset dihitung dari halaman', () => {
    const k = bangunKueri({ ...dasar, halaman: 3, batas: 10 }, tanggal);
    expect(k.paramsData.slice(-2)).toEqual([10, 20]);
  });

  it('filter periode "segera" memakai batas 90 hari dari konteks', () => {
    const k = bangunKueri({ ...dasar, periode: 'segera' }, tanggal);
    expect(k.paramsTotal).toEqual(['2026-11-06', '2027-02-04']);
  });
});

describe('escapeLike', () => {
  it('meloloskan %, _, dan karakter escape agar dicari apa adanya', () => {
    expect(escapeLike('100%_air|')).toBe('100|%|_air||');
  });
  it('teks biasa tidak berubah', () => {
    expect(escapeLike('mangrove Demak')).toBe('mangrove Demak');
  });
});

describe('SQL_PROVINSI', () => {
  it('hanya mengambil provinsi dari project dan campaign terpublikasi', () => {
    expect(SQL_PROVINSI.match(/status = 'terpublikasi'/g)).toHaveLength(2);
    expect(SQL_PROVINSI).toContain('UNION');
  });
});
