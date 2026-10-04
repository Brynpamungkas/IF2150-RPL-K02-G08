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

Tabel 1.2. Spesifikasi Implementasi

Dikarenakan pada subbab 2.5 file K02_G08_SKPL.md, kami menentukan spesifikasi rinci pada tabel 1.2 ini 

| Komponen | Spesifikasi |
| :--- | :--- |
| *Server* | Node.js 22 LTS dengan Next.js *full-stack* (frontend dan API dalam satu proyek), di-deploy ke Vercel dengan arsitektur *serverless* dan *autoscaling*. Deployment otomatis dari repositori Git dengan region Singapura. |
| *Client* | Antarmuka menggunakan Next.js (React) dan Tailwind CSS, diakses melalui Chrome, Firefox, Edge, atau Safari versi terkini. |
| *DBMS* | MySQL dengan storage engine InnoDB untuk mendukung transaksi ACID pada pemrosesan donasi. |
| *OS Client* | Tidak dibatasi; dapat diakses dari Windows, macOS, Linux, Android, dan iOS selama memiliki browser modern. |
| *OS Server* | Dikelola penyedia hosting Vercel dengan lingkungan *serverless* berbasis Linux. |
| *Jaringan dan Protokol* | HTTPS dengan TLS 1.2 atau lebih tinggi menggunakan sertifikat otomatis dari Vercel; HTTP dialihkan ke HTTPS. API REST menggunakan format JSON. |
| *Kapasitas Operasional* | *Autoscaling serverless*. Target 1.000 pengguna aktif secara simultan, waktu tanggap maksimal 3 detik per permintaan, dan ketersediaan minimal 99% per bulan di luar pemeliharaan rutin mengikuti SKPL dan perlu divalidasi melalui pengujian beban serta pemantauan operasional. |

---

# BAB 2: Identifikasi Komponen / Modul / Subsistem

Pada bagian ini, lakukan identifikasi terhadap komponen, modul, atau subsistem yang menyusun aplikasi berdasarkan *pattern* arsitektur yang telah ditetapkan sebelumnya. Setiap komponen memiliki tanggung jawab tertentu dalam mendukung fungsionalitas sistem.

Setiap komponen memiliki tanggung jawab tertentu dalam mendukung fungsionalitas sistem secara keseluruhan. Komponen dapat dikelompokkan berdasarkan lapisan arsitektur (misalnya *Model*, *View*, dan *Controller* pada pattern MVC), atau berdasarkan fungsi atau peran komponen di dalam sistem (misalnya modul autentikasi, manajemen data, dan integrasi eksternal).

Tabel 2.1. Identifikasi Komponen/Modul/Subsistem

| Nama Komponen/Modul/Subsistem | Jenis                 | Penjelasan                                                                                                           |
| :---------------------------- | :-------------------- | :------------------------------------------------------------------------------------------------------------------- |
| *KatalogView*                 | *View*                | *Menampilkan daftar produk dan meneruskan aksi pelanggan (misalnya "Tambah ke Keranjang") ke KatalogController.*     |
| *KeranjangView*               | *View*                | *Menampilkan isi keranjang pelanggan beserta tombol checkout.*                                                       |
| *CheckoutView*                | *View*                | *Menampilkan ringkasan pesanan dan pilihan metode pembayaran kepada pelanggan.*                                      |
| *RiwayatPesananView*          | *View*                | *Menampilkan daftar pesanan yang pernah dibuat pelanggan beserta statusnya.*                                         |
| *KatalogController*           | *Controller*          | *Memproses permintaan daftar produk dan penambahan produk ke keranjang.*                                             |
| *KeranjangController*         | *Controller*          | *Memproses perubahan isi keranjang dan membuat pesanan baru saat checkout.*                                          |
| *PembayaranController*        | *Controller*          | *Memproses pemilihan metode pembayaran dan meneruskan permintaan otorisasi ke PaymentGatewayAdapter.*                |
| *PesananController*           | *Controller*          | *Memproses permintaan riwayat pesanan milik pelanggan.*                                                              |
| *Produk*                      | *Model*               | *Merepresentasikan data produk beserta stoknya serta metode untuk mengakses dan mengubahnya.*                        |
| *Keranjang*                   | *Model*               | *Merepresentasikan item yang dipilih pelanggan sebelum checkout serta metode untuk mengakses dan mengubahnya.*       |
| *Pesanan*                     | *Model*               | *Merepresentasikan data pesanan beserta status pembayarannya serta metode untuk mengakses dan mengubahnya.*          |
| *Pelanggan*                   | *Model*               | *Merepresentasikan data akun pelanggan serta metode untuk mengakses dan mengubahnya.*                                |
| *Validasi*                    | *Pendukung*           | *Memvalidasi input pelanggan sebelum diproses oleh controller.*                                                      |
| *PaymentGatewayAdapter*       | *Integrasi Eksternal* | *Mengirim permintaan otorisasi ke payment gateway (dummy) dan meneruskan status pembayaran ke PembayaranController.* |
| *Database*                    | *Penyimpanan Data*    | *Menyimpan seluruh data model secara persisten, baik lokal (misalnya SQLite) maupun terpusat (misalnya Supabase).*   |
| *...*                         | *...*                 | *...*                                                                                                                |

