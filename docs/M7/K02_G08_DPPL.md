<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 7
<br>
DESKRIPSI PERANCANGAN PERANGKAT LUNAK (DPPL)
</h1>
<br>

## KlimPooL

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

## Daftar Perubahan

| Revisi | Deskripsi |
| :--- | :--- |
| A | Penyusunan awal dokumen DPPL berdasarkan dokumen SKPL dan APL. Kelas analisis pada BAB 5 SKPL dirinci menjadi kelas perancangan dengan stereotipe *boundary*, *control*, dan *entity*, serta dilengkapi *sequence diagram* untuk setiap skenario use case. |
| B |  |
| C |  |

<br>

---

# BAB 1: Pendahuluan

## 1.1 Tujuan Penulisan Dokumen

Dokumen Deskripsi Perancangan Perangkat Lunak (DPPL) ini bertujuan menjabarkan rancangan perangkat lunak KlimPooL, mulai dari rancangan lingkungan implementasi, *style/pattern* arsitektur acuan, komponen penyusun sistem, realisasi setiap use case ke dalam kelas perancangan, sampai diagram kelas keseluruhan dan matriks kerunutannya. Jika dokumen SKPL menjawab pertanyaan "apa yang harus dipenuhi perangkat lunak" dan dokumen APL menjawab "bagaimana perangkat lunak disusun pada tingkat arsitektur", dokumen ini menjawab "bagaimana setiap kebutuhan diwujudkan menjadi kelas, atribut, operasi, dan interaksi antarobjek yang siap diimplementasikan". Dokumen ini ditujukan bagi tim pengembang (Kelompok 08) sebagai acuan langsung pada tahap implementasi dan pengujian, serta bagi asisten (Made Branenda Jordhy) sebagai dasar penilaian kesesuaian rancangan terhadap kebutuhan yang telah disepakati.

## 1.2 Lingkup Masalah

KlimPooL adalah perangkat lunak berbasis web yang dirancang sebagai platform terpusat untuk mengoordinasikan aksi mitigasi perubahan iklim dan penanganan bencana alam. Aplikasi ini menjembatani pemilik project atau penggalang donasi dengan masyarakat luas yang ingin berkontribusi, baik melalui penyaluran dana finansial secara aman, penyediaan pasokan logistik, maupun pendaftaran sebagai relawan (*volunteer*) guna mewujudkan penanggulangan dampak iklim yang transparan dan terstruktur.

## 1.3 Definisi, Istilah, dan Singkatan

Semua definisi dan singkatan yang digunakan dalam dokumen ini beserta penjelasannya.

Tabel 1.3. Definisi Istilah dan Singkatan

| Singkatan, Akronim, atau Istilah | Penjelasan |
| :--- | :--- |
| *P/L* | *Singkatan dari Perangkat Lunak, yaitu aplikasi yang memberikan perintah kepada komputer untuk menjalankan tugas tertentu.* |
| *SKPL* | *Singkatan dari Spesifikasi Kebutuhan Perangkat Lunak, yaitu dokumen yang merangkum kriteria-kriteria yang diperlukan untuk membangun aplikasi menjalankan tugasnya.* |
| *APL* | *Singkatan dari Arsitektur Perangkat Lunak, yaitu dokumen yang menetapkan style/pattern arsitektur, komponen penyusun, dan model arsitektur P/L.* |
| *DPPL* | *Singkatan dari Deskripsi Perancangan Perangkat Lunak, yaitu dokumen yang menjabarkan rancangan rinci P/L sampai ke tingkat kelas, atribut, operasi, dan interaksi antarobjek.* |
| *KF* | *Singkatan dari Kebutuhan Fungsional.* |
| *KNF* | *Singkatan dari Kebutuhan Non-Fungsional.* |
| *UC* | *Singkatan dari Use Case.* |
| *C* | *Singkatan dari Class/Kelas.* |
| *Kelas analisis* | *Kelas yang diidentifikasi pada tahap analisis kebutuhan, yaitu kelas pada BAB 5 dokumen SKPL.* |
| *Kelas perancangan* | *Kelas yang diturunkan dari kelas analisis pada tahap perancangan, lengkap dengan atribut, operasi, visibilitas, dan tipe data yang siap diimplementasikan.* |
| *Boundary* | *Stereotipe kelas perancangan yang menangani interaksi antara aktor dan sistem, yaitu kelas antarmuka.* |
| *Control* | *Stereotipe kelas perancangan yang mengoordinasikan jalannya sebuah use case dan menghubungkan kelas boundary dengan kelas entity.* |
| *Entity* | *Stereotipe kelas perancangan yang menyimpan data dan aturan bisnis yang bertahan lama di dalam sistem.* |
| *Sequence Diagram* | *Diagram interaksi UML yang menunjukkan urutan pesan antarpartisipan berdasarkan waktu.* |
| *TLS* | *Singkatan dari Transport Layer Security, yaitu sebuah protokol keamanan digital yang bertugas menyamarkan dan melindungi data saat dikirimkan melalui internet.* |

## 1.4 Aturan Penomoran

Dokumen ini memakai pola penomoran yang sama dengan dokumen SKPL dan APL. Tidak ada pola ID baru yang diperkenalkan pada dokumen ini.

Tabel 1.4. Aturan Penomoran

| Hal/Bagian | Penomoran | Keterangan |
| :--- | :--- | :--- |
| *Kebutuhan Fungsional* | *KFXX* | *Mengikuti Tabel 3.1 dokumen SKPL.* |
| *Kebutuhan Non-Fungsional* | *KNFXX* | *Mengikuti Tabel 3.2 dokumen SKPL.* |
| *Aktor* | *AXX* | *Mengikuti subbab 4.1 dokumen SKPL.* |
| *Use Case* | *UCXX* | *Mengikuti subbab 4.2 dokumen SKPL.* |
| *Kelas* | *CXX* | *Mengikuti subbab 5.1 dokumen SKPL. Kelas entity mempertahankan ID kelas analisisnya (C00–C13). Kelas boundary dan control yang baru muncul pada tahap perancangan melanjutkan penomoran yang sama mulai dari C14, sehingga tidak ada pola ID baru.* |

## 1.5 Referensi

- Kelompok 08 Kelas 02 IF2150. *Spesifikasi Kebutuhan Perangkat Lunak (SKPL) KlimPooL*. Dokumen `docs/M5/K02_G08_SKPL.md` pada repositori kelompok.
- Kelompok 08 Kelas 02 IF2150. *Arsitektur Perangkat Lunak (APL) KlimPooL*. Dokumen `docs/M6/K02_G08_APL.md` pada repositori kelompok.
- Kelompok 08 Kelas 02 IF2150. *Analisis Solusi dan Pemodelan Use Case KlimPooL*. Dokumen `docs/M1/K02_G08_TB.md` sampai `docs/M4` pada repositori kelompok.
- Materi kuliah IF2150: *Objek, Tanggung Jawab, dan Kolaborasi*; *Stereotipe, Gaya Kendali, dan Lapisan*; serta *Spesifikasi Kebutuhan Perangkat Lunak (SWEBOK v4)*.
- Object Management Group. *Unified Modeling Language (UML) Specification*. Diakses melalui https://www.omg.org/spec/UML/
- Perkakas pemodelan diagram: https://www.drawio.com/ dan https://staruml.io/

