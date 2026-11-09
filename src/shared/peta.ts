export const LEBAR_PETA = 960;
export const TINGGI_PETA = 350;

const PULAU: [number, number][][] = [
  [
    [95.3, 5.6],
    [97.5, 5.2],
    [98.7, 3.8],
    [100.4, 2.2],
    [101.4, 1.8],
    [103, 0.5],
    [103.8, -1],
    [104.6, -2.3],
    [105.9, -3.2],
    [105.8, -5.8],
    [104.6, -5.9],
    [103.3, -4.9],
    [102.2, -3.9],
    [101, -2.6],
    [100.3, -1],
    [99.2, 0.2],
    [98.6, 1.7],
    [97.6, 2.8],
    [96.4, 4],
    [95.2, 5],
  ],
  [
    [105.2, -6.8],
    [106, -6],
    [107, -5.9],
    [108.3, -6.3],
    [109.5, -6.8],
    [110.4, -6.9],
    [111, -6.4],
    [112.6, -6.9],
    [113.5, -7.2],
    [114.5, -7.8],
    [114.4, -8.6],
    [112.5, -8.4],
    [110.5, -8.1],
    [108.3, -7.8],
    [106.4, -7.4],
    [105.5, -6.9],
  ],
  [
    [114.5, -8.1],
    [115.2, -8.1],
    [115.7, -8.4],
    [115.2, -8.8],
    [114.6, -8.5],
  ],
  [
    [116, -8.3],
    [116.7, -8.3],
    [117.5, -8.3],
    [118.8, -8.3],
    [119, -8.7],
    [117.5, -9],
    [116.2, -8.9],
  ],
  [
    [119.8, -8.4],
    [121, -8.4],
    [122.9, -8.2],
    [122.8, -8.6],
    [121, -8.9],
    [119.9, -8.8],
  ],
  [
    [119, -9.5],
    [120.2, -9.4],
    [120.8, -10.1],
    [119.6, -9.9],
  ],
  [
    [123.5, -10.2],
    [124.4, -9.4],
    [125.1, -9],
    [124.9, -9.6],
    [124, -10.3],
  ],
  [
    [108.9, 1.6],
    [109.6, 2],
    [111, 1.5],
    [112.5, 1.6],
    [114, 1.5],
    [115.5, 3],
    [116.5, 4.3],
    [117.6, 4.2],
    [117.9, 2],
    [118.9, 1],
    [117.7, 0.5],
    [117.4, -0.7],
    [116.8, -1.5],
    [116.5, -3],
    [115.9, -3.9],
    [114.6, -4.1],
    [113, -3.2],
    [111.6, -3.4],
    [110.2, -2.9],
    [110, -1.5],
    [109, -0.3],
    [108.9, 0.8],
  ],
  [
    [118.8, -2.7],
    [119.4, -1],
    [119.8, 0.2],
    [120.3, 0.9],
    [121.5, 1],
    [123, 0.9],
    [124.3, 1.2],
    [125.2, 1.6],
    [124.6, 0.5],
    [123.3, 0.4],
    [121.9, 0.5],
    [120.6, 0.4],
    [120.8, -0.8],
    [121.6, -1],
    [122.9, -0.8],
    [121.3, -1.8],
    [122.3, -3],
    [123.2, -4.6],
    [122.5, -4.9],
    [121.5, -4],
    [121, -2.8],
    [120.4, -3],
    [120.4, -5.5],
    [119.5, -5.6],
    [119.4, -4],
    [118.9, -3.4],
  ],
  [
    [127.6, 1.8],
    [128, 2.3],
    [128, 1.2],
    [128.7, 1],
    [128, 0.6],
    [128.5, -0.6],
    [127.8, -0.3],
    [127.5, 0.7],
  ],
  [
    [128, -3.2],
    [129.5, -2.8],
    [130.8, -3.4],
    [130, -3.6],
    [128.4, -3.6],
  ],
  [
    [126, -3.2],
    [127.2, -3.3],
    [126.8, -3.9],
    [126.1, -3.7],
  ],
  [
    [131, -1.4],
    [132, -0.5],
    [133.5, -0.7],
    [134.2, -1],
    [134.5, -2.4],
    [135.5, -3.3],
    [136.9, -2.3],
    [138, -1.6],
    [139.5, -2.2],
    [141, -2.6],
    [141, -9.1],
    [140, -8.1],
    [138.9, -8.4],
    [137.8, -8],
    [138, -7],
    [137.2, -5],
    [135.8, -4.5],
    [134.2, -3.9],
    [133, -4.1],
    [132.4, -3],
    [133, -2.5],
    [131.8, -2],
  ],
  [
    [105.7, -2],
    [106.6, -2.4],
    [106.9, -3.1],
    [105.9, -2.9],
  ],
  [
    [127.9, -3.6],
    [128.3, -3.5],
    [128.3, -3.8],
  ],
];

export function proyeksi(
  longitude: number,
  latitude: number,
): [number, number] {
  return [
    Number(((longitude - 94.5) * 20).toFixed(1)),
    Number(((6.4 - latitude) * 20).toFixed(1)),
  ];
}

export const PATH_PULAU = PULAU.map(
  (poligon) =>
    'M' +
    poligon.map(([lon, lat]) => proyeksi(lon, lat).join(',')).join('L') +
    'Z',
).join('');

export interface TitikPeta {
  tipe: TipeTitik;
  id: string;
  latitude: number;
  longitude: number;
}

export function aturPin(titik: TitikPeta[]): Record<string, [number, number]> {
  const posisi: Record<string, [number, number]> = {};
  const terpasang: [number, number][] = [];
  for (const t of titik) {
    let [x, y] = proyeksi(t.longitude, t.latitude);
    let k = 0;
    while (
      terpasang.some(([qx, qy]) => Math.hypot(qx - x, qy - y) < 24) &&
      k < 12
    ) {
      const sudut = k * 2.4;
      x += Math.cos(sudut) * 22;
      y += Math.sin(sudut) * 22;
      k++;
    }
    terpasang.push([x, y]);
    posisi[kunciTitik(t)] = [Number(x.toFixed(1)), Number(y.toFixed(1))];
  }
  return posisi;
}

export function letakPopup(
  x: number,
  y: number,
): {
  kiri: number;
  atas: number;
  dibawah: boolean;
} {
  const kiri = Math.min(Math.max((x / LEBAR_PETA) * 100, 2), 62);
  const atas = (y / TINGGI_PETA) * 100;
  return { kiri, atas, dibawah: atas < 55 };
}

export type TipeTitik = 'project' | 'campaign';

/** satu titik pada peta sebaran (hasil GET /api/peta). */
export interface TitikSebaran extends TitikPeta {
  judul: string;
  kota: string;
  provinsi: string;
  kategori: string | null;
  targetDana: number;
  danaTerkumpul: number;
}

export const JENIS_SEBARAN = ['semua', 'project', 'campaign'] as const;
export type JenisSebaran = (typeof JENIS_SEBARAN)[number];

/**
 * identitas satu titik di peta. project dan campaign berasal dari tabel berbeda,
 * jadi id yang sama pada keduanya tetap valid; id saja tidak cukup untuk
 * memilih, menyorot, atau mencari posisi sebuah marker.
 */
export const kunciTitik = (t: Pick<TitikPeta, 'tipe' | 'id'>): string =>
  `${t.tipe}-${t.id}`;
