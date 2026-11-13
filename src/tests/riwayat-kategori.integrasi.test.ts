import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { after, before, describe, it } from 'node:test';
import { execute, getPool } from '@/server/db';
import { riwayatPengguna } from '@/server/services/riwayatService';

const aktif = /test/i.test(process.env.DB_NAME ?? '');
const suffix = randomUUID().slice(0, 8);
const owner = `hist-owner-${suffix}`,
  other = `hist-other-${suffix}`;
const project = `hist-project-${suffix}`;
const topup = `hist-topup-${suffix}`,
  topupOther = `hist-topup-b-${suffix}`;
const application = `hist-apply-${suffix}`,
  applicationOther = `hist-apply-b-${suffix}`;

describe(
  'kategori Top-ups dan Volunteering memakai data milik sesi',
  { skip: !aktif },
  () => {
    before(async () => {
      assert.match(process.env.DB_NAME ?? '', /test/i);
      for (const id of [owner, other]) {
        await execute(
          "INSERT INTO pengguna (id_pengguna,nama,peran) VALUES (?,?,'volunteer')",
          [id, id],
        );
        await execute('INSERT INTO donatur (id_donatur,saldo) VALUES (?,0)', [
          id,
        ]);
      }
      await execute(
        "INSERT INTO project (id_project,id_pembuat,nama,deskripsi,provinsi,kota,status,lokasi_kumpul) VALUES (?,?,'History project','test','Bali','Tabanan','terpublikasi','Private meeting point')",
        [project, owner],
      );
      for (const [id, user] of [
        [topup, owner],
        [topupOther, other],
      ]) {
        await execute(
          "INSERT INTO topup_saldo (id_topup,id_donatur,nominal,metode,waktu) VALUES (?,?,50000,'Bank transfer (simulated)','2026-11-13 11:00:00')",
          [id, user],
        );
      }
      for (const [id, user] of [
        [application, owner],
        [applicationOther, other],
      ]) {
        await execute(
          "INSERT INTO pendaftaran_relawan (id_pendaftaran,id_volunteer,id_project,data_diri,tanggal_daftar) VALUES (?,?,?,'Private applicant data','2026-11-13 10:00:00')",
          [id, user, project],
        );
      }
    });
    after(async () => {
      for (const id of [owner, other])
        await execute('DELETE FROM topup_saldo WHERE id_donatur=?', [id]);
      await execute('DELETE FROM project WHERE id_project=?', [project]);
      for (const id of [owner, other])
        await execute('DELETE FROM pengguna WHERE id_pengguna=?', [id]);
      await getPool().end();
    });
    it('All menggabungkan top-up dan pendaftaran sendiri, terbaru lebih dulu', async () => {
      const items = await riwayatPengguna(owner, 'semua');
      assert.deepEqual(
        items.map((item) => item.id),
        [topup, application],
      );
      assert.ok(!JSON.stringify(items).includes('Private applicant data'));
      assert.ok(!JSON.stringify(items).includes('Private meeting point'));
    });
    it('Top-ups hanya mengembalikan penambahan saldo milik pengguna', async () => {
      const items = await riwayatPengguna(owner, 'topup');
      assert.equal(items.length, 1);
      assert.equal(items[0].jenis, 'topup');
      if (items[0].jenis === 'topup') {
        assert.equal(items[0].nominal, 50000);
        assert.equal(items[0].metode, 'Bank transfer (simulated)');
      }
    });
    it('Volunteering menampilkan status keputusan terbaru tanpa data orang lain', async () => {
      await execute(
        "UPDATE pendaftaran_relawan SET status_pendaftaran='accepted',tanggal_keputusan='2026-11-13 12:00:00' WHERE id_pendaftaran=?",
        [application],
      );
      const items = await riwayatPengguna(owner, 'relawan');
      assert.equal(items.length, 1);
      assert.equal(items[0].id, application);
      assert.equal(items[0].jenis, 'relawan');
      if (items[0].jenis === 'relawan') {
        assert.equal(items[0].status, 'accepted');
        assert.equal(items[0].tanggalKeputusan, '2026-11-13T12:00:00.000Z');
      }
    });
    it('pengguna lain mendapat riwayatnya sendiri, bukan punya pemilik pertama', async () => {
      const items = await riwayatPengguna(other, 'semua');
      assert.deepEqual(
        items.map((item) => item.id),
        [topupOther, applicationOther],
      );
    });
    it('tamu tetap ditolak sebelum akses data', async () => {
      await assert.rejects(riwayatPengguna(null, 'topup'), { status: 401 });
      await assert.rejects(riwayatPengguna(null, 'relawan'), { status: 401 });
    });
  },
);
