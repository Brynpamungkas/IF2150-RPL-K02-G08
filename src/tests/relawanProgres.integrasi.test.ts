/**
 * Pengujian integrasi relawan dan progres project (UC07-UC09, KF19-KF25)
 * terhadap MySQL sungguhan.
 * Butuh database berjalan dan file .env (lihat README: npm run db:up).
 * Bila database tidak tersedia, seluruh pengujian di file ini dilewati (skip).
 * Data uji dibuat dengan ID acak dan dihapus kembali setelah selesai.
 */
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { after, before, describe, it, type TestContext } from 'node:test';
import type { RowDataPacket } from 'mysql2/promise';
import { execute, getPool, query } from '@/server/db';
import {
  daftarPendaftar,
  daftarRelawan,
  pendaftaranSaya,
  putuskanPendaftaran,
} from '@/server/services/relawanService';
import {
  perbaruiProgres,
  riwayatProgres,
} from '@/server/services/progresService';
import { isGalatValidasi } from '@/shared/galat';

const akhiran = randomUUID().slice(0, 8);
const ID = {
  pemilik: `tst-pm-${akhiran}`,
  admin: `tst-ad-${akhiran}`,
  orangLain: `tst-ol-${akhiran}`,
  relawan: [1, 2, 3].map((n) => `tst-r${n}-${akhiran}`),
  project: `tst-pr-${akhiran}`,
  projectDraft: `tst-pd-${akhiran}`,
};
const KUOTA = 2;
const TITIK_KUMPUL = 'Pos Mangrove Tugu';

let dbSiap = false;

function lewatiBilaTanpaDb(t: TestContext): boolean {
  if (!dbSiap) t.skip('database tidak tersedia (atur .env lalu npm run db:up)');
  return !dbSiap;
}

const formLengkap = (nama: string) => ({
  dataDiri: { nama, telepon: '0812-3344-5566', kota: 'Semarang' },
  keahlian: ['Photo documentation'],
  pengalaman: 'Pernah menanam mangrove.',
  jadwal: ['Sat 8 Nov 2026'],
});

/** Status HTTP galat validasi, 'OK' bila tidak ada galat. */
async function statusGalat(p: Promise<unknown>): Promise<number | 'OK'> {
  try {
    await p;
    return 'OK';
  } catch (e) {
    if (isGalatValidasi(e)) return e.status;
    throw e;
  }
}

async function ambil(sql: string, params: unknown[]): Promise<RowDataPacket> {
  const [baris] = await query<RowDataPacket>(sql, params);
  assert.ok(baris, 'baris tidak ditemukan');
  return baris;
}

const masukanProgres = (milestone: string) => ({
  mentah: {
    milestone,
    statusPelaksanaan: 'berjalan',
    catatan: 'Catatan uji',
    persentase: '35',
    danaTerpakai: '24500000',
  },
  berkas: [] as File[],
});

async function bersihkan() {
  await execute('DELETE FROM project WHERE id_project IN (?, ?)', [
    ID.project,
    ID.projectDraft,
  ]); // pendaftaran dan progres ikut terhapus (ON DELETE CASCADE)
  const pengguna = [ID.pemilik, ID.admin, ID.orangLain, ...ID.relawan];
  await execute(
    `DELETE FROM pengguna WHERE id_pengguna IN (${pengguna.map(() => '?').join(', ')})`,
    pengguna,
  );
}

before(async () => {
  if (!process.env.DB_NAME) return;
  try {
    await query('SELECT 1');
  } catch {
    return;
  }
  dbSiap = true;

  const pengguna: [string, string, string][] = [
    [ID.pemilik, 'Pemilik Uji', 'pembuat_project'],
    [ID.admin, 'Admin Uji', 'admin'],
    [ID.orangLain, 'Orang Lain', 'volunteer'],
    ...ID.relawan.map((id, i): [string, string, string] => [
      id,
      `Relawan Uji ${i + 1}`,
      'volunteer',
    ]),
  ];
  for (const [id, nama, peran] of pengguna) {
    await execute(
      'INSERT INTO pengguna (id_pengguna, nama, peran) VALUES (?, ?, ?)',
      [id, nama, peran],
    );
  }

  const sqlProject = `INSERT INTO project (id_project, id_pembuat, nama, deskripsi,
      provinsi, kota, kebutuhan_dana, kuota_relawan, status_pendaftaran_project,
      jadwal_mulai, jadwal_selesai, lokasi_kumpul, status)
    VALUES (?, ?, ?, 'uji', 'Jawa Tengah', 'Semarang', 1000000, ?, 'dibuka',
      '2026-11-08', '2026-11-10', ?, ?)`;
  await execute(sqlProject, [
    ID.project,
    ID.pemilik,
    'Project Relawan Uji',
    KUOTA,
    TITIK_KUMPUL,
    'terpublikasi',
  ]);
  await execute(sqlProject, [
    ID.projectDraft,
    ID.pemilik,
    'Project Draft Uji',
    KUOTA,
    TITIK_KUMPUL,
    'draft',
  ]);
});

