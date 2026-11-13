import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GalatValidasi } from '@/shared/galat';

const { sesi, lihat, detail, form } = vi.hoisted(() => ({
  sesi: vi.fn(),
  lihat: vi.fn(),
  detail: vi.fn(),
  form: vi.fn(),
}));
vi.mock('@/server/auth/aksesAksi', async (original) => ({
  ...(await original<typeof import('@/server/auth/aksesAksi')>()),
  sesiAksi: sesi,
}));
vi.mock('@/server/services/AksiService', () => ({ AksiService: { lihat } }));
vi.mock('@/server/services/detail.service', () => ({
  DetailService: class {
    ambil = detail;
  },
}));
vi.mock('@/components/aksi/ProgresAksi', () => ({
  ProgresAksi: (props: unknown) => {
    form(props);
    return createElement('p', null, 'Form bridge');
  },
}));
import Page from '@/app/progress/[id]/page';

beforeEach(() => {
  vi.resetAllMocks();
  sesi.mockResolvedValue({ id: 'owner', peran: 'pembuat_project' });
  lihat.mockResolvedValue({ judul: 'Private title', status: 'terpublikasi' });
  detail.mockResolvedValue({ statusPelaksanaan: 'berjalan' });
});
const render = async () =>
  renderToStaticMarkup(
    await Page({ params: Promise.resolve({ id: 'project-a' }) }),
  );
describe('tujuan Progres pada My Actions', () => {
  it('memeriksa pemilik sebelum memuat detail dan meneruskan status sebenarnya ke adaptor form tim', async () => {
    expect(await render()).toContain('Progres: Private title');
    expect(lihat).toHaveBeenCalledWith(
      { id: 'owner', peran: 'pembuat_project' },
      'project',
      'project-a',
    );
    expect(form).toHaveBeenCalledWith({
      id: 'project-a',
      judul: 'Private title',
      status: 'berjalan',
    });
  });
  it('tamu mendapat pesan login tanpa query data', async () => {
    sesi.mockRejectedValue(
      new GalatValidasi('Silakan login terlebih dahulu.', 401),
    );
    expect(await render()).toContain('login');
    expect(lihat).not.toHaveBeenCalled();
    expect(detail).not.toHaveBeenCalled();
  });
  it('peran volunteer tidak boleh memakai halaman penghubung pemilik', async () => {
    sesi.mockResolvedValue({ id: 'volunteer', peran: 'volunteer' });
    expect(await render()).toContain('tidak memiliki akses');
    expect(lihat).not.toHaveBeenCalled();
  });
  it('pemilik lain tidak menerima judul atau form project privat', async () => {
    lihat.mockRejectedValue(new GalatValidasi('Aksi tidak ditemukan.', 404));
    const html = await render();
    expect(html).toContain('tidak ditemukan');
    expect(html).not.toContain('Private title');
    expect(detail).not.toHaveBeenCalled();
  });
  it('draft tidak boleh membuka form progres', async () => {
    lihat.mockResolvedValue({ judul: 'Private draft', status: 'draft' });
    expect(await render()).toContain(
      'hanya tersedia untuk project terpublikasi',
    );
    expect(detail).not.toHaveBeenCalled();
  });
  it('gangguan database tetap gagal, bukan empty success', async () => {
    const error = new Error('database unavailable');
    lihat.mockRejectedValue(error);
    await expect(render()).rejects.toBe(error);
  });
});
