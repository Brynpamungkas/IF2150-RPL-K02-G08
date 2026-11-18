/**
 * Pengujian unit kelas C09 PendaftaranRelawan, C34 RelawanController, dan
 * C38 ProgresController (UC07-UC09, KF19-KF25) untuk HIUPL Subbab 4.2.
 *
 * Basis data, sesi, dan penyimpanan berkas diganti tiruan lewat `mock.module`
 * sehingga setiap cabang aturan bisnis dapat diuji tanpa MySQL. Interaksi
 * dengan MySQL sungguhan diuji terpisah di relawanProgres.integrasi.test.ts.
 *
 * Jalankan: npm run test:node  (butuh flag --experimental-test-module-mocks,
 * sudah dipasang di scripts/test-node.mjs).
 */
import assert from 'node:assert/strict';
import { beforeEach, describe, it, mock } from 'node:test';

import type { PendaftaranRelawan } from '@/models/PendaftaranRelawan';
import type { ProgresProject } from '@/models/ProgresProject';
import type { RingkasanProject } from '@/server/repositories/pendaftaranRelawanRepository';
import {
  BATAS_FORM,
  bersihkanForm,
  validasiFormPendaftaran,
} from '@/shared/relawan';
import { BATAS_BERKAS_PROGRES, periksaBerkasProgres } from '@/shared/progres';
import { DOKUMENTASI_MAKS_BYTE } from '@/shared/dokumentasi';

const modulTiruanTersedia = typeof mock.module === 'function';

/* ------------------------------------------------------------------ */
/* Keadaan tiruan yang diatur ulang sebelum setiap pengujian           */
/* ------------------------------------------------------------------ */

type KeadaanTiruan = {
  pengguna: string | null;
  akunAda: boolean;
  project: RingkasanProject | null;
  sudahDaftar: boolean;
  diterima: number;
  pendaftaran: Map<string, PendaftaranRelawan>;
  disimpan: PendaftaranRelawan[];
  keputusan: { id: string; status: string }[];
  galatSimpan: unknown;
  // progres
  projectProgres: { idPembuat: string; terpublikasi: boolean } | null;
  peran: string | null;
  progresDisimpan: ProgresProject[];
  berkasDisimpan: string[];
  berkasDihapus: string[];
  galatSimpanProgres: unknown;
  bolehLihat: boolean;
};

let s: KeadaanTiruan;

function projectTerbuka(
  ubah: Partial<RingkasanProject> = {},
): RingkasanProject {
  return {
    idProject: 'P-1',
    idPembuat: 'pemilik',
    terpublikasi: true,
    pendaftaranDibuka: true,
    kuota: 3,
    ...ubah,
  };
}

function pendaftaranContoh(
  ubah: Partial<PendaftaranRelawan> = {},
): PendaftaranRelawan {
  return {
    idPendaftaran: 'V-1',
    idVolunteer: 'relawan',
    idProject: 'P-1',
    dataDiri: 'Nama: Rina; Telepon: 0812-1111-2222; Kota: Bandung',
    keahlian: 'Penanaman bibit, Dokumentasi',
    pengalaman: 'Bersih pantai 2025',
    ketersediaanJadwal: 'Sat 14 Nov 2026; Sun 15 Nov 2026',
    status: 'pending',
    tanggalDaftar: new Date('2026-11-01T02:00:00Z'),
    tanggalKeputusan: null,
    ...ubah,
  };
}

beforeEach(() => {
  s = {
    pengguna: 'relawan',
    akunAda: true,
    project: projectTerbuka(),
    sudahDaftar: false,
    diterima: 0,
    pendaftaran: new Map([['V-1', pendaftaranContoh()]]),
    disimpan: [],
    keputusan: [],
    galatSimpan: null,
    projectProgres: { idPembuat: 'pemilik', terpublikasi: true },
    peran: 'volunteer',
    progresDisimpan: [],
    berkasDisimpan: [],
    berkasDihapus: [],
    galatSimpanProgres: null,
    bolehLihat: true,
  };
});

