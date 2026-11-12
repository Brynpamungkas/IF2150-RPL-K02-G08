import { AutentikasiController } from '@/server/controllers/AutentikasiController';

export async function POST(request: Request) {
  return new AutentikasiController().daftarAkun(request);
}