## 1.6 Deskripsi Umum Dokumen (Ikhtisar)

Dokumen DPPL KlimPooL ini disusun dalam lima bab. BAB 1 Pendahuluan memuat tujuan penulisan dokumen, lingkup masalah, definisi dan singkatan, aturan penomoran, referensi, serta ikhtisar dokumen. BAB 2 Perancangan Arsitektur memuat rancangan lingkungan implementasi, *style/pattern* arsitektur acuan, identifikasi komponen penyusun sistem, dan model arsitektur dalam bentuk *Logical View* serta *Process View*, seluruhnya mengacu pada dokumen APL. BAB 3 Realisasi Use Case menjabarkan setiap use case pada SKPL menjadi kelas perancangan, *sequence diagram* untuk skenario normal dan alternatif, serta diagram kelas per use case. BAB 4 Diagram Kelas Keseluruhan menyatukan seluruh kelas perancangan beserta atribut dan operasinya ke dalam satu diagram dan satu tabel. BAB 5 Matriks Kerunutan memetakan setiap kelas perancangan terhadap use case yang direalisasikannya, sehingga rancangan pada dokumen ini dapat ditelusuri balik sampai ke kebutuhan pada dokumen SKPL.

<br>

---

# BAB 2: Perancangan Arsitektur

## 2.1 Rancangan Lingkungan Implementasi

Lingkungan implementasi KlimPooL ditetapkan mengikuti Tabel 1.2 *Spesifikasi Implementasi* pada dokumen APL, dengan tambahan rincian bahasa pemrograman, *development tools*, dan *filing system* yang diputuskan pada tahap perancangan ini.

Tabel 2.1. Rancangan Lingkungan Implementasi

| Aspek | Rancangan |
| :--- | :--- |
| *Operating System* server | Lingkungan *serverless* berbasis Linux yang dikelola Vercel, dengan *runtime* Node.js 22 LTS dan region Singapura. |
| *Operating System* client | Tidak dibatasi. P/L dapat diakses dari Windows, macOS, Linux, Android, maupun iOS selama tersedia peramban modern (Chrome, Firefox, Edge, atau Safari versi terkini). |
| DBMS | MySQL dengan *storage engine* InnoDB, dipilih karena mendukung transaksi ACID yang dibutuhkan pemrosesan donasi (KF15–KF18). |
| Bahasa pemrograman | TypeScript pada seluruh lapisan aplikasi Next.js, mencakup komponen React pada lapisan presentasi dan *route handler* pada lapisan API. SQL digunakan untuk operasi basis data pada lapisan akses data. |
| *Framework* dan pustaka | Next.js sebagai kerangka kerja *full-stack* (frontend dan API dalam satu proyek), React sebagai pustaka antarmuka, dan Tailwind CSS sebagai kerangka kerja gaya tampilan. |
| *Development tools* | Visual Studio Code sebagai editor kode, Git dan GitHub untuk kendali versi serta kolaborasi, npm sebagai pengelola paket, dan draw.io untuk pemodelan diagram UML. |
| *Filing system* | Data terstruktur (akun, campaign, project, saldo, transaksi, pendaftaran relawan, dan progres) disimpan pada MySQL. Berkas dokumentasi progres yang diunggah Pembuat Project disimpan pada layanan penyimpanan objek, sedangkan basis data hanya menyimpan tautan dan metadatanya agar ukuran basis data tetap terkendali. |
| Jaringan dan protokol | HTTPS dengan TLS 1.2 atau lebih tinggi menggunakan sertifikat otomatis dari Vercel; HTTP dialihkan ke HTTPS. Pertukaran data antara peramban dan server memakai API REST berformat JSON. |

## 2.2 Style/Pattern Arsitektur Acuan

KlimPooL memakai kombinasi **Client-Server Architecture** dan **Layered Architecture**, sesuai ketetapan BAB 1 dokumen APL.

*Client-Server Architecture* menjelaskan komunikasi antara peramban pengguna dan aplikasi web yang berjalan di Vercel. Peramban menjalankan antarmuka KlimPooL yang dibangun dengan Next.js (React) dan Tailwind CSS, lalu mengirim permintaan ke API REST pada aplikasi Next.js. Aplikasi *serverless* memproses permintaan tersebut, mengakses MySQL, dan mengirim respons kembali ke peramban. Pola ini dipilih karena KlimPooL diakses oleh Pembuat Project, Donatur, Volunteer, dan Admin Sistem melalui peramban tanpa pemasangan aplikasi khusus, dan karena HTTPS/TLS serta JSON yang menyertainya memenuhi batasan komunikasi pada SKPL.

*Layered Architecture* menjelaskan pembagian tanggung jawab di dalam aplikasi Next.js menjadi empat lapisan, yaitu lapisan presentasi yang menampilkan antarmuka, lapisan API/aplikasi yang menerima permintaan JSON dan mengoordinasikan use case, lapisan domain/bisnis yang menerapkan aturan dan validasi inti, serta lapisan akses data yang menjalankan operasi baca/tulis ke MySQL. Pola ini dipilih karena KlimPooL mencakup alur autentikasi, verifikasi campaign/project, pencarian, donasi, pendaftaran relawan, pembaruan progres, dan riwayat yang aturan bisnis dan datanya saling terkait. Pemisahan lapisan menjaga modularitas (KNF11), memungkinkan aturan transaksi donasi dijalankan terpisah dari antarmuka, dan menjaga agar aturan akses Admin Sistem serta validasi pengajuan tidak bergantung langsung pada tampilan. Pemisahan ini bersifat logis dalam satu proyek *full-stack*, bukan berarti setiap lapisan dideploy sebagai server terpisah.

<p align="center">
<img alt="Arsitektur Client-Server dan Layered KlimPooL" src="./assets/diagram/Diagram%201.png" width="100%">
</p>
<p align="center">
<i>Gambar 1. Client-Server dan lapisan internal KlimPooL</i>
</p>

Gambar 1 menunjukkan peramban sebagai *client*, aplikasi Next.js di Vercel sebagai *server*, dan MySQL sebagai penyimpanan data. Operasi basis data memakai koneksi/driver MySQL, sedangkan JSON dipakai pada API antara peramban dan server, bukan sebagai pengganti akses basis data.

## 2.3 Identifikasi Komponen / Modul / Subsistem

Komponen penyusun KlimPooL diambil dari Tabel 2.1 dokumen APL dan dikelompokkan mengikuti lapisan pada *Layered Architecture*. Kolom **Jenis** menyatakan peran komponen di dalam pola tersebut, yaitu *View* untuk lapisan presentasi, *Controller* untuk lapisan API/aplikasi, *Service* untuk lapisan domain/bisnis, *Repository* untuk lapisan akses data, serta *Pendukung* untuk komponen bantu yang dipakai bersama. Satu komponen dapat mewadahi lebih dari satu kelas pada diagram kelas, sehingga komponen tidak sama dengan kelas.

