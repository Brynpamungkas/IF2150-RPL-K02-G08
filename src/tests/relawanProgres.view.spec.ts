/**
 * Pengujian unit kelas boundary C33, C35, dan C37 (UC07-UC09) untuk HIUPL
 * Subbab 4.2. Komponen dirender ke HTML statis (tanpa peramban), lalu isi
 * dan atribut tombolnya diperiksa.
 */
import { createElement, type FunctionComponent } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { TombolRelawan } from '@/components/detail/aksi/TombolRelawan';
import { FormProgresProjectView } from '@/components/views/ProgresView/FormProgresProjectView';
import { FormPendaftaranRelawanView } from '@/components/views/RelawanView/FormPendaftaranRelawanView';
import { FormVolunteerManagementView } from '@/components/views/RelawanView/FormVolunteerManagementView';
import type { DetailAksi } from '@/shared/detail';
import { periksaBerkasProgres, validasiProgres } from '@/shared/progres';
import type { PendaftaranRelawanDto } from '@/shared/relawan';

const html = <P extends object>(komponen: FunctionComponent<P>, props: P) =>
  renderToStaticMarkup(createElement(komponen, props));

const kosong = () => {};

function detail(ubah: Partial<DetailAksi> = {}): DetailAksi {
  return {
    tipe: 'project',
    id: 'P-1',
    judul: 'Rehabilitasi Mangrove Sayung',
    deskripsi: 'Deskripsi',
    tujuan: null,
    kategori: 'Coastal',
    provinsi: 'Jawa Tengah',
    kota: 'Demak',
    targetDana: 1000,
    danaTerkumpul: 250,
    jumlahDonasi: 3,
    mulai: '2099-01-03',
    selesai: '2099-01-04',
    sisaHari: 10,
    belumMulai: true,
    statusPelaksanaan: 'persiapan',
    terbukaDonasi: true,
    terbukaRelawan: true,
    pendaftaranDibuka: true,
    kuotaRelawan: 10,
    relawanDiterima: 4,
    logistik: [],
    keahlian: ['Penanaman bibit'],
    instruksiRelawan: null,
    penyelenggara: 'Sari',
    diverifikasi: '2026-10-01',
    rincianDana: [],
    danaTerpakai: 0,
    progres: [],
    ...ubah,
  } as DetailAksi;
}

function pendaftar(
  ubah: Partial<PendaftaranRelawanDto> = {},
): PendaftaranRelawanDto {
  return {
    idPendaftaran: 'V-1',
    idProject: 'P-1',
    idVolunteer: 'u1',
    dataDiri: { nama: 'Rina', telepon: '0812-1111-2222', kota: 'Bandung' },
    keahlian: ['Penanaman bibit'],
    pengalaman: 'Bersih pantai',
    jadwal: ['Sat 3 Jan 2099'],
    status: 'pending',
    tanggalDaftar: '2026-11-01T02:00:00Z',
    tanggalKeputusan: null,
    ...ubah,
  };
}

const formRelawan = (mulai: string | null, selesai: string | null) =>
  html(FormPendaftaranRelawanView, {
    idProject: 'P-1',
    judul: 'Rehabilitasi Mangrove Sayung',
    keahlianOpsi: ['Penanaman bibit'],
    mulai,
    selesai,
    onTutup: kosong,
    onBerhasil: kosong,
  });

const kelola = (kuota: number, daftar: PendaftaranRelawanDto[]) =>
  html(FormVolunteerManagementView, {
    idProject: 'P-1',
    judul: 'Rehabilitasi Mangrove Sayung',
    kuota,
    pendaftar: daftar,
    onTutup: kosong,
    onKeputusan: kosong,
  });

/** Tag <button> lengkap yang memuat aria-label tertentu. */
const tombol = (markup: string, label: string) =>
  markup.match(new RegExp(`<button[^>]*aria-label="${label}"[^>]*>`))?.[0] ??
  '';

describe('C33 FormPendaftaranRelawanView', () => {
  it('C33-UT01 tampilkanFormulir: normal, kolom wajib dan pilihan hari tampil', () => {
    const markup = formRelawan('2099-01-03', '2099-01-04');
    for (const label of [
      'Full name',
      'Phone number',
      'City of residence',
      'Your skills',
      'Relevant experience',
      'Days you can attend',
    ])
      expect(markup).toContain(label);
    expect(markup).toContain('Sat 3 Jan 2099');
    expect(markup).toContain('Sun 4 Jan 2099');
  });

  it('C33-UT02 tampilkanFormulir: negatif, periode sudah lewat tidak menawarkan hari', () => {
    const markup = formRelawan('2020-01-03', '2020-01-04');
    expect(markup).toContain('No days are open to choose');
    expect(markup).not.toContain('Jan 2020');
  });

  it('C33-UT03 tekanDaftar: normal, project terbuka menampilkan tombol daftar', () => {
    const markup = html(TombolRelawan, { detail: detail() });
    expect(markup).toContain('Volunteer for this');
    expect(markup).not.toContain('Sign-up closed');
  });

  it('C33-UT04 tekanDaftar: negatif, kuota penuh menampilkan pesan dan tombol nonaktif', () => {
    const markup = html(TombolRelawan, {
      detail: detail({
        terbukaRelawan: false,
        kuotaRelawan: 4,
        relawanDiterima: 4,
      }),
    });
    expect(markup).toContain('Volunteer spots are full');
    expect(markup).toContain('aria-disabled="true"');
    expect(markup).not.toContain('Volunteer for this');
  });
});