Ketentuan pengisian Tabel 2.1:
1. Kolom **Jenis** mengikuti pengelompokan pada *style/pattern* di BAB 1. Untuk MVC, jenisnya adalah *Model*, *View*, dan *Controller*. Jenis lain boleh ditambahkan, misalnya *Pendukung* untuk komponen bantu yang dipakai bersama, atau *Integrasi Eksternal* untuk penghubung ke sistem di luar P/L yang disebutkan pada subbab 2.2 dokumen SKPL. Kolom ini juga boleh diisi dengan *Subsistem*, *Modul*, atau *Komponen* apabila komponen dikelompokkan berdasarkan fungsinya. Tuliskan subsistem terlebih dahulu, lalu komponen penyusunnya di baris-baris berikutnya.
2. Komponen **tidak sama dengan** kelas. Satu komponen boleh mewadahi beberapa kelas dari diagram kelas pada dokumen SKPL. Pastikan seluruh kelas tercakup oleh setidaknya satu komponen.
3. Pastikan seluruh use case pada dokumen SKPL dapat dijalankan oleh komponen-komponen yang didaftarkan di tabel ini. Jangan menambahkan komponen untuk fitur yang tidak ada di SKPL.

<sub><b><i>Catatan</i></b>: <i>Nama komponen pada Tabel 2.1 harus dipakai sama persis pada gambar di BAB 1 dan setiap view di BAB 3. Jika saat membuat view ternyata dibutuhkan komponen baru, tambahkan komponen tersebut ke Tabel 2.1 terlebih dahulu.</i></sub>

---

# BAB 3: Model Arsitektur Perangkat Lunak

*Architectural View* adalah bagaimana cara kita melihat/mendeskripsikan arsitektur sebuah sistem dari sudut pandang tertentu. Dalam perancangan arsitektur aplikasi, dibutuhkan *Architectural View* yang dapat mempermudah pemahaman dari proses aplikasi yang akan dikembangkan. Tujuan dari *Architectural View* adalah menjadi bahan komunikasi, pemisahan masalah, mempermudah analisis, dan pemandu saat eksekusi pengembangan sistem tersebut.

Buatlah model arsitektur dari aplikasi yang akan dirancang dalam bentuk *view*. Model arsitektur ini berfungsi untuk memperlihatkan bagaimana setiap komponen, modul, dan subsistem saling berinteraksi serta berkolaborasi dalam menjalankan fungsi utama sistem secara keseluruhan. Anda dapat membuat satu atau lebih *view* tergantung kebutuhan dalam bentuk gambar. Pilihlah notasi yang sesuai. Contoh *view* yang dapat digunakan antara lain ***Logical View***, ***Process View***, ***Development View***, serta ***Physical View***.

Ketentuan pengisian BAB 3:
1. Setiap view menggambarkan **keseluruhan sistem**, bukan satu use case atau satu fitur saja.
2. Buat **minimal satu view**. Setiap view dituliskan dalam subbab tersendiri (3.1, 3.2, dan seterusnya). Tidak perlu membuat keempat view, pilih yang paling membantu menjelaskan P/L Anda, lalu jelaskan alasan pemilihannya.
3. Setiap view harus **konsisten dengan BAB 2**. Seluruh komponen pada Tabel 2.1 harus muncul dengan nama yang sama, dan tidak boleh ada komponen pada view yang tidak terdaftar di Tabel 2.1.
4. Setiap view harus **mencerminkan style/pattern pada BAB 1**. Misalnya, jika memilih MVC, pembagian *Model*, *View*, dan *Controller* harus terlihat jelas pada diagram.
5. Jika membuat lebih dari satu view, setiap view harus menggambarkan sistem yang sama dari sudut pandang berbeda. View tambahan melengkapi view pertama, bukan mengulanginya.
6. Beri label pada setiap garis atau panah yang menghubungkan komponen agar hubungan antarkomponen dapat dipahami tanpa penjelasan tambahan.
7. Jika membuat *Physical View*, gambarkan lingkungan operasi pada Tabel 1.1.

## 3.1 XXX View

Tuliskan secara singkat mengenai model arsitektur perangkat lunak yang Anda pilih dan sertakan alasan mengapa model arsitektur tersebut cocok untuk aplikasi Anda.

<p align="center">
<img alt="Contoh Logical View pada P/L E-Commerce" src="./assets/diagram/contoh-logical-view.webp" width="100%">
</p>
<p align="center">
<i>Gambar 2. Contoh Logical View pada P/L E-Commerce</i>
</p>

Gambar 2 adalah contoh *Logical View* dalam bentuk *block diagram*. Seluruh komponen pada Tabel 2.1 digambarkan dan dikelompokkan sesuai pola MVC (*View*, *Controller*, *Model*), ditambah komponen pendukung dan basis data. Sistem di luar P/L, seperti *Payment Gateway (dummy)*, digambarkan dengan garis putus-putus dan tidak perlu dimasukkan ke Tabel 2.1. Setiap garis diberi label: "Memanggil" untuk *View* yang memanggil *Controller*, "akses" untuk *Controller* yang mengakses *Model*, serta agregasi dan komposisi untuk hubungan antar-*Model*.

<sub><b><i>Catatan</i></b>: <i>Ganti XXX dengan nama view yang dibuat, misalnya Logical View. Gambar 2 hanya contoh untuk P/L e-commerce, ganti dengan view milik kelompok Anda yang memuat seluruh komponen pada Tabel 2.1. Jenis view dan notasinya boleh berbeda dari contoh. Jika membuat view tambahan, lanjutkan pola 3.x ini (3.2, 3.3, dan seterusnya).</i></sub>

---

# Referensi

- Sommerville, I. (2016). *Software Engineering* (10th ed.). Pearson. Chapter 6: *Architectural Design*: [https://software-engineering-book.com/slides/](https://software-engineering-book.com/slides/)
- Diagram arsitektur: [https://www.drawio.com/](https://www.drawio.com/), [https://staruml.io/](https://staruml.io/)
