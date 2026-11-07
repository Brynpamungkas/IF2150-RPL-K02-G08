import { DonasiController } from '@/server/controllers/DonasiController';

type Konteks = { params: Promise<{ idTransaksi: string }> };

export const GET = async (req: Request, { params }: Konteks) =>
  DonasiController.getBuktiTransaksi(req, (await params).idTransaksi);
