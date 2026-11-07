import { daftar, lihatPendaftar } from '@/server/controllers/RelawanController';

type Konteks = { params: Promise<{ idProject: string }> };

export async function POST(
  request: Request,
  konteks: Konteks,
): Promise<Response> {
  const { idProject } = await konteks.params;
  return daftar(request, idProject);
}

export async function GET(
  _request: Request,
  konteks: Konteks,
): Promise<Response> {
  const { idProject } = await konteks.params;
  return lihatPendaftar(idProject);
}
