import { describe, expect, it } from 'vitest';
import type { BarisKatalog } from '@/server/repositories/katalog.repository';
import {
  KatalogService,
  hitungPersen,
  keItem,
  tambahHari,
  tanggalWib,
  type SumberKatalog,
} from '@/server/services/katalog.service';
import { KATEGORI, type FilterKatalog } from '@/shared/katalog';

const filter: FilterKatalog = { tipe: 'semua', halaman: 2, batas: 5 };

function baris(sisa: Record<string, unknown> = {}): BarisKatalog {
  return {
    id: 'mgv',
    tipe: 'project',
    judul: 'Sayung Coastal Mangrove Restoration',
    deskripsi: 'Menanam mangrove.',
    kategori: 'Mangroves & coast',
    provinsi: 'Jawa Tengah',
    kota: 'Demak',
    latitude: -6.9,
    longitude: 110.5,
    target_dana: 100_000_000,
    dana_terkumpul: 35_000_000,
    mulai: '2026-11-01',
    selesai: '2027-01-31',
    status_pelaksanaan: 'berjalan',
    kuota: 40,
    relawan_diterima: 31,
    terbuka_donasi: 1,
    terbuka_relawan: 1,
    ...sisa,
  } as BarisKatalog;
}

function repoPalsu(
  hasil: BarisKatalog[],
  total = hasil.length,
  provinsi: string[] = [],
) {
  const panggilan: Array<{ filter: FilterKatalog; tanggal: unknown }> = [];
  const repo: SumberKatalog = {
    async cari(f, t) {
      panggilan.push({ filter: f, tanggal: t });
      return { baris: hasil, total };
    },
    async daftarProvinsi() {
      return provinsi;
    },
  };
  return { repo, panggilan };
}

describe('tanggalWib', () => {
  it('memakai zona WIB: 18.00 UTC sudah hari berikutnya di Indonesia', () => {
    expect(tanggalWib(new Date('2026-11-06T18:00:00Z'))).toBe('2026-11-07');
    expect(tanggalWib(new Date('2026-11-06T16:59:00Z'))).toBe('2026-11-06');
  });
});

describe('tambahHari', () => {
  it('melewati batas bulan dan tahun', () => {
    expect(tambahHari('2026-11-06', 90)).toBe('2027-02-04');
    expect(tambahHari('2026-12-31', 1)).toBe('2027-01-01');
  });
});

describe('hitungPersen', () => {
  it('membulatkan, dan 0 bila target 0', () => {
    expect(hitungPersen(35_000_000, 100_000_000)).toBe(35);
    expect(hitungPersen(1, 3)).toBe(33);
    expect(hitungPersen(10, 0)).toBe(0);
  });
});

describe('keItem', () => {
  it('memetakan baris project dengan angka dan boolean yang benar', () => {
    const item = keItem(baris());
    expect(item).toMatchObject({
      id: 'mgv',
      tipe: 'project',
      latitude: -6.9,
      longitude: 110.5,
      targetDana: 100_000_000,
      persenCapaian: 35,
      terbukaDonasi: true,
      terbukaRelawan: true,
      kuotaRelawan: 40,
      relawanDiterima: 31,
    });
  });

  it('campaign tidak punya status pelaksanaan, kuota, atau relawan', () => {
    const item = keItem(
      baris({
        tipe: 'campaign',
        status_pelaksanaan: null,
        kuota: null,
        relawan_diterima: null,
        terbuka_relawan: 0,
      }),
    );
    expect(item.statusPelaksanaan).toBeNull();
    expect(item.kuotaRelawan).toBeNull();
    expect(item.terbukaRelawan).toBe(false);
  });

  it('koordinat kosong tetap null', () => {
    const item = keItem(baris({ latitude: null, longitude: null }));
    expect(item.latitude).toBeNull();
    expect(item.longitude).toBeNull();
  });
});

describe('KatalogService.cari', () => {
  it('meneruskan filter dan konteks tanggal WIB ke repository', async () => {
    const { repo, panggilan } = repoPalsu([baris()], 11);
    const service = new KatalogService(
      repo,
      () => new Date('2026-11-06T18:00:00Z'),
    );
    const hasil = await service.cari(filter);
    expect(panggilan[0].filter).toBe(filter);
    expect(panggilan[0].tanggal).toEqual({
      hariIni: '2026-11-07',
      batasSegera: '2027-02-05',
    });
    expect(hasil).toMatchObject({ total: 11, halaman: 2, batas: 5 });
    expect(hasil.data).toHaveLength(1);
  });

  it('tidak ada hasil mengembalikan daftar kosong, bukan error', async () => {
    const { repo } = repoPalsu([], 0);
    const hasil = await new KatalogService(repo).cari(filter);
    expect(hasil.data).toEqual([]);
    expect(hasil.total).toBe(0);
  });
});

describe('KatalogService.getOpsi', () => {
  it('kategori dari daftar baku dan provinsi dari data terpublikasi', async () => {
    const { repo } = repoPalsu([], 0, ['Bali', 'Jawa Tengah']);
    const opsi = await new KatalogService(repo).getOpsi();
    expect(opsi.kategori).toEqual(KATEGORI);
    expect(opsi.provinsi).toEqual(['Bali', 'Jawa Tengah']);
  });
});
