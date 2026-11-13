/** End-to-end browser + API + DB; jalankan hanya terhadap DB khusus test. */
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import mysql from 'mysql2/promise';
import { hash } from 'bcryptjs';

const load = createRequire(import.meta.url);
const { chromium } = load(process.env.PLAYWRIGHT_MODULE || 'playwright');

assert.equal(
  process.env.AKSI_TEST_DB,
  '1',
  'Set AKSI_TEST_DB=1 untuk mengizinkan fixture.',
);
assert.match(
  process.env.DB_NAME || '',
  /test/i,
  'DB_NAME wajib database khusus test.',
);
const port = process.env.AKSI_TEST_PORT || '3196';
const serverMode = process.env.AKSI_TEST_SERVER_MODE || 'dev';
assert.ok(
  ['dev', 'production'].includes(serverMode),
  'AKSI_TEST_SERVER_MODE harus dev atau production.',
);
const base = `http://127.0.0.1:${port}`;
const stamp = randomUUID().slice(0, 8);
const fixturePassword = `aksi-browser-only-${stamp}`;
const ids = ['owner', 'other', 'admin', 'volunteer'].map(
  (v) => `browser-${v}-${stamp}`,
);
const [owner, other, admin, volunteer] = ids;
const tokens = Object.fromEntries(ids.map((id) => [id, randomUUID()]));
const today = new Date(Date.now() + 7 * 3600000).toISOString().slice(0, 10);
const end = new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10);
let db, browser, child;
let serverLog = '';

