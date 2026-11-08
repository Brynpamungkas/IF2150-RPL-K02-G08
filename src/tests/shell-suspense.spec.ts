import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const state = vi.hoisted(() => ({ suspend: false }));
vi.mock('@/components/ui/Navbar', () => ({
  Navbar: () => {
    if (state.suspend) throw new Promise(() => {});
    return createElement('nav', null, 'Loaded navigation');
  },
}));

import { AppShell } from '@/components/ui/AppShell';

beforeEach(() => {
  state.suspend = false;
});
describe('navbar dinamis tidak memblokir konten halaman', () => {
  const render = () =>
    renderToString(
      createElement(
        AppShell,
        // React memasang children dari argumen ketiga sesudah menerima props.
        { user: null } as Parameters<typeof AppShell>[0],
        createElement('p', null, 'Private route content'),
      ),
    );
  it('navbar normal dan konten tetap dirender', () => {
    const html = render();
    expect(html).toContain('Loaded navigation');
    expect(html).toContain('Private route content');
    expect(html).not.toContain('Loading navigation');
  });
  it('navbar yang menunggu pathname menampilkan fallback tanpa menyembunyikan main/footer', () => {
    state.suspend = true;
    const html = render();
    expect(html).toContain('Loading navigation');
    expect(html).toContain('Private route content');
    expect(html).toContain('Explore actions');
  });
});
