/**
 * Pengukuran performa pembacaan bukti transaksi (issue #42, laporan B.2).
 *
 * Jalankan dari folder src/ dengan database menyala (npm run db:up):
 *   npm run perf:bukti
 *
 * Yang diukur untuk DonasiService.getBuktiTransaksi pada tiga skenario:
 *   - jumlah query yang dikirim ke MySQL untuk satu kali pemanggilan, dan
 *   - waktu respons (median dan rata-rata dari banyak pemanggilan).
 * Skrip juga mencetak hasil EXPLAIN untuk query lama dan query gabungan.
 *
 * Data uji dibuat dengan ID acak dan dihapus kembali setelah selesai.
 */
import { randomUUID } from 'node:crypto';
import { performance } from 'node:perf_hooks';
import type { RowDataPacket } from 'mysql2/promise';
import { execute, getPool, query } from '@/server/db';
import { DonasiService } from '@/server/services/DonasiService';

const PEMANASAN = 50;
const ULANGAN = 500;

const akhiran = randomUUID().slice(0, 8);
const ID = { donatur: `prf-d-${akhiran}`, project: `prf-p-${akhiran}` };

/** Menghitung query yang lewat pool selama `kerja` berjalan. */
async function hitungQuery(kerja: () => Promise<unknown>): Promise<number> {
  const pool = getPool() as unknown as Record<
    'query' | 'execute',
    (...a: unknown[]) => unknown
  >;
  const asli = { query: pool.query, execute: pool.execute };
  let jumlah = 0;
  pool.query = (...a) => (jumlah++, asli.query.apply(pool, a));
  pool.execute = (...a) => (jumlah++, asli.execute.apply(pool, a));
  try {
    await kerja();
  } finally {
    pool.query = asli.query;
    pool.execute = asli.execute;
  }
  return jumlah;
}

type Hasil = { skenario: string; query: number; median: number; rata: number };

/**
 * Mengukur satu skenario. `siapkan` dijalankan sebelum setiap pemanggilan dan
 * tidak ikut dihitung, baik waktunya maupun query-nya.
 */
async function ukur(
  skenario: string,
  idTransaksi: string,
  siapkan: () => Promise<unknown> = async () => {},
): Promise<Hasil> {
  const panggil = () =>
    DonasiService.getBuktiTransaksi(ID.donatur, idTransaksi);

  for (let i = 0; i < PEMANASAN; i++) {
    await siapkan();
    await panggil();
  }

  await siapkan();
  const jumlahQuery = await hitungQuery(panggil);

  const waktu: number[] = [];
  for (let i = 0; i < ULANGAN; i++) {
    await siapkan();
    const mulai = performance.now();
    await panggil();
    waktu.push(performance.now() - mulai);
  }
  waktu.sort((a, b) => a - b);
  return {
    skenario,
    query: jumlahQuery,
    median: waktu[Math.floor(waktu.length / 2)] ?? 0,
    rata: waktu.reduce((a, b) => a + b, 0) / waktu.length,
  };
}

async function explain(judul: string, sql: string, params: unknown[]) {
  const baris = await query<RowDataPacket>(`EXPLAIN ${sql}`, params);
  console.log(`\n${judul}`);
  console.log('| table | type | key | rows | Extra |');
  console.log('| --- | --- | --- | --- | --- |');
  for (const b of baris) {
    console.log(
      `| ${b.table} | ${b.type} | ${b.key ?? '-'} | ${b.rows ?? '-'} | ${b.Extra ?? '-'} |`,
    );
  }
}

async function siapkanData(): Promise<string> {
  await execute(
    "INSERT INTO pengguna (id_pengguna, nama, peran) VALUES (?, 'Donatur Ukur', 'volunteer')",
    [ID.donatur],
  );
  await execute('INSERT INTO donatur (id_donatur, saldo) VALUES (?, 100000)', [
    ID.donatur,
  ]);
  await execute(
    `INSERT INTO project (id_project, id_pembuat, nama, deskripsi,
       provinsi, kota, kebutuhan_dana, status, dana_terkumpul)
     VALUES (?, ?, 'Project Ukur', 'ukur', 'Jawa Barat', 'Bandung', 1000000, 'terpublikasi', 0)`,
    [ID.project, ID.donatur],
  );
  const hasil = await DonasiService.prosesDonasi(ID.donatur, {
    jenisTujuan: 'project',
    idTujuan: ID.project,
    nominal: 10_000,
    idempotencyKey: `prf-${randomUUID()}`,
  });
  return hasil.idTransaksi;
}

async function bersihkan() {
  await execute(
    `DELETE b FROM bukti_transaksi b
       JOIN transaksi_donasi t ON t.id_transaksi = b.id_transaksi
      WHERE t.id_donatur = ?`,
    [ID.donatur],
  );
  await execute('DELETE FROM transaksi_donasi WHERE id_donatur = ?', [
    ID.donatur,
  ]);
  await execute('DELETE FROM project WHERE id_project = ?', [ID.project]);
  await execute('DELETE FROM pengguna WHERE id_pengguna = ?', [ID.donatur]);
}

async function main() {
  const idTransaksi = await siapkanData();
  try {
    const hasil: Hasil[] = [];

    hasil.push(await ukur('Bukti sudah ada (kasus normal)', idTransaksi));

    // Data seed menyimpan rincian sebagai teks bebas, bukan JSON.
    await execute(
      'UPDATE bukti_transaksi SET rincian = ? WHERE id_transaksi = ?',
      ['Donasi Rp10.000 untuk Project Ukur', idTransaksi],
    );
    hasil.push(await ukur('Rincian format lama (data seed)', idTransaksi));

    hasil.push(
      await ukur('Bukti belum ada (dibuat ulang)', idTransaksi, () =>
        execute('DELETE FROM bukti_transaksi WHERE id_transaksi = ?', [
          idTransaksi,
        ]),
      ),
    );

    console.log(
      `\nDonasiService.getBuktiTransaksi, ${ULANGAN} pemanggilan per skenario`,
    );
    console.log('| Skenario | Jumlah query | Median (ms) | Rata-rata (ms) |');
    console.log('| --- | --- | --- | --- |');
    for (const h of hasil) {
      console.log(
        `| ${h.skenario} | ${h.query} | ${h.median.toFixed(3)} | ${h.rata.toFixed(3)} |`,
      );
    }

    const p = [idTransaksi, ID.donatur];
    await explain(
      'EXPLAIN query lama 1 (Q-119, cek pemilik)',
      'SELECT COUNT(*) AS jumlah FROM transaksi_donasi WHERE id_transaksi = ? AND id_donatur = ?',
      p,
    );
    await explain(
      'EXPLAIN query lama 2 (Q-114, ambil bukti)',
      'SELECT id_bukti, rincian FROM bukti_transaksi WHERE id_transaksi = ?',
      [idTransaksi],
    );
    await explain(
      'EXPLAIN query gabungan (cek pemilik sekaligus ambil bukti)',
      `SELECT b.id_bukti, b.rincian
         FROM transaksi_donasi t
         LEFT JOIN bukti_transaksi b ON b.id_transaksi = t.id_transaksi
        WHERE t.id_transaksi = ? AND t.id_donatur = ?`,
      p,
    );
  } finally {
    await bersihkan();
    await getPool().end();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
