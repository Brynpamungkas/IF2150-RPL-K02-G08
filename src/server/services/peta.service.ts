import {
  PetaRepository,
  type BarisSebaran,
  type Wilayah,
} from '@/server/repositories/peta.repository';
import { tanggalWib } from '@/server/services/katalog.service';
import type { TitikSebaran } from '@/shared/peta';

export interface SumberSebaran {
  sebaranProject(wilayah?: Wilayah): Promise<BarisSebaran[]>;
  sebaranCampaign(hariIni: string, wilayah?: Wilayah): Promise<BarisSebaran[]>;
}

export function pecahKoordinat(
  teks: string,
): { lat: number; lng: number } | null {
  const cocok = teks.match(/^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/);
  if (!cocok) return null;
  const lat = Number(cocok[1]);
  const lng = Number(cocok[2]);
  return Math.abs(lat) <= 90 && Math.abs(lng) <= 180 ? { lat, lng } : null;
}

function keTitik(b: BarisSebaran): TitikSebaran {
  return {
    tipe: b.tipe,
    id: b.id,
    judul: b.judul,
    kota: b.kota,
    provinsi: b.provinsi,
    kategori: b.kategori,
    latitude: Number(b.latitude),
    longitude: Number(b.longitude),
    targetDana: Number(b.target_dana),
    danaTerkumpul: Number(b.dana_terkumpul),
  };
}

export class PetaWilayah {
  constructor(
    private readonly koordinatPusat = '',
    private readonly radius = 0,
    private readonly repo: SumberSebaran = new PetaRepository(),
    private readonly sekarang: () => Date = () => new Date(),
  ) {}

  private wilayah(): Wilayah | undefined {
    if (this.radius <= 0) return undefined;
    const pusat = pecahKoordinat(this.koordinatPusat);
    if (!pusat) throw new Error('koordinatPusat tidak valid');
    return { ...pusat, radiusKm: this.radius };
  }

  async tampilkanSebaranProject(): Promise<TitikSebaran[]> {
    return (await this.repo.sebaranProject(this.wilayah())).map(keTitik);
  }

  async tampilkanSebaranCampaign(): Promise<TitikSebaran[]> {
    const hariIni = tanggalWib(this.sekarang());
    return (await this.repo.sebaranCampaign(hariIni, this.wilayah())).map(
      keTitik,
    );
  }
}
