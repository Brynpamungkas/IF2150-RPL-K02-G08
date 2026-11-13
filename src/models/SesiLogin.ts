import { randomBytes } from 'node:crypto';
import { DURASI_SESI_MS } from '@/shared/konstanta';

/** C13 SesiLogin */
export interface SesiLogin {
  idSesi: string;
  idPengguna: string;
  waktuMulai: Date;
  waktuKedaluwarsa: Date;
  statusSesi: 'aktif' | 'berakhir';
}

/** idSesi = 32 byte acak dari CSPRNG, jadi tidak bisa ditebak. */
export function buatSesi(idPengguna: string, sekarang: Date): SesiLogin {
  return {
    idSesi: randomBytes(32).toString('hex'),
    idPengguna,
    waktuMulai: sekarang,
    waktuKedaluwarsa: new Date(sekarang.getTime() + DURASI_SESI_MS),
    statusSesi: 'aktif',
  };
}

/** Sesi sah hanya bila aktif, sudah dimulai, dan belum kedaluwarsa. */
export function cekStatusLogin(sesi: SesiLogin, sekarang: Date): boolean {
  return (
    sesi.statusSesi === 'aktif' &&
    sesi.waktuMulai.getTime() <= sekarang.getTime() &&
    sesi.waktuKedaluwarsa.getTime() > sekarang.getTime()
  );
}
