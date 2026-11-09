/**
 * Kontrak data top-up saldo simulasi (di luar use case, Tabel B.1 baris 1).
 * Modul ini aman di-import oleh client dan server.
 */

/** Metode pembayaran simulasi, sama dengan pilihan pada prototipe (modal topup). */
export type MetodeTopup = 'va' | 'qr';

/** Teks yang disimpan di topup_saldo.metode dan ditampilkan di riwayat. */
export const LABEL_METODE: Record<MetodeTopup, string> = {
  va: 'Bank transfer (simulated)',
  qr: 'E-wallet (simulated)',
};

export const adalahMetodeTopup = (v: unknown): v is MetodeTopup =>
  v === 'va' || v === 'qr';

/** Nominal cepat pada modal top up prototipe. */
export const NOMINAL_TOPUP = [50_000, 100_000, 250_000, 500_000] as const;

/** Batas nominal satu kali top up (rupiah utuh). */
export const TOPUP_MIN = 10_000;
export const TOPUP_MAKS = 10_000_000;

/** Bilangan bulat rupiah dalam rentang TOPUP_MIN..TOPUP_MAKS. */
export function nominalTopupValid(nominal: unknown): nominal is number {
  return (
    typeof nominal === 'number' &&
    Number.isInteger(nominal) &&
    nominal >= TOPUP_MIN &&
    nominal <= TOPUP_MAKS
  );
}

/**
 * Nominal top up yang disarankan saat saldo kurang untuk donasi:
 * kekurangan dibulatkan ke atas ke kelipatan Rp50,000 (sama seperti prototipe).
 */
export function saranNominalTopup(kekurangan: number): number {
  const kelipatan = 50_000;
  const saran = Math.ceil(Math.max(0, kekurangan) / kelipatan) * kelipatan;
  return Math.min(TOPUP_MAKS, Math.max(kelipatan, saran));
}

export interface InfoTopup {
  saldo: number;
}

export interface PermintaanTopup {
  nominal: number;
  metode: MetodeTopup;
}

export interface HasilTopup {
  idTopup: string;
  nominal: number;
  metode: string;
  waktu: string; // ISO 8601
  saldoSesudah: number;
}
