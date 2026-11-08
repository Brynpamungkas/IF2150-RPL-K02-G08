import { ajukan } from '@/server/controllers/VerifikasiController';

export async function POST(
  request: Request,
  { params }: { params: Promise<{ jenis: string; id: string }> },
) {
  const { jenis, id } = await params;
  return ajukan(request, jenis, id);
}
