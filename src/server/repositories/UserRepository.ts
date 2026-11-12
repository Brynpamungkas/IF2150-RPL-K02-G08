import type { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import { query, withTransaction } from '@/server/db';
import { GalatAplikasi } from '@/shared/galatDonasi';
import type { Akun } from '@/models/Akun';
import type { PenggunaUmum } from '@/models/PenggunaUmum';
import type { SesiLogin } from '@/models/SesiLogin';

interface BarisAkunPengguna extends RowDataPacket {
  id_akun: string;
  id_pengguna: string;
  email: string;
  password_hash: string;
  status_akun: 'aktif' | 'nonaktif';
  tanggal_dibuat: Date;
  nama: string;
  peran: PenggunaUmum['peran'];
  saldo: number | null;
}

interface BarisSesi extends RowDataPacket {
  id_sesi: string;
  id_pengguna: string;
  waktu_mulai: Date;
  waktu_kedaluwarsa: Date;
  status_sesi: 'aktif' | 'berakhir';
  email: string;
  status_akun: 'aktif' | 'nonaktif';
  nama: string;
  peran: PenggunaUmum['peran'];
  saldo: number | null;
}

const SELECT_AKUN = `
  SELECT a.id_akun, a.id_pengguna, a.email, a.password_hash, a.status_akun,
         a.tanggal_dibuat, p.nama, p.peran, d.saldo
  FROM akun a
  JOIN pengguna p ON p.id_pengguna = a.id_pengguna
  LEFT JOIN donatur d ON d.id_donatur = p.id_pengguna`;

export interface AkunDanPengguna {
  akun: Akun;
  pengguna: PenggunaUmum;
}

function petakanAkun(r: BarisAkunPengguna): AkunDanPengguna {
  return {
    akun: {
      idAkun: r.id_akun,
      idPengguna: r.id_pengguna,
      email: r.email,
      passwordHash: r.password_hash,
      statusAkun: r.status_akun,
      tanggalDibuat: r.tanggal_dibuat,
    },
    pengguna: {
      idPengguna: r.id_pengguna,
      nama: r.nama,
      email: r.email,
      peran: r.peran,
      saldo: r.saldo,
    },
  };
}

/** Akses data pengguna, akun, dan sesi (C00, C12, C13). Tanpa aturan bisnis. */
export class UserRepository {
  /** Q-001: berapa akun yang sudah memakai email ini (0 = tersedia). */
  async hitungEmail(email: string): Promise<number> {
    const rows = await query<RowDataPacket & { jumlah: number }>(
      'SELECT COUNT(*) AS jumlah FROM akun WHERE email = ?',
      [email],
    );
    return Number(rows[0]?.jumlah ?? 0);
  }

  /**
   * Q-002: simpan pengguna, akun, dan dompet (saldo 0) dalam satu transaksi.
   * Unique index email adalah pengaman terakhir bila dua pendaftaran bersamaan.
   */
  async simpanAkunBaru(pengguna: PenggunaUmum, akun: Akun): Promise<void> {
    try {
      await withTransaction(async (conn) => {
        await conn.execute<ResultSetHeader>(
          'INSERT INTO pengguna (id_pengguna, nama, peran, tanggal_bergabung) VALUES (?, ?, ?, ?)',
          [
            pengguna.idPengguna,
            pengguna.nama,
            pengguna.peran,
            akun.tanggalDibuat,
          ],
        );
        await conn.execute<ResultSetHeader>(
          'INSERT INTO akun (id_akun, id_pengguna, email, password_hash, status_akun, tanggal_dibuat) VALUES (?, ?, ?, ?, ?, ?)',
          [
            akun.idAkun,
            akun.idPengguna,
            akun.email,
            akun.passwordHash,
            akun.statusAkun,
            akun.tanggalDibuat,
          ],
        );
        await conn.execute<ResultSetHeader>(
          'INSERT INTO donatur (id_donatur, saldo) VALUES (?, 0)',
          [pengguna.idPengguna],
        );
      });
    } catch (error) {
      if ((error as { code?: string }).code === 'ER_DUP_ENTRY') {
        throw new GalatAplikasi(
          'EMAIL_TERPAKAI',
          'This email is already registered.',
          'email',
        );
      }
      throw error;
    }
  }

  /** Q-003: ambil akun beserta pengguna berdasarkan email (sudah dinormalkan). */
  async cariAkunByEmail(email: string): Promise<AkunDanPengguna | null> {
    const rows = await query<BarisAkunPengguna>(
      `${SELECT_AKUN} WHERE a.email = ?`,
      [email],
    );
    const baris = rows[0];
    return baris ? petakanAkun(baris) : null;
  }

  /** Q-004: simpan sesi baru. */
  async simpanSesi(sesi: SesiLogin): Promise<void> {
    await withTransaction(async (conn) => {
      await conn.execute<ResultSetHeader>(
        'INSERT INTO sesi_login (id_sesi, id_pengguna, waktu_mulai, waktu_kedaluwarsa, status_sesi) VALUES (?, ?, ?, ?, ?)',
        [
          sesi.idSesi,
          sesi.idPengguna,
          sesi.waktuMulai,
          sesi.waktuKedaluwarsa,
          sesi.statusSesi,
        ],
      );
    });
  }

  /** Q-005: ambil sesi beserta pengguna dan status akunnya. */
  async cariSesi(idSesi: string): Promise<{
    sesi: SesiLogin;
    pengguna: PenggunaUmum;
    statusAkun: 'aktif' | 'nonaktif';
  } | null> {
    const rows = await query<BarisSesi>(
      `SELECT s.id_sesi, s.id_pengguna, s.waktu_mulai, s.waktu_kedaluwarsa, s.status_sesi,
              a.email, a.status_akun, p.nama, p.peran, d.saldo
       FROM sesi_login s
       JOIN pengguna p ON p.id_pengguna = s.id_pengguna
       JOIN akun a ON a.id_pengguna = p.id_pengguna
       LEFT JOIN donatur d ON d.id_donatur = p.id_pengguna
       WHERE s.id_sesi = ?`,
      [idSesi],
    );
    const r = rows[0];
    if (!r) return null;
    return {
      sesi: {
        idSesi: r.id_sesi,
        idPengguna: r.id_pengguna,
        waktuMulai: r.waktu_mulai,
        waktuKedaluwarsa: r.waktu_kedaluwarsa,
        statusSesi: r.status_sesi,
      },
      pengguna: {
        idPengguna: r.id_pengguna,
        nama: r.nama,
        email: r.email,
        peran: r.peran,
        saldo: r.saldo,
      },
      statusAkun: r.status_akun,
    };
  }

  /** Q-006: tandai sesi berakhir (logout atau kedaluwarsa). Tidak ada baris = sudah tidak berlaku, bukan galat. */
  async akhiriSesi(idSesi: string): Promise<void> {
    await withTransaction(async (conn) => {
      await conn.execute<ResultSetHeader>(
        "UPDATE sesi_login SET status_sesi = 'berakhir' WHERE id_sesi = ?",
        [idSesi],
      );
    });
  }
}
