import type { Aksi, DataAksi } from '@/shared/aksi';

export const dataAksi: DataAksi = {
  judul: 'Pemulihan mangrove',
  deskripsi: 'Penanaman dan pemantauan mangrove.',
  tujuan: 'Memulihkan pesisir',
  kategori: 'Mangroves & coast',
  provinsi: 'Jawa Tengah',
  kota: 'Demak',
  latitude: -6.93,
  longitude: 110.5,
  targetDana: 100_000,
  mulai: '2026-11-19',
  selesai: '2026-12-19',
  kebutuhan: 'Bibit dan sarung tangan',
  kriteriaRelawan: 'Bersedia bekerja di lapangan',
  kuotaRelawan: 5,
  lokasiKumpul: 'Balai desa',
  rincianDana: [{ uraian: 'Bibit', nominal: 100_000 }],
};

export function aksiUji(ubah: Partial<Aksi> = {}): Aksi {
  return {
    ...dataAksi,
    id: 'aksi-1',
    jenis: 'project',
    idPembuat: 'owner',
    status: 'draft',
    alasanPenolakan: null,
    tanggalDibuat: '2026-11-19T00:00:00Z',
    tanggalPengajuan: null,
    tanggalVerifikasi: null,
    ...ubah,
  };
}
