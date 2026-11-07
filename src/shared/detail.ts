import type { StatusPelaksanaan, TipeItem } from '@/shared/katalog';

export interface RincianDana {
  uraian: string;
  nominal: number;
}

export interface ProgresItem {
  id: string;
  milestone: string;
  status: StatusPelaksanaan;
  catatan: string | null;
  persentase: number | null;
  danaTerpakai: number | null;
  dokumen: string[];
  waktu: string;
}

export interface DetailAksi {
  tipe: TipeItem;
  id: string;
  judul: string;
  deskripsi: string;
  tujuan: string | null;
  kategori: string | null;
  provinsi: string;
  kota: string;
  targetDana: number;
  danaTerkumpul: number;
  jumlahDonasi: number;
  mulai: string | null;
  selesai: string | null;
  sisaHari: number | null;
  statusPelaksanaan: StatusPelaksanaan | null;
  terbukaDonasi: boolean;
  terbukaRelawan: boolean;
  pendaftaranDibuka: boolean;
  kuotaRelawan: number | null;
  relawanDiterima: number | null;
  logistik: string[];
  keahlian: string[];
  lokasiKumpul: string | null;
  penyelenggara: string;
  diverifikasi: string | null;
  rincianDana: RincianDana[];
  danaTerpakai: number;
  progres: ProgresItem[];
}

const BULAN = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export function formatTanggal(tanggal: string | null): string {
  const cocok = tanggal?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!cocok) return '-';
  return `${Number(cocok[3])} ${BULAN[Number(cocok[2]) - 1]} ${cocok[1]}`;
}

export function formatJam(waktu: string): string {
  const cocok = waktu.match(/(\d{2}:\d{2})$/);
  return cocok ? `${cocok[1]} WIB` : '';
}

export function plural(jumlah: number, kata: string): string {
  return `${jumlah} ${kata}${jumlah === 1 ? '' : 's'}`;
}

const POSISI_FOTO: Record<string, string> = {
  rusun: 'center 70%',
  mgv: 'center 60%',
  enggros: 'center 55%',
  lewotobi: 'center 40%',
};

export function posisiFoto(id: string): string {
  return POSISI_FOTO[id] ?? 'center';
}
