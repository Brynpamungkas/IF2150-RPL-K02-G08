/**
 * Kontrak data antara View (client) dan API (server) untuk alur donasi atomik (UC06).
 * Modul ini aman di-import oleh kedua sisi.
 */
import type { KodeGalat } from './galat';

export type JenisTujuan = 'campaign' | 'project';
/** Sama dengan ENUM transaksi_donasi.status_transaksi. */
export type StatusTransaksi = 'berhasil' | 'gagal';

export const adalahJenisTujuan = (v: unknown): v is JenisTujuan =>
  v === 'campaign' || v === 'project';

/**
 * Batas atas nominal (DPPL Algo-105) agar tidak melebihi rentang DECIMAL(15,2).
 * Batas bawah: lebih dari nol.
 */
export const NOMINAL_MAKS = 1_000_000_000;

/** Algo-105: angka, > 0, <= NOMINAL_MAKS, maksimal dua angka desimal. */
export function nominalValid(nominal: unknown): nominal is number {
  if (typeof nominal !== 'number' || !Number.isFinite(nominal)) return false;
  if (nominal <= 0 || nominal > NOMINAL_MAKS) return false;
  const sen = nominal * 100;
  return Math.abs(sen - Math.round(sen)) < 1e-6;
}

/* ---------- Bentuk respons API ---------- */
export type ApiSukses<T> = { ok: true; data: T };
export type ApiGagal = {
  ok: false;
  kode: KodeGalat;
  pesan: string;
  /** Nama kolom form yang salah, bila ada. */
  bidang?: string;
};
export type ApiHasil<T> = ApiSukses<T> | ApiGagal;

/* ---------- Donasi ---------- */
export interface FormDonasiInfo {
  tujuan: { jenis: JenisTujuan; id: string; nama: string };
  saldo: number;
}

export interface PermintaanDonasi {
  jenisTujuan: JenisTujuan;
  idTujuan: string;
  nominal: number;
  /** Pesan untuk penyelenggara (prototipe I-06). Hanya disimpan di rincian bukti. */
  pesan?: string;
  idempotencyKey: string;
}

export interface HasilDonasi {
  idTransaksi: string;
  saldoSesudah: number;
  danaTerkumpul: number;
  targetNominal: number;
  /** KF26, dua desimal, tidak dibatasi 100. */
  persentasePencapaian: number;
}

export interface RincianBukti {
  namaDonatur: string;
  namaTujuan: string;
  jenisTujuan: JenisTujuan;
  nominal: number;
  pesan: string | null;
  tanggal: string; // ISO 8601
  statusTransaksi: StatusTransaksi;
}

export interface BuktiDTO {
  idBukti: string;
  idTransaksi: string;
  rincian: RincianBukti;
}

/** Satu baris riwayat donasi (Q-110, KF17/KF27). */
export interface RingkasanTransaksi {
  idTransaksi: string;
  jenisTujuan: JenisTujuan;
  idTujuan: string;
  namaTujuan: string | null;
  nominal: number;
  tanggal: string;
  statusTransaksi: StatusTransaksi;
}

/* ---------- Autentikasi (UC01) ---------- */
export type Peran = 'volunteer' | 'pembuat_project' | 'admin';

export interface PenggunaDto {
  idPengguna: string;
  nama: string;
  email: string;
  peran: Peran;
  /** null untuk admin (tidak punya dompet). */
  saldo: number | null;
}

export interface MasukanLoginDto {
  email: string;
  password: string;
}

export interface MasukanDaftarDto {
  nama: string;
  email: string;
  password: string;
}
