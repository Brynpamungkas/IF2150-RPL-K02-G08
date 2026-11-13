/** Kontrak UC02–UC04 dan tab My Actions; aman dipakai client/server. */
export type JenisAksi = 'campaign' | 'project';
export type StatusAksi =
  'draft' | 'menunggu_verifikasi' | 'terpublikasi' | 'ditolak';

export const LABEL_STATUS_AKSI: Record<StatusAksi, string> = {
  draft: 'Draft',
  menunggu_verifikasi: 'Menunggu Verifikasi',
  terpublikasi: 'Terpublikasi',
  ditolak: 'Ditolak',
};

export interface RincianDana {
  uraian: string;
  nominal: number;
}

export interface DataAksi {
  judul: string;
  deskripsi: string;
  tujuan: string;
  kategori: string;
  provinsi: string;
  kota: string;
  latitude: number | null;
  longitude: number | null;
  targetDana: number;
  mulai: string | null;
  selesai: string | null;
  kebutuhan: string;
  kriteriaRelawan: string;
  kuotaRelawan: number;
  lokasiKumpul: string;
  rincianDana: RincianDana[];
}

export interface Aksi extends DataAksi {
  id: string;
  jenis: JenisAksi;
  idPembuat: string;
  status: StatusAksi;
  alasanPenolakan: string | null;
  tanggalDibuat: string;
  tanggalPengajuan: string | null;
  tanggalVerifikasi: string | null;
}

export const adalahJenisAksi = (nilai: unknown): nilai is JenisAksi =>
  nilai === 'campaign' || nilai === 'project';

export const dapatDiedit = (status: StatusAksi) =>
  status === 'draft' || status === 'ditolak';
