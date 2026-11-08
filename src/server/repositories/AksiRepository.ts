import type { PoolConnection, RowDataPacket } from 'mysql2/promise';
import { execute, query } from '@/server/db';
import type { Aksi, DataAksi, JenisAksi, StatusAksi } from '@/shared/aksi';

// Nama tabel/kolom hanya berasal dari whitelist ini, tidak pernah dari input SQL pengguna.
const KOLOM = {
  campaign: {
    id: 'id_campaign',
    judul: 'judul',
    target: 'target_nominal',
    mulai: 'periode_mulai',
    selesai: 'periode_selesai',
    kebutuhan: 'kebutuhan',
  },
  project: {
    id: 'id_project',
    judul: 'nama',
    target: 'kebutuhan_dana',
    mulai: 'jadwal_mulai',
    selesai: 'jadwal_selesai',
    kebutuhan: 'kebutuhan_logistik',
  },
} as const;

function select(jenis: JenisAksi): string {
  const k = KOLOM[jenis];
  return `SELECT ${k.id} AS id, '${jenis}' AS jenis, id_pembuat AS idPembuat,
    ${k.judul} AS judul, deskripsi, kategori, provinsi, kota, latitude, longitude,
    ${k.target} AS targetDana, DATE_FORMAT(${k.mulai}, '%Y-%m-%d') AS mulai,
    DATE_FORMAT(${k.selesai}, '%Y-%m-%d') AS selesai, ${k.kebutuhan} AS kebutuhan,
    ${jenis === 'project' ? 'tujuan, kriteria_volunteer AS kriteriaRelawan, kuota_relawan AS kuotaRelawan, lokasi_kumpul AS lokasiKumpul' : "'' AS tujuan, '' AS kriteriaRelawan, 0 AS kuotaRelawan, '' AS lokasiKumpul"},
    rincian_penggunaan_dana AS rincianDana, status, alasan_penolakan AS alasanPenolakan,
    DATE_FORMAT(tanggal_dibuat, '%Y-%m-%dT%H:%i:%sZ') AS tanggalDibuat,
    DATE_FORMAT(tanggal_pengajuan, '%Y-%m-%dT%H:%i:%sZ') AS tanggalPengajuan,
    DATE_FORMAT(tanggal_verifikasi, '%Y-%m-%dT%H:%i:%sZ') AS tanggalVerifikasi
    FROM ${jenis}`;
}

function dto(baris: RowDataPacket): Aksi {
  // MySQL mengurai JSON; MariaDB mengembalikannya sebagai string.
  const rincian =
    typeof baris.rincianDana === 'string'
      ? JSON.parse(baris.rincianDana)
      : baris.rincianDana;
  return {
    ...baris,
    kategori: baris.kategori ?? '',
    kebutuhan: baris.kebutuhan ?? '',
    tujuan: baris.tujuan ?? '',
    kriteriaRelawan: baris.kriteriaRelawan ?? '',
    lokasiKumpul: baris.lokasiKumpul ?? '',
    rincianDana: rincian ?? [],
  } as Aksi;
}

function penugasan(jenis: JenisAksi, data: DataAksi): [string[], unknown[]] {
  const k = KOLOM[jenis];
  const kolom: string[] = [
    k.judul,
    'deskripsi',
    'kategori',
    'provinsi',
    'kota',
    'latitude',
    'longitude',
    k.target,
    k.mulai,
    k.selesai,
    k.kebutuhan,
    'rincian_penggunaan_dana',
  ];
  const nilai: unknown[] = [
    data.judul,
    data.deskripsi,
    data.kategori || null,
    data.provinsi,
    data.kota,
    data.latitude,
    data.longitude,
    data.targetDana,
    data.mulai,
    data.selesai,
    data.kebutuhan || null,
    JSON.stringify(data.rincianDana),
  ];
  if (jenis === 'project') {
    kolom.push(
      'tujuan',
      'kriteria_volunteer',
      'kuota_relawan',
      'lokasi_kumpul',
    );
    nilai.push(
      data.tujuan,
      data.kriteriaRelawan || null,
      data.kuotaRelawan,
      data.lokasiKumpul || null,
    );
  }
  return [kolom, nilai];
}

export const AksiRepository = {
  async cari(
    jenis: JenisAksi,
    id: string,
    conn?: PoolConnection,
  ): Promise<Aksi | null> {
    const [baris] = await query(
      `${select(jenis)} WHERE ${KOLOM[jenis].id} = ?${conn ? ' FOR UPDATE' : ''}`,
      [id],
      conn,
    );
    return baris ? dto(baris) : null;
  },
  async daftar(
    filter: { idPembuat: string } | { status: StatusAksi },
  ): Promise<Aksi[]> {
    const pemilik = 'idPembuat' in filter;
    const syarat = pemilik ? 'id_pembuat = ?' : 'status = ?';
    const nilai = pemilik ? filter.idPembuat : filter.status;
    const rows = await query(
      `(${select('campaign')} WHERE ${syarat}) UNION ALL
      (${select('project')} WHERE ${syarat}) ORDER BY tanggalDibuat DESC, jenis, id`,
      [nilai, nilai],
    );
    return rows.map(dto);
  },
  async buat(
    jenis: JenisAksi,
    id: string,
    idPembuat: string,
    data: DataAksi,
  ): Promise<void> {
    const [kolom, nilai] = penugasan(jenis, data);
    await execute(
      `INSERT INTO ${jenis} (${KOLOM[jenis].id}, id_pembuat, ${kolom.join(', ')})
      VALUES (?, ?, ${kolom.map(() => '?').join(', ')})`,
      [id, idPembuat, ...nilai],
    );
  },
  async ubah(
    jenis: JenisAksi,
    id: string,
    idPembuat: string,
    data: DataAksi,
    conn: PoolConnection,
  ): Promise<void> {
    const [kolom, nilai] = penugasan(jenis, data);
    await execute(
      `UPDATE ${jenis} SET ${kolom.map((k) => `${k} = ?`).join(', ')}
      WHERE ${KOLOM[jenis].id} = ? AND id_pembuat = ? AND status IN ('draft', 'ditolak')`,
      [...nilai, id, idPembuat],
      conn,
    );
  },
  async ajukan(
    jenis: JenisAksi,
    id: string,
    idPembuat: string,
    conn: PoolConnection,
  ): Promise<boolean> {
    const hasil = await execute(
      `UPDATE ${jenis} SET status = 'menunggu_verifikasi',
      alasan_penolakan = NULL, tanggal_pengajuan = UTC_TIMESTAMP(), tanggal_verifikasi = NULL
      WHERE ${KOLOM[jenis].id} = ? AND id_pembuat = ? AND status IN ('draft', 'ditolak')`,
      [id, idPembuat],
      conn,
    );
    return hasil.affectedRows === 1;
  },
  async putuskan(
    jenis: JenisAksi,
    id: string,
    status: 'terpublikasi' | 'ditolak',
    alasan: string | null,
    conn: PoolConnection,
  ): Promise<boolean> {
    const hasil = await execute(
      `UPDATE ${jenis} SET status = ?, alasan_penolakan = ?,
      tanggal_verifikasi = UTC_TIMESTAMP() WHERE ${KOLOM[jenis].id} = ? AND status = 'menunggu_verifikasi'`,
      [status, alasan, id],
      conn,
    );
    return hasil.affectedRows === 1;
  },
};
