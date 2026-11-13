/** Regression Account dengan browser, API dan MySQL khusus test; build terlebih dahulu. */
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import fs from 'node:fs';
import mysql from 'mysql2/promise';
import { hash } from 'bcryptjs';

const load = createRequire(import.meta.url);
const { chromium } = load(process.env.PLAYWRIGHT_MODULE || 'playwright');
assert.equal(process.env.AKSI_TEST_DB, '1');
assert.match(process.env.DB_NAME || '', /test/i);
const port = process.env.ACCOUNT_TEST_PORT || '3197';
const base = `http://127.0.0.1:${port}`;
const suffix = randomUUID().slice(0, 8);
const owner = `acct-owner-${suffix}`;
const volunteer = `acct-vol-${suffix}`;
const other = `acct-other-${suffix}`;
const empty = `acct-empty-${suffix}`;
const ids = [owner, volunteer, other, empty];
const project = `acct-project-${suffix}`;
const progress = `acct-progress-${suffix}`;
const milestone = 'Planting stage 1';
const tokens = Object.fromEntries(ids.map((id) => [id, randomUUID()]));
let db,
  browser,
  server,
  serverLog = '';
const errors = [];

async function screenshot(page, name) {
  if (!process.env.ACCOUNT_SCREENSHOT_DIR) return;
  fs.mkdirSync(process.env.ACCOUNT_SCREENSHOT_DIR, { recursive: true });
  await page.screenshot({
    path: `${process.env.ACCOUNT_SCREENSHOT_DIR}/${name}.png`,
    fullPage: true,
  });
}

async function seed() {
  const passwordHash = await hash(`Account-test-${suffix}`, 12);
  db = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });
  for (const id of ids) {
    await db.execute(
      'INSERT INTO pengguna (id_pengguna,nama,peran) VALUES (?,?,?)',
      [id, id, [owner, empty].includes(id) ? 'pembuat_project' : 'volunteer'],
    );
    await db.execute(
      'INSERT INTO akun (id_akun,id_pengguna,email,password_hash) VALUES (?,?,?,?)',
      [id, id, `${id}@example.invalid`, passwordHash],
    );
    await db.execute(
      'INSERT INTO donatur (id_donatur,saldo) VALUES (?,100000)',
      [id],
    );
    await db.execute(
      'INSERT INTO sesi_login (id_sesi,id_pengguna,waktu_mulai,waktu_kedaluwarsa) VALUES (?,?,UTC_TIMESTAMP(),DATE_ADD(UTC_TIMESTAMP(),INTERVAL 1 HOUR))',
      [tokens[id], id],
    );
  }
  await db.execute(
    "INSERT INTO project (id_project,id_pembuat,nama,deskripsi,provinsi,kota,status,kebutuhan_dana,kuota_relawan,status_pendaftaran_project,lokasi_kumpul,jadwal_mulai,jadwal_selesai) VALUES (?,?,?,'Account regression','Bali','Tabanan','terpublikasi',1000000,10,'dibuka','Private meeting point',CURDATE(),DATE_ADD(CURDATE(),INTERVAL 30 DAY))",
    [project, owner, project],
  );
  await db.execute(
    "INSERT INTO progres_project (id_progres,id_project,id_pengguna,milestone,status_pelaksanaan,catatan,persentase,dokumentasi_url,timestamp_pembaruan) VALUES (?,?,?,?,'berjalan','Progress note',35,'/api/dokumentasi/plots-a-b.jpg,/api/dokumentasi/attendance.pdf',UTC_TIMESTAMP())",
    [progress, project, owner, milestone],
  );
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
    const timer = setTimeout(() => reject(new Error(serverLog)), 60000);
    const receive = (data) => {
      serverLog += data;
      if (serverLog.includes('Ready')) {
        clearTimeout(timer);
        resolve();
      }
    };
    server.stdout.on('data', receive);
    server.stderr.on('data', receive);
    server.once('exit', (code) => {
      clearTimeout(timer);
      reject(new Error(`Server exit ${code}: ${serverLog}`));
    });
  });
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
  return page;
}

async function request(page, path, method = 'GET', data, status = 200) {
  const response = await page.request.fetch(`${base}${path}`, { method, data });
  assert.equal(response.status(), status, await response.text());
  return response.json();
}

async function account(page) {
  const loaded = page.waitForResponse(
    (r) => new URL(r.url()).pathname === '/api/riwayat',
  );
  await page.goto(`${base}/account`);
  await loaded;
  await page.getByRole('group', { name: 'Filter history' }).waitFor();
}

async function filter(page, label) {
  const button = page
    .getByRole('group', { name: 'Filter history' })
    .getByRole('button', { name: label, exact: true });
  await button.click();
  assert.equal(await button.getAttribute('aria-pressed'), 'true');
}

