import type { StatusTransaksi } from '@/shared/dto';
import type { StatusPelaksanaan } from '@/shared/progres';

export const LABEL_STATUS_TRANSAKSI: Record<StatusTransaksi, string> = {
  berhasil: 'Successful',
  gagal: 'Failed',
};

export const LABEL_STATUS_PELAKSANAAN: Record<StatusPelaksanaan, string> = {
  persiapan: 'Preparing',
  berjalan: 'In progress',
  ditunda: 'On hold',
  selesai: 'Completed',
};
