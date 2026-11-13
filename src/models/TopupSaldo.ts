import { randomUUID } from 'node:crypto';
import {
  LABEL_METODE,
  nominalTopupValid,
  type MetodeTopup,
} from '@/shared/topup';

/**
 * Tambahan pada C04 Donatur (Tabel B.1 baris 1): satu catatan top-up saldo simulasi.
 * Disimpan di tabel topup_saldo, terpisah dari transaksi_donasi agar atomisitas
 * donasi (KF15-KF18) tidak tercampur. Tidak ada payment gateway sungguhan.
 */
export class TopupSaldo {
  constructor(
    readonly idTopup: string,
    readonly idDonatur: string,
    readonly nominal: number,
    readonly metode: string,
    readonly waktu: Date,
  ) {}

  /** Tanpa akses basis data, aman dijalankan sebelum transaksi dibuka. */
  static validasiNominal(nominal: unknown): nominal is number {
    return nominalTopupValid(nominal);
  }

  static buat(
    idDonatur: string,
    nominal: number,
    metode: MetodeTopup,
    sekarang: Date = new Date(),
  ): TopupSaldo {
    // Detik dibulatkan ke bawah: kolom waktu DATETIME tanpa milidetik.
    const waktu = new Date(Math.floor(sekarang.getTime() / 1000) * 1000);
    return new TopupSaldo(
      randomUUID(),
      idDonatur,
      nominal,
      LABEL_METODE[metode],
      waktu,
    );
  }
}