async function seed() {
  const passwordHash = await hash(fixturePassword, 12);
  db = await mysql.createConnection({
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  for (const id of ids) {
    await db.execute(
      'INSERT INTO pengguna (id_pengguna, nama, peran) VALUES (?, ?, ?)',
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
      'INSERT INTO akun (id_akun, id_pengguna, email, password_hash) VALUES (?, ?, ?, ?)',
      [id, id, `${id}@example.invalid`, passwordHash],
    );
    await db.execute(
      `INSERT INTO sesi_login (id_sesi, id_pengguna, waktu_mulai, waktu_kedaluwarsa)
      VALUES (?, ?, UTC_TIMESTAMP(), DATE_ADD(UTC_TIMESTAMP(), INTERVAL 1 HOUR))`,
      [tokens[id], id],
    );
  }
}
async function start() {
  child = spawn(
    process.execPath,
    [
      'node_modules/next/dist/bin/next',
      serverMode === 'production' ? 'start' : 'dev',
      '--hostname',
      '127.0.0.1',
      '--port',
      port,
    ],
    { cwd: process.cwd(), env: process.env, stdio: ['ignore', 'pipe', 'pipe'] },
  );
  await new Promise((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`Server timeout\n${serverLog}`)),
      60000,
    );
    const log = (data) => {
      serverLog += data;
      if (serverLog.includes('Ready')) {
        clearTimeout(timer);
        resolve();
      }
    };
    child.stdout.on('data', log);
    child.stderr.on('data', log);
    child.once('exit', (code) => {
      clearTimeout(timer);
      reject(new Error(`Server exit ${code}\n${serverLog}`));
    });
  });
}
async function pageFor(id) {
  const context = await browser.newContext();
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
  return context.newPage();
}
async function fillInfo(page, title, project = false) {
  // Next Activity dapat mempertahankan DOM rute lama dalam keadaan tersembunyi.
  page = page.locator('form:visible');
  await page.getByLabel('Judul', { exact: false }).fill(title);
  await page
    .getByLabel('Deskripsi', { exact: false })
    .fill('Deskripsi aksi browser');
  await page.getByLabel('Provinsi', { exact: false }).fill('Bali');
  await page.getByLabel('Kota / kabupaten', { exact: false }).fill('Tabanan');
  if (project)
    await page
      .getByLabel('Tujuan', { exact: false })
      .fill('Melindungi pesisir');
}
async function waitManage(page, jenis) {
  await page.waitForURL(new RegExp(`/manage/${jenis}/[a-z0-9-]+$`));
  await page.getByRole('heading', { level: 1 }).waitFor();
  return new URL(page.url()).pathname.split('/').at(-1);
}
async function openAccountActions(target) {
  await target.goto(`${base}/account`);
  await target.getByRole('tab', { name: 'My actions', exact: true }).click();
  return target.getByRole('tabpanel');
}
async function submitAction(page) {
  const response = page.waitForResponse(
    (r) => r.url().includes('/pengajuan') && r.request().method() === 'POST',
  );
  await page
    .getByRole('button', { name: 'Ajukan Verifikasi', exact: true })
    .click();
  assert.equal((await response).status(), 200);
  await page
    .getByRole('button', { name: 'Ajukan Verifikasi', exact: true })
    .waitFor({ state: 'detached' });
}
async function run() {
  await seed();
  await start();
  browser = await chromium.launch({
    headless: true,
    ...(process.env.PLAYWRIGHT_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH }
      : {}),
  });
  const opsi = await fetch(`${base}/api/katalog/opsi`);
  assert.equal(
    opsi.status,
    200,
    'Opsi katalog harus membaca DB pada runtime, bukan respons gagal saat build.',
  );
  assert.ok(Array.isArray((await opsi.json()).provinsi));
  const katalog = await fetch(`${base}/api/katalog?halaman=1&batas=50`);
  assert.equal(katalog.status, 200);
  assert.ok(Array.isArray((await katalog.json()).data));
  assert.equal(
    (await fetch(`${base}/api/donasi/form?jenis=project&id=review`)).status,
    401,
    'API donasi tamu memberi 401 saat runtime, bukan 500 akibat prerender.',
  );
  const guest = await pageFor();
  await guest.goto(`${base}/donasi/project/review`);
  await guest
    .getByRole('heading', { name: 'Support this action', exact: true })
    .waitFor();
  await guest
    .getByRole('button', { name: 'Donate now', exact: true })
    .waitFor();
  await guest.goto(`${base}/start`);
  await guest.getByRole('alert').filter({ hasText: 'login' }).waitFor();
  assert.equal(await guest.locator('form').count(), 0);
  // Pemilik utama masuk melalui UI/API resmi; peran lain tetap fixture sesi terisolasi.
  const page = await pageFor();
  await page.goto(`${base}/account`);
  await page
    .getByRole('heading', { name: 'Log in to see your activity' })
    .waitFor();
  await page
    .getByRole('button', { name: 'Log in', exact: true })
    .last()
    .click();
  const login = page.getByRole('dialog');
  await login
    .getByLabel('Email', { exact: true })
    .fill(`${owner}@example.invalid`);
  await login.getByLabel('Password', { exact: true }).fill(fixturePassword);
  await login.getByRole('button', { name: 'Log in', exact: true }).click();
  await login.waitFor({ state: 'detached' });
  await page
    .getByRole('heading', { name: `Hi, ${owner}`, exact: true })
    .waitFor();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', async (response) => {
    if (response.url().includes('/api/') && response.status() >= 400) {
      console.log(
        'API_ERROR',
        response.status(),
        response.url(),
        await response.text(),
      );
    }
  });
  await page.goto(`${base}/start?type=campaign`);
  await fillInfo(page, `Campaign ${stamp}`);
  await page.getByLabel('Target dana').filter({ visible: true }).fill('0');
  await page.getByLabel('Tanggal mulai').filter({ visible: true }).fill(today);
  await page.getByLabel('Tanggal selesai').filter({ visible: true }).fill(end);
  await page.getByRole('button', { name: 'Simpan Draft', exact: true }).click();
  await page
    .getByLabel('Target dana')
    .filter({ visible: true })
    .and(page.locator('[aria-invalid="true"]'))
    .waitFor();
  await page.getByLabel('Target dana').filter({ visible: true }).fill('10000');
  await page.getByRole('button', { name: 'Tambah rincian' }).click();
  await page
    .getByLabel('Rincian 1', { exact: true })
    .filter({ visible: true })
    .fill('Peralatan lapangan');
  await page
    .getByLabel('Nominal rincian 1', { exact: true })
    .filter({ visible: true })
    .fill('10000');
  await page.route('**/api/campaigns', (route) => route.abort(), { times: 1 });
  await page.getByRole('button', { name: 'Simpan Draft', exact: true }).click();
  await page.getByRole('alert').filter({ hasText: 'Koneksi gagal' }).waitFor();
  assert.equal(
    await page.getByLabel('Judul').filter({ visible: true }).inputValue(),
    `Campaign ${stamp}`,
  );
  await page.getByRole('button', { name: 'Simpan Draft', exact: true }).click();
  const campaignId = await waitManage(page, 'campaign');
  await page
    .getByText('Peralatan lapangan: Rp10.000', { exact: true })
    .waitFor();
  const [budget] = await db.execute(
    'SELECT rincian_penggunaan_dana AS rincian FROM campaign WHERE id_campaign = ?',
    [campaignId],
  );
  assert.deepEqual(
    typeof budget[0].rincian === 'string'
      ? JSON.parse(budget[0].rincian)
      : budget[0].rincian,
    [{ uraian: 'Peralatan lapangan', nominal: 10000 }],
  );
  const outsider = await pageFor(other);
  await outsider.goto(`${base}/manage/campaign/${campaignId}`);
  await outsider
    .getByRole('alert')
    .filter({ hasText: 'tidak ditemukan' })
    .waitFor();
  assert.equal(
    await outsider.getByText('Deskripsi aksi browser', { exact: true }).count(),
    0,
  );
  const draftPanel = await openAccountActions(page);
  const draftCard = draftPanel
    .getByRole('article')
    .filter({ hasText: `Campaign ${stamp}` });
  await draftCard.getByText('Campaign · Draft', { exact: true }).waitFor();
  await draftCard.getByRole('link', { name: 'Kelola', exact: true }).click();
  assert.equal(await waitManage(page, 'campaign'), campaignId);
  await submitAction(page);

  const reviewer = await pageFor(admin);
  await reviewer.goto(`${base}/admin`);
  await reviewer
    .getByRole('article')
    .filter({ hasText: `Campaign ${stamp}` })
    .getByRole('link', { name: 'Tinjau pengajuan' })
    .click();
  await reviewer.getByRole('button', { name: 'Tolak', exact: true }).click();
  await reviewer
    .getByRole('alert')
    .filter({ hasText: 'Alasan penolakan wajib' })
    .waitFor();
  await reviewer.getByLabel('Alasan penolakan').fill('Perjelas rencana dana');
  await reviewer.getByRole('button', { name: 'Tolak', exact: true }).click();
  await reviewer
    .locator('.notice[role="status"]')
    .filter({ hasText: 'Status pengajuan: Ditolak' })
    .waitFor();
  await openAccountActions(page);
  const card = page
    .getByRole('article')
    .filter({ hasText: `Campaign ${stamp}` });
  await card.getByText('Alasan penolakan: Perjelas rencana dana').waitFor();
  await card.getByRole('button', { name: 'Ajukan Ulang' }).click();
  await card
    .getByRole('button', { name: 'Ajukan Ulang' })
    .waitFor({ state: 'detached' });
  await card
    .getByText('Campaign · Menunggu Verifikasi', { exact: true })
    .waitFor();
  assert.equal(
    await page
      .getByRole('tab', { name: 'My actions', exact: true })
      .getAttribute('aria-selected'),
    'true',
    'Refresh pengajuan ulang tidak memindahkan tab Account.',
  );
  const otherPanel = await openAccountActions(outsider);
  await otherPanel
    .getByText("You haven't created an action yet", { exact: true })
    .waitFor();
  assert.equal(
    await outsider.getByText(`Campaign ${stamp}`, { exact: true }).count(),
    0,
    'Account pengguna lain tidak mendapat daftar pemilik.',
  );
  assert.equal(
    (await outsider.content()).includes(campaignId),
    false,
    'Payload HTML/Flight Account pengguna lain tidak memuat ID aksi privat.',
  );
  await guest.goto(`${base}/account`);
  await guest
    .getByRole('heading', { name: 'Log in to see your activity' })
    .waitFor();
  assert.equal(
    await guest.getByRole('tab', { name: 'My actions', exact: true }).count(),
    0,
  );
  await db.execute(
    'UPDATE sesi_login SET waktu_kedaluwarsa = UTC_TIMESTAMP() WHERE id_sesi = ?',
    [tokens[other]],
  );
  await outsider.goto(`${base}/account`);
  await outsider
    .getByRole('heading', { name: 'Log in to see your activity' })
    .waitFor();
  await reviewer.reload();
  await reviewer.getByRole('button', { name: 'Setujui', exact: true }).click();
  await reviewer
    .locator('.notice[role="status"]')
    .filter({ hasText: 'Status pengajuan: Terpublikasi' })
    .waitFor();

  await page.goto(`${base}/start?type=project`);
  await fillInfo(page, `Project ${stamp}`, true);
  await page.getByRole('button', { name: 'Simpan dan lanjut' }).click();
  await page.getByLabel('Kebutuhan dana').filter({ visible: true }).fill('0');
  await page
    .getByLabel('Kebutuhan logistik')
    .filter({ visible: true })
    .fill('Sarung tangan');
  await page
    .getByLabel('Kriteria relawan')
    .filter({ visible: true })
    .fill('Bersedia berkegiatan');
  await page.getByLabel('Kuota relawan').filter({ visible: true }).fill('5');
  await page.getByLabel('Tanggal mulai').filter({ visible: true }).fill(today);
  await page.getByLabel('Tanggal selesai').filter({ visible: true }).fill(end);
  await page
    .getByLabel('Titik kumpul')
    .filter({ visible: true })
    .fill('Alamat privat relawan');
  await page.getByRole('button', { name: 'Kembali ke informasi' }).click();
  assert.equal(
    await page.getByLabel('Judul').filter({ visible: true }).inputValue(),
    `Project ${stamp}`,
  );
  await page
    .getByLabel('Judul')
    .filter({ visible: true })
    .fill(`Project revisi ${stamp}`);
  await page.getByRole('button', { name: 'Simpan dan lanjut' }).click();
  assert.equal(
    await page
      .getByLabel('Kebutuhan logistik')
      .filter({ visible: true })
      .inputValue(),
    'Sarung tangan',
  );
  assert.equal(
    await page
      .getByLabel('Titik kumpul')
      .filter({ visible: true })
      .inputValue(),
    'Alamat privat relawan',
  );
  await page.getByRole('button', { name: 'Simpan Draft', exact: true }).click();
  const projectId = await waitManage(page, 'project');
  await submitAction(page);
  await reviewer.goto(`${base}/admin/pengajuan/project/${projectId}`);
  await reviewer.getByRole('button', { name: 'Setujui', exact: true }).click();
  await reviewer
    .locator('.notice[role="status"]')
    .filter({ hasText: 'Status pengajuan: Terpublikasi' })
    .waitFor();
  await page.goto(`${base}/my-actions`);
  await page
    .getByRole('article')
    .filter({ hasText: `Project revisi ${stamp}` })
    .getByRole('link', { name: 'Progres', exact: true })
    .waitFor();
  const publishedPanel = await openAccountActions(page);
  await publishedPanel
    .getByRole('article')
    .filter({ hasText: `Project revisi ${stamp}` })
    .getByText('Project · Terpublikasi', { exact: true })
    .waitFor();
  await publishedPanel
    .getByRole('article')
    .filter({ hasText: `Campaign ${stamp}` })
    .getByText('Campaign · Terpublikasi', { exact: true })
    .waitFor();
  await publishedPanel
    .getByRole('article')
    .filter({ hasText: `Project revisi ${stamp}` })
    .getByRole('link', { name: 'Progres', exact: true })
    .click();
  await page.waitForURL(`${base}/progress/${projectId}`);
  await page.getByRole('button', { name: 'Post a progress update' }).click();
  const progress = page.getByRole('dialog');
  await progress
    .getByLabel('Milestone', { exact: false })
    .fill(`Milestone ${stamp}`);
  await progress
    .getByLabel('Status', { exact: false })
    .selectOption('berjalan');
  await progress
    .getByRole('button', { name: 'Post update', exact: true })
    .click();
  await page
    .getByRole('status')
    .filter({ hasText: 'Pembaruan progres berhasil' })
    .waitFor();
  const [updates] = await db.execute(
    'SELECT milestone FROM progres_project WHERE id_project = ?',
    [projectId],
  );
  assert.equal(updates.length, 1);
  assert.equal(updates[0].milestone, `Milestone ${stamp}`);
  await page.getByRole('link', { name: 'Lihat project publik' }).click();
  await page
    .getByRole('heading', { name: `Project revisi ${stamp}`, exact: true })
    .waitFor();
  // Sesi lain yang masih aktif tidak boleh membuka halaman penghubung pemilik.
  const otherOwner = await pageFor(other);
  await db.execute(
    "UPDATE sesi_login SET waktu_kedaluwarsa = DATE_ADD(UTC_TIMESTAMP(), INTERVAL 1 HOUR), status_sesi = 'aktif' WHERE id_sesi = ?",
    [tokens[other]],
  );
  await otherOwner.goto(`${base}/progress/${projectId}`);
  await otherOwner
    .getByRole('alert')
    .filter({ hasText: 'tidak ditemukan' })
    .waitFor();
  assert.equal(
    (await otherOwner.content()).includes(`Project revisi ${stamp}`),
    false,
  );
  const [rows] = await db.execute(
    'SELECT id_project FROM project WHERE id_pembuat = ?',
    [owner],
  );
  assert.equal(
    rows.length,
    1,
    'Kembali ke tahap pertama tidak membuat project ganda.',
  );
  const restricted = await pageFor(volunteer);
  const volunteerPanel = await openAccountActions(restricted);
  await volunteerPanel
    .getByText(
      'Creating and managing actions is available to project creators.',
      { exact: false },
    )
    .waitFor();
  const adminPanel = await openAccountActions(reviewer);
  assert.equal(
    await adminPanel
      .getByRole('link', { name: 'Review submissions' })
      .getAttribute('href'),
    '/admin',
  );
  await restricted.goto(`${base}/admin`);
  await restricted
    .getByRole('alert')
    .filter({ hasText: 'tidak memiliki akses' })
    .waitFor();
  await page.setViewportSize({ width: 375, height: 812 });
  await page.goto(`${base}/start?type=project`);
  await page.locator('input[name="judul"]:visible').waitFor();
  const overflow = await page.evaluate(() =>
    [...document.querySelectorAll('body *')]
      .filter((el) => el.getBoundingClientRect().right > window.innerWidth + 1)
      .map((el) => ({
        tag: el.tagName,
        cls: el.className,
        width: el.getBoundingClientRect().width,
      }))
      .slice(0, 20),
  );
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    ),
    false,
    `Form mobile tidak overflow: ${JSON.stringify(overflow)}`,
  );
  assert.deepEqual(errors, []);
  console.log(
    JSON.stringify({
      passed: true,
      serverMode,
      scenarios: [
        'akses sesi/peran/pemilik',
        'validasi inline',
        'network retry mempertahankan isian',
        'campaign draft/ajukan/tolak/ulang/setujui',
        'project dua tahap/kembali/satu ID/setujui',
        'My Actions dalam Account: pemilik/tamu/volunteer/admin/sesi kedaluwarsa + refresh tab',
        'login UI resmi ke My Actions',
        'tujuan Progres privat memakai form/API tim hingga tersimpan di database',
        'mobile 375px',
      ],
      campaignId,
      projectId,
    }),
  );
}
run()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    if (browser) await browser.close();
    if (child) child.kill('SIGTERM');
    if (process.env.AKSI_BROWSER_LOG)
      fs.writeFileSync(process.env.AKSI_BROWSER_LOG, serverLog);
    if (db) {
      for (const id of ids) {
        await db.execute('DELETE FROM campaign WHERE id_pembuat = ?', [id]);
        await db.execute('DELETE FROM project WHERE id_pembuat = ?', [id]);
        await db.execute('DELETE FROM pengguna WHERE id_pengguna = ?', [id]);
      }
      await db.end();
    }
  });