Tabel 2.3. Identifikasi Komponen/Modul/Subsistem

| Nama Komponen/Modul/Subsistem | Jenis | Penjelasan |
| :--- | :--- | :--- |
| `LoginView` | *View* | Menampilkan formulir pendaftaran dan login serta meneruskan data autentikasi pengguna ke komponen aplikasi. |
| `CampaignProjectView` | *View* | Menampilkan informasi campaign dan project serta menyediakan antarmuka untuk membuat dan mengelola pengajuan, serta untuk peninjauan dan verifikasi oleh Admin Sistem. |
| `KatalogPetaView` | *View* | Menampilkan kegiatan pada katalog dan peta interaktif serta menerima interaksi pengguna untuk menelusuri kegiatan. |
| `DonasiView` | *View* | Menampilkan informasi saldo dan formulir donasi serta meneruskan permintaan donasi pengguna. |
| `RelawanView` | *View* | Menampilkan informasi project dan formulir pendaftaran relawan. |
| `ProgresView` | *View* | Menampilkan progres kegiatan dan menyediakan antarmuka untuk memperbarui progres. |
| `RiwayatView` | *View* | Menampilkan riwayat transaksi dan progres pengguna. |
| `AutentikasiController` | *Controller* | Memproses permintaan pendaftaran dan autentikasi pengguna melalui API. |
| `CampaignProjectController` | *Controller* | Memproses permintaan pembuatan, pengelolaan, dan pengajuan campaign/project, serta peninjauan dan verifikasi (diterima/ditolak) oleh Admin Sistem. |
| `PencarianController` | *Controller* | Memproses permintaan pencarian dan penelusuran campaign/project. |
| `DonasiController` | *Controller* | Memproses permintaan donasi dan mengoordinasikan proses transaksi donasi. |
| `RelawanController` | *Controller* | Memproses pendaftaran dan pengelolaan relawan pada project. |
| `ProgresController` | *Controller* | Memproses pembaruan dan pengambilan data progres kegiatan. |
| `RiwayatController` | *Controller* | Memproses permintaan data riwayat transaksi dan progres. |
| `AutentikasiService` | *Service* | Mewadahi PenggunaUmum (C00), Akun (C12), dan SesiLogin (C13). Memvalidasi input dan ketersediaan email, memverifikasi kredensial, mengelola sesi login, dan menerapkan hak akses berdasarkan peran. |
| `CampaignProjectService` | *Service* | Mewadahi PembuatProject (C10), Campaign (C03), Project (C02), dan AdminSistem (C11). Memvalidasi data, target, periode, dan kebutuhan, serta mengelola status publikasi dan verifikasi yang hanya dapat dilakukan Admin Sistem. |
| `PencarianService` | *Service* | Mewadahi Katalog (C01) dan PetaWilayah (C05). Memproses kata kunci dan filter, serta hanya mengembalikan campaign/project berstatus dipublikasikan. |
| `DonasiService` | *Service* | Mewadahi Donatur (C04), TransaksiDonasi (C06), dan BuktiTransaksi (C07). Memeriksa kelayakan donasi, mencegah transaksi berulang, memproses donasi secara atomik, memperbarui dana terkumpul, dan menghasilkan bukti transaksi. |
| `RelawanService` | *Service* | Mewadahi Volunteer (C08) dan PendaftaranRelawan (C09). Menerapkan aturan pendaftaran relawan dan memperbarui status keputusan Pembuat Project. |
| `ProgresService` | *Service* | Menangani bagian progres pada Project (C02) dan PembuatProject (C10). Memvalidasi hak akses pembaruan, menyimpan milestone dan dokumentasi, serta mencatat timestamp. |
| `RiwayatService` | *Service* | Menyusun riwayat TransaksiDonasi (C06) dan progres Project (C02) milik PenggunaUmum (C00) secara kronologis. |
| `UserRepository` | *Repository* | Operasi baca/tulis data pengguna, akun, dan sesi (C00, C08, C10, C11, C12, C13) ke MySQL. |
| `CampaignProjectRepository` | *Repository* | Operasi baca/tulis data Campaign (C03) dan Project (C02), termasuk status verifikasi, alasan penolakan, dan dana terkumpul, ke MySQL. |
| `DonasiRepository` | *Repository* | Operasi baca/tulis saldo Donatur (C04), TransaksiDonasi (C06), dan BuktiTransaksi (C07) ke MySQL dalam transaksi ACID. |
| `RelawanRepository` | *Repository* | Operasi baca/tulis data PendaftaranRelawan (C09) beserta statusnya ke MySQL. |
| `ProgresRepository` | *Repository* | Operasi baca/tulis milestone, status pelaksanaan, dokumentasi, dan timestamp progres Project (C02) ke MySQL. |
| `DatabaseConnection` | *Pendukung* | Mengelola koneksi/driver MySQL dan batas transaksi yang dipakai bersama seluruh repository. |

## 2.4 Model Arsitektur Perangkat Lunak

Model arsitektur KlimPooL disajikan dalam dua *view*, yaitu *Logical View* dan *Process View*, mengikuti BAB 3 dokumen APL. *Logical View* memperlihatkan komponen apa saja yang ada dan siapa memanggil siapa, sedangkan *Process View* memperlihatkan urutan pemanggilan dan titik sinkronisasi ketika komponen tersebut dijalankan. Seluruh partisipan pada kedua *view* memakai nama komponen yang sama persis dengan Tabel 2.3.

### 2.4.1 View Logical

*Logical View* mendeskripsikan abstraksi utama perangkat lunak beserta hubungan antarabstraksi tersebut dalam mendukung kebutuhan fungsional. *View* ini dipilih karena KlimPooL memiliki tujuh alur layanan yang berdiri sendiri, yaitu autentikasi, pengelolaan campaign dan project, pencarian, donasi, relawan, progres, serta riwayat, yang ketujuhnya memakai pembagian tanggung jawab yang sama. Pemetaan komponen ke dalam lapisan menjadi cara paling langsung untuk memperlihatkan keseluruhan sistem dalam satu gambar tanpa menonjolkan salah satu use case. *View* ini juga memperlihatkan *Layered Architecture* secara eksplisit melalui pengelompokan komponen ke dalam empat lapisan, sekaligus memperlihatkan *Client-Server* melalui batas antara kotak *Client* dan *Server*.

<p align="center">
<img alt="Logical View KlimPooL" src="./assets/diagram/Logical%20View.png" width="100%">
</p>
<p align="center">
<i>Gambar 2. Logical View KlimPooL</i>
</p>

Lapisan presentasi berada di dalam kotak *Client* karena dijalankan pada peramban pengguna, sedangkan tiga lapisan lainnya berada di dalam kotak *Server* karena dijalankan pada aplikasi Next.js di Vercel. MySQL digambarkan dengan garis putus-putus karena merupakan basis data pada lingkungan implementasi, bukan komponen perangkat lunak pada Tabel 2.3. Tidak terdapat relasi dari lapisan bawah ke lapisan di atasnya maupun relasi yang melompati lapisan, sesuai ketentuan *Layered Architecture*.

