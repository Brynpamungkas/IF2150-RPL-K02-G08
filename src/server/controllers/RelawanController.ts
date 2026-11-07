import { keDto } from '@/models/PendaftaranRelawan';
import { getIdPenggunaSaatIni } from '@/server/auth/sesiSementara';
import { bacaJson, jalankan } from '@/server/http';
import {
  daftarPendaftar,
  daftarRelawan,
  putuskanPendaftaran,
} from '@/server/services/relawanService';

/**
 * C34 RelawanController (UC07 dan UC08, issue #31 dan #33).
 * Membaca permintaan HTTP dan sesi, memanggil `relawanService`, lalu
 * menyusun respons. Aturan bisnis tidak ditaruh di sini.
 */

/** POST /api/projects/[idProject]/relawan: pendaftaran relawan baru (UC07). */
export function daftar(request: Request, idProject: string): Promise<Response> {
  return jalankan(async () => {
    const idPengguna = await getIdPenggunaSaatIni();
    const pendaftaran = await daftarRelawan(
      idPengguna,
      idProject,
      await bacaJson(request),
    );
    return Response.json(
      {
        pesan: 'Pendaftaran berhasil dikirim dan menunggu keputusan.',
        pendaftaran: keDto(pendaftaran),
      },
      { status: 201 },
    );
  }, 'Gagal memproses pendaftaran relawan');
}

/** GET /api/projects/[idProject]/relawan: daftar pendaftar, khusus pemilik (UC08). */
export function lihatPendaftar(idProject: string): Promise<Response> {
  return jalankan(async () => {
    const idPengguna = await getIdPenggunaSaatIni();
    const daftarPendaftarProject = await daftarPendaftar(idPengguna, idProject);
    return Response.json({ pendaftar: daftarPendaftarProject.map(keDto) });
  }, 'Gagal mengambil daftar pendaftar relawan');
}

/** PATCH /api/projects/[idProject]/relawan/[idPendaftaran]: terima atau tolak (UC08). */
export function putuskan(
  request: Request,
  idProject: string,
  idPendaftaran: string,
): Promise<Response> {
  return jalankan(async () => {
    const idPengguna = await getIdPenggunaSaatIni();
    const badan = (await bacaJson(request)) as { keputusan?: unknown } | null;
    const pendaftaran = await putuskanPendaftaran(
      idPengguna,
      idProject,
      idPendaftaran,
      badan?.keputusan,
    );
    return Response.json({
      pesan:
        pendaftaran.status === 'accepted'
          ? 'Pendaftaran diterima.'
          : 'Pendaftaran ditolak.',
      pendaftaran: keDto(pendaftaran),
    });
  }, 'Gagal menyimpan keputusan pendaftaran');
}
