import { getDetailProgres } from '@/server/controllers/RiwayatController';

type Konteks = { params: Promise<{ idProgres: string }> };

export async function GET(
  _request: Request,
  konteks: Konteks,
): Promise<Response> {
  const { idProgres } = await konteks.params;
  return getDetailProgres(idProgres);
}
