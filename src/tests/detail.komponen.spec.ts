import { createElement, type FunctionComponent } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';

vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: vi.fn() }) }));
vi.mock('@/components/ui/Toast', () => ({
  useToast: () => ({ showToast: vi.fn() }),
}));
import { HeroDetail } from '@/components/detail/HeroDetail';
import { PanelProgres } from '@/components/detail/PanelProgres';
import { PanelTentang } from '@/components/detail/PanelTentang';
import { TombolDonasi } from '@/components/detail/aksi/TombolDonasi';
import {
  bentukDokumen,
  bacaTabDetail,
  type DetailAksi,
  type ProgresItem,
} from '@/shared/detail';

describe('tab awal halaman detail', () => {
  it('menerima tab yang dikenal, termasuk nilai dari URL yang berulang', () => {
    expect(bacaTabDetail(' FUNDS ')).toBe('funds');
    expect(bacaTabDetail(['progress', 'about'])).toBe('progress');
  });
  it('nilai kosong atau tidak dikenal kembali ke About', () => {
    for (const nilai of [undefined, '', 'bogus', []])
      expect(bacaTabDetail(nilai)).toBe('about');
  });
});

function detail(ubah: Partial<DetailAksi> = {}): DetailAksi {
  return {
    tipe: 'project',
    id: 'p1',
    judul: 'Judul',
    deskripsi: 'Deskripsi',
    tujuan: null,
    kategori: 'Clean water',
    provinsi: 'Bali',
    kota: 'Tabanan',
    targetDana: 1000,
    danaTerkumpul: 250,
    jumlahDonasi: 3,
    mulai: '2026-11-09',
    selesai: '2026-12-31',
    sisaHari: 53,
    belumMulai: false,
    statusPelaksanaan: 'berjalan',
    terbukaDonasi: true,
    terbukaRelawan: true,
    pendaftaranDibuka: true,
    kuotaRelawan: 10,
    relawanDiterima: 4,
    logistik: [],
    keahlian: [],
    instruksiRelawan: null,
    penyelenggara: 'Sari',
    diverifikasi: '2026-10-01',
    rincianDana: [],
    danaTerpakai: 0,
    progres: [],
    ...ubah,
  };
}

const html = <P extends object>(komponen: FunctionComponent<P>, props: P) =>
  renderToStaticMarkup(createElement(komponen, props));

function progres(dokumen: ProgresItem['dokumen']): ProgresItem {
  return {
    id: 'g1',
    milestone: 'Review',
    status: 'berjalan',
    catatan: null,
    persentase: 10,
    danaTerpakai: null,
    dokumen,
    waktu: '2026-10-21 16:20',
  };
}

describe('bentukDokumen: berkas progres harus bisa dibuka', () => {
  it('alamat dari penyimpanan menjadi tautan ke endpoint dokumentasi', () => {
    expect(
      bentukDokumen(
        'review-project',
        '/api/dokumentasi/review-project/review.pdf',
      ),
    ).toEqual([
      {
        nama: 'review.pdf',
        href: '/api/dokumentasi/review-project/review.pdf',
      },
    ]);
  });

  it('nama berkas polos dipetakan ke endpoint milik project itu, dengan encoding', () => {
    expect(bentukDokumen('p1', 'plots a-b.jpg, attendance.pdf')).toEqual([
      { nama: 'plots a-b.jpg', href: '/api/dokumentasi/p1/plots%20a-b.jpg' },
      { nama: 'attendance.pdf', href: '/api/dokumentasi/p1/attendance.pdf' },
    ]);
  });

  it('alamat yang sudah ter-encode tidak di-encode dua kali', () => {
    expect(
      bentukDokumen('p1', '/api/dokumentasi/p1/plots%20a.jpg')[0].href,
    ).toBe('/api/dokumentasi/p1/plots%20a.jpg');
  });

  it.each([
    ['situs luar', 'https://contoh.com/x.pdf'],
    ['skema berbahaya', 'javascript:alert(1)'],
    ['project lain', '/api/dokumentasi/p2/x.pdf'],
    ['path traversal', '/api/dokumentasi/p1/../p2/x.pdf'],
    ['traversal ter-encode', '/api/dokumentasi/p1/%2e%2e'],
    ['segmen berlebih', '/api/dokumentasi/p1/a/b.pdf'],
    ['path di luar endpoint', '/etc/passwd'],
    ['encoding rusak', '/api/dokumentasi/p1/%E0%A4%A'],
  ])('%s tidak dijadikan tautan', (_label, entri) => {
    expect(bentukDokumen('p1', entri)).toEqual([{ nama: entri, href: null }]);
  });

  it('id project yang tidak valid tidak menghasilkan tautan', () => {
    expect(bentukDokumen('../x', 'a.jpg')).toEqual([
      { nama: 'a.jpg', href: null },
    ]);
  });

  it('kosong atau null menghasilkan daftar kosong', () => {
    expect(bentukDokumen('p1', null)).toEqual([]);
    expect(bentukDokumen('p1', ' , ,')).toEqual([]);
  });
});

