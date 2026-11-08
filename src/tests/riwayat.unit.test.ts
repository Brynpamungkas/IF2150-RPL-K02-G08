/**
 * Pengujian unit penggabungan dan filter riwayat (UC10, KF27), tanpa basis data.
 * Jalankan: npm test
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  bacaFilterRiwayat,
  gabungkanRiwayat,
  type ItemRiwayatProgres,
  type ItemRiwayatTransaksi,
} from '@/shared/riwayat';

const transaksi = (id: string, waktu: string): ItemRiwayatTransaksi => ({
  jenis: 'transaksi',
  id,
  waktu,
  jenisTujuan: 'project',
  idTujuan: 'p1',
  namaTujuan: 'Project',
  nominal: 50_000,
  status: 'berhasil',
});

const progres = (id: string, waktu: string): ItemRiwayatProgres => ({
  jenis: 'progres',
  id,
  waktu,
  idProject: 'p1',
  namaProject: 'Project',
  milestone: 'Tahap 1',
  statusPelaksanaan: 'berjalan',
});

describe('gabungkanRiwayat (Algo-129)', () => {
  it('menggabungkan transaksi dan progres lalu mengurutkan dari yang terbaru', () => {
    const hasil = gabungkanRiwayat(
      [
        transaksi('t1', '2026-01-01T00:00:00.000Z'),
        transaksi('t2', '2026-03-01T00:00:00.000Z'),
      ],
      [
        progres('g1', '2026-02-01T00:00:00.000Z'),
        progres('g2', '2026-04-01T00:00:00.000Z'),
      ],
    );
    assert.deepEqual(
      hasil.map((i) => i.id),
      ['g2', 't2', 'g1', 't1'],
    );
  });

  it('mengembalikan daftar kosong bila belum ada riwayat', () => {
    assert.deepEqual(gabungkanRiwayat([], []), []);
  });

  it('urutan tetap sama untuk waktu yang kembar', () => {
    const waktu = '2026-05-05T10:00:00.000Z';
    const a = gabungkanRiwayat(
      [transaksi('t1', waktu), transaksi('t2', waktu)],
      [progres('g1', waktu)],
    );
    const b = gabungkanRiwayat(
      [transaksi('t2', waktu), transaksi('t1', waktu)],
      [progres('g1', waktu)],
    );
    assert.deepEqual(
      a.map((i) => i.id),
      b.map((i) => i.id),
    );
  });

  it('tidak mengubah larik masukan', () => {
    const masukan = [
      transaksi('t1', '2026-01-01T00:00:00.000Z'),
      transaksi('t2', '2026-03-01T00:00:00.000Z'),
    ];
    gabungkanRiwayat(masukan, []);
    assert.deepEqual(
      masukan.map((i) => i.id),
      ['t1', 't2'],
    );
  });
});

describe('bacaFilterRiwayat', () => {
  it('tanpa parameter atau "semua" berarti semua jenis', () => {
    assert.equal(bacaFilterRiwayat(null), 'semua');
    assert.equal(bacaFilterRiwayat(''), 'semua');
    assert.equal(bacaFilterRiwayat('semua'), 'semua');
  });

  it('menerima jenis yang dikenal tanpa memedulikan huruf besar', () => {
    assert.equal(bacaFilterRiwayat('transaksi'), 'transaksi');
    assert.equal(bacaFilterRiwayat(' Progres '), 'progres');
  });

  it('menolak jenis yang tidak dikenal', () => {
    assert.equal(bacaFilterRiwayat('relawan'), null);
  });
});
