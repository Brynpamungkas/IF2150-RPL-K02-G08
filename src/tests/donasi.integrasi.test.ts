/**
 * Pengujian integrasi donasi atomik (UC06, KF15-KF18, KF26) terhadap MySQL sungguhan.
 * Butuh database berjalan dan file .env (lihat README: npm run db:up).
 * Bila database tidak tersedia, seluruh pengujian di file ini dilewati (skip).
 * Data uji dibuat dengan ID acak dan dihapus kembali setelah selesai.
 */
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { after, before, describe, it, type TestContext } from 'node:test';
import type { RowDataPacket } from 'mysql2/promise';
import { execute, getPool, query } from '@/server/db';
import { DonasiService } from '@/server/services/DonasiService';
import type { JenisTujuan, PermintaanDonasi } from '@/shared/dto';
import { GalatAplikasi, type KodeGalat } from '@/shared/galat';

const akhiran = randomUUID().slice(0, 8);
const ID = {
  donatur: `tst-d-${akhiran}`,
  donaturLain: `tst-l-${akhiran}`,
  projectBuka: `tst-pb-${akhiran}`,
  projectTutup: `tst-pt-${akhiran}`,
  campaignBuka: `tst-cb-${akhiran}`,
  campaignLewat: `tst-cl-${akhiran}`,
};

let dbSiap = false;

function lewatiBilaTanpaDb(t: TestContext): boolean {
  if (!dbSiap) t.skip('database tidak tersedia (atur .env lalu npm run db:up)');
  return !dbSiap;
}

const kunci = () => `tst-${randomUUID()}`;

function minta(
  jenisTujuan: JenisTujuan,
  idTujuan: string,
  nominal: number,
  idempotencyKey = kunci(),
): PermintaanDonasi {
  return { jenisTujuan, idTujuan, nominal, idempotencyKey };
}

async function kodeGalat(p: Promise<unknown>): Promise<KodeGalat | 'OK'> {
  try {
    await p;
    return 'OK';
  } catch (e) {
    if (e instanceof GalatAplikasi) return e.kode;
    throw e;
  }
}

async function angka(sql: string, params: unknown[]): Promise<number> {
  const [b] = await query<RowDataPacket>(sql, params);
  return Number(Object.values(b ?? {})[0] ?? 0);
}

const saldo = (id: string) =>
  angka('SELECT saldo FROM donatur WHERE id_donatur = ?', [id]);
const danaProject = (id: string) =>
  angka('SELECT dana_terkumpul FROM project WHERE id_project = ?', [id]);
const jumlahTransaksi = (idDonatur: string) =>
  angka('SELECT COUNT(*) FROM transaksi_donasi WHERE id_donatur = ?', [
    idDonatur,
  ]);
const aturSaldo = (id: string, nilai: number) =>
  execute('UPDATE donatur SET saldo = ? WHERE id_donatur = ?', [nilai, id]);

async function bersihkan() {
  const donatur = [ID.donatur, ID.donaturLain];
  await execute(
    `DELETE b FROM bukti_transaksi b
       JOIN transaksi_donasi t ON t.id_transaksi = b.id_transaksi
      WHERE t.id_donatur IN (?, ?)`,
    donatur,
  );
  await execute(
    'DELETE FROM transaksi_donasi WHERE id_donatur IN (?, ?)',
    donatur,
  );
  await execute('DELETE FROM project WHERE id_project IN (?, ?)', [
    ID.projectBuka,
    ID.projectTutup,
  ]);
  await execute('DELETE FROM campaign WHERE id_campaign IN (?, ?)', [
    ID.campaignBuka,
    ID.campaignLewat,
  ]);
  await execute('DELETE FROM pengguna WHERE id_pengguna IN (?, ?)', donatur);
}

