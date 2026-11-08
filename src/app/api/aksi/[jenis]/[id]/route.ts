import { connection } from 'next/server';
import { kelolaAksi } from '@/server/controllers/AksiController';

type Konteks = { params: Promise<{ jenis: string; id: string }> };
export async function GET(request: Request, { params }: Konteks) {
  await connection();
  const { jenis, id } = await params;
  return kelolaAksi(request, jenis, id);
}
export async function PATCH(request: Request, { params }: Konteks) {
  const { jenis, id } = await params;
  return kelolaAksi(request, jenis, id, true);
}
