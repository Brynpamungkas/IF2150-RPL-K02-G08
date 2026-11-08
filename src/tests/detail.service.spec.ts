import { describe, expect, it } from 'vitest';
import type {
  BarisDetail,
  BarisProgres,
} from '@/server/repositories/detail.repository';
import {
  DetailService,
  bacaRincian,
  hitungSisaHari,
  pecahDaftar,
  type SumberDetail,
} from '@/server/services/detail.service';
import { formatJam, formatTanggal, plural } from '@/shared/detail';

function barisProject(ubah: Record<string, unknown> = {}): BarisDetail {
  return {
    id: 'p1',
    judul: 'Project',
    deskripsi: 'Deskripsi',
    tujuan: 'Tujuan',
    kategori: 'Clean water',
    provinsi: 'Bali',
    kota: 'Tabanan',
    target_dana: '1000',
    dana_terkumpul: '250',
    mulai: '2026-10-01',
    selesai: '2026-12-31',
    rincian:
      '[{"uraian":"Bibit","nominal":600},{"uraian":"Perahu","nominal":400}]',
    diverifikasi: '2026-10-01',
    penyelenggara: 'Sari',
    jumlah_donasi: '3',
    status_pelaksanaan: 'berjalan',
    logistik: 'Bibit; Bambu',
    keahlian: 'P3K; Dokumentasi',
    kuota: 10,
    pendaftaran_dibuka: 1,
    lokasi_kumpul: 'Balai desa',
    relawan_diterima: 4,
    ...ubah,
  } as unknown as BarisDetail;
}

function barisProgres(ubah: Record<string, unknown> = {}): BarisProgres {
  return {
    id: 'g1',
    milestone: 'Tahap 1',
    status_pelaksanaan: 'berjalan',
    catatan: null,
    persentase: 40,
    dana_terpakai: '100',
    dokumentasi_url: 'a.jpg, b.jpg',
    waktu: '2026-10-21 16:20',
    ...ubah,
  } as unknown as BarisProgres;
}

function sumber(
  project: BarisDetail | null,
  campaign: BarisDetail | null = null,
  progres: BarisProgres[] = [],
): SumberDetail {
  return {
    cariProject: async () => project,
    cariCampaign: async () => campaign,
    daftarProgres: async () => progres,
  };
}

const HARI_INI = () => new Date('2026-11-07T03:00:00Z');

describe('DetailService.ambil', () => {
  it('null bila data tidak ditemukan atau belum terpublikasi', async () => {
    const service = new DetailService(sumber(null), HARI_INI);
    expect(await service.ambil('project', 'x')).toBeNull();
    expect(await service.ambil('campaign', 'x')).toBeNull();
  });

  it('memetakan project beserta progres dan angka', async () => {
    const service = new DetailService(
      sumber(barisProject(), null, [
        barisProgres(),
        barisProgres({ id: 'g2', dana_terpakai: '300' }),
      ]),
      HARI_INI,
    );
    const d = await service.ambil('project', 'p1');
    expect(d).toMatchObject({
      tipe: 'project',
      targetDana: 1000,
      danaTerkumpul: 250,
      jumlahDonasi: 3,
      sisaHari: 54,
      terbukaDonasi: true,
      terbukaRelawan: true,
      logistik: ['Bibit', 'Bambu'],
      keahlian: ['P3K', 'Dokumentasi'],
      danaTerpakai: 300,
    });
    expect(d?.progres[0].dokumen).toEqual(['a.jpg', 'b.jpg']);
    expect(d?.rincianDana).toHaveLength(2);
  });

  it('donasi dan relawan tertutup bila periode lewat', async () => {
    const service = new DetailService(
      sumber(barisProject({ selesai: '2026-11-01' })),
      HARI_INI,
    );
    const d = await service.ambil('project', 'p1');
    expect(d).toMatchObject({ terbukaDonasi: false, terbukaRelawan: false });
    expect(d?.sisaHari).toBe(-6);
  });

  it('relawan tertutup bila kuota penuh atau pendaftaran ditutup', async () => {
    const penuh = new DetailService(
      sumber(barisProject({ relawan_diterima: 10 })),
      HARI_INI,
    );
    expect((await penuh.ambil('project', 'p1'))?.terbukaRelawan).toBe(false);
    const ditutup = new DetailService(
      sumber(barisProject({ pendaftaran_dibuka: 0 })),
      HARI_INI,
    );
    expect((await ditutup.ambil('project', 'p1'))?.terbukaRelawan).toBe(false);
  });

  it('project selesai menutup donasi', async () => {
    const service = new DetailService(
      sumber(barisProject({ status_pelaksanaan: 'selesai' })),
      HARI_INI,
    );
    expect((await service.ambil('project', 'p1'))?.terbukaDonasi).toBe(false);
  });

  it('campaign tidak punya progres maupun relawan', async () => {
    const service = new DetailService(
      sumber(
        null,
        barisProject({
          status_pelaksanaan: null,
          kuota: null,
          pendaftaran_dibuka: null,
          relawan_diterima: null,
          logistik: null,
          keahlian: null,
        }),
        [barisProgres()],
      ),
      HARI_INI,
    );
    const d = await service.ambil('campaign', 'c1');
    expect(d).toMatchObject({
      tipe: 'campaign',
      terbukaDonasi: true,
      terbukaRelawan: false,
      kuotaRelawan: null,
      progres: [],
      danaTerpakai: 0,
    });
  });
});

describe('helper detail', () => {
  it('pecahDaftar', () => {
    expect(pecahDaftar(' a ; ;b', ';')).toEqual(['a', 'b']);
    expect(pecahDaftar(null, ';')).toEqual([]);
  });

  it('bacaRincian menerima string JSON, array, dan membuang baris rusak', () => {
    expect(bacaRincian('[{"uraian":"A","nominal":"5"}]')).toEqual([
      { uraian: 'A', nominal: 5 },
    ]);
    expect(bacaRincian([{ uraian: 'B', nominal: 2 }, { uraian: 3 }])).toEqual([
      { uraian: 'B', nominal: 2 },
    ]);
    expect(bacaRincian('bukan json')).toEqual([]);
    expect(bacaRincian(null)).toEqual([]);
  });

  it('hitungSisaHari', () => {
    expect(hitungSisaHari('2026-11-10', '2026-11-07')).toBe(3);
    expect(hitungSisaHari(null, '2026-11-07')).toBeNull();
  });

  it('format tampilan', () => {
    expect(formatTanggal('2026-10-05')).toBe('5 Oct 2026');
    expect(formatTanggal(null)).toBe('-');
    expect(formatJam('2026-10-21 16:20')).toBe('16:20 WIB');
    expect(plural(1, 'day')).toBe('1 day');
    expect(plural(2, 'day')).toBe('2 days');
  });
});
