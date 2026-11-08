import type { RowDataPacket } from 'mysql2/promise';
import { query } from '@/server/db';
import type {
  FilterKatalog,
  StatusPelaksanaan,
  TipeItem,
} from '@/shared/katalog';

/** konteks tanggal untuk filter status dan periode, format YYYY-MM-DD. */
export interface KonteksTanggal {
  hariIni: string;
  /** hariIni + 90 hari, batas atas filter periode "segera". */
  batasSegera: string;
}

export interface BarisKatalog extends RowDataPacket {
  id: string;
  tipe: TipeItem;
  judul: string;
  deskripsi: string;
  kategori: string | null;
  provinsi: string;
  kota: string;
  latitude: number | null;
  longitude: number | null;
  target_dana: number;
  dana_terkumpul: number;
  mulai: string | null;
  selesai: string | null;
  status_pelaksanaan: StatusPelaksanaan | null;
  kuota: number | null;
  relawan_diterima: number | null;
  terbuka_donasi: number;
  terbuka_relawan: number;
}

export interface KueriKatalog {
  sqlData: string;
  paramsData: unknown[];
  sqlTotal: string;
  paramsTotal: unknown[];
}

/**
 * hanya status 'terpublikasi' yang masuk katalog. project dan campaign
 * disatukan agar filter, urutan, dan paginasi berlaku sama untuk keduanya.
 * tanggal tetap berupa DATE di sini dan diformat di SELECT terluar.
 */
const SUMBER = `
  SELECT 'project' AS tipe, p.id_project AS id, p.nama AS judul, p.deskripsi, p.kategori,
         p.provinsi, p.kota, p.latitude, p.longitude,
         p.kebutuhan_dana AS target_dana, p.dana_terkumpul,
         p.jadwal_mulai AS mulai, p.jadwal_selesai AS selesai,
         p.status_pelaksanaan AS status_pelaksanaan,
         (p.status_pendaftaran_project = 'dibuka') AS pendaftaran_dibuka,
         p.kuota_relawan AS kuota,
         (SELECT COUNT(*) FROM pendaftaran_relawan r
           WHERE r.id_project = p.id_project AND r.status_pendaftaran = 'accepted') AS relawan_diterima,
         p.tanggal_dibuat
    FROM project p
   WHERE p.status = 'terpublikasi'
  UNION ALL
  SELECT 'campaign', c.id_campaign, c.judul, c.deskripsi, c.kategori,
         c.provinsi, c.kota, c.latitude, c.longitude,
         c.target_nominal, c.dana_terkumpul,
         c.periode_mulai, c.periode_selesai,
         NULL, 0, NULL, NULL,
         c.tanggal_dibuat
    FROM campaign c
   WHERE c.status = 'terpublikasi'`;

/**
 * masih menerima donasi: belum selesai, tanggal selesai belum lewat, dan campaign sudah mulai
 * (sama dengan pengecekan di alur donasi). parameter: hariIni dua kali.
 */
const TERBUKA_DONASI = `(COALESCE(k.status_pelaksanaan, '') <> 'selesai' AND k.selesai >= ?
   AND (k.tipe <> 'campaign' OR k.mulai <= ?))`;

/** campaign yang periodenya belum mulai: belum terbuka, tetapi juga belum berakhir. parameter: hariIni. */
const CAMPAIGN_BELUM_MULAI = `(k.tipe = 'campaign' AND k.mulai > ?)`;

const parameterDonasi = (tanggal: KonteksTanggal): string[] => [
  tanggal.hariIni,
  tanggal.hariIni,
];

/** masih butuh relawan: hanya project. parameter: hariIni. */
const TERBUKA_RELAWAN = `(k.tipe = 'project' AND k.pendaftaran_dibuka = 1 AND k.status_pelaksanaan <> 'selesai'
   AND k.relawan_diterima < k.kuota AND k.selesai >= ?)`;

/**
 * meloloskan karakter khusus LIKE agar kata kunci dicari apa adanya.
 * karakter escape '|' dipilih (bukan '\\'), aman pada sql_mode NO_BACKSLASH_ESCAPES.
 */
export function escapeLike(teks: string): string {
  return teks.replace(/[|%_]/g, (c) => `|${c}`);
}

/**
 * menyusun kueri katalog. nilai dari pengguna masuk lewat tanda tanya (?),
 * tidak pernah digabung ke string SQL, aman dari SQL injection.
 */
