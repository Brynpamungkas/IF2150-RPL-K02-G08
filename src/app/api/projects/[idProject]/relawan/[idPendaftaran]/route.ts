import { putuskan } from '@/server/controllers/RelawanController';

type Konteks = {
  params: Promise<{ idProject: string; idPendaftaran: string }>;
};

export async function PATCH(
  request: Request,
  konteks: Konteks,
): Promise<Response> {
  const { idProject, idPendaftaran } = await konteks.params;
  return putuskan(request, idProject, idPendaftaran);
}
