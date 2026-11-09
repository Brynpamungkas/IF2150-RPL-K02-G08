import { lihatRiwayat, perbarui } from '@/server/controllers/ProgresController';

type Konteks = { params: Promise<{ idProject: string }> };

export async function POST(
  request: Request,
  konteks: Konteks,
): Promise<Response> {
  const { idProject } = await konteks.params;
  return perbarui(request, idProject);
}

export async function GET(
  _request: Request,
  konteks: Konteks,
): Promise<Response> {
  const { idProject } = await konteks.params;
  return lihatRiwayat(idProject);
}
