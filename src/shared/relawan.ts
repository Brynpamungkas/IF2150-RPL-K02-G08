/**
 * Aturan pendaftaran relawan (UC07, UC08, KF19-KF22, issue #31 dan #33).
 *
 * Modul ini murni: tidak menyentuh basis data, sehingga dipakai bersama oleh
 * peladen (RelawanController, C34) dan peramban (FormPendaftaranRelawanView,
 * C33). Pesan kesalahan yang dilihat pengguna sebelum dan sesudah formulir
 * terkirim dengan begitu selalu sama.
 */

export const STATUS_PENDAFTARAN = ['pending', 'accepted', 'rejected'] as const;
export type StatusPendaftaran = (typeof STATUS_PENDAFTARAN)[number];

/** Keputusan yang dapat dijatuhkan pemilik project (KF21). */
export const KEPUTUSAN_PENDAFTARAN = ['accepted', 'rejected'] as const;
export type KeputusanPendaftaran = (typeof KEPUTUSAN_PENDAFTARAN)[number];

export type DataDiriRelawan = {
  nama: string;
  telepon: string;
  kota: string;
};

/** Isian formulir pendaftaran relawan. */
export type FormPendaftaranRelawan = {
  dataDiri: DataDiriRelawan;
  keahlian: string[];
  pengalaman: string;
  jadwal: string[];
};

/** Nama kolom formulir yang dapat menerima pesan kesalahan. */
export type KolomForm =
  'nama' | 'telepon' | 'kota' | 'keahlian' | 'pengalaman' | 'jadwal';

export type GalatForm = Partial<Record<KolomForm, string>>;

/** Bentuk pendaftaran yang dikirim API kepada peramban. */
export type PendaftaranRelawanDto = {
  idPendaftaran: string;
  idProject: string;
  idVolunteer: string;
  dataDiri: DataDiriRelawan;
  keahlian: string[];
  pengalaman: string;
  jadwal: string[];
  status: StatusPendaftaran;
  tanggalDaftar: string;
  tanggalKeputusan: string | null;
};

export const BATAS_FORM = {
  nama: 100,
  kota: 100,
  pengalaman: 2000,
  butir: 100,
  jumlahButir: 20,
} as const;

/** Angka, spasi, dan tanda hubung, boleh diawali "+". Kolom basis data 20 karakter. */
const POLA_TELEPON = /^\+?[0-9][0-9 -]{6,18}$/;

/** Pemisah antarbutir saat disimpan sebagai satu kolom teks. */
const PEMISAH_KEAHLIAN = ', ';
const PEMISAH_JADWAL = '; ';
const PEMISAH_DATA_DIRI = '; ';

function teks(nilai: unknown): string {
  return typeof nilai === 'string' ? nilai.trim() : '';
}

function daftarTeks(nilai: unknown): string[] {
  if (!Array.isArray(nilai)) return [];
  return nilai.map(teks).filter((butir) => butir.length > 0);
}

/**
 * Mengubah masukan mentah (misalnya hasil `request.json()`) menjadi bentuk
 * formulir yang aman diperiksa. Nilai yang bukan teks dianggap kosong.
 */
export function bersihkanForm(mentah: unknown): FormPendaftaranRelawan {
  const objek =
    typeof mentah === 'object' && mentah !== null
      ? (mentah as Record<string, unknown>)
      : {};
  const dataDiri =
    typeof objek.dataDiri === 'object' && objek.dataDiri !== null
      ? (objek.dataDiri as Record<string, unknown>)
      : {};

  return {
    dataDiri: {
      nama: teks(dataDiri.nama),
      telepon: teks(dataDiri.telepon),
      kota: teks(dataDiri.kota),
    },
    keahlian: daftarTeks(objek.keahlian),
    pengalaman: teks(objek.pengalaman),
    jadwal: daftarTeks(objek.jadwal),
  };
}

function periksaDaftar(
  butir: string[],
  pemisah: string,
  kosong: string,
  namaButir: string,
): string | undefined {
  if (butir.length === 0) return kosong;
  if (butir.length > BATAS_FORM.jumlahButir) {
    return `Maksimal ${BATAS_FORM.jumlahButir} ${namaButir}.`;
  }
  const kunci = pemisah.trim();
  for (const isi of butir) {
    if (isi.length > BATAS_FORM.butir) {
      return `Setiap ${namaButir} maksimal ${BATAS_FORM.butir} karakter.`;
    }
    if (isi.includes(kunci)) {
      return `Setiap ${namaButir} tidak boleh mengandung tanda "${kunci}". Pisahkan menjadi butir tersendiri.`;
    }
  }
  return undefined;
}

/**
 * Memeriksa kelengkapan formulir (KF19): data diri, keahlian, pengalaman, dan
 * jadwal wajib diisi. Hasil kosong berarti formulir valid.
 */