Tabel 2.4. Makna Label Relasi pada Logical View

| Label relasi | Makna |
| :--- | :--- |
| memanggil API | Komponen *View* mengirim permintaan ke komponen *Controller* melalui API REST berformat JSON di atas HTTPS dengan TLS 1.2 atau lebih tinggi. |
| meminta layanan | Komponen *Controller* meneruskan permintaan ke komponen *Service* yang menerapkan aturan dan validasi inti. |
| membaca/menulis data | Komponen *Service* memakai komponen *Repository* untuk membaca maupun menulis data yang dibutuhkannya. |
| memakai koneksi | Setiap *repository* memakai `DatabaseConnection` untuk memperoleh koneksi dan batas transaksi yang sama. |
| query/simpan | `DatabaseConnection` menjalankan perintah baca/tulis ke MySQL. |

### 2.4.2 View Process

*Process View* mendeskripsikan proses pada saat sistem berjalan, termasuk komunikasi, konkurensi, dan koordinasi antarproses. *View* ini dipilih karena KlimPooL memiliki alur yang urutannya menentukan kebenaran data. Pada transaksi donasi, pemeriksaan nominal, status campaign, dan transaksi ganda harus selesai sebelum saldo diubah, dan perubahan saldo, dana campaign, serta transaksi harus berhasil bersama atau dibatalkan seluruhnya (KF15–KF18). Urutan seperti ini tidak terlihat pada *Logical View* yang bersifat struktural. Selain itu, KlimPooL berjalan pada lingkungan *serverless* dengan *autoscaling* dan harus melayani 1.000 pengguna aktif secara simultan (KNF09), sehingga perlu terlihat di titik mana pemeriksaan dan transaksi atomik mengoordinasikan permintaan yang berjalan bersamaan. Alur donasi (UC06) dipilih sebagai representasi karena merupakan alur paling kritis pada SKPL.

<p align="center">
<img alt="Process View KlimPooL" src="./assets/diagram/Process%20View.png" width="100%">
</p>
<p align="center">
<i>Gambar 3. Process View KlimPooL</i>
</p>

Pada Gambar 3, `DonasiController` memastikan Donatur sudah login melalui `AutentikasiService`, lalu meneruskan permintaan ke `DonasiService`. `DonasiService` memvalidasi nominal, memeriksa status campaign/project, dan memeriksa ID transaksi untuk mencegah transaksi ganda. Bila seluruh pemeriksaan lolos dan saldo mencukupi, pengurangan saldo, penambahan dana campaign/project, dan pembuatan transaksi dijalankan dalam satu *database transaction* yang atomik, sehingga tidak mungkin saldo berkurang tetapi dana campaign tidak bertambah. Kegagalan pada titik mana pun membatalkan seluruh perubahan. Bukti transaksi kemudian dibuat dan ditampilkan kepada Donatur.

<br>

---


# BAB 3: Realisasi Use Case

## 3.1 Use Case Melakukan Pendaftaran dan Autentikasi

**ID Use Case:** UC01  
**Nama Use Case:** Melakukan Pendaftaran dan Autentikasi

### 3.1.1 Identifikasi Kelas

Realisasi UC01 memisahkan antarmuka pendaftaran dan antarmuka login menjadi dua kelas *boundary*, karena keduanya ditampilkan pada halaman yang berbeda dan memiliki masukan yang berbeda. Keduanya berbicara kepada satu kelas *control*, yaitu `AutentikasiController`, yang mengoordinasikan seluruh alur use case ini. Kelas analisis PenggunaUmum (C00) pada SKPL berperan sebagai aktor sekaligus pemilik akun, sehingga pada tahap perancangan perannya dipecah: tindakan antarmuka dipindahkan ke kelas *boundary*, sedangkan data pengguna tetap berada pada kelas *entity* `PenggunaUmum`. Aturan validasi kelengkapan input, ketersediaan email, dan kebenaran kredensial tetap melekat pada `Akun` sesuai deskripsi C12, sedangkan pembuatan dan pemeriksaan sesi tetap melekat pada `SesiLogin` sesuai deskripsi C13.

Tabel 3.1. Identifikasi Kelas Use Case UC01

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | FormPendaftaranView | PenggunaUmum (C00) |
| 2 | FormLoginView | PenggunaUmum (C00) |
| 3 | AutentikasiController | PenggunaUmum (C00) |
| 4 | PenggunaUmum | PenggunaUmum (C00) |
| 5 | Akun | Akun (C12) |
| 6 | SesiLogin | SesiLogin (C13) |

### 3.1.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC01 - Skenario Normal" src="./assets/diagram/sequence-uc01-normal.png" width="100%">
</p>
<p align="center">
<i>Gambar 3.1.1. Sequence Diagram UC01 - Skenario Normal</i>
</p>

Pengguna Umum membuka formulir pendaftaran melalui `FormPendaftaranView`, mengisi nama, email, dan password, lalu mengirimkannya. `AutentikasiController` meminta `PenggunaUmum` membuat objek `Akun`, kemudian memanggil `validasiKelengkapanInput()`, `cekKetersediaanEmail()`, dan `simpanAkun()` secara berurutan. Setelah akun tersimpan, Pengguna Umum memasukkan kredensial pada `FormLoginView`. `AutentikasiController` memverifikasi kredensial melalui `validasiKredensial()` pada `Akun`, lalu membuat `SesiLogin` dan mengarahkan pengguna ke halaman utama.

- **Skenario Alternatif 1: Email Sudah Terdaftar**

<p align="center">
<img alt="Sequence Diagram UC01 - Email Sudah Terdaftar" src="./assets/diagram/sequence-uc01-alt1.png" width="100%">
</p>
<p align="center">
<i>Gambar 3.1.2. Sequence Diagram UC01 - Email Sudah Terdaftar</i>
</p>

Alur berjalan sama dengan skenario normal sampai pemeriksaan ketersediaan email. `cekKetersediaanEmail()` mengembalikan `false`, sehingga `simpanAkun()` tidak dipanggil dan akun baru tidak tersimpan. `FormPendaftaranView` mengambil pesan kesalahan melalui `getPesanKesalahan()` dan menampilkannya, lalu pengguna dapat mengirim ulang formulir dengan email lain.

- **Skenario Alternatif 2: Kredensial Login Tidak Valid**

<p align="center">
<img alt="Sequence Diagram UC01 - Kredensial Login Tidak Valid" src="./assets/diagram/sequence-uc01-alt2.png" width="100%">
</p>
<p align="center">
<i>Gambar 3.1.3. Sequence Diagram UC01 - Kredensial Login Tidak Valid</i>
</p>

`validasiKredensial()` pada `Akun` mengembalikan `false`, sehingga `buatSesi()` tidak dipanggil dan pengguna tidak memperoleh sesi login. `FormLoginView` menampilkan pesan kesalahan dan pengguna tetap berada pada halaman login untuk memasukkan kembali kredensialnya.