if (modulTiruanTersedia) {
  mock.module('@/server/db', {
    namedExports: {
      withTransaction: async (aksi: (conn: unknown) => unknown) => aksi({}),
    },
  });

  mock.module('@/server/auth/sesiSementara', {
    namedExports: { getIdPenggunaSaatIni: async () => s.pengguna },
  });

  mock.module('@/server/repositories/pendaftaranRelawanRepository', {
    namedExports: {
      penggunaAda: async () => s.akunAda,
      kunciProject: async () => s.project,
      cariProject: async () => s.project,
      adaPendaftaran: async () => s.sudahDaftar,
      hitungDiterima: async () => s.diterima,
      simpanPendaftaran: async (
        _conn: unknown,
        baris: Omit<
          PendaftaranRelawan,
          'status' | 'tanggalDaftar' | 'tanggalKeputusan'
        >,
      ) => {
        if (s.galatSimpan) throw s.galatSimpan;
        s.disimpan.push({
          ...baris,
          status: 'pending',
          tanggalDaftar: new Date(),
          tanggalKeputusan: null,
        });
      },
      ambilPendaftaran: async (_conn: unknown, id: string) =>
        s.pendaftaran.get(id) ?? null,
      simpanKeputusan: async (_conn: unknown, id: string, status: string) => {
        s.keputusan.push({ id, status });
        const lama = s.pendaftaran.get(id);
        if (lama) {
          s.pendaftaran.set(id, {
            ...lama,
            status: status as PendaftaranRelawan['status'],
            tanggalKeputusan: new Date(),
          });
        }
      },
      daftarPendaftarProject: async () => [...s.pendaftaran.values()],
      daftarPendaftaranSaya: async () =>
        [...s.pendaftaran.values()].map((p) => ({
          ...p,
          namaProject: 'Rehabilitasi Mangrove Sayung',
          kota: 'Demak',
          provinsi: 'Jawa Tengah',
          jadwalMulai: '2026-11-14',
          jadwalSelesai: '2026-11-15',
          lokasiKumpul: 'Dermaga Desa Timbulsloko',
        })),
    },
  });

  mock.module('@/server/repositories/progresRepository', {
    namedExports: {
      ambilProjectProgres: async () => s.projectProgres,
      ambilPeran: async () => s.peran,
      simpanPembaruan: async (_conn: unknown, progres: ProgresProject) => {
        if (s.galatSimpanProgres) throw s.galatSimpanProgres;
        s.progresDisimpan.push(progres);
      },
      daftarProgresProject: async () => s.progresDisimpan,
      daftarProgresPengguna: async () => [],
      ambilProgresPengguna: async () => null,
    },
  });

  mock.module('@/server/services/dokumentasiService', {
    namedExports: {
      simpanDokumentasiProgres: async (idProject: string, berkas: File) => {
        const nama = `${s.berkasDisimpan.length + 1}-${berkas.name}`;
        s.berkasDisimpan.push(nama);
        return { nama, url: `/api/dokumentasi/${idProject}/${nama}` };
      },
      bolehMelihatDokumentasi: async () => s.bolehLihat,
      ambilDokumentasiProgres: async () => null,
    },
  });

  mock.module('@/server/storage/dokumentasiStorage', {
    namedExports: {
      getPenyimpananDokumentasi: () => ({
        hapus: async (_idProject: string, nama: string) => {
          s.berkasDihapus.push(nama);
        },
      }),
    },
  });
}

/* ------------------------------------------------------------------ */
/* Pembantu                                                            */
/* ------------------------------------------------------------------ */

const formLengkap = {
  dataDiri: {
    nama: 'Rina Lestari',
    telepon: '0812-1111-2222',
    kota: 'Bandung',
  },
  keahlian: ['Penanaman bibit'],
  pengalaman: 'Bersih pantai 2025',
  jadwal: ['Sat 14 Nov 2026'],
};

function permintaanJson(badan: unknown): Request {
  return new Request('http://localhost/api', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: typeof badan === 'string' ? badan : JSON.stringify(badan),
  });
}

function permintaanProgres(
  isian: Record<string, string>,
  berkas: File[] = [],
): Request {
  const form = new FormData();
  for (const [k, v] of Object.entries(isian)) form.set(k, v);
  for (const b of berkas) form.append('dokumentasi', b);
  return new Request('http://localhost/api', { method: 'POST', body: form });
}

const isianProgres = {
  milestone: 'Penanaman 500 bibit tahap 1',
  statusPelaksanaan: 'berjalan',
  catatan: 'Cuaca cerah',
  persentase: '40',
  danaTerpakai: '1500000',
};

const png = (nama = 'foto.png') =>
  new File([new Uint8Array([137, 80, 78, 71])], nama, { type: 'image/png' });

