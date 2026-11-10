/**
 * Pengujian unit autentikasi UC01 (issue #13 dan #14), tanpa basis data.
 * Repository diganti versi di memori lewat konstruktor AutentikasiService.
 * Jalankan: npm test
 */
import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import type { Akun } from '@/models/Akun';
import type { PenggunaUmum } from '@/models/PenggunaUmum';
import type { SesiLogin } from '@/models/SesiLogin';
import { AutentikasiController } from '@/server/controllers/AutentikasiController';
import { gagal, TANPA_CACHE } from '@/server/controllers/respons';
import { cocokPassword, hashPassword } from '@/server/password';
import {
  AutentikasiService,
  type Ketergantungan,
  type UserRepo,
} from '@/server/services/AutentikasiService';
import { GalatAplikasi } from '@/shared/galatDonasi';
import { DURASI_SESI_MS } from '@/shared/konstanta';

const SEKARANG = new Date('2026-11-09T08:00:00Z');

/** Repository palsu: menyimpan akun dan sesi di Map, mencatat setiap panggilan. */
function repoPalsu() {
  const akun = new Map<string, { akun: Akun; pengguna: PenggunaUmum }>();
  const sesi = new Map<string, SesiLogin>();
  const panggilan: string[] = [];
  const repo: UserRepo = {
    async hitungEmail(email) {
      panggilan.push('hitungEmail');
      return akun.has(email) ? 1 : 0;
    },
    async simpanAkunBaru(pengguna, a) {
      panggilan.push('simpanAkunBaru');
      akun.set(a.email, { akun: a, pengguna });
    },
    async cariAkunByEmail(email) {
      panggilan.push('cariAkunByEmail');
      return akun.get(email) ?? null;
    },
    async simpanSesi(s) {
      panggilan.push('simpanSesi');
      sesi.set(s.idSesi, s);
    },
    async cariSesi(idSesi) {
      const s = sesi.get(idSesi);
      if (!s) return null;
      const pemilik = [...akun.values()].find(
        (x) => x.pengguna.idPengguna === s.idPengguna,
      );
      if (!pemilik) return null;
      return {
        sesi: s,
        pengguna: pemilik.pengguna,
        statusAkun: pemilik.akun.statusAkun,
      };
    },
    async akhiriSesi(idSesi) {
      panggilan.push('akhiriSesi');
      const s = sesi.get(idSesi);
      if (s) s.statusSesi = 'berakhir';
    },
  };
  return { repo, akun, sesi, panggilan };
}

/** hash cepat agar pengujian tidak menunggu bcrypt; KF03 diuji terpisah dengan bcrypt asli. */
function buatService(dep: Partial<Ketergantungan> = {}) {
  const palsu = repoPalsu();
  let jam = SEKARANG;
  const service = new AutentikasiService({
    repo: palsu.repo,
    sekarang: () => jam,
    hash: async (p) => `hash:${p}`,
    cocok: async (p, h) => h === `hash:${p}`,
    ...dep,
  });
  return {
    service,
    ...palsu,
    majukanWaktu: (ms: number) => {
      jam = new Date(jam.getTime() + ms);
    },
  };
}

const DATA_DAFTAR = {
  nama: 'Budi Santoso',
  email: 'Budi@Mail.com ',
  password: 'rahasia123',
};

async function galatDari(janji: Promise<unknown>): Promise<GalatAplikasi> {
  try {
    await janji;
  } catch (e) {
    assert.ok(e instanceof GalatAplikasi, `bukan GalatAplikasi: ${String(e)}`);
    return e;
  }
  assert.fail('seharusnya melempar galat');
}