### 3.1.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC01" src="./assets/diagram/class-uc01.png" width="70%">
</p>
<p align="center">
<i>Gambar 3.1.4. Diagram Kelas Melakukan Pendaftaran dan Autentikasi (UC01)</i>
</p>

`FormPendaftaranView` dan `FormLoginView` masing-masing berasosiasi satu-ke-satu dengan `AutentikasiController`. `AutentikasiController` memiliki dependensi «use» terhadap ketiga kelas *entity* karena hanya memakai objeknya selama use case berlangsung tanpa menyimpannya. `PenggunaUmum` berelasi komposisi dengan `Akun`, karena akun tidak dapat ada tanpa pengguna pemiliknya dan ikut terhapus ketika pengguna dihapus. Satu `Akun` dapat menghasilkan nol sampai banyak `SesiLogin` sepanjang masa hidupnya, yaitu satu sesi untuk setiap kali pengguna berhasil login.

---

## 3.2 Use Case Membuat Campaign Penggalangan Donasi

**ID Use Case:** UC02  
**Nama Use Case:** Membuat Campaign Penggalangan Donasi

### 3.2.1 Identifikasi Kelas

Realisasi UC02 melibatkan satu kelas pada lapisan presentasi, satu pada lapisan API, dua pada lapisan domain/bisnis, satu entitas domain, serta kelas akses data. Kelas aktor pada tahap analisis (PembuatProject) dipetakan ke `CampaignProjectView` dan `CampaignProjectController` sebagai antarmuka dan pengendali permintaan.

Tabel 3.2. Identifikasi Kelas Use Case UC02

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | CampaignProjectView | PembuatProject (C10) |
| 2 | CampaignProjectController | PembuatProject (C10) |
| 3 | AutentikasiService | SesiLogin (C13) |
| 4 | CampaignProjectService | PembuatProject (C10), Campaign (C03) |
| 5 | Campaign | Campaign (C03) |
| 6 | CampaignProjectRepository | Campaign (C03) |
| 7 | DatabaseConnection | - (kelas baru pada tahap perancangan) |

### 3.2.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC02 - Skenario Normal" src="./assets/diagram/sequence-uc02-normal.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.2.1. Sequence Diagram UC02 - Skenario Normal</i>
</p>

- **Skenario Alternatif 1: Data Campaign Tidak Lengkap**

<p align="center">
<img alt="Sequence Diagram UC02 - Data Campaign Tidak Lengkap" src="./assets/diagram/sequence-uc02-alt1.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.2.2. Sequence Diagram UC02 - Data Campaign Tidak Lengkap</i>
</p>

- **Skenario Alternatif 2: Target atau Periode Campaign Tidak Valid**

<p align="center">
<img alt="Sequence Diagram UC02 - Target atau Periode Campaign Tidak Valid" src="./assets/diagram/sequence-uc02-alt2.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.2.3. Sequence Diagram UC02 - Target atau Periode Campaign Tidak Valid</i>
</p>

### 3.2.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC02" src="./assets/diagram/class-uc02.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.2.4. Diagram Kelas Membuat Campaign Penggalangan Donasi (UC02)</i>
</p>

---

## 3.3 Use Case Membuat Project Aksi Iklim

**ID Use Case:** UC03  
**Nama Use Case:** Membuat Project Aksi Iklim

### 3.3.1 Identifikasi Kelas

Realisasi UC03 memakai pembagian lapisan yang sama dengan UC02. Perbedaannya, entitas domain yang dikelola adalah `Project` dan terdapat validasi kebutuhan project (dana, logistik, dan kriteria volunteer) yang dijalankan sebelum formulir dikirim.

Tabel 3.3. Identifikasi Kelas Use Case UC03

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | CampaignProjectView | PembuatProject (C10) |
| 2 | CampaignProjectController | PembuatProject (C10) |
| 3 | AutentikasiService | SesiLogin (C13) |
| 4 | CampaignProjectService | PembuatProject (C10), Project (C02) |
| 5 | Project | Project (C02) |
| 6 | CampaignProjectRepository | Project (C02) |
| 7 | DatabaseConnection | - (kelas baru pada tahap perancangan) |

### 3.3.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC03 - Skenario Normal" src="./assets/diagram/sequence-uc03-normal.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.3.1. Sequence Diagram UC03 - Skenario Normal</i>
</p>

- **Skenario Alternatif 1: Informasi Project Tidak Lengkap**

<p align="center">
<img alt="Sequence Diagram UC03 - Informasi Project Tidak Lengkap" src="./assets/diagram/sequence-uc03-alt1.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.3.2. Sequence Diagram UC03 - Informasi Project Tidak Lengkap</i>
</p>

- **Skenario Alternatif 2: Data Kebutuhan Project Tidak Valid**

<p align="center">
<img alt="Sequence Diagram UC03 - Data Kebutuhan Project Tidak Valid" src="./assets/diagram/sequence-uc03-alt2.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.3.3. Sequence Diagram UC03 - Data Kebutuhan Project Tidak Valid</i>
</p>

### 3.3.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC03" src="./assets/diagram/class-uc03.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.3.4. Diagram Kelas Membuat Project Aksi Iklim (UC03)</i>
</p>

---

## 3.4 Use Case Meninjau dan Memverifikasi Project

**ID Use Case:** UC04  
**Nama Use Case:** Meninjau dan Memverifikasi Project

### 3.4.1 Identifikasi Kelas

Realisasi UC04 melibatkan dua aktor, yaitu Pembuat Project yang mengajukan verifikasi dan Admin Sistem yang meninjau pengajuan. Kelas aktor pada tahap analisis (PembuatProject dan AdminSistem) dipetakan ke `CampaignProjectView`, `CampaignProjectController`, dan `CampaignProjectService`. Pembatasan bahwa verifikasi hanya dapat dilakukan Admin Sistem ditangani oleh `AutentikasiService` melalui pemeriksaan hak akses berdasarkan peran.

Tabel 3.4. Identifikasi Kelas Use Case UC04

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | CampaignProjectView | PembuatProject (C10), AdminSistem (C11) |
| 2 | CampaignProjectController | PembuatProject (C10), AdminSistem (C11) |
| 3 | AutentikasiService | SesiLogin (C13), AdminSistem (C11) |
| 4 | CampaignProjectService | PembuatProject (C10), AdminSistem (C11) |
| 5 | Campaign | Campaign (C03) |
| 6 | Project | Project (C02) |
| 7 | CampaignProjectRepository | Campaign (C03), Project (C02) |
| 8 | DatabaseConnection | - (kelas baru pada tahap perancangan) |

### 3.4.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC04 - Skenario Normal" src="./assets/diagram/sequence-uc04-normal.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.4.1. Sequence Diagram UC04 - Skenario Normal</i>
</p>

- **Skenario Alternatif 1: Campaign atau Project Ditolak**