async function jsonDari(respons: Response) {
  return (await respons.json()) as Record<string, unknown>;
}

const relawanService = () => import('@/server/services/relawanService');
const relawanController = () =>
  import('@/server/controllers/RelawanController');
const progresController = () =>
  import('@/server/controllers/ProgresController');

const opsi = {
  skip: !modulTiruanTersedia && 'butuh --experimental-test-module-mocks',
};

/* ================================================================== */
/* C09 PendaftaranRelawan                                              */
/* ================================================================== */

describe('C09 PendaftaranRelawan', opsi, () => {
  // buatPendaftaran()
  it('C09-UT01 buatPendaftaran: normal, objek baru berstatus pending', async () => {
    const { daftarRelawan } = await relawanService();
    const hasil = await daftarRelawan('relawan', 'P-1', formLengkap);
    assert.equal(hasil.status, 'pending');
    assert.equal(hasil.tanggalKeputusan, null);
    assert.equal(hasil.idVolunteer, 'relawan');
    assert.match(hasil.idPendaftaran, /^V-[0-9a-f]{8}$/);
  });

  it('C09-UT02 buatPendaftaran: batas, tepat 20 keahlian diterima dan 21 ditolak', () => {
    const dua = (n: number) =>
      Array.from({ length: n }, (_, i) => `Keahlian ${i + 1}`);
    const pas = bersihkanForm({
      ...formLengkap,
      keahlian: dua(BATAS_FORM.jumlahButir),
    });
    const lebih = bersihkanForm({
      ...formLengkap,
      keahlian: dua(BATAS_FORM.jumlahButir + 1),
    });
    assert.equal(validasiFormPendaftaran(pas).keahlian, undefined);
    assert.match(validasiFormPendaftaran(lebih).keahlian ?? '', /Maksimal 20/);
  });

  it('C09-UT03 buatPendaftaran: negatif, nilai bukan teks dianggap kosong', () => {
    const form = bersihkanForm({
      dataDiri: { nama: 123, telepon: null, kota: ['x'] },
      keahlian: 'bukan larik',
      pengalaman: {},
      jadwal: 7,
    });
    assert.deepEqual(form, {
      dataDiri: { nama: '', telepon: '', kota: '' },
      keahlian: [],
      pengalaman: '',
      jadwal: [],
    });
  });

  // validasiKelengkapan()
  it('C09-UT04 validasiKelengkapan: normal, formulir lengkap tanpa galat', () => {
    assert.deepEqual(validasiFormPendaftaran(bersihkanForm(formLengkap)), {});
  });

  it('C09-UT05 validasiKelengkapan: batas, nama 100 karakter lolos dan 101 ditolak', () => {
    const nama = (n: number) =>
      bersihkanForm({
        ...formLengkap,
        dataDiri: { ...formLengkap.dataDiri, nama: 'a'.repeat(n) },
      });
    assert.equal(
      validasiFormPendaftaran(nama(BATAS_FORM.nama)).nama,
      undefined,
    );
    assert.match(
      validasiFormPendaftaran(nama(BATAS_FORM.nama + 1)).nama ?? '',
      /maksimal 100/,
    );
  });

  it('C09-UT06 validasiKelengkapan: negatif, formulir kosong ditolak di keenam kolom', async () => {
    const { daftarRelawan } = await relawanService();
    await assert.rejects(
      daftarRelawan('relawan', 'P-1', {}),
      (g: { status: number; rincian: object }) => {
        assert.equal(g.status, 400);
        assert.deepEqual(Object.keys(g.rincian).sort(), [
          'jadwal',
          'keahlian',
          'kota',
          'nama',
          'pengalaman',
          'telepon',
        ]);
        return true;
      },
    );
    assert.equal(s.disimpan.length, 0);
  });

  // cekPendaftaranGanda()
  it('C09-UT07 cekPendaftaranGanda: normal, belum pernah mendaftar maka disimpan', async () => {
    const { daftarRelawan } = await relawanService();
    await daftarRelawan('relawan', 'P-1', formLengkap);
    assert.equal(s.disimpan.length, 1);
  });

  it('C09-UT08 cekPendaftaranGanda: negatif, pendaftaran kedua ditolak 409', async () => {
    s.sudahDaftar = true;
    const { daftarRelawan } = await relawanService();
    await assert.rejects(daftarRelawan('relawan', 'P-1', formLengkap), {
      status: 409,
      message: 'Anda sudah mendaftar pada project ini.',
    });
    assert.equal(s.disimpan.length, 0);
  });

  it('C09-UT09 cekPendaftaranGanda: batas, dua kiriman bersamaan ditahan UNIQUE KEY', async () => {
    // Pemeriksaan awal lolos, tetapi INSERT kedua gagal ER_DUP_ENTRY.
    s.galatSimpan = Object.assign(new Error('Duplicate entry'), {
      code: 'ER_DUP_ENTRY',
    });
    const { daftarRelawan } = await relawanService();
    await assert.rejects(daftarRelawan('relawan', 'P-1', formLengkap), {
      status: 409,
      message: 'Anda sudah mendaftar pada project ini.',
    });
  });

  // simpanPendaftaran()
  it('C09-UT10 simpanPendaftaran: normal, kolom teks disimpan dalam format basis data', async () => {
    const { daftarRelawan } = await relawanService();
    await daftarRelawan('relawan', 'P-1', {
      ...formLengkap,
      keahlian: ['Penanaman bibit', 'Dokumentasi'],
      jadwal: ['Sat 14 Nov 2026', 'Sun 15 Nov 2026'],
    });
    const [baris] = s.disimpan;
    assert.equal(
      baris.dataDiri,
      'Nama: Rina Lestari; Telepon: 0812-1111-2222; Kota: Bandung',
    );
    assert.equal(baris.keahlian, 'Penanaman bibit, Dokumentasi');
    assert.equal(baris.ketersediaanJadwal, 'Sat 14 Nov 2026; Sun 15 Nov 2026');
    assert.equal(baris.status, 'pending');
  });

  it('C09-UT11 simpanPendaftaran: batas, sisa satu kuota masih diterima dan kuota penuh ditolak', async () => {
    const { daftarRelawan } = await relawanService();
    s.diterima = 2; // kuota 3
    await daftarRelawan('relawan', 'P-1', formLengkap);
    assert.equal(s.disimpan.length, 1);
    s.diterima = 3;
    await assert.rejects(daftarRelawan('relawan', 'P-1', formLengkap), {
      status: 409,
      message: 'Kuota relawan project ini sudah penuh.',
    });
    assert.equal(s.disimpan.length, 1);
  });

  it('C09-UT12 simpanPendaftaran: negatif, project ditutup, milik sendiri, draft, atau akun tidak dikenal', async () => {
    const { daftarRelawan } = await relawanService();
    s.project = projectTerbuka({ pendaftaranDibuka: false });
    await assert.rejects(daftarRelawan('relawan', 'P-1', formLengkap), {
      status: 409,
    });
    s.project = projectTerbuka({ idPembuat: 'relawan' });
    await assert.rejects(daftarRelawan('relawan', 'P-1', formLengkap), {
      status: 403,
    });
    s.project = projectTerbuka({ terpublikasi: false });
    await assert.rejects(daftarRelawan('relawan', 'P-1', formLengkap), {
      status: 404,
    });
    s.project = projectTerbuka();
    s.akunAda = false;
    await assert.rejects(daftarRelawan('relawan', 'P-1', formLengkap), {
      status: 401,
    });
    assert.equal(s.disimpan.length, 0);
  });

  // getDetailPendaftar()
  it('C09-UT13 getDetailPendaftar: normal, pemilik menerima rincian yang sudah diurai', async () => {
    const { lihatPendaftar } = await relawanController();
    s.pengguna = 'pemilik';
    const respons = await lihatPendaftar('P-1');
    assert.equal(respons.status, 200);
    const { pendaftar } = (await jsonDari(respons)) as {
      pendaftar: { dataDiri: object; keahlian: string[]; jadwal: string[] }[];
    };
    assert.deepEqual(pendaftar[0].dataDiri, {
      nama: 'Rina',
      telepon: '0812-1111-2222',
      kota: 'Bandung',
    });
    assert.deepEqual(pendaftar[0].keahlian, ['Penanaman bibit', 'Dokumentasi']);
    assert.deepEqual(pendaftar[0].jadwal, [
      'Sat 14 Nov 2026',
      'Sun 15 Nov 2026',
    ]);
  });

  it('C09-UT14 getDetailPendaftar: batas, project tanpa pendaftar menghasilkan daftar kosong', async () => {
    const { daftarPendaftar } = await relawanService();
    s.pendaftaran.clear();
    assert.deepEqual(await daftarPendaftar('pemilik', 'P-1'), []);
  });

  it('C09-UT15 getDetailPendaftar: negatif, bukan pemilik 403 dan project tidak ada 404', async () => {
    const { daftarPendaftar } = await relawanService();
    await assert.rejects(daftarPendaftar('relawan', 'P-1'), { status: 403 });
    s.project = null;
    await assert.rejects(daftarPendaftar('pemilik', 'P-X'), { status: 404 });
  });

  // perbaruiStatus()
  it('C09-UT16 perbaruiStatus: normal, pending menjadi accepted', async () => {
    const { putuskanPendaftaran } = await relawanService();
    const hasil = await putuskanPendaftaran(
      'pemilik',
      'P-1',
      'V-1',
      'accepted',
    );
    assert.equal(hasil.status, 'accepted');
    assert.ok(hasil.tanggalKeputusan instanceof Date);
    assert.deepEqual(s.keputusan, [{ id: 'V-1', status: 'accepted' }]);
  });

  it('C09-UT17 perbaruiStatus: batas, kuota penuh menolak accept tetapi reject tetap boleh', async () => {
    const { putuskanPendaftaran } = await relawanService();
    s.diterima = 3; // kuota 3
    await assert.rejects(
      putuskanPendaftaran('pemilik', 'P-1', 'V-1', 'accepted'),
      {
        status: 409,
        message: 'Kuota relawan sudah penuh, pendaftaran tidak dapat diterima.',
      },
    );
    const hasil = await putuskanPendaftaran(
      'pemilik',
      'P-1',
      'V-1',
      'rejected',
    );
    assert.equal(hasil.status, 'rejected');
  });

  it('C09-UT18 perbaruiStatus: negatif, keputusan final, nilai tidak sah, dan pendaftaran project lain', async () => {
    const { putuskanPendaftaran } = await relawanService();
    s.pendaftaran.set('V-1', pendaftaranContoh({ status: 'rejected' }));
    await assert.rejects(
      putuskanPendaftaran('pemilik', 'P-1', 'V-1', 'accepted'),
      { status: 409 },
    );
    await assert.rejects(
      putuskanPendaftaran('pemilik', 'P-1', 'V-1', 'maybe'),
      { status: 400 },
    );
    s.pendaftaran.set(
      'V-2',
      pendaftaranContoh({ idPendaftaran: 'V-2', idProject: 'P-LAIN' }),
    );
    await assert.rejects(
      putuskanPendaftaran('pemilik', 'P-1', 'V-2', 'accepted'),
      { status: 404 },
    );
    await assert.rejects(
      putuskanPendaftaran('relawan', 'P-1', 'V-1', 'accepted'),
      { status: 403 },
    );
    assert.equal(s.keputusan.length, 0);
  });
});