describe('Registrasi akun (issue #13, KF01-KF03)', () => {
  it('berhasil: akun tersimpan sebagai volunteer dengan email dinormalisasi', async () => {
    const { service, akun } = buatService();
    const pengguna = await service.daftarAkun(DATA_DAFTAR);

    assert.equal(pengguna.nama, 'Budi Santoso');
    assert.equal(pengguna.email, 'budi@mail.com');
    assert.equal(pengguna.peran, 'volunteer');
    const tersimpan = akun.get('budi@mail.com');
    assert.ok(tersimpan, 'akun tersimpan');
    assert.equal(tersimpan.akun.statusAkun, 'aktif');
    assert.notEqual(tersimpan.akun.passwordHash, DATA_DAFTAR.password);
  });

  it('berhasil: respons API 201 tanpa password maupun hash (KF03)', async () => {
    const { service } = buatService();
    const controller = new AutentikasiController(service);
    const res = await controller.daftarAkun(
      new Request('http://localhost/api/auth/daftar', {
        method: 'POST',
        body: JSON.stringify(DATA_DAFTAR),
      }),
    );
    assert.equal(res.status, 201);
    const teks = await res.text();
    const isi = JSON.parse(teks);
    assert.equal(isi.ok, true);
    assert.equal(isi.data.email, 'budi@mail.com');
    for (const terlarang of ['password', 'Hash', DATA_DAFTAR.password]) {
      assert.ok(!teks.includes(terlarang), `respons memuat "${terlarang}"`);
    }
  });

  it('password disimpan sebagai hash bcrypt cost 12 (KF03)', async () => {
    const hash = await hashPassword('rahasia123');
    assert.match(hash, /^\$2[aby]\$12\$/);
    assert.equal(await cocokPassword('rahasia123', hash), true);
    assert.equal(await cocokPassword('salah12345', hash), false);
  });

  it('email sudah terdaftar ditolak, termasuk beda huruf besar/spasi (KF02)', async () => {
    const { service, panggilan } = buatService();
    await service.daftarAkun(DATA_DAFTAR);

    const g = await galatDari(
      service.daftarAkun({ ...DATA_DAFTAR, email: '  BUDI@mail.COM' }),
    );
    assert.equal(g.kode, 'EMAIL_TERPAKAI');
    assert.equal(g.bidang, 'email');
    assert.equal(
      panggilan.filter((p) => p === 'simpanAkunBaru').length,
      1,
      'akun kedua tidak disimpan',
    );
  });

  it('email terpakai menjadi 409 di API dengan bidang email', async () => {
    const { service } = buatService();
    await service.daftarAkun(DATA_DAFTAR);
    const res = await new AutentikasiController(service).daftarAkun(
      new Request('http://localhost/api/auth/daftar', {
        method: 'POST',
        body: JSON.stringify(DATA_DAFTAR),
      }),
    );
    assert.equal(res.status, 409);
    const isi = await res.json();
    assert.equal(isi.kode, 'EMAIL_TERPAKAI');
    assert.equal(isi.bidang, 'email');
  });

  it('input tidak lengkap ditolak per kolom tanpa menyentuh database (KF01)', async () => {
    const kasus = [
      { masukan: { ...DATA_DAFTAR, nama: '' }, bidang: 'nama' },
      { masukan: { ...DATA_DAFTAR, nama: '  Al ' }, bidang: 'nama' },
      { masukan: { ...DATA_DAFTAR, email: '' }, bidang: 'email' },
      { masukan: { ...DATA_DAFTAR, email: 'budi@mail' }, bidang: 'email' },
      { masukan: { ...DATA_DAFTAR, password: '' }, bidang: 'password' },
      { masukan: { ...DATA_DAFTAR, password: '1234567' }, bidang: 'password' },
    ];
    for (const { masukan, bidang } of kasus) {
      const { service, panggilan } = buatService();
      const g = await galatDari(service.daftarAkun(masukan));
      assert.equal(g.kode, 'VALIDASI', JSON.stringify(masukan));
      assert.equal(g.bidang, bidang, JSON.stringify(masukan));
      assert.deepEqual(panggilan, [], 'repository tidak dipanggil');
    }
  });

  it('body kosong atau bukan JSON menjadi 400 dengan bidang, bukan 500', async () => {
    const { service } = buatService();
    const controller = new AutentikasiController(service);
    for (const body of ['', 'bukan json', '[]']) {
      const res = await controller.daftarAkun(
        new Request('http://localhost/api/auth/daftar', {
          method: 'POST',
          body,
        }),
      );
      assert.equal(res.status, 400, `body ${JSON.stringify(body)}`);
      const isi = await res.json();
      assert.equal(isi.kode, 'VALIDASI');
      assert.equal(isi.bidang, 'nama');
    }
  });
});

