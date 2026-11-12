/**
 * C04 - Donatur (entity). Data donatur dan aturan saldo.
 * Saldo yang dipakai untuk keputusan selalu dibaca ulang dari basis data
 * (Algo-103/Q-105, atau Q-109 FOR UPDATE di dalam transaksi donasi).
 */
export class Donatur {
  constructor(
    readonly idDonatur: string,
    readonly nama: string,
    readonly email: string | null,
    private saldo: number,
  ) {}

  getSaldo(): number {
    return this.saldo;
  }

  /** true bila saldo cukup untuk nominal ini. */
  cukupUntuk(nominal: number): boolean {
    return this.saldo >= nominal;
  }

  /**
   * Menyamakan saldo di memori setelah Q-106 berhasil di basis data (Algo-104).
   * Pengurangan sebenarnya terjadi di DonasiRepository.kurangiSaldo().
   */
  kurangiSaldo(nominal: number): void {
    this.saldo = Math.round((this.saldo - nominal) * 100) / 100;
  }

  /**
   * Tambahan B.1 baris 1 (top-up simulasi). Menyamakan saldo di memori setelah
   * TopupRepository.tambahSaldo() berhasil di basis data.
   */
  tambahSaldo(nominal: number): void {
    this.saldo = Math.round((this.saldo + nominal) * 100) / 100;
  }
}
