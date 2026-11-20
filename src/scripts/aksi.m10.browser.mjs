/** Bukti UC02–UC04/KNF03. Jalankan sesudah build, hanya dengan DB khusus test. */
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import path from 'node:path';
import mysql from 'mysql2/promise';

const load = createRequire(import.meta.url);
const { chromium } = load(process.env.PLAYWRIGHT_MODULE || 'playwright');
assert.equal(process.env.AKSI_TEST_DB, '1');
assert.match(process.env.DB_NAME || '', /test/i);
const port = process.env.M10_TEST_PORT || '3210';
const base = `http://127.0.0.1:${port}`;
const stamp = randomUUID().slice(0, 8);
const owner = `m10-owner-${stamp}`,
  admin = `m10-admin-${stamp}`,
  other = `m10-other-${stamp}`,
  volunteer = `m10-vol-${stamp}`;
const users = [owner, admin, other, volunteer];
const tokens = Object.fromEntries(users.map((id) => [id, randomUUID()]));
const today = new Date(Date.now() + 7 * 3600000).toISOString().slice(0, 10);
const end = new Date(Date.now() + 30 * 86400000 + 7 * 3600000)
  .toISOString()
  .slice(0, 10);
const results = [],
  errors = [];
let db,
  browser,
  server,
  serverLog = '',
  primary;

