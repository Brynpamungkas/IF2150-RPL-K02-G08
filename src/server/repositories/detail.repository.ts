import type { RowDataPacket } from 'mysql2/promise';
import { query } from '@/server/db';
import type { StatusPelaksanaan } from '@/shared/katalog';

export interface BarisDetail extends RowDataPacket {
  id: string;
  judul: string;
  deskripsi: string;
  tujuan: string | null;
  kategori: string | null;
  provinsi: string;
  kota: string;
  target_dana: number;
  dana_terkumpul: number;
  mulai: string | null;
  selesai: string | null;
  rincian: unknown;
  diverifikasi: string | null;
  penyelenggara: string;
  jumlah_donasi: number;
  status_pelaksanaan: StatusPelaksanaan | null;
  logistik: string | null;
  keahlian: string | null;
  kuota: number | null;
  pendaftaran_dibuka: number | null;
  lokasi_kumpul: string | null;
  relawan_diterima: number | null;
}

export interface BarisProgres extends RowDataPacket {
  id: string;
  milestone: string;
  status_pelaksanaan: StatusPelaksanaan;
  catatan: string | null;
  persentase: number | null;
  dana_terpakai: number | null;
  dokumentasi_url: string | null;
  waktu: string;
}

const JUMLAH_DONASI = (jenis: string, kolomId: string) => `(
  SELECT COUNT(*) FROM transaksi_donasi t
   WHERE t.jenis_tujuan = '${jenis}' AND t.id_tujuan = ${kolomId} AND t.status_transaksi = 'berhasil')`;

const SQL_PROJECT = `
SELECT p.id_project AS id, p.nama AS judul, p.deskripsi, p.tujuan, p.kategori, p.provinsi, p.kota,
       p.kebutuhan_dana AS target_dana, p.dana_terkumpul,
       DATE_FORMAT(p.jadwal_mulai, '%Y-%m-%d') AS mulai,
       DATE_FORMAT(p.jadwal_selesai, '%Y-%m-%d') AS selesai,
       p.rincian_penggunaan_dana AS rincian,
       DATE_FORMAT(p.tanggal_verifikasi, '%Y-%m-%d') AS diverifikasi,
       u.nama AS penyelenggara,
       ${JUMLAH_DONASI('project', 'p.id_project')} AS jumlah_donasi,
       p.status_pelaksanaan, p.kebutuhan_logistik AS logistik, p.kriteria_volunteer AS keahlian,
       p.kuota_relawan AS kuota, (p.status_pendaftaran_project = 'dibuka') AS pendaftaran_dibuka,
       p.lokasi_kumpul,
       (SELECT COUNT(*) FROM pendaftaran_relawan r
         WHERE r.id_project = p.id_project AND r.status_pendaftaran = 'accepted') AS relawan_diterima
  FROM project p
  JOIN pengguna u ON u.id_pengguna = p.id_pembuat
 WHERE p.id_project = ? AND p.status = 'terpublikasi'`;

const SQL_CAMPAIGN = `
SELECT c.id_campaign AS id, c.judul, c.deskripsi, c.kebutuhan AS tujuan, c.kategori, c.provinsi, c.kota,
       c.target_nominal AS target_dana, c.dana_terkumpul,
       DATE_FORMAT(c.periode_mulai, '%Y-%m-%d') AS mulai,
       DATE_FORMAT(c.periode_selesai, '%Y-%m-%d') AS selesai,
       c.rincian_penggunaan_dana AS rincian,
       DATE_FORMAT(c.tanggal_verifikasi, '%Y-%m-%d') AS diverifikasi,
       u.nama AS penyelenggara,
       ${JUMLAH_DONASI('campaign', 'c.id_campaign')} AS jumlah_donasi,
       NULL AS status_pelaksanaan, NULL AS logistik, NULL AS keahlian,
       NULL AS kuota, NULL AS pendaftaran_dibuka, NULL AS lokasi_kumpul, NULL AS relawan_diterima
  FROM campaign c
  JOIN pengguna u ON u.id_pengguna = c.id_pembuat
 WHERE c.id_campaign = ? AND c.status = 'terpublikasi'`;

const SQL_PROGRES = `
SELECT id_progres AS id, milestone, status_pelaksanaan, catatan, persentase, dana_terpakai,
       dokumentasi_url, DATE_FORMAT(timestamp_pembaruan, '%Y-%m-%d %H:%i') AS waktu
  FROM progres_project
 WHERE id_project = ?
 ORDER BY timestamp_pembaruan DESC`;

export class DetailRepository {
  async cariProject(id: string): Promise<BarisDetail | null> {
    const baris = await query<BarisDetail>(SQL_PROJECT, [id]);
    return baris[0] ?? null;
  }

  async cariCampaign(id: string): Promise<BarisDetail | null> {
    const baris = await query<BarisDetail>(SQL_CAMPAIGN, [id]);
    return baris[0] ?? null;
  }

  daftarProgres(idProject: string): Promise<BarisProgres[]> {
    return query<BarisProgres>(SQL_PROGRES, [idProject]);
  }
}
