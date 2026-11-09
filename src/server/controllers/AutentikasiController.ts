import { cookies } from 'next/headers';
import { NAMA_COOKIE_SESI, opsiCookieSesi } from '@/server/sesi';
import { AutentikasiService } from '@/server/services/AutentikasiService';
import type { PenggunaDto } from '@/shared/autentikasi';
import { bacaObjek, gagal, sukses, teks } from './respons';

/** C16 AutentikasiController */
export class AutentikasiController {
  constructor(private readonly service = new AutentikasiService()) {}

  async daftarAkun(request: Request): Promise<Response> {
    try {
      const b = await bacaObjek(request);
      const pengguna = await this.service.daftarAkun({
        nama: teks(b.nama),
        email: teks(b.email),
        password: teks(b.password),
      });
      return sukses<PenggunaDto>(pengguna, 201);
    } catch (error) {
      return gagal(error);
    }
  }

  async login(request: Request): Promise<Response> {
    try {
      const b = await bacaObjek(request);
      const { sesi, pengguna } = await this.service.login({
        email: teks(b.email),
        password: teks(b.password),
      });
      const jar = await cookies();
      jar.set(NAMA_COOKIE_SESI, sesi.idSesi, opsiCookieSesi);
      return sukses<PenggunaDto>(pengguna);
    } catch (error) {
      return gagal(error);
    }
  }

  async logout(): Promise<Response> {
    try {
      const jar = await cookies();
      await this.service.logout(jar.get(NAMA_COOKIE_SESI)?.value);
      jar.delete(NAMA_COOKIE_SESI);
      return sukses(null);
    } catch (error) {
      return gagal(error);
    }
  }

  /** Pengguna yang sedang login (null bila tamu), untuk menggambar navbar. */
  async saya(): Promise<Response> {
    try {
      const jar = await cookies();
      const pengguna = await this.service.penggunaDariSesi(
        jar.get(NAMA_COOKIE_SESI)?.value,
      );
      return sukses<PenggunaDto | null>(pengguna);
    } catch (error) {
      return gagal(error);
    }
  }
}
