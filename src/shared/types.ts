/** Peran pengguna, sama dengan ENUM kolom pengguna.peran di database. */
export type Role = 'volunteer' | 'pembuat_project' | 'admin';

/** Data pengguna yang dibutuhkan navbar. null = belum login (tamu). */
export interface NavUser {
  nama: string;
  email: string;
  peran: Role;
  /** Saldo donasi dalam rupiah (donatur.saldo). Admin tidak punya saldo. */
  saldo: number;
}

export interface MenuItem {
  label: string;
  href: string;
}
