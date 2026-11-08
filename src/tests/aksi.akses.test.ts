import assert from 'node:assert/strict';
import { test } from 'node:test';
import { periksaAsalAksi } from '@/server/auth/aksesAksi';
import { buatCampaign } from '@/server/controllers/CampaignController';
import { GalatValidasi } from '@/shared/galat';

test('origin browser mengikuti Host publik saat URL Next memakai localhost internal', () => {
  assert.doesNotThrow(() =>
    periksaAsalAksi(
      new Request('http://localhost:3196/api/campaigns', {
        headers: { host: '127.0.0.1:3196', origin: 'http://127.0.0.1:3196' },
      }),
    ),
  );
});
test('origin lintas situs, opaque origin, dan spoof forwarded host ditolak', () => {
  const cas: Record<string, string>[] = [
    { origin: 'https://evil.invalid' },
    { origin: 'null' },
    { 'sec-fetch-site': 'cross-site' },
    {
      host: 'localhost:3196',
      origin: 'https://evil.invalid',
      'x-forwarded-host': 'evil.invalid',
    },
  ];
  for (const headers of cas)
    assert.throws(
      () =>
        periksaAsalAksi(
          new Request('http://localhost:3196/api/campaigns', { headers }),
        ),
      GalatValidasi,
    );
});
test('cookie sesi malformed dan cookie dev tidak memberi akses', async () => {
  for (const cookie of [
    'klimpool_sesi=%ZZ',
    'klimpool_dev_user=u2',
    `klimpool_sesi=${'x'.repeat(65)}`,
  ]) {
    const response = await buatCampaign(
      new Request('http://localhost/api/campaigns', {
        method: 'POST',
        headers: { cookie },
        body: '{}',
      }),
    );
    assert.equal(response.status, 401);
  }
});
