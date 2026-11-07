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

export type ResponsApi<T> =
  | { ok: true; data: T }
  | { ok: false; galat: { kode: string; pesan: string; bidang?: string } };
