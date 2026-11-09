import { GalatAplikasi } from '@/shared/galatDonasi';
import { adalahMetodeTopup, type PermintaanTopup } from '@/shared/topup';
import { AutentikasiService } from '../services/AutentikasiService';
import { TopupService } from '../services/TopupService';
import { bacaJson, gagal, sukses, TANPA_CACHE } from './respons';

/**
 * Memeriksa bentuk masukan saja. Rentang nominal diperiksa TopupService agar
 * galatnya NOMINAL_TOPUP_TIDAK_VALID.
 */
function parsePermintaanTopup(badan: unknown): PermintaanTopup {
  const { nominal, metode } = (badan ?? {}) as Record<string, unknown>;
  if (!adalahMetodeTopup(metode)) {
    throw new GalatAplikasi('PERMINTAAN_TIDAK_VALID');
  }
  return { nominal: nominal as number, metode };
}

/** Controller top-up saldo simulasi (Tabel B.1 baris 1). */
export const TopupController = {
  /** GET /api/topup: saldo terkini donatur yang login. */
  async bukaFormTopup(): Promise<Response> {
    try {
      const { idPengguna } = await AutentikasiService.wajibLogin();
      return sukses(
        await TopupService.bukaFormTopup(idPengguna),
        200,
        TANPA_CACHE,
      );
    } catch (e) {
      return gagal(e, TANPA_CACHE);
    }
  },

  /** POST /api/topup: 201 berisi id top-up dan saldo sesudahnya. */
  async prosesTopup(req: Request): Promise<Response> {
    try {
      const { idPengguna } = await AutentikasiService.wajibLogin();
      const minta = parsePermintaanTopup(await bacaJson(req));
      return sukses(await TopupService.prosesTopup(idPengguna, minta), 201);
    } catch (e) {
      return gagal(e);
    }
  },
};
