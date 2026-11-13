import type { PembaruanProgresDto, StatusPelaksanaan } from '@/shared/progres';

/**
 * Entitas progres project: satu baris tabel `progres_project`.
 * Setiap pembaruan menjadi baris baru, sehingga riwayat tidak pernah tertimpa (KF23).
 */
export type ProgresProject = {
  idProgres: string;
  idProject: string;
  idPengguna: string;
  milestone: string;
  statusPelaksanaan: StatusPelaksanaan;
  catatan: string | null;
  persentase: number | null;
  danaTerpakai: number | null;
  /** Alamat berkas dipisah koma; null bila tidak ada dokumentasi. */
  dokumentasiUrl: string | null;
  timestampPembaruan: Date;
};

/** Mengubah entitas menjadi bentuk yang dikirim API kepada peramban. */
export function keDto(progres: ProgresProject): PembaruanProgresDto {
  return {
    idProgres: progres.idProgres,
    idProject: progres.idProject,
    idPengguna: progres.idPengguna,
    milestone: progres.milestone,
    statusPelaksanaan: progres.statusPelaksanaan,
    catatan: progres.catatan ?? '',
    persentase: progres.persentase,
    danaTerpakai: progres.danaTerpakai,
    dokumentasi: (progres.dokumentasiUrl ?? '')
      .split(',')
      .map((alamat) => alamat.trim())
      .filter((alamat) => alamat.length > 0),
    timestampPembaruan: progres.timestampPembaruan.toISOString(),
  };
}