after(async () => {
  if (!process.env.DB_NAME) return;
  if (dbSiap) await bersihkan();
  await getPool().end();
});

describe('Pendaftaran relawan (integrasi MySQL)', () => {
  it('KF19/KF20: pendaftaran tersimpan pending dan tidak bisa ganda', async (t) => {
    if (lewatiBilaTanpaDb(t)) return;
    const [r1] = ID.relawan;

    const hasil = await daftarRelawan(r1, ID.project, formLengkap('Satu'));
    assert.equal(hasil.status, 'pending');

    assert.equal(
      await statusGalat(daftarRelawan(r1, ID.project, formLengkap('Satu'))),
      409,
    );
    const jumlah = await ambil(
      'SELECT COUNT(*) AS n FROM pendaftaran_relawan WHERE id_volunteer = ? AND id_project = ?',
      [r1, ID.project],
    );
    assert.equal(Number(jumlah.n), 1);
  });

  it('menolak pendaftaran tanpa login, formulir kosong, dan project draft', async (t) => {
    if (lewatiBilaTanpaDb(t)) return;
    const [, r2] = ID.relawan;

    assert.equal(
      await statusGalat(daftarRelawan(null, ID.project, formLengkap('X'))),
      401,
    );
    assert.equal(await statusGalat(daftarRelawan(r2, ID.project, {})), 400);
    assert.equal(
      await statusGalat(daftarRelawan(r2, ID.projectDraft, formLengkap('X'))),
      404,
    );
    assert.equal(
      await statusGalat(daftarRelawan(r2, 'tidak-ada', formLengkap('X'))),
      404,
    );
  });

  it('KF20: hanya pemilik yang melihat daftar pendaftar', async (t) => {
    if (lewatiBilaTanpaDb(t)) return;

    const daftar = await daftarPendaftar(ID.pemilik, ID.project);
    assert.ok(daftar.length >= 1);
    assert.equal(
      await statusGalat(daftarPendaftar(ID.orangLain, ID.project)),
      403,
    );
    assert.equal(await statusGalat(daftarPendaftar(null, ID.project)), 401);
  });

  it('KF21: hanya pemilik yang memutuskan, dan sekali saja', async (t) => {
    if (lewatiBilaTanpaDb(t)) return;
    const [r1] = ID.relawan;
    const [pendaftaran] = (
      await daftarPendaftar(ID.pemilik, ID.project)
    ).filter((p) => p.idVolunteer === r1);

    assert.equal(
      await statusGalat(
        putuskanPendaftaran(
          ID.orangLain,
          ID.project,
          pendaftaran.idPendaftaran,
          'accepted',
        ),
      ),
      403,
    );
    assert.equal(
      await statusGalat(
        putuskanPendaftaran(
          ID.pemilik,
          ID.project,
          pendaftaran.idPendaftaran,
          'mungkin',
        ),
      ),
      400,
    );

    const diputuskan = await putuskanPendaftaran(
      ID.pemilik,
      ID.project,
      pendaftaran.idPendaftaran,
      'accepted',
    );
    assert.equal(diputuskan.status, 'accepted');
    assert.ok(diputuskan.tanggalKeputusan);

    assert.equal(
      await statusGalat(
        putuskanPendaftaran(
          ID.pemilik,
          ID.project,
          pendaftaran.idPendaftaran,
          'rejected',
        ),
      ),
      409,
    );
  });

  it('KF22: titik kumpul hanya terlihat setelah diterima', async (t) => {
    if (lewatiBilaTanpaDb(t)) return;
    const [r1, r2] = ID.relawan;

    // r1 diterima pada pengujian sebelumnya; r2 baru mendaftar (pending).
    await daftarRelawan(r2, ID.project, formLengkap('Dua'));

    const milikR1 = (await pendaftaranSaya(r1)).find(
      (p) => p.idProject === ID.project,
    );
    const milikR2 = (await pendaftaranSaya(r2)).find(
      (p) => p.idProject === ID.project,
    );
    assert.equal(milikR1?.status, 'accepted');
    assert.equal(milikR1?.lokasiKumpul, TITIK_KUMPUL);
    assert.equal(milikR2?.status, 'pending');
    assert.equal(milikR2?.lokasiKumpul, null);
    assert.equal(await statusGalat(pendaftaranSaya(null)), 401);
  });

  it('KF21: penerimaan bersamaan tidak melewati kuota', async (t) => {
    if (lewatiBilaTanpaDb(t)) return;
    const [, r2, r3] = ID.relawan;
    await daftarRelawan(r3, ID.project, formLengkap('Tiga'));

    // r1 sudah diterima (1 dari KUOTA). r2 dan r3 diterima bersamaan,
    // padahal hanya tersisa satu tempat.
    const daftar = await daftarPendaftar(ID.pemilik, ID.project);
    const idDari = (id: string) =>
      daftar.find((p) => p.idVolunteer === id)!.idPendaftaran;

    const hasil = await Promise.all(
      [r2, r3].map((id) =>
        statusGalat(
          putuskanPendaftaran(ID.pemilik, ID.project, idDari(id), 'accepted'),
        ),
      ),
    );

    assert.equal(hasil.filter((h) => h === 'OK').length, KUOTA - 1);
    assert.equal(hasil.filter((h) => h === 409).length, 1);
    const diterima = await ambil(
      `SELECT COUNT(*) AS n FROM pendaftaran_relawan
        WHERE id_project = ? AND status_pendaftaran = 'accepted'`,
      [ID.project],
    );
    assert.equal(Number(diterima.n), KUOTA);
  });
});

