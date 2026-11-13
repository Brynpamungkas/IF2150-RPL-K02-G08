/**
 * Pengujian unit aturan relawan, progres, dan dokumentasi (tanpa basis data).
 * Jalankan: npm test
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  DOKUMENTASI_MAKS_BYTE,
  periksaBerkasDokumentasi,
} from '@/shared/dokumentasi';
import {
  bacaDataDiri,
  bacaJadwal,
  bacaKeahlian,
  bersihkanForm,
  formatDataDiri,
  formatJadwal,
  formatKeahlian,
  lokasiKumpulUntuk,
  validasiFormPendaftaran,
} from '@/shared/relawan';
import {
  BATAS_BERKAS_PROGRES,
  periksaBerkasProgres,
  validasiProgres,
  type MentahProgres,
} from '@/shared/progres';

const formLengkap = {
  dataDiri: {
    nama: 'Andi Rahman',
    telepon: '0812-3344-5566',
    kota: 'Semarang',
  },
  keahlian: ['Photo documentation', 'Fieldwork in mud'],
  pengalaman: 'Pernah menanam mangrove di Tugu.',
  jadwal: ['Sat–Sun, 8–9 Nov 2026'],
};

describe('validasiFormPendaftaran (KF19)', () => {
  it('menerima formulir lengkap', () => {
    assert.deepEqual(validasiFormPendaftaran(bersihkanForm(formLengkap)), {});
  });

  it('menolak formulir kosong dengan pesan pada setiap kolom wajib', () => {
    const galat = validasiFormPendaftaran(bersihkanForm(null));
    for (const kolom of [
      'nama',
      'telepon',
      'kota',
      'keahlian',
      'pengalaman',
      'jadwal',
    ]) {
      assert.ok(kolom in galat, `kolom ${kolom} harus bermasalah`);
    }
  });

  it('menolak nomor telepon bukan angka dan pemisah di dalam butir', () => {
    const galat = validasiFormPendaftaran(
      bersihkanForm({
        ...formLengkap,
        dataDiri: { ...formLengkap.dataDiri, telepon: 'abc' },
        keahlian: ['a, b'],
        jadwal: ['x; y'],
      }),
    );
    assert.ok(galat.telepon);
    assert.ok(galat.keahlian);
    assert.ok(galat.jadwal);
  });

  it('menyimpan lalu membaca kembali data diri, keahlian, dan jadwal', () => {
    const form = bersihkanForm(formLengkap);
    assert.deepEqual(
      bacaDataDiri(formatDataDiri(form.dataDiri)),
      form.dataDiri,
    );
    assert.deepEqual(
      bacaKeahlian(formatKeahlian(form.keahlian)),
      form.keahlian,
    );
    assert.deepEqual(bacaJadwal(formatJadwal(form.jadwal)), form.jadwal);
  });
});

const progresLengkap: MentahProgres = {
  milestone: 'Planting phase 1 complete',
  statusPelaksanaan: 'berjalan',
  catatan: '',
  persentase: '35',
  danaTerpakai: '24500000',
};

describe('validasiProgres (KF23)', () => {
  it('menerima isian lengkap dan mengubahnya menjadi tipe yang benar', () => {
    const hasil = validasiProgres(progresLengkap);
    assert.equal(hasil.valid, true);
    if (hasil.valid) {
      assert.equal(hasil.data.persentase, 35);
      assert.equal(hasil.data.danaTerpakai, 24_500_000);
      assert.equal(hasil.data.catatan, null);
    }
  });

  it('boleh mengosongkan catatan, persentase, dan dana terpakai', () => {
    const hasil = validasiProgres({
      ...progresLengkap,
      persentase: '',
      danaTerpakai: '',
    });
    assert.equal(hasil.valid, true);
  });

  it('menolak milestone kosong, status di luar empat pilihan, dan angka salah', () => {
    const hasil = validasiProgres({
      milestone: '',
      statusPelaksanaan: 'dibatalkan',
      catatan: '',
      persentase: '101',
      danaTerpakai: '1,5jt',
    });
    assert.equal(hasil.valid, false);
    if (!hasil.valid) {
      assert.ok(hasil.galat.milestone);
      assert.ok(hasil.galat.statusPelaksanaan);
      assert.ok(hasil.galat.persentase);
      assert.ok(hasil.galat.danaTerpakai);
    }
  });
});

describe('berkas dokumentasi (KF24)', () => {
  it('menerima gambar dan PDF', () => {
    for (const tipe of [
      'image/png',
      'image/jpeg',
      'image/webp',
      'application/pdf',
    ]) {
      assert.equal(
        periksaBerkasDokumentasi({ nama: 'a', tipe, ukuran: 1024 }).valid,
        true,
        tipe,
      );
    }
  });

  it('menolak format lain, berkas kosong, dan berkas melebihi batas', () => {
    const exe = { nama: 'a.exe', tipe: 'application/x-msdownload', ukuran: 10 };
    assert.equal(periksaBerkasDokumentasi(exe).valid, false);
    assert.equal(
      periksaBerkasDokumentasi({ nama: 'a.png', tipe: 'image/png', ukuran: 0 })
        .valid,
      false,
    );
    assert.equal(
      periksaBerkasDokumentasi({
        nama: 'a.pdf',
        tipe: 'application/pdf',
        ukuran: DOKUMENTASI_MAKS_BYTE + 1,
      }).valid,
      false,
    );
  });

  it('membatasi jumlah berkas per pembaruan dan menunjuk berkas yang salah', () => {
    const baik = { nama: 'a.png', tipe: 'image/png', ukuran: 10 };
    assert.equal(periksaBerkasProgres([baik]), undefined);
    assert.ok(periksaBerkasProgres(Array(BATAS_BERKAS_PROGRES + 1).fill(baik)));
    const pesan = periksaBerkasProgres([
      baik,
      { nama: 'rahasia.exe', tipe: 'application/x-msdownload', ukuran: 10 },
    ]);
    assert.ok(pesan?.includes('rahasia.exe'));
  });
});

describe('lokasiKumpulUntuk (KF22)', () => {
  it('hanya membuka titik kumpul untuk pendaftaran yang diterima', () => {
    assert.equal(
      lokasiKumpulUntuk('accepted', ' Pos Mangrove '),
      'Pos Mangrove',
    );
    assert.equal(lokasiKumpulUntuk('pending', 'Pos Mangrove'), null);
    assert.equal(lokasiKumpulUntuk('rejected', 'Pos Mangrove'), null);
  });

  it('menganggap titik kumpul kosong sebagai belum diisi', () => {
    assert.equal(lokasiKumpulUntuk('accepted', '   '), null);
    assert.equal(lokasiKumpulUntuk('accepted', null), null);
  });
});
