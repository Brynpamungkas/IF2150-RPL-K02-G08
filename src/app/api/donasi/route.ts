import { DonasiController } from '@/server/controllers/DonasiController';

// Route handler dibuat setipis mungkin: hanya meneruskan ke Controller.
export const POST = (req: Request) => DonasiController.konfirmasiDonasi(req);
