/**
 * STUB milik modul Campaign/Project. Hanya berisi operasi C02 Project dan C03 Campaign
 * yang dipakai alur donasi: cekStatus (Algo-131/132), tambahDana (Algo-133/134),
 * dan hitungPersentaseCapaian (Algo-135, KF26).
 */
import type { PoolConnection, RowDataPacket } from 'mysql2/promise';
import type { JenisTujuan } from '@/shared/donasi';
import { execute, query } from '../db';

/** Nilai ENUM status di skema untuk tujuan yang sudah lolos verifikasi ("Diterima" di DPPL). */
const STATUS_TERPUBLIKASI = 'terpublikasi';

export interface StatusTujuan {
  jenis: JenisTujuan;
  id: string;
  nama: string;
  /** true bila tujuan menerima donasi saat ini (status dan, untuk campaign, periode). */
  aktif: boolean;
}

export interface Capaian {
  danaTerkumpul: number;
  targetNominal: number;
  persentasePencapaian: number;
}

interface BarisStatus extends RowDataPacket {
  id: string;
  nama: string;
  aktif: number;
}

interface BarisCapaian extends RowDataPacket {
  dana_terkumpul: number;
  kebutuhan_dana: number;
}

export const CampaignProjectRepository = {
  /** Q-122 (project) / Q-123 (campaign). null bila tujuan tidak ada. */
  async cekStatus(
    jenis: JenisTujuan,
    id: string,
  ): Promise<StatusTujuan | null> {
    const sql =
      jenis === 'project'
        ? `SELECT id_project AS id, nama, status = ? AS aktif
             FROM project WHERE id_project = ?`
        : `SELECT id_campaign AS id, judul AS nama,
                  (status = ? AND periode_mulai <= CURDATE()
                              AND periode_selesai >= CURDATE()) AS aktif
             FROM campaign WHERE id_campaign = ?`;
    const [b] = await query<BarisStatus>(sql, [STATUS_TERPUBLIKASI, id]);
    return b ? { jenis, id: b.id, nama: b.nama, aktif: b.aktif === 1 } : null;
  },

  /**
   * Q-124 / Q-125. Dipanggil di dalam transaksi donasi. Penambahan relatif
   * (dana_terkumpul + ?) sehingga donasi bersamaan tidak saling menimpa, dan
   * status/periode diperiksa ulang secara atomik di WHERE.
   * @returns false bila tujuan tidak ada, belum/tidak terpublikasi, atau periode berakhir.
   */
  async tambahDana(
    conn: PoolConnection,
    jenis: JenisTujuan,
    id: string,
    nominal: number,
  ): Promise<boolean> {
    const sql =
      jenis === 'project'
        ? `UPDATE project SET dana_terkumpul = dana_terkumpul + ?
            WHERE id_project = ? AND status = ?`
        : `UPDATE campaign SET dana_terkumpul = dana_terkumpul + ?
            WHERE id_campaign = ? AND status = ?
              AND periode_mulai <= CURDATE() AND periode_selesai >= CURDATE()`;
    const hasil = await execute(sql, [nominal, id, STATUS_TERPUBLIKASI], conn);
    return hasil.affectedRows > 0;
  },

  /**
   * Q-126 / Q-127. Persentase dihitung dari data terbaru, tidak disimpan (KF26).
   * Hasil tidak dibatasi 100; tampilan boleh memotongnya.
   */
  async hitungPersentaseCapaian(
    jenis: JenisTujuan,
    id: string,
    conn?: PoolConnection,
  ): Promise<Capaian> {
    const sql =
      jenis === 'project'
        ? 'SELECT kebutuhan_dana, dana_terkumpul FROM project WHERE id_project = ?'
        : 'SELECT target_nominal AS kebutuhan_dana, dana_terkumpul FROM campaign WHERE id_campaign = ?';
    const [b] = await query<BarisCapaian>(sql, [id], conn);
    const dana = b ? Number(b.dana_terkumpul) : 0;
    const target = b ? Number(b.kebutuhan_dana) : 0;
    const persen =
      target > 0 ? Math.round((dana / target) * 100 * 100) / 100 : 0;
    return {
      danaTerkumpul: dana,
      targetNominal: target,
      persentasePencapaian: persen,
    };
  },
};
