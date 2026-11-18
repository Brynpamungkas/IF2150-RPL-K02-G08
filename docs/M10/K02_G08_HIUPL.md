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
| *A* | *Deskripsikan perubahan yang dilakukan dari dokumen sebelumnya pada dokumen ini. Jika tidak terdapat perubahan, harap kosongkan tabel.* |
| *B* |  |
| *C* |  |
| ... |  |

---

# BAB 1: Pendahuluan

## 1.1 Tujuan Penulisan Dokumen
Tuliskan uraian ringkas mengenai isi dokumen, tujuan pembuatan dokumen HIUPL ini, dan siapa saja target pembacanya.

## 1.2 Lingkup Masalah
Tuliskan lingkup masalah, yaitu membangun perangkat lunak *[nama perangkat lunak]*. Jelaskan dengan singkat dan jelas deskripsi aplikasi serta keterkaitannya dengan perangkat lunak atau sistem lain (jika ada). Bagian ini maksimal berisi satu paragraf, dapat diambil dari SKPL/DPPL.

## 1.3 Definisi, Istilah, dan Singkatan
Semua definisi dan singkatan yang digunakan dalam dokumen ini beserta penjelasannya.

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
| *Boundary* | *Kasus uji pada nilai batas masukan, misalnya nilai minimum, maksimum, atau tepat di ambang aturan.* |
| *Coverage* | *Persentase baris/cabang kode yang dieksekusi oleh pengujian.* |
| *...* | *...* |

## 1.4 Aturan Penomoran
Tuliskan aturan penomoran (ID) yang digunakan dalam dokumen ini. Gunakan pola ID yang **sama** dengan yang sudah dipakai pada dokumen-dokumen sebelumnya (SKPL, APL, DPPL), kecuali untuk ID pengujian yang baru diperkenalkan pada dokumen ini.

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
| *...* | *...* | *...* |

## 1.5 Referensi
Cantumkan daftar buku, panduan, atau dokumentasi lain yang dirujuk dalam pembuatan dokumen dan pengembangan P/L, **minimal dokumen SKPL, APL, DPPL, dan Implementasi (Tugas 9)**. Tambahkan dokumentasi *framework*/*library*/*testing tool* atau referensi lain apabila digunakan.

## 1.6 Deskripsi Umum Dokumen (Ikhtisar)
Tuliskan sistematika pembahasan dokumen ini secara ringkas dan runut bab demi bab, dengan maksimal 1 paragraf.

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
| C30 | FormDonasiView | Sedang | Mengoordinasikan formulir donasi; logikanya terbatas pada validasi sisi klien dan pembangkitan *idempotency key* sebelum diteruskan ke server | C30-UT01 s.d. C30-UT04, INT-TC01, INT-TC02 |
| C31 | DetailBuktiTransaksiView | Sedang | Hanya memformat dan menampilkan rincian bukti dari server | C31-UT01 s.d. C31-UT03 |
| C32 | DonasiController | Sedang | Memeriksa login dan bentuk masukan, lalu mendelegasikan aturan bisnis ke `DonasiService` | C32-UT01 s.d. C32-UT04, INT-TC03 |
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

Tabel 4.3.2. Hasil Pengujian Integrasi

