import { lihatPendaftaranSaya } from '@/server/controllers/RelawanController';

export function GET(): Promise<Response> {
  return lihatPendaftaranSaya();
}
