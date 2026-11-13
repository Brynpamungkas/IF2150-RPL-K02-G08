/**
 * Pengujian integrasi riwayat transaksi dan progres (UC10, KF27) terhadap MySQL sungguhan.
 * Butuh database berjalan dan file .env (lihat README: npm run db:up).
 * Bila database tidak tersedia, seluruh pengujian di file ini dilewati (skip).
 * Data uji dibuat dengan ID acak dan dihapus kembali setelah selesai.
 */
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { after, before, describe, it, type TestContext } from 'node:test';

import { execute, getPool, query } from '@/server/db';
import {
  detailProgres,
  detailTransaksi,
  riwayatPengguna,
} from '@/server/services/riwayatService';
import { isGalatValidasi } from '@/shared/galat';

const akhiran = randomUUID().slice(0, 8);
const ID = {
  pembuat: `tst-rp-${akhiran}`, // pembuat project, juga berdonasi
  relawan: `tst-rr-${akhiran}`, // relawan accepted
  pendaftar: `tst-rd-${akhiran}`, // relawan masih pending
  kosong: `tst-rk-${akhiran}`, // tanpa riwayat apa pun
  project: `tst-rj-${akhiran}`,
  trLama: `tst-rt1-${akhiran}`,
  trBaru: `tst-rt2-${akhiran}`,
  progres: `tst-rg-${akhiran}`,
};
const PENGGUNA = [ID.pembuat, ID.relawan, ID.pendaftar, ID.kosong];

let dbSiap = false;

function lewatiBilaTanpaDb(t: TestContext): boolean {
  if (!dbSiap) t.skip('database tidak tersedia (atur .env lalu npm run db:up)');
  return !dbSiap;
}

async function statusGalat(p: Promise<unknown>): Promise<number | 'OK'> {
  try {
    await p;
    return 'OK';
  } catch (e) {
    if (isGalatValidasi(e)) return e.status;
    throw e;
  }
}

async function bersihkan() {
  const daftar = PENGGUNA.map(() => '?').join(', ');
  await execute(
    `DELETE FROM transaksi_donasi WHERE id_donatur IN (${daftar})`,
    PENGGUNA,
  );
  // progres_project dan pendaftaran_relawan ikut terhapus (ON DELETE CASCADE).
  await execute('DELETE FROM project WHERE id_project = ?', [ID.project]);
  await execute(
    `DELETE FROM donatur WHERE id_donatur IN (${daftar})`,
    PENGGUNA,
  );
  await execute(
    `DELETE FROM pengguna WHERE id_pengguna IN (${daftar})`,
    PENGGUNA,
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

  for (const id of PENGGUNA) {
    await execute(
      "INSERT INTO pengguna (id_pengguna, nama, peran) VALUES (?, ?, 'volunteer')",
      [id, `Uji ${id}`],
    );
  }
  await execute('INSERT INTO donatur (id_donatur, saldo) VALUES (?, 0)', [
    ID.pembuat,
  ]);

  await execute(
    `INSERT INTO project (id_project, id_pembuat, nama, deskripsi, provinsi, kota,
       kebutuhan_dana, status, dana_terkumpul)
     VALUES (?, ?, 'Project Riwayat Uji', 'uji', 'Jawa Barat', 'Bandung', 1000000,
       'terpublikasi', 0)`,
    [ID.project, ID.pembuat],
  );

  const sqlDaftar = `INSERT INTO pendaftaran_relawan
      (id_pendaftaran, id_volunteer, id_project, data_diri, status_pendaftaran)
    VALUES (?, ?, ?, 'uji', ?)`;
  await execute(sqlDaftar, [
    `tst-rpa-${akhiran}`,
    ID.relawan,
    ID.project,
    'accepted',
  ]);
  await execute(sqlDaftar, [
    `tst-rpp-${akhiran}`,
    ID.pendaftar,
    ID.project,
    'pending',
  ]);

  const sqlTransaksi = `INSERT INTO transaksi_donasi (id_transaksi, id_donatur, id_tujuan,
      jenis_tujuan, idempotency_key, nominal, tanggal, status_transaksi)
    VALUES (?, ?, ?, 'project', ?, ?, ?, 'berhasil')`;
  await execute(sqlTransaksi, [
    ID.trLama,
    ID.pembuat,
    ID.project,
    `tst-${randomUUID()}`,
    10_000,
    '2026-01-01 08:00:00',
  ]);
  await execute(sqlTransaksi, [
    ID.trBaru,
    ID.pembuat,
    ID.project,
    `tst-${randomUUID()}`,
    25_000,
    '2026-03-01 08:00:00',
  ]);

  await execute(
    `INSERT INTO progres_project (id_progres, id_project, id_pengguna, milestone,
       status_pelaksanaan, catatan, timestamp_pembaruan)
     VALUES (?, ?, ?, 'Penanaman tahap 1', 'berjalan', 'catatan uji', '2026-02-01 08:00:00')`,
    [ID.progres, ID.project, ID.pembuat],
  );
});

