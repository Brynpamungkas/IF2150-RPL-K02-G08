/** Opt-in: AKSI_TEST_DB=1 dan DB_* wajib menunjuk database pengujian terisolasi. */
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { after, before, describe, it } from 'node:test';
import { execute, getPool } from '@/server/db';
import { buatCampaign } from '@/server/controllers/CampaignController';
import { buatProject } from '@/server/controllers/ProjectController';
import { kelolaAksi, milikSaya } from '@/server/controllers/AksiController';
import {
  ajukan,
  antrean,
  putuskan,
} from '@/server/controllers/VerifikasiController';
import type { Aksi } from '@/shared/aksi';
import { hariIniWib } from '@/shared/validasiAksi';

const aktif = process.env.AKSI_TEST_DB === '1';
const tanda = randomUUID().slice(0, 8);
const pemilik = `aksi-owner-${tanda}`;
const lain = `aksi-other-${tanda}`;
const admin = `aksi-admin-${tanda}`;
const relawan = `aksi-vol-${tanda}`;
const semua = [pemilik, lain, admin, relawan];
const data = {
  judul: 'Aksi integrasi',
  deskripsi: 'Deskripsi',
  tujuan: 'Tujuan',
  provinsi: 'Bali',
  kota: 'Tabanan',
  targetDana: 10000,
  mulai: hariIniWib(),
  selesai: hariIniWib(new Date(Date.now() + 30 * 86400000)),
  kebutuhan: 'Sarung tangan',
  kriteriaRelawan: 'Siap berkegiatan',
  kuotaRelawan: 5,
  lokasiKumpul: 'Balai desa',
  rincianDana: [{ uraian: 'Peralatan', nominal: 10000 }],
};
function request(id?: string, badan?: unknown, extra?: Record<string, string>) {
  return new Request('http://localhost/api/test', {
    method: badan === undefined ? 'GET' : 'POST',
    headers: {
      ...(id ? { cookie: `klimpool_sesi=${id}` } : {}),
      'content-type': 'application/json',
      ...extra,
    },
    ...(badan !== undefined ? { body: JSON.stringify(badan) } : {}),
  });
}
async function hasil(response: Response, status = 200): Promise<Aksi> {
  const body = await response.json();
  assert.equal(response.status, status, JSON.stringify(body));
  return body.aksi;
}
const baru = (
  jenis: 'campaign' | 'project' = 'campaign',
  badan: unknown = data,
) =>
  (jenis === 'campaign' ? buatCampaign : buatProject)(
    request(pemilik, badan),
  ).then((r) => hasil(r, 201));