export function bangunKueri(
  filter: FilterKatalog,
  tanggal: KonteksTanggal,
): KueriKatalog {
  const syarat: string[] = [];
  const params: unknown[] = [];

  if (filter.kataKunci) {
    const pola = `%${escapeLike(filter.kataKunci)}%`;
    syarat.push(
      `(k.judul LIKE ? ESCAPE '|' OR k.deskripsi LIKE ? ESCAPE '|' OR k.kota LIKE ? ESCAPE '|'
        OR k.provinsi LIKE ? ESCAPE '|' OR k.kategori LIKE ? ESCAPE '|')`,
    );
    params.push(pola, pola, pola, pola, pola);
  }
  if (filter.tipe !== 'semua') {
    syarat.push('k.tipe = ?');
    params.push(filter.tipe);
  }
  if (filter.kategori) {
    syarat.push('k.kategori = ?');
    params.push(filter.kategori);
  }
  if (filter.lokasi) {
    syarat.push('(k.provinsi = ? OR k.kota = ?)');
    params.push(filter.lokasi, filter.lokasi);
  }
  if (filter.status === 'donasi') {
    syarat.push(TERBUKA_DONASI);
    params.push(...parameterDonasi(tanggal));
  } else if (filter.status === 'relawan') {
    syarat.push(TERBUKA_RELAWAN);
    params.push(tanggal.hariIni);
  } else if (filter.status === 'selesai') {
    syarat.push(
      `(NOT COALESCE(${TERBUKA_DONASI}, 0) AND NOT ${CAMPAIGN_BELUM_MULAI})`,
    );
    params.push(...parameterDonasi(tanggal), tanggal.hariIni);
  }
  if (filter.periode === 'berjalan') {
    syarat.push('(k.mulai <= ? AND k.selesai >= ?)');
    params.push(tanggal.hariIni, tanggal.hariIni);
  } else if (filter.periode === 'segera') {
    syarat.push('(k.selesai >= ? AND k.mulai <= ?)');
    params.push(tanggal.hariIni, tanggal.batasSegera);
  } else if (filter.periode === 'lalu') {
    syarat.push('k.selesai < ?');
    params.push(tanggal.hariIni);
  }

  const where = syarat.length ? `WHERE ${syarat.join(' AND ')}` : '';
  const offset = (filter.halaman - 1) * filter.batas;

  // parameter di daftar SELECT selalu mendahului parameter WHERE.
  const sqlData = `
SELECT k.id, k.tipe, k.judul, k.deskripsi, k.kategori, k.provinsi, k.kota, k.latitude, k.longitude,
       k.target_dana, k.dana_terkumpul,
       DATE_FORMAT(k.mulai, '%Y-%m-%d') AS mulai, DATE_FORMAT(k.selesai, '%Y-%m-%d') AS selesai,
       k.status_pelaksanaan, k.kuota, k.relawan_diterima,
       COALESCE(${TERBUKA_DONASI}, 0) AS terbuka_donasi,
       COALESCE(${TERBUKA_RELAWAN}, 0) AS terbuka_relawan
  FROM (${SUMBER}
  ) k
  ${where}
 ORDER BY k.tanggal_dibuat DESC, k.id ASC
 LIMIT ? OFFSET ?`;
  const paramsData = [
    ...parameterDonasi(tanggal),
    tanggal.hariIni,
    ...params,
    filter.batas,
    offset,
  ];

  const sqlTotal = `
SELECT COUNT(*) AS total
  FROM (${SUMBER}
  ) k
  ${where}`;

  return { sqlData, paramsData, sqlTotal, paramsTotal: params };
}

/** provinsi yang punya item terpublikasi. UNION otomatis membuang duplikat. */
export const SQL_PROVINSI = `
SELECT provinsi FROM project WHERE status = 'terpublikasi'
UNION
SELECT provinsi FROM campaign WHERE status = 'terpublikasi'
ORDER BY provinsi ASC`;

export class KatalogRepository {
  /** mengambil satu halaman hasil beserta jumlah seluruh hasil yang cocok. */
  async cari(
    filter: FilterKatalog,
    tanggal: KonteksTanggal,
  ): Promise<{ baris: BarisKatalog[]; total: number }> {
    const kueri = bangunKueri(filter, tanggal);
    const [baris, totalBaris] = await Promise.all([
      query<BarisKatalog>(kueri.sqlData, kueri.paramsData),
      query<RowDataPacket & { total: number }>(
        kueri.sqlTotal,
        kueri.paramsTotal,
      ),
    ]);
    return { baris, total: Number(totalBaris[0]?.total ?? 0) };
  }

  async daftarProvinsi(): Promise<string[]> {
    const baris = await query<RowDataPacket & { provinsi: string }>(
      SQL_PROVINSI,
    );
    return baris.map((b) => b.provinsi);
  }
}
