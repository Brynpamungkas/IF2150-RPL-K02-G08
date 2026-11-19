import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AksiService } from '@/server/services/AksiService';
import { aksiUji, dataAksi } from './fixtures/aksi';
import type { PenggunaAksi } from '@/server/auth/aksesAksi';

const { repo, conn } = vi.hoisted(() => ({
  repo: {
    buat: vi.fn(),
    cari: vi.fn(),
    ubah: vi.fn(),
    daftar: vi.fn(),
    ajukan: vi.fn(),
    putuskan: vi.fn(),
  },
  conn: {},
}));
vi.mock('@/server/repositories/AksiRepository', () => ({
  AksiRepository: repo,
}));
vi.mock('@/server/db', () => ({
  query: vi.fn(),
  execute: vi.fn(),
  withTransaction: async (kerja: (c: unknown) => Promise<unknown>) =>
    kerja(conn),
}));
const owner: PenggunaAksi = { id: 'owner', peran: 'pembuat_project' };
const admin: PenggunaAksi = { id: 'admin', peran: 'admin' };
const other: PenggunaAksi = { id: 'other', peran: 'pembuat_project' };
const volunteer: PenggunaAksi = { id: 'volunteer', peran: 'volunteer' };

beforeEach(() => {
  vi.resetAllMocks();
  vi.useFakeTimers();
  vi.setSystemTime(new Date('2026-11-19T10:00:00Z'));
  repo.cari.mockResolvedValue(aksiUji());
  repo.daftar.mockResolvedValue([]);
  repo.ajukan.mockResolvedValue(true);
  repo.putuskan.mockResolvedValue(true);
});
afterEach(() => vi.useRealTimers());

