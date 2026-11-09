import { PencarianController } from '@/server/controllers/pencarian.controller';

/**
 * GET /api/katalog/opsi: isi dropdown filter halaman Explore. Publik.
 * 200: { kategori: string[], provinsi: string[] }
 */
const controller = new PencarianController();

export async function GET(): Promise<Response> {
  try {
    return Response.json(await controller.getOpsi());
  } catch (error) {
    console.error('GET /api/katalog/opsi gagal:', error);
    return Response.json(
      { pesan: 'Terjadi kesalahan pada server.' },
      { status: 500 },
    );
  }
}
