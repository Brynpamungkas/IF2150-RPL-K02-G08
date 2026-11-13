import {
  GalatValidasi,
  PencarianController,
} from '@/server/controllers/pencarian.controller';

/**
 * GET /api/katalog (UC05, KF13, KF14). Publik, tanpa login.
 * Query: q, tipe (semua|project|campaign), kategori, lokasi (provinsi atau kota),
 *        status (donasi|relawan|selesai), periode (berjalan|segera|lalu), halaman, batas.
 * 200: { data, total, halaman, batas }. Tidak ada hasil = data: [] (bukan error).
 * 400: { pesan } bila parameter tidak valid.
 */
const controller = new PencarianController();

export async function GET(request: Request): Promise<Response> {
  try {
    const hasil = await controller.cari(new URL(request.url).searchParams);
    return Response.json(hasil);
  } catch (error) {
    if (error instanceof GalatValidasi) {
      return Response.json({ pesan: error.message }, { status: 400 });
    }
    console.error('GET /api/katalog gagal:', error);
    return Response.json(
      { pesan: 'Terjadi kesalahan pada server.' },
      { status: 500 },
    );
  }
}
