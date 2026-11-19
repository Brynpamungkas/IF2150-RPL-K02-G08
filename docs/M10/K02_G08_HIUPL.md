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
| A | Melengkapi Bab 1 berdasarkan SKPL, APL, DPPL, dan laporan Implementasi Tugas 9; menetapkan release `v9.0` sebagai acuan pengujian. |

---

# BAB 1: Pendahuluan

## 1.1 Tujuan Penulisan Dokumen
Dokumen Hasil Implementasi dan Uji Perangkat Lunak (HIUPL) ini menjelaskan implementasi KlimPooL serta hasil pengujiannya terhadap kebutuhan pada SKPL dan rancangan pada DPPL. Dokumen memuat pemetaan kelas dan antarmuka ke file implementasi, strategi dan hasil pengujian unit, integrasi, use case, serta kebutuhan non-fungsional. Matriks kerunutan menghubungkan setiap kebutuhan dengan implementasi dan bukti pengujiannya. Dokumen ditujukan kepada tim pengembang dan asisten mata kuliah IF2150 sebagai dasar pemeriksaan hasil Tugas 10.

## 1.2 Lingkup Masalah
KlimPooL merupakan aplikasi web untuk mengoordinasikan dukungan terhadap aksi iklim di Indonesia melalui campaign penggalangan donasi dan project kegiatan. Cakupannya meliputi autentikasi pengguna, pembuatan dan verifikasi pengajuan oleh admin, penelusuran katalog dan peta, donasi dari saldo internal, pendaftaran dan pengelolaan relawan, pembaruan progres beserta dokumentasi, serta penelusuran riwayat. Data disimpan pada MySQL; top-up merupakan simulasi dan tidak terhubung dengan layanan pembayaran nyata. HIUPL menguji implementasi pada release Tugas 9, yaitu tag `v9.0` (`c44a1e0`), terhadap kebutuhan dan rancangan tersebut.

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
| *Release/tag* | *Penanda versi kode yang menjadi objek pengujian; laporan ini mengacu pada `v9.0`.* |
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
5. Kelompok 08 Kelas 02. [Release Milestone 9 — `v9.0`](https://github.com/Brynpamungkas/IF2150-RPL-K02-G08/releases/tag/v9.0).
6. [Dokumentasi Next.js](https://nextjs.org/docs), [Node.js test runner](https://nodejs.org/docs/latest-v20.x/api/test.html), [Vitest](https://vitest.dev/guide/), dan [MySQL 8.4](https://dev.mysql.com/doc/refman/8.4/en/).

## 1.6 Deskripsi Umum Dokumen (Ikhtisar)
Bab 1 memuat tujuan, lingkup, istilah, aturan penomoran, dan referensi. Bab 2 menjelaskan perangkat lunak serta use case yang dilayani. Bab 3 memetakan lingkungan, modul, antarmuka, dan file pendukung implementasi. Bab 4 menyajikan strategi, kasus uji, hasil aktual, kesimpulan, serta bukti pengujian unit, integrasi, use case, dan kebutuhan non-fungsional. Bab 5 menghubungkan kebutuhan dengan use case, kelas, file implementasi, dan kasus uji melalui matriks kerunutan.

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

Bagian ini diisi dengan informasi tentang elemen P/L yang dikembangkan (*executable files*, *configuration files*, *data files*, dan sebagainya) serta perubahannya terhadap rancangan pada DPPL (jika ada).

## 3.1 Lingkungan Implementasi

Tuliskan *hardware* dan *software* yang digunakan untuk implementasi, mencakup *operating system*, bahasa pemrograman beserta versinya, *framework*/*library*, DBMS, *development tools*, dan *version control*. Lingkungan ini harus konsisten dengan **Subbab 2.1 DPPL**; jelaskan jika ada perubahan. Cantumkan juga *framework* dan alat pengujian yang dipakai.

Tabel 3.1. Lingkungan Implementasi

| Aspek | Keterangan |
| :--- | :--- |
| *Hardware* | *[Spesifikasi perangkat keras]* |
| *Operating System* | *[Nama dan versi OS]* |
| *Bahasa Pemrograman* | *[Bahasa dan versi]* |
| *Framework/Library* | *[Daftar framework/library beserta versi]* |
| *DBMS* | *[Nama dan versi DBMS]* |
| *Development Tools* | *[IDE, version control, tools lain]* |
| *Testing Tools* | *[Framework unit test, alat ukur performa, alat coverage]* |

## 3.2 Implementasi Modul

Daftar modul/kelas yang **TELAH** diimplementasikan. Gunakan nama dan ID kelas yang sama dengan DPPL, dan konsisten dengan Tabel B.5 pada dokumen Implementasi (Tugas 9).

Tabel 3.2. Implementasi Modul

| No | ID Kelas | Nama Modul/Kelas | Nama File Fisik | Nama File Executable |
| :--- | :--- | :--- | :--- | :--- |
| 1 | *[C01]* | *[Nama modul/kelas]* | *[path/ke/file]* | *[Nama file executable, atau - jika tidak ada]* |
| 2 | *[C02]* | *[Nama modul/kelas]* | *[path/ke/file]* | *[...]* |
| ... | *...* | *...* | *...* | *...* |

## 3.3 Implementasi Antarmuka

Daftar antarmuka yang telah diimplementasikan. Gunakan ID dan nama layar yang sama dengan ID dan nama layar pada tugas DPPL.

Tabel 3.3. Implementasi Antarmuka

| No | ID Antarmuka | Nama Antarmuka | Nama File Fisik | Nama File Executable |
| :--- | :--- | :--- | :--- | :--- |
| 1 | *[I-01]* | *[Nama layar]* | *[path/ke/file]* | *[Nama file executable, atau - jika tidak ada]* |
| 2 | *[I-02]* | *[Nama layar]* | *[path/ke/file]* | *[...]* |
| ... | *...* | *...* | *...* | *...* |

## 3.4 File Lain

Daftar file lain yang dibuat selain file kelas dan antarmuka, misalnya file *utility*, *configuration*, *database schema/seed*, *file test*, atau *data*.

Tabel 3.4. File Lain

| No | Nama File | Keterangan |
| :--- | :--- | :--- |
| 1 | *[Nama file]* | *[Fungsi file]* |
| ... | *...* | *...* |

<br>

---

# BAB 4: Hasil Pengujian

Bab ini melaporkan hasil pengujian P/L pada level unit, integrasi, dan sistem. Pengujian dilakukan pada tag release terakhir Tugas 9. Hasil aktual diisi berdasarkan pengamatan saat pengujian. Kesimpulan diisi `Pass` atau `Fail`, dan untuk `Fail` dilengkapi penyebab serta usulan perbaikan.

## 4.1 Strategi dan Kedalaman Pengujian Kelas

Setiap kelas perancangan pada Tabel 4.1 DPPL diklasifikasikan ke dalam tiga tingkat kedalaman pengujian. Tingkat **Mendalam** diberikan pada kelas yang memuat logika bisnis, perhitungan, validasi, aturan status, algoritma, integrasi eksternal, atau keamanan. Tingkat **Sedang** diberikan pada kelas yang hanya mengoordinasikan atau mendelegasikan proses. Tingkat **Tidak perlu** diberikan pada kelas tanpa logika, seperti *entity/DTO* dan kelas konfigurasi, yang teruji secara tidak langsung melalui test case use case. Seluruh kelas wajib dicantumkan beserta alasan penentuan tingkatnya.

Tabel 4.1.1. Identifikasi Tingkat Pengujian Kelas

| ID Kelas | Nama Kelas | Tingkat | Alasan | Test Case Terkait |
| :--- | :--- | :--- | :--- | :--- |
| C04 | Donatur | Mendalam | Memuat pemeriksaan kecukupan saldo dan pengurangan saldo secara atomik dengan `UPDATE ... WHERE saldo >= ?` serta penguncian baris (Algo-103, Algo-104). Salah logika di sini berarti uang hilang atau saldo negatif. | C04-UT01 s.d. C04-UT06 |
| C06 | TransaksiDonasi | Mendalam | Memuat validasi nominal, deteksi duplikasi *idempotency key*, pemrosesan donasi atomik dengan *rollback*, dan perhitungan capaian (Algo-105 s.d. Algo-110; KF15–KF18, KF26) | C06-UT01 s.d. C06-UT10, INT-TC04, INT-TC05 |
| C07 | BuktiTransaksi | Mendalam | Memuat aturan bahwa bukti hanya dibuat untuk transaksi berhasil, tidak boleh ganda, berupa *snapshot*, dan hanya dapat dibuka pemiliknya (Algo-111, Algo-112) | C07-UT01 s.d. C07-UT08 |
| C08 | Volunteer | Tidak perlu | Diimplementasikan sebagai peran `volunteer` pada tabel `pengguna` tanpa logika sendiri (Tugas 9, B.1 No. 8). Operasi `isiFormulir()` dan `kirimPendaftaran()` (Algo-118) diwujudkan oleh C33 dan C34 yang diuji tersendiri | UC07-TC01 |
| C09 | PendaftaranRelawan | Mendalam | Memuat validasi kelengkapan formulir, pencegahan pendaftaran ganda, pemeriksaan kuota, dan transisi status `pending` ke `accepted`/`rejected` yang hanya boleh terjadi sekali (Algo-113 s.d. Algo-117; KF19–KF21) | C09-UT01 s.d. C09-UT18, INT-TC11 s.d. INT-TC16 |
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

<br>

## 4.2 Pengujian Unit Kelas

Pengujian unit dilakukan pada kelas bertingkat Mendalam dan Sedang. Kelas Mendalam diuji pada seluruh operasi public dengan kasus normal, batas, dan negatif, serta mencapai *coverage* minimal 70%. Kelas Sedang diuji minimal dengan satu kasus normal dan satu kasus gagal pada operasi public utama.

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


### 4.2.1 Kelas [Nama Kelas 1]

**ID Kelas:** *[C02]*  
**Nama Kelas:** *[Pesanan]*  
**Tingkat:** *[Mendalam]*

Tabel 4.2.1. Hasil Pengujian Unit Kelas [C02]

| ID Pengujian | Operasi yang Diuji | Jenis Kasus | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *C02-UT01* | *`hitungTotal(): Decimal`* | *Normal* | *Pesanan berisi 2 item: 10.000 x 2 dan 5.000 x 1* | *Total = 25.000* | *[Hasil aktual]* | *Pass/Fail* |
| *C02-UT02* | *`hitungTotal(): Decimal`* | *Batas* | *Pesanan berisi tepat 1 item dengan jumlah 1* | *Total = harga item tersebut* | *[...]* | *Pass/Fail* |
| *C02-UT03* | *`hitungTotal(): Decimal`* | *Negatif* | *Pesanan tanpa item* | *Total = 0 atau melempar kesalahan sesuai rancangan* | *[...]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Khusus kelas **Mendalam**:

Tabel 4.2.1b. Ringkasan Cakupan Kelas [C02]

| Informasi | Keterangan |
| :--- | :--- |
| Daftar operasi public pada DPPL | *[op1(), op2(), ...]* |
| Operasi yang diuji | *[op1(), op2(), ...]* |
| ID Algoritma yang tercakup | *[Algo-001, ...]* |
| Coverage (wajib ≥ 70%) | *[% baris / % cabang, alat dan bukti pada 4.6]* |

### 4.2.2 Kelas [Nama Kelas 2]

### 4.2.3 Kelas [Nama Kelas 3]

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

### 4.2.5 Kelas [Nama Kelas 5]

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

<br>

## 4.4 Pengujian Use Case

Pengujian use case dilakukan pada seluruh skenario normal dan alternatif sesuai Subbab 4.4 SKPL, dengan minimal satu test case untuk setiap skenario. Kolom ID KF menunjukkan KF yang diverifikasi oleh test case tersebut. Data uji memakai akun demo dari `002_seed.sql` (kata sandi `klimpool123`). Andi Rahman (`andi@klimpool.id`) memiliki saldo awal Rp750.000. Jalankan `npm run db:reset` sebelum pengujian agar saldo kembali ke nilai awal.

### 4.4.1 Use Case [Nama Use Case 1]

**ID Use Case:** *[UC01 sesuai SKPL]*  
**Nama Use Case:** *[Nama use case sesuai SKPL]*

Tabel 4.4.1. Hasil Pengujian Use Case [UC01]

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *UC01-TC01* | *KF01* | *Normal* | *1. Buka halaman login.<br>2. Masukkan kredensial.<br>3. Klik tombol "Login".* | *User: rpl@gmail.com<br>Pass: 123456* | *Pengguna diarahkan ke Halaman Dashboard.* | *Pengguna diarahkan ke Halaman Dashboard sesuai hasil yang diharapkan.* | *Pass* |
| *UC01-TC02* | *KF01* | *Alternatif 1: [Nama skenario]* | *[Langkah-langkah pengujian]* | *[Data masukan]* | *[Hasil yang diharapkan]* | *[Hasil aktual]* | *[Pass/Fail. Jika Fail: penjelasan dan solusi]* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* | *...* |

### 4.4.2 Use Case [Nama Use Case 2]

*[Lanjutkan untuk seluruh use case dengan pola yang sama, hingga 4.4.N.]*

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
| *KNF01-TC01* | *KNF01* | *Reliability* | *Tidak ada data hilang/ganda saat jaringan putus di tengah transaksi* | *Simulasi putus koneksi saat bayar, lalu cek status di DB* | *[Hasil aktual]* | *Pass/Fail* |
| *KNF02-TC01* | *KNF02* | *Security* | *Password tersimpan sebagai hash, bukan plain-text* | *Inspeksi tabel pengguna di DB* | *[...]* | *Pass/Fail* |
| *KNFXX-TC01* | *KNFXX* | *Response time* | *Halaman tampil ≤ 4 detik* | *Chrome DevTools, 5 kali ukur, ambil rata-rata* | *[Rata-rata ... detik, maks ... detik]* | *Pass/Fail* |
| KNF04-TC01 | KNF04 | Reliability | Bila satu tahap donasi gagal, seluruh perubahan di-*rollback*: saldo kembali utuh dan tidak ada baris transaksi tertinggal | Uji integrasi `donasi.integrasi.test.ts` (kasus KF16) terhadap MySQL; cek saldo dan jumlah transaksi sebelum/sesudah | Saldo sebelum 100.000 / sesudah 100.000; jumlah transaksi tidak bertambah; uji KF16 lulus (`donasi.integrasi.test.ts`) | Pass |
| KNF04-TC02 | KNF04 | Reliability | Saat jaringan klien putus di tengah transaksi, tidak ada donasi hilang atau ganda | Chrome DevTools: Network *Offline* saat menekan "Donate now", lalu *Online* dan "Try again"; hitung baris `transaksi_donasi` milik donatur | Jumlah transaksi u1: 6 → 7 (bertambah 1); saldo Rp975.000 → Rp950.000 (berkurang satu kali Rp25.000); tidak ada transaksi ganda maupun hilang | Pass |
| KNF04-TC03 | KNF04 | Reliability | Saat koneksi ke basis data terputus, transaksi dibatalkan dan aplikasi tidak *crash* | `docker stop klimpool-db` sebelum konfirmasi, lalu `docker start klimpool-db`; bandingkan saldo dan jumlah transaksi | Tampil "Donation not processed. Something went wrong on the server. Please try again later."; aplikasi tidak *crash*. Saldo u1 Rp890.000 dan jumlah transaksi 10, sama persis sebelum dan sesudah | Pass |
| KNF06-TC01 | KNF06 | Reliability | Uptime ≥ 99% (cek gagal ≤ 1% dari total cek) | Script PowerShell `uptime.ps1`: `Invoke-WebRequest` ke `GET /api/katalog` tiap 10 detik selama 1 jam (360 cek) pada build produksi lokal (`npm run start`) | 360/360 cek sukses = 100% | Pass. Catatan: diuji 1 jam pada lingkungan lokal, belum sebulan pada server produksi karena aplikasi belum di-*deploy*. Pengukuran bulanan direncanakan setelah *deploy*. |
| KNF06-TC02 | KNF06 | Reliability | Layanan pulih otomatis setelah basis data mati | `docker stop klimpool-db` lalu `docker start klimpool-db`; ukur waktu sampai `/api/katalog` kembali 200. Docker Compose memakai `restart: unless-stopped` dan *healthcheck* | `/api/katalog` kembali berstatus 200 dalam 3,6 detik setelah basis data dinyalakan ulang, tanpa perlu me-*restart* aplikasi | Pass |
| KNF07-TC01 | KNF07 | *Performance efficiency* (kapasitas unggah) | Berkas dokumentasi berukuran 50 MB per berkas diproses dan tersimpan; berkas di atas 50 MB ditolak | Unggah PDF ± 49,9 MB lewat formulir progres (UC09), 3 kali; catat status dan durasi `POST /api/projects/mgv/progres` di Chrome DevTools tab Network, lalu cek berkas di `src/uploads/progres/mgv/` (durasi juga tercatat pada log server `npm run dev`). Batas tepat 50 MB juga diuji otomatis pada C38-UT03 | Ketiga unggahan PDF 49,9 MB (52.323.942 byte) berstatus 201 dan tersimpan utuh di `src/uploads/progres/mgv/` dengan ukuran sama. Waktu proses server (log `npm run dev`): 900 ms, 1.186 ms, 592 ms; rata-rata 0,89 detik, maksimum 1,19 detik | Pass |
| KNF07-TC02 | KNF07 | *Performance efficiency* (format berkas) | Kelima format pada SKPL (JPG, PNG, PDF, MP4, ZIP) dapat diunggah | Unggah satu berkas kecil untuk setiap format lewat formulir progres; diperiksa juga otomatis pada C37-UT04 | JPG, PNG, dan PDF diterima. MP4 dan ZIP ditolak dengan pesan "Format berkas tidak didukung. Unggah gambar (JPG, PNG, WebP) atau PDF." karena implementasi hanya menerima gambar dan PDF (`shared/dokumentasi.ts`) | Fail. Perbaikan: tambahkan `video/mp4` dan `application/zip` ke `DOKUMENTASI_TIPE_DIIZINKAN` beserta penyajiannya, atau perbarui KNF07 pada SKPL bila format tersebut memang tidak dibutuhkan |
| KNF08-TC01 | KNF08 | *Performance efficiency* (waktu tampil status) | Status pendaftaran yang baru diputuskan tampil di antarmuka Volunteer ≤ 2 detik setelah halaman status dibuka | Pembuat Project menerima pendaftaran (UC08-TC01); Volunteer membuka tab "Volunteer applications"; ukur waktu `GET /api/relawan/saya` sampai daftar tampil dengan Chrome DevTools tab Performance/Network, 10 kali, ambil rata-rata dan maksimum | 10 pengukuran `GET /api/relawan/saya`: 63, 131, 244, 545, 105, 187, 104, 259, 243, dan 380 ms; rata-rata 0,23 detik, maksimum 0,55 detik. Status "Accepted" beserta titik kumpul langsung tampil setelah halaman dibuka | Pass |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Catatan KNF08: rumusan KNF08 pada SKPL menyebut pesan *chat* dan notifikasi status pesanan, padahal KlimPooL tidak memiliki fitur *chat* maupun pesanan. Notifikasi yang ada pada aplikasi adalah perubahan status pendaftaran relawan (KF22), sehingga KNF08 diuji pada tampilan status tersebut. Status dibaca ketika Volunteer membuka atau memuat ulang halamannya, bukan didorong secara *real-time*.

<br>

## 4.6 Tangkapan Layar dan Bukti Hasil Pengujian

Bukti pengujian dilampirkan sesuai ID Pengujian pada Subbab 4.2 sampai 4.5, berupa tangkapan layar aplikasi, keluaran *test runner*, laporan *coverage* untuk setiap kelas Mendalam, atau hasil alat ukur.

Tabel 4.6. Bukti Hasil Pengujian

| ID Pengujian | Bukti Hasil Pengujian |
| :--- | :--- |
| *C02-UT01 – C02-UT08* | *[Sisipkan hasil keluaran unit test]* |
| *C02 (coverage)* | *[Sisipkan laporan coverage kelas C02]* |
| *INT-TC01* | *[Sisipkan bukti pengujian integrasi]* |
| *UC01-TC01* | *[Sisipkan tangkapan layar UC01-TC01 sesuai prosedur pengujian]* |
| *UC01-TC02* | *[Sisipkan tangkapan layar UC01-TC02 sesuai prosedur pengujian]* |
| *KNF01-TC01* | *[Sisipkan bukti pengukuran parameter KNF01-TC01]* |
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
| KNF06-TC01 | <img src="./assets/pengujian/KNF06-TC01-uptime.png" width="100%"> |
| KNF06-TC02 | <img src="./assets/pengujian/KNF06-TC02-pulih.png" width="100%"> |
| KNF07-TC01 | <img alt="KNF07-TC01 tiga pembaruan dengan PDF 49,9 MB" src="./assets/pengujian/KNF07-TC01-a.png" width="70%"><br><img alt="KNF07-TC01 tiga PDF tersimpan" src="./assets/pengujian/KNF07-TC01-b.png" width="70%"><br><img alt="KNF07-TC01 durasi tiga unggahan" src="./assets/pengujian/KNF07-TC01-c.png" width="70%"> |
| KNF07-TC02 | <img alt="KNF07-TC02 ZIP ditolak" src="./assets/pengujian/UC09-TC04-a.png" width="70%"> |
| KNF08-TC01 | <img alt="KNF08-TC01 sepuluh pengukuran" src="./assets/pengujian/KNF08-TC01.png" width="70%"> |
| *...* | *...* |

<br>

---

# BAB 5: Traceability

Petakan setiap KF ke KNF, use case, kelas perancangan, file implementasi, dan test case. Tabel traceability berikut akan menjadi sarana verifikasi KF. Setiap KF memiliki minimal satu test case dan dinyatakan terpenuhi apabila **seluruh** test case terkaitnya berkesimpulan `Pass`. KF yang tidak diimplementasikan tetap dicantumkan beserta alasannya.

Tabel 5.1. Matriks Kerunutan KF terhadap Implementasi dan Pengujian

| KF ID | KNF Terkait | Use Case ID | Kelas Terkait | Implementasi File Terkait | Test Case (UC) | Test Case (Unit/Integrasi/KNF) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *KF05* | *KNF01* | *UC03* | *C02 - Pesanan* | *`src/...`* | *UC03-TC01* | *C02-UT05, INT-TC04, KNF01-TC01* |
| *KF01* | *-* | *UC01<br>UC02* | *[C01 - Nama kelas]<br>[C02 - Nama kelas]* | *[path/ke/file1]<br>[path/ke/file2]* | *UC01-TC01, UC01-TC02<br>UC02-TC01* | *-* |
| *KF02* | *[KNFXX atau -]* | *[UCXX]* | *[CXX - Nama kelas]* | *[path/ke/file]* | *[UCXX-TCYY]* | *[CXX-UTYY, INT-TCYY, KNFXX-TCYY atau -]* |
| *KFXX* | *-* | *[UCXX atau -]* | *[CXX - Nama kelas atau -]* | *Tidak diimplementasikan: [alasan]* | *-* | *-* |
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
| :--- | :--- | :--- | :--- |
| *KNF01* | *Reliability* | *KF05 / UC03* | *KNF01-TC01* |
| *KNFXX* | *[Parameter]* | *[KFXX / UCXX atau -]* | *[KNFXX-TCYY]* |
| KNF04 | Reliability | KF15, KF16, KF18 / UC06 | KNF04-TC01, KNF04-TC02, KNF04-TC03 |
| KNF06 | Reliability | Umum (SKPL merujuk R36, R37, yang isinya tentang relawan dan tidak terkait uptime) | KNF06-TC01, KNF06-TC02 |
| KNF07 | *Performance efficiency* (kapasitas dan format unggah) | KF24 / UC09 | KNF07-TC01, KNF07-TC02 |
| KNF08 | *Performance efficiency* (waktu tampil notifikasi status) | KF22 / UC08 | KNF08-TC01 |
| *...* | *...* | *...* | *...* |