describe(
  'Aksi API + database (sesi, kepemilikan, transisi dan konkurensi)',
  { skip: !aktif },
  () => {
    before(async () => {
      assert.match(
        process.env.DB_NAME ?? '',
        /test/i,
        'Gunakan database khusus test.',
      );
      for (const id of semua) {
        await execute(
          'INSERT INTO pengguna (id_pengguna, nama, peran) VALUES (?, ?, ?)',
          [
            id,
            id,
            id === admin
              ? 'admin'
              : id === relawan
                ? 'volunteer'
                : 'pembuat_project',
          ],
        );
        await execute(
          "INSERT INTO akun (id_akun, id_pengguna, email, password_hash) VALUES (?, ?, ?, 'not-a-password')",
          [id, id, `${id}@example.invalid`],
        );
        await execute(
          `INSERT INTO sesi_login (id_sesi, id_pengguna, waktu_mulai, waktu_kedaluwarsa)
        VALUES (?, ?, UTC_TIMESTAMP(), DATE_ADD(UTC_TIMESTAMP(), INTERVAL 1 HOUR))`,
          [id, id],
        );
      }
    });
    after(async () => {
      for (const id of semua) {
        await execute('DELETE FROM campaign WHERE id_pembuat = ?', [id]);
        await execute('DELETE FROM project WHERE id_pembuat = ?', [id]);
        await execute('DELETE FROM pengguna WHERE id_pengguna = ?', [id]);
      }
      await getPool().end();
    });
    it('menolak tanpa sesi, dev cookie, peran keliru, asal lintas situs, sesi usang/nonaktif', async () => {
      assert.equal((await buatCampaign(request(undefined, data))).status, 401);
      assert.equal(
        (
          await buatCampaign(
            request(undefined, data, {
              cookie: `klimpool_dev_user=${pemilik}`,
            }),
          )
        ).status,
        401,
      );
      for (const id of [relawan, admin])
        assert.equal((await buatCampaign(request(id, data))).status, 403);
      assert.equal(
        (
          await buatCampaign(
            request(pemilik, data, { origin: 'https://evil.invalid' }),
          )
        ).status,
        403,
      );
      assert.equal(
        (
          await buatCampaign(
            request(pemilik, data, { 'sec-fetch-site': 'cross-site' }),
          )
        ).status,
        403,
      );
      await execute(
        'UPDATE sesi_login SET waktu_kedaluwarsa = UTC_TIMESTAMP() WHERE id_sesi = ?',
        [lain],
      );
      assert.equal((await buatCampaign(request(lain, data))).status, 401);
      await execute(
        "UPDATE sesi_login SET waktu_kedaluwarsa = DATE_ADD(UTC_TIMESTAMP(), INTERVAL 1 HOUR), status_sesi = 'aktif' WHERE id_sesi = ?",
        [lain],
      );
      await execute(
        "UPDATE akun SET status_akun = 'nonaktif' WHERE id_pengguna = ?",
        [lain],
      );
      assert.equal((await buatCampaign(request(lain, data))).status, 401);
      await execute(
        "UPDATE akun SET status_akun = 'aktif' WHERE id_pengguna = ?",
        [lain],
      );
    });
    it('pemilik/status server, edit hanya pemilik dan daftar tidak bocor ke pembuat lain', async () => {
      const aksi = await baru('campaign', {
        ...data,
        idPembuat: lain,
        status: 'terpublikasi',
      });
      assert.equal(aksi.idPembuat, pemilik);
      assert.equal(aksi.status, 'draft');
      assert.equal(
        (await kelolaAksi(request(lain), 'campaign', aksi.id)).status,
        404,
      );
      assert.equal(
        (await kelolaAksi(request(lain, data), 'campaign', aksi.id, true))
          .status,
        404,
      );
      assert.equal(
        (await ajukan(request(lain, {}), 'campaign', aksi.id)).status,
        404,
      );
      const diubah = await hasil(
        await kelolaAksi(
          request(pemilik, { judul: 'Judul baru' }),
          'campaign',
          aksi.id,
          true,
        ),
      );
      assert.equal(diubah.judul, 'Judul baru');
      assert.deepEqual(diubah.rincianDana, data.rincianDana);
      const daftar = await (await milikSaya(request(lain))).json();
      assert.deepEqual(daftar.aksi, []);
      assert.equal((await antrean(request(pemilik))).status, 403);
      assert.equal(
        (
          await putuskan(
            request(pemilik, { keputusan: 'setujui' }),
            'campaign',
            aksi.id,
          )
        ).status,
        403,
      );
    });
    it('project dua tahap menyimpan ID, mempertahankan kebutuhan saat kembali, dan memvalidasi sebelum diajukan', async () => {
      const aksi = await baru('project', {
        judul: data.judul,
        deskripsi: data.deskripsi,
        tujuan: data.tujuan,
        provinsi: data.provinsi,
        kota: data.kota,
        tahap: 'informasi',
      });
      assert.ok(aksi.id);
      assert.equal(aksi.mulai, null);
      assert.equal(
        (await ajukan(request(pemilik, {}), 'project', aksi.id)).status,
        400,
      );
      const lengkap = await hasil(
        await kelolaAksi(request(pemilik, data), 'project', aksi.id, true),
      );
      assert.equal(lengkap.id, aksi.id);
      const kembali = await hasil(
        await kelolaAksi(
          request(pemilik, { judul: 'Revisi', tahap: 'informasi' }),
          'project',
          aksi.id,
          true,
        ),
      );
      assert.equal(kembali.kebutuhan, data.kebutuhan);
      assert.equal(kembali.lokasiKumpul, data.lokasiKumpul);
      const terkirim = await hasil(
        await ajukan(request(pemilik, {}), 'project', aksi.id),
      );
      assert.equal(terkirim.status, 'menunggu_verifikasi');
      assert.ok(terkirim.tanggalPengajuan);
      assert.equal(
        (await kelolaAksi(request(pemilik, data), 'project', aksi.id, true))
          .status,
        409,
      );
    });
    it('antrean pending saja, penolakan wajib alasan, revisi dan pengajuan ulang lalu publikasi', async () => {
      const aksi = await baru();
      await hasil(await ajukan(request(pemilik, {}), 'campaign', aksi.id));
      const antre = await (await antrean(request(admin))).json();
      assert.ok(antre.aksi.some((a: Aksi) => a.id === aksi.id));
      assert.ok(
        antre.aksi.every((a: Aksi) => a.status === 'menunggu_verifikasi'),
      );
      assert.equal(
        (
          await putuskan(
            request(admin, { keputusan: 'tolak', alasan: ' ' }),
            'campaign',
            aksi.id,
          )
        ).status,
        400,
      );
      const ditolak = await hasil(
        await putuskan(
          request(admin, { keputusan: 'tolak', alasan: 'Perjelas kebutuhan' }),
          'campaign',
          aksi.id,
        ),
      );
      assert.equal(ditolak.status, 'ditolak');
      assert.equal(ditolak.alasanPenolakan, 'Perjelas kebutuhan');
      await hasil(
        await kelolaAksi(
          request(pemilik, { kebutuhan: 'Lebih rinci' }),
          'campaign',
          aksi.id,
          true,
        ),
      );
      const ulang = await hasil(
        await ajukan(request(pemilik, {}), 'campaign', aksi.id),
      );
      assert.equal(ulang.alasanPenolakan, null);
      assert.equal(ulang.tanggalVerifikasi, null);
      const publik = await hasil(
        await putuskan(
          request(admin, { keputusan: 'setujui' }),
          'campaign',
          aksi.id,
        ),
      );
      assert.equal(publik.status, 'terpublikasi');
      assert.ok(publik.tanggalVerifikasi);
      assert.equal(
        (await kelolaAksi(request(pemilik, data), 'campaign', aksi.id, true))
          .status,
        409,
      );
      assert.equal(
        (await ajukan(request(pemilik, {}), 'campaign', aksi.id)).status,
        409,
      );
    });
    it('dua pengajuan/keputusan bersamaan hanya mengubah status sekali', async () => {
      const aksi = await baru();
      const kirim = await Promise.all([
        ajukan(request(pemilik, {}), 'campaign', aksi.id),
        ajukan(request(pemilik, {}), 'campaign', aksi.id),
      ]);
      assert.deepEqual(kirim.map((r) => r.status).sort(), [200, 409]);
      const putusan = await Promise.all([
        putuskan(request(admin, { keputusan: 'setujui' }), 'campaign', aksi.id),
        putuskan(
          request(admin, { keputusan: 'tolak', alasan: 'Revisi' }),
          'campaign',
          aksi.id,
        ),
      ]);
      assert.deepEqual(putusan.map((r) => r.status).sort(), [200, 409]);
    });
    it('badan JSON rusak dan parameter berbahaya ditolak tanpa SQL dari input', async () => {
      const rusak = new Request('http://localhost/api/campaigns', {
        method: 'POST',
        headers: { cookie: `klimpool_sesi=${pemilik}` },
        body: '{',
      });
      assert.equal((await buatCampaign(rusak)).status, 400);
      assert.equal(
        (
          await kelolaAksi(
            request(pemilik),
            'campaign; DROP TABLE campaign',
            'id',
          )
        ).status,
        404,
      );
      assert.equal(
        (await kelolaAksi(request(pemilik), 'campaign', "x' OR 1=1")).status,
        404,
      );
    });
  },
);
