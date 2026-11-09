/**
 * Pengujian integrasi top-up saldo simulasi (Tabel B.1 baris 1) terhadap MySQL sungguhan.
 * Butuh database berjalan dan file .env (lihat README: npm run db:up).
 * Bila database tidak tersedia, seluruh pengujian di file ini dilewati (skip).
 */
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { after, before, describe, it, type TestContext } from 'node:test';
import type { RowDataPacket } from 'mysql2/promise';
import { execute, getPool, query } from '@/server/db';
import { TopupService } from '@/server/services/TopupService';
import { GalatAplikasi, type KodeGalat } from '@/shared/galatDonasi';
import { LABEL_METODE } from '@/shared/topup';

const akhiran = randomUUID().slice(0, 8);
const ID = {
  donatur: `tst-td-${akhiran}`,
  bukanDonatur: `tst-tn-${akhiran}`,
};

let dbSiap = false;

function lewatiBilaTanpaDb(t: TestContext): boolean {
  if (!dbSiap) t.skip('database tidak tersedia (atur .env lalu npm run db:up)');
  return !dbSiap;
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
const jumlahTopup = (id: string) =>
  angka('SELECT COUNT(*) FROM topup_saldo WHERE id_donatur = ?', [id]);
const aturSaldo = (id: string, nilai: number) =>
  execute('UPDATE donatur SET saldo = ? WHERE id_donatur = ?', [nilai, id]);

before(async () => {
  if (!process.env.DB_NAME) return;
  try {
    await query('SELECT 1');
  } catch {
    return;
  }
  dbSiap = true;

  for (const id of [ID.donatur, ID.bukanDonatur]) {
    await execute(
      "INSERT INTO pengguna (id_pengguna, nama, peran) VALUES (?, 'Uji Topup', 'volunteer')",
      [id],
    );
  }
  await execute('INSERT INTO donatur (id_donatur, saldo) VALUES (?, 0)', [
    ID.donatur,
  ]);
});

after(async () => {
  if (!process.env.DB_NAME) return;
  if (dbSiap) {
    await execute('DELETE FROM topup_saldo WHERE id_donatur = ?', [ID.donatur]);
    await execute('DELETE FROM pengguna WHERE id_pengguna IN (?, ?)', [
      ID.donatur,
      ID.bukanDonatur,
    ]);
  }
  await getPool().end();
});

describe('Top-up saldo (integrasi MySQL)', () => {
  it('AC1: menambah saldo dan mencatat top-up dalam satu transaksi', async (t) => {
    if (lewatiBilaTanpaDb(t)) return;
    await aturSaldo(ID.donatur, 750_000);
    const awal = await jumlahTopup(ID.donatur);

    const h = await TopupService.prosesTopup(ID.donatur, {
      nominal: 100_000,
      metode: 'va',
    });

    assert.equal(h.saldoSesudah, 850_000);
    assert.equal(h.nominal, 100_000);
    assert.equal(h.metode, LABEL_METODE.va);
    assert.equal(await saldo(ID.donatur), 850_000);
    assert.equal(await jumlahTopup(ID.donatur), awal + 1);

    const [b] = await query<RowDataPacket>(
      'SELECT nominal, metode FROM topup_saldo WHERE id_topup = ?',
      [h.idTopup],
    );
    assert.equal(Number(b?.nominal), 100_000);
    assert.equal(b?.metode, LABEL_METODE.va);

    assert.deepEqual(await TopupService.bukaFormTopup(ID.donatur), {
      saldo: 850_000,
    });
  });

  it('AC2: nominal tidak valid ditolak tanpa mengubah saldo', async (t) => {
    if (lewatiBilaTanpaDb(t)) return;
    await aturSaldo(ID.donatur, 50_000);
    const awal = await jumlahTopup(ID.donatur);

    for (const n of [0, -10_000, 9_999, 10_000_001, 50_000.5, Number.NaN]) {
      assert.equal(
        await kodeGalat(
          TopupService.prosesTopup(ID.donatur, { nominal: n, metode: 'qr' }),
        ),
        'NOMINAL_TOPUP_TIDAK_VALID',
        String(n),
      );
    }
    assert.equal(await saldo(ID.donatur), 50_000);
    assert.equal(await jumlahTopup(ID.donatur), awal);
  });

  it('pengguna tanpa baris donatur ditolak dan tidak ada catatan tertinggal', async (t) => {
    if (lewatiBilaTanpaDb(t)) return;
    assert.equal(
      await kodeGalat(
        TopupService.prosesTopup(ID.bukanDonatur, {
          nominal: 50_000,
          metode: 'va',
        }),
      ),
      'BUKAN_DONATUR',
    );
    assert.equal(await jumlahTopup(ID.bukanDonatur), 0);
  });

  it('top-up bersamaan terjumlah semua tanpa kehilangan pembaruan', async (t) => {
    if (lewatiBilaTanpaDb(t)) return;
    await aturSaldo(ID.donatur, 0);
    const awal = await jumlahTopup(ID.donatur);

    const hasil = await Promise.all(
      Array.from({ length: 8 }, () =>
        kodeGalat(
          TopupService.prosesTopup(ID.donatur, {
            nominal: 50_000,
            metode: 'va',
          }),
        ),
      ),
    );

    assert.deepEqual(hasil, Array(8).fill('OK'));
    assert.equal(await saldo(ID.donatur), 400_000);
    assert.equal(await jumlahTopup(ID.donatur), awal + 8);
  });
});
