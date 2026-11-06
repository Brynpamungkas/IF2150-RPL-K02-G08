
import {
  BATAS_MAKS,
  KATA_KUNCI_MAKS,
  KATEGORI,
  type FilterPeriode,
  type FilterStatus,
  type FilterTipe,
  type ItemKatalog,
} from '@/shared/katalog';

export const TIPE_UI = ['all', 'project', 'campaign'] as const;
export type TipeUI = (typeof TIPE_UI)[number];

export const STATUS_UI = ['', 'donate', 'volunteer', 'closed'] as const;
export type StatusUI = (typeof STATUS_UI)[number];

export const PERIODE_UI = ['', 'now', 'soon', 'past'] as const;
export type PeriodeUI = (typeof PERIODE_UI)[number];

export interface FilterExplore {
  q: string;
  type: TipeUI;
  cat: string;
  prov: string;
  status: StatusUI;
  period: PeriodeUI;
}

export const FILTER_KOSONG: FilterExplore = {
  q: '',
  type: 'all',
  cat: '',
  prov: '',
  status: '',
  period: '',
};

export const OPSI_TIPE: { nilai: TipeUI; label: string }[] = [
  { nilai: 'all', label: 'All' },
  { nilai: 'project', label: 'Action projects' },
  { nilai: 'campaign', label: 'Fundraising campaigns' },
];

export const OPSI_STATUS: { nilai: StatusUI; label: string }[] = [
  { nilai: '', label: 'Any status' },
  { nilai: 'donate', label: 'Open for donations' },
  { nilai: 'volunteer', label: 'Needs volunteers' },
  { nilai: 'closed', label: 'Closed / completed' },
];

export const OPSI_PERIODE: { nilai: PeriodeUI; label: string }[] = [
  { nilai: '', label: 'Any period' },
  { nilai: 'now', label: 'Happening now' },
  { nilai: 'soon', label: 'Active in the next 3 months' },
  { nilai: 'past', label: 'Already ended' },
];

const KE_TIPE_API: Record<TipeUI, FilterTipe> = {
  all: 'semua',
  project: 'project',
  campaign: 'campaign',
};
const KE_STATUS_API: Record<Exclude<StatusUI, ''>, FilterStatus> = {
  donate: 'donasi',
  volunteer: 'relawan',
  closed: 'selesai',
};
const KE_PERIODE_API: Record<Exclude<PeriodeUI, ''>, FilterPeriode> = {
  now: 'berjalan',
  soon: 'segera',
  past: 'lalu',
};

function satuNilai(nilai: string | string[] | undefined): string {
  const mentah = Array.isArray(nilai) ? nilai[0] : nilai;
  return (mentah ?? '').trim();
}

function pilih<T extends string>(
  nilai: string,
  pilihan: readonly T[],
  bawaan: T,
): T {
  return (pilihan as readonly string[]).includes(nilai) ? (nilai as T) : bawaan;
}

export function bacaFilterUrl(
  params: Record<string, string | string[] | undefined>,
): FilterExplore {
  return {
    q: satuNilai(params.q).slice(0, KATA_KUNCI_MAKS),
    type: pilih(satuNilai(params.type), TIPE_UI, 'all'),
    cat: satuNilai(params.cat).slice(0, KATA_KUNCI_MAKS),
    prov: satuNilai(params.prov).slice(0, KATA_KUNCI_MAKS),
    status: pilih(satuNilai(params.status), STATUS_UI, ''),
    period: pilih(satuNilai(params.period), PERIODE_UI, ''),
  };
}

export function keQueryUrl(filter: FilterExplore): string {
  const p = new URLSearchParams();
  if (filter.q.trim()) p.set('q', filter.q.trim());
  if (filter.type !== 'all') p.set('type', filter.type);
  if (filter.cat) p.set('cat', filter.cat);
  if (filter.prov) p.set('prov', filter.prov);
  if (filter.status) p.set('status', filter.status);
  if (filter.period) p.set('period', filter.period);
  return p.toString();
}

