import assert from 'node:assert/strict';
import { test } from 'node:test';
import { GalatValidasi } from '../shared/galat';
import {
  hariIniWib,
  validasiAksi,
  validasiAlasan,
} from '../shared/validasiAksi';

const dasar = {
  judul: 'Aksi iklim',
  deskripsi: 'Deskripsi aksi',
  tujuan: 'Melindungi lingkungan',
  provinsi: 'Bali',
  kota: 'Tabanan',
  targetDana: 100000,
  mulai: '2026-11-08',
  selesai: '2026-12-08',
  kebutuhan: 'Sarung tangan',
  kriteriaRelawan: 'Bersedia bekerja di lapangan',
  kuotaRelawan: 10,
  lokasiKumpul: 'Balai desa',
};
const validasi = (
  b: unknown,
  jenis: 'campaign' | 'project' = 'campaign',
  lengkap = true,
) => validasiAksi(jenis, b, lengkap, '2026-11-08');

test('campaign sah dan periode berjalan diterima; whitespace dinormalisasi', () => {
  assert.equal(
    validasi({ ...dasar, judul: ' Aksi ', mulai: '2026-11-01' }).judul,
    'Aksi',
  );
});
test('target campaign wajib positif, numerik, terbatas dan maksimal dua desimal', () => {
  for (const targetDana of [
    undefined,
    null,
    '',
    '100',
    0,
    -1,
    NaN,
    Infinity,
    1.001,
    1000000001,
  ]) {
    assert.throws(() => validasi({ ...dasar, targetDana }), GalatValidasi);
  }
  assert.equal(validasi({ ...dasar, targetDana: 1.01 }).targetDana, 1.01);
});
test('tanggal kalender, urutan, periode lampau dan batas 365 hari diperiksa', () => {
  for (const [mulai, selesai] of [
    ['', '2026-12-08'],
    ['2026-02-30', '2026-12-08'],
    ['2026-12-08', '2026-11-08'],
    ['2026-11-08', '2026-11-08'],
    ['2026-10-01', '2026-11-07'],
    ['2026-11-08', '2027-11-09'],
    ['x', '2026-12-08'],
  ])
    assert.throws(() => validasi({ ...dasar, mulai, selesai }), GalatValidasi);
  assert.equal(
    validasi({ ...dasar, mulai: '2026-11-08', selesai: '2027-11-08' }).selesai,
    '2027-11-08',
  );
});
test('tahap awal project menghasilkan informasi tanpa jadwal; kelengkapan diperiksa saat selesai', () => {
  const info = {
    judul: 'Project',
    deskripsi: 'Deskripsi',
    tujuan: 'Tujuan',
    provinsi: 'Bali',
    kota: 'Tabanan',
  };
  assert.equal(validasi(info, 'project', false).mulai, null);
  assert.throws(() => validasi(info, 'project'), GalatValidasi);
  assert.equal(validasi({ ...dasar, targetDana: 0 }, 'project').targetDana, 0);
  for (const ubah of [
    { targetDana: -1 },
    { kuotaRelawan: 0 },
    { kuotaRelawan: 1.5 },
    { kebutuhan: '' },
    { lokasiKumpul: '' },
    { kriteriaRelawan: '' },
    { tujuan: '' },
  ]) {
    assert.throws(
      () => validasi({ ...dasar, ...ubah }, 'project'),
      GalatValidasi,
    );
  }
});
test('tipe badan, panjang teks, koordinat dan rincian dana tidak dipercaya', () => {
  for (const b of [
    null,
    [],
    'x',
    { ...dasar, judul: 'x'.repeat(201) },
    { ...dasar, kota: ' ' },
    { ...dasar, latitude: -91, longitude: 110 },
    { ...dasar, latitude: -8 },
    { ...dasar, latitude: '0', longitude: 0 },
    { ...dasar, rincianDana: [{ uraian: 'Barang', nominal: -1 }] },
  ]) {
    assert.throws(() => validasi(b), GalatValidasi);
  }
  assert.equal(validasi({ ...dasar, latitude: 0, longitude: 0 }).latitude, 0);
  assert.deepEqual(
    validasi({
      ...dasar,
      rincianDana: [{ uraian: ' Peralatan ', nominal: 100 }],
    }).rincianDana,
    [{ uraian: 'Peralatan', nominal: 100 }],
    'Kontrak rincian mengikuti seed dan pembaca detail publik.',
  );
});
test('alasan penolakan tidak boleh kosong dan hari kalender memakai WIB', () => {
  for (const b of ['', ' ', null, 'x'.repeat(2001)])
    assert.throws(() => validasiAlasan(b), GalatValidasi);
  assert.equal(validasiAlasan(' Perbaiki lokasi '), 'Perbaiki lokasi');
  assert.equal(hariIniWib(new Date('2026-11-07T17:00:00Z')), '2026-11-08');
});
