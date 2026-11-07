import { connection } from 'next/server';
import { AutentikasiController } from '@/server/controllers/AutentikasiController';

export async function GET() {
  await connection();
  return new AutentikasiController().saya();
}
