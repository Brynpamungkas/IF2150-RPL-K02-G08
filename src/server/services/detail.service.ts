import {
  DetailRepository,
  type BarisDetail,
  type BarisProgres,
} from '@/server/repositories/detail.repository';
import { tanggalWib } from '@/server/services/katalog.service';
import {
  bentukDokumen,
  type DetailAksi,
  type InstruksiRelawan,
  type ProgresItem,
  type RincianDana,
} from '@/shared/detail';
import type { TipeItem } from '@/shared/katalog';

export interface SumberDetail {
  cariProject(id: string): Promise<BarisDetail | null>;
  cariCampaign(id: string): Promise<BarisDetail | null>;
  daftarProgres(idProject: string): Promise<BarisProgres[]>;
  instruksiRelawan(
    idProject: string,
    idPengguna: string,
  ): Promise<string | null>;
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

/**
 * hari ini menurut API donasi. API memakai CURDATE() pada DB berzona UTC
 * (docker-compose TZ=UTC), sedangkan halaman memakai tanggal WIB. untuk batas
 * mulai, pakai tanggal yang lebih awal dari keduanya supaya halaman tidak menawarkan
 * donasi beberapa jam sebelum backend menerimanya.
 */
const tanggalUtc = (waktu: Date): string => waktu.toISOString().slice(0, 10);

function keProgres(b: BarisProgres, idProject: string): ProgresItem {
  return {
    id: b.id,
    milestone: b.milestone,
    status: b.status_pelaksanaan,
    catatan: b.catatan,
    persentase: b.persentase === null ? null : Number(b.persentase),
    danaTerpakai: b.dana_terpakai === null ? null : Number(b.dana_terpakai),
    dokumen: bentukDokumen(idProject, b.dokumentasi_url),
    waktu: b.waktu,
  };
}

export class DetailService {
  constructor(
    private readonly repo: SumberDetail = new DetailRepository(),
    private readonly sekarang: () => Date = () => new Date(),
  ) {}

  /**
   * @param idPengguna pengguna yang sedang melihat (null bila belum login). dipakai
   *   hanya untuk memutuskan apakah instruksi relawan boleh disertakan (KF22).
   */
  async ambil(
    tipe: TipeItem,
    id: string,
    idPengguna: string | null = null,
  ): Promise<DetailAksi | null> {
    const baris =
      tipe === 'project'
        ? await this.repo.cariProject(id)
        : await this.repo.cariCampaign(id);
    if (!baris) return null;

    const progres =
      tipe === 'project'
        ? (await this.repo.daftarProgres(id)).map((b) => keProgres(b, id))
        : [];
    const waktu = this.sekarang();
    const hariIni = tanggalWib(waktu);
    const berlaku = baris.selesai !== null && baris.selesai >= hariIni;
    // campaign hanya menerima donasi dalam periodenya: periode_mulai <= hari ini
    // <= periode_selesai (DPPL Algo-132, sama dengan API donasi). project tidak
    // dibatasi tanggal mulai untuk donasi (Algo-131); tanggal mulai hanya untuk tampilan.
    const mulaiTercapai =
      baris.mulai !== null &&
      baris.mulai <= hariIni &&
      (tipe !== 'campaign' || baris.mulai <= tanggalUtc(waktu));
    const belumMulai = baris.mulai !== null && !mulaiTercapai;
    const periodeDonasiBerlaku =
      tipe === 'campaign' ? berlaku && mulaiTercapai : berlaku;
    const belumSelesai = baris.status_pelaksanaan !== 'selesai';
    const lokasiKumpul =
      tipe === 'project' && idPengguna
        ? await this.repo.instruksiRelawan(id, idPengguna)
        : null;
    const instruksiRelawan: InstruksiRelawan | null = lokasiKumpul
      ? { lokasiKumpul }
      : null;
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
      belumMulai,
      statusPelaksanaan: baris.status_pelaksanaan,
      terbukaDonasi: belumSelesai && periodeDonasiBerlaku,
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
      instruksiRelawan,
      penyelenggara: baris.penyelenggara,
      diverifikasi: baris.diverifikasi,
      rincianDana: bacaRincian(baris.rincian),
      danaTerpakai: Math.max(0, ...progres.map((p) => p.danaTerpakai ?? 0)),
      progres,
    };
  }
}