async function noOverflow(page) {
  assert.equal(
    await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
    false,
    'Account tidak boleh overflow horizontal',
  );
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
  const creator = await pageFor(empty);
  await account(creator);
  await creator.getByRole('tab', { name: 'My actions', exact: true }).click();
  const panel = creator.getByRole('tabpanel');
  const heading = panel.getByRole('heading', {
    name: "You haven't created an action yet",
    exact: true,
  });
  await heading.waitFor();
  const submission = panel.getByRole('link', {
    name: 'New submission',
    exact: true,
  });
  assert.equal(await submission.getAttribute('href'), '/start');
  assert.equal(
    await submission.evaluate((el) => getComputedStyle(el).backgroundColor),
    'rgb(63, 107, 62)',
  );
  assert.equal(
    await heading
      .locator('..')
      .evaluate((el) => getComputedStyle(el).borderTopStyle),
    'dashed',
  );
  await noOverflow(creator);
  await screenshot(creator, 'my-actions-desktop');
  await creator.setViewportSize({ width: 375, height: 812 });
  await noOverflow(creator);
  await screenshot(creator, 'my-actions-mobile');
  await submission.click();
  await creator.waitForURL(`${base}/start`);

  const page = await pageFor(volunteer);
  await account(page);
  await page.getByRole('tab', { name: 'My actions', exact: true }).click();
  await page
    .getByRole('heading', {
      name: "You haven't created an action yet",
      exact: true,
    })
    .waitFor();
  assert.equal(
    await page
      .getByRole('button', { name: 'New submission', exact: true })
      .isDisabled(),
    true,
  );
  await screenshot(page, 'my-actions-volunteer');
  const topup = await request(
    page,
    '/api/topup',
    'POST',
    { nominal: 50000, metode: 'va' },
    201,
  );
  const registration = await request(
    page,
    `/api/projects/${project}/relawan`,
    'POST',
    {
      dataDiri: {
        nama: 'Private applicant data',
        telepon: '081234567890',
        kota: 'Bandung',
      },
      keahlian: ['Planting'],
      pengalaman: 'Community work',
      jadwal: ['Saturday'],
    },
    201,
  );
  const application = registration.pendaftaran.idPendaftaran;
  const ownerPage = await pageFor(owner);
  const otherPage = await pageFor(other);
  await request(
    otherPage,
    `/api/projects/${project}/relawan/${application}`,
    'PATCH',
    { keputusan: 'accepted' },
    403,
  );
  await account(page);
  await filter(page, 'Volunteering');
  await page
    .getByRole('button', {
      name: new RegExp(`Volunteer application: ${project}`),
    })
    .click();
  let dialog = page.getByRole('dialog', {
    name: 'Activity details',
    exact: true,
  });
  await dialog.getByText('Pending review', { exact: true }).waitFor();
  await page.keyboard.press('Escape');
  await request(
    ownerPage,
    `/api/projects/${project}/relawan/${application}`,
    'PATCH',
    { keputusan: 'accepted' },
  );
  await request(
    page,
    '/api/donasi',
    'POST',
    {
      jenisTujuan: 'project',
      idTujuan: project,
      nominal: 10000,
      idempotencyKey: randomUUID(),
    },
    201,
  );
  await request(
    otherPage,
    '/api/topup',
    'POST',
    { nominal: 25000, metode: 'qr' },
    201,
  );

  await account(page);
  const all = (await request(page, '/api/riwayat')).riwayat;
  assert.deepEqual(all.map((i) => i.jenis).sort(), [
    'progres',
    'relawan',
    'topup',
    'transaksi',
  ]);
  assert.ok(!JSON.stringify(all).includes('Private applicant data'));
  assert.ok(!JSON.stringify(all).includes('Private meeting point'));
  for (const jenis of ['transaksi', 'topup', 'relawan', 'progres']) {
    const items = (
      await request(page, `/api/riwayat?jenis=${jenis}&idPengguna=${other}`)
    ).riwayat;
    assert.equal(items.length, 1);
    assert.equal(items[0].jenis, jenis);
  }
  await request(page, '/api/riwayat?jenis=invalid', 'GET', undefined, 400);
  await filter(page, 'All');
  assert.equal(
    await page.locator('li button[aria-haspopup="dialog"]').count(),
    4,
  );
  await screenshot(page, 'history-all');
  await filter(page, 'Top-ups');
  assert.equal(
    await page.locator('li button[aria-haspopup="dialog"]').count(),
    1,
  );
  await page.getByRole('button', { name: /Balance top-up/ }).click();
  dialog = page.getByRole('dialog', { name: 'Activity details', exact: true });
  await dialog.getByText(topup.data.idTopup, { exact: true }).waitFor();
  await dialog
    .getByText('Bank transfer (simulated)', { exact: true })
    .waitFor();
  await dialog.getByText('Rp50,000', { exact: true }).waitFor();
  await screenshot(page, 'history-topup');
  await dialog.getByRole('button', { name: 'Close', exact: true }).click();
  await filter(page, 'Volunteering');
  await page
    .getByRole('button', {
      name: new RegExp(`Volunteer application: ${project}`),
    })
    .click();
  dialog = page.getByRole('dialog', { name: 'Activity details', exact: true });
  await dialog.getByText('Accepted', { exact: true }).waitFor();
  await dialog.getByText('Decision recorded', { exact: true }).waitFor();
  await screenshot(page, 'history-volunteering');
  assert.equal(
    await dialog
      .getByRole('link', { name: 'View project' })
      .getAttribute('href'),
    `/project/${project}`,
  );
  await page.keyboard.press('Escape');
  await filter(page, 'Donations');
  await page
    .getByRole('button', { name: new RegExp(`Donation to ${project}`) })
    .click();
  dialog = page.getByRole('dialog', { name: 'Activity details', exact: true });
  await dialog.getByText('Successful', { exact: true }).waitFor();
  assert.equal(
    await dialog
      .getByRole('link', { name: 'See use of funds' })
      .getAttribute('href'),
    `/project/${project}?tab=funds`,
  );
  await page.keyboard.press('Escape');
  await filter(page, 'Progress');
  await page.getByRole('button', { name: new RegExp(milestone) }).click();
  dialog = page.getByRole('dialog', { name: milestone, exact: true });
  await dialog.getByText('Progress note', { exact: true }).waitFor();
  assert.equal(await dialog.getByRole('link').count(), 1);
  assert.equal(
    await dialog
      .getByRole('link', { name: 'Open all updates' })
      .getAttribute('href'),
    `/project/${project}?tab=progress`,
  );
  assert.ok(!(await dialog.innerText()).includes('plots-a-b.jpg'));
  assert.ok(!(await dialog.innerText()).includes('attendance.pdf'));
  await screenshot(page, 'history-progress');
  const detail = await request(page, `/api/riwayat/progres/${progress}`);
  assert.equal(
    detail.progres.dokumentasi.length,
    2,
    'Data lampiran tetap utuh di API',
  );
  await page.setViewportSize({ width: 375, height: 812 });
  await noOverflow(page);
  await page.keyboard.press('Escape');
  for (const label of [
    'All',
    'Donations',
    'Top-ups',
    'Volunteering',
    'Progress',
  ]) {
    await filter(page, label);
    await noOverflow(page);
  }

  const otherHistory = (
    await request(otherPage, `/api/riwayat?idPengguna=${volunteer}`)
  ).riwayat;
  assert.equal(otherHistory.length, 1);
  assert.equal(otherHistory[0].jenis, 'topup');
  assert.notEqual(otherHistory[0].id, topup.data.idTopup);
  await request(
    otherPage,
    `/api/riwayat/progres/${progress}`,
    'GET',
    undefined,
    404,
  );
  await account(otherPage);
  await filter(otherPage, 'Volunteering');
  await otherPage
    .getByRole('heading', {
      name: 'No activity in this category yet',
      exact: true,
    })
    .waitFor();
  await otherPage
    .getByRole('button', { name: 'Show everything', exact: true })
    .click();
  await otherPage.getByRole('button', { name: /Balance top-up/ }).waitFor();
  const guest = await pageFor();
  for (const jenis of ['topup', 'relawan'])
    await request(guest, `/api/riwayat?jenis=${jenis}`, 'GET', undefined, 401);
  assert.deepEqual(errors, []);
  console.log(
    JSON.stringify({
      passed: true,
      scenarios: [
        'creator/volunteer empty state and role restrictions',
        'green submission link, dashed panel, desktop/mobile',
        'real top-up, volunteer registration and decision, donation',
        'all five filters and category details',
        'progress attachment chips hidden; API attachments retained',
        'owner isolation, spoofed owner query ignored, guest denial',
        'mobile filters/modals without overflow',
        'no browser pageerror',
      ],
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
    if (server) server.kill('SIGTERM');
    if (process.env.ACCOUNT_BROWSER_LOG)
      fs.writeFileSync(process.env.ACCOUNT_BROWSER_LOG, serverLog);
    if (db) {
      try {
        for (const id of ids) {
          await db.execute(
            'DELETE b FROM bukti_transaksi b JOIN transaksi_donasi t ON t.id_transaksi=b.id_transaksi WHERE t.id_donatur=?',
            [id],
          );
          await db.execute('DELETE FROM transaksi_donasi WHERE id_donatur=?', [
            id,
          ]);
          await db.execute('DELETE FROM topup_saldo WHERE id_donatur=?', [id]);
        }
        await db.execute('DELETE FROM project WHERE id_project=?', [project]);
        for (const id of ids)
          await db.execute('DELETE FROM pengguna WHERE id_pengguna=?', [id]);
      } finally {
        await db.end();
      }
    }
  });
