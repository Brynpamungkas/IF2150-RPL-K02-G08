import {
  DetailRepository,
  type BarisDetail,
  type BarisProgres,
} from '@/server/repositories/detail.repository';
import { tanggalWib } from '@/server/services/katalog.service';
import type { DetailAksi, ProgresItem, RincianDana } from '@/shared/detail';
import type { TipeItem } from '@/shared/katalog';

export interface SumberDetail {
  cariProject(id: string): Promise<BarisDetail | null>;
  cariCampaign(id: string): Promise<BarisDetail | null>;
  daftarProgres(idProject: string): Promise<BarisProgres[]>;
}

const MS_PER_HARI = 86_400_000;

export function pecahDaftar(teks: string | null, pemisah: string): string[] {
  if (!teks) return [];
  return teks
    .split(pemisah)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function bacaRincian(mentah: unknown): RincianDana[] {
  let data = mentah;
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data);
    } catch {
      return [];
    }
  }
  if (!Array.isArray(data)) return [];
  return data.flatMap((e: unknown) => {
    const baris = e as { uraian?: unknown; nominal?: unknown } | null;
    const nominal = Number(baris?.nominal);
    if (typeof baris?.uraian !== 'string' || !Number.isFinite(nominal)) {
      return [];
    }
    return [{ uraian: baris.uraian, nominal }];
  });
}

export function hitungSisaHari(
  selesai: string | null,
  hariIni: string,
): number | null {
  if (!selesai) return null;
  const selisih =
    Date.parse(`${selesai}T00:00:00Z`) - Date.parse(`${hariIni}T00:00:00Z`);
  return Math.round(selisih / MS_PER_HARI);
}

function keProgres(b: BarisProgres): ProgresItem {
  return {
    id: b.id,
    milestone: b.milestone,
    status: b.status_pelaksanaan,
    catatan: b.catatan,
    persentase: b.persentase === null ? null : Number(b.persentase),
    danaTerpakai: b.dana_terpakai === null ? null : Number(b.dana_terpakai),
    dokumen: pecahDaftar(b.dokumentasi_url, ','),
    waktu: b.waktu,
  };
}

export class DetailService {
  constructor(
    private readonly repo: SumberDetail = new DetailRepository(),
    private readonly sekarang: () => Date = () => new Date(),
  ) {}

  async ambil(tipe: TipeItem, id: string): Promise<DetailAksi | null> {
    const baris =
      tipe === 'project'
        ? await this.repo.cariProject(id)
        : await this.repo.cariCampaign(id);
    if (!baris) return null;

    const progres =
      tipe === 'project'
        ? (await this.repo.daftarProgres(id)).map(keProgres)
        : [];
    const hariIni = tanggalWib(this.sekarang());
    const berlaku = baris.selesai !== null && baris.selesai >= hariIni;
    const belumSelesai = baris.status_pelaksanaan !== 'selesai';
    const kuota = baris.kuota === null ? null : Number(baris.kuota);
    const diterima =
      baris.relawan_diterima === null ? null : Number(baris.relawan_diterima);
    const pendaftaranDibuka = Number(baris.pendaftaran_dibuka) === 1;

    return {
      tipe,
      id: baris.id,
      judul: baris.judul,
      deskripsi: baris.deskripsi,
      tujuan: baris.tujuan,
      kategori: baris.kategori,
      provinsi: baris.provinsi,
      kota: baris.kota,
      targetDana: Number(baris.target_dana),
      danaTerkumpul: Number(baris.dana_terkumpul),
      jumlahDonasi: Number(baris.jumlah_donasi),
      mulai: baris.mulai,
      selesai: baris.selesai,
      sisaHari: hitungSisaHari(baris.selesai, hariIni),
      statusPelaksanaan: baris.status_pelaksanaan,
      terbukaDonasi: belumSelesai && berlaku,
      terbukaRelawan:
        tipe === 'project' &&
        pendaftaranDibuka &&
        belumSelesai &&
        berlaku &&
        (diterima ?? 0) < (kuota ?? 0),
      pendaftaranDibuka,
      kuotaRelawan: kuota,
      relawanDiterima: diterima,
      logistik: pecahDaftar(baris.logistik, ';'),
      keahlian: pecahDaftar(baris.keahlian, ';'),
      lokasiKumpul: baris.lokasi_kumpul,
      penyelenggara: baris.penyelenggara,
      diverifikasi: baris.diverifikasi,
      rincianDana: bacaRincian(baris.rincian),
      danaTerpakai: Math.max(0, ...progres.map((p) => p.danaTerpakai ?? 0)),
      progres,
    };
  }
}
