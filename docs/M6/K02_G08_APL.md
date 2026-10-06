<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 6
<br>
ARSITEKTUR PERANGKAT LUNAK (APL)
</h1>
<br>

## KlimPooL

### Untuk: Made Branenda Jordhy

Dipersiapkan oleh:

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

<br>
<br>

# BAB 1: Style/Pattern Arsitektur Acuan

KlimPooL menggunakan kombinasi **Client-Server Architecture** dan **Layered Architecture**. Client-Server menjelaskan komunikasi antara browser pengguna dan aplikasi web yang berjalan di Vercel. Layered Architecture menjelaskan pembagian tanggung jawab di dalam aplikasi Next.js *full-stack*. Frontend dan API berada dalam satu proyek Next.js, sedangkan MySQL menjadi DBMS internal untuk penyimpanan data.

Pada **Client-Server Architecture**, browser modern pada perangkat pengguna menjalankan antarmuka KlimPooL yang dibangun menggunakan Next.js (React) dan Tailwind CSS. Browser mengirim permintaan ke API REST pada aplikasi Next.js di Vercel. Aplikasi serverless memproses permintaan dan mengakses MySQL, lalu mengirim respons kembali ke browser. Komunikasi browser-server menggunakan HTTPS dengan TLS versi 1.2 atau lebih tinggi, sedangkan pertukaran data API menggunakan JSON.

Di dalam aplikasi **Layered Architecture** memisahkan tanggung jawab secara logis menjadi:

1. **Lapisan Presentasi** dibangun dengan Next.js (React) dan Tailwind CSS untuk menampilkan antarmuka web pada browser.
2. **Lapisan API/Aplikasi** menggunakan API REST pada Next.js untuk menerima permintaan JSON dan mengoordinasikan use case, seperti autentikasi, pengelolaan campaign/project, pencarian, donasi, relawan, progres, dan riwayat.
3. **Lapisan Domain/Bisnis** menerapkan aturan dan validasi inti, termasuk hak akses, status publikasi, kelayakan donasi, pencegahan transaksi berulang, dan aturan pendaftaran relawan.
4. **Lapisan Akses Data** menjalankan operasi baca/tulis ke MySQL. MySQL menggunakan storage engine InnoDB untuk transaksi ACID; perubahan saldo dan pencatatan donasi dilakukan atomik dan dibatalkan seluruhnya jika proses gagal.

Vercel menjalankan aplikasi Next.js dalam lingkungan *serverless* dengan *autoscaling*. Deployment dilakukan otomatis dari repositori Git dan menggunakan region Singapura. Pemisahan lapisan di bawah merupakan pemisahan tanggung jawab logis dalam satu proyek full-stack, bukan pernyataan bahwa setiap lapisan dideploy sebagai server terpisah.

Diagram berikut menunjukkan browser sebagai *client*, aplikasi Next.js sebagai *server*, dan MySQL sebagai penyimpanan data. Operasi basis data menggunakan koneksi/driver MySQL; JSON digunakan pada API browser-server, bukan sebagai pengganti akses basis data.



<p align="center">
<img src="./assets/diagram/Diagram%201.png" alt="Diagram 1. Arsitektur Client-Server dan Layered KlimPooL" width="100%">
</p>

**Gambar 1. Client-Server dan lapisan internal KlimPooL**


Client-Server sesuai dengan bentuk KlimPooL sebagai aplikasi web yang diakses oleh Pembuat Project, Donatur, Volunteer, dan Admin Sistem melalui browser tanpa pemasangan aplikasi khusus. Next.js menyediakan antarmuka dan API dalam satu proyek, sedangkan deployment serverless di Vercel melayani permintaan dari browser. HTTPS/TLS dan JSON memenuhi batasan komunikasi pada SKPL.

Layered Architecture sesuai karena KlimPooL mencakup alur autentikasi, verifikasi campaign/project, pencarian, donasi, pendaftaran relawan, pembaruan progres, dan riwayat dengan aturan bisnis dan data yang saling terkait. Pemisahan presentasi, aplikasi/API, domain, dan akses data membantu menjaga modularitas (KNF11). Aturan transaksi donasi dapat dijalankan terpisah dari antarmuka; MySQL/InnoDB mendukung kebutuhan transaksi atomik dan konsistensi pada KF15–KF18. Pemisahan ini juga membantu menjaga aturan akses Admin Sistem, validasi pengajuan, dan pengelolaan relawan agar tidak bergantung langsung pada tampilan.

