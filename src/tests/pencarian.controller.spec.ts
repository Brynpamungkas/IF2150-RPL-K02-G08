import { describe, expect, it } from 'vitest';
import {
  GalatValidasi,
  PencarianController,
  bacaFilter,
} from '@/server/controllers/pencarian.controller';
import {
  KatalogService,
  type SumberKatalog,
} from '@/server/services/katalog.service';
import type { FilterKatalog } from '@/shared/katalog';

const p = (q: string) => new URLSearchParams(q);

describe('bacaFilter', () => {
  it('tanpa parameter memakai nilai bawaan', () => {
    expect(bacaFilter(p(''))).toEqual({
      kataKunci: undefined,
      tipe: 'semua',
      kategori: undefined,
      lokasi: undefined,
      status: undefined,
      periode: undefined,
      halaman: 1,
      batas: 20,
    });
  });

  it('kata kunci dan beberapa filter dapat dipakai bersamaan', () => {
    const f = bacaFilter(
      p(
        'q=mangrove&tipe=project&kategori=Clean%20water&lokasi=Jawa%20Tengah&status=donasi&periode=berjalan&halaman=2&batas=10',
      ),
    );
    expect(f).toMatchObject({
      kataKunci: 'mangrove',
      tipe: 'project',
      kategori: 'Clean water',
      lokasi: 'Jawa Tengah',
      status: 'donasi',
      periode: 'berjalan',
      halaman: 2,
      batas: 10,
    });
  });

  it('parameter kosong atau spasi dianggap tidak diisi (select "Any" di Explore)', () => {
    const f = bacaFilter(p('q=%20%20&kategori=&status=&periode=&tipe='));
    expect(f.kataKunci).toBeUndefined();
    expect(f.kategori).toBeUndefined();
    expect(f.status).toBeUndefined();
    expect(f.periode).toBeUndefined();
    expect(f.tipe).toBe('semua');
  });

  it.each([
    'tipe=lain',
    'status=terbuka',
    'periode=besok',
    'halaman=0',
    'halaman=abc',
    'batas=0',
    'batas=51',
    'batas=-1',
    `q=${'a'.repeat(101)}`,
  ])('menolak parameter tidak valid: %s', (query) => {
    expect(() => bacaFilter(p(query))).toThrow(GalatValidasi);
  });
});

describe('PencarianController', () => {
  function buat() {
    const diterima: FilterKatalog[] = [];
    const repo: SumberKatalog = {
      async cari(filter) {
        diterima.push(filter);
        return { baris: [], total: 0 };
      },
      async daftarProvinsi() {
        return ['Bali'];
      },
    };
    return {
      controller: new PencarianController(new KatalogService(repo)),
      diterima,
    };
  }

  it('cari meneruskan filter hasil bacaan ke service dan mengembalikan daftar kosong bila tidak ada hasil', async () => {
    const { controller, diterima } = buat();
    const hasil = await controller.cari(p('q=tidakada&tipe=campaign'));
    expect(diterima[0]).toMatchObject({
      kataKunci: 'tidakada',
      tipe: 'campaign',
    });
    expect(hasil.data).toEqual([]);
  });

  it('getDaftarDipublikasikan tidak memakai kata kunci maupun filter', async () => {
    const { controller, diterima } = buat();
    await controller.getDaftarDipublikasikan();
    expect(diterima[0]).toEqual({ tipe: 'semua', halaman: 1, batas: 20 });
  });

  it('getOpsi mengembalikan kategori baku dan provinsi', async () => {
    const { controller } = buat();
    const opsi = await controller.getOpsi();
    expect(opsi.provinsi).toEqual(['Bali']);
    expect(opsi.kategori).toContain('Clean water');
  });
});
