import { connection } from 'next/server';
import { antrean } from '@/server/controllers/VerifikasiController';

export async function GET(request: Request) {
  await connection();
  return antrean(request);
}
