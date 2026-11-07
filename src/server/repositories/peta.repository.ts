import type { RowDataPacket } from 'mysql2/promise';
import { query } from '@/server/db';

export interface Wilayah {
  lat: number;
  lng: number;
  radiusKm: number;
}

export interface BarisSebaran extends RowDataPacket {
  tipe: 'project' | 'campaign';
  id: string;
  judul: string;
  kota: string;
  provinsi: string;
  kategori: string | null;
  latitude: string;
  longitude: string;
  target_dana: string;
  dana_terkumpul: string;
}

const SQL_PROJECT = `
SELECT 'project' AS tipe, id_project AS id, nama AS judul, kota, provinsi, kategori,
       latitude, longitude, kebutuhan_dana AS target_dana, dana_terkumpul
  FROM project
 WHERE status = 'terpublikasi' AND latitude IS NOT NULL AND longitude IS NOT NULL`;

const SQL_CAMPAIGN = `
SELECT 'campaign' AS tipe, id_campaign AS id, judul, kota, provinsi, kategori,
       latitude, longitude, target_nominal AS target_dana, dana_terkumpul
  FROM campaign
 WHERE status = 'terpublikasi' AND periode_selesai >= ?
   AND latitude IS NOT NULL AND longitude IS NOT NULL`;

const DALAM_RADIUS =
  ' AND ST_Distance_Sphere(POINT(longitude, latitude), POINT(?, ?)) <= ?';

function denganWilayah(
  sql: string,
  params: unknown[],
  wilayah?: Wilayah,
): [string, unknown[]] {
  if (!wilayah) return [sql, params];
  return [
    sql + DALAM_RADIUS,
    [...params, wilayah.lng, wilayah.lat, wilayah.radiusKm * 1000],
  ];
}

export class PetaRepository {
  sebaranProject(wilayah?: Wilayah): Promise<BarisSebaran[]> {
    const [sql, params] = denganWilayah(SQL_PROJECT, [], wilayah);
    return query<BarisSebaran>(sql, params);
  }

  sebaranCampaign(hariIni: string, wilayah?: Wilayah): Promise<BarisSebaran[]> {
    const [sql, params] = denganWilayah(SQL_CAMPAIGN, [hariIni], wilayah);
    return query<BarisSebaran>(sql, params);
  }
}