describe('Login, sesi, dan akses (issue #14, KF04)', () => {
  async function siapLogin(dep: Partial<Ketergantungan> = {}) {
    const ctx = buatService(dep);
    await ctx.service.daftarAkun(DATA_DAFTAR);
    return ctx;
  }

  it('kredensial benar membuat sesi aktif 24 jam dengan id acak', async () => {
    const { service, sesi } = await siapLogin();
    const hasil = await service.login({
      email: 'BUDI@mail.com',
      password: DATA_DAFTAR.password,
    });

    assert.equal(hasil.pengguna.email, 'budi@mail.com');
    assert.match(hasil.sesi.idSesi, /^[0-9a-f]{64}$/);
    assert.equal(hasil.sesi.statusSesi, 'aktif');
    assert.equal(
      hasil.sesi.waktuKedaluwarsa.getTime() - SEKARANG.getTime(),
      DURASI_SESI_MS,
    );
    assert.ok(sesi.has(hasil.sesi.idSesi), 'sesi tersimpan');
  });

  it('password salah dan email tak terdaftar memberi galat yang sama persis', async () => {
    const { service, panggilan } = await siapLogin();
    const salahPassword = await galatDari(
      service.login({ email: DATA_DAFTAR.email, password: 'salah12345' }),
    );
    const tidakAda = await galatDari(
      service.login({ email: 'siapa@mail.com', password: 'salah12345' }),
    );

    assert.equal(salahPassword.kode, 'KREDENSIAL_SALAH');
    assert.deepEqual(
      [tidakAda.kode, tidakAda.message, tidakAda.bidang],
      [salahPassword.kode, salahPassword.message, salahPassword.bidang],
    );
    assert.ok(!panggilan.includes('simpanSesi'), 'tidak ada sesi dibuat');
  });

  it('email tak terdaftar tetap membandingkan password (waktu respons seragam)', async () => {
    const dibandingkan: (string | null)[] = [];
    const { service } = await siapLogin({
      cocok: async (_p, h) => {
        dibandingkan.push(h);
        return false;
      },
    });
    await galatDari(
      service.login({ email: 'siapa@mail.com', password: 'apa saja' }),
    );
    assert.deepEqual(dibandingkan, [null]);
  });

  it('akun nonaktif ditolak dengan galat yang sama seperti kredensial salah (Algo-003)', async () => {
    const { service, akun, panggilan } = await siapLogin();
    const salahPassword = await galatDari(
      service.login({ email: DATA_DAFTAR.email, password: 'salah12345' }),
    );
    akun.get('budi@mail.com')!.akun.statusAkun = 'nonaktif';
    const nonaktif = await galatDari(service.login(DATA_DAFTAR));
    assert.deepEqual(
      [nonaktif.kode, nonaktif.message, nonaktif.bidang],
      [salahPassword.kode, salahPassword.message, salahPassword.bidang],
    );
    assert.ok(!panggilan.includes('simpanSesi'), 'tidak ada sesi dibuat');
  });

  it('akun nonaktif tetap membandingkan password (waktu respons seragam)', async () => {
    let dibandingkan = 0;
    const { service, akun } = await siapLogin({
      cocok: async (p, h) => {
        dibandingkan++;
        return h === `hash:${p}`;
      },
    });
    akun.get('budi@mail.com')!.akun.statusAkun = 'nonaktif';
    await galatDari(service.login(DATA_DAFTAR));
    assert.equal(dibandingkan, 1);
  });

  it('kolom login kosong ditolak per kolom sebelum menyentuh database', async () => {
    const { service, panggilan } = buatService();
    const tanpaEmail = await galatDari(
      service.login({ email: ' ', password: 'x' }),
    );
    const tanpaPassword = await galatDari(
      service.login({ email: 'budi@mail.com', password: '' }),
    );
    assert.equal(tanpaEmail.bidang, 'email');
    assert.equal(tanpaPassword.bidang, 'password');
    assert.deepEqual(panggilan, []);
  });

  it('sesi valid dikenali; tanpa cookie atau id tak dikenal dianggap tamu', async () => {
    const { service } = await siapLogin();
    const { sesi } = await service.login(DATA_DAFTAR);

    assert.equal(
      (await service.penggunaDariSesi(sesi.idSesi))?.email,
      'budi@mail.com',
    );
    assert.equal(await service.penggunaDariSesi(undefined), null);
    assert.equal(await service.penggunaDariSesi('id-palsu'), null);
  });

  it('sesi kedaluwarsa tidak dikenali dan ditandai berakhir (Algo-005, Q-006)', async () => {
    const ctx = await siapLogin();
    const { sesi } = await ctx.service.login(DATA_DAFTAR);
    ctx.majukanWaktu(DURASI_SESI_MS - 1);
    assert.notEqual(await ctx.service.penggunaDariSesi(sesi.idSesi), null);
    assert.equal(ctx.sesi.get(sesi.idSesi)?.statusSesi, 'aktif');

    ctx.majukanWaktu(1);
    assert.equal(await ctx.service.penggunaDariSesi(sesi.idSesi), null);
    assert.equal(ctx.sesi.get(sesi.idSesi)?.statusSesi, 'berakhir');

    // Sudah berakhir: pemeriksaan berikutnya tidak menulis ulang ke basis data.
    const hitung = () => ctx.panggilan.filter((p) => p === 'akhiriSesi').length;
    const sebelum = hitung();
    assert.equal(await ctx.service.penggunaDariSesi(sesi.idSesi), null);
    assert.equal(hitung(), sebelum);
  });

  it('logout mengakhiri sesi dan aman dipanggil ulang atau tanpa sesi', async () => {
    const { service } = await siapLogin();
    const { sesi } = await service.login(DATA_DAFTAR);

    await service.logout(sesi.idSesi);
    assert.equal(await service.penggunaDariSesi(sesi.idSesi), null);
    await service.logout(sesi.idSesi);
    await service.logout(undefined);
  });

  it('akun yang dinonaktifkan kehilangan sesi aktifnya', async () => {
    const { service, akun } = await siapLogin();
    const { sesi } = await service.login(DATA_DAFTAR);
    akun.get('budi@mail.com')!.akun.statusAkun = 'nonaktif';
    assert.equal(await service.penggunaDariSesi(sesi.idSesi), null);
  });

  it('pastikanPeran menolak peran yang tidak diizinkan (requireRole)', async () => {
    const { service } = await siapLogin();
    const { pengguna } = await service.login(DATA_DAFTAR);

    assert.doesNotThrow(() =>
      service.pastikanPeran(pengguna, ['volunteer', 'admin']),
    );
    const g = await galatDari(
      Promise.resolve().then(() => service.pastikanPeran(pengguna, ['admin'])),
    );
    assert.equal(g.kode, 'DILARANG');
  });
});

