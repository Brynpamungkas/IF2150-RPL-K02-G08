import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { MyActions } from '@/components/aksi/MyActions';

describe('empty state My Actions', () => {
  it('menampilkan ajakan membuat aksi dan satu tautan New submission', () => {
    const html = renderToStaticMarkup(createElement(MyActions, { aksi: [] }));
    expect(html).toContain('href="/start"');
    expect(html).toContain('New submission');
    expect(html).toContain('created an action yet');
    expect(html).toContain('Have a climate action plan?');
    expect(html).toContain('border-dashed');
    expect(html).not.toContain('notice info');
  });
  it('akun tanpa peran pembuat melihat empty state tanpa tautan pembuatan aktif', () => {
    const html = renderToStaticMarkup(
      createElement(MyActions, { aksi: [], bolehBuat: false }),
    );
    expect(html).toContain('created an action yet');
    expect(html).toContain('disabled');
    expect(html).not.toContain('href="/start"');
  });
});
