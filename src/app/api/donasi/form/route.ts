import { DonasiController } from '@/server/controllers/DonasiController';

export const GET = (req: Request) => DonasiController.bukaFormDonasi(req);
