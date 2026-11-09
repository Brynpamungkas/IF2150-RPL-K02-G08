/**
 * Logika murni isi bukti transaksi (C31, KF17) tanpa React, agar bisa diuji unit.
 */
import type { BuktiDTO, HasilDonasi } from '@/shared/donasi';
import { rupiah, waktuLokal } from './format';
import { persenTampil } from './logikaDonasi';

export interface BarisBukti {
  label: string;
  nilai: string;
  /** Penanda gaya: 'ok' untuk status berhasil (warna var(--ok)). */
  nada?: 'ok';
}

export const LABEL_STATUS = {
  berhasil: 'Successful',
  gagal: 'Failed',
} as const;
export const LABEL_JENIS = {
  campaign: 'Campaign',
  project: 'Project',
} as const;

/**
 * Baris bukti sesuai AC1 dan C31, urutannya:
 * Transaction ID, Time, Status, Donor, Destination, Amount, Message (bila ada),
 * lalu Remaining balance dan Target reached (hanya bila ringkasan ada, yaitu tepat setelah donasi).
 */
export function barisBukti(
  bukti: BuktiDTO,
  ringkasan?: HasilDonasi,
): BarisBukti[] {
  const r = bukti.rincian;
  const baris: BarisBukti[] = [
    { label: 'Transaction ID', nilai: bukti.idTransaksi },
    { label: 'Time', nilai: waktuLokal(r.tanggal) },
    {
      label: 'Status',
      nilai: LABEL_STATUS[r.statusTransaksi],
      nada: r.statusTransaksi === 'berhasil' ? 'ok' : undefined,
    },
    { label: 'Donor', nilai: r.namaDonatur },
    {
      label: 'Destination',
      nilai: `${r.namaTujuan} (${LABEL_JENIS[r.jenisTujuan]})`,
    },
    { label: 'Amount', nilai: rupiah(r.nominal) },
  ];
  if (r.pesan) baris.push({ label: 'Message', nilai: r.pesan });
  if (ringkasan) {
    baris.push({
      label: 'Remaining balance',
      nilai: rupiah(ringkasan.saldoSesudah),
    });
    baris.push({
      label: 'Target reached',
      nilai: `${persenTampil(ringkasan.persentasePencapaian)}% (${rupiah(ringkasan.danaTerkumpul)})`,
    });
  }
  return baris;
}

/**
 * Baris bukti saat dibuka ulang dari riwayat, mengikuti modal "Activity details"
 * di prototipe (mHist): Transaction ID, Type, Recipient, Amount, Time, Status, Message.
 */
export function barisArsip(bukti: BuktiDTO): BarisBukti[] {
  const r = bukti.rincian;
  const baris: BarisBukti[] = [
    { label: 'Transaction ID', nilai: bukti.idTransaksi },
    { label: 'Type', nilai: 'Donation' },
    { label: 'Recipient', nilai: r.namaTujuan },
    { label: 'Amount', nilai: rupiah(r.nominal) },
    { label: 'Time', nilai: waktuLokal(r.tanggal) },
    {
      label: 'Status',
      nilai: LABEL_STATUS[r.statusTransaksi],
      nada: r.statusTransaksi === 'berhasil' ? 'ok' : undefined,
    },
  ];
  if (r.pesan) baris.push({ label: 'Message', nilai: r.pesan });
  return baris;
}

/** Nama berkas saran saat disimpan sebagai PDF (dipakai sebagai document.title sementara). */
export function judulCetak(bukti: BuktiDTO): string {
  return `KlimPooL receipt ${bukti.idTransaksi}`;
}
