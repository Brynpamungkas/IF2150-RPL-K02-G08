import { getRiwayat } from '@/server/controllers/RiwayatController';

export async function GET(request: Request): Promise<Response> {
  return getRiwayat(request);
}
