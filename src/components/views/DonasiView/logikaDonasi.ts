/**
 * Logika murni formulir donasi (C30) tanpa React dan tanpa akses server,
 * sehingga bisa diuji unit. Server tetap memvalidasi ulang (Algo-105, Algo-108).
 */
import { NOMINAL_MAKS } from '@/shared/donasi';
import { rupiah } from './format';

/** Nominal cepat I-06.4. */
export const NOMINAL_CEPAT = [25_000, 50_000, 100_000, 250_000] as const;

/** Cukup untuk melewati NOMINAL_MAKS (10 digit) agar galat maksimum tetap terlihat. */
const DIGIT_MAKS = 13;

/** Angka dari teks kolom nominal (hanya digit, I-06.5). 0 bila kosong. */
export function angkaDari(teks: string): number {
  return Number(teks.replace(/\D/g, '')) || 0;
}

/** Hanya digit, maksimal DIGIT_MAKS digit. */
export function bersihkanMasukan(teks: string): string {
  return teks.replace(/\D/g, '').replace(/^0+/, '').slice(0, DIGIT_MAKS);
}

/** Tampilan kolom nominal: 100000 -> "100,000"; 0 -> "". */
export function formatMasukan(nominal: number): string {
  return nominal > 0 ? nominal.toLocaleString('en-US') : '';
}

/**
 * Validasi sebelum kirim (I-06.8). Urutan dan teks mengikuti prototipe doDonate().
 * @returns pesan galat, atau null bila valid.
 */
export function validasiFormDonasi(
  nominal: number,
  saldo: number,
): string | null {
  if (!Number.isFinite(nominal) || nominal <= 0) {
    return 'The donation amount must be more than Rp0. Pick one of the amounts or type a number.';
  }
  if (nominal > NOMINAL_MAKS) {
    return `The maximum donation is ${rupiah(NOMINAL_MAKS)}.`;
  }
  if (nominal > saldo) {
    return pesanSaldoKurang(nominal, saldo);
  }
  return null;
}

export function pesanSaldoKurang(nominal: number, saldo: number): string {
  return `Insufficient balance. Your balance is ${rupiah(saldo)}, which is ${rupiah(nominal - saldo)} short.`;
}

/** Ringkasan I-06.7. */
export function ringkasanSaldo(
  saldo: number,
  nominal: number,
): { kurang: boolean; sisa: number; selisih: number } {
  const kurang = nominal > saldo;
  return {
    kurang,
    sisa: kurang ? 0 : saldo - nominal,
    selisih: kurang ? nominal - saldo : 0,
  };
}

/**
 * Idempotency key sekali per formulir (C30). crypto.randomUUID hanya ada di secure
 * context (https atau localhost); di luar itu (mis. http://192.168.x.x) dipakai
 * getRandomValues. Panjang hasil 32 atau 36 karakter (server menerima 16..100).
 */
export function buatIdempotencyKey(): string {
  const c = globalThis.crypto;
  if (typeof c?.randomUUID === 'function') return c.randomUUID();
  const b = new Uint8Array(16);
  c.getRandomValues(b);
  return Array.from(b, (x) => x.toString(16).padStart(2, '0')).join('');
}

/** Persentase capaian untuk struk: dibulatkan dan dibatasi 100, sama seperti pct() prototipe. */
export function persenTampil(persen: number): number {
  return Math.min(100, Math.max(0, Math.round(persen)));
}
