import { describe, expect, it, vi } from 'vitest';
import { cekStatusLogin } from '@/models/SesiLogin';

const { penggunaDariSesi } = vi.hoisted(() => ({ penggunaDariSesi: vi.fn() }));
vi.mock('@/server/services/AutentikasiService', () => ({
  AutentikasiService: class {
    penggunaDariSesi = penggunaDariSesi;
  },
}));
import { sesiAksi } from '@/server/auth/aksesAksi';

describe('adapter aksi memakai autentikasi resmi', () => {
  it('memetakan identitas resmi, bukan id pengguna dari cookie lain', async () => {
    penggunaDariSesi.mockResolvedValue({
      idPengguna: 'owner',
      peran: 'pembuat_project',
    });
    const pengguna = await sesiAksi(
      new Request('http://localhost', {
        headers: {
          cookie: 'klimpool_dev_user=outsider; klimpool_sesi=real-token',
        },
      }),
    );
    expect(penggunaDariSesi).toHaveBeenCalledWith('real-token');
    expect(pengguna).toEqual({ id: 'owner', peran: 'pembuat_project' });
  });
  it('sesi tidak aktif menurut layanan resmi tetap ditolak oleh aksi', async () => {
    penggunaDariSesi.mockResolvedValue(null);
    await expect(
      sesiAksi(
        new Request('http://localhost', {
          headers: { cookie: 'klimpool_sesi=expired' },
        }),
      ),
    ).rejects.toMatchObject({ status: 401 });
  });
  it('interupsi runtime/database dari layanan resmi tidak disamarkan sebagai tamu', async () => {
    const failure = new Error('runtime interrupt');
    penggunaDariSesi.mockRejectedValue(failure);
    await expect(
      sesiAksi(
        new Request('http://localhost', {
          headers: { cookie: 'klimpool_sesi=real-token' },
        }),
      ),
    ).rejects.toBe(failure);
  });
  it('pemeriksaan sesi bersama mempertahankan penolakan sesi masa depan', () => {
    const sekarang = new Date('2026-11-13T00:00:00Z');
    const sesi = {
      idSesi: 'session',
      idPengguna: 'owner',
      statusSesi: 'aktif' as const,
      waktuMulai: new Date('2026-11-13T00:01:00Z'),
      waktuKedaluwarsa: new Date('2026-11-14T00:00:00Z'),
    };
    expect(cekStatusLogin(sesi, sekarang)).toBe(false);
    expect(cekStatusLogin({ ...sesi, waktuMulai: sekarang }, sekarang)).toBe(
      true,
    );
  });
});