describe('HIUPL C10 PembuatProject dan layanan C02/C03', () => {
  it('C10-UT01 buat project/campaign memakai pemilik sesi, bukan pemilik/status JSON', async () => {
    for (const jenis of ['project', 'campaign'] as const) {
      await AksiService.buat(owner, jenis, {
        ...dataAksi,
        idPembuat: 'other',
        status: 'terpublikasi',
      });
      expect(repo.buat).toHaveBeenLastCalledWith(
        jenis,
        expect.any(String),
        'owner',
        dataAksi,
      );
    }
  });
  it('C10-UT02 peran volunteer/admin tidak boleh membuat aksi', async () => {
    for (const user of [volunteer, admin])
      await expect(
        AksiService.buat(user, 'campaign', dataAksi),
      ).rejects.toMatchObject({ status: 403 });
    expect(repo.buat).not.toHaveBeenCalled();
  });
  it('C10-UT03 milikSaya menyaring pemilik sesi dan menolak peran lain', async () => {
    expect(await AksiService.milikSaya(owner)).toEqual([]);
    expect(repo.daftar).toHaveBeenCalledWith({ idPembuat: 'owner' });
    await expect(AksiService.milikSaya(volunteer)).rejects.toMatchObject({
      status: 403,
    });
  });
  it('C10-UT04 pemilik/admin dapat melihat; pemilik lain mendapat 404', async () => {
    expect((await AksiService.lihat(owner, 'project', 'aksi-1')).id).toBe(
      'aksi-1',
    );
    expect((await AksiService.lihat(admin, 'project', 'aksi-1')).id).toBe(
      'aksi-1',
    );
    await expect(
      AksiService.lihat(other, 'project', 'aksi-1'),
    ).rejects.toMatchObject({ status: 404 });
    repo.cari.mockResolvedValue(null);
    await expect(
      AksiService.lihat(owner, 'project', 'missing'),
    ).rejects.toMatchObject({ status: 404 });
  });
  it('C02-UT09 tahap informasi menghasilkan draft tanpa jadwal; tahap tak dikenal ditolak', async () => {
    await AksiService.buat(owner, 'project', {
      judul: 'Project',
      deskripsi: 'Deskripsi',
      tujuan: 'Tujuan',
      provinsi: 'Bali',
      kota: 'Tabanan',
      tahap: 'informasi',
    });
    expect(repo.buat).toHaveBeenCalledWith(
      'project',
      expect.any(String),
      'owner',
      expect.objectContaining({ mulai: null, targetDana: 0 }),
    );
    await expect(
      AksiService.buat(owner, 'project', { ...dataAksi, tahap: 'unknown' }),
    ).rejects.toMatchObject({ status: 400 });
  });
  it('C02-UT10 perubahan memakai ID/koneksi yang sama dan mempertahankan kebutuhan', async () => {
    await AksiService.ubah(owner, 'project', 'aksi-1', {
      judul: 'Revisi',
      tahap: 'informasi',
    });
    expect(repo.ubah).toHaveBeenCalledWith(
      'project',
      'aksi-1',
      'owner',
      expect.objectContaining({
        judul: 'Revisi',
        kebutuhan: dataAksi.kebutuhan,
      }),
      conn,
    );
  });
  it('C02-UT11 perubahan orang lain atau status pending/published ditolak tanpa menulis', async () => {
    await expect(
      AksiService.ubah(other, 'project', 'aksi-1', {}),
    ).rejects.toMatchObject({ status: 404 });
    for (const status of ['menunggu_verifikasi', 'terpublikasi'] as const) {
      repo.cari.mockResolvedValue(aksiUji({ status }));
      await expect(
        AksiService.ubah(owner, 'project', 'aksi-1', {}),
      ).rejects.toMatchObject({ status: 409 });
    }
    expect(repo.ubah).not.toHaveBeenCalled();
  });
  it('C03-UT09 campaign disimpan lalu detail hasil penyimpanan dibaca', async () => {
    repo.cari.mockResolvedValue(aksiUji({ jenis: 'campaign' }));
    expect((await AksiService.buat(owner, 'campaign', dataAksi)).jenis).toBe(
      'campaign',
    );
    expect(repo.cari).toHaveBeenCalledWith('campaign', expect.any(String));
  });
  it('C03-UT10 galat repository diteruskan, tidak dibuat hasil sukses palsu', async () => {
    repo.buat.mockRejectedValue(new Error('database unavailable'));
    await expect(AksiService.buat(owner, 'campaign', dataAksi)).rejects.toThrow(
      'database unavailable',
    );
  });
});