| ID Pengujian | ID Antarmuka | Skenario | Prosedur/Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| INT-TC01 | IK-01 | Normal: kirim donasi dari formulir | Login `andi@klimpool.id`, buka donasi project "Sayung Coastal Mangrove Restoration", isi 25.000, tekan "Donate now"; amati tab Network | `POST /api/donasi` berstatus 201 dan modal bukti transaksi tampil | *[isi]* | *Pass/Fail* |
| INT-TC02 | IK-01 | Gagal: koneksi putus lalu kirim ulang | Isi formulir, set DevTools Network ke *Offline*, tekan "Donate now"; kembalikan *Online*, tekan "Try again" | Muncul pesan "The connection dropped…"; setelah *Try again* hanya ada **satu** transaksi baru (memakai *idempotency key* yang sama) | *[isi]* | *Pass/Fail* |
| INT-TC03 | IK-02 | Gagal: galat layanan diteruskan sebagai JSON | Login, kirim `POST /api/donasi` dengan nominal 999.999.999 (melebihi saldo) | Respons 422 `{ ok: false, kode: "SALDO_KURANG", pesan: "Insufficient balance for this donation." }` | *[isi]* | *Pass/Fail* |
| INT-TC04 | IK-03 | Normal: donasi tersimpan di basis data | Lakukan donasi 25.000, lalu jalankan `SELECT * FROM transaksi_donasi WHERE id_transaksi = '<id>'` dan `SELECT saldo FROM donatur WHERE id_donatur = 'u1'` | Baris transaksi ada dengan nominal 25.000 dan status `berhasil`; saldo berkurang 25.000; ada tepat satu baris bukti | *[isi]* | *Pass/Fail* |
| INT-TC05 | IK-04 | Normal: donasi bersamaan dari donatur berbeda | Dua donatur bersaldo 50.000 masing-masing mengirim 2 × 25.000 bersamaan ke project yang sama | Keempatnya `OK`; dana terkumpul project bertambah tepat 100.000; saldo keduanya 0 | Keempatnya `OK`; dana project +100.000; saldo kedua donatur 0 | Pass |
| INT-TC06 | IK-06 | Normal: top-up dalam satu transaksi | Top-up nominal valid untuk donatur uji | Saldo bertambah dan satu catatan top-up tersimpan; nominal tidak valid ditolak tanpa mengubah saldo | *[isi]* | *Pass/Fail* |
| INT-TC07 | IK-05 | Normal: riwayat kronologis | Ambil riwayat pembuat project yang memiliki donasi dan progres | Donasi dan progres miliknya tampil, terbaru lebih dulu; filter jenis hanya mengembalikan jenis tersebut | Donasi dan progres pembuat project tampil, terbaru lebih dulu; filter jenis sesuai | Pass |
| INT-TC08 | IK-05 | Gagal: data milik pengguna lain | Pengguna B membuka rincian transaksi milik pengguna A | Diperlakukan sebagai tidak ditemukan (404), sama seperti ID yang tidak ada | Transaksi milik orang lain diperlakukan sebagai tidak ditemukan | Pass |
| INT-TC09 | IK-05 | Batas: hak lihat progres | Relawan berstatus *pending* dan donatur dengan donasi gagal membuka progres project | Keduanya tidak melihat progres; relawan *accepted* dan donatur berhasil dapat melihatnya | Relawan pending dan donasi gagal tidak melihat progres; relawan accepted dan donatur berhasil dapat melihatnya | Pass |
| INT-TC10 | IK-06 | Batas: top-up bersamaan | Beberapa top-up dikirim bersamaan untuk donatur yang sama | Seluruh nominal terjumlah tanpa kehilangan pembaruan | *[isi]* | *Pass/Fail* |

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
| UC06-TC01 | KF15, KF17, KF26 | Normal | 1. Login.<br>2. Buka Explore dan pilih project melalui peta.<br>3. Tekan tombol donasi.<br>4. Isi nominal.<br>5. Konfirmasi pembayaran. | User: andi@klimpool.id<br>Pass: klimpool123<br>Tujuan: Sayung Coastal Mangrove Restoration<br>Nominal: 25.000 | Formulir menampilkan saldo Rp750.000. Setelah konfirmasi, bukti transaksi tampil (ID transaksi, waktu, status berhasil, nominal Rp25.000). Saldo menjadi Rp725.000, dan dana terkumpul serta persentase capaian project bertambah. | *[isi]* | *Pass/Fail* |
| UC06-TC02 | KF15 | Normal: belum login | 1. Tanpa login, buka detail project.<br>2. Tekan tombol donasi. | - | Pengguna diminta login lebih dulu; formulir donasi baru terbuka setelah login. | *[isi]* | *Pass/Fail* |
| UC06-TC03 | KF15, KF16 | Alternatif 1: Saldo tidak mencukupi | 1. Login.<br>2. Buka formulir donasi.<br>3. Isi nominal melebihi saldo.<br>4. Konfirmasi. | User: andi@klimpool.id<br>Nominal: 800.000 (saldo 750.000) | Donasi tidak diproses; muncul pesan saldo tidak mencukupi; saldo tetap. | *[isi]* | *Pass/Fail* |
| UC06-TC04 | KF16 | Alternatif 1: Kegagalan transaksi (gangguan sistem) | 1. Login dan buka formulir donasi.<br>2. Jalankan `docker stop klimpool-db`.<br>3. Isi nominal dan konfirmasi.<br>4. Jalankan `docker start klimpool-db`, lalu cek saldo dan riwayat. | Nominal: 25.000 | Muncul pesan kegagalan transaksi; setelah DB menyala, saldo dan jumlah transaksi sama seperti sebelum percobaan. | *[isi]* | *Pass/Fail* |
| UC06-TC05 | KF18 | Alternatif 2: Duplikasi permintaan | 1. Lakukan donasi sampai berhasil.<br>2. Di DevTools tab Network, klik kanan permintaan `POST /api/donasi`, lalu pilih *Replay XHR*. | Nominal: 10.000 | Permintaan ulang ditolak dengan pesan "This donation request was already processed. Duplicate donation rejected."; saldo hanya berkurang satu kali. | *[isi]* | *Pass/Fail* |
| UC06-TC06 | KF15 | Alternatif 3: Campaign sudah berakhir | 1. Login.<br>2. Buka campaign yang periodenya sudah lewat.<br>3. Coba berdonasi (tombol donasi atau akses langsung `/donasi/campaign/luwu`). | Campaign: Luwu Flash Flood Response (periode berakhir 30 Sep 2026) | Donasi ditolak; muncul pesan bahwa campaign/project telah berakhir atau ditutup. | *[isi]* | *Pass/Fail* |
| UC06-TC07 | KF15 | Alternatif 4: Nominal 0 | 1. Login dan buka formulir donasi.<br>2. Kosongkan nominal atau isi 0.<br>3. Konfirmasi. | Nominal: 0 | Donasi ditolak; muncul pesan "The donation amount must be more than Rp0…". | *[isi]* | *Pass/Fail* |
| UC06-TC08 | KF15 | Alternatif 4: Nominal negatif | Kolom nominal hanya menerima digit, sehingga uji dilakukan dengan mengirim `POST /api/donasi` langsung. | Nominal: -10.000 | Respons 422 `NOMINAL_TIDAK_VALID`; saldo tetap. | *[isi]* | *Pass/Fail* |

