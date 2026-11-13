/**
 * Pengujian unit aturan donasi (tanpa basis data).
 * Jalankan: npm test
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { BuktiTransaksi } from '@/models/BuktiTransaksi';
import { Donatur } from '@/models/Donatur';
import { TransaksiDonasi } from '@/models/TransaksiDonasi';
import { NOMINAL_MAKS } from '@/shared/donasi';

describe('TransaksiDonasi.validasiNominal (Algo-105)', () => {
  it('menerima nominal > 0 sampai batas maksimum, maksimal 2 desimal', () => {
    for (const n of [1, 0.01, 25_000, 12_345.67, NOMINAL_MAKS]) {
      assert.equal(TransaksiDonasi.validasiNominal(n), true, String(n));
    }
  });

  it('menolak nominal <= 0, melebihi maksimum, atau bukan angka', () => {
    for (const n of [
      0,
      -1,
      -25_000,
      NOMINAL_MAKS + 1,
      0.001,
      Number.NaN,
      Number.POSITIVE_INFINITY,
      '25000',
      null,
      undefined,
    ]) {
      assert.equal(TransaksiDonasi.validasiNominal(n), false, String(n));
    }
  });
});

describe('TransaksiDonasi.buatTransaksi (Algo-107)', () => {
  it('membuat transaksi berstatus berhasil dengan ID unik', () => {
    const ids = new Set<string>();
    for (let i = 0; i < 100; i++) {
      const t = TransaksiDonasi.buatTransaksi(
        'u1',
        'mgv',
        'project',
        25_000,
        `kunci-${i}-abcdefghijk`,
      );
      assert.equal(t.statusTransaksi, 'berhasil');
      ids.add(t.idTransaksi);
    }
    assert.equal(ids.size, 100);
  });
});

describe('Donatur', () => {
  it('memeriksa kecukupan saldo dan menyamakan saldo setelah dipotong', () => {
    const d = new Donatur('u1', 'Andi', 'andi@klimpool.id', 100_000);
    assert.equal(d.cukupUntuk(100_000), true);
    assert.equal(d.cukupUntuk(100_000.01), false);
    d.kurangiSaldo(25_000.1);
    assert.equal(d.getSaldo(), 74_999.9);
  });
});

describe('BuktiTransaksi', () => {
  const rincian = {
    namaDonatur: 'Andi',
    namaTujuan: 'Mangrove',
    jenisTujuan: 'project' as const,
    nominal: 25_000,
    pesan: null,
    tanggal: new Date().toISOString(),
    statusTransaksi: 'berhasil' as const,
  };

  it('hanya mencetak bukti untuk transaksi berhasil (Algo-111)', () => {
    const b = BuktiTransaksi.cetakBukti('trx-1', rincian);
    assert.ok(b.idBukti.length <= 36, 'id_bukti muat di VARCHAR(36)');
    assert.throws(() =>
      BuktiTransaksi.cetakBukti('trx-2', {
        ...rincian,
        statusTransaksi: 'gagal',
      }),
    );
  });

  it('mengurai rincian JSON dan menolak teks bebas data seed', () => {
    assert.deepEqual(
      BuktiTransaksi.uraiRincian(JSON.stringify(rincian)),
      rincian,
    );
    assert.equal(
      BuktiTransaksi.uraiRincian('Donasi Rp75.000 dari Andi Rahman'),
      null,
    );
  });
});