<p align="center">
<img alt="Sequence Diagram UC04 - Campaign atau Project Ditolak" src="./assets/diagram/sequence-uc04-alt1.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.4.2. Sequence Diagram UC04 - Campaign atau Project Ditolak</i>
</p>

### 3.4.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC04" src="./assets/diagram/class-uc04.png" width="50%">
</p>
<p align="center">
<i>Gambar 3.4.3. Diagram Kelas Meninjau dan Memverifikasi Project (UC04)</i>
</p>

---

## 3.5 Use Case Mencari dan Menelusuri Project

**ID Use Case:** UC05  
**Nama Use Case:** Mencari dan Menelusuri Project

### 3.5.1 Identifikasi Kelas

*[Bryan: satu paragraf pengantar, lalu isi tabel. Nama kelas perancangan memakai pola yang sama dengan UC01-UC04, yaitu Form…View / Detail…View untuk boundary, …Controller untuk control, dan nama kelas analisis apa adanya untuk entity.]*

Tabel 3.5. Identifikasi Kelas Use Case UC05

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *[Nama kelas perancangan]* | *[Nama kelas analisis pada SKPL]* |
| ... | *...* | *...* |

### 3.5.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC05 - Skenario Normal" src="./assets/diagram/sequence-uc05-normal.png" width="100%">
</p>
<p align="center">
<i>Gambar 3.5.1. Sequence Diagram UC05 - Skenario Normal</i>
</p>

- **Skenario Alternatif 1: Project Tidak Ditemukan**

<p align="center">
<img alt="Sequence Diagram UC05 - Project Tidak Ditemukan" src="./assets/diagram/sequence-uc05-alt1.png" width="100%">
</p>
<p align="center">
<i>Gambar 3.5.2. Sequence Diagram UC05 - Project Tidak Ditemukan</i>
</p>

### 3.5.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC05" src="./assets/diagram/class-uc05.png" width="70%">
</p>
<p align="center">
<i>Gambar 3.5.3. Diagram Kelas Mencari dan Menelusuri Project (UC05)</i>
</p>

---

## 3.6 Use Case Melakukan Transaksi Donasi

**ID Use Case:** UC06  
**Nama Use Case:** Melakukan Transaksi Donasi

### 3.6.1 Identifikasi Kelas

*[Bryan: satu paragraf pengantar, lalu isi tabel. Nama kelas perancangan memakai pola yang sama dengan UC01-UC04, yaitu Form…View / Detail…View untuk boundary, …Controller untuk control, dan nama kelas analisis apa adanya untuk entity.]*

Tabel 3.6. Identifikasi Kelas Use Case UC06

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *[Nama kelas perancangan]* | *[Nama kelas analisis pada SKPL]* |
| ... | *...* | *...* |

### 3.6.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC06 - Skenario Normal" src="./assets/diagram/sequence-uc06-normal.png" width="100%">
</p>
<p align="center">
<i>Gambar 3.6.1. Sequence Diagram UC06 - Skenario Normal</i>
</p>

- **Skenario Alternatif 1: Saldo Tidak Mencukupi / Kegagalan Transaksi**

<p align="center">
<img alt="Sequence Diagram UC06 - Saldo Tidak Mencukupi / Kegagalan Transaksi" src="./assets/diagram/sequence-uc06-alt1.png" width="100%">
</p>
<p align="center">
<i>Gambar 3.6.2. Sequence Diagram UC06 - Saldo Tidak Mencukupi / Kegagalan Transaksi</i>
</p>

- **Skenario Alternatif 2: Duplikasi Permintaan Transaksi**

<p align="center">
<img alt="Sequence Diagram UC06 - Duplikasi Permintaan Transaksi" src="./assets/diagram/sequence-uc06-alt2.png" width="100%">
</p>
<p align="center">
<i>Gambar 3.6.3. Sequence Diagram UC06 - Duplikasi Permintaan Transaksi</i>
</p>

- **Skenario Alternatif 3: Campaign Sudah Berakhir / Ditutup**

<p align="center">
<img alt="Sequence Diagram UC06 - Campaign Sudah Berakhir / Ditutup" src="./assets/diagram/sequence-uc06-alt3.png" width="100%">
</p>
<p align="center">
<i>Gambar 3.6.4. Sequence Diagram UC06 - Campaign Sudah Berakhir / Ditutup</i>
</p>

- **Skenario Alternatif 4: Nominal Donasi Tidak Valid**

<p align="center">
<img alt="Sequence Diagram UC06 - Nominal Donasi Tidak Valid" src="./assets/diagram/sequence-uc06-alt4.png" width="100%">
</p>
<p align="center">
<i>Gambar 3.6.5. Sequence Diagram UC06 - Nominal Donasi Tidak Valid</i>
</p>

### 3.6.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC06" src="./assets/diagram/class-uc06.png" width="70%">
</p>
<p align="center">
<i>Gambar 3.6.6. Diagram Kelas Melakukan Transaksi Donasi (UC06)</i>
</p>

---

## 3.7 Use Case Mendaftar Sebagai Volunteer

**ID Use Case:** UC07  
**Nama Use Case:** Mendaftar Sebagai Volunteer

### 3.7.1 Identifikasi Kelas

*[Bryan: satu paragraf pengantar, lalu isi tabel. Nama kelas perancangan memakai pola yang sama dengan UC01-UC04, yaitu Form…View / Detail…View untuk boundary, …Controller untuk control, dan nama kelas analisis apa adanya untuk entity.]*

Tabel 3.7. Identifikasi Kelas Use Case UC07

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *[Nama kelas perancangan]* | *[Nama kelas analisis pada SKPL]* |
| ... | *...* | *...* |

### 3.7.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC07 - Skenario Normal" src="./assets/diagram/sequence-uc07-normal.png" width="100%">
</p>
<p align="center">
<i>Gambar 3.7.1. Sequence Diagram UC07 - Skenario Normal</i>
</p>

- **Skenario Alternatif 1: Formulir Tidak Lengkap**

<p align="center">
<img alt="Sequence Diagram UC07 - Formulir Tidak Lengkap" src="./assets/diagram/sequence-uc07-alt1.png" width="100%">
</p>
<p align="center">
<i>Gambar 3.7.2. Sequence Diagram UC07 - Formulir Tidak Lengkap</i>
</p>

- **Skenario Alternatif 2: Pendaftaran Ganda**

<p align="center">
<img alt="Sequence Diagram UC07 - Pendaftaran Ganda" src="./assets/diagram/sequence-uc07-alt2.png" width="100%">
</p>
<p align="center">
<i>Gambar 3.7.3. Sequence Diagram UC07 - Pendaftaran Ganda</i>
</p>

- **Skenario Alternatif 3: Kuota Volunteer Penuh / Pendaftaran Ditutup**

<p align="center">
<img alt="Sequence Diagram UC07 - Kuota Volunteer Penuh / Pendaftaran Ditutup" src="./assets/diagram/sequence-uc07-alt3.png" width="100%">
</p>
<p align="center">
<i>Gambar 3.7.4. Sequence Diagram UC07 - Kuota Volunteer Penuh / Pendaftaran Ditutup</i>
</p>

