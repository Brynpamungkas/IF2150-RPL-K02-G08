import { describe, expect, it } from 'vitest';
import { validasiAksi, validasiAlasan } from '@/shared/validasiAksi';
import { dataAksi } from './fixtures/aksi';

const validasi = (
  ubah: Record<string, unknown>,
  jenis: 'campaign' | 'project' = 'project',
  lengkap = true,
) => validasiAksi(jenis, { ...dataAksi, ...ubah }, lengkap, '2026-11-19');

describe('HIUPL C02 Project: validasiData dan validasiKebutuhan', () => {
  it('C02-UT01 menerima informasi dan kebutuhan project lengkap', () => {
    expect(validasi({})).toEqual(dataAksi);
  });
  it('C02-UT02 tahap informasi boleh belum mempunyai jadwal dan kebutuhan', () => {
    const hasil = validasiAksi(
      'project',
      {
        judul: 'Project',
        deskripsi: 'Deskripsi',
        tujuan: 'Tujuan',
        provinsi: 'Bali',
        kota: 'Tabanan',
      },
      false,
      '2026-11-19',
    );
    expect(hasil.mulai).toBeNull();
    expect(hasil.targetDana).toBe(0);
  });
  it('C02-UT03 kebutuhan dana nol diterima, tetapi negatif ditolak', () => {
    expect(validasi({ targetDana: 0 }).targetDana).toBe(0);
    expect(() => validasi({ targetDana: -1 })).toThrow();
  });
  it('C02-UT04 kuota menerima batas 1 dan 2147483647, menolak 0/pecahan/kelebihan', () => {
    for (const kuotaRelawan of [1, 2147483647])
      expect(validasi({ kuotaRelawan }).kuotaRelawan).toBe(kuotaRelawan);
    for (const kuotaRelawan of [0, -1, 1.5, 2147483648])
      expect(() => validasi({ kuotaRelawan })).toThrow();
  });
  it('C02-UT05 lokasi, jadwal, tujuan, logistik, kriteria dan titik kumpul wajib lengkap', () => {
    for (const kolom of [
      'provinsi',
      'kota',
      'mulai',
      'selesai',
      'tujuan',
      'kebutuhan',
      'kriteriaRelawan',
      'lokasiKumpul',
    ]) {
      expect(() => validasi({ [kolom]: '' })).toThrow();
    }
  });
  it('C02-UT06 satu hari kegiatan sah; tanggal palsu/terbalik/lampau ditolak', () => {
    expect(validasi({ selesai: dataAksi.mulai }).selesai).toBe(dataAksi.mulai);
    for (const ubah of [
      { mulai: '2026-02-30' },
      { mulai: '2026-12-20' },
      { mulai: '2026-11-01', selesai: '2026-11-18' },
      { mulai: '0001-01-01' },
    ])
      expect(() => validasi(ubah)).toThrow();
  });
  it('C02-UT07 koordinat harus sepasang; rentang geografis dan tipe diperiksa', () => {
    expect(validasi({ latitude: -90, longitude: 180 }).latitude).toBe(-90);
    for (const ubah of [
      { latitude: 91 },
      { longitude: -181 },
      { latitude: null },
      { latitude: '-6.93' },
    ])
      expect(() => validasi(ubah)).toThrow();
  });
  it('C02-UT08 rincian dana menerima 50 baris sah dan menolak 51/format salah', () => {
    const baris = { uraian: ' Bibit ', nominal: 0.01 };
    expect(
      validasi({ rincianDana: Array(50).fill(baris) }).rincianDana,
    ).toHaveLength(50);
    for (const rincianDana of [
      Array(51).fill(baris),
      'bukan array',
      [null],
      [{ uraian: '', nominal: 1 }],
      [{ uraian: 'Bibit', nominal: 0 }],
    ])
      expect(() => validasi({ rincianDana })).toThrow();
  });
});

describe('HIUPL C03 Campaign: validasiData, validasiTarget, validasiPeriode', () => {
  it('C03-UT01 data sah dinormalisasi dan informasi penggunaan dana dipertahankan', () => {
    const hasil = validasi({ judul: '  Pemulihan pesisir  ' }, 'campaign');
    expect(hasil.judul).toBe('Pemulihan pesisir');
    expect(hasil.rincianDana).toEqual(dataAksi.rincianDana);
  });
  it('C03-UT02 target menerima 0.01 dan 1 miliar, menolak nol/negatif/kelebihan', () => {
    for (const targetDana of [0.01, 1_000_000_000])
      expect(validasi({ targetDana }, 'campaign').targetDana).toBe(targetDana);
    for (const targetDana of [
      0,
      -1,
      1_000_000_001,
      1.001,
      NaN,
      Infinity,
      '10000',
      null,
      undefined,
    ])
      expect(() => validasi({ targetDana }, 'campaign')).toThrow();
  });
  it('C03-UT03 periode satu hari ditolak dan batas 365 hari diterima', () => {
    expect(() => validasi({ selesai: dataAksi.mulai }, 'campaign')).toThrow();
    expect(validasi({ selesai: '2027-11-19' }, 'campaign').selesai).toBe(
      '2027-11-19',
    );
    expect(() => validasi({ selesai: '2027-11-20' }, 'campaign')).toThrow();
  });
  it('C03-UT04 periode yang sedang berlangsung diterima, periode berakhir ditolak', () => {
    expect(validasi({ mulai: '2026-11-01' }, 'campaign').mulai).toBe(
      '2026-11-01',
    );
    expect(() =>
      validasi({ mulai: '2026-11-01', selesai: '2026-11-18' }, 'campaign'),
    ).toThrow();
  });
  it('C03-UT05 judul kosong/201 karakter dan deskripsi lebih dari 10000 ditolak', () => {
    expect(
      validasi(
        { judul: 'x'.repeat(200), deskripsi: 'x'.repeat(10000) },
        'campaign',
      ).judul,
    ).toHaveLength(200);
    for (const ubah of [
      { judul: ' ' },
      { judul: 'x'.repeat(201) },
      { deskripsi: 'x'.repeat(10001) },
    ])
      expect(() => validasi(ubah, 'campaign')).toThrow();
  });
  it('C03-UT06 badan null, array, angka dan string ditolak', () => {
    for (const badan of [null, [], 3, 'data'])
      expect(() => validasiAksi('campaign', badan)).toThrow();
  });
  it('C03-UT07 atribut opsional boleh tidak disertakan', () => {
    const hasil = validasi(
      {
        kategori: undefined,
        kebutuhan: undefined,
        rincianDana: undefined,
        latitude: null,
        longitude: null,
      },
      'campaign',
    );
    expect(hasil.kategori).toBe('');
    expect(hasil.rincianDana).toEqual([]);
  });
  it('C03-UT08 alasan penolakan harus berisi 1–2000 karakter setelah diperiksa', () => {
    expect(validasiAlasan('  Perjelas anggaran  ')).toBe('Perjelas anggaran');
    expect(validasiAlasan('x'.repeat(2000))).toHaveLength(2000);
    for (const alasan of ['', ' ', null, 'x'.repeat(2001)])
      expect(() => validasiAlasan(alasan)).toThrow();
  });
});
