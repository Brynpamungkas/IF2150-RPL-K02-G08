import { keDto } from '@/models/ProgresProject';
import { getIdPenggunaSaatIni } from '@/server/auth/sesiSementara';
import { jalankan } from '@/server/http';
import {
  perbaruiProgres,
  riwayatProgres,
} from '@/server/services/progresService';
import { GalatValidasi } from '@/shared/galat';
import { bacaFormProgres } from '@/shared/progres';

/**
 * C38 ProgresController (UC09, issue #36).
 * Membaca permintaan HTTP dan sesi, memanggil `progresService`, lalu menyusun
 * respons. Aturan bisnis tidak ditaruh di sini.
 */

/** POST /api/projects/[idProject]/progres: pembaruan progres (multipart/form-data). */
export function perbarui(
  request: Request,
  idProject: string,
): Promise<Response> {
  return jalankan(async () => {
    const idPengguna = await getIdPenggunaSaatIni();

    let formData: FormData;
    try {
      formData = await request.formData();
    } catch {
      throw new GalatValidasi(
        'Format permintaan tidak valid. Kirim sebagai multipart/form-data.',
      );
    }

    const progres = await perbaruiProgres(
      idPengguna,
      idProject,
      bacaFormProgres(formData),
    );
    return Response.json(
      { pesan: 'Progres berhasil diperbarui.', progres: keDto(progres) },
      { status: 201 },
    );
  }, 'Gagal menyimpan pembaruan progres');
}

/** GET /api/projects/[idProject]/progres: riwayat progres, terbaru lebih dulu. */
export function lihatRiwayat(idProject: string): Promise<Response> {
  return jalankan(async () => {
    const idPengguna = await getIdPenggunaSaatIni();
    const riwayat = await riwayatProgres(idPengguna, idProject);
    return Response.json({ progres: riwayat.map(keDto) });
  }, 'Gagal mengambil riwayat progres');
}
