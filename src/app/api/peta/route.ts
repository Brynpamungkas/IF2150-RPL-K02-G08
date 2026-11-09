import { GalatValidasi } from '@/server/controllers/pencarian.controller';
import { PetaController } from '@/server/controllers/peta.controller';

const controller = new PetaController();

export async function GET(request: Request): Promise<Response> {
  try {
    const data = await controller.getSebaran(new URL(request.url).searchParams);
    return Response.json({ data });
  } catch (error) {
    if (error instanceof GalatValidasi) {
      return Response.json({ pesan: error.message }, { status: 400 });
    }
    console.error('GET /api/peta gagal:', error);
    return Response.json(
      { pesan: 'Terjadi kesalahan pada server.' },
      { status: 500 },
    );
  }
}
