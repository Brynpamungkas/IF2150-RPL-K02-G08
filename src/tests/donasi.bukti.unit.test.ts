/**
 * Pengujian unit isi bukti transaksi (C31, KF17, issue #28). Tanpa DOM dan tanpa server.
 * Jalankan: npm test
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  barisArsip,
  barisBukti,
  judulCetak,
} from '@/components/views/DonasiView/barisBukti';
import type { BuktiDTO, HasilDonasi } from '@/shared/donasi';

const bukti: BuktiDTO = {
  idBukti: 'bkt-1',
  idTransaksi: 'TRX-1',
  rincian: {
    namaDonatur: 'Andi Rahman',
    namaTujuan: 'Sayung Coastal Mangrove Restoration',
    jenisTujuan: 'project',
    nominal: 100_000,
    pesan: null,
    tanggal: '2026-10-20T14:05:00.000Z',
    statusTransaksi: 'berhasil',
  },
};

const ringkasan = (persentasePencapaian: number): HasilDonasi => ({
  idTransaksi: 'TRX-1',
  saldoSesudah: 650_000,
  danaTerkumpul: 38_900_000,
  targetNominal: 40_000_000,
  persentasePencapaian,
});

const label = (b: ReturnType<typeof barisBukti>) => b.map((x) => x.label);
const nilai = (b: ReturnType<typeof barisBukti>, l: string) =>
  b.find((x) => x.label === l)?.nilai;

describe('barisBukti (AC1)', () => {
  it('memuat ID transaksi, waktu, status, donatur, tujuan, dan nominal', () => {
    assert.deepEqual(label(barisBukti(bukti)), [
      'Transaction ID',
      'Time',
      'Status',
      'Donor',
      'Destination',
      'Amount',
    ]);
  });

  it('memformat nilai sesuai prototipe', () => {
    const b = barisBukti(bukti);
    assert.equal(nilai(b, 'Transaction ID'), 'TRX-1');
    assert.equal(nilai(b, 'Time'), '20 Oct 2026, 21:05 WIB');
    assert.equal(nilai(b, 'Amount'), 'Rp100,000');
    assert.equal(
      nilai(b, 'Destination'),
      'Sayung Coastal Mangrove Restoration (Project)',
    );
    assert.equal(b.find((x) => x.label === 'Status')?.nada, 'ok');
  });

  it('menambah Message bila pesan terisi', () => {
    const b = barisBukti({
      ...bukti,
      rincian: { ...bukti.rincian, pesan: 'Semangat' },
    });
    assert.equal(nilai(b, 'Message'), 'Semangat');
  });

  it('status gagal tidak berwarna ok', () => {
    const b = barisBukti({
      ...bukti,
      rincian: { ...bukti.rincian, statusTransaksi: 'gagal' },
    });
    assert.equal(nilai(b, 'Status'), 'Failed');
    assert.equal(b.find((x) => x.label === 'Status')?.nada, undefined);
  });

  it('menambah saldo sisa dan capaian (dibulatkan, maks 100) bila ada ringkasan', () => {
    const b = barisBukti(bukti, ringkasan(25.5));
    assert.deepEqual(label(b).slice(-2), [
      'Remaining balance',
      'Target reached',
    ]);
    assert.equal(nilai(b, 'Remaining balance'), 'Rp650,000');
    assert.equal(nilai(b, 'Target reached'), '26% (Rp38,900,000)');
    assert.equal(
      nilai(barisBukti(bukti, ringkasan(140)), 'Target reached'),
      '100% (Rp38,900,000)',
    );
  });
});

describe('barisArsip (prototipe Activity details)', () => {
  it('mengikuti urutan dan label modal riwayat', () => {
    const b = barisArsip(bukti);
    assert.deepEqual(label(b), [
      'Transaction ID',
      'Type',
      'Recipient',
      'Amount',
      'Time',
      'Status',
    ]);
    assert.equal(nilai(b, 'Type'), 'Donation');
    assert.equal(nilai(b, 'Recipient'), 'Sayung Coastal Mangrove Restoration');
    assert.equal(
      nilai(
        barisArsip({ ...bukti, rincian: { ...bukti.rincian, pesan: 'Hi' } }),
        'Message',
      ),
      'Hi',
    );
  });
});

describe('judulCetak (AC3)', () => {
  it('memberi nama berkas saran berisi ID transaksi', () => {
    assert.equal(judulCetak(bukti), 'KlimPooL receipt TRX-1');
  });
});