/* ================================================================== */
/* C34 RelawanController                                               */
/* ================================================================== */

describe('C34 RelawanController', opsi, () => {
  // daftarRelawan()
  it('C34-UT01 daftarRelawan: normal, POST lengkap dijawab 201 dan status pending', async () => {
    const { daftar } = await relawanController();
    const respons = await daftar(permintaanJson(formLengkap), 'P-1');
    assert.equal(respons.status, 201);
    const isi = (await jsonDari(respons)) as {
      pendaftaran: { status: string };
    };
    assert.equal(isi.pendaftaran.status, 'pending');
  });

  it('C34-UT02 daftarRelawan: negatif, tamu ditolak 401 tanpa menyimpan', async () => {
    s.pengguna = null;
    const { daftar } = await relawanController();
    const respons = await daftar(permintaanJson(formLengkap), 'P-1');
    assert.equal(respons.status, 401);
    assert.equal(s.disimpan.length, 0);
  });

  it('C34-UT03 daftarRelawan: batas, badan JSON rusak diperlakukan sebagai formulir kosong', async () => {
    const { daftar } = await relawanController();
    const respons = await daftar(permintaanJson('{bukan json'), 'P-1');
    assert.equal(respons.status, 400);
    const isi = (await jsonDari(respons)) as { galat: Record<string, string> };
    assert.equal(Object.keys(isi.galat).length, 6);
  });

  // getPesanKesalahan()
  it('C34-UT04 getPesanKesalahan: normal, galat aturan bisnis menjadi {pesan} dengan status 4xx', async () => {
    s.diterima = 3;
    const { daftar } = await relawanController();
    const respons = await daftar(permintaanJson(formLengkap), 'P-1');
    assert.equal(respons.status, 409);
    assert.deepEqual(await jsonDari(respons), {
      pesan: 'Kuota relawan project ini sudah penuh.',
    });
  });

  it('C34-UT05 getPesanKesalahan: batas, galat formulir menyertakan pesan per kolom', async () => {
    const { daftar } = await relawanController();
    const respons = await daftar(
      permintaanJson({
        ...formLengkap,
        dataDiri: { ...formLengkap.dataDiri, telepon: 'abc' },
      }),
      'P-1',
    );
    const isi = (await jsonDari(respons)) as { galat: Record<string, string> };
    assert.deepEqual(Object.keys(isi.galat), ['telepon']);
  });

  it('C34-UT06 getPesanKesalahan: negatif, galat tak terduga menjadi 500 tanpa membocorkan detail', async () => {
    s.galatSimpan = new Error('koneksi MySQL putus di 10.0.0.5');
    const galatAsli = console.error;
    console.error = () => {};
    try {
      const { daftar } = await relawanController();
      const respons = await daftar(permintaanJson(formLengkap), 'P-1');
      assert.equal(respons.status, 500);
      const isi = await jsonDari(respons);
      assert.equal(isi.pesan, 'Terjadi kesalahan pada peladen.');
      assert.doesNotMatch(JSON.stringify(isi), /10\.0\.0\.5/);
    } finally {
      console.error = galatAsli;
    }
  });

  // getDaftarPendaftar()
  it('C34-UT07 getDaftarPendaftar: normal, pemilik mendapat 200', async () => {
    s.pengguna = 'pemilik';
    const { lihatPendaftar } = await relawanController();
    assert.equal((await lihatPendaftar('P-1')).status, 200);
  });

  it('C34-UT08 getDaftarPendaftar: negatif, pengguna lain 403 sehingga nomor telepon tidak bocor', async () => {
    s.pengguna = 'orang-lain';
    const { lihatPendaftar } = await relawanController();
    const respons = await lihatPendaftar('P-1');
    assert.equal(respons.status, 403);
    assert.doesNotMatch(JSON.stringify(await jsonDari(respons)), /0812/);
  });

  it('C34-UT09 getDaftarPendaftar: batas, tamu 401', async () => {
    s.pengguna = null;
    const { lihatPendaftar } = await relawanController();
    assert.equal((await lihatPendaftar('P-1')).status, 401);
  });

  // buatKeputusan()
  it('C34-UT10 buatKeputusan: normal, PATCH accepted dijawab 200 dengan status baru', async () => {
    s.pengguna = 'pemilik';
    const { putuskan } = await relawanController();
    const respons = await putuskan(
      permintaanJson({ keputusan: 'accepted' }),
      'P-1',
      'V-1',
    );
    assert.equal(respons.status, 200);
    const isi = (await jsonDari(respons)) as {
      pesan: string;
      pendaftaran: { status: string };
    };
    assert.equal(isi.pesan, 'Pendaftaran diterima.');
    assert.equal(isi.pendaftaran.status, 'accepted');
  });

  it('C34-UT11 buatKeputusan: negatif, badan tanpa keputusan 400', async () => {
    s.pengguna = 'pemilik';
    const { putuskan } = await relawanController();
    const respons = await putuskan(permintaanJson({}), 'P-1', 'V-1');
    assert.equal(respons.status, 400);
  });

  it('C34-UT12 buatKeputusan: batas, accept saat kuota penuh 409 dan status tetap pending', async () => {
    s.pengguna = 'pemilik';
    s.diterima = 3;
    const { putuskan } = await relawanController();
    const respons = await putuskan(
      permintaanJson({ keputusan: 'accepted' }),
      'P-1',
      'V-1',
    );
    assert.equal(respons.status, 409);
    assert.equal(s.pendaftaran.get('V-1')?.status, 'pending');
  });

  // getStatusPendaftaran()
  it('C34-UT13 getStatusPendaftaran: normal, diterima menampilkan titik kumpul dan jadwal', async () => {
    s.pendaftaran.set(
      'V-1',
      pendaftaranContoh({ status: 'accepted', tanggalKeputusan: new Date() }),
    );
    const { lihatPendaftaranSaya } = await relawanController();
    const respons = await lihatPendaftaranSaya();
    const { pendaftaran } = (await jsonDari(respons)) as {
      pendaftaran: { lokasiKumpul: string | null; jadwal: string[] }[];
    };
    assert.equal(respons.status, 200);
    assert.equal(pendaftaran[0].lokasiKumpul, 'Dermaga Desa Timbulsloko');
    assert.deepEqual(pendaftaran[0].jadwal, [
      'Sat 14 Nov 2026',
      'Sun 15 Nov 2026',
    ]);
  });

  it('C34-UT14 getStatusPendaftaran: batas, pending dan rejected tidak menerima titik kumpul', async () => {
    const { lihatPendaftaranSaya } = await relawanController();
    for (const status of ['pending', 'rejected'] as const) {
      s.pendaftaran.set('V-1', pendaftaranContoh({ status }));
      const { pendaftaran } = (await jsonDari(
        await lihatPendaftaranSaya(),
      )) as {
        pendaftaran: { lokasiKumpul: string | null }[];
      };
      assert.equal(pendaftaran[0].lokasiKumpul, null, status);
    }
  });

  it('C34-UT15 getStatusPendaftaran: negatif, tamu 401', async () => {
    s.pengguna = null;
    const { lihatPendaftaranSaya } = await relawanController();
    assert.equal((await lihatPendaftaranSaya()).status, 401);
  });
});

