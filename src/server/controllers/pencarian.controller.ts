import { KatalogService } from '@/server/services/katalog.service';
import {
  BATAS_DEFAULT,
  BATAS_MAKS,
  FILTER_PERIODE,
  FILTER_STATUS,
  FILTER_TIPE,
  KATA_KUNCI_MAKS,
  type FilterKatalog,
  type HasilKatalog,
  type OpsiKatalog,
} from '@/shared/katalog';

/** parameter tidak valid. pesan aman ditampilkan ke pengguna, dipetakan ke HTTP 400. */
export class GalatValidasi extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'GalatValidasi';
  }
}

/** parameter kosong/hanya spasi dianggap tidak diisi (form Explore mengirim select kosong). */
function ambil(params: URLSearchParams, nama: string): string | undefined {
  const nilai = params.get(nama)?.trim();
  return nilai ? nilai : undefined;
}

function ambilTeks(params: URLSearchParams, nama: string): string | undefined {
  const nilai = ambil(params, nama);
  if (nilai !== undefined && nilai.length > KATA_KUNCI_MAKS) {
    throw new GalatValidasi(
      `Parameter ${nama} maksimal ${KATA_KUNCI_MAKS} karakter.`,
    );
  }
  return nilai;
}

function ambilPilihan<T extends string>(
  params: URLSearchParams,
  nama: string,
  pilihan: readonly T[],
): T | undefined {
  const nilai = ambil(params, nama);
  if (nilai === undefined) return undefined;
  if (!(pilihan as readonly string[]).includes(nilai)) {
    throw new GalatValidasi(
      `Parameter ${nama} harus salah satu dari: ${pilihan.join(', ')}.`,
    );
  }
  return nilai as T;
}

function ambilBulat(
  params: URLSearchParams,
  nama: string,
  bawaan: number,
  min: number,
  maks: number,
): number {
  const nilai = ambil(params, nama);
  if (nilai === undefined) return bawaan;
  if (!/^\d+$/.test(nilai) || Number(nilai) < min || Number(nilai) > maks) {
    throw new GalatValidasi(
      `Parameter ${nama} harus bilangan bulat ${min} sampai ${maks}.`,
    );
  }
  return Number(nilai);
}

/**
 * terimaKataKunci + terapkanFilter: membaca dan memvalidasi query string menjadi FilterKatalog.
 * parameter: q, tipe, kategori, lokasi, status, periode, halaman, batas.
 */
export function bacaFilter(params: URLSearchParams): FilterKatalog {
  return {
    kataKunci: ambilTeks(params, 'q'),
    tipe: ambilPilihan(params, 'tipe', FILTER_TIPE) ?? 'semua',
    kategori: ambilTeks(params, 'kategori'),
    lokasi: ambilTeks(params, 'lokasi'),
    status: ambilPilihan(params, 'status', FILTER_STATUS),
    periode: ambilPilihan(params, 'periode', FILTER_PERIODE),
    halaman: ambilBulat(params, 'halaman', 1, 1, 1_000_000),
    batas: ambilBulat(params, 'batas', BATAS_DEFAULT, 1, BATAS_MAKS),
  };
}

/** PencarianController tidak memerlukan login */
export class PencarianController {
  constructor(
    private readonly katalog: KatalogService = new KatalogService(),
  ) {}

  /** cari: pencarian dengan kata kunci dan filter yang dapat dikombinasikan. */
  async cari(params: URLSearchParams): Promise<HasilKatalog> {
    return this.katalog.cari(bacaFilter(params));
  }

  /** getDaftarDipublikasikan: semua yang terpublikasi tanpa kata kunci atau filter. */
  async getDaftarDipublikasikan(
    halaman = 1,
    batas = BATAS_DEFAULT,
  ): Promise<HasilKatalog> {
    return this.katalog.cari({ tipe: 'semua', halaman, batas });
  }

  /** opsi dropdown filter untuk halaman Explore. */
  async getOpsi(): Promise<OpsiKatalog> {
    return this.katalog.getOpsi();
  }
}