Kedua pola ini menjadi acuan rancangan KlimPooL.

Tabel 1.1. Lingkungan Operasi Perangkat Lunak
| Komponen | Spesifikasi |
| :--- | :--- |
| *Server* | P/L harus dijalankan pada server yang tersedia secara berkelanjutan dan mampu melayani permintaan pengguna secara bersamaan. Teknologi dan versi *runtime*, serta penyedia layanan *hosting*, akan ditentukan pada tahap implementasi. |
| *Client* | P/L dapat diakses melalui peramban web versi terkini, seperti Chrome, Firefox, Edge, atau Safari, pada perangkat desktop, tablet, maupun *smartphone* tanpa pemasangan perangkat lunak tambahan. Pengguna harus memiliki koneksi internet yang memadai. |
| *DBMS* | P/L harus menyimpan data akun, campaign, project, saldo, transaksi, pendaftaran relawan, dan riwayat progres pada basis data internal. DBMS yang digunakan harus mendukung transaksi atomik (*ACID*) untuk pemrosesan donasi. Jenis dan versi DBMS akan ditentukan pada tahap implementasi. |
| *OS Client* | P/L dapat diakses melalui sistem operasi apa pun yang mendukung peramban web modern, sehingga pengguna tidak dibatasi pada sistem operasi tertentu. |
| *OS Server* | Sistem operasi server akan ditentukan sesuai dengan teknologi *runtime* dan lingkungan *hosting* yang dipilih pada tahap implementasi. |
| *Jaringan dan Protokol* | Komunikasi antara peramban dan server harus menggunakan HTTPS dengan TLS versi 1.2 atau lebih tinggi. Pertukaran data melalui API harus menggunakan format JSON. |
| *Kapasitas Operasional* | Server harus mendukung 1.000 pengguna aktif secara simultan dengan waktu tanggap maksimal 3 detik untuk setiap permintaan. Ketersediaan layanan harus mencapai minimal 99% per bulan, di luar jadwal pemeliharaan rutin. |

Tabel berikut disalin dari subbab 2.5 *Lingkungan Operasi Perangkat Lunak* pada SKPL.


Dikarenakan pada subbab 2.5 file K02_G08_SKPL.md, kami menentukan spesifikasi rinci pada tabel 1.2 ini 

Tabel 1.2. Spesifikasi Implementasi
| Komponen | Spesifikasi |
| :--- | :--- |
| *Server* | Node.js 22 LTS dengan Next.js *full-stack* (frontend dan API dalam satu proyek), di-deploy ke Vercel dengan arsitektur *serverless* dan *autoscaling*. Deployment otomatis dari repositori Git dengan region Singapura. |
| *Client* | Antarmuka menggunakan Next.js (React) dan Tailwind CSS, diakses melalui Chrome, Firefox, Edge, atau Safari versi terkini. |
| *DBMS* | MySQL dengan storage engine InnoDB untuk mendukung transaksi ACID pada pemrosesan donasi. |
| *OS Client* | Tidak dibatasi; dapat diakses dari Windows, macOS, Linux, Android, dan iOS selama memiliki browser modern. |
| *OS Server* | Dikelola penyedia hosting Vercel dengan lingkungan *serverless* berbasis Linux. |
| *Jaringan dan Protokol* | HTTPS dengan TLS 1.2 atau lebih tinggi menggunakan sertifikat otomatis dari Vercel; HTTP dialihkan ke HTTPS. API REST menggunakan format JSON. |
| *Kapasitas Operasional* | *Autoscaling serverless*.|

---

# BAB 2: Identifikasi Komponen / Modul / Subsistem

Pada bagian ini, lakukan identifikasi terhadap komponen, modul, atau subsistem yang menyusun aplikasi berdasarkan *pattern* arsitektur yang telah ditetapkan sebelumnya. Setiap komponen memiliki tanggung jawab tertentu dalam mendukung fungsionalitas sistem.

