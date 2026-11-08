import { getIdPenggunaSaatIni } from '@/server/auth/sesiSementara';
import { jalankan } from '@/server/http';
import {
  detailProgres,
  detailTransaksi,
  riwayatPengguna,
} from '@/server/services/riwayatService';
import { GalatValidasi } from '@/shared/galat';
import { bacaFilterRiwayat } from '@/shared/riwayat';

/**
 * C41 RiwayatController (UC10, KF27, issue #38).
 * Membaca permintaan HTTP dan sesi, memanggil `riwayatService`, lalu menyusun
 * respons. Id pengguna selalu diambil dari sesi; pemeriksaan kepemilikan ada
 * di kueri masing-masing (lihat `riwayatService`).
 */

/** GET /api/riwayat?jenis=transaksi|progres: riwayat milik pengguna, terbaru lebih dulu. */
export function getRiwayat(request: Request): Promise<Response> {
  return jalankan(async () => {
    const filter = bacaFilterRiwayat(
      new URL(request.url).searchParams.get('jenis'),
    );
    if (!filter) {
      throw new GalatValidasi(
        'Jenis riwayat tidak dikenal. Gunakan "transaksi" atau "progres".',
      );
    }
    const idPengguna = await getIdPenggunaSaatIni();
    const riwayat = await riwayatPengguna(idPengguna, filter);
    return Response.json({ riwayat });
  }, 'Gagal mengambil riwayat');
}

/** GET /api/riwayat/transaksi/[idTransaksi]: rincian satu transaksi milik pengguna. */
export function getDetailTransaksi(idTransaksi: string): Promise<Response> {
  return jalankan(async () => {
    const idPengguna = await getIdPenggunaSaatIni();
    const transaksi = await detailTransaksi(idPengguna, idTransaksi);
    return Response.json({ transaksi });
  }, 'Gagal mengambil rincian transaksi');
}

/** GET /api/riwayat/progres/[idProgres]: rincian satu pembaruan progres. */
export function getDetailProgres(idProgres: string): Promise<Response> {
  return jalankan(async () => {
    const idPengguna = await getIdPenggunaSaatIni();
    const progres = await detailProgres(idPengguna, idProgres);
    return Response.json({ progres });
  }, 'Gagal mengambil rincian progres');
}