### 3.7.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC07" src="./assets/diagram/class-uc07.png" width="70%">
</p>
<p align="center">
<i>Gambar 3.7.5. Diagram Kelas Mendaftar Sebagai Volunteer (UC07)</i>
</p>

---

## 3.8 Use Case Mengelola Pendaftaran Relawan

**ID Use Case:** UC08  
**Nama Use Case:** Mengelola Pendaftaran Relawan

### 3.8.1 Identifikasi Kelas

*[Sahla: satu paragraf pengantar, lalu isi tabel. Nama kelas perancangan memakai pola yang sama dengan UC01-UC04, yaitu Form…View / Detail…View untuk boundary, …Controller untuk control, dan nama kelas analisis apa adanya untuk entity.]*

Tabel 3.8. Identifikasi Kelas Use Case UC08

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *[Nama kelas perancangan]* | *[Nama kelas analisis pada SKPL]* |
| ... | *...* | *...* |

### 3.8.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC08 - Skenario Normal" src="./assets/diagram/sequence-uc08-normal.png" width="100%">
</p>
<p align="center">
<i>Gambar 3.8.1. Sequence Diagram UC08 - Skenario Normal</i>
</p>

- **Skenario Alternatif 1: Belum Ada Pendaftar Volunteer**

<p align="center">
<img alt="Sequence Diagram UC08 - Belum Ada Pendaftar Volunteer" src="./assets/diagram/sequence-uc08-alt1.png" width="100%">
</p>
<p align="center">
<i>Gambar 3.8.2. Sequence Diagram UC08 - Belum Ada Pendaftar Volunteer</i>
</p>

### 3.8.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC08" src="./assets/diagram/class-uc08.png" width="70%">
</p>
<p align="center">
<i>Gambar 3.8.3. Diagram Kelas Mengelola Pendaftaran Relawan (UC08)</i>
</p>

---

## 3.9 Use Case Memperbarui Progres Project

**ID Use Case:** UC09  
**Nama Use Case:** Memperbarui Progres Project

### 3.9.1 Identifikasi Kelas

*[Sahla: satu paragraf pengantar, lalu isi tabel. Nama kelas perancangan memakai pola yang sama dengan UC01-UC04, yaitu Form…View / Detail…View untuk boundary, …Controller untuk control, dan nama kelas analisis apa adanya untuk entity.]*

Tabel 3.9. Identifikasi Kelas Use Case UC09

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *[Nama kelas perancangan]* | *[Nama kelas analisis pada SKPL]* |
| ... | *...* | *...* |

### 3.9.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC09 - Skenario Normal" src="./assets/diagram/sequence-uc09-normal.png" width="100%">
</p>
<p align="center">
<i>Gambar 3.9.1. Sequence Diagram UC09 - Skenario Normal</i>
</p>

- **Skenario Alternatif 1: Akses Ditolak (Bukan Pembuat Project)**

<p align="center">
<img alt="Sequence Diagram UC09 - Akses Ditolak (Bukan Pembuat Project)" src="./assets/diagram/sequence-uc09-alt1.png" width="100%">
</p>
<p align="center">
<i>Gambar 3.9.2. Sequence Diagram UC09 - Akses Ditolak (Bukan Pembuat Project)</i>
</p>

- **Skenario Alternatif 2: Gagal Mengunggah Dokumentasi Progres**

<p align="center">
<img alt="Sequence Diagram UC09 - Gagal Mengunggah Dokumentasi Progres" src="./assets/diagram/sequence-uc09-alt2.png" width="100%">
</p>
<p align="center">
<i>Gambar 3.9.3. Sequence Diagram UC09 - Gagal Mengunggah Dokumentasi Progres</i>
</p>

### 3.9.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC09" src="./assets/diagram/class-uc09.png" width="70%">
</p>
<p align="center">
<i>Gambar 3.9.4. Diagram Kelas Memperbarui Progres Project (UC09)</i>
</p>

---

## 3.10 Use Case Melihat Riwayat dan Penelusuran

**ID Use Case:** UC10  
**Nama Use Case:** Melihat Riwayat dan Penelusuran

### 3.10.1 Identifikasi Kelas

*[Sahla: satu paragraf pengantar, lalu isi tabel. Nama kelas perancangan memakai pola yang sama dengan UC01-UC04, yaitu Form…View / Detail…View untuk boundary, …Controller untuk control, dan nama kelas analisis apa adanya untuk entity.]*

Tabel 3.10. Identifikasi Kelas Use Case UC10

| No | Nama Kelas Perancangan | Nama Kelas Analisis Terkait |
|:--- | :--- | :--- |
| 1 | *[Nama kelas perancangan]* | *[Nama kelas analisis pada SKPL]* |
| ... | *...* | *...* |

### 3.10.2 Sequence Diagram

- **Skenario Normal**

<p align="center">
<img alt="Sequence Diagram UC10 - Skenario Normal" src="./assets/diagram/sequence-uc10-normal.png" width="100%">
</p>
<p align="center">
<i>Gambar 3.10.1. Sequence Diagram UC10 - Skenario Normal</i>
</p>

- **Skenario Alternatif 1: Riwayat Belum Tersedia**

<p align="center">
<img alt="Sequence Diagram UC10 - Riwayat Belum Tersedia" src="./assets/diagram/sequence-uc10-alt1.png" width="100%">
</p>
<p align="center">
<i>Gambar 3.10.2. Sequence Diagram UC10 - Riwayat Belum Tersedia</i>
</p>

### 3.10.3 Diagram Kelas

<p align="center">
<img alt="Diagram Kelas UC10" src="./assets/diagram/class-uc10.png" width="70%">
</p>
<p align="center">
<i>Gambar 3.10.3. Diagram Kelas Melihat Riwayat dan Penelusuran (UC10)</i>
</p>

---

# BAB 4: Diagram Kelas Keseluruhan

## 4.1 Diagram Kelas

Diagram kelas keseluruhan menggabungkan seluruh kelas perancangan dari BAB 3, yaitu kelas *boundary*, *control*, dan *entity* dari UC01 sampai UC10. Kelas *entity* yang dipakai oleh lebih dari satu use case digambarkan satu kali saja dengan atribut dan operasi gabungan.

<p align="center">
<img alt="Diagram Kelas Perancangan Keseluruhan KlimPooL" src="./assets/diagram/class-keseluruhan.png" width="100%">
</p>
<p align="center">
<i>Gambar 4.1. Diagram Kelas Perancangan Keseluruhan KlimPooL</i>
</p>

Tabel 4.1. Daftar Kelas Perancangan Keseluruhan