after(async () => {
  if (!dbSiap) return;
  await bersihkan();
  await getPool().end();
});

describe('riwayatPengguna (Algo-129, KF27)', () => {
  it('menolak pengguna yang belum login', async (t) => {
    if (lewatiBilaTanpaDb(t)) return;
    assert.equal(await statusGalat(riwayatPengguna(null, 'semua')), 401);
  });

  it('pembuat project melihat donasi dan progres miliknya, terbaru lebih dulu', async (t) => {
    if (lewatiBilaTanpaDb(t)) return;
    const riwayat = await riwayatPengguna(ID.pembuat, 'semua');
    assert.deepEqual(
      riwayat.map((i) => i.id),
      [ID.trBaru, ID.progres, ID.trLama],
    );
    const pertama = riwayat[0];
    assert.equal(pertama.jenis, 'transaksi');
    if (pertama.jenis === 'transaksi') {
      assert.equal(pertama.namaTujuan, 'Project Riwayat Uji');
      assert.equal(pertama.nominal, 25_000);
    }
  });

  it('filter jenis hanya mengembalikan jenis yang diminta', async (t) => {
    if (lewatiBilaTanpaDb(t)) return;
    const hanyaTransaksi = await riwayatPengguna(ID.pembuat, 'transaksi');
    assert.deepEqual(
      hanyaTransaksi.map((i) => i.id),
      [ID.trBaru, ID.trLama],
    );
    const hanyaProgres = await riwayatPengguna(ID.pembuat, 'progres');
    assert.deepEqual(
      hanyaProgres.map((i) => i.id),
      [ID.progres],
    );
  });

  it('relawan accepted melihat progres, tetapi tidak melihat donasi orang lain', async (t) => {
    if (lewatiBilaTanpaDb(t)) return;
    const riwayat = await riwayatPengguna(ID.relawan, 'semua');
    assert.deepEqual(
      riwayat.map((item) => [item.jenis, item.id]).sort(),
      [
        ['progres', ID.progres],
        ['relawan', `tst-rpa-${akhiran}`],
      ].sort(),
    );
  });

  it('relawan yang masih pending tidak melihat progres', async (t) => {
    if (lewatiBilaTanpaDb(t)) return;
    assert.deepEqual(await riwayatPengguna(ID.pendaftar, 'progres'), []);
    const riwayat = await riwayatPengguna(ID.pendaftar, 'semua');
    assert.deepEqual(
      riwayat.map((item) => [item.jenis, item.id]),
      [['relawan', `tst-rpp-${akhiran}`]],
    );
  });

  it('pengguna tanpa riwayat mendapat daftar kosong, bukan galat', async (t) => {
    if (lewatiBilaTanpaDb(t)) return;
    assert.deepEqual(await riwayatPengguna(ID.kosong, 'semua'), []);
  });
});

describe('detail riwayat (Algo-130, KF27)', () => {
  it('pemilik dapat membuka rincian transaksinya', async (t) => {
    if (lewatiBilaTanpaDb(t)) return;
    const detail = await detailTransaksi(ID.pembuat, ID.trBaru);
    assert.equal(detail.idTransaksi, ID.trBaru);
    assert.equal(detail.nominal, 25_000);
    assert.equal(detail.namaTujuan, 'Project Riwayat Uji');
  });

  it('transaksi milik orang lain diperlakukan sebagai tidak ditemukan', async (t) => {
    if (lewatiBilaTanpaDb(t)) return;
    assert.equal(
      await statusGalat(detailTransaksi(ID.relawan, ID.trBaru)),
      404,
    );
    assert.equal(
      await statusGalat(detailTransaksi(ID.pembuat, 'tidak-ada')),
      404,
    );
  });

  it('pembuat dan relawan accepted dapat membuka rincian progres', async (t) => {
    if (lewatiBilaTanpaDb(t)) return;
    for (const id of [ID.pembuat, ID.relawan]) {
      const detail = await detailProgres(id, ID.progres);
      assert.equal(detail.idProgres, ID.progres);
      assert.equal(detail.namaProject, 'Project Riwayat Uji');
      assert.equal(detail.catatan, 'catatan uji');
    }
  });

  it('progres tidak dapat dibuka oleh pendaftar pending atau pengguna lain', async (t) => {
    if (lewatiBilaTanpaDb(t)) return;
    for (const id of [ID.pendaftar, ID.kosong]) {
      assert.equal(await statusGalat(detailProgres(id, ID.progres)), 404);
    }
  });

  it('rincian menolak pengguna yang belum login', async (t) => {
    if (lewatiBilaTanpaDb(t)) return;
    assert.equal(await statusGalat(detailTransaksi(null, ID.trBaru)), 401);
    assert.equal(await statusGalat(detailProgres(null, ID.progres)), 401);
  });
});
