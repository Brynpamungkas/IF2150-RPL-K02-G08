import { randomUUID } from 'node:crypto';
import { mkdir, readFile, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

import {
  DOKUMENTASI_EKSTENSI_DIIZINKAN,
  periksaBerkasDokumentasi,
} from '@/shared/dokumentasi';
import { GalatValidasi } from '@/shared/galat';

/**
 * Penyimpanan berkas dokumentasi progres (UC09, KF24, issue #12).
 *
 * DPPL menyebut berkas disimpan pada layanan penyimpanan objek. Implementasi
 * ini memakai sistem berkas lokal agar aplikasi dapat dijalankan tanpa akun
 * layanan awan. Perbedaan tersebut dicatat pada laporan B.1.
 *
 * Seluruh akses berkas melewati antarmuka `PenyimpananDokumentasi`, sehingga
 * penggantian ke penyimpanan objek nanti cukup menambah satu implementasi baru
 * dan satu cabang pada `getPenyimpananDokumentasi()`; lapisan service dan route
 * tidak perlu diubah.
 */

export type BerkasTersimpan = {
  /** Nama berkas di penyimpanan, bukan nama asli dari pengguna. */
  nama: string;
  /** Alamat untuk disimpan pada kolom `progres_project.dokumentasi_url`. */
  url: string;
  tipe: string;
  ukuran: number;
};

export type IsiBerkas = {
  isi: Buffer;
  tipe: string;
};

export interface PenyimpananDokumentasi {
  simpan(idProject: string, berkas: File): Promise<BerkasTersimpan>;
  baca(idProject: string, nama: string): Promise<IsiBerkas | null>;
  hapus(idProject: string, nama: string): Promise<void>;
}

/** `id_project` pada skema adalah VARCHAR(36); dibatasi agar tidak membentuk path. */
const POLA_ID_PROJECT = /^[A-Za-z0-9_-]{1,36}$/;

/** Nama berkas selalu UUID v4 ditambah ekstensi yang kita tentukan sendiri. */
const POLA_NAMA = new RegExp(
  `^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\\.(${DOKUMENTASI_EKSTENSI_DIIZINKAN.join(
    '|',
  )})$`,
);

/**
 * Beberapa byte pertama tiap format. Tipe MIME yang dikirim peramban dapat
 * dipalsukan, jadi isi berkas diperiksa sekali lagi di peladen sebelum ditulis.
 */
const TANDA_TANGAN: Readonly<Record<string, readonly number[][]>> = {
  'image/jpeg': [[0xff, 0xd8, 0xff]],
  'image/png': [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  'image/webp': [[0x52, 0x49, 0x46, 0x46]], // "RIFF", lalu "WEBP" pada offset 8
  'application/pdf': [[0x25, 0x50, 0x44, 0x46, 0x2d]], // "%PDF-"
};

/** Kebalikan dari DOKUMENTASI_TIPE_DIIZINKAN, dipakai saat menyajikan berkas. */
const MIME_DARI_EKSTENSI: Readonly<Record<string, string>> = {
  jpg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  pdf: 'application/pdf',
};

function cocokTandaTangan(isi: Buffer, tipe: string): boolean {
  const pola = TANDA_TANGAN[tipe];
  if (!pola) return false;
  const cocok = pola.some((bytes) =>
    bytes.every((byte, index) => isi[index] === byte),
  );
  if (!cocok) return false;
  if (tipe === 'image/webp') {
    return isi.subarray(8, 12).toString('ascii') === 'WEBP';
  }
  return true;
}

function pastikanIdProject(idProject: string): string {
  if (!POLA_ID_PROJECT.test(idProject)) {
    throw new GalatValidasi('Project tidak dikenal.', 404);
  }
  return idProject;
}

function pastikanNama(nama: string): string {
  if (!POLA_NAMA.test(nama)) {
    throw new GalatValidasi('Berkas dokumentasi tidak ditemukan.', 404);
  }
  return nama;
}

/** Akar penyimpanan lokal. Dapat dipindahkan lewat `DOKUMENTASI_DIR`. */
function akarPenyimpanan(): string {
  return path.resolve(
    process.env.DOKUMENTASI_DIR ?? path.join(process.cwd(), 'uploads'),
  );
}

/**
 * Menyusun path berkas dan memastikan hasilnya tetap berada di dalam akar
 * penyimpanan, sebagai lapis pengaman kedua setelah pemeriksaan pola di atas.
 */
function pathBerkas(idProject: string, nama: string): string {
  const akar = akarPenyimpanan();
  const berkas = path.resolve(akar, 'progres', idProject, nama);
  if (berkas !== path.join(akar, 'progres', idProject, nama)) {
    throw new GalatValidasi('Berkas dokumentasi tidak ditemukan.', 404);
  }
  return berkas;
}

class PenyimpananLokal implements PenyimpananDokumentasi {
  async simpan(idProject: string, berkas: File): Promise<BerkasTersimpan> {
    pastikanIdProject(idProject);

    const hasil = periksaBerkasDokumentasi({
      nama: berkas.name,
      tipe: berkas.type,
      ukuran: berkas.size,
    });
    if (!hasil.valid) {
      throw new GalatValidasi(hasil.pesan);
    }

    const isi = Buffer.from(await berkas.arrayBuffer());
    if (!cocokTandaTangan(isi, berkas.type)) {
      throw new GalatValidasi(
        'Isi berkas tidak sesuai dengan formatnya. Unggah ulang berkas aslinya.',
      );
    }

    const nama = `${randomUUID()}.${hasil.ekstensi}`;
    const tujuan = pathBerkas(idProject, nama);
    await mkdir(path.dirname(tujuan), { recursive: true });
    await writeFile(tujuan, isi, { flag: 'wx' });

    return {
      nama,
      url: `/api/dokumentasi/${idProject}/${nama}`,
      tipe: berkas.type,
      ukuran: isi.byteLength,
    };
  }

  async baca(idProject: string, nama: string): Promise<IsiBerkas | null> {
    pastikanIdProject(idProject);
    pastikanNama(nama);

    try {
      const isi = await readFile(pathBerkas(idProject, nama));
      const ekstensi = nama.slice(nama.lastIndexOf('.') + 1);
      return {
        isi,
        tipe: MIME_DARI_EKSTENSI[ekstensi] ?? 'application/octet-stream',
      };
    } catch (galat) {
      if ((galat as NodeJS.ErrnoException).code === 'ENOENT') return null;
      throw galat;
    }
  }

  async hapus(idProject: string, nama: string): Promise<void> {
    pastikanIdProject(idProject);
    pastikanNama(nama);
    try {
      await unlink(pathBerkas(idProject, nama));
    } catch (galat) {
      if ((galat as NodeJS.ErrnoException).code !== 'ENOENT') throw galat;
    }
  }
}

const penyimpananLokal = new PenyimpananLokal();

/**
 * Titik tukar penyimpanan. Nilai `DOKUMENTASI_DRIVER` saat ini hanya `lokal`;
 * menambah penyimpanan objek cukup dilakukan di sini.
 */
export function getPenyimpananDokumentasi(): PenyimpananDokumentasi {
  const driver = process.env.DOKUMENTASI_DRIVER ?? 'lokal';
  if (driver !== 'lokal') {
    throw new Error(
      `DOKUMENTASI_DRIVER "${driver}" belum didukung. Nilai yang tersedia: lokal.`,
    );
  }
  return penyimpananLokal;
}
