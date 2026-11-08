import {
  bacaDataDiri,
  bacaJadwal,
  bacaKeahlian,
  type PendaftaranRelawanDto,
  type StatusPendaftaran,
} from '@/shared/relawan';

/**
 * Entitas C09 PendaftaranRelawan: satu baris tabel `pendaftaran_relawan`.
 * Kolom teks (data diri, keahlian, jadwal) dibiarkan sebagaimana tersimpan;
 * penguraiannya dilakukan di `keDto`.
 */
export type PendaftaranRelawan = {
  idPendaftaran: string;
  idVolunteer: string;
  idProject: string;
  dataDiri: string;
  keahlian: string | null;
  pengalaman: string | null;
  ketersediaanJadwal: string | null;
  status: StatusPendaftaran;
  tanggalDaftar: Date;
  tanggalKeputusan: Date | null;
};

/** Mengubah entitas menjadi bentuk yang dikirim API kepada peramban. */
export function keDto(pendaftaran: PendaftaranRelawan): PendaftaranRelawanDto {
  return {
    idPendaftaran: pendaftaran.idPendaftaran,
    idProject: pendaftaran.idProject,
    idVolunteer: pendaftaran.idVolunteer,
    dataDiri: bacaDataDiri(pendaftaran.dataDiri),
    keahlian: bacaKeahlian(pendaftaran.keahlian),
    pengalaman: pendaftaran.pengalaman ?? '',
    jadwal: bacaJadwal(pendaftaran.ketersediaanJadwal),
    status: pendaftaran.status,
    tanggalDaftar: pendaftaran.tanggalDaftar.toISOString(),
    tanggalKeputusan: pendaftaran.tanggalKeputusan
      ? pendaftaran.tanggalKeputusan.toISOString()
      : null,
  };
}
