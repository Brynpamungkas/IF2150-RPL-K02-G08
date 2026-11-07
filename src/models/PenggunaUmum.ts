import type { Peran } from '@/shared/dto';

/** C00 PenggunaUmum */
export interface PenggunaUmum {
  idPengguna: string;
  nama: string;
  email: string;
  peran: Peran;
  saldo: number | null;
}