export function validasiFormPendaftaran(
  form: FormPendaftaranRelawan,
): GalatForm {
  const galat: GalatForm = {};
  const { nama, telepon, kota } = form.dataDiri;

  if (!nama) galat.nama = 'Nama lengkap wajib diisi.';
  else if (nama.length > BATAS_FORM.nama)
    galat.nama = `Nama maksimal ${BATAS_FORM.nama} karakter.`;
  else if (nama.includes(';')) galat.nama = 'Nama tidak boleh mengandung ";".';

  if (!telepon) galat.telepon = 'Nomor telepon wajib diisi.';
  else if (!POLA_TELEPON.test(telepon))
    galat.telepon =
      'Nomor telepon tidak valid. Gunakan angka, contoh 0812-3344-5566.';

  if (!kota) galat.kota = 'Kota domisili wajib diisi.';
  else if (kota.length > BATAS_FORM.kota)
    galat.kota = `Kota maksimal ${BATAS_FORM.kota} karakter.`;
  else if (kota.includes(';')) galat.kota = 'Kota tidak boleh mengandung ";".';

  const galatKeahlian = periksaDaftar(
    form.keahlian,
    PEMISAH_KEAHLIAN,
    'Pilih atau isi minimal satu keahlian.',
    'keahlian',
  );
  if (galatKeahlian) galat.keahlian = galatKeahlian;

  if (!form.pengalaman) galat.pengalaman = 'Pengalaman wajib diisi.';
  else if (form.pengalaman.length > BATAS_FORM.pengalaman)
    galat.pengalaman = `Pengalaman maksimal ${BATAS_FORM.pengalaman} karakter.`;

  const galatJadwal = periksaDaftar(
    form.jadwal,
    PEMISAH_JADWAL,
    'Pilih minimal satu jadwal yang tersedia.',
    'jadwal',
  );
  if (galatJadwal) galat.jadwal = galatJadwal;

  return galat;
}

/** Menyatukan data diri menjadi satu teks, sesuai format pada data seed. */
export function formatDataDiri(dataDiri: DataDiriRelawan): string {
  return [
    `Nama: ${dataDiri.nama}`,
    `Telepon: ${dataDiri.telepon}`,
    `Kota: ${dataDiri.kota}`,
  ].join(PEMISAH_DATA_DIRI);
}

/** Kebalikan `formatDataDiri`. Bagian yang tidak ditemukan menjadi teks kosong. */
export function bacaDataDiri(teksData: string): DataDiriRelawan {
  const ambil = (kunci: string): string => {
    const cocok = teksData.match(new RegExp(`${kunci}:\\s*([^;]*)`));
    return cocok ? cocok[1].trim() : '';
  };
  return {
    nama: ambil('Nama'),
    telepon: ambil('Telepon'),
    kota: ambil('Kota'),
  };
}

export function formatKeahlian(keahlian: string[]): string {
  return keahlian.join(PEMISAH_KEAHLIAN);
}

export function bacaKeahlian(teksKeahlian: string | null): string[] {
  return bacaDaftar(teksKeahlian, ',');
}

export function formatJadwal(jadwal: string[]): string {
  return jadwal.join(PEMISAH_JADWAL);
}

export function bacaJadwal(teksJadwal: string | null): string[] {
  return bacaDaftar(teksJadwal, ';');
}

function bacaDaftar(nilai: string | null, pemisah: string): string[] {
  if (!nilai) return [];
  return nilai
    .split(pemisah)
    .map((butir) => butir.trim())
    .filter((butir) => butir.length > 0);
}

export function isKeputusan(nilai: unknown): nilai is KeputusanPendaftaran {
  return (
    typeof nilai === 'string' &&
    (KEPUTUSAN_PENDAFTARAN as readonly string[]).includes(nilai)
  );
}

/**
 * Satu pendaftaran milik pengguna sendiri beserta ringkasan project-nya,
 * untuk tab "Volunteer applications" (UC07, KF22, issue #35).
 */
export type PendaftaranSayaDto = {
  idPendaftaran: string;
  idProject: string;
  namaProject: string;
  kota: string;
  provinsi: string;
  /** Periode kegiatan project (YYYY-MM-DD), bisa kosong bila belum diisi. */
  jadwalMulai: string | null;
  jadwalSelesai: string | null;
  /** Hari yang dipilih relawan saat mendaftar. */
  jadwal: string[];
  status: StatusPendaftaran;
  tanggalDaftar: string;
  tanggalKeputusan: string | null;
  /**
   * Titik kumpul. Hanya terisi bila status `accepted` (KF22); selama pending
   * atau rejected nilainya `null` dan tidak ikut dikirim ke peramban.
   */
  lokasiKumpul: string | null;
};

/** Titik kumpul hanya boleh dilihat relawan yang pendaftarannya diterima (KF22). */
export function lokasiKumpulUntuk(
  status: StatusPendaftaran,
  lokasiKumpul: string | null,
): string | null {
  if (status !== 'accepted') return null;
  const bersih = lokasiKumpul?.trim();
  return bersih ? bersih : null;
}
