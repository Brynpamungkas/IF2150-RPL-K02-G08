import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { FormAksi } from '@/components/aksi/FormAksi';
import { TombolPengajuan } from '@/components/aksi/TombolPengajuan';
import { DaftarPengajuan } from '@/components/aksi/DaftarPengajuan';
import { KeputusanPengajuan } from '@/components/aksi/KeputusanPengajuan';
import { DetailAksiPrivat } from '@/components/aksi/DetailAksiPrivat';
import { apiAksi } from '@/components/aksi/apiAksi';
import { validasiAksi } from '@/shared/validasiAksi';
import { GalatValidasi } from '@/shared/galat';
import { aksiUji, dataAksi } from './fixtures/aksi';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), refresh: vi.fn() }),
}));
vi.mock('@/components/ui/Toast', () => ({
  useToast: () => ({ showToast: vi.fn() }),
}));
afterEach(() => vi.unstubAllGlobals());

describe('HIUPL boundary UC02–UC04 (render statis dan adapter HTTP)', () => {
  it('C17-UT01 formulir campaign memuat judul, target, periode dan penggunaan dana', () => {
    const html = renderToStaticMarkup(
      createElement(FormAksi, { jenis: 'campaign' }),
    );
    for (const name of [
      'judul',
      'deskripsi',
      'targetDana',
      'mulai',
      'selesai',
      'kebutuhan',
    ])
      expect(html).toContain(`name="${name}"`);
    expect(html).toContain('Simpan Draft');
    expect(html).not.toContain('Tahap 1 dari 2');
  });
  it('C17-UT02 galat validasi API tetap membawa kolom targetDana', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          Response.json(
            {
              pesan: 'Periksa isian.',
              galat: { targetDana: 'Dana harus positif.' },
            },
            { status: 400 },
          ),
        ),
    );
    await expect(
      apiAksi('/api/campaigns', { ...dataAksi, targetDana: 0 }),
    ).rejects.toMatchObject({
      status: 400,
      rincian: { targetDana: 'Dana harus positif.' },
    });
  });
  it('C20-UT01 project mulai dari informasi dasar sebelum kebutuhan', () => {
    const html = renderToStaticMarkup(
      createElement(FormAksi, { jenis: 'project' }),
    );
    expect(html).toContain('Tahap 1 dari 2');
    expect(html).toContain('name="tujuan"');
    expect(html).not.toContain('name="kuotaRelawan"');
    expect(html).toContain('Simpan dan lanjut');
  });
  it('C20-UT02 kebutuhan project negatif ditolak oleh validasi yang digunakan server', () => {
    expect(() =>
      validasiAksi(
        'project',
        { ...dataAksi, targetDana: -1 },
        true,
        '2026-11-19',
      ),
    ).toThrow(GalatValidasi);
  });
  it('C20-UT03 membuka draft kembali mengisi data dan ID yang sudah tersimpan', () => {
    const html = renderToStaticMarkup(
      createElement(FormAksi, {
        jenis: 'project',
        aksi: aksiUji({ judul: 'Judul revisi' }),
      }),
    );
    expect(html).toContain('value="Judul revisi"');
    expect(html).toContain('aksi-1');
  });
  it('C23-UT01 draft dapat diajukan dan ditolak dapat diajukan ulang', () => {
    for (const [status, label] of [
      ['draft', 'Ajukan Verifikasi'],
      ['ditolak', 'Ajukan Ulang'],
    ] as const) {
      expect(
        renderToStaticMarkup(
          createElement(TombolPengajuan, { aksi: aksiUji({ status }) }),
        ),
      ).toContain(label);
    }
  });
  it('C23-UT02 pending/published tidak menawarkan pengajuan ulang', () => {
    for (const status of ['menunggu_verifikasi', 'terpublikasi'] as const)
      expect(
        renderToStaticMarkup(
          createElement(TombolPengajuan, { aksi: aksiUji({ status }) }),
        ),
      ).toBe('');
  });
  it('C24-UT01 antrean memuat jenis, pembuat dan tautan detail yang benar', () => {
    const html = renderToStaticMarkup(
      createElement(DaftarPengajuan, {
        aksi: [aksiUji({ status: 'menunggu_verifikasi' })],
      }),
    );
    expect(html).toContain('/admin/pengajuan/project/aksi-1');
    expect(html).toContain('owner');
    expect(html).toContain('Project');
  });
  it('C24-UT02 antrean kosong mempunyai pesan tanpa tautan pengajuan', () => {
    const html = renderToStaticMarkup(
      createElement(DaftarPengajuan, { aksi: [] }),
    );
    expect(html).toContain('Tidak ada pengajuan');
    expect(html).not.toContain('Tinjau pengajuan');
  });
  it('C25-UT01 pengajuan pending menyediakan alasan, Setujui dan Tolak', () => {
    const html = renderToStaticMarkup(
      createElement(KeputusanPengajuan, {
        aksi: aksiUji({ status: 'menunggu_verifikasi' }),
      }),
    );
    for (const text of ['Alasan penolakan', 'Setujui', 'Tolak'])
      expect(html).toContain(text);
  });
  it('C25-UT02 pengajuan yang sudah diputuskan hanya menampilkan status terbaru', () => {
    const html = renderToStaticMarkup(
      createElement(KeputusanPengajuan, {
        aksi: aksiUji({ status: 'terpublikasi' }),
      }),
    );
    expect(html).toContain('Terpublikasi');
    expect(html).not.toContain('>Setujui</button>');
    expect(html).not.toContain('<textarea');
  });
  it('C25-UT03 preview menampilkan alasan/rincian dan meng-escape teks pengguna', () => {
    const html = renderToStaticMarkup(
      createElement(DetailAksiPrivat, {
        aksi: aksiUji({
          deskripsi: '<script>alert(1)</script>',
          alasanPenolakan: 'Perjelas anggaran',
          latitude: null,
        }),
      }),
    );
    expect(html).toContain('&lt;script&gt;');
    expect(html).not.toContain('<script>');
    expect(html).toContain('Perjelas anggaran');
    expect(html).toContain('Bibit');
  });
  it('C17-UT03 gangguan jaringan dan respons 500 ditampilkan sebagai kegagalan', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')));
    await expect(apiAksi('/api/campaigns', dataAksi)).rejects.toThrow(
      'Koneksi gagal',
    );
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValue(
          Response.json({ pesan: 'Gangguan server.' }, { status: 500 }),
        ),
    );
    await expect(apiAksi('/api/campaigns', dataAksi)).rejects.toThrow(
      'Gangguan server.',
    );
  });
  it('C17-UT04 respons sukses mengembalikan ID dan memakai JSON tanpa cache', async () => {
    const fetch = vi.fn().mockResolvedValue(Response.json({ aksi: aksiUji() }));
    vi.stubGlobal('fetch', fetch);
    const hasil = await apiAksi<{ aksi: { id: string } }>(
      '/api/campaigns',
      dataAksi,
    );
    expect(hasil.aksi.id).toBe('aksi-1');
    expect(fetch).toHaveBeenCalledWith(
      '/api/campaigns',
      expect.objectContaining({
        method: 'POST',
        cache: 'no-store',
        body: JSON.stringify(dataAksi),
      }),
    );
  });
});