describe('PanelProgres: dokumentasi dapat dibuka', () => {
  it('dokumen ber-href dirender sebagai tautan yang aman, dokumen lain sebagai teks', () => {
    const keluaran = html(PanelProgres, {
      progres: [
        progres([
          {
            nama: 'review.pdf',
            href: '/api/dokumentasi/review-project/review.pdf',
          },
          { nama: 'https://contoh.com/x.pdf', href: null },
        ]),
      ],
    });
    expect(keluaran).toContain(
      'href="/api/dokumentasi/review-project/review.pdf"',
    );
    expect(keluaran).toContain('target="_blank"');
    expect(keluaran).toContain('rel="noopener noreferrer"');
    expect(keluaran).toContain('review.pdf');
    expect(keluaran).not.toContain('href="https://contoh.com');
    expect(keluaran).toContain('<span class="doc">');
  });
});

describe('PanelTentang: titik kumpul hanya untuk relawan diterima (KF22)', () => {
  it('pengunjung publik melihat jadwal dan wilayah, tetapi bukan titik kumpul', () => {
    const keluaran = html(PanelTentang, { detail: detail() });
    expect(keluaran).toContain('Tabanan, Bali');
    expect(keluaran).toContain('9 Nov 2026');
    expect(keluaran).toContain('shared with accepted volunteers');
  });

  it('relawan yang diterima melihat titik kumpul', () => {
    const keluaran = html(PanelTentang, {
      detail: detail({
        instruksiRelawan: { lokasiKumpul: 'Balai desa 06:30' },
      }),
    });
    expect(keluaran).toContain('Balai desa 06:30');
    expect(keluaran).not.toContain('shared with accepted volunteers');
  });
});

describe('campaign yang belum mulai', () => {
  const belum = detail({
    tipe: 'campaign',
    mulai: '2026-11-09',
    selesai: '2026-12-31',
    statusPelaksanaan: null,
    terbukaDonasi: false,
    terbukaRelawan: false,
    belumMulai: true,
  });

  it('tombol donasi tidak aktif dan menjelaskan kapan dibuka, bukan "ended"', () => {
    const keluaran = html(TombolDonasi, { detail: belum });
    expect(keluaran).not.toContain('Donate now');
    expect(keluaran).toContain('Fundraising has not started yet');
    expect(keluaran).toContain('9 Nov 2026');
    expect(keluaran).not.toContain('period ended');
    expect(keluaran).toContain('aria-disabled="true"');
  });

  it('campaign yang sudah selesai tetap memakai teks "period ended"', () => {
    const keluaran = html(TombolDonasi, {
      detail: detail({
        tipe: 'campaign',
        statusPelaksanaan: null,
        terbukaDonasi: false,
        selesai: '2026-11-01',
      }),
    });
    expect(keluaran).toContain('period ended');
  });

  it('periode menyebut tanggal mulai, bukan sisa hari', () => {
    const keluaran = html(PanelTentang, { detail: belum });
    expect(keluaran).toContain('starts on 9 Nov 2026');
    expect(keluaran).not.toContain('days left');
  });

  it('chip status menunjukkan kapan dibuka, bukan "Donations closed"', () => {
    const keluaran = html(HeroDetail, { detail: belum });
    expect(keluaran).toContain('Opens 9 Nov 2026');
    expect(keluaran).not.toContain('Donations closed');
  });

  it('tombol Donate now tetap tampil bila donasi terbuka', () => {
    expect(html(TombolDonasi, { detail: detail() })).toContain('Donate now');
  });
});