### 4.4.10 Use Case Melihat Riwayat dan Penelusuran

**ID Use Case:** UC10  
**Nama Use Case:** Melihat Riwayat dan Penelusuran

Tabel 4.4.10. Hasil Pengujian Use Case UC10

| ID Pengujian | ID KF | Skenario | Prosedur Pengujian | Masukan | Hasil yang Diharapkan | Hasil Pengujian | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| UC10-TC01 | KF27 | Normal | 1. Login.<br>2. Buka menu Account.<br>3. Pilih tab "Activity history". | User: andi@klimpool.id<br>Pass: klimpool123 | Daftar riwayat donasi dan progres tampil dari yang terbaru, dikelompokkan per bulan. | *[isi]* | *Pass/Fail* |
| UC10-TC02 | KF27 | Normal: detail transaksi | 1. Lanjut dari UC10-TC01.<br>2. Pilih satu entri donasi. | - | Rincian transaksi tampil (ID, jenis, penerima, nominal, waktu, status). | *[isi]* | *Pass/Fail* |
| UC10-TC03 | KF27 | Normal: detail progres | 1. Lanjut dari UC10-TC01.<br>2. Pilih satu entri progres. | - | Rincian progres tampil (nama aksi, waktu, status pelaksanaan, persentase, dana terpakai, catatan, tautan dokumentasi). | *[isi]* | *Pass/Fail* |
| UC10-TC04 | KF27 | Normal: filter jenis | 1. Lanjut dari UC10-TC01.<br>2. Pilih filter "Donations", lalu "Progress". | - | Hanya entri jenis yang dipilih yang tampil. | *[isi]* | *Pass/Fail* |
| UC10-TC05 | KF27 | Alternatif 1: Riwayat belum tersedia | 1. Daftar akun baru lewat Sign up.<br>2. Buka Account, tab "Activity history". | Akun baru (mis. uji.riwayat@klimpool.id) | Muncul pesan "Your history is empty". | *[isi]* | *Pass/Fail* |
| UC10-TC06 | KF27 | Alternatif 1: Kategori kosong | 1. Login dengan akun yang punya riwayat tetapi belum pernah top-up.<br>2. Pilih filter kategori yang kosong. | User: nadia@klimpool.id | Muncul pesan "No activity in this category yet". | *[isi]* | *Pass/Fail* |
| UC10-TC07 | KF27 | Alternatif: Belum login | Buka `/account` tanpa login. | - | Halaman meminta login; data riwayat tidak ditampilkan. | *[isi]* | *Pass/Fail* |

<br>

## 4.5 Pengujian Kebutuhan Non-Fungsional (KNF)

Setiap KNF pada Tabel 3.2 SKPL diuji secara terukur berdasarkan parameter yang telah didefinisikan. Setiap pengujian memuat target terukur, metode dan alat yang sesuai dengan parameter (misalnya Chrome DevTools untuk *response time* dan inspeksi basis data untuk *security*), serta hasil aktual berupa angka atau data. KNF yang belum dipenuhi atau tidak diimplementasikan dicantumkan beserta alasan dan rencana perbaikan.

Tabel 4.5. Hasil Pengujian KNF

| ID Pengujian | ID KNF | Parameter | Target Terukur | Metode dan Alat | Hasil Aktual | Kesimpulan |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| *KNF01-TC01* | *KNF01* | *Reliability* | *Tidak ada data hilang/ganda saat jaringan putus di tengah transaksi* | *Simulasi putus koneksi saat bayar, lalu cek status di DB* | *[Hasil aktual]* | *Pass/Fail* |
| *KNF02-TC01* | *KNF02* | *Security* | *Password tersimpan sebagai hash, bukan plain-text* | *Inspeksi tabel pengguna di DB* | *[...]* | *Pass/Fail* |
| *KNFXX-TC01* | *KNFXX* | *Response time* | *Halaman tampil ≤ 4 detik* | *Chrome DevTools, 5 kali ukur, ambil rata-rata* | *[Rata-rata ... detik, maks ... detik]* | *Pass/Fail* |
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

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
| *...* | *...* | *...* | *...* | *...* | *...* | *...* |

Tabel 5.2. Matriks Kerunutan KNF terhadap Pengujian

| ID KNF | Parameter | KF/UC Terkait | Test Case |
| :--- | :--- | :--- | :--- |
| *KNF01* | *Reliability* | *KF05 / UC03* | *KNF01-TC01* |
| *KNFXX* | *[Parameter]* | *[KFXX / UCXX atau -]* | *[KNFXX-TCYY]* |
| *...* | *...* | *...* | *...* |