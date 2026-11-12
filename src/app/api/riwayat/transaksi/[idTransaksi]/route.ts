import { getDetailTransaksi } from '@/server/controllers/RiwayatController';

type Konteks = { params: Promise<{ idTransaksi: string }> };

export async function GET(
  _request: Request,
  konteks: Konteks,
): Promise<Response> {
  const { idTransaksi } = await konteks.params;
  return getDetailTransaksi(idTransaksi);
}