before(async () => {
  if (!process.env.DB_NAME) return;
  try {
    await query('SELECT 1');
  } catch {
    return;
  }
  dbSiap = true;

  for (const [id, nama] of [
    [ID.donatur, 'Donatur Uji'],
    [ID.donaturLain, 'Donatur Lain'],
  ]) {
    await execute(
      "INSERT INTO pengguna (id_pengguna, nama, peran) VALUES (?, ?, 'volunteer')",
      [id, nama],
    );
    await execute('INSERT INTO donatur (id_donatur, saldo) VALUES (?, 0)', [
      id,
    ]);
  }

  const sqlProject = `INSERT INTO project (id_project, id_pembuat, nama, deskripsi,
      provinsi, kota, kebutuhan_dana, status, dana_terkumpul)
    VALUES (?, ?, ?, 'uji', 'Jawa Barat', 'Bandung', 1000000, ?, 0)`;
  await execute(sqlProject, [
    ID.projectBuka,
    ID.donatur,
    'Project Uji',
    'terpublikasi',
  ]);
  await execute(sqlProject, [
    ID.projectTutup,
    ID.donatur,
    'Project Draft',
    'draft',
  ]);

  const sqlCampaign = `INSERT INTO campaign (id_campaign, id_pembuat, judul, deskripsi,
      target_nominal, periode_mulai, periode_selesai, provinsi, kota, status, dana_terkumpul)
    VALUES (?, ?, ?, 'uji', 400000, ?, ?, 'Jawa Barat', 'Bandung', 'terpublikasi', 0)`;
  await execute(sqlCampaign, [
    ID.campaignBuka,
    ID.donatur,
    'Campaign Uji',
    '2020-01-01',
    '2099-12-31',
  ]);
  await execute(sqlCampaign, [
    ID.campaignLewat,
    ID.donatur,
    'Campaign Lewat',
    '2020-01-01',
    '2020-12-31',
  ]);
});

after(async () => {
  if (!process.env.DB_NAME) return;
  if (dbSiap) await bersihkan();
  await getPool().end();
});

