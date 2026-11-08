import { getIdPenggunaSaatIni } from '@/server/auth/sesiSementara';
import { ambilDokumentasiProgres } from '@/server/services/dokumentasiService';
import { isGalatValidasi } from '@/shared/galat';

type Konteks = {
  params: Promise<{ idProject: string; nama: string }>;
};

/**
 * Menyajikan satu berkas dokumentasi progres (UC09, KF24, issue #12).
 *
 * Hak akses diperiksa lebih dulu di `dokumentasiService`, sehingga menebak
 * alamat berkas tidak cukup untuk melihat dokumentasi project yang belum
 * terpublikasi.
 */
export async function GET(
  _request: Request,
  konteks: Konteks,
): Promise<Response> {
  const { idProject, nama } = await konteks.params;

  try {
    const idPengguna = await getIdPenggunaSaatIni();
    const berkas = await ambilDokumentasiProgres(idProject, nama, idPengguna);

    if (!berkas) {
      return Response.json(
        { pesan: 'Berkas dokumentasi tidak ditemukan.' },
        { status: 404 },
      );
    }

    return new Response(new Uint8Array(berkas.isi), {
      status: 200,
      headers: {
        'Content-Type': berkas.tipe,
        'Content-Length': String(berkas.isi.byteLength),
        'Content-Disposition': `inline; filename="${nama}"`,
        // Berkas berasal dari unggahan pengguna: jangan biarkan peramban menebak tipenya.
        'X-Content-Type-Options': 'nosniff',
        'Cache-Control': 'private, max-age=3600',
      },
    });
  } catch (galat) {
    if (isGalatValidasi(galat)) {
      return Response.json({ pesan: galat.message }, { status: galat.status });
    }
    console.error('Gagal menyajikan dokumentasi progres', galat);
    return Response.json(
      { pesan: 'Terjadi kesalahan pada peladen.' },
      { status: 500 },
    );
  }
}
