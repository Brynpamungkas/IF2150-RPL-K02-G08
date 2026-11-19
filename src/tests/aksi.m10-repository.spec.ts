import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AksiRepository } from '@/server/repositories/AksiRepository';
import { aksiUji, dataAksi } from './fixtures/aksi';
import type { PoolConnection } from 'mysql2/promise';

const { query, execute } = vi.hoisted(() => ({
  query: vi.fn(),
  execute: vi.fn(),
}));
vi.mock('@/server/db', () => ({ query, execute }));
const conn = {} as PoolConnection;
beforeEach(() => {
  vi.resetAllMocks();
  query.mockResolvedValue([aksiUji()]);
  execute.mockResolvedValue({ affectedRows: 1 });
});
describe('HIUPL penyimpanan C02/C03 dan perubahan status C26', () => {
  it('C02-UT12 cari membatasi ID melalui parameter dan mengunci saat bertransaksi', async () => {
    await AksiRepository.cari('project', 'aksi-1', conn);
    expect(query).toHaveBeenCalledWith(
      expect.stringContaining('WHERE id_project = ? FOR UPDATE'),
      ['aksi-1'],
      conn,
    );
    query.mockResolvedValue([]);
    expect(await AksiRepository.cari('project', 'missing')).toBeNull();
  });
  it('C03-UT11 JSON string dan atribut opsional null dipetakan ke DTO', async () => {
    query.mockResolvedValue([
      {
        ...aksiUji({ jenis: 'campaign' }),
        rincianDana: JSON.stringify(dataAksi.rincianDana),
        kategori: null,
        kebutuhan: null,
        tujuan: null,
        kriteriaRelawan: null,
        lokasiKumpul: null,
      },
    ]);
    const hasil = await AksiRepository.cari('campaign', 'aksi-1');
    expect(hasil?.rincianDana).toEqual(dataAksi.rincianDana);
    expect(hasil?.kategori).toBe('');
    query.mockResolvedValue([{ ...aksiUji(), rincianDana: null }]);
    expect(
      (await AksiRepository.cari('project', 'aksi-1'))?.rincianDana,
    ).toEqual([]);
  });
  it('C03-UT12 simpan campaign/project memakai placeholder, bukan interpolasi nilai', async () => {
    for (const jenis of ['campaign', 'project'] as const) {
      await AksiRepository.buat(jenis, 'aksi-1', 'owner', {
        ...dataAksi,
        judul: "x'); DROP TABLE pengguna; --",
        kategori: '',
        kebutuhan: '',
        kriteriaRelawan: '',
        lokasiKumpul: '',
      });
      const [sql, params] = execute.mock.calls.at(-1)!;
      expect(sql).not.toContain('DROP TABLE');
      expect(params).toContain("x'); DROP TABLE pengguna; --");
      expect(params).toContain('owner');
      expect(params).toContain(null);
    }
  });
  it('C02-UT13 ubah membatasi pemilik dan status draft/ditolak', async () => {
    await AksiRepository.ubah('project', 'aksi-1', 'owner', dataAksi, conn);
    expect(execute).toHaveBeenCalledWith(
      expect.stringContaining(
        "AND id_pembuat = ? AND status IN ('draft', 'ditolak')",
      ),
      expect.arrayContaining(['aksi-1', 'owner']),
      conn,
    );
  });
  it('C10-UT06 daftar pemilik dan antrean pending memakai filter pada kedua tabel', async () => {
    await AksiRepository.daftar({ idPembuat: 'owner' });
    expect(query).toHaveBeenLastCalledWith(
      expect.stringContaining('UNION ALL'),
      ['owner', 'owner'],
    );
    await AksiRepository.daftar({ status: 'menunggu_verifikasi' });
    expect(query).toHaveBeenLastCalledWith(
      expect.stringContaining('WHERE status = ?'),
      ['menunggu_verifikasi', 'menunggu_verifikasi'],
    );
  });
  it('C26-UT10 ajukan membersihkan alasan/keputusan lama; nol affectedRows berarti konflik', async () => {
    expect(
      await AksiRepository.ajukan('project', 'aksi-1', 'owner', conn),
    ).toBe(true);
    expect(execute.mock.calls[0][0]).toContain('alasan_penolakan = NULL');
    expect(execute.mock.calls[0][0]).toContain('tanggal_verifikasi = NULL');
    execute.mockResolvedValue({ affectedRows: 0 });
    expect(
      await AksiRepository.ajukan('campaign', 'aksi-1', 'owner', conn),
    ).toBe(false);
  });
  it('C26-UT11 keputusan hanya mengubah pending dan memeriksa jumlah baris terpengaruh', async () => {
    expect(
      await AksiRepository.putuskan(
        'campaign',
        'aksi-1',
        'ditolak',
        'Revisi',
        conn,
      ),
    ).toBe(true);
    expect(execute).toHaveBeenCalledWith(
      expect.stringContaining("AND status = 'menunggu_verifikasi'"),
      ['ditolak', 'Revisi', 'aksi-1'],
      conn,
    );
    execute.mockResolvedValue({ affectedRows: 0 });
    expect(
      await AksiRepository.putuskan(
        'project',
        'aksi-1',
        'terpublikasi',
        null,
        conn,
      ),
    ).toBe(false);
  });
});
