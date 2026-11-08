import type { StatusPelaksanaan, TipeItem } from '@/shared/katalog';

export interface RincianDana {
  uraian: string;
  nominal: number;
}

/** satu berkas dokumentasi progres. href null = bukan tautan yang aman dibuka, tampil sebagai teks. */
export interface DokumenProgres {
  nama: string;
  href: string | null;
}

/** instruksi kegiatan yang hanya boleh dilihat relawan yang diterima (KF22). */
export interface InstruksiRelawan {
  lokasiKumpul: string;
}

export interface ProgresItem {
  id: string;
  milestone: string;
  status: StatusPelaksanaan;
  catatan: string | null;
  persentase: number | null;
  danaTerpakai: number | null;
  dokumen: DokumenProgres[];
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
  /** true bila tanggal mulai belum tiba. campaign belum menerima donasi sebelum itu. */
  belumMulai: boolean;
  statusPelaksanaan: StatusPelaksanaan | null;
  terbukaDonasi: boolean;
  terbukaRelawan: boolean;
  pendaftaranDibuka: boolean;
  kuotaRelawan: number | null;
  relawanDiterima: number | null;
  logistik: string[];
  keahlian: string[];
  /**
   * titik kumpul hanya diisi server untuk relawan yang pendaftarannya accepted (KF22).
   * sengaja bukan bagian data publik, supaya tidak ikut terkirim ke peramban pengunjung.
   */
  instruksiRelawan: InstruksiRelawan | null;
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

const AWALAN_DOKUMENTASI = '/api/dokumentasi/';

/** sama dengan pola id project di penyimpanan dokumentasi (VARCHAR(36)). */
const POLA_ID_PROJECT = /^[A-Za-z0-9_-]{1,36}$/;

function bacaSegmen(segmen: string): string | null {
  try {
    const nilai = decodeURIComponent(segmen);
    return nilai &&
      nilai !== '.' &&
      nilai !== '..' &&
      !/[\\/?#\u0000]/.test(nilai)
      ? nilai
      : null;
  } catch {
    return null;
  }
}

function hrefDokumentasi(idProject: string, nama: string): string {
  return `${AWALAN_DOKUMENTASI}${encodeURIComponent(idProject)}/${encodeURIComponent(nama)}`;
}

/**
 * mengubah kolom progres_project.dokumentasi_url (daftar dipisah koma) menjadi
 * berkas yang bisa dibuka. dua bentuk diterima:
 *   - alamat dari penyimpanan: /api/dokumentasi/{idProject}/{nama}
 *   - nama berkas saja (data awal): dipetakan ke /api/dokumentasi/{idProject}/{nama}
 * tautan hanya dibuat ke endpoint dokumentasi milik project yang sama. alamat
 * lain (situs luar, project lain, ../, skema aneh) tetap tampil sebagai teks.
 */
export function bentukDokumen(
  idProject: string,
  mentah: string | null,
): DokumenProgres[] {
  if (!mentah) return [];
  const idAman = POLA_ID_PROJECT.test(idProject);

  return mentah
    .split(',')
    .map((e) => e.trim())
    .filter(Boolean)
    .map((entri): DokumenProgres => {
      if (!idAman) return { nama: entri, href: null };

      if (entri.startsWith(AWALAN_DOKUMENTASI)) {
        const bagian = entri.slice(AWALAN_DOKUMENTASI.length).split('/');
        const id = bagian.length === 2 ? bacaSegmen(bagian[0]) : null;
        const nama = bagian.length === 2 ? bacaSegmen(bagian[1]) : null;
        return id === idProject && nama
          ? { nama, href: hrefDokumentasi(idProject, nama) }
          : { nama: entri, href: null };
      }

      const nama = /[/\\:?#]/.test(entri) ? null : bacaSegmen(entri);
      return nama
        ? { nama, href: hrefDokumentasi(idProject, nama) }
        : { nama: entri, href: null };
    });
}
