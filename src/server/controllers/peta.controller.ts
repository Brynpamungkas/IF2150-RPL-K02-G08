import { GalatValidasi } from '@/server/controllers/pencarian.controller';
import { PetaWilayah, pecahKoordinat } from '@/server/services/peta.service';
import {
  JENIS_SEBARAN,
  type JenisSebaran,
  type TitikSebaran,
} from '@/shared/peta';

const RADIUS_MAKS_KM = 20_000;

export interface PermintaanSebaran {
  jenis: JenisSebaran;
  koordinatPusat: string;
  radius: number;
}

export function bacaPermintaan(params: URLSearchParams): PermintaanSebaran {
  const jenis = params.get('jenis')?.trim() || 'semua';
  if (!(JENIS_SEBARAN as readonly string[]).includes(jenis)) {
    throw new GalatValidasi(
      `Parameter jenis harus salah satu dari: ${JENIS_SEBARAN.join(', ')}.`,
    );
  }

  const teksRadius = params.get('radius')?.trim() || '0';
  const radius = Number(teksRadius);
  if (!Number.isFinite(radius) || radius < 0 || radius > RADIUS_MAKS_KM) {
    throw new GalatValidasi(
      `Parameter radius harus angka 0 sampai ${RADIUS_MAKS_KM} (kilometer).`,
    );
  }

  const koordinatPusat = params.get('pusat')?.trim() ?? '';
  if (radius > 0 && !pecahKoordinat(koordinatPusat)) {
    throw new GalatValidasi('Parameter pusat harus berformat "lat,lng".');
  }

  return { jenis: jenis as JenisSebaran, koordinatPusat, radius };
}

export class PetaController {
  constructor(
    private readonly buatPeta: (
      koordinatPusat: string,
      radius: number,
    ) => PetaWilayah = (koordinat, radius) =>
      new PetaWilayah(koordinat, radius),
  ) {}

  async getSebaran(params: URLSearchParams): Promise<TitikSebaran[]> {
    const { jenis, koordinatPusat, radius } = bacaPermintaan(params);
    const peta = this.buatPeta(koordinatPusat, radius);
    const [project, campaign] = await Promise.all([
      jenis === 'campaign' ? [] : peta.tampilkanSebaranProject(),
      jenis === 'project' ? [] : peta.tampilkanSebaranCampaign(),
    ]);
    return [...project, ...campaign];
  }
}
