import { randomUUID } from 'node:crypto';
import {
  nominalValid,
  type JenisTujuan,
  type StatusTransaksi,
} from '@/shared/dto';

export interface PropsTransaksi {
  idTransaksi: string;
  idDonatur: string;
  idTujuan: string;
  jenisTujuan: JenisTujuan;
  idempotencyKey: string;
  nominal: number;
  tanggal: Date;
  statusTransaksi: StatusTransaksi;
}

/**
 * C06 - TransaksiDonasi (entity).
 * Aturan bisnis donasi. Query ke basis data (Q-107 s.d. Q-111) ada di DonasiRepository,
 * dan transaksi atomik prosesDonasi() (Algo-108) dikoordinasikan oleh DonasiService.
 */
export class TransaksiDonasi {
  readonly idTransaksi: string;
  readonly idDonatur: string;
  readonly idTujuan: string;
  readonly jenisTujuan: JenisTujuan;
  readonly idempotencyKey: string;
  readonly nominal: number;
  readonly tanggal: Date;
  readonly statusTransaksi: StatusTransaksi;

  constructor(p: PropsTransaksi) {
    this.idTransaksi = p.idTransaksi;
    this.idDonatur = p.idDonatur;
    this.idTujuan = p.idTujuan;
    this.jenisTujuan = p.jenisTujuan;
    this.idempotencyKey = p.idempotencyKey;
    this.nominal = p.nominal;
    this.tanggal = p.tanggal;
    this.statusTransaksi = p.statusTransaksi;
  }

  /** Algo-105. Tidak mengakses basis data, aman dijalankan sebelum transaksi dibuka. */
  static validasiNominal(nominal: unknown): nominal is number {
    return nominalValid(nominal);
  }

  /**
   * Algo-107. Membentuk transaksi berstatus "berhasil" dengan ID unik (KF17).
   * Hanya dipanggil di dalam transaksi basis data prosesDonasi(), sehingga
   * transaksi yang gagal tidak pernah tersimpan.
   */
  static buatTransaksi(
    idDonatur: string,
    idTujuan: string,
    jenisTujuan: JenisTujuan,
    nominal: number,
    idempotencyKey: string,
    sekarang: Date = new Date(),
  ): TransaksiDonasi {
    return new TransaksiDonasi({
      idTransaksi: randomUUID(),
      idDonatur,
      idTujuan,
      jenisTujuan,
      idempotencyKey,
      nominal,
      tanggal: sekarang,
      statusTransaksi: 'berhasil',
    });
  }
}