describe('Progres project (integrasi MySQL)', () => {
  it('KF23: pemilik menyimpan pembaruan dan keadaan project ikut berubah', async (t) => {
    if (lewatiBilaTanpaDb(t)) return;

    const progres = await perbaruiProgres(
      ID.pemilik,
      ID.project,
      masukanProgres('Penanaman tahap 1'),
    );

    const baris = await ambil(
      'SELECT milestone, status_pelaksanaan, persentase, dana_terpakai FROM progres_project WHERE id_progres = ?',
      [progres.idProgres],
    );
    assert.equal(baris.milestone, 'Penanaman tahap 1');
    assert.equal(baris.status_pelaksanaan, 'berjalan');
    assert.equal(Number(baris.persentase), 35);
    assert.equal(Number(baris.dana_terpakai), 24_500_000);

    const project = await ambil(
      'SELECT milestone, status_pelaksanaan, timestamp_pembaruan FROM project WHERE id_project = ?',
      [ID.project],
    );
    assert.equal(project.milestone, 'Penanaman tahap 1');
    assert.equal(project.status_pelaksanaan, 'berjalan');
    assert.ok(project.timestamp_pembaruan);
  });

  it('KF25: orang lain ditolak, Admin Sistem diizinkan', async (t) => {
    if (lewatiBilaTanpaDb(t)) return;

    assert.equal(
      await statusGalat(
        perbaruiProgres(ID.orangLain, ID.project, masukanProgres('Curang')),
      ),
      403,
    );
    assert.equal(
      await statusGalat(
        perbaruiProgres(null, ID.project, masukanProgres('Anonim')),
      ),
      401,
    );
    assert.equal(
      await statusGalat(
        perbaruiProgres(ID.admin, ID.project, masukanProgres('Oleh admin')),
      ),
      'OK',
    );
  });

  it('menolak isian tidak valid dan project yang belum terpublikasi', async (t) => {
    if (lewatiBilaTanpaDb(t)) return;
    const sebelum = await ambil(
      'SELECT COUNT(*) AS n FROM progres_project WHERE id_project = ?',
      [ID.project],
    );

    const salah = masukanProgres('');
    salah.mentah.persentase = '101';
    assert.equal(
      await statusGalat(perbaruiProgres(ID.pemilik, ID.project, salah)),
      400,
    );
    assert.equal(
      await statusGalat(
        perbaruiProgres(ID.pemilik, ID.projectDraft, masukanProgres('Draft')),
      ),
      409,
    );
    assert.equal(
      await statusGalat(
        perbaruiProgres(ID.pemilik, 'tidak-ada', masukanProgres('Hilang')),
      ),
      404,
    );

    const sesudah = await ambil(
      'SELECT COUNT(*) AS n FROM progres_project WHERE id_project = ?',
      [ID.project],
    );
    assert.equal(Number(sesudah.n), Number(sebelum.n));
  });

  it('KF14: riwayat terbaru lebih dulu; project draft hanya untuk pemiliknya', async (t) => {
    if (lewatiBilaTanpaDb(t)) return;

    const riwayat = await riwayatProgres(null, ID.project);
    assert.ok(riwayat.length >= 2);
    for (let i = 1; i < riwayat.length; i++) {
      assert.ok(
        riwayat[i - 1].timestampPembaruan >= riwayat[i].timestampPembaruan,
      );
    }

    assert.equal(await statusGalat(riwayatProgres(null, ID.projectDraft)), 403);
    assert.equal(
      await statusGalat(riwayatProgres(ID.pemilik, ID.projectDraft)),
      'OK',
    );
  });
});
