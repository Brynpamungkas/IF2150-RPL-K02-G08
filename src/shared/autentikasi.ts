/** Kontrak data antara View (client) dan API (server) untuk autentikasi (UC01). */

export type Peran = 'volunteer' | 'pembuat_project' | 'admin';

export interface PenggunaDto {
  idPengguna: string;
  nama: string;
  email: string;
  peran: Peran;
  /** null untuk admin (tidak punya dompet). */
  saldo: number | null;
}

export interface MasukanLoginDto {
  email: string;
  password: string;
}

export interface MasukanDaftarDto {
  nama: string;
  email: string;
  password: string;
}
