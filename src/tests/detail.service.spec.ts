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
  instruksi: (idProject: string, idPengguna: string) => string | null = () =>
    null,
): SumberDetail & { instruksiDipanggil: [string, string][] } {
  const dipanggil: [string, string][] = [];
  return {
    cariProject: async () => project,
    cariCampaign: async () => campaign,
    daftarProgres: async () => progres,
    instruksiRelawan: async (idProject, idPengguna) => {
      dipanggil.push([idProject, idPengguna]);
      return instruksi(idProject, idPengguna);
    },
    instruksiDipanggil: dipanggil,
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
    expect(d?.progres[0].dokumen).toEqual([
      { nama: 'a.jpg', href: '/api/dokumentasi/p1/a.jpg' },
      { nama: 'b.jpg', href: '/api/dokumentasi/p1/b.jpg' },
    ]);
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

function barisCampaign(ubah: Record<string, unknown> = {}): BarisDetail {
  return barisProject({
    status_pelaksanaan: null,
    kuota: null,
    pendaftaran_dibuka: null,
    relawan_diterima: null,
    logistik: null,
    keahlian: null,
    ...ubah,
  });
}

/** service dengan jam tetap; waktu dalam UTC, tanggal WIB = UTC + 7 jam. */
const pada = (iso: string) => () => new Date(iso);

describe('periode donasi campaign (DPPL Algo-132, sama dengan API donasi)', () => {
  const donasiTerbuka = async (
    ubah: Record<string, unknown>,
    waktu = '2026-11-08T03:00:00Z',
  ) => {
    const service = new DetailService(
      sumber(null, barisCampaign(ubah)),
      pada(waktu),
    );
    return service.ambil('campaign', 'c1');
  };

  it('sebelum tanggal mulai: donasi tertutup dan ditandai belum mulai', async () => {
    const d = await donasiTerbuka({
      mulai: '2026-11-09',
      selesai: '2026-12-31',
    });
    expect(d).toMatchObject({ terbukaDonasi: false, belumMulai: true });
  });

  it('tepat tanggal mulai: donasi terbuka', async () => {
    const d = await donasiTerbuka({
      mulai: '2026-11-08',
      selesai: '2026-12-31',
    });
    expect(d).toMatchObject({ terbukaDonasi: true, belumMulai: false });
  });

  it('di tengah periode dan pada hari terakhir: donasi terbuka', async () => {
    const tengah = await donasiTerbuka({
      mulai: '2026-10-01',
      selesai: '2026-12-31',
    });
    const terakhir = await donasiTerbuka({
      mulai: '2026-10-01',
      selesai: '2026-11-08',
    });
    expect(tengah?.terbukaDonasi).toBe(true);
    expect(terakhir?.terbukaDonasi).toBe(true);
  });

  it('setelah tanggal selesai: donasi tertutup, bukan belum mulai', async () => {
    const d = await donasiTerbuka({
      mulai: '2026-10-01',
      selesai: '2026-11-07',
    });
    expect(d).toMatchObject({ terbukaDonasi: false, belumMulai: false });
  });

  it('tanggal mulai di WIB tetapi DB (UTC) masih hari sebelumnya: belum dibuka', async () => {
    // 2026-11-07 17:30 UTC = 2026-11-08 00:30 WIB. API memakai CURDATE() UTC
    // (2026-11-07) dan akan menolak donasi, jadi halaman tidak boleh menawarkannya.
    const dini = await donasiTerbuka(
      { mulai: '2026-11-08', selesai: '2026-12-31' },
      '2026-11-07T17:30:00Z',
    );
    expect(dini).toMatchObject({ terbukaDonasi: false, belumMulai: true });
    const siang = await donasiTerbuka(
      { mulai: '2026-11-08', selesai: '2026-12-31' },
      '2026-11-08T00:30:00Z',
    );
    expect(siang?.terbukaDonasi).toBe(true);
  });

  it('project tidak dibatasi tanggal mulai untuk donasi (Algo-131)', async () => {
    const service = new DetailService(
      sumber(barisProject({ mulai: '2026-11-09', selesai: '2026-12-31' })),
      pada('2026-11-08T03:00:00Z'),
    );
    const d = await service.ambil('project', 'p1');
    expect(d).toMatchObject({ terbukaDonasi: true, belumMulai: true });
  });
});

describe('instruksi relawan / titik kumpul (KF22, DPPL Algo-126)', () => {
  const lokasi = (id: string, pengguna: string) =>
    id === 'p1' && pengguna === 'relawan-diterima' ? 'Balai desa 06:30' : null;

  it('pengunjung tanpa login tidak mendapat titik kumpul dan query tidak dijalankan', async () => {
    const repo = sumber(barisProject(), null, [], lokasi);
    const d = await new DetailService(repo, HARI_INI).ambil('project', 'p1');
    expect(d?.instruksiRelawan).toBeNull();
    expect(repo.instruksiDipanggil).toEqual([]);
    expect(JSON.stringify(d)).not.toContain('Balai desa');
    expect(JSON.stringify(d)).not.toContain('lokasiKumpul');
  });

  it('pengguna yang bukan relawan diterima (pending, rejected, orang lain) tidak mendapat titik kumpul', async () => {
    for (const pengguna of ['pending', 'rejected', 'orang-lain']) {
      const repo = sumber(barisProject(), null, [], lokasi);
      const d = await new DetailService(repo, HARI_INI).ambil(
        'project',
        'p1',
        pengguna,
      );
      expect(d?.instruksiRelawan).toBeNull();
      expect(JSON.stringify(d)).not.toContain('Balai desa');
    }
  });

  it('relawan yang diterima mendapat titik kumpul', async () => {
    const repo = sumber(barisProject(), null, [], lokasi);
    const d = await new DetailService(repo, HARI_INI).ambil(
      'project',
      'p1',
      'relawan-diterima',
    );
    expect(d?.instruksiRelawan).toEqual({ lokasiKumpul: 'Balai desa 06:30' });
    expect(repo.instruksiDipanggil).toEqual([['p1', 'relawan-diterima']]);
  });

  it('campaign tidak punya instruksi relawan', async () => {
    const repo = sumber(null, barisCampaign(), [], () => 'Balai desa');
    const d = await new DetailService(repo, HARI_INI).ambil(
      'campaign',
      'c1',
      'relawan-diterima',
    );
    expect(d?.instruksiRelawan).toBeNull();
    expect(repo.instruksiDipanggil).toEqual([]);
  });

  it('data publik (jadwal, wilayah) tetap ada tanpa login', async () => {
    const d = await new DetailService(sumber(barisProject()), HARI_INI).ambil(
      'project',
      'p1',
    );
    expect(d).toMatchObject({
      kota: 'Tabanan',
      provinsi: 'Bali',
      mulai: '2026-10-01',
      selesai: '2026-12-31',
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
