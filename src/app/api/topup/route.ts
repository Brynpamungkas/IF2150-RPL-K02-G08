import { TopupController } from '@/server/controllers/TopupController';

// Route handler dibuat setipis mungkin: hanya meneruskan ke Controller.
export const GET = () => TopupController.bukaFormTopup();
export const POST = (req: Request) => TopupController.prosesTopup(req);
