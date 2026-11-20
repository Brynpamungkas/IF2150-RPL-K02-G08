<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 10
<br>
HASIL IMPLEMENTASI DAN UJI PERANGKAT LUNAK (HIUPL)
</h1>
<br>

## KlimPooL
<p align="left">
  <img src="./assets/logo.png" width="100%">
</p>

### Untuk: Made Branenda Jordhy

Dipersiapkan oleh:
| Informasi | Keterangan |
| --- | --- |
| Kelas | 02 |
| Kelompok | 08  |
 
| NIM | Nama |
|---|---|
| 13525023 | Shaquille Nathan Kalevi |
| 13525080 | Neysa Alya Mukhbita |
| 13525092 | Bryan Pamungkas Prahara |
| 13525134 | Sahla Nailah Salsabilla |
| 13525140 | Nayla Putri Ghaisani |
---

## Daftar Isi

- [BAB 1: Pendahuluan](#bab-1-pendahuluan)
  - [1.1 Tujuan Penulisan Dokumen](#11-tujuan-penulisan-dokumen)
  - [1.2 Lingkup Masalah](#12-lingkup-masalah)
  - [1.3 Definisi, Istilah, dan Singkatan](#13-definisi-istilah-dan-singkatan)
  - [1.4 Aturan Penomoran](#14-aturan-penomoran)
  - [1.5 Referensi](#15-referensi)
  - [1.6 Deskripsi Umum Dokumen (Ikhtisar)](#16-deskripsi-umum-dokumen-ikhtisar)
- [BAB 2: Deskripsi Umum Perangkat Lunak](#bab-2-deskripsi-umum-perangkat-lunak)
- [BAB 3: Implementasi](#bab-3-implementasi)
  - [3.1 Lingkungan Implementasi](#31-lingkungan-implementasi)
  - [3.2 Implementasi Modul](#32-implementasi-modul)
  - [3.3 Implementasi Antarmuka](#33-implementasi-antarmuka)
  - [3.4 File Lain](#34-file-lain)
- [BAB 4: Hasil Pengujian](#bab-4-hasil-pengujian)
  - [4.1 Strategi dan Kedalaman Pengujian Kelas](#41-strategi-dan-kedalaman-pengujian-kelas)
  - [4.2 Pengujian Unit Kelas](#42-pengujian-unit-kelas)
  - [4.3 Pengujian Integrasi](#43-pengujian-integrasi)
  - [4.4 Pengujian Use Case](#44-pengujian-use-case)
  - [4.5 Pengujian Kebutuhan Non-Fungsional (KNF)](#45-pengujian-kebutuhan-non-fungsional-knf)
  - [4.6 Tangkapan Layar dan Bukti Hasil Pengujian](#46-tangkapan-layar-dan-bukti-hasil-pengujian)
- [BAB 5: Traceability](#bab-5-traceability)

---

## Daftar Perubahan

| Revisi | Deskripsi |
| :--- | :--- |
| A | Melengkapi Bab 1 berdasarkan SKPL, APL, DPPL, dan laporan Implementasi Tugas 9; menggunakan kode `main` terbaru sebagai acuan pengujian UC02–UC04. |
| B | Menambahkan pemetaan implementasi dan strategi pengujian 12 kelas UC02–UC04. |
| C | Mencatat 68 kasus unit, coverage tujuh modul aksi, integrasi MySQL, dan hasil browser UC02–UC04 beserta batas pengujiannya. |
| D | Melampirkan bukti aktual, pengukuran tahap KNF03, traceability KF05–KF12, dan deklarasi AI Bryan. |
| E | Menggabungkan pembaruan UC05 dari main `9527672`; ID integrasi aksi menjadi INT-TC31–TC37 dan IK-16–IK-19 agar tidak berbenturan. |
| F | Merapikan bukti dan pembahasan agar berfokus pada pengujian UC02–UC04. |

---

# BAB 1: Pendahuluan

## 1.1 Tujuan Penulisan Dokumen
Dokumen HIUPL melaporkan implementasi dan hasil uji KlimPooL terhadap SKPL dan DPPL. Isinya mencakup pemetaan file, pengujian, bukti, dan traceability sebagai bahan pemeriksaan tim dan asisten IF2150.

## 1.2 Lingkup Masalah
KlimPooL adalah aplikasi web untuk penggalangan dana dan kegiatan aksi iklim di Indonesia. Fitur utamanya meliputi autentikasi, pengajuan dan verifikasi aksi, katalog/peta, donasi, relawan, progres, serta riwayat. Data disimpan di MySQL; top-up hanya simulasi tanpa pembayaran nyata. Pengujian UC02–UC04 memakai kode `main` commit `b35ab49` beserta tambahan tes, tanpa mengubah fitur.

Dokumen disinkronkan dengan `main` commit `9527672` setelah pengujian. Pembaruan tersebut hanya mengubah HIUPL; kode fitur `src/` tetap identik dengan acuan uji.

## 1.3 Definisi, Istilah, dan Singkatan
Istilah berikut digunakan dalam pembahasan implementasi dan pengujian KlimPooL.

Tabel 1.3. Definisi Istilah dan Singkatan

| Singkatan, Akronim, atau Istilah | Penjelasan |
| :--- | :--- |
| *P/L* | *Singkatan dari Perangkat Lunak, yaitu aplikasi yang memberikan perintah kepada komputer untuk menjalankan tugas tertentu.* |
| *SKPL* | *Singkatan dari Spesifikasi Kebutuhan Perangkat Lunak, yaitu dokumen yang merangkum kriteria-kriteria yang diperlukan untuk membangun aplikasi menjalankan tugasnya.* |
| *DPPL* | *Singkatan dari Deskripsi Perancangan Perangkat Lunak, yaitu dokumen yang menjelaskan rancangan arsitektur, kelas, dan antarmuka P/L.* |
| *HIUPL* | *Singkatan dari Hasil Implementasi dan Uji Perangkat Lunak, yaitu dokumen yang melaporkan hasil implementasi dan pengujian P/L.* |
| *KF* | *Singkatan dari Kebutuhan Fungsional.* |
| *KNF* | *Singkatan dari Kebutuhan Non-Fungsional.* |
| *UC* | *Singkatan dari Use Case.* |
| *TC* | *Singkatan dari Test Case, yaitu satu kasus uji untuk skenario tertentu.* |
| *UT* | *Singkatan dari Unit Test, yaitu test case tingkat kelas/operasi.* |
| *INT* | *Singkatan dari Integration Test, yaitu test case yang menguji interaksi antarkomponen.* |
| *APL* | *Arsitektur Perangkat Lunak, dokumen yang menjelaskan susunan komponen dan lapisan sistem.* |
| *Boundary (kasus uji)* | *Nilai batas masukan, misalnya minimum, maksimum, atau tepat di ambang aturan. Berbeda dari kelas boundary pada DPPL yang merupakan kelas antarmuka.* |
| *Coverage* | *Persentase baris/cabang kode yang dieksekusi oleh pengujian.* |
| *Campaign* | *Kegiatan penggalangan dana dengan target nominal dan periode penggalangan.* |
| *Project* | *Kegiatan aksi iklim yang mencatat lokasi, jadwal, kebutuhan dana/logistik, dan kebutuhan relawan.* |
| *Commit acuan* | *Identitas versi kode yang diuji. Pengujian UC02–UC04 menggunakan commit `b35ab49` dari `main` beserta tambahan kasus ujinya.* |
| *Pass / Fail* | *Kesimpulan berdasarkan kesesuaian hasil aktual dengan hasil yang diharapkan; kegagalan disertai penyebab dan usulan perbaikan.* |

## 1.4 Aturan Penomoran
ID kebutuhan, use case, kelas, dan antarmuka mengikuti SKPL dan DPPL. ID pengujian dibedakan menurut tingkat pengujiannya agar tabel hasil, bukti, dan matriks kerunutan dapat saling dirujuk.

Tabel 1.4. Aturan Penomoran

| Hal/Bagian | Penomoran | Keterangan |
| :--- | :--- | :--- |
| *Kebutuhan Fungsional* | *KFXX* | *Sesuai SKPL* |
| *Kebutuhan Non-Fungsional* | *KNFXX* | *Sesuai SKPL* |
| *Use Case* | *UCXX* | *Sesuai SKPL* |
| *Kelas* | *CXX* | *Sesuai DPPL* |
| *Antarmuka* | *I-XX* | *Sesuai DPPL* |
| *Test Case Unit* | *CXX-UTYY* | *XX adalah nomor kelas, YY adalah nomor urut test case unit pada kelas tersebut* |
| *Test Case Integrasi* | *INT-TCYY* | *YY adalah nomor urut test case integrasi* |
| *Test Case Use Case* | *UCXX-TCYY* | *XX adalah nomor use case, YY adalah nomor urut test case pada use case tersebut* |
| *Test Case KNF* | *KNFXX-TCYY* | *XX adalah nomor KNF, YY adalah nomor urut test case pada KNF tersebut* |

## 1.5 Referensi
1. Kelompok 08 Kelas 02. [Spesifikasi Kebutuhan Perangkat Lunak KlimPooL (Tugas 5)](../M5/K02_G08_SKPL.md).
2. Kelompok 08 Kelas 02. [Arsitektur Perangkat Lunak KlimPooL (Tugas 6)](../M6/K02_G08_APL.md).
3. Kelompok 08 Kelas 02. [Deskripsi Perancangan Perangkat Lunak KlimPooL (Tugas 8)](../M8/K02_G08_DPPL2.md).
4. Kelompok 08 Kelas 02. [Laporan Implementasi KlimPooL (Tugas 9)](../M9/K02_G08_Implementasi.md), terutama B.1 dan B.5.
5. Kelompok 08 Kelas 02. [Kode KlimPooL pada commit `b35ab49`](https://github.com/Brynpamungkas/IF2150-RPL-K02-G08/commit/b35ab49), acuan pengujian UC02–UC04.
6. [Dokumentasi Next.js](https://nextjs.org/docs), [Node.js test runner](https://nodejs.org/docs/latest-v20.x/api/test.html), [Vitest](https://vitest.dev/guide/), dan [MySQL 8.4](https://dev.mysql.com/doc/refman/8.4/en/).

## 1.6 Deskripsi Umum Dokumen (Ikhtisar)
Bab 1 berisi pendahuluan; Bab 2 menjelaskan aplikasi; Bab 3 memetakan implementasi; Bab 4 memuat hasil dan bukti pengujian; Bab 5 menyajikan traceability.

<br>

---

# BAB 2: Deskripsi Umum Perangkat Lunak

KlimPooL adalah aplikasi web yang menghubungkan masyarakat dengan kegiatan aksi iklim dan penanganan bencana di berbagai wilayah Indonesia melalui katalog dan peta interaktif. Pengguna dapat menelusuri kegiatan berdasarkan wilayah, membaca kebutuhan yang belum terpenuhi, lalu berkontribusi dengan dana (donasi dari saldo di dalam aplikasi) atau tenaga (mendaftar sebagai relawan). Setiap pengguna juga dapat mengajukan *campaign* penggalangan dana atau *project* aksi iklim. Seluruh pengajuan diverifikasi Admin Sistem sebelum dipublikasikan. Pembuat Project kemudian memperbarui progres, dokumentasi, dan penggunaan dana, sehingga Donatur dan Volunteer dapat menelusuri hasil kontribusinya.

Sistem menerima masukan dari empat aktor melalui antarmuka web, yaitu Pembuat Project, Donatur, Volunteer, dan Admin Sistem. Seluruh data akun, *campaign*, *project*, saldo, transaksi, pendaftaran relawan, dan riwayat progres disimpan pada basis data MySQL internal. Aplikasi dibangun dengan *Layered Architecture* (View → Controller → Service → Repository → MySQL) dan *Client-Server Architecture* sesuai DPPL.

**Batasan dan keterkaitan dengan sistem lain:**

- KlimPooL **tidak terhubung dengan sistem eksternal**, baik lembaga keuangan maupun basis data lembaga lain.
- Pengisian saldo (*top-up*) hanya disimulasikan di dalam aplikasi layaknya *payment gateway dummy*, sehingga tidak ada perpindahan dana nyata.
- Donasi diproses dalam satu *database transaction* yang atomik: validasi saldo, pengurangan saldo Donatur, penambahan dana tujuan, dan pencatatan transaksi. Bila satu tahap gagal, seluruh perubahan dibatalkan.
- Pelaksanaan kegiatan di lapangan (penanaman, distribusi logistik, pemulihan lingkungan), logistik fisik, dan penjadwalan terperinci berada di luar perangkat lunak. Perangkat lunak hanya mencatat, mengoordinasikan, dan melaporkan kegiatan tersebut.
- Cakupan wilayah terbatas pada Indonesia. Data kegiatan yang ditampilkan adalah data tiruan susunan tim.

<p align="center">
<img alt="Use Case Diagram KlimPooL" src="../M5/assets/diagram/diagramUC.png" width="90%">
</p>
<p align="center">
<i>Gambar 2.1. Use Case Diagram KlimPooL</i>
</p>

Gambar 2.1 memperlihatkan sepuluh *use case* yang dilayani KlimPooL. Pengguna Umum (Pembuat Project, Donatur, dan Volunteer) melakukan pendaftaran dan autentikasi (UC01), mencari dan menelusuri project (UC05), serta melihat riwayat dan penelusuran (UC10). Pembuat Project membuat *campaign* (UC02) dan *project* (UC03), mengelola pendaftaran relawan (UC08), serta memperbarui progres (UC09). Admin Sistem meninjau dan memverifikasi pengajuan (UC04) dan juga dapat memperbarui progres (UC09). Donatur melakukan transaksi donasi (UC06), sedangkan Volunteer mendaftar pada project (UC07).

Tabel 2.1. Ringkasan Use Case

| ID | Nama Use Case | Aktor | KF |
| :--- | :--- | :--- | :--- |
| UC01 | Melakukan Pendaftaran dan Autentikasi | Pengguna Umum | KF01–KF04 |
| UC02 | Membuat Campaign Penggalangan Donasi | Pembuat Project | KF05–KF07 |
| UC03 | Membuat Project Aksi Iklim | Pembuat Project | KF08–KF10 |
| UC04 | Meninjau dan Memverifikasi Project | Pembuat Project, Admin Sistem | KF11, KF12 |
| UC05 | Mencari dan Menelusuri Project | Pengguna Umum | KF13, KF14 |
| UC06 | Melakukan Transaksi Donasi | Donatur | KF15–KF18, KF26 |
| UC07 | Mendaftar Sebagai Volunteer | Volunteer | KF19, KF20 |
| UC08 | Mengelola Pendaftaran Relawan | Pembuat Project | KF21, KF22 |
| UC09 | Memperbarui Progres Project | Pembuat Project, Admin Sistem | KF23–KF25 |
| UC10 | Melihat Riwayat dan Penelusuran | Pengguna Umum | KF27 |

<br>

---


# BAB 3: Implementasi 

Bab ini memuat elemen perangkat lunak KlimPooL yang telah dikembangkan (kelas, komponen antarmuka, *route handler*, konfigurasi, skema basis data, dan file pengujian) serta perbedaannya terhadap rancangan DPPL. Penelusuran lengkap kelas perancangan ke implementasi ada pada Tabel B.5 dan perubahan rancangan pada Tabel B.1 laporan Implementasi (Tugas 9).

## 3.1 Lingkungan Implementasi

Tabel 3.1. Lingkungan Implementasi

| Aspek | Keterangan |
| :--- | :--- |
| *Hardware* | Lenovo IdeaPad dengan prosesor AMD Ryzen 5 (pengembangan UC01). Pengujian UC02–UC04: AMD Ryzen AI 7 350 (16 *logical CPU*). |
| *Operating System* | Windows 11 (pengembangan dan pengujian sebagian besar modul); Linux Debian 13 x86_64 (pengujian UC02–UC04). |
| *Bahasa Pemrograman* | TypeScript 5.9.3 pada Node.js (`.nvmrc` 20, `engines` ≥ 20; pengujian memakai Node.js 20.19.2 dan 24.13.0). SQL untuk skema dan *query* MySQL. |
| *Framework/Library* | Next.js 16.4.4 (App Router; *route handler* di `src/app/api/` sebagai API REST JSON), React 19.3.0, Tailwind CSS 4, `mysql2` 3.24.6 (*connection pool* dan transaksi), `bcryptjs` 3.0.3 (hash kata sandi bcrypt *cost* 12). |
| *DBMS* | MySQL 8.4 (InnoDB, `utf8mb4`) melalui Docker Compose, kontainer `klimpool-db`, port 3307. |
| *Development Tools* | Visual Studio Code, Git dan GitHub (*branch* fitur, *pull request* dengan *reviewer*, *semantic commit*), npm, Docker Desktop, ESLint 9, Prettier 3, `tsc`. |
| *Testing Tools* | *Test runner* bawaan Node.js (`node:test` dengan `tsx` 4.23, file `*.test.ts`, *coverage* `node --experimental-test-coverage`); Vitest 3.2.7 (file `*.spec.ts`, *coverage* `@vitest/coverage-v8` lewat `npx`); Playwright Chromium (`scripts/*.browser.mjs`); Chrome DevTools; `autocannon` lewat `npx` untuk uji beban. |

Perbedaan dari DPPL §2.1: DPPL menargetkan Vercel (Node.js 22 LTS, HTTPS/TLS 1.2). Aplikasi tidak di-*deploy* dan hanya dijalankan secara lokal, sehingga seluruh pengujian memakai *build* produksi lokal (`npm run build` lalu `npm run start`) melalui HTTP *loopback*. Akibatnya HTTPS/TLS belum terverifikasi (KNF05-TC02). Berkas dokumentasi progres disimpan di folder lokal `src/uploads/` (`DOKUMENTASI_DRIVER=lokal`), bukan layanan penyimpanan objek seperti rancangan DPPL §2.1.

## 3.2 Implementasi Modul

Seluruh kelas perancangan DPPL (C00–C41). Path relatif terhadap akar repositori. Satu kelas perancangan dapat diwujudkan oleh beberapa file, dan satu file dapat mewujudkan beberapa kelas (Tabel B.5).

Tabel 3.2. Implementasi Modul

| No | ID Kelas | Nama Modul/Kelas | Nama File Fisik | Nama File Executable |
| :--- | :--- | :--- | :--- | :--- |
| 1 | C00 | PenggunaUmum | `src/models/PenggunaUmum.ts`, `src/shared/autentikasi.ts` (`Peran`, `PenggunaDto`) | - |
| 2 | C01 | Katalog | `src/server/services/katalog.service.ts`, `src/server/repositories/katalog.repository.ts`, `src/shared/katalog.ts` | `GET /api/katalog`, `GET /api/katalog/opsi` |
| 3 | C02 | Project | `src/shared/aksi.ts`, `src/shared/validasiAksi.ts`, `src/server/services/AksiService.ts`, `src/server/repositories/AksiRepository.ts`, `src/server/repositories/CampaignProjectRepository.ts` | Server Next.js |
| 4 | C03 | Campaign | `src/shared/aksi.ts`, `src/shared/validasiAksi.ts`, `src/server/services/AksiService.ts`, `src/server/repositories/AksiRepository.ts`, `src/server/repositories/CampaignProjectRepository.ts` | Server Next.js |
| 5 | C04 | Donatur | `src/models/Donatur.ts`, `src/server/repositories/DonasiRepository.ts`; top-up: `src/models/TopupSaldo.ts`, `src/server/services/TopupService.ts`, `src/server/repositories/TopupRepository.ts`, `src/server/controllers/TopupController.ts` | `GET`/`POST /api/topup` |
| 6 | C05 | PetaWilayah | `src/server/services/peta.service.ts`, `src/server/repositories/peta.repository.ts`, `src/server/controllers/peta.controller.ts`, `src/shared/peta.ts` | `GET /api/peta` |
| 7 | C06 | TransaksiDonasi | `src/models/TransaksiDonasi.ts`, `src/server/services/DonasiService.ts`, `src/server/repositories/DonasiRepository.ts`, `src/shared/donasi.ts` | `POST /api/donasi` |
| 8 | C07 | BuktiTransaksi | `src/models/BuktiTransaksi.ts`, `src/server/services/DonasiService.ts`, `src/server/repositories/DonasiRepository.ts` | `GET /api/donasi/bukti/[idTransaksi]` |
| 9 | C08 | Volunteer | Peran `volunteer` pada kolom `pengguna.peran` (`src/db/migrations/001_schema.sql`, `src/shared/autentikasi.ts`); tanpa file kelas sendiri (B.1 No. 8) | - |
| 10 | C09 | PendaftaranRelawan | `src/models/PendaftaranRelawan.ts`, `src/shared/relawan.ts`, `src/server/services/relawanService.ts`, `src/server/repositories/pendaftaranRelawanRepository.ts` | `/api/projects/[idProject]/relawan` |
| 11 | C10 | PembuatProject | `src/server/auth/aksesAksi.ts`, `src/server/services/AksiService.ts`, `src/components/aksi/MyActions.tsx`, `src/components/aksi/TabMyActions.tsx` | Server/klien Next.js |
| 12 | C11 | AdminSistem | `src/server/auth/aksesAksi.ts`, `src/server/services/AksiService.ts`, `src/app/admin/` | Server Next.js |
| 13 | C12 | Akun | `src/models/Akun.ts` (`validasiKelengkapanInput()`, `normalisasiEmail()`), `src/server/services/AutentikasiService.ts` (`daftarAkun()`, `login()`), `src/server/repositories/UserRepository.ts` (`hitungEmail()`, `simpanAkunBaru()`, `cariAkunByEmail()`), `src/server/password.ts` (`hashPassword()`, `cocokPassword()`) | - |
| 14 | C13 | SesiLogin | `src/models/SesiLogin.ts` (`buatSesi()`, `cekStatusLogin()`), `src/server/services/AutentikasiService.ts` (`penggunaDariSesi()`, `logout()`, `wajibLogin()`), `src/server/repositories/UserRepository.ts` (`simpanSesi()`, `cariSesi()`, `akhiriSesi()`), `src/server/sesi.ts` (cookie `klimpool_sesi`), `src/server/controllers/guard.ts`, `src/server/auth/sesiSementara.ts` | - |
| 15 | C14 | FormPendaftaranView | `src/components/views/FormPendaftaranView.tsx`, `src/components/views/AuthModal.tsx` (tab Sign up) | Modal auth dari navbar, penghalang login, dan tombol yang membutuhkan login |
| 16 | C15 | FormLoginView | `src/components/views/FormLoginView.tsx`, `src/components/views/AuthModal.tsx` (tab Log in), `src/components/ui/SesiProvider.tsx`, `src/components/ui/SesiContext.ts` (`useWajibLogin()`) | Modal auth (sama dengan C14) |
| 17 | C16 | AutentikasiController | `src/server/controllers/AutentikasiController.ts`, `src/server/controllers/respons.ts`, `src/app/api/auth/daftar/route.ts`, `src/app/api/auth/masuk/route.ts`, `src/app/api/auth/keluar/route.ts`, `src/app/api/auth/saya/route.ts` | `POST /api/auth/daftar`, `POST /api/auth/masuk`, `POST /api/auth/keluar`, `GET /api/auth/saya` |
| 18 | C17 | FormCampaignView | `src/components/aksi/FormAksi.tsx`, `src/app/start/page.tsx` | `/start?type=campaign` |
| 19 | C18 | DetailCampaignView | `src/components/views/DetailCampaignView.tsx`, `src/components/detail/MuatDetail.tsx`, `src/app/campaign/[id]/page.tsx` | `/campaign/[id]` |
| 20 | C19 | CampaignController | `src/server/controllers/CampaignController.ts`, `src/server/controllers/AksiController.ts` | `POST /api/campaigns`, `/api/aksi/[jenis]/[id]` |
| 21 | C20 | FormProjectView | `src/components/aksi/FormAksi.tsx`, `src/app/start/page.tsx`, `src/app/manage/[jenis]/[id]/page.tsx` | `/start?type=project`, `/manage/[jenis]/[id]` |
| 22 | C21 | DetailProjectView | `src/components/views/DetailProjectView.tsx`, `src/components/detail/` (`KerangkaDetail`, `PanelSamping`, `PanelTentang`, `PanelKebutuhan`, `PanelProgres`, `PanelDana`), `src/app/project/[id]/page.tsx` | `/project/[id]` |
| 23 | C22 | ProjectController | `src/server/controllers/ProjectController.ts`, `src/server/controllers/AksiController.ts` | `POST /api/projects`, `/api/aksi/[jenis]/[id]` |
| 24 | C23 | PengajuanView | `src/components/aksi/TombolPengajuan.tsx` | Account › My actions, `/manage/[jenis]/[id]` |
| 25 | C24 | DaftarPengajuanView | `src/components/aksi/DaftarPengajuan.tsx`, `src/app/admin/page.tsx` | `/admin` |
| 26 | C25 | DetailPengajuanView | `src/components/aksi/DetailAksiPrivat.tsx`, `src/components/aksi/KeputusanPengajuan.tsx`, `src/app/admin/pengajuan/[jenis]/[id]/page.tsx` | `/admin/pengajuan/[jenis]/[id]` |
| 27 | C26 | VerifikasiController | `src/server/controllers/VerifikasiController.ts`, `src/server/services/AksiService.ts` | `/api/aksi/[jenis]/[id]/pengajuan`, `/api/verifikasi`, `/api/verifikasi/[jenis]/[id]` |
| 28 | C27 | FormPencarianView | `src/components/views/FormPencarianView.tsx`, `src/components/views/ExploreView.tsx`, `src/components/ui/KartuHasil.tsx`, `src/shared/explorePaging.ts`, `src/app/explore/page.tsx` | `/explore` |
| 29 | C28 | PencarianController | `src/server/controllers/pencarian.controller.ts`, `src/app/api/katalog/route.ts`, `src/app/api/katalog/opsi/route.ts` | `GET /api/katalog`, `GET /api/katalog/opsi` |
| 30 | C29 | FormPetaWilayahView | `src/components/views/FormPetaWilayahView.tsx`, `src/components/ui/PetaSebaran.tsx`, `src/components/ui/PetaSebaranMemuat.tsx` | Peta pada `/explore` |
| 31 | C30 | FormDonasiView | `src/components/views/DonasiView/FormDonasiView.tsx`, `AlurDonasi.tsx`, `logikaDonasi.ts`, `panggilApi.ts`, `src/app/donasi/[jenis]/[id]/page.tsx` | Modal donasi, `/donasi/[jenis]/[id]` |
| 32 | C31 | DetailBuktiTransaksiView | `src/components/views/DonasiView/DetailBuktiTransaksiView.tsx`, `HalamanBuktiView.tsx`, `KartuBukti.tsx`, `useBukti.ts`, `src/app/donasi/bukti/[idTransaksi]/page.tsx` | Modal bukti, `/donasi/bukti/[idTransaksi]` |
| 33 | C32 | DonasiController | `src/server/controllers/DonasiController.ts`, `src/app/api/donasi/route.ts`, `src/app/api/donasi/form/route.ts`, `src/app/api/donasi/bukti/[idTransaksi]/route.ts` | `POST /api/donasi`, `GET /api/donasi/form`, `GET /api/donasi/bukti/[idTransaksi]` |
| 34 | C33 | FormPendaftaranRelawanView | `src/components/views/RelawanView/FormPendaftaranRelawanView.tsx`, `opsiJadwal.ts`, `src/components/detail/aksi/TombolRelawan.tsx` | Modal pendaftaran relawan pada `/project/[id]` |
| 35 | C34 | RelawanController | `src/server/controllers/RelawanController.ts`, `src/server/http.ts`, `src/app/api/projects/[idProject]/relawan/route.ts`, `src/app/api/projects/[idProject]/relawan/[idPendaftaran]/route.ts`, `src/app/api/relawan/saya/route.ts` | `/api/projects/[idProject]/relawan`, `/api/projects/[idProject]/relawan/[idPendaftaran]`, `GET /api/relawan/saya` |
| 36 | C35 | FormVolunteerManagementView | `src/components/views/RelawanView/FormVolunteerManagementView.tsx`, `src/components/detail/aksi/AksiPemilik.tsx` | Modal *Manage volunteers* pada `/project/[id]` |
| 37 | C36 | DetailStatusPendaftaranView | `src/components/views/RelawanView/DetailStatusPendaftaranView.tsx` | `/account`, tab *Volunteer applications* |
| 38 | C37 | FormProgresProjectView | `src/components/views/ProgresView/FormProgresProjectView.tsx`, `src/components/aksi/ProgresAksi.tsx`, `src/app/progress/[id]/page.tsx` | Modal progres pada `/project/[id]`, `/progress/[id]` |
| 39 | C38 | ProgresController | `src/server/controllers/ProgresController.ts`, `src/server/services/progresService.ts`, `src/server/repositories/progresRepository.ts`, `src/models/ProgresProject.ts`, `src/server/services/dokumentasiService.ts`, `src/server/storage/dokumentasiStorage.ts`, `src/shared/progres.ts`, `src/shared/dokumentasi.ts` | `/api/projects/[idProject]/progres`, `GET /api/dokumentasi/[idProject]/[nama]` |
| 40 | C39 | FormRiwayatView | `src/components/views/RiwayatView/FormRiwayatView.tsx`, `TabRiwayat.tsx`, `mintaRiwayat.ts`, `src/shared/riwayat.ts`, `src/app/account/page.tsx` | `/account` (alias `/history`), tab *Activity history* |
| 41 | C40 | DetailRiwayatView | `src/components/views/RiwayatView/DetailRiwayatView.tsx`, `label.ts` | Modal *Activity details* |
| 42 | C41 | RiwayatController | `src/server/controllers/RiwayatController.ts`, `src/server/services/riwayatService.ts`, `src/shared/riwayat.ts` | `GET /api/riwayat`, `GET /api/riwayat/transaksi/[idTransaksi]`, `GET /api/riwayat/progres/[idProgres]` |

**Perbedaan terhadap DPPL untuk UC01** (rinciannya pada B.1 No. 14–19):

1. **C14 dan C15 digabung dalam satu modal.** Formulir pendaftaran dan login menjadi dua tab pada `AuthModal`, bukan dua halaman terpisah. Setelah pendaftaran berhasil, pengguna langsung login. Setelah login, pengguna tetap di halaman asal dan aksi yang tadi diminta (mis. formulir donasi) dilanjutkan, sehingga `arahkanKeHalamanUtama()` diwujudkan sebagai pemuatan ulang halaman saat ini.
2. **C16 tidak menyimpan atribut `pesanKesalahan`.** Galat dikirim dalam respons JSON `{ ok: false, kode, pesan, bidang? }` dengan status HTTP sesuai kode (`VALIDASI` 400, `KREDENSIAL_SALAH` 401, `EMAIL_TERPAKAI` 409). Operasi `logout()` (`POST /api/auth/keluar`) dan `saya()` (`GET /api/auth/saya`) ditambahkan.
3. **Operasi C12 tidak mengembalikan `Boolean`.** Validasi melempar `GalatAplikasi` berisi nama kolom yang salah. `simpanAkun()` menulis `pengguna`, `akun`, dan `donatur` (saldo 0) dalam satu transaksi dengan peran awal `volunteer`. Galat *duplicate key* pada indeks unik `akun.email` diubah menjadi `EMAIL_TERPAKAI`.
4. **Cara membawa `idSesi` di peramban.** DPPL tidak menetapkannya. Implementasi memakai cookie `klimpool_sesi` dengan atribut `HttpOnly`, `SameSite=Lax`, `Secure` (hanya di produksi), dan `maxAge` 24 jam, sama dengan `DURASI_SESI_MS`. ID sesi berupa 32 byte acak (64 karakter heksadesimal).
5. **Satu titik pemeriksaan login untuk semua modul.** `guard.ts` (`penggunaSaatIni()`, `requireLogin()`, `requireRole()`), `AutentikasiService.wajibLogin()` (donasi dan top-up), `getIdPenggunaSaatIni()` (relawan, progres, riwayat, detail), dan `sesiAksi()` (UC02–UC04) semuanya memanggil `AutentikasiService.penggunaDariSesi()`.

## 3.3 Implementasi Antarmuka

ID dan nama layar mengikuti DPPL2 Bab 6, yang memuat 10 rancangan antarmuka (I-01 sampai I-10). Layar yang diimplementasikan tetapi tidak memiliki rancangan pada Bab 6 ditandai "-".

Tabel 3.3. Implementasi Antarmuka

| No | ID Antarmuka | Nama Antarmuka | Nama File Fisik | Nama File Executable |
| :--- | :--- | :--- | :--- | :--- |
| 1 | I-01 | Home | `src/app/page.tsx`, `src/components/ui/AppShell.tsx`, `src/components/ui/Navbar.tsx` | `/` |
| 2 | I-02 | Log in | `src/components/views/AuthModal.tsx`, `src/components/views/FormLoginView.tsx` | Modal pada seluruh halaman (tombol *Log in* di navbar) |
| 3 | I-03 | Sign up | `src/components/views/AuthModal.tsx`, `src/components/views/FormPendaftaranView.tsx` | Modal pada seluruh halaman (tombol *Sign up* di navbar) |
| 4 | I-04 | Explore | `src/app/explore/page.tsx`, `src/components/views/ExploreView.tsx`, `FormPencarianView.tsx`, `FormPetaWilayahView.tsx`, `src/components/ui/PetaSebaran.tsx` | `/explore` |
| 5 | I-05 | Project Details (juga dipakai untuk detail campaign) | `src/app/project/[id]/page.tsx`, `src/app/campaign/[id]/page.tsx`, `src/components/views/DetailProjectView.tsx`, `DetailCampaignView.tsx`, `src/components/detail/` | `/project/[id]`, `/campaign/[id]` |
| 6 | I-06 | Donate | `src/components/views/DonasiView/AlurDonasi.tsx`, `FormDonasiView.tsx`, `src/app/donasi/[jenis]/[id]/page.tsx` | Modal donasi, `/donasi/[jenis]/[id]` |
| 7 | I-07 | Top up balance | `src/components/views/TopupView/FormTopupView.tsx`, `src/components/views/DonasiView/DompetKartu.tsx` | Modal top-up pada `/account` |
| 8 | I-08 | Volunteer for this action | `src/components/views/RelawanView/FormPendaftaranRelawanView.tsx`, `src/components/detail/aksi/TombolRelawan.tsx` | Modal pada `/project/[id]` |
| 9 | I-09 | Submit your climate action | `src/components/aksi/FormAksi.tsx`, `src/app/start/page.tsx` | `/start` |
| 10 | I-10 | My activity | `src/app/account/page.tsx`, `src/components/views/RiwayatView/FormRiwayatView.tsx`, `TabRiwayat.tsx`, `src/components/views/RelawanView/DetailStatusPendaftaranView.tsx`, `src/components/aksi/TabMyActions.tsx`, `MyActions.tsx` | `/account` (alias `/history`, `/my-actions`) |
| 11 | - | Penghalang login | `src/components/ui/GateLogin.tsx`, `src/components/views/GerbangView.tsx` | Halaman ber-login saat diakses tamu (mis. `/account`) |
| 12 | - | Bukti transaksi | `src/components/views/DonasiView/DetailBuktiTransaksiView.tsx`, `HalamanBuktiView.tsx`, `KartuBukti.tsx` | Modal bukti, `/donasi/bukti/[idTransaksi]` |
| 13 | - | Rincian riwayat | `src/components/views/RiwayatView/DetailRiwayatView.tsx` | Modal *Activity details* pada `/account` |
| 14 | - | Kelola relawan | `src/components/views/RelawanView/FormVolunteerManagementView.tsx`, `src/components/detail/aksi/AksiPemilik.tsx` | Modal *Manage volunteers* pada `/project/[id]` |
| 15 | - | Pembaruan progres project | `src/components/views/ProgresView/FormProgresProjectView.tsx`, `src/components/aksi/ProgresAksi.tsx` | Modal pada `/project/[id]`, `/progress/[id]` |
| 16 | - | Kelola dan pengajuan aksi | `src/components/aksi/DetailAksiPrivat.tsx`, `TombolPengajuan.tsx`, `src/app/manage/[jenis]/[id]/page.tsx` | `/manage/[jenis]/[id]` |
| 17 | - | Peninjauan pengajuan admin | `src/components/aksi/DaftarPengajuan.tsx`, `DetailAksiPrivat.tsx`, `KeputusanPengajuan.tsx`, `src/app/admin/page.tsx`, `src/app/admin/pengajuan/[jenis]/[id]/page.tsx` | `/admin`, `/admin/pengajuan/[jenis]/[id]` |

Catatan: draf sebelumnya memakai ID I-11 untuk My Actions dan I-14 untuk peninjauan admin. Kedua ID itu tidak ada di DPPL2 Bab 6, sehingga diganti menjadi I-10 (My activity, tab *My actions*) dan "-" (peninjauan admin).

## 3.4 File Lain

Tabel 3.4. File Lain

| No | Nama File | Keterangan |
| :--- | :--- | :--- |
| 1 | `src/db/migrations/001_schema.sql` | Skema 11 tabel InnoDB: `pengguna`, `akun` (indeks unik `email`), `sesi_login`, `donatur`, `campaign`, `project`, `transaksi_donasi`, `bukti_transaksi`, `pendaftaran_relawan`, `progres_project`, `topup_saldo`. |
| 2 | `src/db/migrations/002_seed.sql` | Data demo fiktif: 10 akun (mis. Andi, Sari, Admin, Nadia, Fajar) dengan kata sandi `klimpool123` yang disimpan sebagai hash bcrypt *cost* 12, beserta aksi, transaksi, dan progres contoh. |
| 3 | `src/docker-compose.yml`, `src/.env.example`, `src/.nvmrc` | Basis data MySQL 8.4 lokal (kontainer `klimpool-db`, port 3307), contoh variabel lingkungan tanpa rahasia, dan versi Node.js. |
| 4 | `src/README.md` | Panduan instalasi, menjalankan basis data dan aplikasi, *seed*, akun demo, dan perintah pengujian. |
| 5 | `src/package.json`, `src/package-lock.json`, `src/next.config.ts`, `src/tsconfig.json`, `src/eslint.config.mjs`, `src/.prettierrc` | Dependensi dan skrip npm (`dev`, `build`, `start`, `test`, `db:reset`), konfigurasi Next.js, TypeScript (alias `@/`), ESLint, dan Prettier. |
| 6 | `src/server/db.ts` | *Connection pool* `mysql2`, fungsi `query()` dan `withTransaction()`; waktu disimpan dan dibaca sebagai UTC. |
| 7 | `src/shared/galatDonasi.ts`, `src/shared/galat.ts`, `src/server/controllers/respons.ts`, `src/server/http.ts` | Kode galat bersama (`GalatAplikasi`, `PESAN_GALAT`, `STATUS_HTTP`), `GalatValidasi`, pembentuk respons JSON, dan pemetaan galat ke status HTTP tanpa membocorkan rincian galat internal. |
| 8 | `src/shared/konstanta.ts`, `src/shared/types.ts`, `src/shared/aksi.ts`, `src/components/aksi/apiAksi.ts`, `src/components/views/DonasiView/panggilApi.ts` | Konstanta (mis. `DURASI_SESI_MS` 24 jam), tipe bersama, kontrak data aksi, serta adapter HTTP sisi klien (`panggilApi()`, `kirimJson()`). |
| 9 | `src/components/ui/` (`AppShell`, `Navbar`, `Footer`, `Modal`, `Toast`, `Field`, dll.) | Komponen antarmuka bersama tanpa logika use case (B.1 No. 13). |
| 10 | `src/vitest.config.ts`, `src/scripts/test-node.mjs` | Konfigurasi Vitest (pola `tests/**/*.spec.ts`) dan pencari file `*.test.ts` untuk *test runner* Node.js. |
| 11 | `src/scripts/aksi.browser.mjs`, `account.browser.mjs`, `ukur-performa-bukti.ts`, `uptime.ps1` | Skrip uji peramban (Playwright), pengukuran performa bukti transaksi, dan pemantauan *uptime* (KNF06). |
| 12 | `src/tests/` (`*.test.ts`, `*.spec.ts`) | Pengujian unit dan integrasi seluruh modul, termasuk `autentikasi.unit.test.ts` (UC01, 20 test) dan `aksi.auth.spec.ts` (adaptor sesi UC02–UC04). |
| 13 | `src/uploads/progres/` | Folder berkas dokumentasi progres (UC09), dibuat saat aplikasi berjalan dan diabaikan Git. |
| 14 | `docs/M10/assets/pengujian/` | Tangkapan layar, keluaran *test runner*, dan laporan *coverage* seluruh modul. |

<br>

---

# BAB 4: Hasil Pengujian

Bab ini melaporkan hasil pengujian P/L pada level unit, integrasi, dan sistem. Pengujian UC02–UC04 menggunakan kode `main` pada commit `b35ab49` beserta tambahan kasus uji; kode fitur tidak diubah selama pengujian. Hasil aktual diisi berdasarkan pengamatan saat pengujian. Kesimpulan diisi `Pass` atau `Fail`, dan untuk `Fail` dilengkapi penyebab serta usulan perbaikan.

## 4.1 Strategi dan Kedalaman Pengujian Kelas

Setiap kelas perancangan pada Tabel 4.1 DPPL diklasifikasikan ke dalam tiga tingkat kedalaman pengujian. Tingkat **Mendalam** diberikan pada kelas yang memuat logika bisnis, perhitungan, validasi, aturan status, algoritma, integrasi eksternal, atau keamanan. Tingkat **Sedang** diberikan pada kelas yang hanya mengoordinasikan atau mendelegasikan proses. Tingkat **Tidak perlu** diberikan pada kelas tanpa logika, seperti *entity/DTO* dan kelas konfigurasi, yang teruji secara tidak langsung melalui test case use case. Seluruh kelas wajib dicantumkan beserta alasan penentuan tingkatnya.

Tabel 4.1.1. Identifikasi Tingkat Pengujian Kelas

| ID Kelas | Nama Kelas | Tingkat | Alasan | Test Case Terkait |
| :--- | :--- | :--- | :--- | :--- |
| C02 | Project | Mendalam | Validasi kebutuhan, penyimpanan dua tahap, kepemilikan dan status. | C02-UT01–UT13, UC03-TC01–TC04 |
| C03 | Campaign | Mendalam | Validasi target/periode, penyimpanan dan perubahan status. | C03-UT01–UT12, UC02-TC01–TC05 |
| C10 | PembuatProject | Mendalam | Operasi membuat/mengubah/mengajukan dibatasi peran dan pemilik sesi. | C10-UT01–UT06 |
| C11 | AdminSistem | Mendalam | Antrean dan keputusan hanya untuk admin; penolakan wajib alasan. | C11-UT01–UT04 |
| C17 | FormCampaignView | Sedang | Menyusun form dan meneruskan hasil/galat HTTP. | C17-UT01–UT04 |
| C19 | CampaignController | Sedang | Membaca sesi/JSON dan mendelegasikan pembuatan serta detail. | C19-UT01–UT04 |
| C20 | FormProjectView | Sedang | Menyusun dua tahap formulir dan mengisi ulang draft. | C20-UT01–UT03, UC03-TC03 |
| C22 | ProjectController | Sedang | Meneruskan informasi dasar, kebutuhan, dan ID project. | C22-UT01–UT04 |
| C23 | PengajuanView | Sedang | Tombol pengajuan mengikuti status aksi. | C23-UT01–UT02, UC04-TC04 |
| C24 | DaftarPengajuanView | Sedang | Menampilkan daftar/keadaan kosong dan tautan detail. | C24-UT01–UT02 |
| C25 | DetailPengajuanView | Sedang | Menampilkan detail, pilihan keputusan dan status terbaru. | C25-UT01–UT03, UC04-TC01–TC03 |
| C26 | VerifikasiController | Mendalam | Mengendalikan pengajuan/keputusan, status dan penanganan konflik. | C26-UT01–UT11 |
| C01 | Katalog | Mendalam | Memuat penyusunan query pencarian dinamis dari kombinasi kata kunci dan filter, aturan bahwa hanya data `terpublikasi` yang diambil, aturan status terbuka donasi, perhitungan periode dan paginasi, serta perlindungan dari *SQL injection* (Algo-014; KF13, KF14). Salah logika di sini berarti aksi yang belum diverifikasi ikut tampil ke publik | C01-UT01 s.d. C01-UT17, INT-TC25, INT-TC26 |
| C04 | Donatur | Mendalam | Memuat pemeriksaan kecukupan saldo dan pengurangan saldo secara atomik dengan `UPDATE ... WHERE saldo >= ?` serta penguncian baris (Algo-103, Algo-104). Salah logika di sini berarti uang hilang atau saldo negatif. | C04-UT01 s.d. C04-UT06 |
| C05 | PetaWilayah | Mendalam | Memuat pembacaan dan validasi koordinat pusat, konversi radius (km) untuk `ST_Distance_Sphere`, pemilihan query dengan atau tanpa wilayah, dan aturan bahwa campaign yang periodenya sudah lewat tidak dipetakan berdasarkan tanggal WIB (Algo-101, Algo-102) | C05-UT01 s.d. C05-UT15, INT-TC27, INT-TC28 |
| C06 | TransaksiDonasi | Mendalam | Memuat validasi nominal, deteksi duplikasi *idempotency key*, pemrosesan donasi atomik dengan *rollback*, dan perhitungan capaian (Algo-105 s.d. Algo-110; KF15–KF18, KF26) | C06-UT01 s.d. C06-UT10, INT-TC04, INT-TC05 |
| C07 | BuktiTransaksi | Mendalam | Memuat aturan bahwa bukti hanya dibuat untuk transaksi berhasil, tidak boleh ganda, berupa *snapshot*, dan hanya dapat dibuka pemiliknya (Algo-111, Algo-112) | C07-UT01 s.d. C07-UT08 |
| C08 | Volunteer | Tidak perlu | Diimplementasikan sebagai peran `volunteer` pada tabel `pengguna` tanpa logika sendiri (Tugas 9, B.1 No. 8). Operasi `isiFormulir()` dan `kirimPendaftaran()` (Algo-118) diwujudkan oleh C33 dan C34 yang diuji tersendiri | UC07-TC01 |
| C09 | PendaftaranRelawan | Mendalam | Memuat validasi kelengkapan formulir, pencegahan pendaftaran ganda, pemeriksaan kuota, dan transisi status `pending` ke `accepted`/`rejected` yang hanya boleh terjadi sekali (Algo-113 s.d. Algo-117; KF19–KF21) | C09-UT01 s.d. C09-UT18, INT-TC11 s.d. INT-TC16 |
| C18 | DetailCampaignView | Sedang | Mengoordinasikan halaman detail campaign; logikanya terbatas pada penentuan status tombol donasi dari periode campaign (belum mulai, berjalan, berakhir) yang memakai aturan yang sama dengan API donasi (Algo-132), lalu menampilkan data dari server | C18-UT01 s.d. C18-UT04, INT-TC29, INT-TC30 |
| C21 | DetailProjectView | Sedang | Mengoordinasikan halaman detail project; logikanya terbatas pada penentuan tab awal, status tombol donasi dan relawan, penyaringan tautan dokumentasi progres, dan penyembunyian titik kumpul bagi selain relawan yang diterima | C21-UT01 s.d. C21-UT08, INT-TC29, INT-TC30 |
| C27 | FormPencarianView | Sedang | Mengoordinasikan kolom cari dan filter; logikanya terbatas pada penerjemahan filter antara URL, tampilan, dan parameter API serta penanganan gagal muat halaman berikutnya ("Show more") | C27-UT01 s.d. C27-UT07, INT-TC23 |
| C28 | PencarianController | Sedang | Membaca parameter permintaan, lalu mendelegasikan pencarian ke `KatalogService`. Validasi parameter (`bacaFilter()`) diuji pada C01 karena mewujudkan `terimaKataKunci()` dan `terapkanFilter()` | C28-UT01 s.d. C28-UT04, INT-TC23, INT-TC24 |
| C29 | FormPetaWilayahView | Sedang | Mengoordinasikan peta sebaran; logikanya terbatas pada proyeksi koordinat ke peta SVG, penggeseran pin yang bertumpuk, dan pemilihan pin berdasarkan pasangan tipe dan ID | C29-UT01 s.d. C29-UT08, UC05-TC08 |
| C30 | FormDonasiView | Sedang | Mengoordinasikan formulir donasi; logikanya terbatas pada validasi sisi klien dan pembangkitan *idempotency key* sebelum diteruskan ke server | C30-UT01 s.d. C30-UT04, INT-TC01, INT-TC02 |
| C31 | DetailBuktiTransaksiView | Sedang | Hanya memformat dan menampilkan rincian bukti dari server | C31-UT01 s.d. C31-UT03 |
| C32 | DonasiController | Sedang | Memeriksa login dan bentuk masukan, lalu mendelegasikan aturan bisnis ke `DonasiService` | C32-UT01 s.d. C32-UT04, INT-TC03 |
| C33 | FormPendaftaranRelawanView | Sedang | Mengoordinasikan formulir pendaftaran; logikanya terbatas pada penyusunan pilihan hari dari jadwal project dan validasi sisi klien yang memakai aturan yang sama dengan server | C33-UT01 s.d. C33-UT04, INT-TC21 |
| C34 | RelawanController | Mendalam | Memuat pemeriksaan login, kepemilikan project, kuota, dan status pendaftaran sebelum data pendaftar (berisi nomor telepon) dibuka atau keputusan disimpan (Algo-123 s.d. Algo-126; keamanan dan aturan bisnis KF19–KF22) | C34-UT01 s.d. C34-UT15, INT-TC11 s.d. INT-TC16 |
| C35 | FormVolunteerManagementView | Sedang | Mengoordinasikan peninjauan pendaftar; logikanya terbatas pada pengurutan pendaftar `pending` di atas dan penonaktifan tombol *Accept* saat kuota penuh | C35-UT01 s.d. C35-UT04 |
| C36 | DetailStatusPendaftaranView | Tidak perlu | Hanya menampilkan status dan instruksi kegiatan yang diterima dari server. Aturan bahwa titik kumpul hanya untuk pendaftaran `accepted` (KF22) berada di server dan diuji pada C34-UT13, C34-UT14, INT-TC15 | UC08-TC01, UC08-TC02 |
| C37 | FormProgresProjectView | Sedang | Mengoordinasikan formulir progres; logikanya terbatas pada validasi isian dan pemeriksaan berkas sisi klien sebelum dikirim sebagai `multipart/form-data` | C37-UT01 s.d. C37-UT04, INT-TC22 |
| C38 | ProgresController | Mendalam | Memuat pemeriksaan hak akses (hanya Pembuat Project atau Admin Sistem, KF25), validasi milestone/status/berkas, penyimpanan dokumentasi, stempel waktu, dan pembatalan berkas bila penyimpanan gagal (Algo-127, Algo-128; KF23–KF25) | C38-UT01 s.d. C38-UT11, INT-TC17 s.d. INT-TC20 |
| C39 | FormRiwayatView | Sedang | Mengoordinasikan tampilan riwayat; logika terbatas pada penyaringan jenis dan pengelompokan per bulan di sisi klien | C39-UT01 s.d. C39-UT04 |
| C40 | DetailRiwayatView | Tidak perlu | Hanya menampilkan rincian transaksi/progres yang diterima dari server, tanpa logika | UC10-TC02, UC10-TC03 |
| C41 | RiwayatController | Sedang | Membaca filter dan sesi, lalu mendelegasikan penyusunan riwayat dan pemeriksaan kepemilikan ke `riwayatService` | C41-UT01 s.d. C41-UT04, INT-TC07 s.d. INT-TC09 |
| C00 | PenggunaUmum | Tidak perlu | Hanya struktur data (`PenggunaUmum`, `PenggunaDto`) tanpa logika. Teruji tidak langsung lewat respons daftar/login dan use case UC01. | UC01-TC01, UC01-TC04 |
| C12 | Akun | Mendalam | Memuat validasi kelengkapan dan format input, normalisasi email, cek ketersediaan email (KF02), hash bcrypt (KF03), dan validasi kredensial yang tidak membocorkan email terdaftar (Algo-001 s.d. Algo-003). Salah logika di sini berarti akun ganda atau kata sandi tersimpan terbuka. | C12-UT01 s.d. C12-UT09, INT-TC39, INT-TC40 |
| C13 | SesiLogin | Mendalam | Memuat pembuatan ID sesi acak, masa berlaku 24 jam, pemeriksaan status login (aktif, sudah dimulai, belum kedaluwarsa, akun aktif), dan pengakhiran sesi (Algo-004, Algo-005; KF04). Seluruh modul lain bergantung pada pemeriksaan ini; salah logika berarti akses tanpa hak. | C13-UT01 s.d. C13-UT06, INT-TC41, INT-TC42, INT-TC44 |
| C14 | FormPendaftaranView | Sedang | Hanya menyusun formulir, mengirim isian ke `/api/auth/daftar`, menampilkan galat per kolom dari server, lalu login otomatis. Validasi dijalankan di server. | C14-UT01, C14-UT02, INT-TC38, UC01-TC01 s.d. UC01-TC03 |
| C15 | FormLoginView | Sedang | Hanya mengirim kredensial ke `/api/auth/masuk`, menampilkan galat, memperbarui navbar, dan melanjutkan aksi yang tertunda. | C15-UT01, C15-UT02, INT-TC38, UC01-TC04 s.d. UC01-TC06 |
| C16 | AutentikasiController | Sedang | Membaca badan JSON, mendelegasikan aturan bisnis ke `AutentikasiService`, memetakan galat ke status HTTP, serta memasang dan menghapus cookie sesi. Pola ini sama dengan controller lain (C19, C22, C32). | C16-UT01 s.d. C16-UT06, INT-TC38, INT-TC43 |

<br>

## 4.2 Pengujian Unit Kelas

Pengujian unit dilakukan pada kelas bertingkat Mendalam dan Sedang. Kelas Mendalam diuji pada seluruh operasi public dengan kasus normal, batas, dan negatif, serta mencapai *coverage* minimal 70%. Kelas Sedang diuji minimal dengan satu kasus normal dan satu kasus gagal pada operasi public utama.

### Kerangka Pengujian

Seluruh file test berada di folder `src/tests/`. Proyek memakai dua *test runner*:

- **Vitest 3.2.7** untuk file `*.spec.ts`. Konfigurasinya ada di `src/vitest.config.ts` (lingkungan `node`, alias `@` ke folder `src/`, pola `tests/**/*.spec.ts`). Vitest dipakai untuk logika murni, *service* dengan sumber data tiruan, dan komponen React yang dirender ke HTML statis.
- ***Test runner* bawaan Node.js** (`node:test` dengan `tsx`) untuk file `*.test.ts`. Daftar file dicari secara rekursif oleh `src/scripts/test-node.mjs`. Test yang menyentuh MySQL sungguhan **dilewati (skip) bila basis data tidak berjalan**.

Cara menjalankan seluruh pengujian (dari folder `src/`):

```bash
npm ci                 # sekali saja, memasang dependensi sesuai package-lock.json
npm test               # npm run test:node lalu npm run test:vitest
npx vitest run peta    # contoh menjalankan sebagian file: nama file yang memuat "peta"
```

Hasil `npm test` pada `main` commit `b35ab49` (20 November 2026, Node v24.13.0, Windows 11, **tanpa basis data**): node:test 166 test, 127 lulus, 39 dilewati karena basis data tidak berjalan, 0 gagal. Vitest 195 test, 194 lulus, 1 gagal (setelah `peta.repository.spec.ts` ditambahkan: 200 test, 199 lulus, 1 gagal yang sama). Test yang gagal adalah `node-runner.spec.ts` "tidak mengikuti symlink direktori…", yang membuat *symlink* sementara dan ditolak Windows (`EPERM: operation not permitted, symlink`) bila *Developer Mode* tidak aktif. Kegagalan ini berasal dari izin sistem operasi, bukan dari kode aplikasi. Test yang memerlukan basis data dijalankan terpisah per modul seperti dijelaskan pada subbab di bawah.

*Coverage* diukur per modul dengan alat yang sesuai *test runner*-nya: `node --experimental-test-coverage` untuk file `*.test.ts` dan `@vitest/coverage-v8` untuk file `*.spec.ts`. Ringkasan *coverage* seluruh kelas Mendalam ada pada Tabel 4.2.0, sedangkan rinciannya ada pada tabel ringkasan cakupan tiap kelas.

Tabel 4.2.0. Ringkasan *Coverage* Kelas Mendalam

| ID Kelas | Nama Kelas | File yang Diukur | Coverage (baris / cabang) | Alat |
| :--- | :--- | :--- | :--- | :--- |
| C01 | Katalog | `server/services/katalog.service.ts`, `server/repositories/katalog.repository.ts`, `shared/katalog.ts`, `server/controllers/pencarian.controller.ts` | 100% / 100%; 82,17% / 100%; 100% / 100%; 100% / 100% | `@vitest/coverage-v8` |
| C04 | Donatur | `models/Donatur.ts`; `server/repositories/DonasiRepository.ts` | 97,37% / 93,75%; 99,21% / 81,25% | `node --experimental-test-coverage` |
| C05 | PetaWilayah | `server/services/peta.service.ts`, `server/repositories/peta.repository.ts`, `server/controllers/peta.controller.ts` | 100% / 100%; 100% / 100%; 97,5% / 95,23% | `@vitest/coverage-v8` |
| C06 | TransaksiDonasi | `models/TransaksiDonasi.ts`; `server/services/DonasiService.ts`; `server/repositories/DonasiRepository.ts` | 98,65% / 85,71%; 87,78% / 83,33%; 99,21% / 81,25% | `node --experimental-test-coverage` |
| C07 | BuktiTransaksi | `models/BuktiTransaksi.ts` | 100% / 85,71% | `node --experimental-test-coverage` |
| C09 | PendaftaranRelawan | `models/PendaftaranRelawan.ts`; `shared/relawan.ts`; `server/services/relawanService.ts` | 100% / 85,71%; 95,35% / 89,02%; 99,19% / 94,03% | `node --experimental-test-coverage` |
| C34 | RelawanController | `server/controllers/RelawanController.ts`; `server/http.ts` | 100% / 92,86%; 100% / 95,24% | `node --experimental-test-coverage` |
| C38 | ProgresController | `server/controllers/ProgresController.ts`; `server/services/progresService.ts`; `shared/progres.ts`; `shared/dokumentasi.ts` | 98,11% / 95,45%; 98,70% / 93,75%; 97,91% / 82,61%; 93,48% / 79,17% | `node --experimental-test-coverage` |
| C12 | Akun | `models/Akun.ts`; `server/password.ts` | 89,83% / 86,67%; 100% / 75% | `node --experimental-test-coverage` |
| C13 | SesiLogin | `models/SesiLogin.ts`; `server/services/AutentikasiService.ts`; `server/sesi.ts` | 100% / 100%; 91,57% / 97,14%; 100% / 100% | `node --experimental-test-coverage` |

### Pengujian Unit UC05

Kelas C01, C05, C18, C21, C27, C28, dan C29 diuji dengan Vitest. Basis data diganti sumber data tiruan (objek yang memenuhi antarmuka `SumberKatalog`, `SumberSebaran`, dan sumber detail), sehingga setiap cabang aturan dapat diuji tanpa MySQL. Pada `peta.repository.spec.ts` dan `detail.repository.spec.ts`, fungsi `query` di `server/db.ts` diganti tiruan dengan `vi.mock`, sehingga SQL dan parameter yang dikirim ke basis data dapat diperiksa. Teks SQL yang disusun `bangunKueri()` diperiksa langsung, termasuk jumlah parameter dan ketiadaan masukan pengguna di dalam teks SQL. Kelas *boundary* C21 dan C29 dirender ke HTML statis (`react-dom/server`), lalu isi dan atributnya diperiksa. Interaksi dengan MySQL sungguhan diuji sebagai pengujian integrasi (Subbab 4.3).

Cara menjalankan (dari folder `src/`, tidak butuh basis data):

```bash
npx vitest run tests/katalog.repository.spec.ts tests/katalog.service.spec.ts \
  tests/katalog.route.spec.ts tests/pencarian.controller.spec.ts \
  tests/peta.spec.ts tests/peta.identitas.spec.ts tests/peta.repository.spec.ts \
  tests/explore.spec.ts tests/explore.regression.spec.ts \
  tests/detail.service.spec.ts tests/detail.repository.spec.ts tests/detail.komponen.spec.ts
```

Cara mengukur *coverage* kelas Mendalam (C01, C05). Paket `@vitest/coverage-v8` tidak tercantum di `package.json`, sehingga dipasang sementara dengan `--no-save` agar `package.json` dan `package-lock.json` tidak berubah:

```bash
npm install --no-save @vitest/coverage-v8@3.2.7
npx vitest run katalog pencarian peta --coverage.enabled --coverage.reporter=text \
  --coverage.include=server/services/katalog.service.ts \
  --coverage.include=server/repositories/katalog.repository.ts \
  --coverage.include=shared/katalog.ts \
  --coverage.include=server/controllers/pencarian.controller.ts \
  --coverage.include=server/services/peta.service.ts \
  --coverage.include=server/repositories/peta.repository.ts \
  --coverage.include=server/controllers/peta.controller.ts
```

Lokasi file test: `src/tests/` (`katalog.repository.spec.ts`, `katalog.service.spec.ts`, `katalog.route.spec.ts`, `pencarian.controller.spec.ts`, `peta.spec.ts`, `peta.identitas.spec.ts`, `peta.repository.spec.ts`, `explore.spec.ts`, `explore.regression.spec.ts`, `detail.service.spec.ts`, `detail.repository.spec.ts`, `detail.komponen.spec.ts`).

Hasil saat dijalankan (20 November 2026): 12 file, 150 dari 150 test case lulus.

### Pengujian Unit UC06 & UC10

Pengujian memakai *test runner* bawaan Node.js (`node:test`, file `*.test.ts`) dan Vitest (file `*.spec.ts`). Pengujian yang menyentuh basis data memakai MySQL sungguhan (bukan *mock*) dan **dilewati (skip) bila basis data tidak berjalan**, sehingga basis data wajib dinyalakan lebih dulu dan keluaran harus menunjukkan `skipped 0`.

Cara menjalankan unit test (dari folder `src/`):

```bash
cp .env.example .env        # sekali saja, lalu isi password DB
npm run db:up               # MySQL 8.4 via Docker
node --env-file-if-exists=.env --import tsx --test \
  tests/donasi.unit.test.ts tests/donasi.bukti.unit.test.ts tests/donasi.view.test.ts \
  tests/donasi.integrasi.test.ts tests/topup.unit.test.ts \
  tests/riwayat.unit.test.ts tests/riwayat.integrasi.test.ts
npx vitest run tests/riwayat-kategori.spec.ts
```

Cara mengukur *coverage* kelas Mendalam (C04, C06, C07):

```bash
node --env-file-if-exists=.env --import tsx --test --experimental-test-coverage \
  --test-coverage-include="models/Donatur.ts" \
  --test-coverage-include="models/TransaksiDonasi.ts" \
  --test-coverage-include="models/BuktiTransaksi.ts" \
  --test-coverage-include="server/services/DonasiService.ts" \
  --test-coverage-include="server/repositories/DonasiRepository.ts" \
  tests/donasi.unit.test.ts tests/donasi.integrasi.test.ts tests/topup.unit.test.ts tests/riwayat.integrasi.test.ts
```

Lokasi file test: `src/tests/` (`donasi.unit.test.ts`, `donasi.bukti.unit.test.ts`, `donasi.view.test.ts`, `donasi.integrasi.test.ts`, `topup.unit.test.ts`, `riwayat.unit.test.ts`, `riwayat.integrasi.test.ts`, `riwayat-kategori.spec.ts`).

### Pengujian Unit UC07, UC08 & UC09

Kelas C09, C34, dan C38 diuji di `relawanProgres.layanan.test.ts`. Basis data, sesi login, dan penyimpanan berkas pada file ini diganti tiruan (`mock.module` dari `node:test`), sehingga setiap cabang aturan bisnis dapat diuji tanpa MySQL dan *coverage*-nya terukur. Interaksi dengan MySQL sungguhan diuji terpisah sebagai pengujian integrasi (Subbab 4.3). Kelas *boundary* C33, C35, dan C37 diuji di `relawanProgres.view.spec.ts` dengan merender komponen ke HTML statis (`react-dom/server`), lalu isi dan atribut tombolnya diperiksa. Aturan validasi bersama juga diuji di `relawanProgres.unit.test.ts` dan `opsiJadwal.spec.ts`.

Cara menjalankan (dari folder `src/`, tidak butuh basis data):

```bash
node --experimental-test-module-mocks --import tsx --test \
  tests/relawanProgres.layanan.test.ts tests/relawanProgres.unit.test.ts
npx vitest run tests/relawanProgres.view.spec.ts tests/opsiJadwal.spec.ts
```

Cara mengukur *coverage* kelas Mendalam (C09, C34, C38):

```bash
node --experimental-test-module-mocks --experimental-test-coverage --import tsx --test \
  --test-coverage-include="models/PendaftaranRelawan.ts" \
  --test-coverage-include="shared/relawan.ts" \
  --test-coverage-include="shared/progres.ts" \
  --test-coverage-include="shared/dokumentasi.ts" \
  --test-coverage-include="server/services/relawanService.ts" \
  --test-coverage-include="server/services/progresService.ts" \
  --test-coverage-include="server/controllers/RelawanController.ts" \
  --test-coverage-include="server/controllers/ProgresController.ts" \
  --test-coverage-include="server/http.ts" \
  tests/relawanProgres.layanan.test.ts tests/relawanProgres.unit.test.ts
```

Hasil saat dijalankan: 44 dari 44 test case `relawanProgres.layanan.test.ts` dan 12 dari 12 test case `relawanProgres.view.spec.ts` lulus. Kelas C08 (Volunteer) dan C36 (DetailStatusPendaftaranView) bertingkat Tidak perlu sehingga tidak memiliki subbab unit test.

### Pengujian Unit UC01 

Kelas C12, C13, dan C16 diuji dengan *test runner* bawaan Node.js pada file `src/tests/autentikasi.unit.test.ts`. Pengujian ini tidak memakai basis data. `UserRepository` diganti repository tiruan berbasis `Map` yang mencatat setiap panggilan, jam diganti fungsi yang bisa dimajukan, dan hash bcrypt diganti hash tiruan kecuali pada C12-UT04, yang memakai bcrypt asli. Query ke MySQL (`UserRepository`) diuji sebagai pengujian integrasi pada INT-TC39 s.d. INT-TC42.

Cara menjalankan (dari folder `src/`):

```bash
npm run test:node                      # seluruh *.test.ts, termasuk UC01
# hanya UC01, dengan coverage:
node --env-file-if-exists=.env --import tsx --test --experimental-test-coverage --test-coverage-include="models/**" --test-coverage-include="server/**" tests/autentikasi.unit.test.ts
```

Hasil (20 November 2026, Node.js v22.23.5): **20 test dalam 3 *suite*, 20 lulus, 0 gagal, 0 dilewati**. Bukti pada 4.6.

*Coverage* `server/repositories/UserRepository.ts` dari unit test hanya 60,94% baris karena seluruh isinya *query* SQL ke MySQL yang tidak dijalankan pada unit test; file ini diuji pada INT-TC39 s.d. INT-TC42. C16 bertingkat Sedang sehingga tidak wajib mencapai 70%; *coverage* `AutentikasiController.ts` sebesar 68,25% karena `logout()` dan `saya()` membaca cookie Next.js dan diuji lewat UC01-TC07, UC01-TC08, dan INT-TC44.

### Pengujian Unit UC02–UC04

Pengujian unit yang dilakukan mencakup **68 kasus: 68 Pass, 0 Fail**. Validasi diuji langsung; repository, sesi, koneksi, dan HTTP diganti tiruan pada unit yang memerlukannya. Komponen view diuji melalui HTML statis dan adapter `apiAksi`; interaksi klik diuji terpisah pada §4.4. Waktu unit dipatok 19 November 2026 agar batas tanggal konsisten.

Kelas DPPL diwujudkan sebagai fungsi bersama, bukan satu file per kelas (lihat B.5 Tugas 9). Coverage V8 berikut hanya mencakup **tujuh file aksi**, bukan seluruh aplikasi, file view, autentikasi, atau seluruh operasi lintas UC. Ambang setiap file: 70% baris, pernyataan, fungsi, dan cabang. Bukti: §4.6.

| File (relatif terhadap `src/`) | Kelas yang Dilayani | Baris | Pernyataan | Fungsi | Cabang |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `shared/validasiAksi.ts` | C02, C03 | 100% | 100% | 100% | 98,82% |
| `server/services/AksiService.ts` | C02, C03, C10, C11, C26 | 100% | 100% | 100% | 100% |
| `server/repositories/AksiRepository.ts` | C02, C03, C10, C26 | 100% | 100% | 100% | 100% |
| `server/controllers/AksiController.ts` | C10, C19, C22, C26 | 100% | 100% | 100% | 100% |
| `server/controllers/CampaignController.ts` | C19 | 100% | 100% | 100% | 100% |
| `server/controllers/ProjectController.ts` | C22 | 100% | 100% | 100% | 100% |
| `server/controllers/VerifikasiController.ts` | C26 | 100% | 100% | 100% | 100% |
| **Total** | **587/587 baris; 36/36 fungsi; 187/188 cabang** | **100%** | **100%** | **100%** | **99,46%** |

### 4.2.2 Kelas Project

**ID:** C02 — **Tingkat:** Mendalam.

Operasi `setInformasi()`, `setKebutuhan()`, `validasiData()`, `validasiKebutuhan()`, `simpanProject()`, dan `tampilkanDetail()` diwujudkan oleh `validasiAksi`, `AksiService.buat/ubah/lihat`, serta `AksiRepository.buat/cari/ubah`. `ubahStatus()` dan `getDaftarMenungguVerifikasi()` diuji bersama C11/C26. Algoritma terkait: Algo-011 dan Algo-012. Implementasi menyimpan **Draft terlebih dahulu**, lalu menjadi menunggu verifikasi setelah tombol pengajuan.

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C02-UT01 | `validasiData/Kebutuhan` | Normal | Informasi, dana, logistik, kriteria, kuota, jadwal lengkap | Data valid | Data sama dengan fixture | Pass |
| C02-UT02 | `setInformasi` | Batas | Tahap informasi tanpa kebutuhan/jadwal | Boleh disimpan sebagian | `mulai=null`, `targetDana=0` | Pass |
| C02-UT03 | `validasiKebutuhan` | Batas/negatif | Dana 0 lalu -1 | 0 diterima; negatif ditolak | 0 diterima; -1 melempar galat | Pass |
| C02-UT04 | `validasiKebutuhan` | Batas | Kuota 1, 2147483647, 0, -1, 1,5, 2147483648 | Hanya dua pertama valid | Kedua batas diterima; sisanya ditolak | Pass |
| C02-UT05 | `validasiData/Kebutuhan` | Negatif | Kosongkan lokasi, tanggal, tujuan, logistik, kriteria, titik kumpul bergantian | Setiap isian wajib ditolak | Semua isian kosong ditolak | Pass |
| C02-UT06 | `validasiData` | Batas/negatif | Satu hari; 30 Feb; tanggal terbalik/lampau/tahun 0001 | Satu hari valid; sisanya ditolak | Sesuai seluruh variasi | Pass |
| C02-UT07 | `validasiData` | Batas/negatif | Koordinat -90/180; tidak sepasang, di luar rentang, atau teks | Batas valid; lainnya ditolak | -90/180 diterima; lainnya ditolak | Pass |
| C02-UT08 | `setKebutuhan` | Batas/negatif | Rincian dana 50/51 baris; format salah, uraian kosong, nominal 0 | Maksimal 50 baris sah | 50 diterima; variasi tidak sah ditolak | Pass |
| C02-UT09 | `simpanProject` | Normal/negatif | Buat tahap informasi, lalu tahap `unknown` | Draft parsial; tahap salah 400 | Repository menerima jadwal null/dana 0; tahap salah 400 | Pass |
| C02-UT10 | `setInformasi` | Normal | Revisi judul pada draft lengkap | ID/koneksi sama; kebutuhan tidak hilang | `ubah()` menerima ID, koneksi dan kebutuhan lama | Pass |
| C02-UT11 | `setInformasi` | Negatif | Bukan pemilik; status pending/published | 404/409 tanpa menulis | 404/409; repository tidak dipanggil | Pass |
| C02-UT12 | `tampilkanDetail` | Normal/negatif | Cari ID dalam transaksi; cari ID kosong | Parameter SQL dan kunci baris; `null` bila tidak ada | `WHERE id_project = ? FOR UPDATE`; hasil kosong `null` | Pass |
| C02-UT13 | `setInformasi/Kebutuhan` | Negatif | Periksa SQL perubahan | Batasi pemilik dan draft/ditolak | Kondisi pemilik/status ada dalam SQL | Pass |

**Cakupan:** tujuh file di atas, termasuk validasi 100% baris/98,82% cabang dan service/repository 100%/100%. Operasi tambahan C02 untuk donasi, relawan, progres, dan riwayat (DPPL §5.43) **bukan bagian 13 tes ini**; rujukan hasil terkait: C06-UT06, INT-TC05, C09/C34/C38, dan UC10 pada bagian tim.

### 4.2.1 Kelas Katalog

**ID Kelas:** C01  
**Nama Kelas:** Katalog  
**Tingkat:** Mendalam

Operasi DPPL diwujudkan oleh beberapa unit (lihat Tugas 9, B.1 No. 20 dan B.5): `terimaKataKunci()` dan `terapkanFilter()` oleh `bacaFilter()` di `server/controllers/pencarian.controller.ts`, `cari()` oleh `KatalogService.cari()` yang menyusun query lewat `bangunKueri()` di `server/repositories/katalog.repository.ts`, dan `tampilkanHasil()` oleh `keItem()` di `server/services/katalog.service.ts`.

Tabel 4.2.1. Hasil Pengujian Unit Kelas C01

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C01-UT01 | `terimaKataKunci()`, `terapkanFilter()` (`bacaFilter()`) | Normal | `q=mangrove&tipe=project&kategori=Clean water&lokasi=Jawa Tengah&status=donasi&periode=berjalan&halaman=2&batas=10` | Kata kunci dan keenam filter terbaca bersamaan | `FilterKatalog` berisi `mangrove`, `project`, `Clean water`, `Jawa Tengah`, `donasi`, `berjalan`, halaman 2, batas 10 | Pass |
| C01-UT02 | `terimaKataKunci()`, `terapkanFilter()` | Batas | Tanpa parameter; lalu `q=%20%20&kategori=&status=&periode=&tipe=` (pilihan "Any" di Explore) | Tanpa parameter memakai nilai bawaan; parameter kosong atau hanya spasi dianggap tidak diisi | Bawaan `tipe: semua`, halaman 1, batas 20; kata kunci, kategori, status, dan periode bernilai `undefined`, tipe `semua` | Pass |
| C01-UT03 | `terimaKataKunci()`, `terapkanFilter()` | Negatif | `tipe=lain`, `status=terbuka`, `periode=besok`, `halaman=0`, `halaman=abc`, `batas=0`, `batas=51`, `batas=-1`, dan `q` sepanjang 101 karakter | Kesembilan masukan ditolak dengan `GalatValidasi` | Kesembilan masukan melempar `GalatValidasi` | Pass |
| C01-UT04 | `cari()` (`bangunKueri()`, Q-014, Q-015) | Normal | Filter kosong | Query data dan query jumlah mengambil dari `project` dan `campaign`, masing-masing dengan syarat `status = 'terpublikasi'` (KF14) | Kedua query memuat `FROM project p`, `FROM campaign c`, dan tepat dua syarat `status = 'terpublikasi'` | Pass |
| C01-UT05 | `cari()` | Normal | `tipe: project`, `kategori: Clean water`, `lokasi: Jawa Barat` | Ketiga filter digabung dengan `AND`; lokasi dicocokkan ke provinsi atau kota | Query memuat `k.tipe = ?`, `k.kategori = ?`, dan `(k.provinsi = ? OR k.kota = ?)` yang digabung `AND` | Pass |
| C01-UT06 | `cari()` | Batas | Delapan kombinasi filter, dari tanpa filter sampai seluruh filter terisi | Jumlah tanda `?` pada query selalu sama dengan jumlah parameter | Jumlah `?` sama dengan jumlah parameter pada kedelapan kombinasi, untuk query data maupun jumlah | Pass |
| C01-UT07 | `cari()` | Negatif | Kata kunci, kategori, dan lokasi diisi `x'; DROP TABLE project; --` | Masukan tidak masuk ke teks SQL, hanya ke daftar parameter (anti *SQL injection*) | Teks SQL tidak memuat `DROP TABLE`; masukan hanya muncul pada daftar parameter | Pass |
| C01-UT08 | `cari()` | Batas | Halaman 3 dengan batas 10; lalu periode `segera` dengan tanggal acuan 6 Nov 2026 | `LIMIT 10 OFFSET 20`; periode `segera` memakai rentang 90 hari | Dua parameter terakhir `[10, 20]`; parameter periode `['2026-11-06', '2027-02-04']` | Pass |
| C01-UT09 | `cari()` (aturan terbuka donasi) | Normal | Filter kosong, status `donasi`, status `selesai`, dan status `relawan` | Campaign hanya terbuka donasi bila periodenya sudah mulai; status `selesai` tidak memasukkan campaign yang belum mulai; status `relawan` tidak terpengaruh aturan campaign | Query memuat `(k.tipe <> 'campaign' OR k.mulai <= ?)` untuk bawaan dan `donasi`, `NOT (k.tipe = 'campaign' AND k.mulai > ?)` untuk `selesai`, dan tidak memuat `k.mulai > ?` untuk `relawan` | Pass |
| C01-UT10 | `cari()` (`escapeLike()`) | Batas | `100%_air\|`; lalu `mangrove Demak` | Karakter khusus `LIKE` diloloskan agar dicari apa adanya; teks biasa tidak berubah | `100\|%\|_air\|\|`; `mangrove Demak` tidak berubah | Pass |
| C01-UT11 | `cari()` (`KatalogService.cari()`) | Normal | Halaman 2, batas 5, waktu sistem 6 Nov 2026 18.00 UTC, sumber data berisi 1 baris dari total 11 | Filter diteruskan apa adanya; tanggal acuan memakai zona WIB; total dan paginasi dikembalikan | Filter diteruskan; `hariIni` 2026-11-07 dan `batasSegera` 2027-02-05; total 11, halaman 2, batas 5, 1 data | Pass |
| C01-UT12 | `cari()` | Negatif | Sumber data tidak mengembalikan baris | Daftar kosong, bukan galat | `data: []`, `total: 0` | Pass |
| C01-UT13 | `tampilkanHasil()` (`keItem()`) | Normal | Baris project Sayung: target 100.000.000, terkumpul 35.000.000, kuota 40, diterima 31 | Angka, koordinat, dan status donasi/relawan terbentuk dengan tipe yang benar | Latitude -6,9, longitude 110,5, persentase capaian 35, `terbukaDonasi` dan `terbukaRelawan` `true`, kuota 40, diterima 31 | Pass |
| C01-UT14 | `tampilkanHasil()` | Batas | Baris campaign tanpa status pelaksanaan dan kuota; baris tanpa koordinat | Campaign tidak memiliki status pelaksanaan, kuota, atau relawan; koordinat kosong tetap `null` | `statusPelaksanaan` dan `kuotaRelawan` `null`, `terbukaRelawan` `false`; latitude dan longitude `null` | Pass |
| C01-UT15 | `tampilkanHasil()` (`hitungPersen()`) | Batas | 35.000.000 dari 100.000.000; 1 dari 3; 10 dari target 0 | Dibulatkan; target 0 menghasilkan 0, bukan pembagian dengan nol | 35; 33; 0 | Pass |
| C01-UT16 | `cari()` (`tanggalWib()`, `tambahHari()`) | Batas | 6 Nov 2026 18.00 UTC dan 16.59 UTC; 31 Des 2026 + 1 hari; 6 Nov 2026 + 90 hari | 18.00 UTC sudah hari berikutnya di WIB; penambahan hari melewati batas bulan dan tahun | 2026-11-07 dan 2026-11-06; 2027-01-01; 2027-02-04 | Pass |
| C01-UT17 | Opsi filter lokasi (`SQL_PROVINSI`, tambahan implementasi) | Normal | Query daftar provinsi untuk filter Explore | Provinsi hanya diambil dari project dan campaign `terpublikasi` | Query memuat `UNION` dan tepat dua syarat `status = 'terpublikasi'` | Pass |

Tabel 4.2.1b. Ringkasan Cakupan Kelas C01

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `terimaKataKunci()`, `terapkanFilter()`, `cari()`, `tampilkanHasil()` |
| Operasi yang diuji | Seluruhnya (4 dari 4 operasi public), ditambah opsi filter provinsi (`SQL_PROVINSI`, tambahan implementasi) |
| ID Algoritma yang tercakup | Algo-014 |
| Coverage (wajib ≥ 70%) | `server/services/katalog.service.ts` 100% / 100%; `server/repositories/katalog.repository.ts` 82,17% / 100%; `shared/katalog.ts` 100% / 100%; `server/controllers/pencarian.controller.ts` 100% / 100% (baris / cabang). Baris yang belum tercakup (196–215 pada `katalog.repository.ts`) adalah `cari()` dan `daftarProvinsi()`, yang mengirim query hasil `bangunKueri()` dan `SQL_PROVINSI` ke MySQL; keduanya diuji pada INT-TC23 (`/api/katalog/opsi`), INT-TC25, dan INT-TC26. Alat: `@vitest/coverage-v8`; bukti pada 4.6 |

### 4.2.3 Kelas Campaign

**ID:** C03 — **Tingkat:** Mendalam.

`validasiData/Target/Periode()` dipetakan ke `validasiAksi`; `simpanCampaign()` dan `tampilkanDetail()` ke `AksiService.buat/lihat` dan repository. `ubahStatus()` serta `getDaftarMenungguVerifikasi()` diuji bersama C11/C26. Algoritma terkait: Algo-006–Algo-010. Coverage validasi 100% baris/98,82% cabang; service/repository 100%/100%.

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C03-UT01 | `validasiData` | Normal | Judul dengan spasi, rincian dana sah | Judul dirapikan, rincian utuh | Judul tanpa spasi tepi; rincian sama | Pass |
| C03-UT02 | `validasiTarget` | Batas/negatif | 0,01; 1 miliar; 0; negatif; melebihi batas; >2 desimal; tipe salah | Dua batas diterima; sisanya ditolak | Seluruh variasi sesuai | Pass |
| C03-UT03 | `validasiPeriode` | Batas | Durasi 0, 365, 366 hari | Hanya 365 hari valid | Satu hari/366 hari ditolak; 365 diterima | Pass |
| C03-UT04 | `validasiPeriode` | Normal/negatif | Periode berlangsung lalu sudah berakhir | Berlangsung valid; berakhir ditolak | Sesuai kedua kondisi | Pass |
| C03-UT05 | `validasiData` | Batas/negatif | Judul 200/201/kosong; deskripsi 10000/10001 karakter | Batas panjang diterima | 200/10000 diterima; sisanya ditolak | Pass |
| C03-UT06 | `validasiData` | Negatif | Badan null, array, angka, teks | Seluruhnya ditolak | Seluruhnya melempar galat | Pass |
| C03-UT07 | `validasiData` | Batas | Atribut opsional tidak disertakan | Nilai kosong yang aman | Kategori kosong; rincian `[]` | Pass |
| C03-UT08 | `ubahStatus` (alasan) | Batas/negatif | Alasan berspasi, 2000/2001 karakter, kosong/null | Trim; maksimal 2000 dan tidak kosong | Trim/2000 diterima; lainnya ditolak | Pass |
| C03-UT09 | `simpanCampaign/tampilkanDetail` | Normal | Buat campaign sah | Baca kembali hasil penyimpanan | `jenis=campaign`; cari dipanggil dengan ID hasil buat | Pass |
| C03-UT10 | `simpanCampaign` | Negatif | Repository gagal | Galat diteruskan, bukan sukses | Promise ditolak dengan galat repository | Pass |
| C03-UT11 | `tampilkanDetail` | Batas | JSON rincian berbentuk teks; atribut null | DTO aman dan rincian terurai | Rincian sesuai; kategori kosong; rincian null menjadi `[]` | Pass |
| C03-UT12 | `simpanCampaign/Project` | Negatif | Judul berisi potongan SQL | Nilai tetap sebagai parameter | Potongan SQL hanya di parameter, bukan query | Pass |

**Batas cakupan:** operasi donasi `cekStatusCampaign()`, `tambahDana()`, dan `hitungPersentaseCapaian()` tidak masuk 12 tes ini; hasil lintas modul dirujuk pada C06-UT06/UT07 dan INT-TC05.

### 4.2.4 Kelas Donatur

**ID Kelas:** C04  
**Nama Kelas:** Donatur  
**Tingkat:** Mendalam

Tabel 4.2.4. Hasil Pengujian Unit Kelas C04

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C04-UT01 | `cukupUntuk(nominal): Boolean` | Batas | Donatur bersaldo 100.000; nominal 100.000 (tepat sama dengan saldo) | `true` | `cukupUntuk(100.000)` mengembalikan `true` | Pass |
| C04-UT02 | `cukupUntuk(nominal): Boolean` | Negatif | Donatur bersaldo 100.000; nominal 100.000,01 | `false` | `cukupUntuk(100.000,01)` mengembalikan `false` | Pass |
| C04-UT03 | `kurangiSaldo(nominal): Boolean` (di memori) | Normal | Donatur bersaldo 100.000; `kurangiSaldo(25.000,1)` | `getSaldo()` = 74.999,9 | `getSaldo()` = 74.999,9 | Pass |
| C04-UT04 | `tambahSaldo(nominal)` (top-up, di luar DPPL) | Normal | Donatur bersaldo 750.000; `tambahSaldo(100.000)` | `getSaldo()` = 850.000 | `getSaldo()` = 850.000 | Pass |
| C04-UT05 | `kurangiSaldo()` pada basis data (Q-106) | Negatif | Saldo 100.000; 10 donasi @25.000 dikirim **bersamaan** ke project terbuka | Tepat 4 berhasil, 6 ditolak `SALDO_KURANG`; saldo akhir 0 (tidak negatif); dana project bertambah tepat 100.000; transaksi bertambah 4 | 4 donasi berhasil, 6 ditolak `SALDO_KURANG`; saldo akhir 0; dana project +100.000; transaksi +4 | Pass |
| C04-UT06 | `getSaldo(): double` dari basis data (Q-105) | Normal | Saldo 300.000; dua donasi @100.000 ke campaign | `saldoSesudah` pada hasil donasi kedua = 100.000 | `saldoSesudah` donasi kedua = 100.000 | Pass |

Tabel 4.2.4b. Ringkasan Cakupan Kelas C04

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `getSaldo()`, `kurangiSaldo()` |
| Operasi yang diuji | `getSaldo()`, `kurangiSaldo()`, ditambah `cukupUntuk()`, `tambahSaldo()`, dan `kunciDonatur()` (tambahan implementasi, lihat B.5 Tugas 9) |
| ID Algoritma yang tercakup | Algo-103, Algo-104 |
| Coverage (wajib ≥ 70%) | Baris 97,37% / cabang 93,75% (`models/Donatur.ts`); `DonasiRepository.ts` 99,21% / 81,25%. Alat: `node --experimental-test-coverage`; bukti pada 4.6 |

### 4.2.5 Kelas PetaWilayah

**ID Kelas:** C05  
**Nama Kelas:** PetaWilayah  
**Tingkat:** Mendalam

`koordinatPusat` dan `radius` menjadi parameter konstruktor `PetaWilayah` di `server/services/peta.service.ts`, sedangkan query Q-101 s.d. Q-104 berada di `server/repositories/peta.repository.ts` (lihat Tugas 9, B.1 No. 23). Kelas ini dipanggil oleh `PetaController.getSebaran()` (`GET /api/peta`), yang juga mewujudkan `getSebaranProject()` pada C34 RelawanController (lihat Tabel 4.2.34b), sehingga pembacaan permintaannya ikut diuji di sini.

Tabel 4.2.5. Hasil Pengujian Unit Kelas C05

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C05-UT01 | `koordinatPusat` (`pecahKoordinat()`) | Normal | `-6.9, 110.5` | Terurai menjadi lintang dan bujur | `{ lat: -6.9, lng: 110.5 }` | Pass |
| C05-UT02 | `koordinatPusat` (`pecahKoordinat()`) | Negatif | `abc`; `95,10` (lintang > 90); `10,190` (bujur > 180); teks kosong | Keempatnya ditolak | Keempatnya mengembalikan `null` | Pass |
| C05-UT03 | `tampilkanSebaranProject()` (Q-102) | Normal | Radius 0 tanpa titik pusat; sumber data berisi baris dengan angka bertipe teks | Sumber dipanggil tanpa wilayah; angka diubah menjadi bilangan | Sumber dipanggil dengan `undefined`; latitude -6,9, longitude 110,5, target 1.000, terkumpul 250 | Pass |
| C05-UT04 | `tampilkanSebaranProject()` (Q-101) | Batas | Radius 25 dengan pusat `-6.9,110.5` | Wilayah diteruskan ke query dalam kilometer | Sumber dipanggil dengan `{ lat: -6.9, lng: 110.5, radiusKm: 25 }` | Pass |
| C05-UT05 | `tampilkanSebaranProject()` | Negatif | Radius 5 dengan pusat `xx` | Ditolak karena titik pusat tidak valid | Melempar galat yang menyebut `koordinatPusat` | Pass |
| C05-UT06 | `tampilkanSebaranCampaign()` (Q-104) | Batas | Waktu sistem 7 Nov 2026 20.00 UTC (8 Nov 2026 03.00 WIB) | Batas periode campaign memakai tanggal hari ini zona WIB, sehingga campaign yang berakhir 7 Nov tidak dipetakan | Sumber dipanggil dengan tanggal `2026-11-08` | Pass |
| C05-UT07 | `PetaController.getSebaran()` (`bacaPermintaan()`, tambahan implementasi) | Normal | Tanpa parameter; lalu `jenis=project&pusat=-6.9,110.5&radius=30` | Tanpa parameter memakai bawaan; parameter terisi terbaca | Bawaan `{ jenis: semua, koordinatPusat: '', radius: 0 }`; lalu `{ jenis: project, koordinatPusat: '-6.9,110.5', radius: 30 }` | Pass |
| C05-UT08 | `PetaController.getSebaran()` (`bacaPermintaan()`) | Negatif | `jenis=lain`, `radius=-1`, `radius=abc`, `radius=99999` (di atas 20.000 km), `radius=10` tanpa pusat, `radius=10&pusat=salah` | Keenam masukan ditolak dengan `GalatValidasi` | Keenam masukan melempar `GalatValidasi` | Pass |
| C05-UT09 | `PetaController.getSebaran()` | Normal | Tanpa parameter | Titik project dan campaign digabung | Tipe hasil berurutan `project`, `campaign` | Pass |
| C05-UT10 | `PetaController.getSebaran()` | Batas | `jenis=project` | Hanya project yang diambil; sumber campaign tidak dipanggil | 1 titik; sumber campaign tidak dipanggil | Pass |
| C05-UT11 | `tampilkanSebaranProject()` (`PetaRepository.sebaranProject()`, Q-102) | Normal | Tanpa wilayah; fungsi `query` basis data diganti tiruan | Query hanya mengambil project `terpublikasi` yang memiliki latitude dan longitude, tanpa syarat radius | SQL memuat `FROM project`, `status = 'terpublikasi'`, dan `latitude IS NOT NULL AND longitude IS NOT NULL`, tanpa `ST_Distance_Sphere`; parameter `[]` | Pass |
| C05-UT12 | `tampilkanSebaranProject()` (`denganWilayah()`, Q-101) | Batas | Wilayah lintang -6,9, bujur 110,5, radius 30 km | Syarat `ST_Distance_Sphere` ditambahkan; parameter berurutan bujur, lintang, lalu radius dalam meter | SQL memuat `ST_Distance_Sphere(POINT(longitude, latitude), POINT(?, ?)) <= ?`; parameter `[110.5, -6.9, 30000]`; jumlah `?` sama dengan jumlah parameter | Pass |
| C05-UT13 | `tampilkanSebaranProject()` | Normal | Basis data tiruan mengembalikan satu baris `mgv` | Baris diteruskan apa adanya ke service | Hasil sama dengan baris dari basis data | Pass |
| C05-UT14 | `tampilkanSebaranCampaign()` (`PetaRepository.sebaranCampaign()`, Q-104) | Normal | Tanpa wilayah, tanggal 2026-11-20 | Query hanya mengambil campaign `terpublikasi` yang periodenya belum berakhir | SQL memuat `FROM campaign`, `status = 'terpublikasi'`, dan `periode_selesai >= ?`, tanpa `ST_Distance_Sphere`; parameter `['2026-11-20']` | Pass |
| C05-UT15 | `tampilkanSebaranCampaign()` (`denganWilayah()`, Q-103) | Batas | Tanggal 2026-11-20, wilayah lintang -9,65, bujur 120,26, radius 0,5 km | Tanggal tetap parameter pertama; radius pecahan diubah ke meter | Parameter `['2026-11-20', 120.26, -9.65, 500]`; jumlah `?` sama dengan jumlah parameter | Pass |

Tabel 4.2.5b. Ringkasan Cakupan Kelas C05

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `tampilkanSebaranProject()`, `tampilkanSebaranCampaign()` |
| Operasi yang diuji | Seluruhnya (2 dari 2 operasi public), ditambah `pecahKoordinat()` dan `PetaController.getSebaran()` (tambahan implementasi) |
| ID Algoritma yang tercakup | Algo-101, Algo-102 |
| Coverage (wajib ≥ 70%) | `server/services/peta.service.ts` 100% / 100%; `server/controllers/peta.controller.ts` 97,5% / 95,23%; `server/repositories/peta.repository.ts` 100% / 100% (baris / cabang). Query Q-101 s.d. Q-104 juga diuji terhadap MySQL sungguhan pada INT-TC27 dan INT-TC28. Alat: `@vitest/coverage-v8`; bukti pada 4.6 |

### 4.2.6 Kelas TransaksiDonasi

**ID Kelas:** C06  
**Nama Kelas:** TransaksiDonasi  
**Tingkat:** Mendalam

Operasi yang memerlukan basis data (`validasiDuplikasi()`, `prosesDonasi()`, `getRiwayatTransaksi()`, `getDetailTransaksi()`) diwujudkan pada `DonasiService` dan `DonasiRepository` (lihat B.5 Tugas 9), sehingga diuji terhadap MySQL sungguhan.

Tabel 4.2.6. Hasil Pengujian Unit Kelas C06

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C06-UT01 | `validasiNominal(nominal): Boolean` | Normal | 1; 0,01; 25.000; 12.345,67 | Semua `true` | Seluruh nominal valid mengembalikan `true` | Pass |
| C06-UT02 | `validasiNominal(nominal): Boolean` | Batas | 1.000.000.000 (`NOMINAL_MAKS`) dan 1.000.000.001 | `true` untuk 1.000.000.000; `false` untuk 1.000.000.001 | 1.000.000.000 → `true`; 1.000.000.001 → `false` | Pass |
| C06-UT03 | `validasiNominal(nominal): Boolean` | Negatif | 0; -1; -25.000; 0,001; `NaN`; `Infinity`; `'25000'` (string); `null`; `undefined` | Semua `false` | Seluruh masukan tidak valid mengembalikan `false` | Pass |
| C06-UT04 | `buatTransaksi(...): TransaksiDonasi` | Normal | Membuat 100 transaksi (u1 → project `mgv`, 25.000, *key* berbeda) | Semua berstatus `berhasil`; 100 ID transaksi unik | 100 transaksi berstatus `berhasil` dengan 100 ID unik | Pass |
| C06-UT05 | `validasiDuplikasi(idempotencyKey): Boolean` | Negatif | Saldo 100.000; 5 donasi @10.000 dengan *idempotency key* **sama** dikirim bersamaan, lalu dikirim ulang sekali | 1 berhasil, 4 ditolak `DUPLIKAT`; pengiriman ulang juga `DUPLIKAT`; saldo akhir 90.000; transaksi bertambah 1 | 1 berhasil, 4 ditolak `DUPLIKAT`; kiriman ulang `DUPLIKAT`; saldo akhir 90.000; transaksi +1 | Pass |
| C06-UT06 | `prosesDonasi(): Boolean` | Normal | Saldo 300.000; dua donasi @100.000 ke campaign bertarget 400.000 (donasi pertama dengan pesan "Semangat") | Dua ID transaksi berbeda; persentase capaian 25% lalu 50%; dana terkumpul 200.000; saldo sisa 100.000 | ID transaksi berbeda; capaian 25% lalu 50%; dana terkumpul 200.000; saldo sisa 100.000 | Pass |
| C06-UT07 | `prosesDonasi(): Boolean` | Negatif | Saldo 100.000; donasi 25.000 ke project ditutup, campaign lewat periode, dan ID tujuan yang tidak ada, memakai *key* yang sama | Ketiganya `TUJUAN_DITUTUP`; saldo tetap 100.000; tidak ada transaksi tercatat; *key* yang sama lalu dapat dipakai untuk donasi sah (`OK`) | Ketiganya `TUJUAN_DITUTUP`; saldo tetap 100.000; tidak ada transaksi tertinggal; key yang sama lalu berhasil (`OK`) | Pass |
| C06-UT08 | `prosesDonasi(): Boolean` | Batas | Saldo 50.000; nominal 0, -10.000, 1.000.000.001, 0,001, lalu 50.000,01 | Empat pertama `NOMINAL_TIDAK_VALID`; 50.000,01 `SALDO_KURANG`; saldo tetap 50.000 | Empat nominal pertama `NOMINAL_TIDAK_VALID`; 50.000,01 `SALDO_KURANG`; saldo tetap 50.000 | Pass |
| C06-UT09 | `getRiwayatTransaksi(idPengguna)` | Normal | Setelah C06-UT06, ambil riwayat donatur | Kedua ID transaksi ada di riwayat | Kedua ID transaksi muncul di riwayat | Pass |
| C06-UT10 | `getDetailTransaksi(idTransaksi)` | Negatif | Pemilik membuka rinciannya; pengguna lain membuka transaksi yang sama | Pemilik mendapat rincian; pengguna lain diperlakukan sebagai tidak ditemukan (404) | Pemilik mendapat rincian; pengguna lain diperlakukan sebagai tidak ditemukan | Pass |

Tabel 4.2.6b. Ringkasan Cakupan Kelas C06

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `validasiNominal()`, `validasiDuplikasi()`, `prosesDonasi()`, `buatTransaksi()`, `getRiwayatTransaksi()`, `getDetailTransaksi()` |
| Operasi yang diuji | Seluruhnya (`validasiNominal()`, `validasiDuplikasi()`, `prosesDonasi()`, `buatTransaksi()`, `getRiwayatTransaksi()`, `getDetailTransaksi()`) |
| ID Algoritma yang tercakup | Algo-105, Algo-106, Algo-107, Algo-108, Algo-109, Algo-110 |
| Coverage (wajib ≥ 70%) | `models/TransaksiDonasi.ts` 98,65% / 85,71%; `DonasiService.ts` 87,78% / 83,33%; `DonasiRepository.ts` 99,21% / 81,25%. Bukti pada 4.6 |

### 4.2.7 Kelas BuktiTransaksi

**ID Kelas:** C07  
**Nama Kelas:** BuktiTransaksi  
**Tingkat:** Mendalam

Tabel 4.2.7. Hasil Pengujian Unit Kelas C07

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C07-UT01 | `cetakBukti(): void` | Normal | Rincian transaksi berstatus `berhasil` | Bukti terbentuk; `idBukti` ≤ 36 karakter (muat VARCHAR(36)) | Bukti terbentuk; `idBukti` ≤ 36 karakter | Pass |
| C07-UT02 | `cetakBukti(): void` | Negatif | Rincian transaksi berstatus `gagal` | Melempar galat; bukti tidak dibuat | Melempar galat; bukti tidak dibuat | Pass |
| C07-UT03 | `uraiRincian()` | Normal | Rincian dalam bentuk JSON | Hasil urai sama persis dengan rincian asal | Hasil urai sama dengan rincian asal | Pass |
| C07-UT04 | `uraiRincian()` | Negatif | Teks bebas data seed "Donasi Rp75.000 dari Andi Rahman" | `null` | Mengembalikan `null` | Pass |
| C07-UT05 | `cetakBukti()` setelah donasi (Q-112, Q-113) | Normal | Lakukan donasi sah, lalu ambil buktinya | Bukti dibuat otomatis dan memuat ID transaksi, waktu, status, donatur, tujuan, dan nominal | Bukti dibuat otomatis dan memuat seluruh isi AC1 | Pass |
| C07-UT06 | `tampilkanBukti(): String` | Negatif | Bukti dibuka oleh bukan pemilik, dan dengan ID yang tidak ada | Keduanya mendapat galat yang sama (`TIDAK_DITEMUKAN`), sehingga keberadaan transaksi tidak bocor | Bukan pemilik dan ID tidak ada mendapat galat yang sama | Pass |
| C07-UT07 | `cetakBukti()` | Batas | Bukti dihapus, lalu diminta beberapa kali bersamaan | Bukti dibuat ulang tepat satu kali, tanpa duplikat (`ON DUPLICATE KEY`) | Bukti dibuat ulang tanpa duplikat | Pass |
| C07-UT08 | `tampilkanBukti(): String` | Normal | Setelah bukti dibuat, nama tujuan diubah | Rincian bukti tetap memakai nama lama (*snapshot*) | Rincian bukti tidak berubah setelah nama tujuan diubah | Pass |

Tabel 4.2.7b. Ringkasan Cakupan Kelas C07

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `cetakBukti()`, `tampilkanBukti()` |
| Operasi yang diuji | `cetakBukti()`, `tampilkanBukti()`, ditambah `uraiRincian()` (tambahan implementasi) |
| ID Algoritma yang tercakup | Algo-111, Algo-112 |
| Coverage (wajib ≥ 70%) | `models/BuktiTransaksi.ts` 100% / 85,71%; fungsi bukti di `DonasiService.ts` dan `DonasiRepository.ts` (lihat C06). Bukti pada 4.6 |

### 4.2.9 Kelas PendaftaranRelawan

**ID Kelas:** C09  
**Nama Kelas:** PendaftaranRelawan  
**Tingkat:** Mendalam

Operasi DPPL diwujudkan oleh beberapa unit: `bersihkanForm()` dan `validasiFormPendaftaran()` di `shared/relawan.ts`, `keDto()` di `models/PendaftaranRelawan.ts`, serta `daftarRelawan()`, `daftarPendaftar()`, dan `putuskanPendaftaran()` di `server/services/relawanService.ts` (lihat Tugas 9, B.5).

Tabel 4.2.9. Hasil Pengujian Unit Kelas C09

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C09-UT01 | `buatPendaftaran()` (`daftarRelawan()`) | Normal | Formulir lengkap untuk project terbuka (kuota 3, belum ada relawan diterima) | Objek baru berstatus `pending`, `tanggalKeputusan` kosong, ID berformat `V-xxxxxxxx` | Status `pending`, `tanggalKeputusan` null, ID `V-` diikuti 8 karakter heksadesimal | Pass |
| C09-UT02 | `buatPendaftaran()` (`bersihkanForm()`) | Batas | 20 butir keahlian, lalu 21 butir | 20 butir diterima; 21 butir ditolak dengan pesan maksimal 20 | 20 butir tanpa galat; 21 butir ditolak "Maksimal 20 keahlian." | Pass |
| C09-UT03 | `buatPendaftaran()` (`bersihkanForm()`) | Negatif | Masukan bukan teks: angka, `null`, larik, objek | Semua kolom dianggap kosong, tidak melempar galat | Data diri, keahlian, pengalaman, dan jadwal menjadi kosong | Pass |
| C09-UT04 | `validasiKelengkapan()` (`validasiFormPendaftaran()`) | Normal | Formulir lengkap | Tidak ada pesan galat | Objek galat kosong | Pass |
| C09-UT05 | `validasiKelengkapan()` | Batas | Nama 100 karakter, lalu 101 karakter | 100 karakter lolos; 101 karakter ditolak | 100 karakter lolos; 101 ditolak "Nama maksimal 100 karakter." | Pass |
| C09-UT06 | `validasiKelengkapan()` | Negatif | Badan permintaan kosong `{}` | Ditolak 400 dengan pesan pada keenam kolom; tidak ada yang disimpan | Status 400; galat pada `nama`, `telepon`, `kota`, `keahlian`, `pengalaman`, `jadwal`; tidak ada baris tersimpan | Pass |
| C09-UT07 | `cekPendaftaranGanda()` | Normal | Volunteer belum pernah mendaftar pada project tersebut | Pendaftaran disimpan | Satu baris tersimpan | Pass |
| C09-UT08 | `cekPendaftaranGanda()` | Negatif | Volunteer sudah memiliki pendaftaran pada project yang sama | Ditolak 409 "Anda sudah mendaftar pada project ini."; tidak ada yang disimpan | Ditolak 409 dengan pesan tersebut; tidak ada baris baru | Pass |
| C09-UT09 | `cekPendaftaranGanda()` | Batas | Dua kiriman bersamaan: pemeriksaan awal lolos, tetapi `INSERT` kedua gagal `ER_DUP_ENTRY` (UNIQUE KEY) | Tetap ditolak 409 dengan pesan pendaftaran ganda, bukan 500 | Ditolak 409 "Anda sudah mendaftar pada project ini." | Pass |
| C09-UT10 | `simpanPendaftaran()` | Normal | Dua keahlian dan dua hari | Kolom tersimpan sebagai `Nama: …; Telepon: …; Kota: …`, keahlian dipisah koma, jadwal dipisah titik koma, status `pending` | Data diri, keahlian, dan jadwal tersimpan dengan format tersebut; status `pending` | Pass |
| C09-UT11 | `simpanPendaftaran()` (pemeriksaan kuota) | Batas | Kuota 3: diterima 2 (sisa satu), lalu diterima 3 | Sisa satu kuota masih diterima; kuota penuh ditolak 409 | Pendaftaran pertama tersimpan; berikutnya ditolak 409 "Kuota relawan project ini sudah penuh." | Pass |
| C09-UT12 | `simpanPendaftaran()` | Negatif | Pendaftaran ditutup; project milik sendiri; project belum terpublikasi; akun tidak dikenal | Berturut-turut 409, 403, 404, 401; tidak ada yang disimpan | 409, 403, 404, 401; tidak ada baris tersimpan | Pass |
| C09-UT13 | `getDetailPendaftar()` (`keDto()`) | Normal | Pemilik membuka daftar pendaftar | Data diri, keahlian, dan jadwal diurai kembali menjadi bentuk terstruktur | `dataDiri` {Rina, 0812-1111-2222, Bandung}; keahlian dan jadwal berupa larik | Pass |
| C09-UT14 | `getDetailPendaftar()` | Batas | Project milik pengguna tanpa pendaftar | Daftar kosong, bukan galat | `[]` | Pass |
| C09-UT15 | `getDetailPendaftar()` | Negatif | Bukan pemilik; project tidak ada | 403; 404 | 403; 404 | Pass |
| C09-UT16 | `perbaruiStatus()` (`putuskanPendaftaran()`) | Normal | Pemilik menerima pendaftaran `pending` (kuota tersedia) | Status `accepted` dengan tanggal keputusan | Status `accepted`; `tanggalKeputusan` terisi; satu keputusan tersimpan | Pass |
| C09-UT17 | `perbaruiStatus()` | Batas | Kuota 3 dan sudah 3 diterima; coba *accept*, lalu *reject* | *Accept* ditolak 409; *reject* tetap boleh | *Accept* ditolak 409 "Kuota relawan sudah penuh, pendaftaran tidak dapat diterima."; *reject* berhasil | Pass |
| C09-UT18 | `perbaruiStatus()` | Negatif | Pendaftaran sudah `rejected`; keputusan `"maybe"`; pendaftaran milik project lain; bukan pemilik | 409; 400; 404; 403; tidak ada keputusan tersimpan | 409; 400; 404; 403; tidak ada keputusan tersimpan | Pass |

Tabel 4.2.9b. Ringkasan Cakupan Kelas C09

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `buatPendaftaran()`, `validasiKelengkapan()`, `cekPendaftaranGanda()`, `simpanPendaftaran()`, `getDetailPendaftar()`, `perbaruiStatus()` |
| Operasi yang diuji | Seluruhnya (6 dari 6 operasi public) |
| ID Algoritma yang tercakup | Algo-113, Algo-114, Algo-115, Algo-116, Algo-117 |
| Coverage (wajib ≥ 70%) | `models/PendaftaranRelawan.ts` 100% / 85,71%; `shared/relawan.ts` 95,35% / 89,02%; `server/services/relawanService.ts` 99,19% / 94,03% (baris / cabang). Alat: `node --experimental-test-coverage`; bukti pada 4.6 |

### 4.2.10 Kelas PembuatProject

**ID:** C10 — **Tingkat:** Mendalam.

`buatCampaign/Project()` → `AksiService.buat()`, `ajukanVerifikasi()` → `AksiService.ajukan()` (C26-UT01–UT03). Operasi pengelolaan relawan dan progres pada DPPL §5.7 didelegasikan ke modul UC08/UC09; hasilnya dirujuk pada C34/C38, bukan diklaim tercakup keenam tes berikut. Coverage service/repository/controller bersama: 100% baris dan cabang; file autentikasi tidak masuk pengukuran.

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C10-UT01 | `buatCampaign/Project` | Normal/negatif | JSON mencoba mengganti pemilik/status | Pemilik dari sesi; status bukan dari klien | Repository menerima `owner` dan data tervalidasi | Pass |
| C10-UT02 | `buatCampaign/Project` | Negatif | Peran volunteer/admin membuat aksi | 403 tanpa penulisan | 403; `buat()` repository tidak dipanggil | Pass |
| C10-UT03 | Daftar milik sendiri | Normal/negatif | Pembuat lalu volunteer meminta daftar | Filter pemilik; volunteer ditolak | Filter `owner`; volunteer 403 | Pass |
| C10-UT04 | Akses detail | Normal/negatif | Pemilik/admin, pembuat lain, ID hilang | Pemilik/admin boleh; lainnya 404 | Kedua pengguna berhak mendapat detail; lainnya 404 | Pass |
| C10-UT05 | Endpoint My Actions | Normal | Controller menerima sesi pembuat | Daftar diteruskan dengan sesi | 200, JSON `aksi: []`; sesi diteruskan | Pass |
| C10-UT06 | Query daftar | Normal | Daftar pemilik dan antrean pending | Filter diterapkan pada kedua tabel | `UNION ALL` dengan parameter pemilik/status di kedua sisi | Pass |

### 4.2.11 Kelas AdminSistem

**ID:** C11 — **Tingkat:** Mendalam.

Seluruh operasi DPPL (`tinjauPengajuan`, `setujuiPengajuan`, `tolakPengajuan`) diwujudkan oleh `AksiService.lihat/antrean/putuskan`; akses detail admin juga diuji pada C10-UT04. Coverage service bersama: 100% baris/cabang. Aturan keputusan berhubungan dengan Algo-010 dan Algo-013.

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C11-UT01 | `tinjauPengajuan` (antrean) | Normal | Admin meminta antrean | Hanya pending diminta | Filter `menunggu_verifikasi` diteruskan | Pass |
| C11-UT02 | Hak admin | Negatif | Pembuat/volunteer meminta antrean dan keputusan | Seluruhnya 403 | 403; tidak ada penulisan keputusan | Pass |
| C11-UT03 | `setujuiPengajuan` | Normal | Setujui pending | Published tanpa alasan penolakan | `terpublikasi`, alasan null, koneksi transaksi sama | Pass |
| C11-UT04 | `tolakPengajuan` | Batas/negatif | Alasan spasi lalu alasan sah berspasi tepi | Kosong 400; alasan sah dirapikan | 400 lalu status `ditolak` dengan `Perbaiki lokasi` | Pass |

### 4.2.12 Kelas Akun

**ID Kelas:** C12 — **Nama Kelas:** Akun — **Tingkat:** Mendalam

Operasi DPPL §5.2: `validasiKelengkapanInput()`, `cekKetersediaanEmail()` (Algo-001), `simpanAkun()` (Algo-002), dan `validasiKredensial()` (Algo-003), yang diwujudkan oleh `AutentikasiService.daftarAkun()` dan `AutentikasiService.login()`.

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C12-UT01 | `simpanAkun()` (`daftarAkun()`) | Normal | Nama `Budi Santoso`, email `Budi@Mail.com ` (huruf besar dan spasi), kata sandi `rahasia123` | Akun tersimpan dengan email `budi@mail.com`, peran `volunteer`, status `aktif`; `passwordHash` tidak sama dengan kata sandi asli | Akun tersimpan dengan email `budi@mail.com`, peran `volunteer`, status `aktif`; hash berbeda dari kata sandi | Pass |
| C12-UT02 | `validasiKelengkapanInput()` | Negatif dan batas | Enam masukan: nama kosong; nama `  Al ` (2 huruf, di bawah minimum 3); email kosong; email `budi@mail` (tanpa domain puncak); kata sandi kosong; kata sandi `1234567` (7 karakter, di bawah minimum 8) | Keenamnya ditolak `VALIDASI` dengan `bidang` sesuai kolom (`nama`, `email`, `password`); repository tidak dipanggil sama sekali | Keenamnya ditolak `VALIDASI` dengan `bidang` yang sesuai; daftar panggilan repository kosong | Pass |
| C12-UT03 | `cekKetersediaanEmail()` | Negatif | Daftar `Budi@Mail.com `, lalu daftar lagi dengan `  BUDI@mail.COM` | Pendaftaran kedua ditolak `EMAIL_TERPAKAI` dengan `bidang: email`; `simpanAkunBaru()` hanya terpanggil satu kali | Ditolak `EMAIL_TERPAKAI`, `bidang` = `email`; `simpanAkunBaru()` terpanggil 1 kali | Pass |
| C12-UT04 | `simpanAkun()` (hash KF03) | Normal | `hashPassword('rahasia123')`, lalu `cocokPassword()` dengan kata sandi benar dan salah | Hash berpola bcrypt *cost* 12 (`$2a$12$`, `$2b$12$`, atau `$2y$12$`); kata sandi benar cocok, kata sandi salah tidak | Hash cocok dengan pola `^\$2[aby]\$12\$`; `rahasia123` cocok, `salah12345` tidak | Pass |
| C12-UT05 | `validasiKredensial()` | Negatif | Login dengan kata sandi salah; login dengan email `siapa@mail.com` yang tidak terdaftar | Keduanya `KREDENSIAL_SALAH` dengan kode, pesan, dan `bidang` yang sama persis; tidak ada sesi dibuat | Kode, pesan ("The email or password doesn't match. Check them and try again."), dan `bidang` identik; `simpanSesi()` tidak terpanggil | Pass |
| C12-UT06 | `validasiKredensial()` | Negatif | Login dengan email tidak terdaftar; fungsi pembanding kata sandi dicatat | Kata sandi tetap dibandingkan satu kali dengan hash `null` (hash tiruan) agar waktu tanggap seragam | Pembanding dipanggil tepat satu kali dengan hash `null` | Pass |
| C12-UT07 | `validasiKredensial()` | Negatif | Akun diubah menjadi `nonaktif`, lalu login dengan kredensial benar | Ditolak dengan galat yang sama persis dengan kata sandi salah; tidak ada sesi dibuat | Galat identik dengan kata sandi salah; `simpanSesi()` tidak terpanggil | Pass |
| C12-UT08 | `validasiKredensial()` | Negatif | Akun `nonaktif`; jumlah pemanggilan pembanding kata sandi dihitung | Kata sandi tetap dibandingkan satu kali (waktu tanggap seragam) | Pembanding dipanggil 1 kali | Pass |
| C12-UT09 | `validasiKredensial()` | Batas | Email berisi satu spasi; kata sandi kosong | Ditolak `VALIDASI` per kolom (`email`, `password`) sebelum basis data disentuh | `bidang` masing-masing `email` dan `password`; repository tidak dipanggil | Pass |

Tabel 4.2.12b. Ringkasan Cakupan Kelas C12

| Informasi | Keterangan |
| :--- | :--- |
| Operasi yang diuji | `validasiKelengkapanInput()`, `cekKetersediaanEmail()`, `simpanAkun()`, `validasiKredensial()` (seluruh operasi public C12 pada DPPL §5.2) |
| Coverage (wajib ≥ 70%) | `models/Akun.ts` 89,83% / 86,67%; `server/password.ts` 100% / 75% (baris / cabang). Bukti pada 4.6 |
| Batas pengujian | Panjang tepat minimum (nama 3 huruf, kata sandi 8 karakter) dan maksimum (nama 100, kata sandi 72) belum memiliki kasus tersendiri; kasus tepat di bawah minimum sudah diuji pada C12-UT02. |

### 4.2.13 Kelas SesiLogin

**ID Kelas:** C13 — **Nama Kelas:** SesiLogin — **Tingkat:** Mendalam

Operasi DPPL §5.3: `buatSesi()` (Algo-004) dan `cekStatusLogin()` (Algo-005), ditambah pengakhiran sesi saat logout (Q-006).

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C13-UT01 | `buatSesi()` | Normal | Login `BUDI@mail.com` / `rahasia123` pada jam tetap `2026-11-09T08:00:00Z` | ID sesi 64 karakter heksadesimal; status `aktif`; kedaluwarsa tepat 24 jam setelah login; sesi tersimpan | ID cocok dengan `^[0-9a-f]{64}$`; status `aktif`; selisih kedaluwarsa = `DURASI_SESI_MS`; sesi ada di repository | Pass |
| C13-UT02 | `cekStatusLogin()` | Normal dan negatif | Periksa ID sesi hasil login; tanpa ID (`undefined`); ID `id-palsu` | Sesi sah mengembalikan pengguna `budi@mail.com`; tanpa ID dan ID tak dikenal mengembalikan `null` (tamu) | Sesi sah mengembalikan `budi@mail.com`; dua lainnya `null` | Pass |
| C13-UT03 | `cekStatusLogin()` | Batas | Jam dimajukan 24 jam − 1 ms, lalu 1 ms lagi (tepat kedaluwarsa), lalu diperiksa sekali lagi | Sebelum batas: sah. Tepat di batas: `null` dan sesi ditandai `berakhir`. Pemeriksaan berikutnya tidak menulis ulang ke basis data | Sebelum batas sah dan tetap `aktif`; tepat di batas `null` dan `berakhir`; `akhiriSesi()` tidak terpanggil lagi | Pass |
| C13-UT04 | `cekStatusLogin()` | Negatif | Login, lalu akun diubah menjadi `nonaktif` | Sesi yang masih berlaku tidak dikenali lagi (`null`) | `null` | Pass |
| C13-UT05 | `akhiriSesi()` (`logout()`) | Normal dan batas | Logout dengan ID sesi aktif; logout kedua dengan ID yang sama; logout tanpa ID | Sesi tidak dikenali lagi setelah logout; logout ulang dan tanpa ID tidak melempar galat (idempoten) | Sesi menjadi `null`; kedua logout berikutnya berjalan tanpa galat | Pass |
| C13-UT06 | `cekStatusLogin()` | Batas | `aksi.auth.spec.ts` "pemeriksaan sesi bersama mempertahankan penolakan sesi masa depan": `waktuMulai` satu menit setelah jam sekarang, lalu tepat sama dengan jam sekarang | Sesi yang belum dimulai ditolak (`false`); sesi yang dimulai tepat sekarang diterima (`true`) | Sesi yang dimulai satu menit lagi ditolak (`false`); sesi yang dimulai tepat sekarang diterima (`true`). Asersi yang sama dijalankan dengan `node:test`: 1 pass, 0 fail | Pass |

Tabel 4.2.13b. Ringkasan Cakupan Kelas C13

| Informasi | Keterangan |
| :--- | :--- |
| Operasi yang diuji | `buatSesi()`, `cekStatusLogin()` (`penggunaDariSesi()`), `akhiriSesi()` (`logout()`) |
| Coverage (wajib ≥ 70%) | `models/SesiLogin.ts` 100% / 100%; `server/services/AutentikasiService.ts` 91,57% / 97,14%; `server/sesi.ts` 100% / 100% (baris / cabang). Bukti pada 4.6 |

### 4.2.14 Kelas FormPendaftaranView

**ID Kelas:** C14 — **Nama Kelas:** FormPendaftaranView — **Tingkat:** Sedang

Belum ada file tes otomatis untuk C14 dan C15. Kedua kelas diuji manual di peramban Chrome pada aplikasi lokal (`localhost:3000`) dengan basis data hasil `npm run db:reset`; tangkapan layarnya sama dengan UC01 (Subbab 4.6).

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C14-UT01 | `tampilkanFormulir()`, `kirimFormulir()`, `tampilkanNotifikasiBerhasil()` | Normal | Tekan *Sign up* di navbar; isi `Nayla Uji`, `nayla.uji@klimpool.id`, `rahasia123`; tekan *Create account* | Modal "Create an account" tampil dengan kolom *Full name*, *Email*, *Password*; setelah dikirim, modal tertutup dan muncul *toast* "Account created. Welcome to KlimPooL, <nama depan>." | Modal tampil dengan ketiga kolom; setelah dikirim modal tertutup, *toast* "Account created. Welcome to KlimPooL, Nayla." muncul, dan navbar menampilkan *Balance* Rp0 dengan avatar NU | Pass |
| C14-UT02 | `tampilkanPesanKesalahan()` | Negatif | Kirim dengan email `ANDI@klimpool.id ` (huruf besar dan spasi); lalu tekan "Log in with this email" | Muncul "andi@klimpool.id is already used by another account. Use a different email, or log in with this one."; tautan memindahkan ke tab *Log in* dengan email sudah terisi | Pesan dan tautan muncul, kolom *Email* juga menampilkan "This email is already registered." (`POST /api/auth/daftar` 409 `EMAIL_TERPAKAI`); tautan membuka tab *Log in* dengan email `andi@klimpool.id` terisi | Pass |

### 4.2.15 Kelas FormLoginView

**ID Kelas:** C15 — **Nama Kelas:** FormLoginView — **Tingkat:** Sedang

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C15-UT01 | `kirimKredensial()`, `arahkanKeHalamanUtama()` | Normal | Dari `/explore`, buka tab *Log in*, isi `nayla.uji@klimpool.id` / `rahasia123` | Modal tertutup, *toast* "Welcome back, Nayla.", navbar menampilkan akun, halaman tetap `/explore` | `POST /api/auth/masuk` 200; modal tertutup, *toast* "Welcome back, Nayla.", navbar menampilkan *Balance* Rp0 dan avatar NU, halaman tetap `/explore` | Pass |
| C15-UT02 | `tampilkanPesanKesalahan()` | Negatif | Isi `andi@klimpool.id` / `salah123` | Muncul "The email or password doesn't match. Check them and try again."; modal tetap terbuka | `POST /api/auth/masuk` 401 `KREDENSIAL_SALAH`; pesan tersebut tampil dan modal tetap terbuka | Pass |

**Temuan dari inspeksi kode:** bila koneksi putus saat mendaftar atau login, `panggilApi()` mengembalikan `GAGAL_KONEKSI` dengan pesan khusus donasi ("The connection dropped. Press Try again; your donation will only be processed once."), sehingga pesan ini juga muncul di formulir auth. Usulan perbaikan: pesan koneksi umum untuk formulir auth.

### 4.2.16 Kelas AutentikasiController

**ID Kelas:** C16 — **Nama Kelas:** AutentikasiController — **Tingkat:** Sedang

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C16-UT01 | `daftarAkun()` | Normal | `POST /api/auth/daftar` dengan JSON daftar sah | Status 201, `ok: true`, email ternormalisasi; badan respons tidak memuat `password`, `Hash`, maupun kata sandi asli (KF03) | Status 201, `data.email` = `budi@mail.com`; ketiga teks terlarang tidak ada di badan respons | Pass |
| C16-UT02 | `daftarAkun()` | Negatif | Daftar dua kali dengan data yang sama | Status 409, `kode: EMAIL_TERPAKAI`, `bidang: email` | Status 409, `EMAIL_TERPAKAI`, `bidang` = `email` | Pass |
| C16-UT03 | `daftarAkun()` | Negatif | Badan kosong, `bukan json`, dan `[]` | Ketiganya 400 `VALIDASI` dengan `bidang: nama`, bukan 500 | Ketiganya 400, `VALIDASI`, `bidang` = `nama` | Pass |
| C16-UT04 | Pembatasan peran (`requireRole()` → `pastikanPeran()`) | Negatif | Pengguna `volunteer` diperiksa terhadap `['volunteer','admin']` lalu `['admin']` | Peran yang diizinkan lolos; peran lain ditolak `DILARANG` (403) | Lolos untuk daftar pertama; daftar kedua melempar `DILARANG` | Pass |
| C16-UT05 | Pemetaan galat (`gagal()`) | Negatif | `GalatAplikasi('BELUM_LOGIN')` dan `new Error('x')`, keduanya dengan header `Cache-Control` | 401 dan 500; header `private, no-store` tetap terkirim; galat tak terduga menjadi `GALAT_SERVER` | 401 dan 500, header terkirim pada keduanya | Pass |
| C16-UT06 | Pemetaan galat (`gagal()`) | Normal | Galat berkolom (`VALIDASI`, `email`) dan galat tanpa kolom (`BELUM_LOGIN`) | Galat berkolom memuat `bidang`; galat tanpa kolom tidak memuat `bidang` | `{ ok: false, kode: "VALIDASI", pesan: "Enter your email.", bidang: "email" }`; `BELUM_LOGIN` tanpa `bidang` | Pass |

### 4.2.17 Kelas FormCampaignView

**ID:** C17 — **Tingkat:** Sedang. Unit: HTML `FormAksi` dan adapter HTTP `apiAksi`.

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C17-UT01 | Tampilkan formulir | Normal | Render campaign | Kolom judul, deskripsi, target, periode, penggunaan dana dan tombol simpan | Semua kolom/tombol ada; tanpa tahap project | Pass |
| C17-UT02 | Pesan kesalahan | Negatif | Adapter menerima HTTP 400 dengan galat target | Galat kolom tetap tersedia | Status 400 dan `rincian.targetDana` sesuai | Pass |
| C17-UT03 | Kirim formulir | Negatif | Fetch gagal lalu respons 500 | Tidak dianggap sukses | Galat `Koneksi gagal` lalu pesan server | Pass |
| C17-UT04 | Kirim formulir | Normal | Respons sukses berisi ID | ID dikembalikan; JSON tanpa cache | ID `aksi-1`; POST, `no-store`, badan JSON sesuai | Pass |

### 4.2.19 Kelas CampaignController

**ID:** C19 — **Tingkat:** Sedang. Fungsi `buatCampaign` dan `kelolaAksi`.

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C19-UT01 | Buat campaign | Normal | Request JSON sah dan sesi pembuat | 201; service menerima jenis campaign | 201, `no-store`; asal request diperiksa | Pass |
| C19-UT02 | Buat campaign | Negatif | Sesi melempar galat login | 401 sebelum service | 401; service tidak dipanggil | Pass |
| C19-UT03 | Pesan validasi | Negatif | Service menolak target | 400 dengan galat kolom | JSON pesan dan `galat.targetDana` sesuai | Pass |
| C19-UT04 | Detail privat | Normal | Request ID dengan sesi | 200; sesi/jenis/ID diteruskan | 200; `lihat(user,campaign,aksi-1)` dipanggil | Pass |

### 4.2.20 Kelas FormProjectView

**ID:** C20 — **Tingkat:** Sedang. Render statis dilengkapi validasi bersama; interaksi Kembali diuji pada UC03-TC03.

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C20-UT01 | Tampilkan informasi | Normal | Render project baru | Tahap informasi mendahului kebutuhan | Tahap 1, tujuan, Simpan dan lanjut tampil; kuota belum tampil | Pass |
| C20-UT02 | Validasi kebutuhan | Negatif | Validasi bersama menerima dana -1 | Ditolak | `GalatValidasi` dilempar | Pass |
| C20-UT03 | Isi ulang draft | Normal | Render draft ber-ID dengan judul revisi | Judul/ID tetap tersedia | Judul revisi dan `aksi-1` ada dalam HTML | Pass |

### 4.2.22 Kelas ProjectController

**ID:** C22 — **Tingkat:** Sedang. Fungsi `buatProject`, `kelolaAksi`, `parameterAksi`.

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C22-UT01 | Simpan informasi | Normal | JSON tahap informasi | 201; jenis project diteruskan | 201; data dan sesi sesuai | Pass |
| C22-UT02 | Isi kebutuhan/revisi | Normal | Ubah kebutuhan untuk `aksi-1` | ID sama diteruskan ke service | 200; `ubah(user,project,aksi-1,data)` | Pass |
| C22-UT03 | Validasi parameter | Negatif | Jenis berisi SQL; ID berbahaya atau >36 karakter | Ditolak | Semua parameter melempar galat | Pass |
| C22-UT04 | JSON dan hak akses | Negatif | JSON rusak lalu service menolak akses | 400 untuk badan; 404 untuk akses | Badan null diteruskan; HTTP 400/404 | Pass |

### 4.2.23 Kelas PengajuanView

**ID:** C23 — **Tingkat:** Sedang. Render `TombolPengajuan`; klik/notifikasi dilengkapi UC02-TC01, UC03-TC01, UC04-TC04.

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C23-UT01 | Tampilkan pengajuan | Normal | Draft lalu ditolak | Tombol sesuai status | `Ajukan Verifikasi` / `Ajukan Ulang` tampil | Pass |
| C23-UT02 | Cegah pengajuan ulang | Negatif | Pending lalu published | Tombol pengajuan tidak ada | HTML kosong pada kedua status | Pass |

### 4.2.24 Kelas DaftarPengajuanView

**ID:** C24 — **Tingkat:** Sedang. Render `DaftarPengajuan`.

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C24-UT01 | Tampilkan/pilih pengajuan | Normal | Satu project pending | Jenis, pembuat, tautan detail sesuai | Project, owner, `/admin/pengajuan/project/aksi-1` tampil | Pass |
| C24-UT02 | Daftar kosong | Batas | Daftar `[]` | Pesan kosong tanpa tautan keputusan | `Tidak ada pengajuan`; tidak ada `Tinjau pengajuan` | Pass |

### 4.2.25 Kelas DetailPengajuanView

**ID:** C25 — **Tingkat:** Sedang. Render `KeputusanPengajuan` dan `DetailAksiPrivat`; keputusan interaktif diuji pada UC04.

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C25-UT01 | Pilihan keputusan | Normal | Pengajuan pending | Kolom alasan, Setujui, Tolak | Ketiganya tampil | Pass |
| C25-UT02 | Tampilkan status | Negatif | Pengajuan terpublikasi | Status saja, tanpa formulir keputusan | Terpublikasi tampil; textarea/tombol Setujui tidak ada | Pass |
| C25-UT03 | Detail aman | Negatif | Deskripsi berisi script, alasan dan rincian dana | Teks di-escape; rincian tetap tampil | `&lt;script&gt;`, alasan, dan Bibit tampil; tag script tidak ada | Pass |

### 4.2.26 Kelas VerifikasiController

**ID:** C26 — **Tingkat:** Mendalam.

Seluruh operasi DPPL diuji: `ajukanVerifikasi()` → `ajukan`, `getDaftarMenunggu()` → `antrean`, `getDetailPengajuan()` → `kelolaAksi/lihat` (C10-UT04/C19-UT04), `setujuiPengajuan/tolakPengajuan()` → `putuskan`. Aturan ada di `AksiService` dan repository; Algo-013. Coverage controller/service/repository bersama: 100% baris/cabang.

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C26-UT01 | `ajukanVerifikasi` | Normal/negatif | Draft, ditolak, pending | Dua pertama diajukan; pending 409 | Repository dipanggil untuk draft/ditolak; pending 409 | Pass |
| C26-UT02 | `ajukanVerifikasi` | Negatif | Draft tanpa jadwal/titik kumpul | 400 sebelum perubahan status | 400; `ajukan()` repository tidak dipanggil | Pass |
| C26-UT03 | `ajukanVerifikasi` | Negatif | Milik orang lain; update gagal bersyarat | 404 lalu 409 | 404/409 sesuai | Pass |
| C26-UT04 | Keputusan | Negatif | Keputusan `publish`; pengajuan bukan pending | 400 lalu 409 | 400/409 sesuai | Pass |
| C26-UT05 | Setujui/tolak | Batas | Periode sudah berakhir | Setujui 400; tolak beralasan tetap boleh | Persetujuan 400; penolakan diproses | Pass |
| C26-UT06 | Keputusan bersamaan | Negatif | Repository mengembalikan false | 409, bukan sukses | 409 | Pass |
| C26-UT07 | Delegasi controller | Normal | Ajukan, antrean, putuskan dengan sesi/ID | 200; parameter diteruskan tepat | Semua 200 dan argumen sesuai | Pass |
| C26-UT08 | Galat controller | Negatif | Non-admin, konflik, asal salah | 403/409/403 | Seluruh status sesuai | Pass |
| C26-UT09 | Galat internal | Negatif | Service melempar rincian rahasia DB | 500 dengan pesan umum | 500 `Terjadi kesalahan pada peladen.` tanpa rincian DB | Pass |
| C26-UT10 | SQL pengajuan | Normal/negatif | Ajukan; affectedRows 1 lalu 0 | Bersihkan keputusan lama; true/false | Alasan/tanggal verifikasi null; true lalu false | Pass |
| C26-UT11 | SQL keputusan | Normal/negatif | Putuskan pending; affectedRows 1 lalu 0 | Kondisi pending; true/false | SQL membatasi pending; parameter benar; true/false | Pass |
### 4.2.18 Kelas DetailCampaignView

**ID Kelas:** C18  
**Nama Kelas:** DetailCampaignView  
**Tingkat:** Sedang

`bukaHalamanCampaign()` diwujudkan oleh route `/campaign/[id]`, yang mengambil data lewat `DetailService.ambil('campaign', id)` di `server/services/detail.service.ts`. `tampilkanDetail()` diwujudkan oleh komponen di `components/detail/` (lihat Tugas 9, B.1 No. 22 dan B.5).

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C18-UT01 | `bukaHalamanCampaign()` (`DetailService.ambil()`) | Gagal | ID campaign yang tidak ada atau belum terpublikasi (sumber data mengembalikan kosong) | Tidak ada detail yang dikembalikan, sehingga route menampilkan 404 | `ambil('campaign', 'x')` dan `ambil('project', 'x')` mengembalikan `null` | Pass |
| C18-UT02 | `tampilkanDetail()` | Normal | Baris campaign `c1` | Campaign tidak memiliki progres, relawan, maupun instruksi relawan | Progres dan relawan kosong; `instruksiRelawan` `null` dan query titik kumpul tidak dijalankan | Pass |
| C18-UT03 | `tampilkanDetail()` (status donasi, Algo-132) | Batas | Waktu 8 Nov 2026 10.00 WIB: mulai 9 Nov; mulai 8 Nov; mulai 1 Okt dan selesai 8 Nov; selesai 7 Nov. Lalu mulai 8 Nov pada 8 Nov 00.30 WIB (DB masih 7 Nov UTC) | Belum mulai: tertutup dan ditandai belum mulai; tepat tanggal mulai, tengah periode, dan hari terakhir: terbuka; setelah selesai: tertutup tetapi bukan belum mulai; sebelum hari mulai di DB: belum dibuka | Berturut-turut `terbukaDonasi` `false` (`belumMulai` `true`), `true`, `true`, `false` (`belumMulai` `false`); pukul 00.30 WIB `false` dan 07.30 WIB `true` | Pass |
| C18-UT04 | `tampilkanDetail()` (`TombolDonasi`, `HeroDetail`) | Gagal | Render campaign yang mulai 9 Nov 2026; lalu campaign yang sudah berakhir; lalu campaign yang terbuka | Campaign belum mulai tidak menawarkan donasi dan menjelaskan kapan dibuka; campaign berakhir tetap bertuliskan "period ended"; campaign terbuka menampilkan "Donate now" | Belum mulai: tanpa "Donate now", tampil "Fundraising has not started yet", "starts on 9 Nov 2026", chip "Opens 9 Nov 2026", tombol `aria-disabled="true"`. Berakhir: "period ended". Terbuka: "Donate now" | Pass |

### 4.2.21 Kelas DetailProjectView

**ID Kelas:** C21  
**Nama Kelas:** DetailProjectView  
**Tingkat:** Sedang

Sama dengan C18 untuk project: `bukaHalamanProject()` diwujudkan oleh route `/project/[id]` dan `tampilkanDetail()` oleh `HeroDetail`, `KerangkaDetail`, `PanelSamping`, `PanelTentang`, `PanelKebutuhan`, `PanelProgres`, dan `PanelDana`.

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C21-UT01 | `tampilkanDetail()` (`DetailService.ambil()`) | Normal | Baris project `p1` beserta riwayat progres | Detail project terbentuk dengan angka, progres, dan dokumen yang benar | Detail terbentuk; dokumen progres menjadi tautan ke endpoint dokumentasi | Pass |
| C21-UT02 | `tampilkanDetail()` (status donasi dan relawan) | Gagal | Periode project lewat 6 hari; kuota penuh; pendaftaran `ditutup`; status pelaksanaan `selesai` | Donasi dan relawan tertutup sesuai kondisinya | Periode lewat: donasi dan relawan tertutup, `sisaHari` -6; kuota penuh dan pendaftaran ditutup: `terbukaRelawan` `false`; project selesai: `terbukaDonasi` `false` | Pass |
| C21-UT03 | `tampilkanDetail()` (Algo-131) | Batas | Project dengan jadwal mulai 9 Nov 2026, dibuka 8 Nov 2026 | Donasi project tidak dibatasi tanggal mulai | `terbukaDonasi` `true`, `belumMulai` `true` | Pass |
| C21-UT04 | `bukaHalamanProject()` (tab awal) | Normal | `?tab=` berisi tab yang dikenal, termasuk parameter berulang; lalu kosong dan tidak dikenal | Tab yang dikenal dibuka; nilai lain kembali ke About | Tab yang dikenal diterima; nilai kosong atau tidak dikenal menjadi About | Pass |
| C21-UT05 | `tampilkanDetail()` (titik kumpul, KF22) | Normal | Relawan yang diterima membuka detail project | Titik kumpul tampil | `instruksiRelawan` berisi `Balai desa 06:30` dan tampil pada `PanelTentang` | Pass |
| C21-UT06 | `tampilkanDetail()` (titik kumpul, KF22) | Gagal | Pengunjung tanpa login; pengguna `pending`, `rejected`, dan pengguna lain | Titik kumpul tidak dikirim maupun ditampilkan; jadwal dan wilayah tetap tampil | Tanpa login query titik kumpul tidak dijalankan; ketiga pengguna mendapat `null`; panel menampilkan "Tabanan, Bali", "9 Nov 2026", dan "shared with accepted volunteers". Query detail tidak memilih kolom `lokasi_kumpul` | Pass |
| C21-UT07 | `tampilkanDetail()` (`PanelProgres`, `bentukDokumen()`) | Normal | Alamat berkas dari penyimpanan, nama berkas polos, dan alamat yang sudah ter-*encode* | Ketiganya menjadi tautan ke `/api/dokumentasi/{idProject}/{nama}` tanpa *encoding* ganda; tautan dibuka di tab baru dengan aman | Tautan terbentuk; atribut `target="_blank"` dan `rel="noopener noreferrer"` ada | Pass |
| C21-UT08 | `tampilkanDetail()` (`bentukDokumen()`) | Gagal | Situs luar, skema berbahaya, berkas project lain, *path traversal* (biasa dan ter-*encode*), segmen berlebih, *path* di luar endpoint, *encoding* rusak, ID project tidak valid, nilai kosong | Tidak satu pun dijadikan tautan | Seluruh masukan tidak menghasilkan tautan; nilai kosong menjadi daftar kosong; dokumen tanpa tautan dirender sebagai teks `<span class="doc">` | Pass |

### 4.2.27 Kelas FormPencarianView

**ID Kelas:** C27  
**Nama Kelas:** FormPencarianView  
**Tingkat:** Sedang

`bukaKatalog()` diwujudkan oleh route `/explore`, `masukkanKriteria()` oleh kolom cari dan filter yang menyimpan filter di URL (`bacaFilterUrl()`, `keQueryUrl()`) lalu memanggil `GET /api/katalog` (`keQueryApi()`), dan `tampilkanHasil()` oleh daftar `KartuHasil` beserta tombol "Show more". Fungsinya berada di `shared/explore.ts` dan `shared/explorePaging.ts`.

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C27-UT01 | `masukkanKriteria()` (`bacaFilterUrl()`) | Normal | `q=" bakau "`, `type=campaign`, `status=volunteer` | Filter terbaca dari URL dan spasi di tepi kata kunci dibuang | `{ q: 'bakau', type: 'campaign', status: 'volunteer' }` | Pass |
| C27-UT02 | `masukkanKriteria()` (`bacaFilterUrl()`) | Gagal | `type=x&status=y&period=z`; parameter berulang `cat=A&cat=B` | Nilai tidak dikenal kembali ke bawaan; parameter berulang memakai nilai pertama | Filter kosong untuk nilai tidak dikenal; `cat` = `A` | Pass |
| C27-UT03 | `masukkanKriteria()` (`keQueryApi()`, `keQueryUrl()`) | Normal | Filter tampilan (kata kunci `air`, tipe project, Clean water, Bali, status *closed*, periode *soon*); lalu filter kosong | Kosakata tampilan diterjemahkan ke parameter API; filter kosong hanya mengirim halaman dan batas; URL kosong dapat dibaca balik | `q=air`, `tipe=project`, `kategori=Clean water`, `lokasi=Bali`, `status=selesai`, `periode=segera`, `batas=50`; filter kosong hanya `halaman` dan `batas`; `keQueryUrl()` mengembalikan teks kosong dan hasil baca baliknya sama | Pass |
| C27-UT04 | `bukaKatalog()` (sinkronisasi URL) | Normal | Dari `/explore`, buka tautan footer "Donate to a campaign" dan "Find volunteer work", pindah antartautan, lalu kembali ke `/explore` | Filter mengikuti URL; kembali tanpa parameter mengosongkan filter; URL hasil `replaceState` milik komponen sendiri tidak mengubah filter | `?type=campaign` dan `?status=volunteer` terbaca; kembali ke `/explore` mengosongkan filter; `replaceState` tidak mengubah filter; parameter tidak valid menjadi filter kosong | Pass |
| C27-UT05 | `tampilkanHasil()` ("Show more") | Gagal | Halaman kedua dijawab HTTP 500, lalu galat tanpa pesan | Kegagalan dilaporkan, tidak dilempar; galat tanpa pesan memakai pesan umum; pesan dan tombol coba lagi tampil di samping hasil yang sudah ada; tombol nonaktif saat mencoba lagi | Kegagalan dilaporkan sebagai hasil gagal; pesan umum dipakai; hasil lama tetap tampil bersama pesan dan tombol; tombol nonaktif selama permintaan berjalan | Pass |
| C27-UT06 | `tampilkanHasil()` ("Show more") | Normal | Coba lagi setelah gagal; filter diganti saat respons halaman lama belum tiba | Halaman yang diminta adalah halaman setelah yang sudah termuat; hasil baru ditambahkan tanpa menghapus halaman pertama; respons untuk filter lama diabaikan | Halaman berikutnya diminta; hasil bertambah tanpa menghapus halaman pertama; respons lama diabaikan | Pass |
| C27-UT07 | `tampilkanHasil()` (`KartuHasil`) | Normal | Dana 61.250.000, 1.000.000.000, dan 9.500; persentase 150 dari 100 dan 1 dari 0; kuota 10 dengan 3 relawan; campaign `luwu` | Format ringkas rupiah, batang capaian dibatasi 0–100, teks relawan hanya untuk project berkuota, dan tautan detail sesuai tipe | `Rp61.3M`, `Rp1B`, `Rp9,500`; 100 dan 0; `3/10 volunteers`; tautan ke `/campaign/luwu` | Pass |

### 4.2.28 Kelas PencarianController

**ID Kelas:** C28  
**Nama Kelas:** PencarianController  
**Tingkat:** Sedang

`getDetailProject()` dan `getDetailCampaign()` diwujudkan oleh `DetailService` (lihat Tugas 9, B.1 No. 22) dan diuji pada C18 dan C21. Atribut `pesanKesalahan` diganti respons JSON `{ pesan }` berstatus 400 (Tugas 9, B.1 No. 21).

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C28-UT01 | `cari()` | Normal | `q=tidakada&tipe=campaign`, sumber data tidak mengembalikan baris | Filter hasil bacaan diteruskan ke `KatalogService`; hasil kosong menjadi `data: []` | Filter `{ kataKunci: 'tidakada', tipe: 'campaign' }` diteruskan; `data` = `[]` | Pass |
| C28-UT02 | `getDaftarDipublikasikan()` | Normal | Dipanggil tanpa argumen | Pencarian tanpa kata kunci maupun filter | Filter yang diteruskan tepat `{ tipe: 'semua', halaman: 1, batas: 20 }` | Pass |
| C28-UT03 | `getPesanKesalahan()` (`GET /api/katalog`) | Gagal | `GET /api/katalog?status=ngawur` | Status 400 dengan pesan yang menyebut parameter salah, tanpa menyentuh basis data | Status 400; `pesan` memuat `status`; test lulus tanpa basis data berjalan | Pass |
| C28-UT04 | `getOpsi()` (tambahan implementasi) | Normal | Sumber data mengembalikan provinsi `['Bali']` | Kategori baku dan provinsi dari data terpublikasi dikembalikan | `provinsi` = `['Bali']`; `kategori` memuat `Clean water` | Pass |

### 4.2.29 Kelas FormPetaWilayahView

**ID Kelas:** C29  
**Nama Kelas:** FormPetaWilayahView  
**Tingkat:** Sedang

`bukaPeta()` diwujudkan oleh peta pada halaman Explore dan `tampilkanPeta(sebaran)` oleh `PetaSebaran` (peta Indonesia SVG dengan pin dan popup). Titik peta diambil dari hasil katalog yang sama dengan daftar kartu (lihat Tugas 9, B.1 No. 24).

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C29-UT01 | `tampilkanPeta()` (`proyeksi()`) | Normal | Bujur 94,5 dan lintang 6,4 (sudut barat laut Indonesia) | Titik berada di pojok kiri atas peta | `[0, 0]` | Pass |
| C29-UT02 | `tampilkanPeta()` (`aturPin()`) | Batas | Dua titik pada koordinat yang sama | Pin digeser agar dapat diklik masing-masing | Jarak kedua pin ≥ 20 piksel | Pass |
| C29-UT03 | `tampilkanPeta()` (`letakPopup()`) | Batas | Pin di bagian atas peta (y 50), di tengah (y 300), dan di tepi kanan (x 2000) | Popup diletakkan di bawah pin bila pin di bagian atas, dan tidak keluar dari peta | Di bawah untuk y 50, di atas untuk y 300, posisi kiri dibatasi 62 | Pass |
| C29-UT04 | `tampilkanPeta()` (`kunciTitik()`, `aturPin()`) | Batas | Project dan campaign dengan ID yang sama | Identitas titik memakai pasangan tipe dan ID, sehingga keduanya tidak saling menimpa | Kunci berbeda; masing-masing memiliki satu posisi pin | Pass |
| C29-UT05 | `tampilkanPeta()` (`PetaSebaran`) | Normal | Render project dan campaign ber-ID sama; pilih marker campaign, lalu marker project | Kedua marker dirender; popup yang terbuka sesuai jenis marker | Kedua marker ada; popup campaign dan popup project terbuka sesuai pilihan | Pass |
| C29-UT06 | `tampilkanPeta()` | Gagal | Kunci terpilih yang tidak cocok dengan titik mana pun; sorotan pada satu jenis | Popup tidak terbuka; sorotan tidak ikut menyala pada jenis lain yang ID-nya sama | Tidak ada popup; hanya marker jenis yang disorot yang menyala | Pass |
| C29-UT07 | `bukaPeta()` (`FormPetaWilayahView`) | Normal | Hasil filter "Closed / completed" dengan 1 aksi berkoordinat; hasil campuran terbuka dan tutup | Peta mengikuti hasil filter, termasuk aksi yang sudah tutup, dan markernya tetap dapat dipilih | 1 marker untuk 1 hasil; semua hasil berkoordinat dipetakan; popup aksi yang sudah tutup tetap terbuka | Pass |
| C29-UT08 | `bukaPeta()` | Gagal | Hasil katalog yang tidak memiliki koordinat | Item tidak dipetakan dan tidak membuat galat | Item tanpa koordinat tidak memiliki marker | Pass |

### 4.2.30 Kelas FormDonasiView

**ID Kelas:** C30  
**Nama Kelas:** FormDonasiView  
**Tingkat:** Sedang

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C30-UT01 | `isiNominal()` → `validasiFormDonasi()` | Normal | Nominal sama dengan saldo | Valid (tidak ada pesan galat) | Nominal sama dengan saldo diterima | Pass |
| C30-UT02 | `validasiFormDonasi()` | Gagal | Nominal 0, nominal di atas batas maksimum, dan nominal melebihi saldo | Masing-masing ditolak dengan pesan yang sesuai | Nominal 0, di atas maksimum, dan melebihi saldo ditolak dengan pesan prototipe | Pass |
| C30-UT03 | `buatIdempotencyKey()` | Normal | Bangkitkan beberapa *key* | Semua unik dan panjangnya diterima server (16–100 karakter) | Key unik dan panjangnya diterima server | Pass |
| C30-UT04 | `buatIdempotencyKey()` | Gagal | Lingkungan tanpa `crypto.randomUUID` (bukan *secure context*) | Tetap menghasilkan *key* unik yang valid | Key tetap terbentuk tanpa `crypto.randomUUID` | Pass |

### 4.2.31 Kelas DetailBuktiTransaksiView

**ID Kelas:** C31  
**Nama Kelas:** DetailBuktiTransaksiView  
**Tingkat:** Sedang

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C31-UT01 | `tampilkanBukti()` (`barisBukti()`) | Normal | Bukti transaksi berhasil | Baris memuat ID transaksi, waktu, status, donatur, tujuan, dan nominal dengan format prototipe | Baris memuat ID transaksi, waktu, status, donatur, tujuan, dan nominal sesuai format prototipe | Pass |
| C31-UT02 | `tampilkanBukti()` (`barisBukti()`) | Gagal | Bukti dengan status gagal | Status tidak ditandai sebagai sukses | Status gagal tidak ditandai sukses | Pass |
| C31-UT03 | Cetak bukti (`judulCetak()`) | Normal | Bukti dengan ID transaksi tertentu | Nama berkas saran memuat ID transaksi | Nama berkas memuat ID transaksi | Pass |

### 4.2.32 Kelas DonasiController

**ID Kelas:** C32  
**Nama Kelas:** DonasiController  
**Tingkat:** Sedang

Controller ini bergantung pada sesi login, sehingga diuji lewat *route handler* yang berjalan (`npm run build && npm run start`) memakai `curl` atau tab Network di Chrome DevTools.

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C32-UT01 | `konfirmasiDonasi()` (`POST /api/donasi`) | Normal | Login sebagai `andi@klimpool.id`; kirim `{ jenisTujuan: "project", idTujuan: "mgv", nominal: 25000, idempotencyKey: <uuid> }` | Status 201; respons berisi `idTransaksi` dan ringkasan saldo | *[isi]* | *Pass/Fail* |
| C32-UT02 | `konfirmasiDonasi()` | Gagal | Kirim permintaan yang sama tanpa *cookie* sesi | Status 401, `kode: "BELUM_LOGIN"`; tidak ada transaksi tercatat | *[isi]* | *Pass/Fail* |
| C32-UT03 | `konfirmasiDonasi()` | Gagal | Login; kirim tanpa `idempotencyKey` | Status 400, `kode: "PERMINTAAN_TIDAK_VALID"` | *[isi]* | *Pass/Fail* |
| C32-UT04 | `bukaFormDonasi()` (`GET /api/donasi/form?jenis=project&id=mgv`) | Normal | Login sebagai `andi@klimpool.id` | Status 200; nama tujuan dan saldo Donatur dikembalikan | *[isi]* | *Pass/Fail* |

### 4.2.33 Kelas FormPendaftaranRelawanView

**ID Kelas:** C33  
**Nama Kelas:** FormPendaftaranRelawanView  
**Tingkat:** Sedang

Operasi `tekanDaftar()` diwujudkan oleh `TombolRelawan` dan `tampilkanFormulir()` oleh modal `FormPendaftaranRelawanView`. Operasi `tampilkanPesanKesalahan()` memakai aturan validasi yang sama dengan server, sehingga teruji pada C09-UT04 s.d. C09-UT06 dan C34-UT05.

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C33-UT01 | `tampilkanFormulir()` | Normal | Render modal untuk project berjadwal 3–4 Jan 2099 | Keenam kolom wajib tampil dan tersedia pilihan "Sat 3 Jan 2099" serta "Sun 4 Jan 2099" | Keenam label kolom dan kedua pilihan hari tampil | Pass |
| C33-UT02 | `tampilkanFormulir()` | Gagal | Render modal untuk project berjadwal 3–4 Jan 2020 (sudah lewat) | Tidak ada pilihan hari; tampil pesan "No days are open to choose" | Pesan tersebut tampil dan tidak ada tombol hari Jan 2020 | Pass |
| C33-UT03 | `tekanDaftar()` (`TombolRelawan`) | Normal | Project terbuka untuk relawan | Tombol "Volunteer for this" tampil | Tombol tampil; tidak ada label "Sign-up closed" | Pass |
| C33-UT04 | `tekanDaftar()` (`TombolRelawan`) | Gagal | Kuota 4 dan sudah 4 relawan diterima | Pesan "Volunteer spots are full" dan tombol nonaktif (`aria-disabled="true"`) | Pesan dan tombol nonaktif tampil; tombol daftar tidak ada | Pass |

### 4.2.34 Kelas RelawanController

**ID Kelas:** C34  
**Nama Kelas:** RelawanController  
**Tingkat:** Mendalam

Operasi DPPL diwujudkan oleh fungsi *route handler* di `server/controllers/RelawanController.ts` (`daftar()`, `lihatPendaftar()`, `putuskan()`, `lihatPendaftaranSaya()`) yang mendelegasikan aturan ke `relawanService.ts`, sedangkan `getPesanKesalahan()` diwujudkan oleh `jalankan()` di `server/http.ts` yang mengubah galat menjadi respons JSON `{ pesan, galat? }`. Pengujian memanggil fungsi tersebut dengan objek `Request` sungguhan dan memeriksa status HTTP serta isi JSON.

Tabel 4.2.34. Hasil Pengujian Unit Kelas C34

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C34-UT01 | `daftarRelawan()` (`POST /api/projects/{id}/relawan`) | Normal | Pengguna login; badan JSON formulir lengkap | Status 201; `pendaftaran.status` = `pending` | Status 201; status `pending` | Pass |
| C34-UT02 | `daftarRelawan()` | Negatif | Tanpa sesi login | Status 401; tidak ada yang disimpan | Status 401; tidak ada baris tersimpan | Pass |
| C34-UT03 | `daftarRelawan()` | Batas | Badan bukan JSON valid (`{bukan json`) | Diperlakukan sebagai formulir kosong: 400 dengan galat pada 6 kolom | Status 400; 6 galat kolom | Pass |
| C34-UT04 | `getPesanKesalahan()` (`jalankan()`) | Normal | Pendaftaran ke project yang kuotanya penuh | Status 409 dengan badan `{ pesan: "Kuota relawan project ini sudah penuh." }` | Status 409 dengan badan tersebut | Pass |
| C34-UT05 | `getPesanKesalahan()` | Batas | Formulir dengan telepon `abc` | Badan menyertakan galat per kolom hanya untuk `telepon` | `galat` hanya berisi kunci `telepon` | Pass |
| C34-UT06 | `getPesanKesalahan()` | Negatif | Basis data melempar galat tak terduga "koneksi MySQL putus di 10.0.0.5" | Status 500 dengan pesan umum; alamat server tidak bocor | Status 500 "Terjadi kesalahan pada peladen."; alamat tidak muncul di respons | Pass |
| C34-UT07 | `getDaftarPendaftar()` (`GET /api/projects/{id}/relawan`) | Normal | Login sebagai pemilik project | Status 200 | Status 200 | Pass |
| C34-UT08 | `getDaftarPendaftar()` | Negatif | Login sebagai pengguna lain | Status 403; nomor telepon pendaftar tidak ikut terkirim | Status 403; respons tidak memuat nomor telepon | Pass |
| C34-UT09 | `getDaftarPendaftar()` | Batas | Tanpa sesi login | Status 401 | Status 401 | Pass |
| C34-UT10 | `buatKeputusan()` (`PATCH …/relawan/{idPendaftaran}`) | Normal | Pemilik mengirim `{ keputusan: "accepted" }` | Status 200; pesan "Pendaftaran diterima."; status baru `accepted` | Status 200 dengan pesan dan status tersebut | Pass |
| C34-UT11 | `buatKeputusan()` | Negatif | Pemilik mengirim badan `{}` | Status 400 | Status 400 | Pass |
| C34-UT12 | `buatKeputusan()` | Batas | *Accept* saat kuota sudah penuh | Status 409; status pendaftaran tetap `pending` | Status 409; status tetap `pending` | Pass |
| C34-UT13 | `getStatusPendaftaran()` (`GET /api/relawan/saya`) | Normal | Pendaftaran berstatus `accepted` | Status 200; titik kumpul "Dermaga Desa Timbulsloko" dan hari pilihan ikut dikirim | Status 200; titik kumpul dan dua hari pilihan terkirim | Pass |
| C34-UT14 | `getStatusPendaftaran()` | Batas | Pendaftaran berstatus `pending`, lalu `rejected` | `lokasiKumpul` = `null` untuk keduanya (KF22) | `lokasiKumpul` null untuk `pending` dan `rejected` | Pass |
| C34-UT15 | `getStatusPendaftaran()` | Negatif | Tanpa sesi login | Status 401 | Status 401 | Pass |

Tabel 4.2.34b. Ringkasan Cakupan Kelas C34

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `getSebaranProject()`, `bukaFormPendaftaran()`, `daftarRelawan()`, `getPesanKesalahan()`, `getDaftarPendaftar()`, `buatKeputusan()`, `getStatusPendaftaran()` |
| Operasi yang diuji | `daftarRelawan()`, `getPesanKesalahan()`, `getDaftarPendaftar()`, `buatKeputusan()`, `getStatusPendaftaran()`, ditambah `bukaFormPendaftaran()` lewat C09-UT11, C09-UT12, dan C33-UT04 (pemeriksaan status pendaftaran dan kuota dilakukan saat kirim; tombol daftar sudah dinonaktifkan di halaman detail). `getSebaranProject()` diwujudkan modul peta (UC05) dan diuji pada bagian UC05 |
| ID Algoritma yang tercakup | Algo-123, Algo-124, Algo-125, Algo-126 |
| Coverage (wajib ≥ 70%) | `server/controllers/RelawanController.ts` 100% / 92,86%; `server/http.ts` 100% / 95,24%; `server/services/relawanService.ts` 99,19% / 94,03% (baris / cabang). Alat: `node --experimental-test-coverage`; bukti pada 4.6 |

### 4.2.35 Kelas FormVolunteerManagementView

**ID Kelas:** C35  
**Nama Kelas:** FormVolunteerManagementView  
**Tingkat:** Sedang

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C35-UT01 | `tampilkanDaftarPendaftar()` | Normal | Dua pendaftar: Bima (`accepted`) dan Rina (`pending`) | Rina (`pending`) tampil di atas Bima; data diri, keahlian, pengalaman, dan jadwal tampil | Rina di atas Bima; telepon, keahlian, pengalaman, dan hari tampil | Pass |
| C35-UT02 | `tampilkanPesanBelumAdaPendaftar()` | Gagal | Daftar pendaftar kosong | Pesan "No applications yet"; tidak ada tombol keputusan | Pesan tampil; tidak ada tombol *Accept* | Pass |
| C35-UT03 | `pilihKeputusan()` | Normal | Kuota 10, satu pendaftar `pending` | Tombol "Accept Rina" dan "Reject Rina" aktif | Kedua tombol tanpa atribut `disabled` | Pass |
| C35-UT04 | `pilihKeputusan()` | Gagal | Kuota 1 dan sudah 1 diterima; satu pendaftar `pending` | "Accept Rina" nonaktif, "Reject Rina" tetap aktif, tampil "All 1 spots are filled" | *Accept* nonaktif, *Reject* aktif, pesan kuota penuh tampil | Pass |

### 4.2.37 Kelas FormProgresProjectView

**ID Kelas:** C37  
**Nama Kelas:** FormProgresProjectView  
**Tingkat:** Sedang

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C37-UT01 | `tampilkanFormulir()` | Normal | Render modal dengan status awal `berjalan` | Kolom unggahan berkas dan keempat pilihan status (Preparing, In progress, On hold, Completed) tampil | Kolom `type="file"` dan keempat status tampil | Pass |
| C37-UT02 | `isiPembaruanMilestone()` (`validasiProgres()`) | Normal | Milestone "Tahap 1", status `selesai`, persentase 100 | Valid; persentase menjadi angka 100 | Valid; persentase 100 | Pass |
| C37-UT03 | `isiPembaruanMilestone()` | Gagal | Persentase 101 | Ditolak hanya pada kolom persentase | Galat hanya pada `persentase` | Pass |
| C37-UT04 | `unggahDokumentasi()` (`periksaBerkasProgres()`) | Gagal | `video.mp4`, `arsip.zip`, `program.exe` | Ketiganya ditolak dengan pesan yang menyebut nama berkas | Ketiganya ditolak dengan nama berkas di pesan (lihat KNF07-TC02) | Pass |

### 4.2.38 Kelas ProgresController

**ID Kelas:** C38  
**Nama Kelas:** ProgresController  
**Tingkat:** Mendalam

Operasi DPPL diwujudkan oleh `perbarui()` dan `lihatRiwayat()` di `server/controllers/ProgresController.ts` yang mendelegasikan aturan ke `server/services/progresService.ts`. Pemeriksaan hak akses `bukaHalamanProgres()` dilakukan server pada setiap pengiriman (KF25); tombol "Post a progress update" hanya tampil untuk pemilik project dan Admin Sistem.

Tabel 4.2.38. Hasil Pengujian Unit Kelas C38

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C38-UT01 | `perbaruiProgres()` (`POST /api/projects/{id}/progres`) | Normal | Pemilik mengirim milestone, status `berjalan`, persentase 40, dan satu berkas PNG | Status 201; progres tersimpan dengan status, persentase, URL dokumentasi, dan stempel waktu saat itu | Status 201; status `berjalan`, persentase 40, URL `/api/dokumentasi/P-1/…`, stempel waktu tidak lebih awal dari waktu kirim | Pass |
| C38-UT02 | `perbaruiProgres()` | Batas | 5 berkas, lalu 6 berkas | 5 berkas diterima (201); 6 berkas ditolak 400 | 201 untuk 5 berkas; 400 "Maksimal 5 berkas dokumentasi per pembaruan." untuk 6 berkas | Pass |
| C38-UT03 | `perbaruiProgres()` (`periksaBerkasProgres()`) | Batas | PDF berukuran tepat 50 MB, lalu 50 MB + 1 byte | 50 MB diterima; 50 MB + 1 byte ditolak | 50 MB lolos; 50 MB + 1 byte ditolak dengan nama berkas di pesan | Pass |
| C38-UT04 | `perbaruiProgres()` | Negatif | Milestone kosong dan status `hampir` | Status 400 dengan galat pada `milestone` dan `statusPelaksanaan`; tidak ada yang disimpan | Status 400 dengan kedua galat; tidak ada progres tersimpan | Pass |
| C38-UT05 | `perbaruiProgres()` | Negatif | Badan dikirim sebagai JSON, bukan `multipart/form-data` | Status 400 dengan pesan format permintaan | Status 400 "Format permintaan tidak valid. Kirim sebagai multipart/form-data." | Pass |
| C38-UT06 | `perbaruiProgres()` | Negatif | Dua berkas tersimpan, lalu penulisan basis data gagal | Status 500; kedua berkas yang sudah tersimpan dihapus kembali | Status 500; dua berkas dihapus | Pass |
| C38-UT07 | `bukaHalamanProgres()` (hak akses) | Normal | Admin Sistem yang bukan pembuat project mengirim progres | Diizinkan (201) | Status 201 | Pass |
| C38-UT08 | `bukaHalamanProgres()` | Negatif | Volunteer (bukan pembuat) mengirim progres dengan berkas | Status 403; tidak ada progres maupun berkas yang tersimpan | Status 403; tidak ada progres atau berkas tersimpan | Pass |
| C38-UT09 | `bukaHalamanProgres()` | Batas | Tamu; akun yang sudah dihapus; project belum terpublikasi; project tidak ada | 401; 401; 409; 404; tidak ada yang disimpan | 401; 401; 409; 404; tidak ada progres tersimpan | Pass |
| C38-UT10 | `getPesanKesalahan()` / riwayat (`GET …/progres`) | Normal | Project terbuka dengan satu pembaruan | Status 200; stempel waktu dikirim dalam format ISO | Status 200; `2026-11-10T03:00:00.000Z` | Pass |
| C38-UT11 | `getPesanKesalahan()` / riwayat | Negatif | Project tertutup untuk pengguna tersebut | Status 403 dengan pesan hak lihat | Status 403 "Progres project ini hanya dapat dilihat pembuat project dan Admin Sistem." | Pass |

Tabel 4.2.38b. Ringkasan Cakupan Kelas C38

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | `bukaHalamanProgres()`, `perbaruiProgres()`, `getPesanKesalahan()` |
| Operasi yang diuji | Seluruhnya (3 dari 3 operasi public), ditambah riwayat progres (`lihatRiwayat()`, tambahan implementasi) |
| ID Algoritma yang tercakup | Algo-127, Algo-128 |
| Coverage (wajib ≥ 70%) | `server/controllers/ProgresController.ts` 98,11% / 95,45%; `server/services/progresService.ts` 98,70% / 93,75%; `shared/progres.ts` 97,91% / 82,61%; `shared/dokumentasi.ts` 93,48% / 79,17% (baris / cabang). Alat: `node --experimental-test-coverage`; bukti pada 4.6 |

### 4.2.39 Kelas FormRiwayatView

**ID Kelas:** C39  
**Nama Kelas:** FormRiwayatView  
**Tingkat:** Sedang

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C39-UT01 | `tampilkanDaftarRiwayat()` (`saringRiwayat()`) | Normal | Riwayat campuran; filter "semua", lalu jenis tertentu | "semua" mengembalikan seluruh riwayat; jenis tertentu hanya mengembalikan jenis itu | "semua" mengembalikan seluruh riwayat; jenis tertentu hanya jenis itu | Pass |
| C39-UT02 | `tampilkanDaftarRiwayat()` (`kelompokkanPerBulan()`) | Normal | Transaksi 27 Okt dan 2 Sep, progres 21 Okt 2026 | Kelompok `Oct 2026` berisi t1 dan g1, lalu `Sep 2026` berisi t2 | Kelompok `2026-10` (t1, g1) lalu `2026-09` (t2); label `Oct 2026` | Pass |
| C39-UT03 | `kelompokkanPerBulan()` | Batas | Transaksi 31 Okt 2026 pukul 20.00 UTC | Masuk kelompok November (zona WIB) | Masuk kelompok `2026-11` | Pass |
| C39-UT04 | `tampilkanPesanRiwayatKosong()` (`kelompokkanPerBulan([])`) | Gagal | Daftar riwayat kosong | Tidak ada kelompok; tampilan menampilkan pesan riwayat kosong | Tidak ada kelompok yang dihasilkan | Pass |

### 4.2.41 Kelas RiwayatController

**ID Kelas:** C41  
**Nama Kelas:** RiwayatController  
**Tingkat:** Sedang

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| C41-UT01 | `getRiwayat()` (`gabungkanRiwayat()`, Algo-129) | Normal | Gabungan transaksi dan progres dengan waktu berbeda | Terurut dari yang terbaru; larik masukan tidak berubah | Terurut dari yang terbaru; urutan waktu kembar stabil; larik masukan tidak berubah | Pass |
| C41-UT02 | `getRiwayat()` (`bacaFilterRiwayat()`) | Normal | Tanpa parameter, `semua`, dan jenis yang dikenal dengan huruf besar | Diterima sebagai filter yang sah | Diterima sebagai filter yang sah | Pass |
| C41-UT03 | `getRiwayat()` (`bacaFilterRiwayat()`) | Gagal | `?jenis=xyz` | Ditolak (respons 400 dengan pesan jenis tidak dikenal) | `bacaFilterRiwayat('xyz')` ditolak | Pass |
| C41-UT04 | `getRiwayat()`, `getDetailTransaksi()` | Gagal | Dipanggil tanpa login | Ditolak sebelum mengakses data | Riwayat dan rincian menolak pengguna yang belum login | Pass |

<br>

## 4.3 Pengujian Integrasi

Pengujian integrasi memeriksa interaksi antarkomponen yang melewati batas, yaitu *Controller* ke *Model*, aplikasi ke basis data, dan aplikasi ke sistem eksternal. Daftar antarmuka mengacu pada dokumen DPPL, dengan minimal satu test case untuk setiap antarmuka. Pengujian memakai komponen nyata, bukan *mock*. Apabila ada antarmuka tambahan yang belum didaftarkan pada dokumen DPPL, cantumkan juga.

Tabel 4.3.1. Daftar Antarmuka Antarkomponen

| ID Antarmuka | Komponen Asal | Komponen Tujuan | Jenis Batas | Test Case |
| :--- | :--- | :--- | :--- | :--- |
| IK-01 | DonasiView (`FormDonasiView`, `AlurDonasi`) | DonasiController (`/api/donasi`, `/api/donasi/form`) | View - Controller (HTTP API) | INT-TC01, INT-TC02 |
| IK-02 | DonasiController | DonasiService | Controller - Model | INT-TC03 |
| IK-03 | DonasiService / DonasiRepository | MySQL (`donatur`, `transaksi_donasi`, `bukti_transaksi`) | Aplikasi - Basis data | INT-TC04 |
| IK-04 | DonasiService | CampaignProjectRepository (dana terkumpul tujuan) | Model - Model lintas modul | INT-TC05 |
| IK-05 | RiwayatController / riwayatService | MySQL (transaksi, progres, pendaftaran relawan) | Controller - Model - Basis data | INT-TC07, INT-TC08, INT-TC09 |
| IK-06 | TopupService (tambahan di luar DPPL) | MySQL (`donatur`, `topup_saldo`) | Aplikasi - Basis data | INT-TC06, INT-TC10 |
| IK-07 | RelawanController / relawanService (pendaftaran) | MySQL (`pendaftaran_relawan`, `project`) | Controller - Model - Basis data | INT-TC11, INT-TC12 |
| IK-08 | RelawanController / relawanService (pengelolaan dan status) | MySQL (`pendaftaran_relawan`, `project`) | Controller - Model - Basis data | INT-TC13 s.d. INT-TC16 |
| IK-09 | ProgresController / progresService | MySQL (`progres_project`, `project`) | Controller - Model - Basis data | INT-TC17 s.d. INT-TC20 |
| IK-10 | RelawanView, ProgresView (`FormPendaftaranRelawanView`, `FormVolunteerManagementView`, `FormProgresProjectView`) | RelawanController, ProgresController (`/api/projects/{id}/relawan`, `/api/projects/{id}/progres`) | View - Controller (HTTP API) | INT-TC21 |
| IK-11 | dokumentasiService | Penyimpanan berkas lokal (`src/uploads/progres/`) dan `/api/dokumentasi/{idProject}/{nama}` | Aplikasi - Sistem berkas | INT-TC22 |
| IK-12 | FormPencarianView (`ExploreView`) | PencarianController (`/api/katalog`, `/api/katalog/opsi`) | View - Controller (HTTP API) | INT-TC23, INT-TC24 |
| IK-13 | PencarianController / KatalogService / KatalogRepository | MySQL (`project`, `campaign`) | Controller - Model - Basis data | INT-TC25, INT-TC26 |
| IK-14 | PetaController / PetaWilayah / PetaRepository (tambahan di luar DPPL, `GET /api/peta`) | MySQL (`project`, `campaign`, `ST_Distance_Sphere`) | Controller - Model - Basis data | INT-TC27, INT-TC28 |
| IK-15 | DetailProjectView, DetailCampaignView (`MuatDetail`) / DetailService / DetailRepository | MySQL (`project`, `campaign`, `progres_project`) | View - Model - Basis data | INT-TC29, INT-TC30 |
| IK-16 | FormAksi, TombolPengajuan, KeputusanPengajuan | API campaign/project/pengajuan/verifikasi | View - Controller (HTTP nyata) | INT-TC31 |
| IK-17 | Controller aksi / sesiAksi | Sesi dan akun MySQL | Controller - autentikasi - basis data | INT-TC32 |
| IK-18 | AksiController / AksiService / AksiRepository | MySQL (`campaign`, `project`) | Controller - service - basis data | INT-TC33, INT-TC34, INT-TC37 |
| IK-19 | VerifikasiController / AksiService / AksiRepository | MySQL (antrean, transisi, penguncian baris) | Controller - service - basis data | INT-TC35, INT-TC36 |
| IK-20 | AuthModal (`FormPendaftaranView`, `FormLoginView`), `SesiProvider`, `AppShell` | AutentikasiController (`/api/auth/daftar`, `/masuk`, `/keluar`, `/saya`) | View - Controller (HTTP API) | INT-TC38 |
| IK-21 | AutentikasiService / UserRepository | MySQL (`pengguna`, `akun`, `donatur`, `sesi_login`) | Controller - Model - Basis data | INT-TC39, INT-TC40 |
| IK-22 | `penggunaDariSesi()` lewat `wajibLogin()`, `guard.ts`, `getIdPenggunaSaatIni()`, `sesiAksi()` | Modul lain (donasi, top-up, riwayat, relawan, progres, aksi/admin, `/account`) | Model - Model lintas modul | INT-TC41 s.d. INT-TC44 |

Tabel 4.3.2. Hasil Pengujian Integrasi

| ID Pengujian | ID Antarmuka | Skenario | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| INT-TC01 | IK-01 | Normal: kirim donasi dari formulir | Login `andi@klimpool.id`, buka donasi project "Sayung Coastal Mangrove Restoration", isi 25.000, tekan "Donate now"; amati tab Network | `POST /api/donasi` berstatus 201 dan modal bukti transaksi tampil | `POST /api/donasi` berstatus 201 Created; modal "Donation successful" tampil dengan ID transaksi 3f0f067c-8908-4e14-9c59-b69357bc4553 | Pass |
| INT-TC02 | IK-01 | Gagal: koneksi putus lalu kirim ulang | Isi formulir, set DevTools Network ke *Offline*, tekan "Donate now"; kembalikan *Online*, tekan "Try again" | Muncul pesan "The connection dropped…"; setelah *Try again* hanya ada **satu** transaksi baru (memakai *idempotency key* yang sama) | Pesan koneksi putus tampil; setelah *Try again*, jumlah transaksi u1 bertambah tepat 1 (6 → 7) dan saldo berkurang satu kali (Rp975.000 → Rp950.000) | Pass |
| INT-TC03 | IK-02 | Gagal: galat layanan diteruskan sebagai JSON | Login, kirim `POST /api/donasi` dengan nominal 999.999.999 (melebihi saldo) | Respons 422 `{ ok: false, kode: "SALDO_KURANG", pesan: "Insufficient balance for this donation." }` | Respons 422 `{ ok: false, kode: "SALDO_KURANG", pesan: "Insufficient balance for this donation." }` | Pass |
| INT-TC04 | IK-03 | Normal: donasi tersimpan di basis data | Lakukan donasi 25.000, lalu jalankan `SELECT * FROM transaksi_donasi WHERE id_transaksi = '<id>'` dan `SELECT saldo FROM donatur WHERE id_donatur = 'u1'` | Baris transaksi ada dengan nominal 25.000 dan status `berhasil`; saldo berkurang 25.000; ada tepat satu baris bukti | Query basis data untuk transaksi 3f0f067c-8908-4e14-9c59-b69357bc4553 mengembalikan nominal 25000.00 dengan status `berhasil` dan `jumlah_bukti` = 1; saldo u1 berkurang Rp25.000 (Rp950.000 → Rp925.000, sesuai `saldoSesudah` pada respons) | Pass |
| INT-TC05 | IK-04 | Normal: donasi bersamaan dari donatur berbeda | Dua donatur bersaldo 50.000 masing-masing mengirim 2 × 25.000 bersamaan ke project yang sama | Keempatnya `OK`; dana terkumpul project bertambah tepat 100.000; saldo keduanya 0 | Keempatnya `OK`; dana project +100.000; saldo kedua donatur 0 | Pass |
| INT-TC06 | IK-06 | Normal: top-up dalam satu transaksi | Top-up nominal valid untuk donatur uji | Saldo bertambah dan satu catatan top-up tersimpan; nominal tidak valid ditolak tanpa mengubah saldo | `topup.integrasi.test.ts` lulus: AC1 (saldo bertambah dan top-up tercatat dalam satu transaksi), AC2 (nominal tidak valid ditolak tanpa mengubah saldo), serta pengguna tanpa baris donatur ditolak tanpa catatan tertinggal | Pass |
| INT-TC07 | IK-05 | Normal: riwayat kronologis | Ambil riwayat pembuat project yang memiliki donasi dan progres | Donasi dan progres miliknya tampil, terbaru lebih dulu; filter jenis hanya mengembalikan jenis tersebut | Donasi dan progres pembuat project tampil, terbaru lebih dulu; filter jenis sesuai | Pass |
| INT-TC08 | IK-05 | Gagal: data milik pengguna lain | Pengguna B membuka rincian transaksi milik pengguna A | Diperlakukan sebagai tidak ditemukan (404), sama seperti ID yang tidak ada | Transaksi milik orang lain diperlakukan sebagai tidak ditemukan | Pass |
| INT-TC09 | IK-05 | Batas: hak lihat progres | Relawan berstatus *pending* dan donatur dengan donasi gagal membuka progres project | Keduanya tidak melihat progres; relawan *accepted* dan donatur berhasil dapat melihatnya | Relawan pending dan donasi gagal tidak melihat progres; relawan accepted dan donatur berhasil dapat melihatnya | Pass |
| INT-TC10 | IK-06 | Batas: top-up bersamaan | Beberapa top-up dikirim bersamaan untuk donatur yang sama | Seluruh nominal terjumlah tanpa kehilangan pembaruan | Kasus "top-up bersamaan terjumlah semua tanpa kehilangan pembaruan" lulus (`pass 4, fail 0, skipped 0`) | Pass |
| INT-TC11 | IK-07 | Normal: pendaftaran tersimpan dan tidak bisa ganda | `relawanProgres.integrasi.test.ts` "KF19/KF20: pendaftaran tersimpan pending dan tidak bisa ganda": relawan uji mendaftar ke project uji, lalu mendaftar lagi | Baris baru berstatus `pending`; pendaftaran kedua ditolak 409; `SELECT COUNT(*)` untuk pasangan relawan-project tetap 1 | Baris baru berstatus `pending`; pendaftaran kedua ditolak 409; jumlah baris pasangan relawan-project tetap 1 | Pass |
| INT-TC12 | IK-07 | Gagal: masukan dan project tidak sah | Tes "menolak pendaftaran tanpa login, formulir kosong, dan project draft" | Tanpa login 401; formulir kosong 400; project draft 404; project tidak ada 404 | Tanpa login 401; formulir kosong 400; project draft 404; project tidak ada 404 | Pass |
| INT-TC13 | IK-08 | Gagal: daftar pendaftar hanya untuk pemilik | Tes "KF20: hanya pemilik yang melihat daftar pendaftar" | Pemilik mendapat minimal satu pendaftar; pengguna lain 403; tamu 401 | Pemilik menerima daftar berisi pendaftar; pengguna lain 403; tamu 401 | Pass |
| INT-TC14 | IK-08 | Normal: keputusan hanya sekali dan hanya oleh pemilik | Tes "KF21: hanya pemilik yang memutuskan, dan sekali saja" | Pengguna lain 403; keputusan tidak sah 400; pemilik menerima menjadi `accepted` dengan `tanggal_keputusan`; keputusan kedua 409 | Pengguna lain 403; keputusan tidak sah 400; pemilik menerima menjadi `accepted` dengan `tanggal_keputusan` terisi; keputusan kedua 409 | Pass |
| INT-TC15 | IK-08 | Batas: titik kumpul hanya untuk yang diterima | Tes "KF22: titik kumpul hanya terlihat setelah diterima" | Relawan `accepted` melihat titik kumpul "Pos Mangrove Tugu"; relawan `pending` mendapat `null`; tamu 401 | Relawan `accepted` melihat "Pos Mangrove Tugu"; relawan `pending` mendapat `null`; tamu 401 | Pass |
| INT-TC16 | IK-08 | Batas: penerimaan bersamaan tidak melewati kuota | Tes "KF21: penerimaan bersamaan tidak melewati kuota": kuota 2, satu sudah diterima, dua pendaftar diterima bersamaan | Tepat satu berhasil dan satu ditolak 409; jumlah `accepted` di basis data tepat 2 | Satu berhasil dan satu ditolak 409; jumlah `accepted` di basis data tepat 2 | Pass |
| INT-TC17 | IK-09 | Normal: progres tersimpan dan project ikut diperbarui | Tes "KF23: pemilik menyimpan pembaruan dan keadaan project ikut berubah" | Baris `progres_project` berisi milestone, status `berjalan`, persentase 35, dana 24.500.000; kolom `milestone`, `status_pelaksanaan`, dan `timestamp_pembaruan` tabel `project` ikut berubah | Baris progres berisi milestone, status `berjalan`, persentase 35, dana 24.500.000; `milestone`, `status_pelaksanaan`, dan `timestamp_pembaruan` project ikut berubah | Pass |
| INT-TC18 | IK-09 | Gagal: hak ubah progres | Tes "KF25: orang lain ditolak, Admin Sistem diizinkan" | Pengguna lain 403; tamu 401; Admin Sistem berhasil | Pengguna lain 403; tamu 401; Admin Sistem berhasil menyimpan | Pass |
| INT-TC19 | IK-09 | Gagal: isian tidak valid dan project belum terpublikasi | Tes "menolak isian tidak valid dan project yang belum terpublikasi" | Isian tidak valid 400; project draft 409; tidak ada baris progres baru | Isian tidak valid 400; project draft 409; tidak ada baris progres baru | Pass |
| INT-TC20 | IK-09 | Normal: urutan riwayat dan hak lihat | Tes "KF14: riwayat terbaru lebih dulu; project draft hanya untuk pemiliknya" | Riwayat terurut dari yang terbaru; riwayat project draft hanya dapat dibaca pemiliknya | Riwayat terurut dari yang terbaru; riwayat project draft hanya terbaca oleh pemiliknya | Pass |
| INT-TC21 | IK-10 | Normal: formulir terhubung ke API | Jalankan aplikasi; login `nadia@klimpool.id`, kirim formulir relawan pada "Clean Water for Upper Citarum Villages"; login `sari@klimpool.id`, kirim progres pada "Sayung Coastal Mangrove Restoration"; amati tab Network | `POST /api/projects/air/relawan` berstatus 201 dengan `Content-Type: application/json`; `POST /api/projects/mgv/progres` berstatus 201 dengan `multipart/form-data`; modal tertutup dan notifikasi berhasil tampil | `POST /api/projects/air/relawan` berstatus 201 Created dengan respons `application/json`, lalu tampil "Application sent". `POST /api/projects/air/progres` berstatus 201 Created dengan *request header* `Content-Type: multipart/form-data; boundary=…`, lalu pembaruan tampil di timeline. | Pass |
| INT-TC22 | IK-11 | Normal: dokumentasi tersimpan dan dapat diambil | Lanjut dari INT-TC21 dengan satu berkas PNG; buka folder `src/uploads/progres/mgv/` dan URL dokumentasi pada timeline | Berkas baru bernama `<uuid>.png` ada di folder; `GET /api/dokumentasi/mgv/<nama>` berstatus 200 dengan `Content-Type: image/png` | Berkas `bc443ab8-43b8-47d4-a7f4-60c852f9665a.png` (1.454 byte) tersimpan di `src/uploads/progres/mgv/`; log server mencatat `GET /api/dokumentasi/mgv/bc443ab8-….png 200` dan gambar tampil di peramban. | Pass |
| INT-TC23 | IK-12 | Normal: filter Explore terhubung ke API | Jalankan aplikasi; buka `/explore` tanpa login; pilih "Action projects", kategori "Clean water", dan provinsi "Jawa Barat"; amati tab Network | `GET /api/katalog?tipe=project&kategori=Clean+water&lokasi=Jawa+Barat…` berstatus 200 dengan badan `{ data, total, halaman, batas }`; kartu dan pin peta hanya menampilkan hasil tersebut, termasuk "Clean Water for Upper Citarum Villages"; URL halaman ikut berisi filter | Setelah memilih Action projects, Clean water, dan Jawa Barat, `GET /api/katalog?tipe=project&kategori=…` berstatus 200 (0,9 kB, 29 ms) dan `GET /api/katalog/opsi` berstatus 200. Halaman menampilkan "1 action found" dengan kartu "Clean Water for Upper Citarum Villages" (lihat UC05-TC03), dan URL berubah menjadi `/explore?type=project&cat=Cl…` | Pass |
| INT-TC24 | IK-12 | Gagal: parameter tidak valid | Kirim `GET /api/katalog?status=ngawur` langsung dari peramban atau PowerShell | Status 400 `{ pesan: "Parameter status harus salah satu dari: donasi, relawan, selesai." }`; tidak ada galat 500 | `GET /api/katalog?status=ngawur` berstatus 400 (6 ms) dengan badan `{"pesan":"Parameter status harus salah satu dari: donasi, relawan, selesai."}` | Pass |
| INT-TC25 | IK-13 | Normal: hanya data terpublikasi yang diambil (KF14) | Kirim `GET /api/katalog?batas=50`; bandingkan dengan `SELECT id_project, status FROM project;` dan `SELECT id_campaign, status FROM campaign;` | `total` sama dengan jumlah baris berstatus `terpublikasi` pada kedua tabel; `rusun` dan `lewotobi` (`menunggu_verifikasi`) serta `tamankali` (`ditolak`) tidak ada di `data` | `GET /api/katalog?batas=50` mengembalikan `total` 11 (8 project dan 3 campaign, termasuk `luwu` yang periodenya sudah berakhir). Query basis data menunjukkan `project`: 8 `terpublikasi` dan 1 `menunggu_verifikasi`; `campaign`: 3 `terpublikasi`, 1 `menunggu_verifikasi`, dan 1 `ditolak`. `rusun`, `lewotobi`, dan `tamankali` tidak ada di `data` | Pass |
| INT-TC26 | IK-13 | Gagal: kata kunci berisi SQL | Kirim `GET /api/katalog?q=x'; DROP TABLE project; --`, lalu jalankan `SELECT COUNT(*) FROM project;` | Status 200 dengan `data: []`; tabel `project` tetap ada dan jumlah barisnya sama dengan sebelum uji | Respons berstatus 200 (36 ms) dengan badan `{"data":[],"total":0,"halaman":1,"batas":20}`. Tabel `project` tetap ada: pengujian berikutnya (INT-TC29, UC05-TC01) masih membaca baris `project` dan Explore tetap menampilkan 11 aksi | Pass |
| INT-TC27 | IK-14 | Normal: sebaran seluruh wilayah | Kirim `GET /api/peta` | Status 200; `data` berisi project dan campaign `terpublikasi` yang memiliki koordinat; campaign `luwu` (berakhir 30 Sep 2026) dan aksi yang belum terpublikasi tidak ada | `GET /api/peta` mengembalikan 10 titik: 8 project (`air`, `biopori`, `gambut`, `leuser`, `mgv`, `sampah`, `subak`, `teduh`) dan 2 campaign (`enggros`, `surya`), semuanya berkoordinat. `luwu`, `rusun`, `lewotobi`, dan `tamankali` tidak ada di `data` | Pass |
| INT-TC28 | IK-14 | Batas: sebaran dalam radius | Kirim `GET /api/peta?jenis=project&pusat=-6.9,110.5&radius=30`; lalu `GET /api/peta?radius=10` tanpa pusat | Permintaan pertama berstatus 200 dan hanya berisi project yang berjarak ≤ 30 km dari titik pusat, yaitu `mgv` (Sayung, Demak) dan `biopori` (Gajahmungkur, Semarang); permintaan kedua berstatus 400 `{ pesan: "Parameter pusat harus berformat \"lat,lng\"." }` | Permintaan pertama mengembalikan 2 titik: `mgv` (3,3 km dari pusat) dan `biopori` (16,6 km), dihitung dengan rumus *haversine* di PowerShell. Permintaan kedua berstatus 400 | Pass |
| INT-TC29 | IK-15 | Normal: detail diambil dari basis data | Tanpa login, buka `/project/mgv` dan `/campaign/surya`; bandingkan dengan `SELECT nama, kebutuhan_dana, dana_terkumpul FROM project WHERE id_project = 'mgv';` dan query setara pada `campaign` | Kedua halaman tampil; nama, target, dan dana terkumpul sama dengan isi basis data | `/project/mgv` menampilkan "Rp61,250,000 raised of a Rp85,000,000 target" (72% funded), sama dengan query `project` (`kebutuhan_dana` 85000000.00, `dana_terkumpul` 61250000.00, status `terpublikasi`). `/campaign/surya` menampilkan "Rp22,800,000 raised of a Rp95,000,000 target" (24% funded), sama dengan query `campaign` (`target_nominal` 95000000.00, `dana_terkumpul` 22800000.00, status `terpublikasi`) | Pass |
| INT-TC30 | IK-15 | Gagal: detail yang belum terpublikasi | Tanpa login, buka `/project/rusun`, `/campaign/lewotobi`, `/campaign/tamankali`, dan `/project/tidakada` | Keempatnya menampilkan halaman tidak ditemukan (404); data aksi tidak tampil | `/project/rusun`, `/campaign/lewotobi`, `/campaign/tamankali`, dan `/project/tidak%20ada` menampilkan halaman 404 "This page could not be found." di bawah navbar; data aksi tidak tampil | Pass |
| INT-TC31 | IK-16 | Formulir terhubung ke API produksi | Melalui browser, simpan dan ajukan campaign/project; admin menolak lalu menyetujui | UI dan API memperlihatkan data/status yang sama | Draft → pending; ditolak dengan alasan; pengajuan ulang → pending → terpublikasi | Pass |
| INT-TC32 | IK-17 | Sesi, peran dan asal request | Kasus pertama `aksi.integrasi.test.ts`: tanpa sesi, cookie dev, relawan/admin, lintas situs, sesi usang, akun nonaktif | Tanpa sesi sah 401; peran/asal salah 403 | Seluruh variasi 401/403 sesuai | Pass |
| INT-TC33 | IK-18 | Kepemilikan dan penyimpanan | Kasus kedua: JSON memalsukan pemilik/status; pembuat lain melihat/mengubah/mengajukan | Pemilik/status ditentukan server; data privat tidak bocor | Pemilik sesi, status draft; akses orang lain 404; daftar orang lain kosong; pemilik dapat revisi | Pass |
| INT-TC34 | IK-18 | Project dua tahap | Kasus ketiga: simpan informasi, ajukan sebelum lengkap, lengkapi, kembali, ajukan | ID tetap; kebutuhan tidak hilang; draft belum lengkap ditolak | 400 sebelum lengkap; ID/kebutuhan sama; status pending dan tanggal pengajuan terisi; edit pending 409 | Pass |
| INT-TC35 | IK-19 | Antrean, penolakan, revisi, publikasi | Kasus keempat: ajukan campaign, tolak tanpa/dengan alasan, revisi, ajukan ulang, setujui | Antrean pending saja; wajib alasan; revisi dapat diajukan lagi | Tanpa alasan 400; alasan tersimpan; pengajuan ulang membersihkan alasan/tanggal lama; published dengan tanggal verifikasi | Pass |
| INT-TC36 | IK-19 | Konkurensi transisi | Kasus kelima: dua pengajuan bersamaan; dua keputusan bersamaan | Tepat satu berhasil per pasangan | Kedua pasangan menghasilkan status `[200,409]` | Pass |
| INT-TC37 | IK-18 | JSON/parameter berbahaya | Kasus keenam: JSON rusak; jenis/ID mengandung SQL | Badan salah 400; parameter salah 404 | 400 dan 404 sesuai, tidak menjadi query dari input | Pass |
| INT-TC38 | IK-20 | Normal: modal auth terhubung ke API | Daftar akun `nayla.uji@klimpool.id` lewat modal (UC01-TC01); periksa respons `/api/auth/*`, cookie (UC01-TC07), dan *Log out* (UC01-TC08) | `POST /api/auth/daftar` 201 dan `POST /api/auth/masuk` 200; cookie `klimpool_sesi` *HttpOnly* dan *SameSite* `Lax`; *Log out* menghapus cookie; navbar berubah sesuai status login | `POST /api/auth/daftar` → 201, `POST /api/auth/masuk` → 200; cookie `klimpool_sesi` `httpOnly=true`, `sameSite=Lax`; setelah *Log out* cookie terhapus dan navbar kembali menampilkan *Log in* dan *Sign up* | Pass |
| INT-TC39 | IK-21 | Normal: satu pendaftaran menulis tiga tabel | Setelah UC01-TC01: `SELECT p.nama, p.peran, a.email, LEFT(a.password_hash,7) AS awalan, LENGTH(a.password_hash) AS panjang, d.saldo FROM akun a JOIN pengguna p USING (id_pengguna) JOIN donatur d ON d.id_donatur = a.id_pengguna WHERE a.email = 'nayla.uji@klimpool.id';` | Satu baris: peran `volunteer`, awalan `$2b$12$` (atau `$2a$12$`), panjang 60, saldo 0.00; kata sandi asli tidak ada di tabel | Satu baris: `Nayla Uji`, `volunteer`, `nayla.uji@klimpool.id`, awalan `$2b$12$`, panjang 60, saldo 0.00 | Pass |
| INT-TC40 | IK-21 | Batas: lima pendaftaran bersamaan dengan email sama | Jalankan skrip `uji-daftar-bersamaan.mjs` (di bawah tabel), lalu `SELECT COUNT(*) FROM akun WHERE email = 'uji.bersamaan@klimpool.id';` | Tepat satu 201 dan empat 409 (urutan bebas); `COUNT(*)` = 1; tidak ada 500 | Status berurutan 409, 409, 201, 409, 409; keempat 409 berisi `EMAIL_TERPAKAI` dengan `bidang: email`; `COUNT(*)` = 1 | Pass |
| INT-TC41 | IK-22 | Normal: sesi dibaca modul lain | Login `andi@klimpool.id`, lalu buka `/api/topup` (modul top-up) dan `/account` (modul riwayat) | `/api/topup` 200 dengan saldo Andi; `/account` menampilkan "Hi, Andi" | `GET /api/topup` → 200 `{"ok":true,"data":{"saldo":750000}}`; `/account` menampilkan "Hi, Andi" dengan saldo Rp750,000 | Pass |
| INT-TC42 | IK-22 | Gagal: sesi kedaluwarsa di basis data | Login Andi dan buka `/account`; salin nilai cookie `klimpool_sesi`; `UPDATE sesi_login SET waktu_kedaluwarsa = '2000-01-01 00:00:00' WHERE id_sesi = '<nilai cookie>';` lalu muat ulang `/account`; terakhir `SELECT status_sesi, waktu_kedaluwarsa FROM sesi_login WHERE id_sesi = '<nilai cookie>';` | Sebelum diubah: `/account` terbuka. Sesudah: `/account` menampilkan "Log in to see your activity"; `status_sesi` menjadi `berakhir` | Sebelum diubah `/account` menampilkan "Hi, Andi"; sesudah `UPDATE` dan muat ulang tampil "Log in to see your activity"; `status_sesi` = `berakhir`, `waktu_kedaluwarsa` = `2000-01-01 00:00:00` | Pass |
| INT-TC43 | IK-22 | Gagal: peran tidak sesuai | Login Andi (`volunteer`); buka `/admin`; di Console jalankan `fetch('/api/verifikasi').then(r => r.status)` | Halaman "Akses aksi" dengan pesan "Anda tidak memiliki akses ke fitur ini."; `fetch` mengembalikan 403 | `/admin` menampilkan "Anda tidak memiliki akses ke fitur ini." dan tombol "Kembali ke beranda"; `fetch('/api/verifikasi')` → 403 | Pass |
| INT-TC44 | IK-22 | Normal: logout mematikan sesi di server | Login Andi; salin nilai cookie; tekan *Log out*; jalankan `curl.exe -i http://localhost:3000/api/topup -H "Cookie: klimpool_sesi=<nilai lama>"`; `SELECT status_sesi FROM sesi_login WHERE id_sesi = '<nilai lama>';` | `curl` mendapat 401 `BELUM_LOGIN` walaupun memakai cookie lama; `status_sesi` = `berakhir` | `HTTP/1.1 401 Unauthorized`, badan `{"ok":false,"kode":"BELUM_LOGIN","pesan":"Please log in first."}`; `status_sesi` = `berakhir` | Pass |

Skrip INT-TC40. Simpan sebagai `uji-daftar-bersamaan.mjs` **di luar repositori**, lalu jalankan `node uji-daftar-bersamaan.mjs` saat aplikasi berjalan:

```js
// INT-TC40: 5 pendaftaran dengan email sama dikirim bersamaan
const URL = 'http://localhost:3000/api/auth/daftar';
const body = JSON.stringify({ nama: 'Uji Bersamaan', email: 'uji.bersamaan@klimpool.id', password: 'rahasia123' });

const hasil = await Promise.all(
  Array.from({ length: 5 }, () =>
    fetch(URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body })
      .then(async (r) => ({ status: r.status, body: await r.text() })),
  ),
);
hasil.forEach((h, i) => console.log(`Request ${i + 1}: ${h.status}  ${h.body}`));
console.log('Jumlah 201:', hasil.filter((h) => h.status === 201).length, '(harus 1)');
```

**Pelaksanaan UC02–UC04:** `npm run test:aksi` menghasilkan **15 Pass, 0 Fail, 0 Skip**, termasuk enam kasus integrasi MySQL (INT-TC32–TC37); sembilan lainnya menguji akses/validasi. INT-TC31 memakai browser sungguhan, bukan mock. Fixtures dibersihkan setelah pengujian; tidak ada layanan eksternal pada alur ini.

<br>

## 4.4 Pengujian Use Case

Pengujian use case dilakukan pada seluruh skenario normal dan alternatif sesuai Subbab 4.4 SKPL, dengan minimal satu test case untuk setiap skenario. Kolom ID KF menunjukkan KF yang diverifikasi oleh test case tersebut. Data uji memakai akun demo dari `002_seed.sql` (kata sandi `klimpool123`). Andi Rahman (`andi@klimpool.id`) memiliki saldo awal Rp750.000. Jalankan `npm run db:reset` sebelum pengujian agar saldo kembali ke nilai awal.

### 4.4.1 Use Case [Nama Use Case 1]

**ID Use Case:** UC01  
**Nama Use Case:** Melakukan Pendaftaran dan Autentikasi

Skenario mengikuti SKPL §4.4.1: Skenario Normal, Alternatif 1 (Email Sudah Terdaftar), dan Alternatif 2 (Kredensial Login Tidak Valid). UC01-TC07 s.d. UC01-TC10 menguji status login yang dipersyaratkan KF04. Data uji memakai akun demo `andi@klimpool.id` dengan kata sandi `klimpool123`; akun baru memakai email yang belum pernah dipakai. Basis data di-*reset* dengan `npm run db:reset` sebelum pengujian. Pengujian dilakukan manual di Chrome pada aplikasi lokal (`localhost:3000`).

Catatan implementasi: setelah pendaftaran berhasil, pengguna langsung login (B.1 No. 14). Langkah 7–9 skenario normal SKPL (login dengan akun yang baru dibuat) diuji terpisah pada UC01-TC04.

Tabel 4.4.1. Hasil Pengujian Use Case UC01
| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC01-TC01 | KF01, KF03 | Normal: pendaftaran akun | 1. Tanpa login, buka Home.<br>2. Tekan *Sign up* di navbar.<br>3. Isi formulir, tekan *Create account*. | Nama: `Nayla Uji`<br>Email: `nayla.uji@klimpool.id`<br>Kata sandi: `rahasia123` | Muncul *toast* "Account created. Welcome to KlimPooL, Nayla."; modal tertutup; navbar menampilkan akun dengan saldo Rp0 | *Toast* "Account created. Welcome to KlimPooL, Nayla." muncul; modal tertutup; navbar menampilkan *Balance* Rp0 dan avatar NU; `POST /api/auth/daftar` 201 | Pass |
| UC01-TC02 | KF01 | Normal (langkah 4): isian tidak lengkap atau format salah | 1. Buka tab *Sign up*.<br>2. Kirim formulir kosong.<br>3. Isi nama, email `budi@mail`, kirim.<br>4. Perbaiki email, isi kata sandi `1234567`, kirim. | Nama: `Budi Uji`<br>Email: `budi@mail`, lalu `budi@mail.com`<br>Kata sandi: `1234567` | Langkah 2: "Enter your full name, at least 3 letters." di bawah *Full name*. Langkah 3: "That email format looks wrong. Example: name@email.com". Langkah 4: "Passwords need at least 8 characters." Tidak ada akun baru | Ketiga pesan tampil di bawah kolom yang sesuai, satu kolom per pengiriman; `POST /api/auth/daftar` menjawab 400 tiga kali; tidak ada akun dibuat | Pass |
| UC01-TC03 | KF02 | Alternatif 1: email sudah terdaftar | 1. Buka tab *Sign up*.<br>2. Isi email akun demo (huruf besar dan spasi di akhir), kirim.<br>3. Tekan "Log in with this email". | Nama: `Andi Kedua`<br>Email: `ANDI@klimpool.id `<br>Kata sandi: `rahasia123` | Muncul "andi@klimpool.id is already used by another account. Use a different email, or log in with this one."; tab *Log in* terbuka dengan email terisi; tidak ada akun ganda | `POST /api/auth/daftar` 409 `EMAIL_TERPAKAI`; pesan tersebut tampil; tautan membuka tab *Log in* dengan email `andi@klimpool.id` terisi | Pass |
| UC01-TC04 | KF01, KF04 | Normal (langkah 7–9): login | 1. Logout, buka `/explore`, tekan *Log in*.<br>2. Isi kredensial, tekan *Log in*. | `nayla.uji@klimpool.id` / `rahasia123` (akun dari UC01-TC01) | *Toast* "Welcome back, Nayla."; modal tertutup; tetap di `/explore`; navbar menampilkan akun | *Toast* "Welcome back, Nayla."; modal tertutup; tetap di `/explore`; navbar menampilkan *Balance* Rp0 dan avatar NU; `POST /api/auth/masuk` 200 | Pass |
| UC01-TC05 | KF04 | Alternatif 2: kata sandi salah | Login dengan kata sandi salah | `andi@klimpool.id` / `salah123` | "The email or password doesn't match. Check them and try again."; tidak masuk | `POST /api/auth/masuk` 401 `KREDENSIAL_SALAH`; pesan tersebut tampil; modal tetap terbuka dan navbar tetap menampilkan *Log in* | Pass |
| UC01-TC06 | KF04 | Alternatif 2: email tidak terdaftar | Login dengan email yang tidak terdaftar | `tidakada@klimpool.id` / `klimpool123` | Pesan **sama persis** dengan UC01-TC05, sehingga tidak membocorkan email mana yang terdaftar | `POST /api/auth/masuk` 401; badan respons sama persis dengan UC01-TC05 (`KREDENSIAL_SALAH`, pesan yang sama) | Pass |
| UC01-TC07 | KF04 | Normal: sesi bertahan | 1. Login.<br>2. Muat ulang halaman, buka `/account`.<br>3. Periksa cookie `klimpool_sesi`. | - | Tetap login; cookie `klimpool_sesi` bertanda *HttpOnly*, *SameSite* `Lax`, dan kedaluwarsa ±24 jam dari waktu login | `/account` menampilkan "Hi, Nayla"; cookie `klimpool_sesi` `httpOnly=true`, `sameSite=Lax`, `path=/`, `expires=2026-11-21T08:07:35Z` (24 jam setelah login) | Pass |
| UC01-TC08 | KF04 | Normal: logout | 1. Buka menu akun, tekan *Log out*.<br>2. Buka `/account`. | - | *Toast* "You're logged out."; diarahkan ke Home; cookie `klimpool_sesi` hilang; `/account` menampilkan "Log in to see your activity" | *Toast* "You're logged out." di Home; cookie `klimpool_sesi` terhapus; `/account` menampilkan "Log in to see your activity" | Pass |
| UC01-TC09 | KF04 | Alternatif: fitur membutuhkan login | 1. Tanpa login, buka `/project/mgv`.<br>2. Tekan *Donate now*.<br>3. Login Andi pada modal. | `andi@klimpool.id` / `klimpool123` | Modal auth terbuka dengan keterangan "Log in to donate. Your donation form opens right after."; setelah login, formulir donasi langsung terbuka | Modal "Log in to KlimPooL" dengan keterangan tersebut tampil; setelah login, formulir *Donate* untuk Sayung Coastal Mangrove Restoration langsung terbuka dengan saldo Rp750,000 | Pass |
| UC01-TC10 | KF04 | Alternatif: peran tidak sesuai | Login Andi (`volunteer`), buka `/admin` | - | Pesan "Anda tidak memiliki akses ke fitur ini."; antrean pengajuan tidak tampil | Pesan "Anda tidak memiliki akses ke fitur ini." dan tombol "Kembali ke beranda" tampil; antrean tidak tampil | Pass |

<br>

---

### 4.4.2 Use Case Membuat Campaign Penggalangan Donasi

**ID:** UC02 — **Aktor:** Pembuat Project.

UC02–UC04 diuji melalui browser otomatis pada build produksi dan MySQL terisolasi. Akun/sesi fixture dibuat sebagai prasyarat login; tes ini **tidak menguji formulir login**. Data dasar: judul unik, deskripsi pemulihan pesisir, Jawa Tengah/Demak, target Rp100.000, mulai hari uji, selesai 30 hari berikutnya.

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC02-TC01 | KF05, KF06 | Normal | My Actions → New submission; isi campaign; Simpan Draft; Ajukan Verifikasi | Data dasar | Campaign tersimpan dengan ID/pemilik/status sah | ID UUID, pemilik sesi, target/periode sesuai; Draft → Menunggu Verifikasi | Pass |
| UC02-TC02 | KF07 | Alternatif 2: target tidak sah | Isi target 0; Simpan Draft | Target 0 | Ditolak dan kolom target ditandai | `aria-invalid=true` pada target; tetap di form | Pass |
| UC02-TC03 | KF07 | Alternatif 2: periode tidak sah | Isi tanggal selesai sebelum mulai/lampau; simpan | Selesai 1 Jan 2026 | Ditolak dan kolom periode ditandai | Kolom selesai ditandai salah; tidak berpindah halaman | Pass |
| UC02-TC04 | KF06 | Keamanan tambahan: bukan pemilik | Pembuat lain membuka detail privat/API | ID campaign pemilik | Tidak membuka data privat | UI tidak ditemukan; API 404 | Pass |
| UC02-TC05 | KF05, KF06 | Keamanan tambahan: tanpa hak | Tamu membuka `/start`; volunteer memanggil API buat | Tanpa sesi; peran volunteer | Login diwajibkan; peran salah ditolak | UI meminta login; API 403 | Pass |
| UC02-TC06 | KF05, KF07 | Alternatif 1: tidak lengkap | Kirim form kosong, lalu lengkapi | Judul dan isian lain kosong | Galat kolom; tidak ada campaign baru | Judul ditandai salah; query jumlah campaign pemilik = 0 | Pass |

### 4.4.3 Use Case Membuat Project Aksi Iklim

**ID:** UC03 — **Aktor:** Pembuat Project. Tambahan data: tujuan memulihkan pesisir, logistik bibit/sarung tangan, kriteria siap bekerja di lapangan, kuota 5, titik kumpul Balai desa.

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC03-TC01 | KF08, KF09 | Normal | My Actions → New submission → Project; isi informasi; lanjut kebutuhan; simpan; ajukan | Data dasar dan kebutuhan di atas | Project lengkap dengan pemilik/ID tetap; pending | API membaca kembali dana, logistik, kriteria, kuota, jadwal, titik kumpul dan pemilik sesuai; pending | Pass |
| UC03-TC02 | KF10 | Alternatif 2: kebutuhan salah | Pada tahap kebutuhan isi dana -1; simpan; perbaiki; kosongkan logistik; simpan | Dana -1; logistik kosong | Kedua variasi ditolak pada kolomnya | Target lalu kebutuhan ditandai `aria-invalid=true` | Pass |
| UC03-TC03 | KF08, KF09 | Navigasi tambahan: kembali | Isi kebutuhan; Kembali ke informasi; lanjut; simpan | Draft yang sama | Isian/ID tidak hilang, tidak membuat duplikat | Judul/logistik tetap; ID tahap awal = ID detail | Pass |
| UC03-TC04 | KF09 | Keamanan tambahan: pemilik lain | Pembuat lain PATCH project; cek jumlah project pemilik | ID project yang sama | 404; tidak ada duplikat | PATCH 404; jumlah project pemilik tetap 1 | Pass |
| UC03-TC05 | KF08, KF10 | Alternatif 1: informasi tidak lengkap | Pada tahap informasi tekan Simpan dan lanjut tanpa isian | Form kosong | Tidak lanjut/tersimpan; galat kolom | Judul ditandai salah; query jumlah project pemilik = 0 | Pass |

### 4.4.4 Use Case Meninjau dan Memverifikasi Project

**ID:** UC04 — **Aktor:** Admin Sistem dan Pembuat Project.

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC04-TC01 | KF11, KF12 | Normal: setujui | Admin membuka antrean; memilih campaign pending; Setujui | Campaign yang diajukan ulang | Antrean memuat pengajuan; status terpublikasi | Campaign ada di antrean; status keputusan Terpublikasi | Pass |
| UC04-TC02 | KF11 | Alternatif 1: tolak | Admin membuka detail; isi alasan; Tolak | `Perjelas rincian anggaran` | Ditolak dan alasan tersimpan | UI/API Ditolak; alasan sama dengan masukan | Pass |
| UC04-TC03 | KF11 | Validasi tambahan: alasan kosong | Tolak tanpa alasan | Alasan kosong | Galat; status tetap pending | `Alasan penolakan wajib` tampil; API masih pending | Pass |
| UC04-TC04 | KF06, KF11 | Pengajuan ulang | Pemilik membuka My Actions; melihat alasan; Ajukan Ulang | Campaign ditolak | Kembali pending; alasan lama dibersihkan | Alasan tampil; status Menunggu Verifikasi; alasan API null | Pass |
| UC04-TC05 | KF12 | Keamanan: non-admin | Volunteer membuka `/admin` dan endpoint antrean/keputusan | Peran volunteer | UI/API menolak | UI tidak memiliki akses; kedua endpoint 403 | Pass |

**Perbedaan rancangan:** simpan formulir menghasilkan Draft; pengajuan merupakan tombol terpisah. Validasi lengkap diwajibkan sebelum pengajuan. Project boleh memiliki draft informasi tanpa jadwal/kebutuhan, tetapi draft tersebut belum dapat diajukan (INT-TC34). Label diterima pada SKPL diwujudkan sebagai `terpublikasi`. Seluruh skenario normal dan alternatif UC02–UC04 di atas diuji; hasil bukan klaim atas semua fitur aplikasi.

### 4.4.5 Use Case Mencari dan Menelusuri Project

**ID Use Case:** UC05  
**Nama Use Case:** Mencari dan Menelusuri Project

UC05 dapat diakses tanpa login (Tugas 9, B.5 C28). Data uji memakai `002_seed.sql`, yang memuat aksi berstatus `terpublikasi` dan tiga aksi yang belum terpublikasi: `rusun` dan `lewotobi` (`menunggu_verifikasi`) serta `tamankali` (`ditolak`).

Tabel 4.4.5. Hasil Pengujian Use Case UC05

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC05-TC01 | KF14 | Normal: daftar terpublikasi | 1. Tanpa login, buka menu Explore.<br>2. Amati daftar kartu dan jumlah hasil. | - | Daftar campaign dan project yang telah dipublikasikan tampil beserta jumlahnya ("… actions found"). "Marunda Rooftop Food Gardens", "Water and Masks for Lewotobi Evacuees", dan "Semarang Riverside Pocket Park" tidak tampil. | Tanpa login, Explore menampilkan "11 actions found" dengan 11 pin (8 project, 3 campaign), sama dengan jumlah aksi `terpublikasi` pada INT-TC25. Ketiga aksi yang belum terpublikasi tidak tampil. | Pass |
| UC05-TC02 | KF13 | Normal: kata kunci | 1. Buka Explore.<br>2. Ketik kata kunci pada kolom cari.<br>3. Tekan "Search". | Kata kunci: mangrove | Hasil memuat "Sayung Coastal Mangrove Restoration"; URL berubah menjadi `/explore?q=mangrove`. | URL berubah menjadi `/explore?q=mangrove` dan tampil satu kartu "Sayung Coastal Mangrove Restoration" (Action project, In progress, Sayung, Demak, Jawa Tengah, Rp61.3M of Rp85M · 72% · 1/40 volunteers). | Pass |
| UC05-TC03 | KF13 | Normal: kombinasi filter | 1. Buka Explore.<br>2. Pilih tipe, kategori, dan provinsi. | Tipe: Action projects<br>Kategori: Clean water<br>Provinsi: Jawa Barat | Hanya project kategori Clean water di Jawa Barat yang tampil, termasuk "Clean Water for Upper Citarum Villages"; pin peta mengikuti hasil; tombol "Clear all filters" tampil. | Tampil "1 action found" dengan kartu "Clean Water for Upper Citarum Villages" (Kertasari, Bandung Regency, Jawa Barat; Rp47.5M of Rp120M · 40%). Peta hanya menampilkan 1 pin di Jawa Barat, dan tombol "Clear all filters" tampil. | Pass |
| UC05-TC04 | KF13 | Normal: filter status dan periode | 1. Buka Explore.<br>2. Pilih status "Closed / completed".<br>3. Ganti ke status "Open for donations" dan periode "Happening now". | - | "Closed / completed" menampilkan aksi yang sudah ditutup atau berakhir, termasuk "Luwu Flash Flood Response" dan "Leuser Forest Replanting". "Open for donations" + "Happening now" hanya menampilkan aksi yang sedang berjalan dan masih menerima donasi. | "Closed / completed" menampilkan "2 actions found": "Luwu Flash Flood Response" (Donations closed) dan "Leuser Forest Replanting" (Completed), dengan 2 pin. "Open for donations" + "Happening now" menampilkan "9 actions found" (7 project dan 2 campaign, 9 pin), tanpa Luwu dan Leuser. | Pass |
| UC05-TC05 | KF14 | Normal: detail project | 1. Lanjut dari UC05-TC02.<br>2. Pilih kartu "Sayung Coastal Mangrove Restoration". | - | Halaman `/project/mgv` menampilkan deskripsi, kebutuhan, target donasi, lokasi (Sayung, Demak, Jawa Tengah), dan status project. | Halaman detail menampilkan tab About, Needs, Progress (3), dan Use of funds. Tab About berisi deskripsi, tujuan, jadwal kegiatan 1 Oct 2026 – 15 Dec 2026, area "Sayung, Demak, Jawa Tengah", dan periode (25 days left). Panel samping menampilkan "Rp61,250,000 raised of a Rp85,000,000 target", 72% funded, 1 donation, status relawan 1 of 40 people, serta tombol "Donate now" dan "Volunteer for this" yang aktif. Titik kumpul tidak ditampilkan kepada pengunjung tanpa login. | Pass |
| UC05-TC06 | KF14 | Normal: detail campaign | 1. Buka Explore, pilih "Fundraising campaigns".<br>2. Pilih kartu "Solar Power for Kambera Health Center". | - | Halaman `/campaign/surya` menampilkan deskripsi, kebutuhan, target donasi, lokasi (Kambera, East Sumba, Nusa Tenggara Timur), periode, dan status campaign. | Halaman detail menampilkan tab About, Needs, Progress (0), dan Use of funds. Tab About berisi deskripsi, tujuan, dan periode penggalangan 5 Oct 2026 – 31 Dec 2026 (41 days left). Panel samping menampilkan "Rp22,800,000 raised of a Rp95,000,000 target", 24% funded, 0 donations, dan tombol "Donate now" yang aktif; campaign tidak memiliki bagian relawan. | Pass |
| UC05-TC07 | KF13 | Alternatif 1: Project tidak ditemukan | 1. Buka Explore.<br>2. Cari kata kunci yang tidak ada.<br>3. Tekan "Clear all filters". | Kata kunci: xyzabc | Muncul "No matching actions yet" dengan pesan "Nothing matches xyzabc. Try another keyword, or remove some filters."; setelah "Clear all filters", seluruh daftar terpublikasi tampil kembali. | Tampil "0 actions found", peta tanpa pin, dan pesan "No matching actions yet" dengan keterangan "Nothing matches **xyzabc**. Try another keyword, or remove some filters." Setelah "Clear all filters", kolom cari kosong dan halaman kembali menampilkan "11 actions found" beserta 11 pin. | Pass |
| UC05-TC08 | KF13, KF14 | Normal: menelusuri lewat peta | 1. Buka Explore.<br>2. Pilih salah satu pin pada peta.<br>3. Tekan tautan pada popup. | Pin: Sayung Coastal Mangrove Restoration | Popup ringkasan aksi tampil; tautan membuka halaman detail aksi tersebut. | Pin Sayung tertandai dan popup tampil berisi foto, label "Action project", nama "Sayung Coastal Mangrove Restoration", lokasi "Sayung, Demak · Jawa Tengah", "Rp61.3M of Rp85M", dan tombol "View details" menuju halaman detail project tersebut (`/project/mgv`, lihat UC05-TC05). | Pass |
| UC05-TC09 | KF14 | Alternatif: akses langsung aksi belum terpublikasi | 1. Tanpa login, buka alamat detail aksi yang belum terpublikasi secara langsung. | `/project/rusun`, `/campaign/lewotobi` | Halaman tidak ditemukan (404) tampil; rincian aksi tidak ditampilkan. | `/project/rusun` menampilkan halaman 404 dengan teks "This page could not be found." di bawah navbar; rincian aksi tidak ditampilkan. `/campaign/lewotobi` juga menampilkan halaman 404 yang sama. | Pass |

### 4.4.6 Use Case Melakukan Transaksi Donasi

**ID Use Case:** UC06  
**Nama Use Case:** Melakukan Transaksi Donasi

Tabel 4.4.6. Hasil Pengujian Use Case UC06

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC06-TC01 | KF15, KF17, KF26 | Normal | 1. Login.<br>2. Buka Explore dan pilih project melalui peta.<br>3. Tekan tombol donasi.<br>4. Isi nominal.<br>5. Konfirmasi pembayaran. | User: andi@klimpool.id<br>Pass: klimpool123<br>Tujuan: Sayung Coastal Mangrove Restoration<br>Nominal: 25.000 | Formulir menampilkan saldo Donatur. Setelah konfirmasi, bukti transaksi tampil (ID transaksi, waktu, status berhasil, nominal Rp25.000). Saldo berkurang Rp25.000, dan dana terkumpul serta persentase capaian project bertambah. | Formulir menampilkan saldo Rp950.000. Setelah konfirmasi tampil "Donation successful" dengan ID transaksi 3f0f067c-8908-4e14-9c59-b69357bc4553, waktu 19 Nov 2026 12.41 WIB, status Successful, nominal Rp25.000, sisa saldo Rp925.000, dan capaian project 72% (Rp61.275.000) | Pass |
| UC06-TC02 | KF15 | Normal: belum login | 1. Tanpa login, buka detail project.<br>2. Tekan tombol donasi. | - | Pengguna diminta login lebih dulu; formulir donasi baru terbuka setelah login. | Tanpa login, tombol "Donate now" membuka modal "Log in to KlimPooL" dengan keterangan "Log in to donate. Your donation form opens right after."; formulir donasi tidak terbuka | Pass |
| UC06-TC03 | KF15, KF16 | Alternatif 1: Saldo tidak mencukupi | 1. Login.<br>2. Buka formulir donasi.<br>3. Isi nominal melebihi saldo.<br>4. Konfirmasi. | User: andi@klimpool.id<br>Nominal: 800.000 (saldo 750.000) | Donasi tidak diproses; muncul pesan saldo tidak mencukupi; saldo tetap. | Dengan saldo Rp925.000 dan nominal Rp1.000.000 muncul pesan "Insufficient balance. Your balance is Rp925,000, which is Rp75,000 short.", saldo setelah donasi tertulis "Not enough", dan muncul ajakan "Top up now"; saldo tidak berubah | Pass |
| UC06-TC04 | KF16 | Alternatif 1: Kegagalan transaksi (gangguan sistem) | 1. Login dan buka formulir donasi.<br>2. Jalankan `docker stop klimpool-db`.<br>3. Isi nominal dan konfirmasi.<br>4. Jalankan `docker start klimpool-db`, lalu cek saldo dan riwayat. | Nominal: 25.000 | Muncul pesan kegagalan transaksi; setelah DB menyala, saldo dan jumlah transaksi sama seperti sebelum percobaan. | Sebelum uji: saldo u1 Rp890.000, 10 transaksi. Saat basis data dimatikan dan donasi Rp25.000 dikonfirmasi, muncul "Donation not processed. Something went wrong on the server. Please try again later." Setelah basis data dinyalakan ulang: saldo tetap Rp890.000 dan jumlah transaksi tetap 10 | Pass |
| UC06-TC05 | KF18 | Alternatif 2: Duplikasi permintaan | 1. Lakukan donasi sampai berhasil.<br>2. Di DevTools tab Network, klik kanan permintaan `POST /api/donasi`, lalu pilih *Resend*. | Nominal: 10.000 | Permintaan ulang ditolak dengan pesan "This donation request was already processed. Duplicate donation rejected."; saldo hanya berkurang satu kali. | Donasi Rp10.000 berhasil (ID 3e1d6540-cefe-461d-bd25-1d5e8ad4f405). Permintaan yang sama dikirim ulang lewat DevTools (*Resend*) dan ditolak dengan status 409 Conflict, `kode: "DUPLIKAT"`, pesan "This donation request was already processed. Duplicate donation rejected." Riwayat hanya mencatat satu donasi Rp10.000, dan saldo berkurang sekali (Rp925.000 → Rp915.000) | Pass |
| UC06-TC06 | KF15 | Alternatif 3: Campaign sudah berakhir | 1. Login.<br>2. Buka campaign yang periodenya sudah lewat.<br>3. Coba berdonasi (tombol donasi atau akses langsung `/donasi/campaign/luwu`). | Campaign: Luwu Flash Flood Response (periode berakhir 30 Sep 2026) | Tombol donasi tidak tersedia ("Donations closed"); permintaan donasi langsung ditolak dengan pesan bahwa campaign/project telah berakhir atau ditutup. | Halaman campaign menampilkan "Fundraising has closed. The period ended on 30 Sep 2026…" dan label "Donations closed" tanpa tombol donasi. Permintaan langsung ke `POST /api/donasi` ditolak dengan status 409, `kode: "TUJUAN_DITUTUP"`, pesan "This campaign or project has ended or closed, so the donation cannot be processed." | Pass |
| UC06-TC07 | KF15 | Alternatif 4: Nominal 0 | 1. Login dan buka formulir donasi.<br>2. Kosongkan nominal atau isi 0.<br>3. Konfirmasi. | Nominal: 0 | Donasi ditolak; muncul pesan "The donation amount must be more than Rp0…". | Muncul pesan "The donation amount must be more than Rp0. Pick one of the amounts or type a number."; donasi tidak diproses dan saldo tetap Rp915.000 | Pass |
| UC06-TC08 | KF15 | Alternatif 4: Nominal negatif | Kolom nominal hanya menerima digit, sehingga uji dilakukan dengan mengirim `POST /api/donasi` langsung. | Nominal: -10.000 | Respons 422 `NOMINAL_TIDAK_VALID`; saldo tetap. | Respons 422 `{ ok: false, kode: "NOMINAL_TIDAK_VALID", pesan: "The donation amount must be more than Rp0 and no more than Rp1,000,000,000." }`; saldo tetap | Pass |

### 4.4.7 Use Case Mendaftar Sebagai Volunteer

**ID Use Case:** UC07  
**Nama Use Case:** Mendaftar Sebagai Volunteer

Tabel 4.4.7. Hasil Pengujian Use Case UC07

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC07-TC01 | KF19, KF20 | Normal | 1. Login.<br>2. Buka Explore dan pilih project melalui peta.<br>3. Tekan "Volunteer for this".<br>4. Isi data diri, pilih keahlian, isi pengalaman, pilih hari.<br>5. Tekan "Send application".<br>6. Buka Account, tab "Volunteer applications". | User: andi@klimpool.id<br>Pass: klimpool123<br>Project: Clean Water for Upper Citarum Villages<br>Nama: Andi Rahman, Telepon: 0812-3344-5566, Kota: Semarang, Keahlian: Pipe installation, Pengalaman: Pernah memasang pipa air desa, Hari: hari pertama yang tersedia | Formulir tampil dengan pilihan hari sesuai jadwal project. Setelah kirim, modal tertutup dan tampil "Application sent". Tab "Volunteer applications" menampilkan project tersebut berstatus "Waiting for a decision". | Formulir tampil dengan 14 pilihan hari mulai Wed 18 Nov 2026 dan catatan "Only the first 14 days from today are shown". Setelah kirim, modal tertutup dan tampil "Application sent". Tab "Volunteer applications" menampilkan "Clean Water for Upper Citarum Villages" berstatus "Waiting for a decision" (applied 18 Nov 2026). | Pass |
| UC07-TC02 | KF19 | Alternatif 1: Formulir tidak lengkap | 1. Login dan buka formulir relawan.<br>2. Kosongkan pengalaman dan jangan pilih hari.<br>3. Tekan "Send application". | User: andi@klimpool.id<br>Project: Jatiluwih Subak Water Conservation | Pengiriman ditolak; pesan "Pengalaman wajib diisi." dan "Pilih minimal satu jadwal yang tersedia." tampil di bawah kolomnya; fokus pindah ke kolom pertama yang salah; tidak ada pendaftaran baru. | Pengiriman ditolak; pesan "Pengalaman wajib diisi." dan "Pilih minimal satu jadwal yang tersedia." tampil di bawah kolomnya, dan kolom pengalaman ditandai merah serta mendapat fokus. | Pass |
| UC07-TC03 | KF19 | Alternatif 2: Pendaftaran ganda | 1. Login.<br>2. Buka project yang sudah pernah didaftari.<br>3. Isi formulir lengkap dan kirim. | User: andi@klimpool.id<br>Project: Sayung Coastal Mangrove Restoration (sudah terdaftar, `V-1021`) | Pendaftaran ditolak dengan pesan "Anda sudah mendaftar pada project ini."; status pendaftaran lama (`accepted`) tetap berlaku. | Muncul "Application not sent" dengan pesan "Anda sudah mendaftar pada project ini."; di tab "Volunteer applications" pendaftaran Sayung tetap "Accepted" (decided 11 Oct 2026). | Pass |
| UC07-TC04 | KF19 | Alternatif 3: Pendaftaran ditutup | 1. Login.<br>2. Buka detail project yang pendaftarannya ditutup dan periodenya berakhir. | User: andi@klimpool.id<br>Project: Leuser Forest Replanting (`ditutup`, berakhir 31 Agu 2026) | Tombol daftar tidak tersedia; tampil "Volunteer sign-up is closed" dan tombol "Sign-up closed" nonaktif. Kondisi kuota penuh diuji otomatis pada C09-UT11, C33-UT04, dan INT-TC16. | Tidak ada tombol daftar; tampil "Volunteer sign-up is closed" dan teks "Sign-up closed" nonaktif, serta keterangan bahwa aksi telah selesai (periode berakhir 31 Aug 2026). | Pass |

### 4.4.8 Use Case Mengelola Pendaftaran Relawan

**ID Use Case:** UC08  
**Nama Use Case:** Mengelola Pendaftaran Relawan

Tabel 4.4.8. Hasil Pengujian Use Case UC08

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC08-TC01 | KF21, KF22 | Normal: terima | 1. Login sebagai Pembuat Project.<br>2. Buka detail project miliknya, tekan "Manage volunteers".<br>3. Tinjau data pendaftar, tekan "Accept" pada Nadia Putri.<br>4. Logout, login sebagai Nadia, buka Account tab "Volunteer applications". | User: sari@klimpool.id<br>Pass: klimpool123<br>Project: Sayung Coastal Mangrove Restoration<br>Pendaftar: Nadia Putri (`V-1030`)<br>Lalu user: nadia@klimpool.id | Daftar pendaftar menampilkan data diri, keahlian, pengalaman, dan hari; pendaftar `pending` di atas. Setelah *Accept*, status menjadi "Accepted" dan toast "Volunteer accepted." tampil. Di akun Nadia tampil "Accepted" dengan titik kumpul "Bedono Village Hall, Sayung. Meet at 06:30 WIB.", periode kegiatan, dan hari pilihannya. | Daftar pendaftar menampilkan data diri, keahlian, pengalaman, dan hari; Nadia dan Fajar (Pending) di atas. Setelah *Accept*, Nadia menjadi "Accepted" dan kuota menjadi "2 of 40 spots filled". Di akun Nadia tampil "Accepted" (decided 18 Nov 2026) dengan "Meeting point: Bedono Village Hall, Sayung. Meet at 06:30 WIB.", "Activity period: 1 Oct 2026 – 15 Dec 2026", dan hari pilihannya. | Pass |
| UC08-TC02 | KF21, KF22 | Normal: tolak | 1. Login sebagai Pembuat Project dan buka "Manage volunteers".<br>2. Tekan "Reject" pada Fajar Nugroho, lalu "Yes, reject".<br>3. Login sebagai Fajar, buka tab "Volunteer applications". | User: sari@klimpool.id<br>Pendaftar: Fajar Nugroho (`V-1033`)<br>Lalu user: fajar@klimpool.id | Penolakan meminta konfirmasi lebih dulu. Status menjadi "Rejected". Di akun Fajar tampil "Not selected" tanpa titik kumpul. | Tombol *Reject* memunculkan konfirmasi "Reject Fajar Nugroho? This cannot be undone." Setelah "Yes, reject", status menjadi "Rejected". Di akun Fajar tampil "Not selected" (decided 18 Nov 2026) tanpa titik kumpul, dengan saran untuk tetap mendukung lewat donasi. | Pass |
| UC08-TC03 | KF21 | Alternatif 1: Belum ada pendaftar | 1. Login sebagai Pembuat Project.<br>2. Buka project miliknya yang belum memiliki pendaftar, tekan "Manage volunteers". | User: sari@klimpool.id<br>Project: Lempongsari Biopore Drive | Tampil pesan "No applications yet". | Modal "Manage volunteers" untuk Lempongsari Biopore Drive (0 of 10 spots filled) menampilkan "No applications yet" tanpa tombol keputusan. | Pass |

### 4.4.9 Use Case Memperbarui Progres Project

**ID Use Case:** UC09  
**Nama Use Case:** Memperbarui Progres Project

Tabel 4.4.9. Hasil Pengujian Use Case UC09

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC09-TC01 | KF23, KF24 | Normal: Pembuat Project | 1. Login sebagai Pembuat Project.<br>2. Buka detail project miliknya, tekan "Post a progress update".<br>3. Isi milestone, pilih status, isi persentase dan dana terpakai.<br>4. Unggah satu foto.<br>5. Tekan kirim, lalu buka tab Progress. | User: sari@klimpool.id<br>Project: Sayung Coastal Mangrove Restoration<br>Milestone: Penanaman tahap 2, Status: In progress, Persentase: 55, Dana: 5.000.000, Berkas: foto PNG < 5 MB | Modal tertutup dan toast "Progress update posted." tampil. Timeline Progress menampilkan pembaruan teratas dengan waktu saat itu, status, persentase, dan tautan dokumentasi yang dapat dibuka. | Toast "Progress update posted." tampil. Timeline Progress menampilkan "Penanaman tahap 2" di posisi teratas pada 18 Nov 2026 22:56 WIB dengan status In progress, "55% complete · Rp5,000,000 spent", dan tautan berkas PNG yang terbuka menampilkan gambar. | Pass |
| UC09-TC02 | KF23, KF25 | Normal: Admin Sistem | 1. Login sebagai Admin Sistem.<br>2. Buka detail project mana pun, tekan "Post a progress update".<br>3. Isi milestone dan status, kirim. | User: admin@klimpool.id<br>Project: Clean Water for Upper Citarum Villages | Tombol progres tampil (tanpa tombol "Manage volunteers"); pembaruan tersimpan dan tampil di timeline. | Admin Sistem melihat tombol "Post a progress update" tanpa tombol "Manage volunteers". Pembaruan "Pemeriksaan admin" berstatus In progress dengan berkas PNG tersimpan dan tampil paling atas pada timeline (18 Nov 2026 23:19 WIB). | Pass |
| UC09-TC03 | KF25 | Alternatif 1: Akses ditolak | 1. Login sebagai pengguna yang bukan pembuat.<br>2. Buka detail project; pastikan tombol progres tidak ada.<br>3. Kirim `POST /api/projects/mgv/progres` langsung dari Console DevTools dengan `FormData` berisi milestone dan status. | User: andi@klimpool.id<br>Project: Sayung Coastal Mangrove Restoration | Tombol progres tidak tampil. Permintaan langsung dijawab 403 "Hanya pembuat project atau Admin Sistem yang dapat memperbarui progres."; timeline tidak berubah. | Tombol "Post a progress update" dan "Manage volunteers" tidak tampil. Permintaan langsung dari Console dijawab `403 {pesan: "Hanya pembuat project atau Admin Sistem yang dapat memperbarui progres."}`; tidak ada pembaruan "Uji akses bukan pemilik" pada riwayat progres. | Pass |
| UC09-TC04 | KF24 | Alternatif 2: Format/ukuran berkas tidak valid | 1. Login sebagai Pembuat Project dan buka formulir progres.<br>2. Isi milestone dan status.<br>3. Pilih berkas ZIP, lalu PDF berukuran di atas 50 MB.<br>4. Tekan kirim. | User: sari@klimpool.id<br>Berkas: `dokumen.zip`, lalu `besar.pdf` (± 51 MB) | Pembaruan dibatalkan; pesan "Format berkas tidak didukung…" lalu "Ukuran berkas … melebihi batas 50 MB." tampil di bawah kolom unggahan; tidak ada pembaruan baru di timeline. | Memilih `dokumen.zip` memunculkan "dokumen.zip: Format berkas tidak didukung. Unggah gambar (JPG, PNG, WebP) atau PDF."; memilih `besar-51MB.pdf` memunculkan "besar-51MB.pdf: Ukuran berkas 51 MB melebihi batas 50 MB."; formulir tidak terkirim dan timeline tidak bertambah. | Pass |
| UC09-TC05 | KF24 | Alternatif 2: Kesalahan jaringan | 1. Buka formulir progres dan isi lengkap dengan satu foto.<br>2. Set DevTools Network ke *Offline*.<br>3. Tekan kirim.<br>4. Kembalikan *Online* dan muat ulang tab Progress. | User: sari@klimpool.id | Tampil "Connection lost. Check your network and try again."; modal tetap terbuka dengan isian utuh; setelah dimuat ulang tidak ada pembaruan baru. | Muncul "Update not saved" dengan pesan "Connection lost. Check your network and try again."; modal tetap terbuka dengan isian dan berkas utuh. Setelah online dan dimuat ulang, jumlah Progress tetap 5 dan tidak ada "Uji jaringan putus". | Pass |

### 4.4.10 Use Case Melihat Riwayat dan Penelusuran

**ID Use Case:** UC10  
**Nama Use Case:** Melihat Riwayat dan Penelusuran

Tabel 4.4.10. Hasil Pengujian Use Case UC10

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC10-TC01 | KF27 | Normal | 1. Login.<br>2. Buka menu Account.<br>3. Pilih tab "Activity history". | User: andi@klimpool.id<br>Pass: klimpool123 | Daftar riwayat donasi dan progres tampil dari yang terbaru, dikelompokkan per bulan. | Tab "Activity history" (filter All) menampilkan riwayat terurut dari yang terbaru di bawah judul bulan NOV 2026: donasi Rp25.000 (13.23 WIB), Rp10.000 (13.01 WIB), Rp25.000 (12.41 WIB) ke Sayung Coastal Mangrove Restoration, lalu donasi 18 Nov 2026 ke Enggros Village Infiltration Wells; setiap entri memuat waktu, ID transaksi, nominal, dan status Successful | Pass |
| UC10-TC02 | KF27 | Normal: detail transaksi | 1. Lanjut dari UC10-TC01.<br>2. Pilih satu entri donasi. | - | Rincian transaksi tampil (ID, jenis, penerima, nominal, waktu, status). | Modal "Activity details" tampil: Transaction ID beed9204-f795-4802-8a7d-2a344824001c, Type Donation, Recipient Sayung Coastal Mangrove Restoration, Amount Rp25.000, Time 19 Nov 2026 13.23 WIB, Status Successful, beserta tombol See use of funds, See progress, dan Print receipt | Pass |
| UC10-TC03 | KF27 | Normal: detail progres | 1. Lanjut dari UC10-TC01.<br>2. Pilih satu entri progres. | - | Rincian progres tampil (nama aksi, waktu, status pelaksanaan, persentase, dana terpakai, catatan, dan akses ke seluruh pembaruan). | Dengan akun andi@klimpool.id, entri progres "Planting phase 1 complete" membuka rincian: Action Sayung Coastal Mangrove Restoration, Recorded 21 Oct 2026 23.20 WIB, Status In progress, Completion 35%, Funds spent Rp24.500.000, catatan "31 volunteers planted 4,200 seedlings…", dan tombol "Open all updates" | Pass |
| UC10-TC04 | KF27 | Normal: filter jenis | 1. Lanjut dari UC10-TC01.<br>2. Pilih filter "Donations", lalu "Progress". | - | Hanya entri jenis yang dipilih yang tampil. | Filter "Donations" hanya menampilkan entri donasi (NOV 2026); filter "Progress" hanya menampilkan entri progres (OCT 2026), masing-masing dengan persentase penyelesaian | Pass |
| UC10-TC05 | KF27 | Alternatif 1: Riwayat belum tersedia | 1. Daftar akun baru lewat Sign up.<br>2. Buka Account, tab "Activity history". | Akun baru (mis. uji.riwayat@klimpool.id) | Muncul pesan "Your history is empty". | Akun baru (saldo Rp0) membuka Activity history dan mendapat pesan "Your history is empty" dengan keterangan "You have not donated, volunteered, or created an action yet…" serta tombol "Start exploring" | Pass |
| UC10-TC06 | KF27 | Alternatif 1: Kategori kosong | 1. Login dengan akun yang punya riwayat tetapi belum pernah top-up.<br>2. Pilih filter kategori yang kosong. | User: nadia@klimpool.id | Muncul pesan "No activity in this category yet". | Akun nadia@klimpool.id (saldo Rp0) dengan filter "Donations" menampilkan "No activity in this category yet" dan tombol "Show everything" | Pass |
| UC10-TC07 | KF27 | Alternatif: Belum login | Buka `/account` tanpa login. | - | Halaman meminta login; data riwayat tidak ditampilkan. | Halaman /account tanpa login menampilkan "Log in to see your activity" ("This page requires a KlimPooL account.") dengan tombol Log in dan Create an account; data riwayat tidak ditampilkan | Pass |

<br>

## 4.5 Pengujian Kebutuhan Non-Fungsional (KNF)

Setiap KNF pada Tabel 3.2 SKPL diuji secara terukur berdasarkan parameter yang telah didefinisikan. Setiap pengujian memuat target terukur, metode dan alat yang sesuai dengan parameter (misalnya Chrome DevTools untuk *response time* dan inspeksi basis data untuk *security*), serta hasil aktual berupa angka atau data. KNF yang belum dipenuhi atau tidak diimplementasikan dicantumkan beserta alasan dan rencana perbaikan.

Tabel 4.5. Hasil Pengujian KNF

| ID Pengujian | ID KNF | Parameter | Target Terukur | Metode dan Alat | Hasil Aktual | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| KNF02-TC01 | KNF02 | *Performance efficiency* (waktu tampil hasil filter) | Hasil akhir pencarian tampil ≤ 3 detik setelah filter diterapkan, pada jaringan stabil | Build produksi lokal (`npm run build` lalu `npm run start`). Chrome DevTools tab Network (*Disable cache*, tanpa *throttling*, filter `katalog?`): ubah filter Explore 10 kali (tipe, kategori, provinsi, status, periode), catat kolom *Time* setiap permintaan `GET /api/katalog`; ambil rata-rata dan maksimum | 10 pengukuran `GET /api/katalog`: 48, 49, 44, 39, 49, 45, 39, 42, 43, dan 37 ms; rata-rata 0,04 detik (43,5 ms), maksimum 0,05 detik (49 ms) | Pass |
| KNF02-TC02 | KNF02 | *Performance efficiency* (waktu tanggap API filter) | Respons `GET /api/katalog` dengan filter ≤ 3 detik | Script PowerShell `Measure-Command` + `Invoke-WebRequest` ke `GET /api/katalog?tipe=project&kategori=Clean%20water&status=donasi&periode=berjalan`, 30 kali berturut-turut pada build produksi lokal; ambil rata-rata, maksimum, dan jumlah respons selain 200 | 30 dari 30 permintaan berstatus 200; rata-rata 18,4 ms, maksimum 33 ms (permintaan pertama), permintaan lainnya 14–28 ms | Pass |
| KNF03-TC01 | KNF03 | Interaction capability (lingkup aksi) | Maksimal 5 tahap normal campaign | Playwright Chromium; telusuri alur UI dan periksa status API | 4 tahap: My Actions → formulir campaign → detail Draft → status Menunggu Verifikasi | Pass pada lingkup aksi |
| KNF03-TC02 | KNF03 | Interaction capability (lingkup aksi) | Maksimal 5 tahap normal project | Playwright Chromium; telusuri dua tahap form dan periksa status API | 5 tahap: My Actions → informasi project → kebutuhan/jadwal → detail Draft → status Menunggu Verifikasi | Pass pada lingkup aksi |
| KNF03-TC03 | KNF03 | Interaction capability (lingkup aksi) | Maksimal 5 tahap keputusan admin | Playwright Chromium; telusuri antrean dan keputusan | 3 tahap: antrean admin → detail pengajuan → status keputusan | Pass pada lingkup aksi |
| KNF04-TC01 | KNF04 | Reliability | Bila satu tahap donasi gagal, seluruh perubahan di-*rollback*: saldo kembali utuh dan tidak ada baris transaksi tertinggal | Uji integrasi `donasi.integrasi.test.ts` (kasus KF16) terhadap MySQL; cek saldo dan jumlah transaksi sebelum/sesudah | Saldo sebelum 100.000 / sesudah 100.000; jumlah transaksi tidak bertambah; uji KF16 lulus (`donasi.integrasi.test.ts`) | Pass |
| KNF04-TC02 | KNF04 | Reliability | Saat jaringan klien putus di tengah transaksi, tidak ada donasi hilang atau ganda | Chrome DevTools: Network *Offline* saat menekan "Donate now", lalu *Online* dan "Try again"; hitung baris `transaksi_donasi` milik donatur | Jumlah transaksi u1: 6 → 7 (bertambah 1); saldo Rp975.000 → Rp950.000 (berkurang satu kali Rp25.000); tidak ada transaksi ganda maupun hilang | Pass |
| KNF04-TC03 | KNF04 | Reliability | Saat koneksi ke basis data terputus, transaksi dibatalkan dan aplikasi tidak *crash* | `docker stop klimpool-db` sebelum konfirmasi, lalu `docker start klimpool-db`; bandingkan saldo dan jumlah transaksi | Tampil "Donation not processed. Something went wrong on the server. Please try again later."; aplikasi tidak *crash*. Saldo u1 Rp890.000 dan jumlah transaksi 10, sama persis sebelum dan sesudah | Pass |
| KNF06-TC01 | KNF06 | Reliability | Uptime ≥ 99% (cek gagal ≤ 1% dari total cek) | Script PowerShell `uptime.ps1`: `Invoke-WebRequest` ke `GET /api/katalog` tiap 10 detik selama 1 jam (360 cek) pada build produksi lokal (`npm run start`) | 360/360 cek sukses = 100% | Pass. Catatan: diuji 1 jam pada lingkungan lokal, belum sebulan pada server produksi karena aplikasi belum di-*deploy*. Pengukuran bulanan direncanakan setelah *deploy*. |
| KNF06-TC02 | KNF06 | Reliability | Layanan pulih otomatis setelah basis data mati | `docker stop klimpool-db` lalu `docker start klimpool-db`; ukur waktu sampai `/api/katalog` kembali 200. Docker Compose memakai `restart: unless-stopped` dan *healthcheck* | `/api/katalog` kembali berstatus 200 dalam 3,6 detik setelah basis data dinyalakan ulang, tanpa perlu me-*restart* aplikasi | Pass |
| KNF07-TC01 | KNF07 | *Performance efficiency* (kapasitas unggah) | Berkas dokumentasi berukuran 50 MB per berkas diproses dan tersimpan; berkas di atas 50 MB ditolak | Unggah PDF ± 49,9 MB lewat formulir progres (UC09), 3 kali; catat status dan durasi `POST /api/projects/mgv/progres` di Chrome DevTools tab Network, lalu cek berkas di `src/uploads/progres/mgv/` (durasi juga tercatat pada log server `npm run dev`). Batas tepat 50 MB juga diuji otomatis pada C38-UT03 | Ketiga unggahan PDF 49,9 MB (52.323.942 byte) berstatus 201 dan tersimpan utuh di `src/uploads/progres/mgv/` dengan ukuran sama. Waktu proses server (log `npm run dev`): 900 ms, 1.186 ms, 592 ms; rata-rata 0,89 detik, maksimum 1,19 detik | Pass |
| KNF07-TC02 | KNF07 | *Performance efficiency* (format berkas) | Kelima format pada SKPL (JPG, PNG, PDF, MP4, ZIP) dapat diunggah | Unggah satu berkas kecil untuk setiap format lewat formulir progres; diperiksa juga otomatis pada C37-UT04 | JPG, PNG, dan PDF diterima. MP4 dan ZIP ditolak dengan pesan "Format berkas tidak didukung. Unggah gambar (JPG, PNG, WebP) atau PDF." karena implementasi hanya menerima gambar dan PDF (`shared/dokumentasi.ts`) | Fail. Perbaikan: tambahkan `video/mp4` dan `application/zip` ke `DOKUMENTASI_TIPE_DIIZINKAN` beserta penyajiannya, atau perbarui KNF07 pada SKPL bila format tersebut memang tidak dibutuhkan |
| KNF08-TC01 | KNF08 | *Performance efficiency* (waktu tampil status) | Status pendaftaran yang baru diputuskan tampil di antarmuka Volunteer ≤ 2 detik setelah halaman status dibuka | Pembuat Project menerima pendaftaran (UC08-TC01); Volunteer membuka tab "Volunteer applications"; ukur waktu `GET /api/relawan/saya` sampai daftar tampil dengan Chrome DevTools tab Performance/Network, 10 kali, ambil rata-rata dan maksimum | 10 pengukuran `GET /api/relawan/saya`: 63, 131, 244, 545, 105, 187, 104, 259, 243, dan 380 ms; rata-rata 0,23 detik, maksimum 0,55 detik. Status "Accepted" beserta titik kumpul langsung tampil setelah halaman dibuka | Pass |
| KNF09-TC01 | KNF09 | *Performance efficiency* (beban pengguna) | Dengan 1.000 koneksi bersamaan, waktu tanggap tiap permintaan ≤ 3 detik dan tidak ada permintaan gagal | Uji beban `autocannon` (dijalankan lewat `npx`, tidak ditambahkan ke `package.json`): `-c 1000 -d 30` ke `GET /api/katalog` pada build produksi lokal (`npm run start`) dengan basis data berisi data seed; catat latensi rata-rata, p99, maksimum, jumlah permintaan, dan jumlah galat/*timeout* | Selama 30 detik dengan 1.000 koneksi: latensi rata-rata 1.591,8 ms, median 1.609 ms, p97,5 1.905 ms, p99 2.040 ms, maksimum 2.284 ms; rata-rata 611,84 permintaan per detik. Total sekitar 19.000 permintaan dalam 30,15 detik (129 MB dibaca) tanpa galat maupun *timeout* | Pass |
| KNF11-TC01 | KNF11 | Maintainability (modularitas) | Menambah satu kategori aksi baru tidak mengubah satu pun file modul transaksi donasi | Uji perubahan: tambahkan kategori `Coral reefs` ke `KATEGORI` (`src/shared/katalog.ts`), lalu jalankan `npx tsc --noEmit`, `git diff --stat`, Vitest, dan test node:test modul donasi/top-up. Periksa juga apakah 18 file modul transaksi (`DonasiController.ts`, `DonasiService.ts`, `DonasiRepository.ts`, `models/Donatur.ts`, `models/TransaksiDonasi.ts`, `models/BuktiTransaksi.ts`, 9 file `components/views/DonasiView/`, dan 3 file `app/api/donasi/`) merujuk `kategori` atau `katalog`. Perubahan dikembalikan setelah uji | `npx tsc --noEmit` meminta satu entri foto cadangan di `FOTO_KATEGORI` (`src/shared/explore.ts`); setelah ditambahkan, `tsc` lulus. `git diff --stat`: 2 file berubah (`shared/katalog.ts`, `shared/explore.ts`), 2 baris ditambah, tidak ada file modul transaksi yang berubah. Pencarian `kategori\|katalog` pada 18 file modul transaksi: 0 hasil. Kolom `kategori` bertipe `VARCHAR(50)`, bukan `ENUM`, sehingga tidak perlu migrasi basis data. Test donasi/top-up node:test: 42 test, 30 lulus, 0 gagal, 12 dilewati karena basis data tidak berjalan. Vitest: 194 dari 195 lulus; 1 gagal pada `node-runner.spec.ts` karena izin *symlink* Windows (sama dengan sebelum perubahan, lihat Subbab 4.2) | Pass |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |
| KNF01-TC01 | KNF01 | *Flexibility* (*smartphone*) | Pada lebar 360 px: tidak ada *scroll* horizontal; menu navbar berubah menjadi tombol panel; modal auth, Explore, dan detail project dapat dipakai tanpa memperbesar layar | Chrome DevTools *Device Toolbar* 360 px pada `/`, `/explore`, `/project/mgv`, dan modal *Sign up*; di Console jalankan `document.documentElement.scrollWidth <= innerWidth` | Keempat layar `true` (360 ≤ 360); navbar menampilkan *Log in* dan tombol menu ☰; filter Explore tersusun vertikal | Pass |
| KNF01-TC02 | KNF01 | *Flexibility* (*tablet*) | Pada 768 px: tidak ada *scroll* horizontal; elemen tidak saling menimpa | DevTools 768 px pada halaman yang sama dan pemeriksaan Console yang sama | Keempat layar `true` (768 ≤ 768); navbar menampilkan *Log in*, *Sign up*, dan tombol menu; tidak ada elemen yang saling menimpa | Pass |
| KNF01-TC03 | KNF01 | *Flexibility* (*desktop*) | Pada 1280 px: menu navbar tampil penuh; tidak ada *scroll* horizontal | DevTools 1280×800 pada halaman yang sama dan pemeriksaan Console yang sama | Keempat layar `true` (1280 ≤ 1280); navbar menampilkan menu penuh (Home, Explore, How it works, Start an action, Impact) | Pass |
| KNF05-TC01 | KNF05 | *Security* (bcrypt) | 100% kata sandi tersimpan sebagai hash bcrypt *cost* 12 (awalan `$2a$12$`/`$2b$12$`, panjang 60); tidak ada teks terbuka | Inspeksi `src/db/migrations/002_seed.sql`; query akun baru pada INT-TC39; unit test C12-UT04 | 10 dari 10 akun *seed* tersimpan dengan hash `$2b$12$…` sepanjang 60 karakter. Akun baru `nayla.uji@klimpool.id` di basis data berawalan `$2b$12$` dengan panjang 60 (INT-TC39). C12-UT04 lulus. Tidak ada kata sandi teks terbuka | Pass |
| KNF05-TC02 | KNF05 | *Security* (TLS ≥ 1.2) | Lalu lintas aplikasi melalui HTTPS dengan TLS ≥ 1.2; cookie sesi bertanda `Secure` | Aplikasi tidak di-*deploy* dan hanya dijalankan lokal melalui HTTP *loopback*; atribut `Secure` cookie hanya aktif bila `NODE_ENV=production` di server HTTPS | Tidak dapat diuji karena tidak ada server HTTPS | Tidak diuji. KNF05 bagian TLS belum terpenuhi pada lingkungan lokal |
| KNF05-TC03 | KNF05 | *Security* (respons API) | Kata sandi dan hash tidak pernah muncul pada respons API | Periksa badan respons `POST /api/auth/masuk` dan `POST /api/auth/daftar`; cari teks `password` dan awalan hash `$2`. Pendukung: C16-UT01 | Badan `POST /api/auth/masuk` hanya berisi `idPengguna`, `nama`, `email`, `peran`, `saldo`; tidak memuat `password` maupun `$2`. Respons daftar 201 pada INT-TC40 juga tanpa keduanya; C16-UT01 lulus | Pass |
| KNF10-TC01 | KNF10 | *Constraint* (minimisasi data) | UC01 hanya mengumpulkan nama, email, dan kata sandi | Inspeksi `FormPendaftaranView.tsx` dan `UserRepository.simpanAkunBaru()` | Formulir hanya memuat *Full name*, *Email*, *Password*. `simpanAkunBaru()` hanya menulis `nama`, `peran`, `tanggal_bergabung`, `email`, `password_hash`, `status_akun`, dan saldo 0; kolom `telepon` dan `kota` tidak diisi oleh UC01 | Pass (inspeksi kode) |
| KNF10-TC02 | KNF10 | *Constraint* (kerahasiaan) | Data pribadi tidak bocor lewat pesan galat atau URL | Pesan login identik untuk email terdaftar dan tidak terdaftar (C12-UT05, UC01-TC06); galat tak terduga menjadi pesan umum `GALAT_SERVER` (C16-UT05); kredensial dikirim lewat badan `POST`, bukan URL (periksa tab Network) | C12-UT05 dan C16-UT05 lulus. Inspeksi kode: daftar dan login dikirim lewat badan `POST` JSON (`kirimJson()`), bukan parameter URL | Pass (unit test dan inspeksi kode) |
| KNF10-TC03 | KNF10 | *Constraint* (akses data milik sendiri) | Pengguna hanya dapat membaca data pribadi miliknya | Merujuk INT-TC08 (rincian transaksi milik pengguna lain dijawab 404) dan INT-TC13 (daftar pendaftar berisi nomor telepon hanya untuk pemilik project) | INT-TC08 dan INT-TC13 berkesimpulan Pass pada Subbab 4.3 | Pass |
| KNF10-TC04 | KNF10 | *Constraint* (hak subjek data) | Tersedia kebijakan privasi, persetujuan pengguna saat mendaftar, dan cara menghapus atau mengunduh data akun | Inspeksi antarmuka dan kode (`src/app/`, `src/components/`, `src/app/api/`) | Tidak ditemukan halaman kebijakan privasi, kotak persetujuan pada formulir *Sign up*, maupun fitur atau endpoint penghapusan dan ekspor data akun | Belum terpenuhi. Rencana: tambah halaman kebijakan privasi, persetujuan saat mendaftar, dan permintaan penghapusan akun |

**Catatan KNF10:** pengujian di atas memeriksa kontrol teknis (minimisasi data, hash, tidak ada kebocoran lewat galat, pembatasan akses) dan keberadaan fitur hak subjek data. Hasil ini **bukan** pernyataan kepatuhan hukum terhadap UU PDP, karena kepatuhan juga bergantung pada dasar pemrosesan, kebijakan internal, dan prosedur organisasi yang berada di luar perangkat lunak. Berdasarkan KNF10-TC04, KNF10 dinyatakan **belum terpenuhi sepenuhnya**.

**Catatan KNF05:** bagian bcrypt diuji pada KNF05-TC01 dan KNF05-TC03. Bagian TLS 1.2 tidak dapat diuji karena aplikasi tidak di-*deploy* dan hanya dijalankan lokal (lihat Subbab 3.1), sehingga KNF05 dinyatakan **terpenuhi sebagian**.

**Catatan KNF01:** KNF01 tidak terkait satu KF tertentu (SKPL merujuk R01 dan R19). Pengujian diambil pada layar UC01 (modal *Sign up*) dan layar publik utama (Home, Explore, detail project) pada lebar 360, 768, dan 1280 px.

Catatan KNF08: rumusan KNF08 pada SKPL menyebut pesan *chat* dan notifikasi status pesanan, padahal KlimPooL tidak memiliki fitur *chat* maupun pesanan. Notifikasi yang ada pada aplikasi adalah perubahan status pendaftaran relawan (KF22), sehingga KNF08 diuji pada tampilan status tersebut. Status dibaca ketika Volunteer membuka atau memuat ulang halamannya, bukan didorong secara *real-time*.

**Batas KNF03:** satu tahap berarti satu keadaan antarmuka utama, bukan setiap klik, isian, atau request. Penghitungan dimulai setelah login pada My Actions/antrean admin; berakhir saat status hasil tampil. Pemilihan jenis berada dalam tahap formulir yang sama. Koreksi isian, Kembali, penolakan lalu pengajuan ulang, dan perpindahan peran tidak dihitung sebagai alur normal. Script juga menguji cabang tersebut, tetapi angka 4/5/3 hanya untuk tahapan normal tanpa pengulangan.

SKPL KNF03 menyebut “pemesanan jasa hingga pembayaran”, yang tidak tersedia di KlimPooL. Hasil di atas **bukan bukti pemenuhan literal KNF03**, melainkan pengukuran alur aksi UC02–UC04. Rumusan dan batas langkah perlu disepakati tim/asisten; belum ada validasi manusia atau studi pengguna yang diklaim.

**Ringkasan UC02–UC04:** 68 unit Pass; runner akses/validasi/integrasi 15 Pass, 0 Skip; browser 16 kasus UC + 3 pengukuran KNF Pass pada lingkupnya, tanpa `pageerror`. Lint lulus. Build lulus pada percobaan ulang; percobaan awal dihentikan peringatan kerentanan Next.js 16.4.4. Peningkatan framework belum dilakukan karena di luar perubahan pengujian ini. Angka pengujian di atas hanya untuk cakupan aksi, bukan seluruh repositori.

Catatan KNF11: rumusan KNF11 pada SKPL menyebut "kategori jasa sekunder" dan "modul transaksi utama", padahal KlimPooL tidak memiliki jasa. Padanannya pada aplikasi adalah kategori aksi iklim (misalnya *Clean water*, *Reforestation*) dan modul transaksi donasi (UC06), sehingga KNF11 diuji dengan menambah kategori aksi baru lalu memeriksa apakah modul donasi ikut berubah.

Catatan KNF09: pengujian beban dijalankan pada satu laptop, dengan alat uji, aplikasi, dan basis data berada di mesin yang sama, sehingga hasilnya belum mencerminkan server produksi. Pengukuran ulang direncanakan setelah aplikasi di-*deploy*.

<br>

## 4.6 Tangkapan Layar dan Bukti Hasil Pengujian

Bukti pengujian dilampirkan sesuai ID Pengujian pada Subbab 4.2 sampai 4.5, berupa tangkapan layar aplikasi, keluaran *test runner*, laporan *coverage* untuk setiap kelas Mendalam, atau hasil alat ukur.

Tabel 4.6. Bukti Hasil Pengujian

| ID Pengujian | Bukti Hasil Pengujian |
| :--- | :--- |
| C02-UT01–UT13, C03-UT01–UT12, C10-UT01–UT06, C11-UT01–UT04, C17-UT01–UT04, C19-UT01–UT04, C20-UT01–UT03, C22-UT01–UT04, C23-UT01–UT02, C24-UT01–UT02, C25-UT01–UT03, C26-UT01–UT11 | <img alt="68 kasus unit aksi lulus" src="./assets/pengujian/aksi/UT-aksi-68.png" width="100%"> |
| Coverage tujuh file aksi (C02, C03, C10, C11, C26; batas pada §4.2) | <img alt="Total coverage aksi" src="./assets/pengujian/aksi/COVERAGE-aksi.png" width="100%"><br><img alt="Coverage validasi" src="./assets/pengujian/aksi/COVERAGE-validasi.png" width="100%"><br><img alt="Coverage service" src="./assets/pengujian/aksi/COVERAGE-service.png" width="100%"><br><img alt="Coverage repository" src="./assets/pengujian/aksi/COVERAGE-repository.png" width="100%"><br><img alt="Coverage empat controller" src="./assets/pengujian/aksi/COVERAGE-controller.png" width="100%"> |
| INT-TC32–TC37 | <img alt="Runner aksi: 15 pass, 0 fail, 0 skip; termasuk enam integrasi MySQL" src="./assets/pengujian/aksi/INT-aksi-15.png" width="100%"> |
| INT-TC31, seluruh UC02–UC04 dan KNF03 | <img alt="Keluaran browser: 16 UC dan 3 KNF pass, tanpa pageerror" src="./assets/pengujian/aksi/BROWSER-aksi-19.png" width="100%"> |
| UC02-TC01 | <img alt="Campaign Draft" src="./assets/pengujian/aksi/UC02-TC01-draft.png" width="70%"><br><img alt="Campaign pending" src="./assets/pengujian/aksi/UC02-TC01-pending.png" width="70%"> |
| UC02-TC02, UC02-TC03, UC02-TC06 | <img alt="Target 0 ditolak" src="./assets/pengujian/aksi/UC02-TC02-target.png" width="70%"><br><img alt="Periode salah ditolak" src="./assets/pengujian/aksi/UC02-TC03-periode.png" width="70%"><br><img alt="Campaign tidak lengkap ditolak" src="./assets/pengujian/aksi/UC02-TC06-kelengkapan.png" width="70%"> |
| UC03-TC01, UC03-TC03 | <img alt="Informasi project" src="./assets/pengujian/aksi/UC03-TC01-informasi.png" width="70%"><br><img alt="Kebutuhan project" src="./assets/pengujian/aksi/UC03-TC01-kebutuhan.png" width="70%"><br><img alt="Project Draft dengan ID tetap" src="./assets/pengujian/aksi/UC03-TC01-draft.png" width="70%"><br><img alt="Project pending" src="./assets/pengujian/aksi/UC03-TC01-pending.png" width="70%"> |
| UC03-TC02, UC03-TC05 | <img alt="Logistik kosong ditolak" src="./assets/pengujian/aksi/UC03-TC02-kebutuhan.png" width="70%"><br><img alt="Informasi project kosong ditolak" src="./assets/pengujian/aksi/UC03-TC05-kelengkapan.png" width="70%"> |
| UC04-TC01 | <img alt="Antrean admin" src="./assets/pengujian/aksi/UC04-TC01-antrean.png" width="70%"><br><img alt="Keputusan terpublikasi" src="./assets/pengujian/aksi/UC04-TC01-published.png" width="70%"> |
| UC04-TC02, UC04-TC03 | <img alt="Penolakan wajib alasan" src="./assets/pengujian/aksi/UC04-TC03-alasan.png" width="70%"><br><img alt="Status Ditolak dengan alasan" src="./assets/pengujian/aksi/UC04-TC02-ditolak.png" width="70%"> |
| UC04-TC05 | <img alt="Non-admin tidak boleh membuka antrean" src="./assets/pengujian/aksi/UC04-TC05-akses.png" width="70%"> |
| KNF03-TC01–TC03 | <img alt="Titik awal My Actions" src="./assets/pengujian/aksi/KNF03-TC01-mulai.png" width="70%"><br>Tahap berikutnya merujuk bukti UC02-TC01, UC03-TC01, UC04-TC01 dan keluaran browser di atas. |
| C01-UT01 – C01-UT17, C05-UT01 – C05-UT15, C18-UT01 – C18-UT04, C21-UT01 – C21-UT08, C27-UT01 – C27-UT07, C28-UT01 – C28-UT04, C29-UT01 – C29-UT08 | <img alt="Keluaran unit test UC05: 150 passed" src="./assets/pengujian/UT-UC05.png" width="70%"> |
| C01, C05 (coverage) | <img alt="Laporan coverage C01 dan C05" src="./assets/pengujian/COVERAGE-C01-C05.png" width="70%"> |
| C04-UT01 – C04-UT06, C06-UT01 – C06-UT10, C07-UT01 – C07-UT08, C30-UT01 – C30-UT04, C31-UT01 – C31-UT03, C39-UT01 – C39-UT04, C41-UT01 – C41-UT04, INT-TC05, INT-TC07 – INT-TC09, KNF04-TC01 | <img src="./assets/pengujian/unit-donasi-riwayat.png" width="100%"><br><img src="./assets/pengujian/unit-riwayat-kategori.png" width="100%"> |
| Coverage C04, C06, C07 | <img src="./assets/pengujian/coverage-donasi.png" width="100%"> |
| C09-UT01 – C09-UT18, C34-UT01 – C34-UT15, C38-UT01 – C38-UT11 | <img alt="Keluaran unit test C09, C34, C38: 44 pass" src="./assets/pengujian/UT-C09-C34-C38.png" width="70%"> |
| C09, C34, C38 (coverage) | <img alt="Laporan coverage C09, C34, C38" src="./assets/pengujian/COVERAGE-C09-C34-C38.png" width="70%"> |
| C32-UT01, INT-TC01 | <img src="./assets/pengujian/INT-TC01-network-201.png" width="100%"><br><img src="./assets/pengujian/INT-TC01-response.png" width="100%"> |
| C32-UT02 | <img src="./assets/pengujian/C32-UT02-401.png" width="100%"> |
| C32-UT03 | <img src="./assets/pengujian/C32-UT03-400.png" width="100%"> |
| C32-UT04 | <img src="./assets/pengujian/C32-UT04-form.png" width="100%"> |
| C33-UT01 – C33-UT04, C35-UT01 – C35-UT04, C37-UT01 – C37-UT04 | <img alt="Keluaran unit test C33, C35, C37: 12 passed" src="./assets/pengujian/UT-C33-C35-C37.png" width="70%"> |
| INT-TC02, KNF04-TC02 | <img src="./assets/pengujian/KNF04-TC02-query.png" width="100%"> |
| INT-TC03 | <img src="./assets/pengujian/INT-TC03-saldo-kurang.png" width="100%"> |
| INT-TC04 | <img src="./assets/pengujian/INT-TC04-query-db.png" width="100%"> |
| INT-TC06, INT-TC10 | <img src="./assets/pengujian/topup-integrasi.png" width="100%"> |
| INT-TC11 – INT-TC20 | <img alt="Keluaran integrasi MySQL: 10 pass, skipped 0" src="./assets/pengujian/INT-TC11-TC20.png" width="70%"> |
| INT-TC21 | <img alt="INT-TC21 POST relawan 201" src="./assets/pengujian/INT-TC21-a.png" width="70%"><br><img alt="INT-TC21 POST progres 201" src="./assets/pengujian/INT-TC21-b.png" width="70%"><br><img alt="INT-TC21 header multipart" src="./assets/pengujian/INT-TC21-c.png" width="70%"> |
| INT-TC22 | <img alt="INT-TC22 berkas tersimpan dan log GET dokumentasi 200" src="./assets/pengujian/INT-TC22.png" width="70%"><br><img alt="INT-TC22 dokumentasi terbuka" src="./assets/pengujian/UC09-TC01-c.png" width="70%"> |
| INT-TC23 | <img alt="INT-TC23 GET katalog 200 dengan filter" src="./assets/pengujian/INT-TC23.png" width="70%"> |
| INT-TC24 | <img alt="INT-TC24 parameter tidak valid 400" src="./assets/pengujian/INT-TC24.png" width="70%"> |
| INT-TC25 | <img alt="INT-TC25 total katalog" src="./assets/pengujian/INT-TC25-a.png" width="70%"><br><img alt="INT-TC25 query status di basis data" src="./assets/pengujian/INT-TC25-b.png" width="70%"> |
| INT-TC26 | <img alt="INT-TC26 kata kunci SQL dan tabel project tetap ada" src="./assets/pengujian/INT-TC26.png" width="70%"> |
| INT-TC27 | <img alt="INT-TC27 GET peta seluruh wilayah" src="./assets/pengujian/INT-TC27.png" width="70%"> |
| INT-TC28 | <img alt="INT-TC28 GET peta radius 30 km dan 400 tanpa pusat" src="./assets/pengujian/INT-TC28.png" width="70%"> |
| INT-TC29 | <img alt="INT-TC29 detail sesuai basis data" src="./assets/pengujian/INT-TC29.png" width="70%"> |
| INT-TC30 | <img alt="INT-TC30 detail belum terpublikasi 404" src="./assets/pengujian/INT-TC30.png" width="70%"> |
| UC05-TC01 | <img alt="UC05-TC01 daftar terpublikasi" src="./assets/pengujian/UC05-TC01.png" width="70%"> |
| UC05-TC02 | <img alt="UC05-TC02 hasil kata kunci mangrove" src="./assets/pengujian/UC05-TC02.png" width="70%"> |
| UC05-TC03 | <img alt="UC05-TC03 kombinasi filter" src="./assets/pengujian/UC05-TC03.png" width="70%"> |
| UC05-TC04 | <img alt="UC05-TC04 filter Closed / completed" src="./assets/pengujian/UC05-TC04-a.png" width="70%"><br><img alt="UC05-TC04 filter Open for donations dan Happening now" src="./assets/pengujian/UC05-TC04-b.png" width="70%"> |
| UC05-TC05 | <img alt="UC05-TC05 detail project" src="./assets/pengujian/UC05-TC05.png" width="70%"> |
| UC05-TC06 | <img alt="UC05-TC06 detail campaign" src="./assets/pengujian/UC05-TC06.png" width="70%"> |
| UC05-TC07 | <img alt="UC05-TC07 tidak ditemukan" src="./assets/pengujian/UC05-TC07-a.png" width="70%"><br><img alt="UC05-TC07 setelah Clear all filters" src="./assets/pengujian/UC05-TC07-b.png" width="70%"> |
| UC05-TC08 | <img alt="UC05-TC08 popup pin peta" src="./assets/pengujian/UC05-TC08.png" width="70%"> |
| UC05-TC09 | <img alt="UC05-TC09 aksi belum terpublikasi 404" src="./assets/pengujian/UC05-TC09.png" width="70%"> |
| UC06-TC01 | <img src="./assets/pengujian/UC06-TC01-bukti.png" width="100%"> |
| UC06-TC02 | <img src="./assets/pengujian/UC06-TC02-login.png" width="100%"> |
| UC06-TC03 | <img src="./assets/pengujian/UC06-TC03-saldo-kurang.png" width="100%"> |
| UC06-TC04, KNF04-TC03 | <img src="./assets/pengujian/UC06-TC04-query-sebelum.png" width="100%"><br><img src="./assets/pengujian/UC06-TC04-db-mati.png" width="100%"><br><img src="./assets/pengujian/UC06-TC04-query-sesudah.png" width="100%"> |
| UC06-TC05 | <img src="./assets/pengujian/UC06-TC05-resend-409.png" width="100%"><br><img src="./assets/pengujian/UC06-TC05-preview.png" width="100%"><br><img src="./assets/pengujian/UC06-TC05-riwayat.png" width="100%"> |
| UC06-TC06 | <img src="./assets/pengujian/UC06-TC06-luwu.png" width="100%"><br><img src="./assets/pengujian/UC06-TC06-console.png" width="100%"> |
| UC06-TC07 | <img src="./assets/pengujian/UC06-TC07-nominal-0.png" width="100%"> |
| UC06-TC08 | <img src="./assets/pengujian/UC06-TC08-negatif.png" width="100%"> |
| UC07-TC01 | <img alt="UC07-TC01 formulir kosong" src="./assets/pengujian/UC07-TC01-a.png" width="70%"><br><img alt="UC07-TC01 formulir terisi" src="./assets/pengujian/UC07-TC01-b.png" width="70%"><br><img alt="UC07-TC01 Application sent" src="./assets/pengujian/UC07-TC01-c.png" width="70%"><br><img alt="UC07-TC01 status Waiting for a decision" src="./assets/pengujian/UC07-TC01-d.png" width="70%"> |
| UC07-TC02 | <img alt="UC07-TC02 pesan kolom wajib" src="./assets/pengujian/UC07-TC02.png" width="70%"> |
| UC07-TC03 | <img alt="UC07-TC03 pendaftaran ganda ditolak" src="./assets/pengujian/UC07-TC03-a.png" width="70%"><br><img alt="UC07-TC03 status lama tetap Accepted" src="./assets/pengujian/UC07-TC03-b.png" width="70%"> |
| UC07-TC04 | <img alt="UC07-TC04 pendaftaran ditutup" src="./assets/pengujian/UC07-TC04.png" width="70%"> |
| UC08-TC01 | <img alt="UC08-TC01 tombol pemilik" src="./assets/pengujian/UC08-TC01-a.png" width="70%"><br><img alt="UC08-TC01 daftar pendaftar" src="./assets/pengujian/UC08-TC01-b.png" width="70%"><br><img alt="UC08-TC01 Nadia diterima" src="./assets/pengujian/UC08-TC01-c.png" width="70%"><br><img alt="UC08-TC01 status Nadia Accepted" src="./assets/pengujian/UC08-TC01-d.png" width="70%"> |
| UC08-TC02 | <img alt="UC08-TC02 konfirmasi tolak" src="./assets/pengujian/UC08-TC02-a.png" width="70%"><br><img alt="UC08-TC02 Fajar ditolak" src="./assets/pengujian/UC08-TC02-b.png" width="70%"><br><img alt="UC08-TC02 status Fajar Not selected" src="./assets/pengujian/UC08-TC02-c.png" width="70%"> |
| UC08-TC03 | <img alt="UC08-TC03 belum ada pendaftar" src="./assets/pengujian/UC08-TC03.png" width="70%"> |
| UC09-TC01 | <img alt="UC09-TC01 formulir terisi" src="./assets/pengujian/UC09-TC01-a.png" width="70%"><br><img alt="UC09-TC01 notifikasi berhasil" src="./assets/pengujian/UC09-TC01-d.png" width="70%"><br><img alt="UC09-TC01 timeline progres" src="./assets/pengujian/UC09-TC01-b.png" width="70%"><br><img alt="UC09-TC01 dokumentasi terbuka" src="./assets/pengujian/UC09-TC01-c.png" width="70%"> |
| UC09-TC02 | <img alt="UC09-TC02 tombol Admin" src="./assets/pengujian/UC09-TC02-a.png" width="70%"><br><img alt="UC09-TC02 timeline Pemeriksaan admin" src="./assets/pengujian/UC09-TC02-b.png" width="70%"> |
| UC09-TC04 | <img alt="UC09-TC04 ZIP ditolak" src="./assets/pengujian/UC09-TC04-a.png" width="70%"><br><img alt="UC09-TC04 PDF 51 MB ditolak" src="./assets/pengujian/UC09-TC04-b.png" width="70%"> |
| UC09-TC05 | <img alt="UC09-TC05 koneksi terputus" src="./assets/pengujian/UC09-TC05-a.png" width="70%"><br><img alt="UC09-TC05 progres tidak bertambah" src="./assets/pengujian/UC09-TC05-b.png" width="70%"> |
| UC09-TC03 | <img alt="UC09-TC03 tombol progres tidak tampil" src="./assets/pengujian/UC09-TC03-a.png" width="70%"><br><img alt="UC09-TC03 respons 403 di Console" src="./assets/pengujian/UC09-TC03-b.png" width="70%"><br><img alt="UC09-TC03 riwayat progres tidak berubah" src="./assets/pengujian/UC09-TC03-c.png" width="70%"> |
| UC10-TC01 | <img src="./assets/pengujian/UC10-TC01-riwayat.png" width="100%"> |
| UC10-TC02 | <img src="./assets/pengujian/UC10-TC02-detail-transaksi.png" width="100%"> |
| UC10-TC03 | <img src="./assets/pengujian/UC10-TC03-detail-progres.png" width="100%"> |
| UC10-TC04 | <img src="./assets/pengujian/UC10-TC04-filter-donations.png" width="100%"><br><img src="./assets/pengujian/UC10-TC04-filter-progress.png" width="100%"> |
| UC10-TC05 | <img src="./assets/pengujian/UC10-TC05-kosong.png" width="100%"> |
| UC10-TC06 | <img src="./assets/pengujian/UC10-TC06-kategori-kosong.png" width="100%"> |
| UC10-TC07 | <img src="./assets/pengujian/UC10-TC07-belum-login.png" width="100%"> |
| KNF02-TC01 | <img alt="KNF02-TC01 sepuluh pengukuran filter di DevTools" src="./assets/pengujian/KNF02-TC01.png" width="70%"> |
| KNF02-TC02 | <img alt="KNF02-TC02 tiga puluh pengukuran API katalog" src="./assets/pengujian/KNF02-TC02.png" width="70%"> |
| KNF06-TC01 | <img src="./assets/pengujian/KNF06-TC01-uptime.png" width="100%"> |
| KNF06-TC02 | <img src="./assets/pengujian/KNF06-TC02-pulih.png" width="100%"> |
| KNF07-TC01 | <img alt="KNF07-TC01 tiga pembaruan dengan PDF 49,9 MB" src="./assets/pengujian/KNF07-TC01-a.png" width="70%"><br><img alt="KNF07-TC01 tiga PDF tersimpan" src="./assets/pengujian/KNF07-TC01-b.png" width="70%"><br><img alt="KNF07-TC01 durasi tiga unggahan" src="./assets/pengujian/KNF07-TC01-c.png" width="70%"> |
| KNF07-TC02 | <img alt="KNF07-TC02 ZIP ditolak" src="./assets/pengujian/UC09-TC04-a.png" width="70%"> |
| KNF08-TC01 | <img alt="KNF08-TC01 sepuluh pengukuran" src="./assets/pengujian/KNF08-TC01.png" width="70%"> |
| KNF09-TC01 | <img alt="KNF09-TC01 keluaran autocannon 1.000 koneksi" src="./assets/pengujian/KNF09-TC01.png" width="70%"> |
| KNF11-TC01 | <img alt="KNF11-TC01 git diff stat dan tsc setelah kategori baru" src="./assets/pengujian/KNF11-TC01.png" width="70%"> |
| C12-UT01 – C12-UT09, C13-UT01 – C13-UT05, C16-UT01 – C16-UT06 | <img alt="Keluaran autentikasi.unit.test.ts: 20 pass" src="./assets/pengujian/akun/UT-UC01.png" width="70%"> |
| C12, C13 (coverage) | <img alt="Laporan coverage C12 dan C13" src="./assets/pengujian/akun/COVERAGE-C12-C13.png" width="70%"> |
| UC01-TC01, C14-UT01, INT-TC38 | <img alt="Toast akun berhasil dibuat" src="./assets/pengujian/akun/UC01-TC01_a_akun-dibuat.png" width="70%"><br><img alt="POST daftar 201 dan masuk 200" src="./assets/pengujian/akun/UC01-TC01_b_network.png" width="70%"> |
| UC01-TC02 | <img alt="Galat nama kosong" src="./assets/pengujian/akun/UC01-TC02_a_kosong.png" width="70%"><br><img alt="Galat format email" src="./assets/pengujian/akun/UC01-TC02_b_email-tidak-valid.png" width="70%"><br><img alt="Galat kata sandi pendek" src="./assets/pengujian/akun/UC01-TC02_c_password-pendek.png" width="70%"> |
| UC01-TC03, C14-UT02 | <img alt="Email sudah terdaftar" src="./assets/pengujian/akun/UC01-TC03_a_email-terpakai.png" width="70%"><br><img alt="Tab Log in dengan email terisi" src="./assets/pengujian/akun/UC01-TC03_b_login-dengan-email.png" width="70%"> |
| UC01-TC04, C15-UT01 | <img alt="Login berhasil di Explore" src="./assets/pengujian/akun/UC01-TC04_login-berhasil.png" width="70%"> |
| UC01-TC05, C15-UT02 | <img alt="Kata sandi salah" src="./assets/pengujian/akun/UC01-TC05_password-salah.png" width="70%"> |
| UC01-TC06 | <img alt="Email tidak terdaftar, pesan sama" src="./assets/pengujian/akun/UC01-TC06_email-tidak-terdaftar.png" width="70%"> |
| UC01-TC07, INT-TC38 | <img alt="Sesi bertahan dan cookie HttpOnly" src="./assets/pengujian/akun/UC01-TC07_sesi-bertahan.png" width="70%"> |
| UC01-TC08, INT-TC38 | <img alt="Toast logout" src="./assets/pengujian/akun/UC01-TC08_a_logout.png" width="70%"><br><img alt="Account meminta login setelah logout" src="./assets/pengujian/akun/UC01-TC08_b_account-setelah-logout.png" width="70%"> |
| UC01-TC09 | <img alt="Modal login saat Donate now" src="./assets/pengujian/akun/UC01-TC09_a_donate-minta-login.png" width="70%"><br><img alt="Formulir donasi terbuka setelah login" src="./assets/pengujian/akun/UC01-TC09_b_form-donasi.png" width="70%"> |
| UC01-TC10 | <img alt="Akses admin ditolak" src="./assets/pengujian/akun/UC01-TC10_admin-ditolak.png" width="70%"> |
| INT-TC39, KNF05-TC01 | <img alt="Query akun baru, hash bcrypt, saldo 0" src="./assets/pengujian/akun/INT-TC39_query-akun-nayla.png" width="70%"> |
| INT-TC40 | <img alt="Lima pendaftaran bersamaan" src="./assets/pengujian/akun/INT-TC40_a_daftar-bersamaan.png" width="70%"><br><img alt="COUNT akun = 1" src="./assets/pengujian/akun/INT-TC40_b_count.png" width="70%"> |
| INT-TC41 | <img alt="GET api/topup 200" src="./assets/pengujian/akun/INT-TC41_api-topup-200.png" width="70%"> |
| INT-TC42 | <img alt="Account sebelum sesi kedaluwarsa" src="./assets/pengujian/akun/INT-TC42_a_sebelum-kedaluwarsa.png" width="70%"><br><img alt="Account setelah sesi kedaluwarsa" src="./assets/pengujian/akun/INT-TC42_b_account-setelah-kedaluwarsa.png" width="70%"><br><img alt="status_sesi berakhir" src="./assets/pengujian/akun/INT-TC42_status-sesi.png" width="70%"> |
| INT-TC43 | <img alt="fetch api/verifikasi 403" src="./assets/pengujian/akun/INT-TC43_verifikasi-403.png" width="70%"> |
| INT-TC44 | <img alt="Cookie lama setelah logout 401" src="./assets/pengujian/akun/INT-TC44_curl-401.png" width="70%"> |
| KNF01-TC01 | <img alt="360 px beranda" src="./assets/pengujian/akun/KNF01_360_beranda.png" width="22%"> <img alt="360 px explore" src="./assets/pengujian/akun/KNF01_360_explore.png" width="22%"> <img alt="360 px modal-signup" src="./assets/pengujian/akun/KNF01_360_modal-signup.png" width="22%"> <img alt="360 px project-mgv" src="./assets/pengujian/akun/KNF01_360_project-mgv.png" width="22%"> |
| KNF01-TC02 | <img alt="768 px beranda" src="./assets/pengujian/akun/KNF01_768_beranda.png" width="22%"> <img alt="768 px explore" src="./assets/pengujian/akun/KNF01_768_explore.png" width="22%"> <img alt="768 px modal-signup" src="./assets/pengujian/akun/KNF01_768_modal-signup.png" width="22%"> <img alt="768 px project-mgv" src="./assets/pengujian/akun/KNF01_768_project-mgv.png" width="22%"> |
| KNF01-TC03 | <img alt="1280 px beranda" src="./assets/pengujian/akun/KNF01_1280_beranda.png" width="45%"><br><img alt="1280 px explore" src="./assets/pengujian/akun/KNF01_1280_explore.png" width="45%"><br><img alt="1280 px modal-signup" src="./assets/pengujian/akun/KNF01_1280_modal-signup.png" width="45%"><br><img alt="1280 px project-mgv" src="./assets/pengujian/akun/KNF01_1280_project-mgv.png" width="45%"> |
| KNF05-TC03 | <img alt="Respons login tanpa kata sandi dan hash" src="./assets/pengujian/akun/KNF05-TC03_response-login.png" width="70%"> |

<br>

---

# BAB 5: Traceability

Petakan setiap KF ke KNF, use case, kelas perancangan, file implementasi, dan test case. Tabel traceability berikut akan menjadi sarana verifikasi KF. Setiap KF memiliki minimal satu test case dan dinyatakan terpenuhi apabila **seluruh** test case terkaitnya berkesimpulan `Pass`. KF yang tidak diimplementasikan tetap dicantumkan beserta alasannya.

Tabel 5.1. Matriks Kerunutan KF terhadap Implementasi dan Pengujian

| KF ID | KNF Terkait | Use Case ID | Kelas Terkait | Implementasi File Terkait | Test Case (UC) | Test Case (Unit/Integrasi/KNF) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| KF05 | KNF03 (lingkup aksi) | UC02 | C03 - Campaign; C10 - PembuatProject; C17 - FormCampaignView; C19 - CampaignController | `src/components/aksi/FormAksi.tsx`<br>`src/shared/validasiAksi.ts`<br>`src/server/controllers/CampaignController.ts` | UC02-TC01, UC02-TC05, UC02-TC06 | C03-UT01, C03-UT05–UT07, C10-UT01–UT02, C17-UT01–UT04, C19-UT01–UT03, INT-TC31, KNF03-TC01 |
| KF06 | KNF03 (lingkup aksi) | UC02, UC03, UC04 | C02 - Project; C03 - Campaign; C10 - PembuatProject; C23 - PengajuanView; C26 - VerifikasiController | `src/server/services/AksiService.ts`<br>`src/server/repositories/AksiRepository.ts`<br>`src/server/controllers/AksiController.ts`<br>`src/components/aksi/TombolPengajuan.tsx` | UC02-TC01, UC02-TC04–TC05, UC03-TC01, UC04-TC04 | C03-UT09–UT12, C10-UT01–UT06, C23-UT01–UT02, C26-UT01–UT03, INT-TC33–TC36 |
| KF07 | - | UC02 | C03 - Campaign; C17 - FormCampaignView; C19 - CampaignController | `src/shared/validasiAksi.ts`<br>`src/components/aksi/FormAksi.tsx`<br>`src/components/aksi/apiAksi.ts` | UC02-TC02, UC02-TC03, UC02-TC06 | C03-UT02–UT06, C17-UT02, C19-UT03, INT-TC37 |
| KF08 | KNF03 (lingkup aksi) | UC03 | C02 - Project; C10 - PembuatProject; C20 - FormProjectView; C22 - ProjectController | `src/components/aksi/FormAksi.tsx`<br>`src/shared/validasiAksi.ts`<br>`src/server/controllers/ProjectController.ts` | UC03-TC01, UC03-TC03, UC03-TC05 | C02-UT01–UT08, C20-UT01–UT03, C22-UT01–UT02, INT-TC31, INT-TC34, KNF03-TC02 |
| KF09 | - | UC03 | C02 - Project; C10 - PembuatProject; C22 - ProjectController | `src/server/services/AksiService.ts`<br>`src/server/repositories/AksiRepository.ts`<br>`src/server/controllers/AksiController.ts` | UC03-TC01, UC03-TC03, UC03-TC04 | C02-UT09–UT13, C10-UT01, C10-UT04, C22-UT01–UT04, INT-TC33–TC34 |
| KF10 | - | UC03 | C02 - Project; C20 - FormProjectView; C22 - ProjectController | `src/shared/validasiAksi.ts`<br>`src/server/services/AksiService.ts`<br>`src/components/aksi/FormAksi.tsx` | UC03-TC02, UC03-TC05 | C02-UT03–UT08, C20-UT02, C26-UT02, INT-TC34 |
| KF11 | KNF03 (lingkup aksi) | UC04 | C02 - Project; C03 - Campaign; C11 - AdminSistem; C23–C25 - Views pengajuan; C26 - VerifikasiController | `src/server/controllers/VerifikasiController.ts`<br>`src/server/services/AksiService.ts`<br>`src/server/repositories/AksiRepository.ts`<br>`src/components/aksi/KeputusanPengajuan.tsx` | UC04-TC01–TC04 | C03-UT08, C11-UT01–UT04, C23-UT01–UT02, C24-UT01–UT02, C25-UT01–UT03, C26-UT01–UT11, INT-TC35–TC36, KNF03-TC03 |
| KF12 | - | UC04 | C11 - AdminSistem; C24 - DaftarPengajuanView; C25 - DetailPengajuanView; C26 - VerifikasiController | `src/server/auth/aksesAksi.ts`<br>`src/server/controllers/VerifikasiController.ts`<br>`src/server/services/AksiService.ts`<br>`src/app/admin/page.tsx` | UC04-TC01, UC04-TC05 | C11-UT02, C26-UT08–UT09, INT-TC32–TC33 || KF01 | KNF01, KNF10 | UC01 | C00 - PenggunaUmum<br>C12 - Akun<br>C14 - FormPendaftaranView<br>C15 - FormLoginView<br>C16 - AutentikasiController | `src/models/Akun.ts`<br>`src/server/services/AutentikasiService.ts`<br>`src/server/controllers/AutentikasiController.ts`<br>`src/app/api/auth/daftar/route.ts`<br>`src/components/views/FormPendaftaranView.tsx` | UC01-TC01, UC01-TC02, UC01-TC04 | C12-UT01, C12-UT02, C14-UT01, C16-UT01, C16-UT03, INT-TC38, KNF01-TC01 – KNF01-TC03, KNF10-TC01 |
| KF02 | - | UC01 | C12 - Akun<br>C14 - FormPendaftaranView<br>C16 - AutentikasiController | `src/server/services/AutentikasiService.ts`<br>`src/server/repositories/UserRepository.ts`<br>`src/db/migrations/001_schema.sql` (`uq_akun_email`) | UC01-TC03 | C12-UT03, C14-UT02, C16-UT02, INT-TC40 |
| KF03 | KNF05, KNF10 | UC01 | C12 - Akun<br>C16 - AutentikasiController | `src/server/password.ts`<br>`src/server/repositories/UserRepository.ts`<br>`src/shared/autentikasi.ts` | UC01-TC01 | C12-UT04, C16-UT01, INT-TC39, KNF05-TC01, KNF05-TC03 |
| KF04 | KNF05, KNF10 | UC01 | C12 - Akun<br>C13 - SesiLogin<br>C15 - FormLoginView<br>C16 - AutentikasiController | `src/models/SesiLogin.ts`<br>`src/server/services/AutentikasiService.ts`<br>`src/server/sesi.ts`<br>`src/server/controllers/guard.ts`<br>`src/app/api/auth/masuk/route.ts`<br>`src/components/views/FormLoginView.tsx` | UC01-TC04 – UC01-TC10 | C12-UT05 – C12-UT09, C13-UT01 – C13-UT06, C15-UT01, C15-UT02, C16-UT04 – C16-UT06, INT-TC41 – INT-TC44, KNF05-TC02, KNF10-TC02, KNF10-TC03 |
| KF13 | KNF02, KNF09 | UC05 | C01 - Katalog<br>C05 - PetaWilayah<br>C27 - FormPencarianView<br>C28 - PencarianController<br>C29 - FormPetaWilayahView | `src/shared/katalog.ts`<br>`src/server/controllers/pencarian.controller.ts`<br>`src/server/services/katalog.service.ts`<br>`src/server/repositories/katalog.repository.ts`<br>`src/app/api/katalog/route.ts`<br>`src/app/api/katalog/opsi/route.ts`<br>`src/components/views/ExploreView.tsx`<br>`src/components/views/FormPencarianView.tsx`<br>`src/shared/explore.ts`<br>`src/shared/explorePaging.ts`<br>`src/components/views/FormPetaWilayahView.tsx`<br>`src/components/ui/PetaSebaran.tsx` | UC05-TC02, UC05-TC03, UC05-TC04, UC05-TC07, UC05-TC08 | C01-UT01 – C01-UT17, C05-UT01 – C05-UT15, C27-UT01 – C27-UT07, C28-UT01 – C28-UT04, C29-UT01 – C29-UT08, INT-TC23 – INT-TC28, KNF02-TC01, KNF02-TC02, KNF09-TC01 |
| KF14 | - | UC05 | C01 - Katalog<br>C05 - PetaWilayah<br>C18 - DetailCampaignView<br>C21 - DetailProjectView<br>C28 - PencarianController | `src/server/repositories/katalog.repository.ts`<br>`src/server/services/peta.service.ts`<br>`src/server/repositories/peta.repository.ts`<br>`src/server/controllers/peta.controller.ts`<br>`src/server/services/detail.service.ts`<br>`src/server/repositories/detail.repository.ts`<br>`src/components/detail/MuatDetail.tsx`<br>`src/components/views/DetailProjectView.tsx`<br>`src/components/views/DetailCampaignView.tsx`<br>`src/app/project/[id]/page.tsx`<br>`src/app/campaign/[id]/page.tsx` | UC05-TC01, UC05-TC05, UC05-TC06, UC05-TC08, UC05-TC09 | C01-UT04, C01-UT17, C05-UT03, C05-UT06, C05-UT11, C05-UT14, C18-UT01 – C18-UT04, C21-UT01 – C21-UT08, C28-UT02, INT-TC25, INT-TC27, INT-TC29, INT-TC30 |
| KF15 | KNF04 | UC06 | C04 - Donatur<br>C06 - TransaksiDonasi<br>C30 - FormDonasiView<br>C32 - DonasiController | `src/models/Donatur.ts`<br>`src/models/TransaksiDonasi.ts`<br>`src/server/services/DonasiService.ts`<br>`src/server/repositories/DonasiRepository.ts`<br>`src/server/controllers/DonasiController.ts`<br>`src/components/views/DonasiView/FormDonasiView.tsx` | UC06-TC01, UC06-TC02, UC06-TC03, UC06-TC06, UC06-TC07, UC06-TC08 | C04-UT01 – C04-UT06, C06-UT01 – C06-UT03, C06-UT06, C06-UT08, C30-UT01, C30-UT02, C32-UT01 – C32-UT04, INT-TC01, INT-TC03 – INT-TC05 |
| KF16 | KNF04 | UC06 | C06 - TransaksiDonasi<br>C04 - Donatur | `src/server/services/DonasiService.ts`<br>`src/server/repositories/DonasiRepository.ts` | UC06-TC03, UC06-TC04 | C06-UT07, C06-UT08, C04-UT05, KNF04-TC01 – KNF04-TC03 |
| KF17 | - | UC06 | C06 - TransaksiDonasi<br>C07 - BuktiTransaksi<br>C31 - DetailBuktiTransaksiView | `src/models/TransaksiDonasi.ts`<br>`src/models/BuktiTransaksi.ts`<br>`src/components/views/DonasiView/DetailBuktiTransaksiView.tsx` | UC06-TC01 | C06-UT04, C06-UT06, C06-UT09, C07-UT01 – C07-UT08, C31-UT01 – C31-UT03, INT-TC04 |
| KF18 | KNF04 | UC06 | C06 - TransaksiDonasi<br>C30 - FormDonasiView | `src/server/repositories/DonasiRepository.ts`<br>`src/components/views/DonasiView/logikaDonasi.ts` | UC06-TC05 | C06-UT05, C30-UT03, C30-UT04, INT-TC02, KNF04-TC02 |
| KF19 | - | UC07 | C08 - Volunteer<br>C09 - PendaftaranRelawan<br>C33 - FormPendaftaranRelawanView<br>C34 - RelawanController | `src/shared/relawan.ts`<br>`src/server/services/relawanService.ts`<br>`src/server/controllers/RelawanController.ts`<br>`src/components/views/RelawanView/FormPendaftaranRelawanView.tsx`<br>`src/components/detail/aksi/TombolRelawan.tsx` | UC07-TC01, UC07-TC02, UC07-TC03, UC07-TC04 | C09-UT01 – C09-UT12, C33-UT01 – C33-UT04, C34-UT01 – C34-UT06, INT-TC11, INT-TC12, INT-TC21 |
| KF20 | - | UC07 | C09 - PendaftaranRelawan<br>C34 - RelawanController | `src/server/repositories/pendaftaranRelawanRepository.ts`<br>`src/models/PendaftaranRelawan.ts`<br>`src/server/services/relawanService.ts` | UC07-TC01 | C09-UT07, C09-UT10, C34-UT01, INT-TC11, INT-TC13 |
| KF21 | - | UC08 | C09 - PendaftaranRelawan<br>C34 - RelawanController<br>C35 - FormVolunteerManagementView | `src/server/services/relawanService.ts`<br>`src/server/controllers/RelawanController.ts`<br>`src/components/views/RelawanView/FormVolunteerManagementView.tsx`<br>`src/components/detail/aksi/AksiPemilik.tsx` | UC08-TC01, UC08-TC02, UC08-TC03 | C09-UT13 – C09-UT18, C34-UT07 – C34-UT12, C35-UT01 – C35-UT04, INT-TC13, INT-TC14, INT-TC16 |
| KF22 | KNF08 | UC08 | C34 - RelawanController<br>C36 - DetailStatusPendaftaranView | `src/shared/relawan.ts` (`lokasiKumpulUntuk`)<br>`src/server/services/relawanService.ts` (`pendaftaranSaya`)<br>`src/components/views/RelawanView/DetailStatusPendaftaranView.tsx` | UC08-TC01, UC08-TC02 | C34-UT13 – C34-UT15, INT-TC15, KNF08-TC01 |
| KF23 | - | UC09 | C37 - FormProgresProjectView<br>C38 - ProgresController | `src/shared/progres.ts`<br>`src/server/services/progresService.ts`<br>`src/server/controllers/ProgresController.ts`<br>`src/server/repositories/progresRepository.ts`<br>`src/components/views/ProgresView/FormProgresProjectView.tsx` | UC09-TC01, UC09-TC02 | C37-UT01 – C37-UT03, C38-UT01, C38-UT04 – C38-UT06, C38-UT10, INT-TC17, INT-TC19, INT-TC20, INT-TC21 |
| KF24 | KNF07 | UC09 | C37 - FormProgresProjectView<br>C38 - ProgresController | `src/shared/dokumentasi.ts`<br>`src/server/services/dokumentasiService.ts`<br>`src/server/storage/dokumentasiStorage.ts`<br>`src/app/api/dokumentasi/[idProject]/[nama]/route.ts` | UC09-TC01, UC09-TC04, UC09-TC05 | C37-UT04, C38-UT01 – C38-UT03, C38-UT06, INT-TC22, KNF07-TC01, KNF07-TC02 |
| KF25 | - | UC09 | C38 - ProgresController | `src/server/services/progresService.ts`<br>`src/server/controllers/ProgresController.ts`<br>`src/components/detail/aksi/AksiPemilik.tsx` | UC09-TC02, UC09-TC03 | C38-UT07 – C38-UT09, INT-TC18 |
| KF26 | - | UC06 | C06 - TransaksiDonasi<br>C02 - Project<br>C03 - Campaign | `src/server/services/DonasiService.ts`<br>`src/server/repositories/CampaignProjectRepository.ts` | UC06-TC01 | C06-UT06, INT-TC05 |
| KF27 | - | UC10 | C39 - FormRiwayatView<br>C40 - DetailRiwayatView<br>C41 - RiwayatController<br>C06 - TransaksiDonasi | `src/components/views/RiwayatView/FormRiwayatView.tsx`<br>`src/components/views/RiwayatView/DetailRiwayatView.tsx`<br>`src/server/controllers/RiwayatController.ts`<br>`src/server/services/riwayatService.ts`<br>`src/shared/riwayat.ts` | UC10-TC01 – UC10-TC07 | C06-UT09, C06-UT10, C39-UT01 – C39-UT04, C41-UT01 – C41-UT04, INT-TC07 – INT-TC09 |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Tabel 5.2. Matriks Kerunutan KNF terhadap Pengujian

| ID KNF | Parameter | KF/UC Terkait | Test Case |
| :--- | :--- | :--- | :--- || KNF01 | *Flexibility* (tata letak responsif) | Umum (SKPL merujuk R01, R19); diukur pada modal auth (KF01, KF04 / UC01), Explore (UC05), detail project, dan `/account` | KNF01-TC01, KNF01-TC02, KNF01-TC03 |
| KNF05 | *Security* (bcrypt, TLS ≥ 1.2) | KF03, KF04 / UC01 | KNF05-TC01, KNF05-TC02, KNF05-TC03 |
| KNF10 | *Constraint* (UU PDP) | KF01, KF03, KF04 / UC01; akses data pribadi lintas modul (UC06, UC08) | KNF10-TC01, KNF10-TC02, KNF10-TC03, KNF10-TC04 |
| KNF03 | Interaction capability; tahap UI (batas pada §4.5) | KF05, KF06, KF08, KF11 / UC02–UC04; tidak membuktikan alur literal pemesanan/pembayaran | KNF03-TC01–TC03 |
| KNF02 | *Performance efficiency* (waktu tampil hasil filter) | KF13 / UC05 | KNF02-TC01, KNF02-TC02 |
| KNF04 | Reliability | KF15, KF16, KF18 / UC06 | KNF04-TC01, KNF04-TC02, KNF04-TC03 |
| KNF06 | Reliability | Umum (SKPL merujuk R36, R37, yang isinya tentang relawan dan tidak terkait uptime) | KNF06-TC01, KNF06-TC02 |
| KNF07 | *Performance efficiency* (kapasitas dan format unggah) | KF24 / UC09 | KNF07-TC01, KNF07-TC02 |
| KNF08 | *Performance efficiency* (waktu tampil notifikasi status) | KF22 / UC08 | KNF08-TC01 |
| KNF09 | *Performance efficiency* (beban 1.000 pengguna) | Umum; diukur pada KF13 / UC05 (`GET /api/katalog`), endpoint publik utama halaman Explore yang dapat diakses tanpa login | KNF09-TC01 |
| KNF11 | Maintainability (modularitas) | Umum; penambahan kategori aksi (KF13 / UC05) terhadap modul transaksi donasi (KF15–KF18 / UC06) | KNF11-TC01 |
| *...* | *...* | *...* | *...* |
