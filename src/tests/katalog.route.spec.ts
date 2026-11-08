import { describe, expect, it } from 'vitest';
import { GET } from '@/app/api/katalog/route';

describe('GET /api/katalog', () => {
  it('parameter tidak valid menghasilkan 400 dengan pesan, tanpa menyentuh database', async () => {
    const res = await GET(
      new Request('http://localhost/api/katalog?status=ngawur'),
    );
    expect(res.status).toBe(400);
    const badan = (await res.json()) as { pesan: string };
    expect(badan.pesan).toContain('status');
  });
});