Setiap komponen memiliki tanggung jawab tertentu dalam mendukung fungsionalitas sistem secara keseluruhan. Komponen dapat dikelompokkan berdasarkan lapisan arsitektur (misalnya *Model*, *View*, dan *Controller* pada pattern MVC), atau berdasarkan fungsi atau peran komponen di dalam sistem (misalnya modul autentikasi, manajemen data, dan integrasi eksternal).

Tabel 2.1. Identifikasi Komponen/Modul/Subsistem

| Nama Komponen/Modul/Subsistem | Jenis | Penjelasan |
| :--- | :--- | :--- |
| `LoginView` | **PRESENTATION LAYER** | Menampilkan formulir login dan meneruskan data autentikasi pengguna ke komponen aplikasi. |
| `CampaignProjectView` | **PRESENTATION LAYER** | Menampilkan informasi campaign dan project serta menyediakan antarmuka untuk membuat dan mengelola pengajuan, serta untuk peninjauan dan verifikasi oleh Admin Sistem. |
| `KatalogPetaView` | **PRESENTATION LAYER** | Menampilkan kegiatan pada katalog dan peta interaktif serta menerima interaksi pengguna untuk menelusuri kegiatan. |
| `DonasiView` | **PRESENTATION LAYER** | Menampilkan informasi saldo dan formulir donasi serta meneruskan permintaan donasi pengguna. |
| `RelawanView` | **PRESENTATION LAYER** | Menampilkan informasi project dan formulir pendaftaran relawan. |
| `ProgresView` | **PRESENTATION LAYER** | Menampilkan progres kegiatan dan menyediakan antarmuka untuk memperbarui progres. |
| `RiwayatView` | **PRESENTATION LAYER** | Menampilkan riwayat transaksi dan progres pengguna. |
| `AutentikasiController` | **APPLICATION/API LAYER** | Memproses permintaan pendaftaran dan autentikasi pengguna melalui API. |
| `CampaignProjectController` | **APPLICATION/API LAYER** | Memproses permintaan pembuatan, pengelolaan, dan pengajuan campaign/project, serta peninjauan dan verifikasi (diterima/ditolak) oleh Admin Sistem. |
| `PencarianController` | **APPLICATION/API LAYER** | Memproses permintaan pencarian dan penelusuran campaign/project. |
| `DonasiController` | **APPLICATION/API LAYER** | Memproses permintaan donasi dan mengoordinasikan proses transaksi donasi. |
| `RelawanController` | **APPLICATION/API LAYER** | Memproses pendaftaran dan pengelolaan relawan pada project. |
| `ProgresController` | **APPLICATION/API LAYER** | Memproses pembaruan dan pengambilan data progres kegiatan. |
| `RiwayatController` | **APPLICATION/API LAYER** | Memproses permintaan data riwayat transaksi dan progres. |
| `AutentikasiService` | **DOMAIN/BUSINESS LAYER** | Mewadahi PenggunaUmum (C00), Akun (C12), dan SesiLogin (C13). Memvalidasi input dan ketersediaan email, memverifikasi kredensial, mengelola sesi login, dan menerapkan hak akses berdasarkan peran. |
| `CampaignProjectService` | **DOMAIN/BUSINESS LAYER** | Mewadahi PembuatProject (C10), Campaign (C03), Project (C02), dan AdminSistem (C11). Memvalidasi data, target, periode, dan kebutuhan, serta mengelola status publikasi dan verifikasi (diterima/ditolak beserta alasan) yang hanya dapat dilakukan Admin Sistem. |
| `PencarianService` | **DOMAIN/BUSINESS LAYER** | Mewadahi Katalog (C01) dan PetaWilayah (C05). Memproses kata kunci dan filter, serta hanya mengembalikan campaign/project berstatus dipublikasikan. |
| `DonasiService` | **DOMAIN/BUSINESS LAYER** | Mewadahi Donatur (C04), TransaksiDonasi (C06), dan BuktiTransaksi (C07). Memeriksa kelayakan donasi (nominal, saldo, status campaign/project), mencegah transaksi berulang, memproses donasi secara atomik, memperbarui dana terkumpul, dan menghasilkan bukti transaksi. |
| `RelawanService` | **DOMAIN/BUSINESS LAYER** | Mewadahi Volunteer (C08) dan PendaftaranRelawan (C09). Menerapkan aturan pendaftaran relawan (kelengkapan formulir, kuota, pendaftaran ganda) dan memperbarui status keputusan Pembuat Project. |
| `ProgresService` | **DOMAIN/BUSINESS LAYER** | Menangani bagian progres pada Project (C02) dan PembuatProject (C10). Memvalidasi hak akses pembaruan, menyimpan milestone dan dokumentasi, serta mencatat timestamp. |
| `RiwayatService` | **DOMAIN/BUSINESS LAYER** | Menyusun riwayat TransaksiDonasi (C06) dan progres Project (C02) milik PenggunaUmum (C00) secara kronologis. |
| `UserRepository` | **DATA ACCESS LAYER** | Operasi baca/tulis data pengguna, akun, dan sesi (C00, C08, C10, C11, C12, C13) ke MySQL. |
| `CampaignProjectRepository` | **DATA ACCESS LAYER** | Operasi baca/tulis data Campaign (C03) dan Project (C02), termasuk status verifikasi, alasan penolakan, dan dana terkumpul, ke MySQL. |
| `DonasiRepository` | **DATA ACCESS LAYER** | Operasi baca/tulis saldo Donatur (C04), TransaksiDonasi (C06), dan BuktiTransaksi (C07) ke MySQL dalam transaksi ACID. |
| `RelawanRepository` | **DATA ACCESS LAYER** | Operasi baca/tulis data PendaftaranRelawan (C09) beserta statusnya ke MySQL. |
| `ProgresRepository` | **DATA ACCESS LAYER** | Operasi baca/tulis milestone, status pelaksanaan, dokumentasi, dan timestamp progres Project (C02) ke MySQL. |
| `DatabaseConnection` | **DATA ACCESS LAYER** | Mengelola koneksi/driver MySQL dan batas transaksi yang dipakai bersama seluruh repository. |

