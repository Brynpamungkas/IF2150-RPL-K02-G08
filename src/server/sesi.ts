import { DURASI_SESI_MS } from '@/shared/konstanta';

export const NAMA_COOKIE_SESI = 'klimpool_sesi';

export const opsiCookieSesi = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: DURASI_SESI_MS / 1000,
};