describe('Donasi atomik (integrasi MySQL)', () => {
  it('KF15: donasi bersamaan tidak membuat saldo negatif dan dana tidak hilang', async (t) => {
    if (lewatiBilaTanpaDb(t)) return;
    await aturSaldo(ID.donatur, 100_000);
    const danaAwal = await danaProject(ID.projectBuka);
    const trxAwal = await jumlahTransaksi(ID.donatur);

    // 10 donasi @25.000 dikirim bersamaan; saldo hanya cukup untuk 4.
    const hasil = await Promise.all(
      Array.from({ length: 10 }, () =>
        kodeGalat(
          DonasiService.prosesDonasi(
            ID.donatur,
            minta('project', ID.projectBuka, 25_000),
          ),
        ),
      ),
    );

    assert.equal(hasil.filter((k) => k === 'OK').length, 4);
    assert.equal(hasil.filter((k) => k === 'SALDO_KURANG').length, 6);
    assert.equal(await saldo(ID.donatur), 0);
    assert.equal(await danaProject(ID.projectBuka), danaAwal + 100_000);
    assert.equal(await jumlahTransaksi(ID.donatur), trxAwal + 4);
  });

  it('KF15: donasi bersamaan dari donatur berbeda ke tujuan yang sama terjumlah semua', async (t) => {
    if (lewatiBilaTanpaDb(t)) return;
    await aturSaldo(ID.donatur, 50_000);
    await aturSaldo(ID.donaturLain, 50_000);
    const danaAwal = await danaProject(ID.projectBuka);

    const hasil = await Promise.all(
      [ID.donatur, ID.donaturLain, ID.donatur, ID.donaturLain].map((d) =>
        kodeGalat(
          DonasiService.prosesDonasi(
            d,
            minta('project', ID.projectBuka, 25_000),
          ),
        ),
      ),
    );

    assert.deepEqual(hasil, ['OK', 'OK', 'OK', 'OK']);
    assert.equal(await danaProject(ID.projectBuka), danaAwal + 100_000);
    assert.equal(await saldo(ID.donatur), 0);
    assert.equal(await saldo(ID.donaturLain), 0);
  });

  it('KF18: idempotency key sama yang dikirim bersamaan hanya diproses sekali', async (t) => {
    if (lewatiBilaTanpaDb(t)) return;
    await aturSaldo(ID.donatur, 100_000);
    const trxAwal = await jumlahTransaksi(ID.donatur);
    const k = kunci();

    const hasil = await Promise.all(
      Array.from({ length: 5 }, () =>
        kodeGalat(
          DonasiService.prosesDonasi(
            ID.donatur,
            minta('project', ID.projectBuka, 10_000, k),
          ),
        ),
      ),
    );

    assert.equal(hasil.filter((x) => x === 'OK').length, 1);
    assert.equal(hasil.filter((x) => x === 'DUPLIKAT').length, 4);
    assert.equal(await saldo(ID.donatur), 90_000);
    assert.equal(await jumlahTransaksi(ID.donatur), trxAwal + 1);

    // Pengiriman ulang setelahnya juga ditolak.
    assert.equal(
      await kodeGalat(
        DonasiService.prosesDonasi(
          ID.donatur,
          minta('project', ID.projectBuka, 10_000, k),
        ),
      ),
      'DUPLIKAT',
    );
    assert.equal(await saldo(ID.donatur), 90_000);
  });

  it('KF16: gagal di tengah (tujuan ditutup setelah saldo dipotong) me-rollback semuanya', async (t) => {
    if (lewatiBilaTanpaDb(t)) return;
    await aturSaldo(ID.donatur, 100_000);
    const trxAwal = await jumlahTransaksi(ID.donatur);
    const k = kunci();

    for (const [jenis, id] of [
      ['project', ID.projectTutup],
      ['campaign', ID.campaignLewat],
      ['project', 'tidak-ada'],
    ] as const) {
      assert.equal(
        await kodeGalat(
          DonasiService.prosesDonasi(ID.donatur, minta(jenis, id, 25_000, k)),
        ),
        'TUJUAN_DITUTUP',
      );
    }
    assert.equal(await saldo(ID.donatur), 100_000, 'saldo kembali utuh');
    assert.equal(
      await jumlahTransaksi(ID.donatur),
      trxAwal,
      'tidak ada transaksi tertinggal',
    );

    // Key dari percobaan yang di-rollback boleh dipakai lagi (UC06 Alt 1).
    assert.equal(
      await kodeGalat(
        DonasiService.prosesDonasi(
          ID.donatur,
          minta('project', ID.projectBuka, 25_000, k),
        ),
      ),
      'OK',
    );
  });

  it('menolak nominal <= 0, melebihi maksimum, atau melebihi saldo', async (t) => {
    if (lewatiBilaTanpaDb(t)) return;
    await aturSaldo(ID.donatur, 50_000);
    for (const n of [0, -10_000, 1_000_000_001, 0.001]) {
      assert.equal(
        await kodeGalat(
          DonasiService.prosesDonasi(
            ID.donatur,
            minta('project', ID.projectBuka, n),
          ),
        ),
        'NOMINAL_TIDAK_VALID',
        String(n),
      );
    }
    assert.equal(
      await kodeGalat(
        DonasiService.prosesDonasi(
          ID.donatur,
          minta('project', ID.projectBuka, 50_000.01),
        ),
      ),
      'SALDO_KURANG',
    );
    assert.equal(await saldo(ID.donatur), 50_000);
  });

  it('KF17 + KF26: transaksi punya ID unik, tercatat di riwayat, bukti tersedia, capaian diperbarui', async (t) => {
    if (lewatiBilaTanpaDb(t)) return;
    await aturSaldo(ID.donatur, 300_000);

    const h1 = await DonasiService.prosesDonasi(ID.donatur, {
      ...minta('campaign', ID.campaignBuka, 100_000),
      pesan: 'Semangat',
    });
    const h2 = await DonasiService.prosesDonasi(
      ID.donatur,
      minta('campaign', ID.campaignBuka, 100_000),
    );

    assert.notEqual(h1.idTransaksi, h2.idTransaksi);
    assert.equal(h1.persentasePencapaian, 25); // 100.000 / 400.000
    assert.equal(h2.persentasePencapaian, 50);
    assert.equal(h2.danaTerkumpul, 200_000);
    assert.equal(h2.saldoSesudah, 100_000);

    const riwayat = await DonasiService.getRiwayatTransaksi(ID.donatur);
    const ids = riwayat.map((r) => r.idTransaksi);
    assert.ok(ids.includes(h1.idTransaksi) && ids.includes(h2.idTransaksi));

    const bukti = await DonasiService.getBuktiTransaksi(
      ID.donatur,
      h1.idTransaksi,
    );
    assert.equal(bukti.rincian.nominal, 100_000);
    assert.equal(bukti.rincian.namaTujuan, 'Campaign Uji');
    assert.equal(bukti.rincian.pesan, 'Semangat');
    assert.equal(bukti.rincian.statusTransaksi, 'berhasil');

    // Bukti milik orang lain tidak dapat dibuka.
    assert.equal(
      await kodeGalat(
        DonasiService.getBuktiTransaksi(ID.donaturLain, h1.idTransaksi),
      ),
      'TIDAK_DITEMUKAN',
    );
  });
});
