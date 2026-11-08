/**
 * tipe dan konstanta katalog
 */

export type TipeItem = 'project' | 'campaign';

export const FILTER_TIPE = ['semua', 'project', 'campaign'] as const;
export type FilterTipe = (typeof FILTER_TIPE)[number];

/** donasi = masih menerima donasi, relawan = masih butuh relawan, selesai = ditutup atau selesai. */
export const FILTER_STATUS = ['donasi', 'relawan', 'selesai'] as const;
export type FilterStatus = (typeof FILTER_STATUS)[number];

/** berjalan = sedang berlangsung, segera = berakhir belum lewat dan mulai dalam 90 hari, lalu = sudah berakhir. */
export const FILTER_PERIODE = ['berjalan', 'segera', 'lalu'] as const;
export type FilterPeriode = (typeof FILTER_PERIODE)[number];

export type StatusPelaksanaan =
  'persiapan' | 'berjalan' | 'ditunda' | 'selesai';

/**
 * daftar kategori baku
 */
export const KATEGORI = [
  'Mangroves & coast',
  'Reforestation',
  'Clean water',
  'Disaster relief',
  'Clean energy',
  'Urban greening',
  'Waste & recycling',
] as const;

export const BATAS_DEFAULT = 20;
export const BATAS_MAKS = 50;
export const KATA_KUNCI_MAKS = 100;
export const PERIODE_SEGERA_HARI = 90;

/** filter yang sudah divalidasi. field opsional yang kosong berarti tidak difilter. */
export interface FilterKatalog {
  kataKunci?: string;
  tipe: FilterTipe;
  kategori?: string;
  /** cocokkan ke provinsi atau kota. */
  lokasi?: string;
  status?: FilterStatus;
  periode?: FilterPeriode;
  halaman: number;
  batas: number;
}

export interface ItemKatalog {
  id: string;
  tipe: TipeItem;
  judul: string;
  deskripsi: string;
  kategori: string | null;
  provinsi: string;
  kota: string;
  latitude: number | null;
  longitude: number | null;
  /** target dana: kebutuhan_dana (project) atau target_nominal (campaign). */
  targetDana: number;
  danaTerkumpul: number;
  persenCapaian: number;
  /** format YYYY-MM-DD. project -> jadwal, campaign -> periode. */
  mulai: string | null;
  selesai: string | null;
  /** hanya project. null untuk campaign. */
  statusPelaksanaan: StatusPelaksanaan | null;
  terbukaDonasi: boolean;
  /** false untuk campaign. */
  terbukaRelawan: boolean;
  /** hanya project. null untuk campaign. */
  kuotaRelawan: number | null;
  relawanDiterima: number | null;
}

/** isi dropdown filter pada halaman Explore. */
export interface OpsiKatalog {
  kategori: readonly string[];
  /** hanya provinsi yang punya project atau campaign terpublikasi, urut abjad. */
  provinsi: string[];
}

export interface HasilKatalog {
  data: ItemKatalog[];
  total: number;
  halaman: number;
  batas: number;
}