Ketentuan pengisian Tabel 2.1:
1. Kolom **Jenis** mengikuti pengelompokan pada *style/pattern* di BAB 1. Untuk MVC, jenisnya adalah *Model*, *View*, dan *Controller*. Jenis lain boleh ditambahkan, misalnya *Pendukung* untuk komponen bantu yang dipakai bersama, atau *Integrasi Eksternal* untuk penghubung ke sistem di luar P/L yang disebutkan pada subbab 2.2 dokumen SKPL. Kolom ini juga boleh diisi dengan *Subsistem*, *Modul*, atau *Komponen* apabila komponen dikelompokkan berdasarkan fungsinya. Tuliskan subsistem terlebih dahulu, lalu komponen penyusunnya di baris-baris berikutnya.
2. Komponen **tidak sama dengan** kelas. Satu komponen boleh mewadahi beberapa kelas dari diagram kelas pada dokumen SKPL. Pastikan seluruh kelas tercakup oleh setidaknya satu komponen.
3. Pastikan seluruh use case pada dokumen SKPL dapat dijalankan oleh komponen-komponen yang didaftarkan di tabel ini. Jangan menambahkan komponen untuk fitur yang tidak ada di SKPL.

<sub><b><i>Catatan</i></b>: <i>Nama komponen pada Tabel 2.1 harus dipakai sama persis pada gambar di BAB 1 dan setiap view di BAB 3. Jika saat membuat view ternyata dibutuhkan komponen baru, tambahkan komponen tersebut ke Tabel 2.1 terlebih dahulu.</i></sub>

---

# BAB 3: Model Arsitektur Perangkat Lunak

## 3.1 Logical View

*Logical View* mendeskripsikan abstraksi utama perangkat lunak beserta hubungan
antarabstraksi tersebut dalam mendukung kebutuhan fungsional. View ini menjawab
pertanyaan "layanan apa saja yang disediakan sistem dan bagaimana bagian-bagiannya
saling terhubung". Pada dokumen ini *Logical View* disajikan dalam bentuk *block
diagram* yang memuat seluruh komponen pada Tabel 2.1 beserta relasi berlabel di
antaranya.

*Logical View* dipilih karena tiga alasan berikut.

Pertama, KlimPooL memiliki tujuh alur layanan yang berdiri sendiri, yaitu
autentikasi, pengelolaan campaign dan project, pencarian, donasi, relawan,
progres, serta riwayat. Ketujuhnya memakai pembagian tanggung jawab yang sama,
sehingga pemetaan komponen ke dalam lapisan menjadi cara paling langsung untuk
memperlihatkan keseluruhan sistem dalam satu gambar tanpa menonjolkan salah satu
use case.

