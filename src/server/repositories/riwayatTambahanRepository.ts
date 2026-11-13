import type { RowDataPacket } from 'mysql2/promise';
import { query } from '@/server/db';
import type { ItemRiwayatRelawan, ItemRiwayatTopup } from '@/shared/riwayat';

type BarisTopup = RowDataPacket & {
  id_topup: string;
  nominal: number;
  metode: string;
  waktu: Date;
};
type BarisRelawan = RowDataPacket & {
  id_pendaftaran: string;
  id_project: string;
  nama: string;
  status_pendaftaran: ItemRiwayatRelawan['status'];
  tanggal_daftar: Date;
  tanggal_keputusan: Date | null;
};

/** Hanya top-up milik pengguna sesi; tidak menerima id pemilik dari klien. */
export async function daftarTopupPengguna(
  idPengguna: string,
): Promise<ItemRiwayatTopup[]> {
  const rows = await query<BarisTopup>(
    'SELECT id_topup, nominal, metode, waktu FROM topup_saldo WHERE id_donatur = ?',
    [idPengguna],
  );
  return rows.map((row) => ({
    jenis: 'topup',
    id: row.id_topup,
    waktu: row.waktu.toISOString(),
    nominal: Number(row.nominal),
    metode: row.metode,
  }));
}

/** Riwayat pendaftaran sendiri, tanpa data diri atau titik kumpul project. */
export async function daftarRiwayatRelawan(
  idPengguna: string,
): Promise<ItemRiwayatRelawan[]> {
  const rows = await query<BarisRelawan>(
    `SELECT r.id_pendaftaran, r.id_project, p.nama, r.status_pendaftaran,
            r.tanggal_daftar, r.tanggal_keputusan
       FROM pendaftaran_relawan r JOIN project p ON p.id_project = r.id_project
      WHERE r.id_volunteer = ?`,
    [idPengguna],
  );
  return rows.map((row) => ({
    jenis: 'relawan',
    id: row.id_pendaftaran,
    waktu: row.tanggal_daftar.toISOString(),
    idProject: row.id_project,
    namaProject: row.nama,
    status: row.status_pendaftaran,
    tanggalKeputusan: row.tanggal_keputusan?.toISOString() ?? null,
  }));
}
