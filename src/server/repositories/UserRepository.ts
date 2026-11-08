/** STUB milik Orang 1 (Autentikasi). Hanya operasi baca sesi yang dipakai alur donasi. */
import type { RowDataPacket } from 'mysql2/promise';
import { query } from '../db';

interface BarisSesi extends RowDataPacket {
  id_pengguna: string;
}

export const UserRepository = {
  /** Mengembalikan id pengguna bila sesi masih aktif dan belum kedaluwarsa. */
  async getSesiAktif(idSesi: string): Promise<string | null> {
    const [b] = await query<BarisSesi>(
      `SELECT id_pengguna FROM sesi_login
        WHERE id_sesi = ? AND status_sesi = 'aktif' AND waktu_kedaluwarsa > UTC_TIMESTAMP()`,
      [idSesi],
    );
    return b ? b.id_pengguna : null;
  },
};
