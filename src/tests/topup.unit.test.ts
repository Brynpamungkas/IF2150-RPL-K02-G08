/**
 * Pengujian unit top-up saldo simulasi (Tabel B.1 baris 1), tanpa basis data.
 * Jalankan: npm test
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { Donatur } from '@/models/Donatur';
import { TopupSaldo } from '@/models/TopupSaldo';
import {
  LABEL_METODE,
  NOMINAL_TOPUP,
  TOPUP_MAKS,
  TOPUP_MIN,
  adalahMetodeTopup,
  saranNominalTopup,
} from '@/shared/topup';

describe('TopupSaldo.validasiNominal', () => {
  it('menerima rupiah utuh dari batas minimum sampai maksimum', () => {
    for (const n of [TOPUP_MIN, ...NOMINAL_TOPUP, 150_000, TOPUP_MAKS]) {
      assert.equal(TopupSaldo.validasiNominal(n), true, String(n));
    }
  });

  it('menolak nominal tidak valid', () => {
    for (const n of [
      0,
      -50_000,
      TOPUP_MIN - 1,
      TOPUP_MAKS + 1,
      50_000.5,
      Number.NaN,
      Number.POSITIVE_INFINITY,
      '50000',
      null,
      undefined,
    ]) {
      assert.equal(TopupSaldo.validasiNominal(n), false, String(n));
    }
  });
});

describe('metode top-up', () => {
  it('hanya va dan qr', () => {
    assert.equal(adalahMetodeTopup('va'), true);
    assert.equal(adalahMetodeTopup('qr'), true);
    assert.equal(adalahMetodeTopup('kartu'), false);
    assert.equal(adalahMetodeTopup(undefined), false);
  });
});

describe('saranNominalTopup', () => {
  it('membulatkan kekurangan ke atas ke kelipatan Rp50,000', () => {
    assert.equal(saranNominalTopup(1), 50_000);
    assert.equal(saranNominalTopup(50_000), 50_000);
    assert.equal(saranNominalTopup(50_001), 100_000);
    assert.equal(saranNominalTopup(0), 50_000);
    assert.equal(saranNominalTopup(TOPUP_MAKS * 2), TOPUP_MAKS);
  });
});

describe('TopupSaldo.buat dan Donatur.tambahSaldo', () => {
  it('membuat catatan dengan ID unik, label metode, dan waktu tanpa milidetik', () => {
    const t1 = TopupSaldo.buat(
      'u1',
      100_000,
      'va',
      new Date(1_700_000_000_123),
    );
    const t2 = TopupSaldo.buat('u1', 100_000, 'qr');
    assert.notEqual(t1.idTopup, t2.idTopup);
    assert.ok(t1.idTopup.length <= 36);
    assert.equal(t1.metode, LABEL_METODE.va);
    assert.equal(t2.metode, LABEL_METODE.qr);
    assert.equal(t1.waktu.getTime(), 1_700_000_000_000);
  });

  it('menyamakan saldo di memori setelah top-up', () => {
    const d = new Donatur('u1', 'Andi', null, 750_000);
    d.tambahSaldo(100_000);
    assert.equal(d.getSaldo(), 850_000);
  });
});
