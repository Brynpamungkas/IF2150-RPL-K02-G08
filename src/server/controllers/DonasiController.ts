import { adalahJenisTujuan, type PermintaanDonasi } from '@/shared/dto';
import { GalatAplikasi } from '@/shared/galat';
import { AutentikasiService } from '../services/AutentikasiService';
import { DonasiService } from '../services/DonasiService';
import {
  ambilTokenSesi,
  bacaJson,
  gagal,
  pesanDariGalat,
  sukses,
} from './respons';

const PESAN_MAKS = 200;
const ID_MAKS = 36; // VARCHAR(36) pada id_campaign / id_project
const KUNCI_MIN = 16;
const KUNCI_MAKS = 100; // VARCHAR(100) pada transaksi_donasi.idempotency_key

/**
 * Memeriksa bentuk masukan saja. Aturan bisnis (rentang nominal, saldo, status tujuan)
 * diperiksa di sisi server oleh DonasiService/TransaksiDonasi, bukan dipercaya dari klien.
 */
function parsePermintaanDonasi(badan: unknown): PermintaanDonasi {
  const b = (badan ?? {}) as Record<string, unknown>;
  const { jenisTujuan, idTujuan, nominal, pesan, idempotencyKey } = b;

  const valid =
    adalahJenisTujuan(jenisTujuan) &&
    typeof idTujuan === 'string' &&
    idTujuan.length > 0 &&
    idTujuan.length <= ID_MAKS &&
    (pesan == null ||
      (typeof pesan === 'string' && pesan.length <= PESAN_MAKS)) &&
    typeof idempotencyKey === 'string' &&
    idempotencyKey.length >= KUNCI_MIN &&
    idempotencyKey.length <= KUNCI_MAKS;
  if (!valid) throw new GalatAplikasi('PERMINTAAN_TIDAK_VALID');
  // nominal sengaja tidak diperiksa di sini agar galatnya NOMINAL_TIDAK_VALID (Algo-121).

  return {
    jenisTujuan,
    idTujuan,
    nominal: nominal as number,
    pesan: typeof pesan === 'string' ? pesan : undefined,
    idempotencyKey,
  };
}

/**
 * C32 - DonasiController (Control). Memastikan donatur sudah login lewat
 * AutentikasiService, lalu meneruskan permintaan ke DonasiService.
 */
export const DonasiController = {
  /** GET /api/donasi/form?jenis=&id= (Algo-120). */
  async bukaFormDonasi(req: Request): Promise<Response> {
    try {
      const { idPengguna } = await AutentikasiService.wajibLogin(
        ambilTokenSesi(req),
      );
      const q = new URL(req.url).searchParams;
      const jenis = q.get('jenis');
      const id = q.get('id');
      if (!adalahJenisTujuan(jenis) || !id || id.length > ID_MAKS) {
        throw new GalatAplikasi('PERMINTAAN_TIDAK_VALID');
      }
      return sukses(await DonasiService.bukaFormDonasi(idPengguna, jenis, id));
    } catch (e) {
      return gagal(e);
    }
  },

  /** POST /api/donasi (Algo-121). 201 berisi id transaksi dan ringkasan untuk struk. */
  async konfirmasiDonasi(req: Request): Promise<Response> {
    try {
      const { idPengguna } = await AutentikasiService.wajibLogin(
        ambilTokenSesi(req),
      );
      const minta = parsePermintaanDonasi(await bacaJson(req));
      return sukses(await DonasiService.prosesDonasi(idPengguna, minta), 201);
    } catch (e) {
      return gagal(e);
    }
  },

  /** GET /api/donasi/bukti/:idTransaksi (Algo-122). */
  async getBuktiTransaksi(
    req: Request,
    idTransaksi: string,
  ): Promise<Response> {
    try {
      const { idPengguna } = await AutentikasiService.wajibLogin(
        ambilTokenSesi(req),
      );
      return sukses(
        await DonasiService.getBuktiTransaksi(idPengguna, idTransaksi),
      );
    } catch (e) {
      return gagal(e);
    }
  },

  getPesanKesalahan(e: unknown): string {
    return pesanDariGalat(e);
  },
};