| ID Kelas | Nama Kelas | Atribut | Metode/Operasi |
| :--- | :--- | :--- | :--- |
| C00 | PenggunaUmum | `idPengguna`, `nama`, `peran` | `buatAkun()` |
| C12 | Akun | `idAkun`, `email`, `passwordHash`, `statusAkun`, `tanggalDibuat` | `validasiKelengkapanInput()`, `cekKetersediaanEmail()`, `simpanAkun()`, `validasiKredensial()` |
| C13 | SesiLogin | `idSesi`, `idPengguna`, `waktuMulai`, `waktuKedaluwarsa`, `statusSesi` | `buatSesi()`, `cekStatusLogin()`, `akhiriSesi()` |
| C14 | FormPendaftaranView | - | `pilihMenuPendaftaran()`, `tampilkanFormulir()`, `isiFormulir()`, `kirimFormulir()`, `tampilkanPesanKesalahan()`, `tampilkanNotifikasiBerhasil()` |
| C15 | FormLoginView | - | `isiKredensial()`, `kirimKredensial()`, `tampilkanPesanKesalahan()`, `arahkanKeHalamanUtama()` |
| C16 | AutentikasiController | `pesanKesalahan` | `daftarAkun()`, `login()`, `getPesanKesalahan()` |
| C10 | PembuatProject | `idPembuat`, `nama`, `email` | `buatCampaign()`, `buatProject()`, `ajukanVerifikasi()` |
| C03 | Campaign | `idCampaign`, `judul`, `deskripsi`, `targetNominal`, `periodeMulai`, `periodeSelesai`, `status`, `alasanPenolakan` | `validasiData()`, `validasiTarget()`, `validasiPeriode()`, `simpanCampaign()`, `tampilkanDetail()`, `ubahStatus()`, `getDaftarMenungguVerifikasi()` |
| C17 | FormCampaignView | - | `pilihMenuBuatCampaign()`, `tampilkanFormulir()`, `isiFormulir()`, `kirimFormulir()`, `tampilkanPesanKesalahan()`, `tampilkanNotifikasiBerhasil()` |
| C18 | DetailCampaignView | - | `bukaHalamanCampaign()`, `tampilkanDetail()` |
| C19 | CampaignController | `pesanKesalahan` | `buatCampaign()`, `getPesanKesalahan()`, `getDetailCampaign()` |
| C02 | Project | `idProject`, `nama`, `deskripsi`, `lokasi`, `tujuan`, `kebutuhanDana`, `kebutuhanLogistik`, `kriteriaVolunteer`, `status`, `alasanPenolakan` | `setInformasi()`, `setKebutuhan()`, `validasiData()`, `validasiKebutuhan()`, `simpanProject()`, `tampilkanDetail()`, `ubahStatus()`, `getDaftarMenungguVerifikasi()` |
| C20 | FormProjectView | - | `pilihMenuBuatProject()`, `tampilkanFormulir()`, `isiInformasiProject()`, `tampilkanInformasi()`, `isiKebutuhan()`, `kirimFormulir()`, `tampilkanPesanKesalahan()`, `tampilkanNotifikasiBerhasil()` |
| C21 | DetailProjectView | - | `bukaHalamanProject()`, `tampilkanDetail()` |
| C22 | ProjectController | `pesanKesalahan` | `simpanInformasiDasar()`, `perbaruiInformasi()`, `isiKebutuhan()`, `kirimProject()`, `getPesanKesalahan()`, `getDetailProject()` |
| C11 | AdminSistem | `idAdmin`, `nama`, `email` | `tinjauPengajuan()`, `setujuiPengajuan()`, `tolakPengajuan()` |
| C23 | PengajuanView | - | `ajukanVerifikasi()`, `tampilkanNotifikasi()` |
| C24 | DaftarPengajuanView | - | `bukaDaftarPengajuan()`, `tampilkanDaftar()`, `pilihPengajuan()` |
| C25 | DetailPengajuanView | `idPengajuan`, `jenis` | `tampilkanDetail()`, `setujui()`, `tolak()`, `tampilkanStatus()` |
| C26 | VerifikasiController | - | `ajukanVerifikasi()`, `getDaftarMenunggu()`, `getDetailPengajuan()`, `setujuiPengajuan()`, `tolakPengajuan()` |
| ... | *[Kelas perancangan UC05–UC07 dari Bryan]* | ... | ... |
| ... | *[Kelas perancangan UC08–UC10 dari Sahla]* | ... | ... |

<br>

---

# BAB 5: Matriks Kerunutan

Tabel berikut memetakan setiap kelas perancangan pada BAB 4 terhadap use case yang direalisasikannya. Acuan keterkaitan diambil dari BAB 6 *Traceability* dokumen SKPL, lalu disesuaikan dengan realisasi use case pada BAB 3.

Tabel 5.1. Matriks Kerunutan Kelas terhadap Use Case

| Kelas | Use Case Terkait |
| :--- | :--- |
| C00 - PenggunaUmum | UC01 - Melakukan Pendaftaran dan Autentikasi |
| C12 - Akun | UC01 - Melakukan Pendaftaran dan Autentikasi |
| C13 - SesiLogin | UC01 - Melakukan Pendaftaran dan Autentikasi |
| C14 - FormPendaftaranView | UC01 - Melakukan Pendaftaran dan Autentikasi |
| C15 - FormLoginView | UC01 - Melakukan Pendaftaran dan Autentikasi |
| C16 - AutentikasiController | UC01 - Melakukan Pendaftaran dan Autentikasi |
| C10 - PembuatProject | UC02 - Membuat Campaign Penggalangan Donasi, UC03 - Membuat Project Aksi Iklim, UC04 - Meninjau dan Memverifikasi Project |
| C03 - Campaign | UC02 - Membuat Campaign Penggalangan Donasi, UC04 - Meninjau dan Memverifikasi Project |
| C17 - FormCampaignView | UC02 - Membuat Campaign Penggalangan Donasi |
| C18 - DetailCampaignView | UC02 - Membuat Campaign Penggalangan Donasi |
| C19 - CampaignController | UC02 - Membuat Campaign Penggalangan Donasi |
| C02 - Project | UC03 - Membuat Project Aksi Iklim, UC04 - Meninjau dan Memverifikasi Project |
| C20 - FormProjectView | UC03 - Membuat Project Aksi Iklim |
| C21 - DetailProjectView | UC03 - Membuat Project Aksi Iklim |
| C22 - ProjectController | UC03 - Membuat Project Aksi Iklim |
| C11 - AdminSistem | UC04 - Meninjau dan Memverifikasi Project |
| C23 - PengajuanView | UC04 - Meninjau dan Memverifikasi Project |
| C24 - DaftarPengajuanView | UC04 - Meninjau dan Memverifikasi Project |
| C25 - DetailPengajuanView | UC04 - Meninjau dan Memverifikasi Project |
| C26 - VerifikasiController | UC04 - Meninjau dan Memverifikasi Project |
| ... | *[Baris untuk kelas UC05–UC10]* |

> Catatan pengisian: baris C00–C26 di atas sudah final untuk UC01–UC04. Yang mengerjakan UC05–UC07 dan UC08–UC10 tinggal melanjutkan penomoran dari C27 untuk setiap kelas *boundary* dan *control* baru, dan memakai kembali ID kelas analisis (C01, C04–C09) untuk kelas *entity*-nya.
