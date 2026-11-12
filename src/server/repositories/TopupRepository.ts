/**
 * Akses basis data top-up saldo simulasi (Tabel B.1 baris 1).
 * Penguncian baris donatur memakai DonasiRepository.kunciDonatur (Q-109) yang sama
 * dengan donasi, sehingga top-up dan donasi dari donatur yang sama saling antre.
 */
import type { PoolConnection } from 'mysql2/promise';
import type { TopupSaldo } from '@/models/TopupSaldo';
import { execute } from '../db';

export const TopupRepository = {
  /** Menambah saldo donatur. @returns false bila baris donatur tidak ada. */
  async tambahSaldo(
    conn: PoolConnection,
    idDonatur: string,
    nominal: number,
  ): Promise<boolean> {
    const hasil = await execute(
      'UPDATE donatur SET saldo = saldo + ? WHERE id_donatur = ?',
      [nominal, idDonatur],
      conn,
    );
    return hasil.affectedRows > 0;
  },

  async simpanTopup(conn: PoolConnection, t: TopupSaldo): Promise<void> {
    await execute(
      `INSERT INTO topup_saldo (id_topup, id_donatur, nominal, metode, waktu)
       VALUES (?, ?, ?, ?, ?)`,
      [t.idTopup, t.idDonatur, t.nominal, t.metode, t.waktu],
      conn,
    );
  },
};