export function keQueryApi(
  filter: FilterExplore,
  halaman = 1,
  batas = BATAS_MAKS,
): URLSearchParams {
  const p = new URLSearchParams();
  if (filter.q.trim()) p.set('q', filter.q.trim());
  if (filter.type !== 'all') p.set('tipe', KE_TIPE_API[filter.type]);
  if (filter.cat) p.set('kategori', filter.cat);
  if (filter.prov) p.set('lokasi', filter.prov);
  if (filter.status) p.set('status', KE_STATUS_API[filter.status]);
  if (filter.period) p.set('periode', KE_PERIODE_API[filter.period]);
  p.set('halaman', String(halaman));
  p.set('batas', String(batas));
  return p;
}
export function adaFilter(filter: FilterExplore): boolean {
  return Boolean(
    filter.q.trim() ||
    filter.type !== 'all' ||
    filter.cat ||
    filter.prov ||
    filter.status ||
    filter.period,
  );
}


export const rupiah = (n: number): string =>
  'Rp' + Math.round(n).toLocaleString('en-US');

export function rupiahRingkas(n: number): string {
  if (n >= 1e9) return 'Rp' + (n / 1e9).toFixed(1).replace('.0', '') + 'B';
  if (n >= 1e6) return 'Rp' + (n / 1e6).toFixed(1).replace('.0', '') + 'M';
  return rupiah(n);
}

export function persenBatang(terkumpul: number, target: number): number {
  return target > 0 ? Math.min(100, Math.round((terkumpul / target) * 100)) : 0;
}

export type KelasChip = '' | 'soft' | 'ok' | 'warn' | 'bad' | 'info';

export interface LabelChip {
  kelas: KelasChip;
  teks: string;
}

export function labelTipe(tipe: ItemKatalog['tipe']): string {
  return tipe === 'project' ? 'Action project' : 'Fundraising campaign';
}

const LABEL_PELAKSANAAN: Record<
  NonNullable<ItemKatalog['statusPelaksanaan']>,
  string
> = {
  persiapan: 'Preparing',
  berjalan: 'In progress',
  ditunda: 'On hold',
  selesai: 'Completed',
};


export function labelStatus(item: ItemKatalog): LabelChip {
  if (item.statusPelaksanaan === 'selesai') {
    return { kelas: 'info', teks: 'Completed' };
  }
  if (!item.terbukaDonasi) {
    return { kelas: 'warn', teks: 'Donations closed' };
  }
  const kuota = item.kuotaRelawan ?? 0;
  if (
    item.tipe === 'project' &&
    !item.terbukaRelawan &&
    kuota > 0 &&
    (item.relawanDiterima ?? 0) >= kuota
  ) {
    return { kelas: 'warn', teks: 'Volunteer spots full' };
  }
  return {
    kelas: 'ok',
    teks: item.statusPelaksanaan
      ? LABEL_PELAKSANAAN[item.statusPelaksanaan]
      : 'Open for donations',
  };
}

export function teksRelawan(item: ItemKatalog): string | null {
  if (item.tipe !== 'project' || !item.kuotaRelawan) return null;
  return `${item.relawanDiterima ?? 0}/${item.kuotaRelawan} volunteers`;
}

export function hrefDetail(item: Pick<ItemKatalog, 'tipe' | 'id'>): string {
  return `/${item.tipe}/${encodeURIComponent(item.id)}`;
}

export function teksLokasi(item: Pick<ItemKatalog, 'kota' | 'provinsi'>) {
  return `${item.kota}, ${item.provinsi}`;
}
export const WARNA_PIN = {
  project: '#3F6B3E',
  campaign: '#B7832F',
} as const;

const ID_BERFOTO = new Set([
  'mgv',
  'air',
  'teduh',
  'luwu',
  'gambut',
  'surya',
  'subak',
  'sampah',
  'leuser',
  'enggros',
  'biopori',
  'rusun',
  'lewotobi',
  'tamankali',
]);

const FOTO_KATEGORI: Record<(typeof KATEGORI)[number], string> = {
  'Mangroves & coast': 'mgv',
  Reforestation: 'leuser',
  'Clean water': 'air',
  'Disaster relief': 'luwu',
  'Clean energy': 'surya',
  'Urban greening': 'teduh',
  'Waste & recycling': 'sampah',
};

export function fotoAksi(item: Pick<ItemKatalog, 'id' | 'kategori'>): string {
  const berdasarkanKategori =
    FOTO_KATEGORI[item.kategori as keyof typeof FOTO_KATEGORI];
  const kunci = ID_BERFOTO.has(item.id)
    ? item.id
    : (berdasarkanKategori ?? 'mgv');
  return `/images/aksi/${kunci}.jpg`;
}
