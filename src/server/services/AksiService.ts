import { randomUUID } from 'node:crypto';
import { withTransaction } from '@/server/db';
import { wajibPeranAksi, type PenggunaAksi } from '@/server/auth/aksesAksi';
import { AksiRepository as repo } from '@/server/repositories/AksiRepository';
import { dapatDiedit, type Aksi, type JenisAksi } from '@/shared/aksi';
import { GalatValidasi } from '@/shared/galat';
import { objekAksi, validasiAksi, validasiAlasan } from '@/shared/validasiAksi';

function ditemukan(aksi: Aksi | null): Aksi {
  if (!aksi) throw new GalatValidasi('Aksi tidak ditemukan.', 404);
  return aksi;
}
function milik(aksi: Aksi, pengguna: PenggunaAksi): void {
  if (aksi.idPembuat !== pengguna.id)
    throw new GalatValidasi('Aksi tidak ditemukan.', 404);
}
function bolehEdit(aksi: Aksi): void {
  if (!dapatDiedit(aksi.status))
    throw new GalatValidasi(
      'Hanya Draft atau Ditolak yang dapat diubah/diajukan.',
      409,
    );
}
function tahapInformasi(
  jenis: JenisAksi,
  badan: Record<string, unknown>,
): boolean {
  if (
    badan.tahap != null &&
    badan.tahap !== 'informasi' &&
    badan.tahap !== 'lengkap'
  ) {
    throw new GalatValidasi('Tahap formulir tidak valid.');
  }
  return jenis === 'project' && badan.tahap === 'informasi';
}

export const AksiService = {
  async buat(
    pengguna: PenggunaAksi,
    jenis: JenisAksi,
    badan: unknown,
  ): Promise<Aksi> {
    wajibPeranAksi(pengguna, 'pembuat_project');
    const b = objekAksi(badan);
    const data = validasiAksi(jenis, b, !tahapInformasi(jenis, b));
    const id = randomUUID();
    // Pemilik/status berasal dari server, bukan idPembuat/status dalam JSON.
    await repo.buat(jenis, id, pengguna.id, data);
    return ditemukan(await repo.cari(jenis, id));
  },
  async lihat(
    pengguna: PenggunaAksi,
    jenis: JenisAksi,
    id: string,
  ): Promise<Aksi> {
    const aksi = ditemukan(await repo.cari(jenis, id));
    if (pengguna.peran !== 'admin') milik(aksi, pengguna);
    return aksi;
  },
  async ubah(
    pengguna: PenggunaAksi,
    jenis: JenisAksi,
    id: string,
    badan: unknown,
  ): Promise<Aksi> {
    wajibPeranAksi(pengguna, 'pembuat_project');
    const b = objekAksi(badan);
    return withTransaction(async (conn) => {
      const aksi = ditemukan(await repo.cari(jenis, id, conn));
      milik(aksi, pengguna);
      bolehEdit(aksi);
      const data = validasiAksi(
        jenis,
        { ...aksi, ...b },
        !tahapInformasi(jenis, b),
      );
      await repo.ubah(jenis, id, pengguna.id, data, conn);
      return ditemukan(await repo.cari(jenis, id, conn));
    });
  },
  async ajukan(
    pengguna: PenggunaAksi,
    jenis: JenisAksi,
    id: string,
  ): Promise<Aksi> {
    wajibPeranAksi(pengguna, 'pembuat_project');
    return withTransaction(async (conn) => {
      // Lock menjamin data yang divalidasi tidak berubah di antara validasi dan pengajuan.
      const aksi = ditemukan(await repo.cari(jenis, id, conn));
      milik(aksi, pengguna);
      bolehEdit(aksi);
      validasiAksi(jenis, aksi);
      if (!(await repo.ajukan(jenis, id, pengguna.id, conn)))
        throw new GalatValidasi('Status aksi sudah berubah.', 409);
      return ditemukan(await repo.cari(jenis, id, conn));
    });
  },
  async milikSaya(pengguna: PenggunaAksi): Promise<Aksi[]> {
    wajibPeranAksi(pengguna, 'pembuat_project');
    return repo.daftar({ idPembuat: pengguna.id });
  },
  async antrean(pengguna: PenggunaAksi): Promise<Aksi[]> {
    wajibPeranAksi(pengguna, 'admin');
    return repo.daftar({ status: 'menunggu_verifikasi' });
  },
  async putuskan(
    pengguna: PenggunaAksi,
    jenis: JenisAksi,
    id: string,
    badan: unknown,
  ): Promise<Aksi> {
    wajibPeranAksi(pengguna, 'admin');
    const b = objekAksi(badan);
    if (b.keputusan !== 'setujui' && b.keputusan !== 'tolak')
      throw new GalatValidasi('Keputusan tidak valid.');
    const status = b.keputusan === 'setujui' ? 'terpublikasi' : 'ditolak';
    const alasan = status === 'ditolak' ? validasiAlasan(b.alasan) : null;
    return withTransaction(async (conn) => {
      const aksi = ditemukan(await repo.cari(jenis, id, conn));
      if (aksi.status !== 'menunggu_verifikasi')
        throw new GalatValidasi(
          'Pengajuan ini sudah diproses atau belum diajukan.',
          409,
        );
      // Jangan publikasikan periode yang kedaluwarsa saat menunggu review.
      if (status === 'terpublikasi') validasiAksi(jenis, aksi);
      if (!(await repo.putuskan(jenis, id, status, alasan, conn)))
        throw new GalatValidasi('Status aksi sudah berubah.', 409);
      return ditemukan(await repo.cari(jenis, id, conn));
    });
  },
};