describe('HIUPL C11 AdminSistem dan transisi C26', () => {
  it('C11-UT01 antrean hanya meminta status menunggu_verifikasi', async () => {
    expect(await AksiService.antrean(admin)).toEqual([]);
    expect(repo.daftar).toHaveBeenCalledWith({ status: 'menunggu_verifikasi' });
  });
  it('C11-UT02 non-admin tidak boleh melihat antrean atau membuat keputusan', async () => {
    for (const user of [owner, volunteer]) {
      await expect(AksiService.antrean(user)).rejects.toMatchObject({
        status: 403,
      });
      await expect(
        AksiService.putuskan(user, 'project', 'aksi-1', {
          keputusan: 'setujui',
        }),
      ).rejects.toMatchObject({ status: 403 });
    }
    expect(repo.putuskan).not.toHaveBeenCalled();
  });
  it('C11-UT03 setujui memperbarui pending menjadi published tanpa alasan penolakan', async () => {
    repo.cari
      .mockResolvedValueOnce(aksiUji({ status: 'menunggu_verifikasi' }))
      .mockResolvedValueOnce(aksiUji({ status: 'terpublikasi' }));
    expect(
      (
        await AksiService.putuskan(admin, 'project', 'aksi-1', {
          keputusan: 'setujui',
        })
      ).status,
    ).toBe('terpublikasi');
    expect(repo.putuskan).toHaveBeenCalledWith(
      'project',
      'aksi-1',
      'terpublikasi',
      null,
      conn,
    );
  });
  it('C11-UT04 tolak wajib alasan dan menyimpan alasan yang dinormalisasi', async () => {
    repo.cari.mockResolvedValue(aksiUji({ status: 'menunggu_verifikasi' }));
    await expect(
      AksiService.putuskan(admin, 'project', 'aksi-1', {
        keputusan: 'tolak',
        alasan: ' ',
      }),
    ).rejects.toMatchObject({ status: 400 });
    await AksiService.putuskan(admin, 'project', 'aksi-1', {
      keputusan: 'tolak',
      alasan: '  Perbaiki lokasi  ',
    });
    expect(repo.putuskan).toHaveBeenCalledWith(
      'project',
      'aksi-1',
      'ditolak',
      'Perbaiki lokasi',
      conn,
    );
  });
  it('C26-UT01 draft dan rejected dapat diajukan, status lainnya ditolak', async () => {
    for (const status of ['draft', 'ditolak'] as const) {
      repo.cari.mockResolvedValue(aksiUji({ status }));
      await AksiService.ajukan(owner, 'project', 'aksi-1');
      expect(repo.ajukan).toHaveBeenLastCalledWith(
        'project',
        'aksi-1',
        'owner',
        conn,
      );
    }
    repo.cari.mockResolvedValue(aksiUji({ status: 'menunggu_verifikasi' }));
    await expect(
      AksiService.ajukan(owner, 'project', 'aksi-1'),
    ).rejects.toMatchObject({ status: 409 });
  });
  it('C26-UT02 pengajuan draft tidak lengkap ditolak sebelum perubahan status', async () => {
    repo.cari.mockResolvedValue(aksiUji({ mulai: null, lokasiKumpul: '' }));
    await expect(
      AksiService.ajukan(owner, 'project', 'aksi-1'),
    ).rejects.toMatchObject({ status: 400 });
    expect(repo.ajukan).not.toHaveBeenCalled();
  });
  it('C26-UT03 pengajuan milik orang lain dan konflik update ditolak', async () => {
    await expect(
      AksiService.ajukan(other, 'project', 'aksi-1'),
    ).rejects.toMatchObject({ status: 404 });
    repo.ajukan.mockResolvedValue(false);
    await expect(
      AksiService.ajukan(owner, 'project', 'aksi-1'),
    ).rejects.toMatchObject({ status: 409 });
  });
  it('C26-UT04 keputusan tidak dikenal atau pengajuan sudah diproses ditolak', async () => {
    await expect(
      AksiService.putuskan(admin, 'project', 'aksi-1', {
        keputusan: 'publish',
      }),
    ).rejects.toMatchObject({ status: 400 });
    await expect(
      AksiService.putuskan(admin, 'project', 'aksi-1', {
        keputusan: 'setujui',
      }),
    ).rejects.toMatchObject({ status: 409 });
  });
  it('C26-UT05 persetujuan periode kedaluwarsa ditolak; penolakan tetap diperbolehkan', async () => {
    repo.cari.mockResolvedValue(
      aksiUji({
        status: 'menunggu_verifikasi',
        mulai: '2026-10-01',
        selesai: '2026-11-18',
      }),
    );
    await expect(
      AksiService.putuskan(admin, 'project', 'aksi-1', {
        keputusan: 'setujui',
      }),
    ).rejects.toMatchObject({ status: 400 });
    await AksiService.putuskan(admin, 'project', 'aksi-1', {
      keputusan: 'tolak',
      alasan: 'Periode perlu diperbarui',
    });
  });
  it('C26-UT06 konflik keputusan bersyarat menjadi 409, bukan sukses', async () => {
    repo.cari.mockResolvedValue(aksiUji({ status: 'menunggu_verifikasi' }));
    repo.putuskan.mockResolvedValue(false);
    await expect(
      AksiService.putuskan(admin, 'project', 'aksi-1', {
        keputusan: 'setujui',
      }),
    ).rejects.toMatchObject({ status: 409 });
  });
});
