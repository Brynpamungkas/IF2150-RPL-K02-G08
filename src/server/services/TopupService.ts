import { TopupSaldo } from '@/models/TopupSaldo';
import { GalatAplikasi } from '@/shared/galatDonasi';
import type { HasilTopup, InfoTopup, PermintaanTopup } from '@/shared/topup';
import { withTransaction } from '../db';
import { DonasiRepository } from '../repositories/DonasiRepository';
import { TopupRepository } from '../repositories/TopupRepository';

/**
 * Top-up saldo simulasi (di luar use case SKPL, Tabel B.1 baris 1).
 * Dipanggil oleh TopupController setelah login diperiksa, sehingga idDonatur
 * selalu berasal dari sesi, bukan dari klien.
 */
export const TopupService = {
  /** Saldo terkini untuk modal top up. */
  async bukaFormTopup(idDonatur: string): Promise<InfoTopup> {
    const donatur = await DonasiRepository.getDonatur(idDonatur);
    if (!donatur) throw new GalatAplikasi('BUKAN_DONATUR');
    return { saldo: donatur.getSaldo() };
  },

  /**
   * Satu transaksi MySQL: kunci baris donatur (Q-109), tambah saldo, catat top-up.
   * Galat di tahap mana pun me-rollback keduanya, jadi saldo tidak pernah bertambah
   * tanpa catatan top-up (dan sebaliknya).
   */
  async prosesTopup(
    idDonatur: string,
    minta: PermintaanTopup,
  ): Promise<HasilTopup> {
    const { nominal, metode } = minta;
    if (!TopupSaldo.validasiNominal(nominal)) {
      throw new GalatAplikasi('NOMINAL_TOPUP_TIDAK_VALID');
    }

    try {
      return await withTransaction(async (conn) => {
        const donatur = await DonasiRepository.kunciDonatur(conn, idDonatur);
        if (!donatur) throw new GalatAplikasi('BUKAN_DONATUR');

        if (!(await TopupRepository.tambahSaldo(conn, idDonatur, nominal))) {
          throw new GalatAplikasi('BUKAN_DONATUR');
        }
        donatur.tambahSaldo(nominal);

        const topup = TopupSaldo.buat(idDonatur, nominal, metode);
        await TopupRepository.simpanTopup(conn, topup);

        return {
          idTopup: topup.idTopup,
          nominal: topup.nominal,
          metode: topup.metode,
          waktu: topup.waktu.toISOString(),
          saldoSesudah: donatur.getSaldo(),
        };
      });
    } catch (e) {
      if (e instanceof GalatAplikasi) throw e;
      console.error('[klimpool] top-up dibatalkan karena gangguan:', e);
      throw new GalatAplikasi('TRANSAKSI_GAGAL');
    }
  },
};
