/**
 * Kontrak data riwayat transaksi dan progres (UC10, KF27, issue #38).
 * Modul ini aman di-import oleh client dan server.
 */
import type { JenisTujuan, RincianBukti, StatusTransaksi } from './dto';
import type { PembaruanProgresDto, StatusPelaksanaan } from './progres';

export const JENIS_RIWAYAT = ['transaksi', 'progres'] as const;
export type JenisRiwayat = (typeof JENIS_RIWAYAT)[number];

/** Nilai `?jenis=` pada GET /api/riwayat. Tanpa parameter berarti semua. */
export type FilterRiwayat = JenisRiwayat | 'semua';

/** Satu donasi milik pengguna pada daftar riwayat (Algo-109). */
export type ItemRiwayatTransaksi = {
  jenis: 'transaksi';
  id: string;
  /** ISO 8601; dipakai untuk pengurutan. */
  waktu: string;
  jenisTujuan: JenisTujuan;
  idTujuan: string;
  /** Nama project atau judul campaign; null bila tujuannya sudah dihapus. */
  namaTujuan: string | null;
  nominal: number;
  status: StatusTransaksi;
};

/** Satu pembaruan progres project yang dibuat atau diikuti pengguna (Algo-143). */
export type ItemRiwayatProgres = {
  jenis: 'progres';
  id: string;
  waktu: string;
  idProject: string;
  namaProject: string;
  milestone: string;
  statusPelaksanaan: StatusPelaksanaan;
};

export type ItemRiwayat = ItemRiwayatTransaksi | ItemRiwayatProgres;

/** Rincian satu transaksi (Algo-110). */
export type DetailTransaksiRiwayat = Omit<RincianBukti, 'pesan'> & {
  idTransaksi: string;
};

/** Rincian satu pembaruan progres (Algo-144). */
export type DetailProgresRiwayat = PembaruanProgresDto & {
  namaProject: string;
};

/**
 * Membaca `?jenis=`. Kosong atau tidak ada berarti `semua`;
 * nilai lain yang tidak dikenal menghasilkan `null` agar ditolak pemanggil.
 */
export function bacaFilterRiwayat(nilai: string | null): FilterRiwayat | null {
  const bersih = (nilai ?? '').trim().toLowerCase();
  if (bersih === '' || bersih === 'semua') return 'semua';
  return (JENIS_RIWAYAT as readonly string[]).includes(bersih)
    ? (bersih as JenisRiwayat)
    : null;
}

/**
 * Menggabungkan riwayat dari dua tabel dan mengurutkannya dari yang terbaru
 * (Algo-129). Waktu yang sama diurutkan menurut jenis lalu id agar urutannya
 * tetap sama setiap kali diminta.
 */
export function gabungkanRiwayat(
  transaksi: readonly ItemRiwayatTransaksi[],
  progres: readonly ItemRiwayatProgres[],
): ItemRiwayat[] {
  return [...transaksi, ...progres].sort((a, b) => {
    const selisih = Date.parse(b.waktu) - Date.parse(a.waktu);
    if (selisih !== 0) return selisih;
    if (a.jenis !== b.jenis) return a.jenis < b.jenis ? -1 : 1;
    return a.id < b.id ? 1 : a.id > b.id ? -1 : 0;
  });
}
