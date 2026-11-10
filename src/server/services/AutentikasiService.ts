import { randomUUID } from 'node:crypto';
import { cookies } from 'next/headers';
import {
  formatEmailValid,
  normalisasiEmail,
  PESAN_EMAIL_SALAH,
  validasiKelengkapanInput,
  type Akun,
} from '@/models/Akun';
import type { PenggunaUmum } from '@/models/PenggunaUmum';
import { buatSesi, cekStatusLogin, type SesiLogin } from '@/models/SesiLogin';
import { cocokPassword, hashPassword } from '@/server/password';
import { UserRepository } from '@/server/repositories/UserRepository';
import { NAMA_COOKIE_SESI } from '@/server/sesi';
import type {
  MasukanDaftarDto,
  MasukanLoginDto,
  Peran,
} from '@/shared/autentikasi';
import { GalatAplikasi } from '@/shared/galatDonasi';

/** Bagian repository yang dipakai service; memudahkan pengujian tanpa database. */
export type UserRepo = Pick<
  UserRepository,
  | 'hitungEmail'
  | 'simpanAkunBaru'
  | 'cariAkunByEmail'
  | 'simpanSesi'
  | 'cariSesi'
  | 'akhiriSesi'
>;

export interface Ketergantungan {
  repo: UserRepo;
  sekarang: () => Date;
  hash: (password: string) => Promise<string>;
  cocok: (password: string, hash: string | null) => Promise<boolean>;
}

export interface PenggunaLogin {
  idPengguna: string;
}

const bawaan = (): Ketergantungan => ({
  repo: new UserRepository(),
  sekarang: () => new Date(),
  hash: hashPassword,
  cocok: cocokPassword,
});

const PESAN_LOGIN_SALAH =
  "The email or password doesn't match. Check them and try again.";

export class AutentikasiService {
  private readonly dep: Ketergantungan;

  constructor(dep: Partial<Ketergantungan> = {}) {
    this.dep = { ...bawaan(), ...dep };
  }

  /**
   * Kontrak yang dipakai alur donasi (DonasiController): id pengguna pemilik
   * cookie sesi, atau galat BELUM_LOGIN bila cookie kosong, tidak dikenal,
   * berakhir, kedaluwarsa, atau akun nonaktif.
   */
  static async wajibLogin(): Promise<PenggunaLogin> {
    const jar = await cookies();
    const pengguna = await new AutentikasiService().penggunaDariSesi(
      jar.get(NAMA_COOKIE_SESI)?.value,
    );
    if (!pengguna) throw new GalatAplikasi('BELUM_LOGIN');
    return { idPengguna: pengguna.idPengguna };
  }

  /** Daftar akun baru berperan volunteer. */
  async daftarAkun(masukan: MasukanDaftarDto): Promise<PenggunaUmum> {
    validasiKelengkapanInput(masukan.nama, masukan.email, masukan.password);
    const email = normalisasiEmail(masukan.email);

    if ((await this.dep.repo.hitungEmail(email)) > 0) {
      throw new GalatAplikasi(
        'EMAIL_TERPAKAI',
        'This email is already registered.',
        'email',
      );
    }

    const sekarang = this.dep.sekarang();
    const idPengguna = randomUUID();
    const pengguna: PenggunaUmum = {
      idPengguna,
      nama: masukan.nama.trim(),
      email,
      peran: 'volunteer',
      saldo: 0,
    };
    const akun: Akun = {
      idAkun: randomUUID(),
      idPengguna,
      email,
      passwordHash: await this.dep.hash(masukan.password),
      statusAkun: 'aktif',
      tanggalDibuat: sekarang,
    };
    await this.dep.repo.simpanAkunBaru(pengguna, akun);
    return pengguna;
  }

  /**
   * Verifikasi kredensial lalu buat sesi (Algo-003). Email tidak terdaftar,
   * akun nonaktif, dan password salah memberi galat yang sama agar tidak
   * membocorkan email mana yang terdaftar. Password selalu dibandingkan
   * (dengan hash tiruan bila email tidak ada) supaya waktu tanggap seragam.
   */
  async login(
    masukan: MasukanLoginDto,
  ): Promise<{ sesi: SesiLogin; pengguna: PenggunaUmum }> {
    const email = normalisasiEmail(masukan.email);
    if (email === '') {
      throw new GalatAplikasi('VALIDASI', 'Enter your email.', 'email');
    }
    if (!formatEmailValid(email)) {
      throw new GalatAplikasi('VALIDASI', PESAN_EMAIL_SALAH, 'email');
    }
    if (masukan.password === '') {
      throw new GalatAplikasi('VALIDASI', 'Enter your password.', 'password');
    }

    const ditemukan = await this.dep.repo.cariAkunByEmail(email);
    const cocok = await this.dep.cocok(
      masukan.password,
      ditemukan?.akun.passwordHash ?? null,
    );
    if (!ditemukan || ditemukan.akun.statusAkun !== 'aktif' || !cocok) {
      throw new GalatAplikasi('KREDENSIAL_SALAH', PESAN_LOGIN_SALAH);
    }

    const sesi = buatSesi(ditemukan.pengguna.idPengguna, this.dep.sekarang());
    await this.dep.repo.simpanSesi(sesi);
    return { sesi, pengguna: ditemukan.pengguna };
  }

  /**
   * cekStatusLogin (Algo-005): pengguna pemilik sesi, atau null bila sesi tidak
   * ada, berakhir, kedaluwarsa, atau akun nonaktif. Sesi aktif yang sudah
   * kedaluwarsa ditandai berakhir (Q-006) agar tidak diperiksa ulang.
   */
  async penggunaDariSesi(
    idSesi: string | undefined,
  ): Promise<PenggunaUmum | null> {
    if (!idSesi) return null;
    const ditemukan = await this.dep.repo.cariSesi(idSesi);
    if (!ditemukan) return null;
    const { sesi } = ditemukan;
    if (!cekStatusLogin(sesi, this.dep.sekarang())) {
      if (sesi.statusSesi === 'aktif') {
        await this.dep.repo.akhiriSesi(sesi.idSesi);
      }
      return null;
    }
    if (ditemukan.statusAkun !== 'aktif') return null;
    return ditemukan.pengguna;
  }

  /** Logout (idempoten). */
  async logout(idSesi: string | undefined): Promise<void> {
    if (idSesi) await this.dep.repo.akhiriSesi(idSesi);
  }

  pastikanPeran(pengguna: PenggunaUmum, diizinkan: readonly Peran[]): void {
    if (!diizinkan.includes(pengguna.peran)) {
      throw new GalatAplikasi(
        'DILARANG',
        'You do not have access to this page.',
      );
    }
  }
}