describe('C35 FormVolunteerManagementView', () => {
  it('C35-UT01 tampilkanDaftarPendaftar: normal, pendaftar pending tampil lebih dulu dengan detailnya', () => {
    const markup = kelola(10, [
      pendaftar({
        idPendaftaran: 'V-2',
        status: 'accepted',
        dataDiri: { nama: 'Bima', telepon: '0813', kota: 'Solo' },
      }),
      pendaftar(),
    ]);
    expect(markup.indexOf('Rina')).toBeGreaterThan(-1);
    expect(markup.indexOf('Rina')).toBeLessThan(markup.indexOf('Bima'));
    for (const isi of [
      '0812-1111-2222',
      'Penanaman bibit',
      'Bersih pantai',
      'Sat 3 Jan 2099',
    ])
      expect(markup).toContain(isi);
  });

  it('C35-UT02 tampilkanPesanBelumAdaPendaftar: batas, tanpa pendaftar tampil pesan kosong', () => {
    const markup = kelola(10, []);
    expect(markup).toContain('No applications yet');
    expect(markup).not.toContain('aria-label="Accept');
  });

  it('C35-UT03 pilihKeputusan: normal, kuota tersisa sehingga Accept dan Reject aktif', () => {
    const markup = kelola(10, [pendaftar()]);
    expect(tombol(markup, 'Accept Rina')).not.toContain('disabled');
    expect(tombol(markup, 'Reject Rina')).not.toContain('disabled');
  });

  it('C35-UT04 pilihKeputusan: negatif, kuota penuh menonaktifkan Accept tetapi Reject tetap aktif', () => {
    const markup = kelola(1, [
      pendaftar({
        idPendaftaran: 'V-2',
        status: 'accepted',
        dataDiri: { nama: 'Bima', telepon: '0813', kota: 'Solo' },
      }),
      pendaftar(),
    ]);
    expect(tombol(markup, 'Accept Rina')).toContain('disabled');
    expect(tombol(markup, 'Reject Rina')).not.toContain('disabled');
    expect(markup).toContain('All 1 spots are filled');
  });
});

describe('C37 FormProgresProjectView', () => {
  it('C37-UT01 tampilkanFormulir: normal, kolom milestone, status, dan unggahan tampil', () => {
    const markup = html(FormProgresProjectView, {
      idProject: 'P-1',
      judul: 'Rehabilitasi Mangrove Sayung',
      statusAwal: 'berjalan',
      onTutup: kosong,
      onBerhasil: kosong,
    });
    expect(markup).toContain('type="file"');
    for (const status of ['Preparing', 'In progress', 'On hold', 'Completed'])
      expect(markup).toContain(status);
  });

  it('C37-UT02 isiPembaruanMilestone: normal, isian lengkap diubah ke tipe yang benar', () => {
    const hasil = validasiProgres({
      milestone: 'Tahap 1',
      statusPelaksanaan: 'selesai',
      catatan: '',
      persentase: '100',
      danaTerpakai: '0',
    });
    expect(hasil.valid).toBe(true);
    if (hasil.valid) expect(hasil.data.persentase).toBe(100);
  });

  it('C37-UT03 isiPembaruanMilestone: negatif, persentase 101 ditolak', () => {
    const hasil = validasiProgres({
      milestone: 'Tahap 1',
      statusPelaksanaan: 'berjalan',
      catatan: '',
      persentase: '101',
      danaTerpakai: '',
    });
    expect(hasil.valid).toBe(false);
    if (!hasil.valid) expect(Object.keys(hasil.galat)).toEqual(['persentase']);
  });

  it('C37-UT04 unggahDokumentasi: negatif, format di luar gambar dan PDF ditolak', () => {
    for (const [nama, tipe] of [
      ['video.mp4', 'video/mp4'],
      ['arsip.zip', 'application/zip'],
      ['program.exe', 'application/octet-stream'],
    ])
      expect(periksaBerkasProgres([{ nama, tipe, ukuran: 1000 }])).toContain(
        nama,
      );
  });
});
