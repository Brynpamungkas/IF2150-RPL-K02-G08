import { randomUUID } from 'node:crypto';
import {
  adalahJenisTujuan,
  type BuktiDTO,
  type RincianBukti,
} from '@/shared/dto';

/**
 * C07 - BuktiTransaksi (entity). Struk yang dibentuk setelah donasi berhasil.
 * Rincian disimpan sebagai snapshot JSON (kolom TEXT) agar bukti tidak berubah
 * bila nama campaign/project kelak diubah (Algo-111).
 */
export class BuktiTransaksi {
  constructor(
    readonly idBukti: string,
    readonly idTransaksi: string,
    readonly rincian: RincianBukti,
  ) {}

  /** Algo-111. Bukti hanya dibuat untuk transaksi berhasil. */
  static cetakBukti(
    idTransaksi: string,
    rincian: RincianBukti,
  ): BuktiTransaksi {
    if (rincian.statusTransaksi !== 'berhasil') {
      throw new Error('Bukti hanya dibuat untuk transaksi berhasil');
    }
    return new BuktiTransaksi(randomUUID(), idTransaksi, rincian);
  }

  /**
   * Mengurai kolom rincian. Mengembalikan null bila isinya bukan JSON rincian
   * (misalnya teks bebas pada data seed), sehingga pemanggil bisa membentuk ulang.
   */
  static uraiRincian(teks: string): RincianBukti | null {
    try {
      const r = JSON.parse(teks) as Partial<RincianBukti>;
      const lengkap =
        typeof r.namaDonatur === 'string' &&
        typeof r.namaTujuan === 'string' &&
        adalahJenisTujuan(r.jenisTujuan) &&
        typeof r.nominal === 'number' &&
        typeof r.tanggal === 'string' &&
        (r.statusTransaksi === 'berhasil' || r.statusTransaksi === 'gagal');
      return lengkap ? ({ pesan: null, ...r } as RincianBukti) : null;
    } catch {
      return null;
    }
  }

  /** Algo-112. Bentuk yang dikirim ke View. */
  tampilkanBukti(): BuktiDTO {
    return {
      idBukti: this.idBukti,
      idTransaksi: this.idTransaksi,
      rincian: this.rincian,
    };
  }
}