Kedua, BAB 1 menetapkan *Layered Architecture* sebagai salah satu pola acuan.
*Logical View* memperlihatkan pembagian lapisan tersebut secara eksplisit melalui
pengelompokan komponen ke dalam *Presentation Layer*, *Application/API Layer*,
*Domain/Business Layer*, dan *Data Access Layer*, sekaligus menunjukkan bahwa
pemanggilan hanya berjalan dari lapisan atas ke lapisan di bawahnya. Batas antara
kotak *Client* dan *Server* pada gambar sekaligus memperlihatkan pola
*Client-Server* yang juga ditetapkan pada BAB 1.

Ketiga, Gambar 1 pada BAB 1 baru menggambarkan arsitektur pada tingkat lapisan dan
teknologi, belum pada tingkat komponen. *Logical View* melengkapinya dengan
menampilkan seluruh 27 komponen Tabel 2.1 beserta namanya, sehingga pembaca dapat
menelusuri kebutuhan fungsional pada SKPL sampai ke komponen yang mewujudkannya.

<p align="center">
<img alt="Logical View KlimPooL" src="./assets/diagram/Logical View.png" width="100%">
</p>
<p align="center">
<i>Gambar 2. Logical View KlimPooL</i>
</p>
<br>

Gambar 2 memuat seluruh komponen pada Tabel 2.1 yang dikelompokkan ke dalam empat
lapisan sesuai pola pada BAB 1. Lapisan *Presentation* berada di dalam kotak
*Client* karena dijalankan pada peramban pengguna, sedangkan tiga lapisan lainnya
berada di dalam kotak *Server* karena dijalankan pada aplikasi Next.js di Vercel.
MySQL digambarkan dengan garis putus-putus karena merupakan basis data pada
lingkungan operasi Tabel 1.1, bukan komponen perangkat lunak pada Tabel 2.1.

Relasi antarkomponen pada gambar dibaca sebagai berikut.

| Label relasi | Makna |
| :--- | :--- |
| memanggil API | Komponen *Presentation* mengirim permintaan ke komponen *Application/API* melalui API REST berformat JSON di atas HTTPS dengan TLS 1.2 atau lebih tinggi. |
| meminta layanan | Komponen *Application/API* meneruskan permintaan ke komponen *Domain/Business* yang menerapkan aturan dan validasi inti. |
| membaca/menulis data | Komponen *Domain/Business* memakai komponen *Data Access* untuk membaca maupun menulis data yang dibutuhkannya. |
| memakai koneksi | Setiap *repository* memakai `DatabaseConnection` untuk memperoleh koneksi dan batas transaksi yang sama. |
| query/simpan | `DatabaseConnection` menjalankan perintah baca/tulis ke MySQL. |

Sebagian komponen *Domain/Business* terhubung ke lebih dari satu *repository*
karena aturan bisnisnya memang menyentuh lebih dari satu kelompok data.
`DonasiService` memperbarui dana terkumpul pada campaign atau project sehingga
memakai `CampaignProjectRepository` selain `DonasiRepository`. `RelawanService`
memeriksa kuota relawan yang tersimpan pada data project sehingga memakai
`CampaignProjectRepository` selain `RelawanRepository`. `RiwayatService` menyusun
riwayat transaksi dan progres sekaligus sehingga memakai `DonasiRepository` dan
`ProgresRepository`. Seluruh keterhubungan tersebut mengikuti deskripsi tanggung
jawab masing-masing komponen pada Tabel 2.1.

Perlu diperhatikan bahwa tidak terdapat relasi dari lapisan bawah ke lapisan di
atasnya maupun relasi yang melompati lapisan. Hal ini sesuai dengan ketentuan
*Layered Architecture* pada BAB 1, yaitu setiap lapisan hanya memakai layanan dari
lapisan tepat di bawahnya.

# Referensi

- Sommerville, I. (2016). *Software Engineering* (10th ed.). Pearson. Chapter 6: *Architectural Design*: [https://software-engineering-book.com/slides/](https://software-engineering-book.com/slides/)
- Diagram arsitektur: [https://www.drawio.com/](https://www.drawio.com/), [https://staruml.io/](https://staruml.io/)
