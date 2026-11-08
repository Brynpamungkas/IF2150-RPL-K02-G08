import {
  KatalogRepository,
  type BarisKatalog,
  type KonteksTanggal,
} from '@/server/repositories/katalog.repository';
import {
  KATEGORI,
  PERIODE_SEGERA_HARI,
  type FilterKatalog,
  type HasilKatalog,
  type ItemKatalog,
  type OpsiKatalog,
} from '@/shared/katalog';

/** bagian repository yang dipakai service */
export interface SumberKatalog {
  cari(
    filter: FilterKatalog,
    tanggal: KonteksTanggal,
  ): Promise<{ baris: BarisKatalog[]; total: number }>;
  daftarProvinsi(): Promise<string[]>;
}

const ZONA_WAKTU = 'Asia/Jakarta';

/** tgl kalender (YYYY-MM-DD) pada zona WIB */
export function tanggalWib(waktu: Date): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: ZONA_WAKTU }).format(
    waktu,
  );
}

export function tambahHari(tanggal: string, hari: number): string {
  const d = new Date(`${tanggal}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + hari);
  return d.toISOString().slice(0, 10);
}

export function hitungPersen(terkumpul: number, target: number): number {
  return target > 0 ? Math.round((terkumpul / target) * 100) : 0;
}

export function keItem(b: BarisKatalog): ItemKatalog {
  return {
    id: b.id,
    tipe: b.tipe,
    judul: b.judul,
    deskripsi: b.deskripsi,
    kategori: b.kategori,
    provinsi: b.provinsi,
    kota: b.kota,
    latitude: b.latitude === null ? null : Number(b.latitude),
    longitude: b.longitude === null ? null : Number(b.longitude),
    targetDana: Number(b.target_dana),
    danaTerkumpul: Number(b.dana_terkumpul),
    persenCapaian: hitungPersen(
      Number(b.dana_terkumpul),
      Number(b.target_dana),
    ),
    mulai: b.mulai,
    selesai: b.selesai,
    statusPelaksanaan: b.status_pelaksanaan,
    terbukaDonasi: Number(b.terbuka_donasi) === 1,
    terbukaRelawan: Number(b.terbuka_relawan) === 1,
    kuotaRelawan: b.kuota === null ? null : Number(b.kuota),
    relawanDiterima:
      b.relawan_diterima === null ? null : Number(b.relawan_diterima),
  };
}

/** katalog: pencarian dan penyaringan project dan campaign terpublikasi. */
export class KatalogService {
  constructor(
    private readonly repo: SumberKatalog = new KatalogRepository(),
    private readonly sekarang: () => Date = () => new Date(),
  ) {}

  async cari(filter: FilterKatalog): Promise<HasilKatalog> {
    const hariIni = tanggalWib(this.sekarang());
    const tanggal: KonteksTanggal = {
      hariIni,
      batasSegera: tambahHari(hariIni, PERIODE_SEGERA_HARI),
    };
    const { baris, total } = await this.repo.cari(filter, tanggal);
    return {
      data: baris.map(keItem),
      total,
      halaman: filter.halaman,
      batas: filter.batas,
    };
  }

  /** isi dropdown filter: kategori baku dan provinsi yang benar-benar punya data. */
  async getOpsi(): Promise<OpsiKatalog> {
    return { kategori: KATEGORI, provinsi: await this.repo.daftarProvinsi() };
  }
}