async function capture(page, name) {
  if (!process.env.M10_EVIDENCE_DIR) return;
  fs.mkdirSync(process.env.M10_EVIDENCE_DIR, { recursive: true });
  await page.screenshot({
    path: path.join(process.env.M10_EVIDENCE_DIR, `${name}.png`),
    fullPage: true,
  });
}
async function api(page, route, method = 'GET', data, status = 200) {
  const response = await page.request.fetch(base + route, { method, data });
  assert.equal(response.status(), status, await response.text());
  return response.json();
}
async function pageFor(id) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 900 },
  });
  if (id)
    await context.addCookies([
      {
        name: 'klimpool_sesi',
        value: tokens[id],
        url: base,
        httpOnly: true,
        sameSite: 'Lax',
      },
    ]);
  const page = await context.newPage();
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', async (response) => {
    if (response.url().includes('/api/') && response.status() >= 400)
      console.log(
        'API',
        response.status(),
        response.url(),
        await response.text(),
      );
  });
  return page;
}
function record(id, actual) {
  results.push({ id, actual, status: 'Pass' });
}
async function seed() {
  db = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  });
  for (const id of users) {
    await db.execute(
      'INSERT INTO pengguna (id_pengguna,nama,peran) VALUES (?,?,?)',
      [
        id,
        id,
        id === admin
          ? 'admin'
          : id === volunteer
            ? 'volunteer'
            : 'pembuat_project',
      ],
    );
    await db.execute(
      "INSERT INTO akun (id_akun,id_pengguna,email,password_hash) VALUES (?,?,?,'fixture-only')",
      [id, id, `${id}@example.invalid`],
    );
    await db.execute('INSERT INTO donatur (id_donatur,saldo) VALUES (?,0)', [
      id,
    ]);
    await db.execute(
      'INSERT INTO sesi_login (id_sesi,id_pengguna,waktu_mulai,waktu_kedaluwarsa) VALUES (?,?,UTC_TIMESTAMP(),DATE_ADD(UTC_TIMESTAMP(),INTERVAL 1 HOUR))',
      [tokens[id], id],
    );
  }
}
async function start() {
  server = spawn(
    process.execPath,
    [
      'node_modules/next/dist/bin/next',
      'start',
      '--hostname',
      '127.0.0.1',
      '--port',
      port,
    ],
    { cwd: process.cwd(), env: process.env, stdio: ['ignore', 'pipe', 'pipe'] },
  );
  await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(serverLog)), 60000);
    const receive = (data) => {
      serverLog += data;
      if (serverLog.includes('Ready')) {
        clearTimeout(timeout);
        resolve();
      }
    };
    server.stdout.on('data', receive);
    server.stderr.on('data', receive);
    server.once('exit', (code) => {
      clearTimeout(timeout);
      reject(new Error(`Server exit ${code}: ${serverLog}`));
    });
  });
  browser = await chromium.launch({
    headless: true,
    ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH }
      : {}),
  });
}
async function fillInfo(page, title, project = false) {
  const form = page.locator('form:visible');
  for (const [name, value] of [
    ['judul', title],
    ['deskripsi', 'Pemulihan pesisir dan pemantauan bibit.'],
    ['provinsi', 'Jawa Tengah'],
    ['kota', 'Demak'],
    ['kategori', 'Mangroves & coast'],
  ])
    await form.locator(`[name="${name}"]`).fill(value);
  if (project) await form.locator('[name="tujuan"]').fill('Memulihkan pesisir');
}
async function fillNeeds(page) {
  const form = page.locator('form:visible');
  for (const [name, value] of [
    ['targetDana', '100000'],
    ['kebutuhan', 'Bibit dan sarung tangan'],
    ['kriteriaRelawan', 'Bersedia bekerja di lapangan'],
    ['kuotaRelawan', '5'],
    ['lokasiKumpul', 'Balai desa'],
    ['mulai', today],
    ['selesai', end],
  ])
    await form.locator(`[name="${name}"]`).fill(value);
}
async function save(page, jenis) {
  await page.getByRole('button', { name: 'Simpan Draft', exact: true }).click();
  await page.waitForURL(new RegExp(`/manage/${jenis}/[a-z0-9-]+$`));
  await page.getByRole('heading', { level: 1 }).waitFor();
  return new URL(page.url()).pathname.split('/').at(-1);
}
async function submit(page, jenis, id) {
  await page
    .getByRole('button', { name: 'Ajukan Verifikasi', exact: true })
    .click();
  await page
    .getByText('Menunggu Verifikasi', { exact: true })
    .first()
    .waitFor();
  assert.equal(
    (await api(page, `/api/aksi/${jenis}/${id}`)).aksi.status,
    'menunggu_verifikasi',
  );
}
async function run() {
  await seed();
  await start();
  const page = await pageFor(owner),
    reviewer = await pageFor(admin),
    outsider = await pageFor(other),
    restricted = await pageFor(volunteer),
    guest = await pageFor();
  primary = page;
  assert.equal((await api(page, '/api/auth/saya')).data.idPengguna, owner);
  // UC02, alur dari My Actions: daftar -> formulir -> detail draft -> status pending.
  await page.goto(base + '/account');
  await page.getByRole('tab', { name: 'My actions', exact: true }).click();
  await capture(page, 'KNF03-TC01-mulai');
  await page.getByRole('link', { name: 'New submission', exact: true }).click();
  await page.waitForURL(base + '/start');
  const form = page.locator('form:visible');
  await page.getByRole('button', { name: 'Simpan Draft', exact: true }).click();
  await form.locator('[name="judul"][aria-invalid="true"]').waitFor();
  const [emptyCampaign] = await db.execute(
    'SELECT COUNT(*) AS jumlah FROM campaign WHERE id_pembuat=?',
    [owner],
  );
  assert.equal(Number(emptyCampaign[0].jumlah), 0);
  await capture(page, 'UC02-TC06-kelengkapan');
  record(
    'UC02-TC06',
    'Formulir kosong ditolak pada judul; tidak ada campaign tersimpan.',
  );
  await fillInfo(page, `Campaign mangrove M10 ${stamp}`);
  await form.locator('[name="targetDana"]').fill('0');
  await form.locator('[name="mulai"]').fill(today);
  await form.locator('[name="selesai"]').fill(end);
  await page.getByRole('button', { name: 'Simpan Draft', exact: true }).click();
  await form.locator('[name="targetDana"][aria-invalid="true"]').waitFor();
  await capture(page, 'UC02-TC02-target');
  record(
    'UC02-TC02',
    'Target 0 ditolak; galat targetDana tampil, tidak pindah dari formulir.',
  );
  await form.locator('[name="targetDana"]').fill('100000');
  await form.locator('[name="selesai"]').fill('2026-01-01');
  await page.getByRole('button', { name: 'Simpan Draft', exact: true }).click();
  await form.locator('[name="selesai"][aria-invalid="true"]').waitFor();
  await capture(page, 'UC02-TC03-periode');
  record(
    'UC02-TC03',
    'Tanggal selesai sebelum mulai ditolak pada kolom selesai.',
  );
  await form.locator('[name="selesai"]').fill(end);
  const campaignId = await save(page, 'campaign');
  await capture(page, 'UC02-TC01-draft');
  const stored = (await api(page, `/api/aksi/campaign/${campaignId}`)).aksi;
  assert.equal(stored.idPembuat, owner);
  assert.equal(stored.status, 'draft');
  assert.match(campaignId, /^[0-9a-f-]{36}$/);
  assert.equal(Number(stored.targetDana), 100000);
  assert.equal(stored.mulai, today);
  assert.equal(stored.selesai, end);
  await submit(page, 'campaign', campaignId);
  await capture(page, 'UC02-TC01-pending');
  record(
    'UC02-TC01',
    'Campaign tersimpan dengan ID unik dan pemilik sesi; Draft berhasil diajukan menjadi Menunggu Verifikasi.',
  );
  record(
    'KNF03-TC01',
    '4 tahap: My Actions -> formulir campaign -> detail Draft -> status Menunggu Verifikasi.',
  );
  await outsider.goto(`${base}/manage/campaign/${campaignId}`);
  await outsider
    .getByRole('alert')
    .filter({ hasText: 'tidak ditemukan' })
    .waitFor();
  await api(
    outsider,
    `/api/aksi/campaign/${campaignId}`,
    'GET',
    undefined,
    404,
  );
  record(
    'UC02-TC04',
    'Pembuat lain mendapat pesan tidak ditemukan dan API 404.',
  );
  await api(restricted, '/api/campaigns', 'POST', {}, 403);
  await guest.goto(base + '/start');
  await guest.getByRole('alert').filter({ hasText: 'login' }).waitFor();
  record('UC02-TC05', 'Tamu diminta login; API volunteer ditolak 403.');
  // UC04: antrean dan keputusan admin, termasuk penolakan tanpa alasan.
  await reviewer.goto(base + '/admin');
  await reviewer
    .getByRole('article')
    .filter({ hasText: stored.judul })
    .getByRole('link', { name: 'Tinjau pengajuan' })
    .waitFor();
  await capture(reviewer, 'UC04-TC01-antrean');
  await reviewer
    .getByRole('article')
    .filter({ hasText: stored.judul })
    .getByRole('link', { name: 'Tinjau pengajuan' })
    .click();
  await reviewer.getByRole('button', { name: 'Tolak', exact: true }).click();
  await reviewer
    .getByRole('alert')
    .filter({ hasText: 'Alasan penolakan wajib' })
    .waitFor();
  assert.equal(
    (await api(reviewer, `/api/aksi/campaign/${campaignId}`)).aksi.status,
    'menunggu_verifikasi',
  );
  await capture(reviewer, 'UC04-TC03-alasan');
  record(
    'UC04-TC03',
    'Penolakan tanpa alasan ditolak; pengajuan tetap pending.',
  );
  await reviewer
    .getByLabel('Alasan penolakan')
    .fill('Perjelas rincian anggaran');
  await reviewer.getByRole('button', { name: 'Tolak', exact: true }).click();
  await reviewer
    .getByRole('status')
    .filter({ hasText: 'Status pengajuan: Ditolak' })
    .waitFor();
  const rejected = (await api(reviewer, `/api/aksi/campaign/${campaignId}`))
    .aksi;
  assert.equal(rejected.status, 'ditolak');
  assert.equal(rejected.alasanPenolakan, 'Perjelas rincian anggaran');
  await capture(reviewer, 'UC04-TC02-ditolak');
  record('UC04-TC02', 'Status Ditolak dan alasan tersimpan.');
  await page.goto(base + '/account');
  await page.getByRole('tab', { name: 'My actions', exact: true }).click();
  const card = page.getByRole('article').filter({ hasText: stored.judul });
  await card.getByText('Alasan penolakan: Perjelas rincian anggaran').waitFor();
  await card.getByRole('button', { name: 'Ajukan Ulang', exact: true }).click();
  await card
    .getByText('Campaign · Menunggu Verifikasi', { exact: true })
    .waitFor();
  const requeued = (await api(page, `/api/aksi/campaign/${campaignId}`)).aksi;
  assert.equal(requeued.alasanPenolakan, null);
  record(
    'UC04-TC04',
    'Alasan tampil di My Actions; pengajuan ulang kembali pending dan membersihkan alasan lama.',
  );
  await reviewer.goto(`${base}/admin/pengajuan/campaign/${campaignId}`);
  await reviewer.getByRole('button', { name: 'Setujui', exact: true }).click();
  await reviewer
    .getByRole('status')
    .filter({ hasText: 'Status pengajuan: Terpublikasi' })
    .waitFor();
  await capture(reviewer, 'UC04-TC01-published');
  record(
    'UC04-TC01',
    'Antrean memuat campaign pending; persetujuan mengubah status menjadi Terpublikasi.',
  );
  record(
    'KNF03-TC03',
    '3 tahap: antrean admin -> detail pengajuan -> status keputusan.',
  );
  await restricted.goto(base + '/admin');
  await restricted
    .getByRole('alert')
    .filter({ hasText: 'tidak memiliki akses' })
    .waitFor();
  await capture(restricted, 'UC04-TC05-akses');
  await api(restricted, '/api/verifikasi', 'GET', undefined, 403);
  await api(
    restricted,
    `/api/verifikasi/campaign/${campaignId}`,
    'POST',
    { keputusan: 'setujui' },
    403,
  );
  record(
    'UC04-TC05',
    'UI non-admin menolak akses; endpoint antrean/keputusan menjawab 403.',
  );
  // UC03: pilih project dari My Actions; dua formulir, satu ID.
  await page.goto(base + '/account');
  await page.getByRole('tab', { name: 'My actions', exact: true }).click();
  await page.getByRole('link', { name: 'New submission', exact: true }).click();
  await page
    .getByRole('navigation', { name: 'Jenis aksi' })
    .getByRole('link', { name: 'Project', exact: true })
    .click();
  await page.waitForURL(base + '/start?type=project');
  await page.getByText('Tahap 1 dari 2:', { exact: false }).waitFor();
  await page
    .getByRole('button', { name: 'Simpan dan lanjut', exact: true })
    .click();
  await page
    .locator('form:visible [name="judul"][aria-invalid="true"]')
    .waitFor();
  const [emptyProject] = await db.execute(
    'SELECT COUNT(*) AS jumlah FROM project WHERE id_pembuat=?',
    [owner],
  );
  assert.equal(Number(emptyProject[0].jumlah), 0);
  await capture(page, 'UC03-TC05-kelengkapan');
  record(
    'UC03-TC05',
    'Informasi dasar kosong ditolak; tidak ada project tersimpan.',
  );
  await fillInfo(page, `Project mangrove M10 ${stamp}`, true);
  await capture(page, 'UC03-TC01-informasi');
  await page
    .getByRole('button', { name: 'Simpan dan lanjut', exact: true })
    .click();
  await page.locator('form:visible [name="kuotaRelawan"]').waitFor();
  const idBefore = await page
    .locator('form:visible .notice.info strong')
    .innerText();
  await fillNeeds(page);
  await page.locator('form:visible [name="targetDana"]').fill('-1');
  await page.getByRole('button', { name: 'Simpan Draft', exact: true }).click();
  await page
    .locator('form:visible [name="targetDana"][aria-invalid="true"]')
    .waitFor();
  await page.locator('form:visible [name="targetDana"]').fill('100000');
  await page.locator('form:visible [name="kebutuhan"]').fill('');
  await page.getByRole('button', { name: 'Simpan Draft', exact: true }).click();
  await page
    .locator('form:visible [name="kebutuhan"][aria-invalid="true"]')
    .waitFor();
  await capture(page, 'UC03-TC02-kebutuhan');
  record(
    'UC03-TC02',
    'Dana negatif dan logistik kosong ditolak pada kolomnya.',
  );
  await page
    .locator('form:visible [name="kebutuhan"]')
    .fill('Bibit dan sarung tangan');
  await capture(page, 'UC03-TC01-kebutuhan');
  await page
    .getByRole('button', { name: 'Kembali ke informasi', exact: true })
    .click();
  assert.equal(
    await page.locator('form:visible [name="judul"]').inputValue(),
    `Project mangrove M10 ${stamp}`,
  );
  await page
    .getByRole('button', { name: 'Simpan dan lanjut', exact: true })
    .click();
  assert.equal(
    await page.locator('form:visible [name="kebutuhan"]').inputValue(),
    'Bibit dan sarung tangan',
  );
  const projectId = await save(page, 'project');
  assert.equal(projectId, idBefore);
  const savedProject = (await api(page, `/api/aksi/project/${projectId}`)).aksi;
  assert.equal(savedProject.idPembuat, owner);
  assert.equal(savedProject.status, 'draft');
  assert.equal(Number(savedProject.targetDana), 100000);
  assert.equal(savedProject.kebutuhan, 'Bibit dan sarung tangan');
  assert.equal(savedProject.kriteriaRelawan, 'Bersedia bekerja di lapangan');
  assert.equal(savedProject.kuotaRelawan, 5);
  assert.equal(savedProject.lokasiKumpul, 'Balai desa');
  assert.equal(savedProject.mulai, today);
  assert.equal(savedProject.selesai, end);
  await capture(page, 'UC03-TC01-draft');
  record(
    'UC03-TC03',
    'Kembali mempertahankan isian kebutuhan dan ID project yang sama.',
  );
  await submit(page, 'project', projectId);
  await capture(page, 'UC03-TC01-pending');
  record(
    'UC03-TC01',
    'Project dua tahap menyimpan dana, logistik, kuota, jadwal, titik kumpul dan pemilik; status pengajuan pending.',
  );
  record(
    'KNF03-TC02',
    '5 tahap: My Actions -> informasi project -> kebutuhan/jadwal -> detail Draft -> status Menunggu Verifikasi.',
  );
  const [rows] = await db.execute(
    'SELECT COUNT(*) AS jumlah FROM project WHERE id_pembuat=?',
    [owner],
  );
  assert.equal(Number(rows[0].jumlah), 1);
  await api(
    outsider,
    `/api/aksi/project/${projectId}`,
    'PATCH',
    { judul: 'Tidak boleh' },
    404,
  );
  record(
    'UC03-TC04',
    'Pemilik lain tidak boleh mengubah project (404); jumlah project pemilik tetap 1.',
  );
  assert.deepEqual(errors, []);
  console.log(
    JSON.stringify({ passed: true, results, pageErrors: errors }, null, 2),
  );
}
run()
  .catch(async (error) => {
    console.error(error);
    if (primary)
      console.error('PAGE', await primary.locator('body').innerText());
    process.exitCode = 1;
  })
  .finally(async () => {
    if (browser) await browser.close();
    if (server) server.kill('SIGTERM');
    if (process.env.M10_BROWSER_LOG)
      fs.writeFileSync(process.env.M10_BROWSER_LOG, serverLog);
    if (db) {
      try {
        for (const id of users) {
          await db.execute('DELETE FROM campaign WHERE id_pembuat=?', [id]);
          await db.execute('DELETE FROM project WHERE id_pembuat=?', [id]);
          await db.execute('DELETE FROM pengguna WHERE id_pengguna=?', [id]);
        }
      } finally {
        await db.end();
      }
    }
  });
