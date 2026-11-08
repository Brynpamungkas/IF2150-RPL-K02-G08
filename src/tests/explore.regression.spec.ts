import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import type { HasilKatalog, ItemKatalog } from '@/shared/katalog';
import {
  FILTER_KOSONG,
  adaKoordinat,
  bacaFilterUrl,
  keQueryUrl,
  selarasFilter,
} from '@/shared/explore';
import {
  PESAN_GALAT_UMUM,
  gabungHalaman,
  muatHalamanBerikut,
  type Termuat,
} from '@/shared/explorePaging';
import { AksiMuatLagi } from '@/components/views/AksiMuatLagi';
import { FormPetaWilayahView } from '@/components/views/FormPetaWilayahView';

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

const halaman = (data: ItemKatalog[], total: number, h: number): HasilKatalog =>
  ({ data, total, halaman: h }) as HasilKatalog;

describe('sinkronisasi filter dengan URL (navigasi footer saat di /explore)', () => {
  it('Donate to a campaign: /explore -> /explore?type=campaign', () => {
    const baru = selarasFilter(FILTER_KOSONG, { type: 'campaign' });
    expect(baru).toEqual({ ...FILTER_KOSONG, type: 'campaign' });
  });

  it('Find volunteer work: /explore -> /explore?status=volunteer', () => {
    const baru = selarasFilter(FILTER_KOSONG, { status: 'volunteer' });
    expect(baru).toEqual({ ...FILTER_KOSONG, status: 'volunteer' });
  });

  it('pindah dari satu tautan footer ke tautan footer lain', () => {
    const campaign = { ...FILTER_KOSONG, type: 'campaign' as const };
    expect(selarasFilter(campaign, { status: 'volunteer' })).toEqual({
      ...FILTER_KOSONG,
      status: 'volunteer',
    });
  });

  it('kembali ke /explore tanpa parameter mengosongkan filter', () => {
    const campaign = { ...FILTER_KOSONG, type: 'campaign' as const };
    expect(selarasFilter(campaign, {})).toEqual(FILTER_KOSONG);
  });

  it('URL hasil replaceState milik komponen sendiri tidak mengubah filter', () => {
    const f = { ...FILTER_KOSONG, q: 'bakau ', type: 'project' as const };
    const params = Object.fromEntries(new URLSearchParams(keQueryUrl(f)));
    expect(selarasFilter(f, params)).toBeNull();
    expect(selarasFilter(FILTER_KOSONG, {})).toBeNull();
  });

  it('parameter tidak valid diperlakukan sebagai filter kosong', () => {
    expect(selarasFilter(FILTER_KOSONG, { type: 'zzz' })).toBeNull();
    expect(bacaFilterUrl({ type: 'zzz' })).toEqual(FILTER_KOSONG);
  });
});

describe('peta mengikuti hasil filter, termasuk aksi yang sudah tutup', () => {
  const tutup = item({
    id: 'tutup1',
    terbukaDonasi: false,
    statusPelaksanaan: 'selesai',
  });
  const render = (hasil: ItemKatalog[]) =>
    renderToStaticMarkup(
      createElement(FormPetaWilayahView, {
        hasil,
        terpilihId: null,
        sorotId: null,
        onPilih: () => {},
      }),
    );
  const jumlahPin = (html: string) => (html.match(/class="pin/g) ?? []).length;

  it('filter Closed / completed: 1 hasil berkoordinat -> 1 marker', () => {
    expect(jumlahPin(render([tutup]))).toBe(1);
  });

  it('marker tetap bisa dipilih lewat popup untuk aksi yang sudah tutup', () => {
    const html = renderToStaticMarkup(
      createElement(FormPetaWilayahView, {
        hasil: [tutup],
        terpilihId: 'tutup1',
        sorotId: null,
        onPilih: () => {},
      }),
    );
    expect(html).toContain('href="/project/tutup1"');
  });

  it('campuran terbuka dan tutup: semua yang berkoordinat dipetakan', () => {
    const hasil = [item({ id: 'a' }), tutup, item({ id: 'c', tipe: 'campaign' })];
    expect(jumlahPin(render(hasil))).toBe(3);
  });

  it('item tanpa koordinat tetap tidak dipetakan', () => {
    const tanpa = item({ id: 'n', latitude: null, longitude: null });
    expect(adaKoordinat(tanpa)).toBe(false);
    expect(jumlahPin(render([tanpa, tutup]))).toBe(1);
  });
});

describe('kegagalan Show more (halaman kedua)', () => {
  const satu = item({ id: 'p1' });
  const dua = item({ id: 'p2' });
  const awal: Termuat = { kunci: 'k', data: [satu], total: 2, halaman: 1 };

  it('HTTP 500 pada halaman kedua dilaporkan sebagai gagal, tidak dilempar', async () => {
    const ambil = async () => {
      throw new Error(PESAN_GALAT_UMUM);
    };
    await expect(muatHalamanBerikut(ambil, 1)).resolves.toEqual({
      status: 'gagal',
      pesan: PESAN_GALAT_UMUM,
    });
  });

  it('meminta halaman setelah halaman yang sudah termuat', async () => {
    const diminta: number[] = [];
    const hasil = await muatHalamanBerikut(async (h) => {
      diminta.push(h);
      return halaman([dua], 2, h);
    }, 1);
    expect(diminta).toEqual([2]);
    expect(hasil.status).toBe('ok');
  });

  it('error tanpa pesan memakai pesan umum', async () => {
    const hasil = await muatHalamanBerikut(() => Promise.reject('x'), 1);
    expect(hasil).toEqual({ status: 'gagal', pesan: PESAN_GALAT_UMUM });
  });

  it('retry yang berhasil menambah hasil tanpa menghilangkan halaman pertama', () => {
    const gabung = gabungHalaman(awal, 'k', halaman([dua], 2, 2));
    expect(gabung?.data.map((i) => i.id)).toEqual(['p1', 'p2']);
    expect(gabung?.halaman).toBe(2);
  });

  it('respons halaman lama diabaikan jika filter sudah berganti', () => {
    const baru: Termuat = { ...awal, kunci: 'k2' };
    expect(gabungHalaman(baru, 'k', halaman([dua], 2, 2))).toBe(baru);
    expect(gabungHalaman(null, 'k', halaman([dua], 2, 2))).toBeNull();
  });

  it('pesan error dan tombol retry tampil di samping hasil yang sudah ada', () => {
    const html = renderToStaticMarkup(
      createElement(AksiMuatLagi, {
        memuatLagi: false,
        galat: PESAN_GALAT_UMUM,
        onMuatLagi: () => {},
      }),
    );
    expect(html).toContain('role="alert"');
    expect(html).toContain(PESAN_GALAT_UMUM);
    expect(html).toContain('Try again');
    expect(html).not.toContain('disabled');
  });

  it('tanpa error hanya ada tombol Show more', () => {
    const html = renderToStaticMarkup(
      createElement(AksiMuatLagi, {
        memuatLagi: false,
        galat: null,
        onMuatLagi: () => {},
      }),
    );
    expect(html).toContain('Show more');
    expect(html).not.toContain('role="alert"');
  });

  it('tombol nonaktif saat retry sedang berjalan', () => {
    const html = renderToStaticMarkup(
      createElement(AksiMuatLagi, {
        memuatLagi: true,
        galat: null,
        onMuatLagi: () => {},
      }),
    );
    expect(html).toContain('disabled');
    expect(html).toContain('Loading…');
  });
});