/* ================================================================== */
/* C38 ProgresController                                               */
/* ================================================================== */

describe('C38 ProgresController', opsi, () => {
  // perbaruiProgres()
  it('C38-UT01 perbaruiProgres: normal, pemilik menyimpan progres dan dokumentasi dengan stempel waktu', async () => {
    s.pengguna = 'pemilik';
    const { perbarui } = await progresController();
    const sebelum = Date.now();
    const respons = await perbarui(
      permintaanProgres(isianProgres, [png()]),
      'P-1',
    );
    assert.equal(respons.status, 201);
    const [progres] = s.progresDisimpan;
    assert.equal(progres.statusPelaksanaan, 'berjalan');
    assert.equal(progres.persentase, 40);
    assert.equal(progres.dokumentasiUrl, '/api/dokumentasi/P-1/1-foto.png');
    assert.ok(progres.timestampPembaruan.getTime() >= sebelum);
  });

  it('C38-UT02 perbaruiProgres: batas, 5 berkas diterima dan 6 berkas ditolak', async () => {
    s.pengguna = 'pemilik';
    const { perbarui } = await progresController();
    const banyak = (n: number) =>
      Array.from({ length: n }, (_, i) => png(`f${i}.png`));
    assert.equal(
      (
        await perbarui(
          permintaanProgres(isianProgres, banyak(BATAS_BERKAS_PROGRES)),
          'P-1',
        )
      ).status,
      201,
    );
    const respons = await perbarui(
      permintaanProgres(isianProgres, banyak(BATAS_BERKAS_PROGRES + 1)),
      'P-1',
    );
    assert.equal(respons.status, 400);
    const isi = (await jsonDari(respons)) as { galat: { dokumentasi: string } };
    assert.match(isi.galat.dokumentasi, /Maksimal 5 berkas/);
  });

  it('C38-UT03 perbaruiProgres: batas, berkas tepat 50 MB diterima dan 1 byte lebih ditolak', () => {
    const berkas = (ukuran: number) => [
      { nama: 'besar.pdf', tipe: 'application/pdf', ukuran },
    ];
    assert.equal(
      periksaBerkasProgres(berkas(DOKUMENTASI_MAKS_BYTE)),
      undefined,
    );
    assert.match(
      periksaBerkasProgres(berkas(DOKUMENTASI_MAKS_BYTE + 1)) ?? '',
      /besar\.pdf/,
    );
  });

  it('C38-UT04 perbaruiProgres: negatif, milestone kosong dan status di luar pilihan ditolak 400', async () => {
    s.pengguna = 'pemilik';
    const { perbarui } = await progresController();
    const respons = await perbarui(
      permintaanProgres({
        ...isianProgres,
        milestone: '',
        statusPelaksanaan: 'hampir',
      }),
      'P-1',
    );
    assert.equal(respons.status, 400);
    const isi = (await jsonDari(respons)) as { galat: Record<string, string> };
    assert.deepEqual(Object.keys(isi.galat).sort(), [
      'milestone',
      'statusPelaksanaan',
    ]);
    assert.equal(s.progresDisimpan.length, 0);
  });

  it('C38-UT05 perbaruiProgres: negatif, badan bukan multipart ditolak 400', async () => {
    s.pengguna = 'pemilik';
    const { perbarui } = await progresController();
    const respons = await perbarui(permintaanJson(isianProgres), 'P-1');
    assert.equal(respons.status, 400);
    assert.match(
      String((await jsonDari(respons)).pesan),
      /multipart\/form-data/,
    );
  });

  it('C38-UT06 perbaruiProgres: negatif, gagal menulis basis data maka berkas yang sudah tersimpan dihapus', async () => {
    s.pengguna = 'pemilik';
    s.galatSimpanProgres = new Error('deadlock');
    const galatAsli = console.error;
    console.error = () => {};
    try {
      const { perbarui } = await progresController();
      const respons = await perbarui(
        permintaanProgres(isianProgres, [png('a.png'), png('b.png')]),
        'P-1',
      );
      assert.equal(respons.status, 500);
      assert.deepEqual(s.berkasDihapus.sort(), [...s.berkasDisimpan].sort());
      assert.equal(s.berkasDihapus.length, 2);
    } finally {
      console.error = galatAsli;
    }
  });

  // bukaHalamanProgres() - pemeriksaan hak akses KF25
  it('C38-UT07 bukaHalamanProgres: normal, Admin Sistem yang bukan pembuat diizinkan', async () => {
    s.pengguna = 'admin-1';
    s.peran = 'admin';
    const { perbarui } = await progresController();
    assert.equal(
      (await perbarui(permintaanProgres(isianProgres), 'P-1')).status,
      201,
    );
  });

  it('C38-UT08 bukaHalamanProgres: negatif, pengguna lain ditolak 403 tanpa perubahan data', async () => {
    s.pengguna = 'relawan';
    s.peran = 'volunteer';
    const { perbarui } = await progresController();
    const respons = await perbarui(
      permintaanProgres(isianProgres, [png()]),
      'P-1',
    );
    assert.equal(respons.status, 403);
    assert.equal(s.progresDisimpan.length, 0);
    assert.equal(s.berkasDisimpan.length, 0);
  });

  it('C38-UT09 bukaHalamanProgres: batas, tamu 401, akun hilang 401, project draft 409, project tidak ada 404', async () => {
    const { perbarui } = await progresController();
    s.pengguna = null;
    assert.equal(
      (await perbarui(permintaanProgres(isianProgres), 'P-1')).status,
      401,
    );
    s.pengguna = 'akun-terhapus';
    s.peran = null;
    assert.equal(
      (await perbarui(permintaanProgres(isianProgres), 'P-1')).status,
      401,
    );
    s.pengguna = 'pemilik';
    s.projectProgres = { idPembuat: 'pemilik', terpublikasi: false };
    assert.equal(
      (await perbarui(permintaanProgres(isianProgres), 'P-1')).status,
      409,
    );
    s.projectProgres = null;
    assert.equal(
      (await perbarui(permintaanProgres(isianProgres), 'P-X')).status,
      404,
    );
    assert.equal(s.progresDisimpan.length, 0);
  });

  // getPesanKesalahan() dan riwayat progres
  it('C38-UT10 getPesanKesalahan: normal, riwayat project terbuka dibaca dengan stempel waktu ISO', async () => {
    s.progresDisimpan.push({
      idProgres: 'PRG-1',
      idProject: 'P-1',
      idPengguna: 'pemilik',
      milestone: 'Tahap 1',
      statusPelaksanaan: 'berjalan',
      catatan: null,
      persentase: 10,
      danaTerpakai: null,
      dokumentasiUrl: null,
      timestampPembaruan: new Date('2026-11-10T03:00:00Z'),
    });
    const { lihatRiwayat } = await progresController();
    const respons = await lihatRiwayat('P-1');
    const { progres } = (await jsonDari(respons)) as {
      progres: { timestampPembaruan: string }[];
    };
    assert.equal(respons.status, 200);
    assert.equal(progres[0].timestampPembaruan, '2026-11-10T03:00:00.000Z');
  });

  it('C38-UT11 getPesanKesalahan: negatif, riwayat project tertutup dijawab 403 dengan pesan', async () => {
    s.bolehLihat = false;
    const { lihatRiwayat } = await progresController();
    const respons = await lihatRiwayat('P-1');
    assert.equal(respons.status, 403);
    assert.match(
      String((await jsonDari(respons)).pesan),
      /pembuat project dan Admin Sistem/,
    );
  });
});
