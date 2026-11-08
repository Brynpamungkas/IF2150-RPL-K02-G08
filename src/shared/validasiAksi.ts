import type { DataAksi, JenisAksi, RincianDana } from './aksi';
import { nominalValid } from './dto';
import { GalatValidasi } from './galat';

/** Tanggal kalender Indonesia, bukan tanggal UTC yang berganti pukul 07.00 WIB. */
export function hariIniWib(waktu = new Date()): string {
  return new Date(waktu.getTime() + 7 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
}

export function objekAksi(nilai: unknown): Record<string, unknown> {
  if (!nilai || typeof nilai !== 'object' || Array.isArray(nilai)) {
    throw new GalatValidasi('Badan permintaan harus berupa objek JSON.');
  }
  return nilai as Record<string, unknown>;
}

/** Draft project tahap 1 boleh belum memiliki jadwal/kebutuhan (B.1). */
export function validasiAksi(
  jenis: JenisAksi,
  masukan: unknown,
  lengkap = true,
  hariIni = hariIniWib(),
): DataAksi {
  const b = objekAksi(masukan);
  const galat: Record<string, string> = {};
  const teks = (kunci: string, maks: number, wajib = false): string => {
    const nilai = b[kunci];
    if (nilai == null && !wajib) return '';
    if (
      typeof nilai !== 'string' ||
      (wajib && !nilai.trim()) ||
      nilai.length > maks
    ) {
      galat[kunci] =
        `Isi teks ${wajib ? 'wajib, ' : ''}maksimal ${maks} karakter.`;
      return '';
    }
    return nilai.trim();
  };
  const judul = teks('judul', 200, true);
  const deskripsi = teks('deskripsi', 10000, true);
  const tujuan = teks('tujuan', 10000, jenis === 'project');
  const kategori = teks('kategori', 50);
  const provinsi = teks('provinsi', 100, true);
  const kota = teks('kota', 150, true);
  const kebutuhan = teks('kebutuhan', 10000, jenis === 'project' && lengkap);
  const kriteriaRelawan = teks(
    'kriteriaRelawan',
    10000,
    jenis === 'project' && lengkap,
  );
  const lokasiKumpul = teks(
    'lokasiKumpul',
    255,
    jenis === 'project' && lengkap,
  );

  const koordinat = (kunci: string, batas: number) => {
    const nilai = b[kunci];
    if (nilai == null) return null;
    if (
      typeof nilai !== 'number' ||
      !Number.isFinite(nilai) ||
      Math.abs(nilai) > batas
    ) {
      galat[kunci] = `Koordinat harus berada antara -${batas} dan ${batas}.`;
      return null;
    }
    return nilai;
  };
  const latitude = koordinat('latitude', 90);
  const longitude = koordinat('longitude', 180);
  if ((latitude === null) !== (longitude === null)) {
    galat.latitude = 'Isi latitude dan longitude bersama-sama.';
  }

  const targetDana =
    b.targetDana ?? (jenis === 'project' && !lengkap ? 0 : undefined);
  if (!(jenis === 'project' && targetDana === 0) && !nominalValid(targetDana)) {
    galat.targetDana =
      'Dana harus berupa angka positif, maksimal Rp1 miliar dan dua desimal.';
  }
  const kuotaRelawan = b.kuotaRelawan ?? 0;
  if (
    jenis === 'project' &&
    (!Number.isInteger(kuotaRelawan) ||
      (kuotaRelawan as number) < (lengkap ? 1 : 0) ||
      (kuotaRelawan as number) > 2147483647)
  ) {
    galat.kuotaRelawan = 'Kuota relawan harus berupa bilangan bulat positif.';
  }

  const tanggal = (kunci: string): string | null => {
    const nilai = b[kunci];
    if (nilai == null || nilai === '') {
      if (lengkap || jenis === 'campaign')
        galat[kunci] = 'Tanggal wajib diisi.';
      return null;
    }
    if (
      typeof nilai !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(nilai) ||
      Number.isNaN(Date.parse(nilai)) ||
      new Date(nilai).toISOString().slice(0, 10) !== nilai ||
      nilai < '1000-01-01'
    ) {
      galat[kunci] = 'Tanggal tidak valid (YYYY-MM-DD).';
      return null;
    }
    return nilai;
  };
  const mulai = tanggal('mulai');
  const selesai = tanggal('selesai');
  if (mulai && selesai) {
    if (mulai > selesai || (jenis === 'campaign' && mulai === selesai)) {
      galat.selesai = 'Tanggal selesai harus setelah tanggal mulai.';
    }
    if (selesai < hariIni) galat.selesai = 'Periode kegiatan sudah lewat.';
    if (
      jenis === 'campaign' &&
      Date.parse(selesai) - Date.parse(mulai) > 365 * 86400000
    ) {
      galat.selesai = 'Periode campaign maksimal 365 hari.';
    }
  }
  const rincianDana: RincianDana[] = [];
  if (b.rincianDana != null) {
    if (!Array.isArray(b.rincianDana) || b.rincianDana.length > 50) {
      galat.rincianDana =
        'Rincian dana harus berupa daftar, maksimal 50 baris.';
    } else {
      for (const baris of b.rincianDana) {
        if (
          !baris ||
          typeof baris !== 'object' ||
          typeof baris.label !== 'string' ||
          !baris.label.trim() ||
          baris.label.length > 200 ||
          !nominalValid(baris.nominal)
        ) {
          galat.rincianDana =
            'Setiap rincian memerlukan label dan nominal positif.';
        } else
          rincianDana.push({
            label: baris.label.trim(),
            nominal: baris.nominal,
          });
      }
    }
  }
  if (Object.keys(galat).length)
    throw new GalatValidasi('Periksa kembali isian formulir.', 400, galat);
  return {
    judul,
    deskripsi,
    tujuan,
    kategori,
    provinsi,
    kota,
    latitude,
    longitude,
    targetDana: targetDana as number,
    mulai,
    selesai,
    kebutuhan,
    kriteriaRelawan,
    kuotaRelawan: kuotaRelawan as number,
    lokasiKumpul,
    rincianDana,
  };
}

export function validasiAlasan(nilai: unknown): string {
  if (typeof nilai !== 'string' || !nilai.trim() || nilai.length > 2000) {
    throw new GalatValidasi(
      'Alasan penolakan wajib diisi (maksimal 2000 karakter).',
      400,
      { alasan: 'Jelaskan perbaikan yang diperlukan.' },
    );
  }
  return nilai.trim();
}
