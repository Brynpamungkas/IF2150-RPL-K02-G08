/**
 * Pengujian unit logika formulir donasi (C30, issue #27). Tanpa DOM dan tanpa server.
 * Jalankan: npm test
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  angkaDari,
  bersihkanMasukan,
  buatIdempotencyKey,
  formatMasukan,
  persenTampil,
  ringkasanSaldo,
  validasiFormDonasi,
} from '@/components/views/DonasiView/logikaDonasi';
import { NOMINAL_MAKS } from '@/shared/donasi';

describe('masukan nominal (I-06.5)', () => {
  it('mengambil angka dari teks berformat', () => {
    assert.equal(angkaDari('Rp 100,000'), 100_000);
    assert.equal(angkaDari(''), 0);
    assert.equal(angkaDari('abc'), 0);
  });

  it('hanya menyimpan digit, tanpa nol di depan, maksimal 13 digit', () => {
    assert.equal(bersihkanMasukan('Rp 0025,000'), '25000');
    assert.equal(bersihkanMasukan('12345678901234567'), '1234567890123');
  });

  it('memformat tampilan kolom', () => {
    assert.equal(formatMasukan(250_000), '250,000');
    assert.equal(formatMasukan(0), '');
  });
});

describe('validasiFormDonasi (I-06.8)', () => {
  it('menolak nominal 0', () => {
    assert.match(validasiFormDonasi(0, 750_000) ?? '', /more than Rp0/);
  });

  it('menolak nominal di atas batas maksimum', () => {
    assert.equal(
      validasiFormDonasi(NOMINAL_MAKS + 1, Number.MAX_SAFE_INTEGER),
      'The maximum donation is Rp1,000,000,000.',
    );
  });

  it('menolak nominal melebihi saldo dengan pesan prototipe', () => {
    assert.equal(
      validasiFormDonasi(100_001, 100_000),
      'Insufficient balance. Your balance is Rp100,000, which is Rp1 short.',
    );
  });

  it('menerima nominal sama dengan saldo', () => {
    assert.equal(validasiFormDonasi(100_000, 100_000), null);
  });
});

describe('ringkasanSaldo (I-06.7)', () => {
  it('menghitung sisa dan kekurangan', () => {
    assert.deepEqual(ringkasanSaldo(750_000, 100_000), {
      kurang: false,
      sisa: 650_000,
      selisih: 0,
    });
    assert.deepEqual(ringkasanSaldo(750_000, 800_000), {
      kurang: true,
      sisa: 0,
      selisih: 50_000,
    });
  });
});

describe('buatIdempotencyKey (C30, KF18)', () => {
  const cekKunci = (k: string) =>
    assert.ok(k.length >= 16 && k.length <= 100, `panjang ${k.length}`);

  it('unik dan panjangnya diterima server', () => {
    const kunci = new Set<string>();
    for (let i = 0; i < 100; i++) {
      const k = buatIdempotencyKey();
      cekKunci(k);
      kunci.add(k);
    }
    assert.equal(kunci.size, 100);
  });

  it('tetap bekerja tanpa crypto.randomUUID (bukan secure context)', () => {
    const asli = Object.getOwnPropertyDescriptor(globalThis, 'crypto');
    const cryptoAsli = globalThis.crypto;
    const tanpaUuid = {
      getRandomValues: (a: Uint8Array) => cryptoAsli.getRandomValues(a),
    };
    Object.defineProperty(globalThis, 'crypto', {
      value: tanpaUuid,
      configurable: true,
    });
    try {
      const a = buatIdempotencyKey();
      const b = buatIdempotencyKey();
      cekKunci(a);
      assert.notEqual(a, b);
      assert.match(a, /^[0-9a-f]{32}$/);
    } finally {
      if (asli) Object.defineProperty(globalThis, 'crypto', asli);
    }
  });
});

describe('persenTampil', () => {
  it('membulatkan dan membatasi 0..100 seperti pct() prototipe', () => {
    assert.equal(persenTampil(25.5), 26);
    assert.equal(persenTampil(140), 100);
    assert.equal(persenTampil(0), 0);
  });
});
