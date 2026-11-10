import { AutentikasiController } from '@/server/controllers/AutentikasiController';

export async function POST() {
  return new AutentikasiController().logout();
}
