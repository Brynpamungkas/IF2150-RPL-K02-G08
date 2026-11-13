import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { GalatValidasi } from '@/shared/galat';

const { session, list, view } = vi.hoisted(() => ({
  session: vi.fn(),
  list: vi.fn(),
  view: vi.fn(),
}));
vi.mock('@/server/auth/aksesAksi', () => ({ sesiAksi: session }));
vi.mock('@/server/services/AksiService', () => ({
  AksiService: { milikSaya: list },
}));
vi.mock('@/components/aksi/MyActions', () => ({
  MyActions: (props: { aksi: unknown[] }) => {
    view(props);
    return createElement('p', null, 'Owner actions');
  },
}));

import { TabMyActions } from '@/components/aksi/TabMyActions';

beforeEach(() => {
  vi.resetAllMocks();
  list.mockResolvedValue([]);
});
describe('slot My Actions pada Account memakai sesi server asli', () => {
  it('tamu/sesi kedaluwarsa mendapat pesan login, bukan daftar milik pengguna lain', async () => {
    session.mockRejectedValue(
      new GalatValidasi('Internal session detail', 401),
    );
    const html = renderToStaticMarkup(await TabMyActions());
    expect(html).toContain('Log in to see your actions');
    expect(html).not.toContain('Internal session detail');
    expect(list).not.toHaveBeenCalled();
  });
  it('volunteer mendapat penjelasan peran tanpa query daftar pembuat', async () => {
    session.mockResolvedValue({ id: 'volunteer', peran: 'volunteer' });
    expect(renderToStaticMarkup(await TabMyActions())).toContain(
      'available to project creators',
    );
    expect(list).not.toHaveBeenCalled();
  });
  it('admin diarahkan ke antrean tanpa query daftar pembuat', async () => {
    session.mockResolvedValue({ id: 'admin', peran: 'admin' });
    expect(renderToStaticMarkup(await TabMyActions())).toContain(
      'href="/admin"',
    );
    expect(list).not.toHaveBeenCalled();
  });
  it('daftar pembuat diminta memakai identitas sesi, lalu dipasang ke komponen yang sama', async () => {
    const user = { id: 'owner-a', peran: 'pembuat_project' };
    const rows = [{ id: 'private-a', idPembuat: user.id }];
    session.mockResolvedValue(user);
    list.mockResolvedValue(rows);
    renderToStaticMarkup(await TabMyActions());
    expect(list).toHaveBeenCalledExactlyOnceWith(user);
    expect(view).toHaveBeenCalledExactlyOnceWith({ aksi: rows });
  });
  it('daftar kosong tetap diserahkan ke empty state MyActions, bukan data dummy', async () => {
    session.mockResolvedValue({ id: 'new-owner', peran: 'pembuat_project' });
    renderToStaticMarkup(await TabMyActions());
    expect(view).toHaveBeenCalledExactlyOnceWith({ aksi: [] });
  });
  it('kegagalan database tidak disamarkan sebagai keberhasilan/daftar kosong', async () => {
    session.mockResolvedValue({ id: 'owner', peran: 'pembuat_project' });
    const failure = new Error('database unavailable');
    list.mockRejectedValue(failure);
    await expect(TabMyActions()).rejects.toBe(failure);
    expect(view).not.toHaveBeenCalled();
  });
  it('interupsi prerender Next tidak ditelan oleh penanganan galat sesi', async () => {
    const interrupt = new Error('NEXT_PRERENDER_INTERRUPTED');
    session.mockRejectedValue(interrupt);
    await expect(TabMyActions()).rejects.toBe(interrupt);
    expect(list).not.toHaveBeenCalled();
  });
});
