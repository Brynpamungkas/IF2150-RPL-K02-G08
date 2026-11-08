import { connection } from 'next/server';
import { milikSaya } from '@/server/controllers/AksiController';

export async function GET(request: Request) {
  await connection();
  return milikSaya(request);
}
