import { describe, expect, it } from 'vitest';
import type { ItemKatalog } from '@/shared/katalog';
import {
  FILTER_KOSONG,
  adaFilter,
  bacaFilterUrl,
  fotoAksi,
  hrefDetail,
  keQueryApi,
  keQueryUrl,
  labelStatus,
  persenBatang,
  rupiahRingkas,
  teksRelawan,
} from '@/shared/explore';
import { aturPin, letakPopup, proyeksi } from '@/shared/peta';

function item(ubah: Partial<ItemKatalog> = {}): ItemKatalog {
  return {
    id: 'x1',
    tipe: 'project',
    judul: 'Judul',
    deskripsi: '',
    kategori: 'Clean water',
    provinsi: 'Bali',
    kota: 'Tabanan',
    latitude: -8.4,
    longitude: 115.1,
    targetDana: 100,
    danaTerkumpul: 50,
    persenCapaian: 50,
    mulai: '2026-10-01',
    selesai: '2026-12-31',
    statusPelaksanaan: 'berjalan',
    terbukaDonasi: true,
    terbukaRelawan: true,
    kuotaRelawan: 10,
    relawanDiterima: 3,
    ...ubah,
  };
}

describe('bacaFilterUrl', () => {
  it('membaca filter valid', () => {
    expect(
      bacaFilterUrl({ q: ' bakau ', type: 'campaign', status: 'volunteer' }),
    ).toMatchObject({ q: 'bakau', type: 'campaign', status: 'volunteer' });
  });
  it('nilai tak dikenal kembali ke bawaan', () => {
    const f = bacaFilterUrl({ type: 'x', status: 'y', period: 'z' });
    expect(f).toEqual(FILTER_KOSONG);
  });
  it('parameter berulang memakai nilai pertama', () => {
    expect(bacaFilterUrl({ cat: ['A', 'B'] }).cat).toBe('A');
  });
});

describe('keQueryApi dan keQueryUrl', () => {
  it('menerjemahkan kosakata UI ke API', () => {
    const p = keQueryApi({
      q: 'air',
      type: 'project',
      cat: 'Clean water',
      prov: 'Bali',
      status: 'closed',
      period: 'soon',
    });
    expect(p.get('q')).toBe('air');
    expect(p.get('tipe')).toBe('project');
    expect(p.get('kategori')).toBe('Clean water');
    expect(p.get('lokasi')).toBe('Bali');
    expect(p.get('status')).toBe('selesai');
    expect(p.get('periode')).toBe('segera');
    expect(p.get('batas')).toBe('50');
  });
  it('filter kosong hanya mengirim halaman dan batas', () => {
    expect([...keQueryApi(FILTER_KOSONG).keys()].sort()).toEqual([
      'batas',
      'halaman',
    ]);
  });
  it('URL halaman kosong bila tanpa filter dan bisa dibaca balik', () => {
    expect(keQueryUrl(FILTER_KOSONG)).toBe('');
    const f = { ...FILTER_KOSONG, type: 'campaign' as const, q: 'a b' };
    const balik = bacaFilterUrl(
      Object.fromEntries(new URLSearchParams(keQueryUrl(f))),
    );
    expect(balik).toEqual(f);
  });
  it('adaFilter', () => {
    expect(adaFilter(FILTER_KOSONG)).toBe(false);
    expect(adaFilter({ ...FILTER_KOSONG, q: '  ' })).toBe(false);
    expect(adaFilter({ ...FILTER_KOSONG, prov: 'Bali' })).toBe(true);
  });
});

describe('tampilan', () => {
  it('rupiahRingkas', () => {
    expect(rupiahRingkas(61_250_000)).toBe('Rp61.3M');
    expect(rupiahRingkas(1_000_000_000)).toBe('Rp1B');
    expect(rupiahRingkas(9_500)).toBe('Rp9,500');
  });
  it('persenBatang dibatasi 0..100', () => {
    expect(persenBatang(150, 100)).toBe(100);
    expect(persenBatang(1, 0)).toBe(0);
  });
  it('labelStatus', () => {
    expect(labelStatus(item({ statusPelaksanaan: 'selesai' }))).toEqual({
      kelas: 'info',
      teks: 'Completed',
    });
    expect(labelStatus(item({ terbukaDonasi: false })).teks).toBe(
      'Donations closed',
    );
    expect(
      labelStatus(
        item({ terbukaRelawan: false, relawanDiterima: 10, kuotaRelawan: 10 }),
      ).teks,
    ).toBe('Volunteer spots full');
    expect(labelStatus(item({ statusPelaksanaan: 'persiapan' })).teks).toBe(
      'Preparing',
    );
    expect(
      labelStatus(item({ tipe: 'campaign', statusPelaksanaan: null })).teks,
    ).toBe('Open for donations');
  });
  it('teksRelawan hanya untuk project berkuota', () => {
    expect(teksRelawan(item())).toBe('3/10 volunteers');
    expect(
      teksRelawan(item({ tipe: 'campaign', kuotaRelawan: null })),
    ).toBeNull();
  });
  it('hrefDetail dan fotoAksi', () => {
    expect(hrefDetail(item({ tipe: 'campaign', id: 'luwu' }))).toBe(
      '/campaign/luwu',
    );
    expect(fotoAksi({ id: 'mgv', kategori: null })).toBe(
      '/images/aksi/mgv.jpg',
    );
    expect(fotoAksi({ id: 'baru', kategori: 'Clean water' })).toBe(
      '/images/aksi/air.jpg',
    );
    expect(fotoAksi({ id: 'baru', kategori: null })).toBe(
      '/images/aksi/mgv.jpg',
    );
  });
});

describe('peta', () => {
  it('proyeksi', () => {
    expect(proyeksi(94.5, 6.4)).toEqual([0, 0]);
  });
  it('pin yang menumpuk digeser', () => {
    const pos = aturPin([
      { tipe: 'project', id: 'a', latitude: -7, longitude: 110 },
      { tipe: 'project', id: 'b', latitude: -7, longitude: 110 },
    ]);
    const [a, b] = [pos['project-a'], pos['project-b']];
    expect(Math.hypot(a[0] - b[0], a[1] - b[1])).toBeGreaterThanOrEqual(20);
  });
  it('letakPopup di bawah pin bila pin di bagian atas', () => {
    expect(letakPopup(480, 50).dibawah).toBe(true);
    expect(letakPopup(480, 300).dibawah).toBe(false);
    expect(letakPopup(2000, 50).kiri).toBe(62);
  });
});