describe('Respons galat (respons.ts)', () => {
  it('header tambahan (Cache-Control) tetap dikirim pada galat aplikasi dan galat tak terduga', () => {
    const dikenal = gagal(new GalatAplikasi('BELUM_LOGIN'), TANPA_CACHE);
    assert.equal(dikenal.status, 401);
    assert.equal(dikenal.headers.get('Cache-Control'), 'private, no-store');

    const asli = console.error;
    console.error = () => {};
    try {
      const takTerduga = gagal(new Error('x'), TANPA_CACHE);
      assert.equal(takTerduga.status, 500);
      assert.equal(
        takTerduga.headers.get('Cache-Control'),
        'private, no-store',
      );
    } finally {
      console.error = asli;
    }
  });

  it('galat dengan kolom membawa `bidang`; tanpa kolom tidak ada `bidang`', async () => {
    const denganKolom = await gagal(
      new GalatAplikasi('VALIDASI', 'Enter your email.', 'email'),
    ).json();
    assert.deepEqual(denganKolom, {
      ok: false,
      kode: 'VALIDASI',
      pesan: 'Enter your email.',
      bidang: 'email',
    });
    const tanpaKolom = await gagal(new GalatAplikasi('BELUM_LOGIN')).json();
    assert.ok(!('bidang' in tanpaKolom));
  });
});
