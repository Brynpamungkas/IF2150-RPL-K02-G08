<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 9
<br>
IMPLEMENTASI PERANGKAT LUNAK
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

> **Petunjuk pengerjaan:** *[Silahkan hapus bagian ini setelah selesai mengerjakan]*
>
> Dokumen ini adalah **spesifikasi sekaligus template laporan singkat** Tugas 9. Bagian **Ketentuan Implementasi** (Bagian A) adalah aturan yang harus kalian ikuti, boleh dihapus dari laporan akhir. Bagian **Laporan Implementasi** (Bagian B) adalah yang **wajib kalian isi**. Gunakan nama, ID, kebutuhan, use case, dan kelas yang konsisten dengan SKPL, APL, dan DPPL.

---

**Deadline:** Rabu, 11 November 2026, 21.50 WIB
**Asistensi akbar:** Senin, 2 November 2026, 19.00 WIB, MS Teams 2026 IF2150 RPL. 

---

# BAGIAN A: Ketentuan Implementasi

## A.1 Deskripsi Tugas

Pada tugas ini, kalian mengimplementasikan perangkat lunak yang telah dirancang pada tugas-tugas sebelumnya (SKPL, APL, DPPL) menjadi aplikasi yang **dapat dijalankan**. Platform bebas (web, desktop, atau mobile) selama aplikasi dapat dijalankan ulang oleh asisten mengikuti petunjuk kalian.

Ketentuan umum:
- Setiap anggota bertanggung jawab atas **minimal satu fitur atau modul** dan harus terlihat jelas di riwayat commit/PR.
- Implementasi harus **mengacu pada DPPL**. Jika ada yang berubah (kelas, layar, basis data, dsb.), catat di Bagian B.1. Perubahan itu wajar, tetapi harus tercatat dan beralasan.
- Implementasi **tidak harus berupa kelas** (misalnya fungsi, komponen, *route/handler*, *stored procedure*, atau skrip). Namun, setiap kelas perancangan pada DPPL **wajib dapat ditelusuri** ke implementasinya, dan penelusuran ini dicatat di Bagian B.5.
- Seluruh use case pada SKPL **diprioritaskan** untuk diimplementasikan. Status tiap use case akan dilaporkan pada HIUPL (Tugas 10).
- Seluruh mahasiswa **wajib** mengikuti asistensi akbar.

## A.2 Platform, Bahasa, dan Teknologi

Kalian **bebas** memilih bahasa, framework, library, dan basis data, dengan syarat:

1. **Dapat dijalankan ulang** oleh asisten pada mesin biasa dengan mengikuti README. Versi bahasa/runtime dan seluruh dependensi harus tertulis jelas.
2. **Dependensi dikelola lewat file standar**, misalnya `package.json` + lockfile, `requirements.txt`/`pyproject.toml`, `pom.xml`/`build.gradle`, `composer.json`, `pubspec.yaml`, dan sejenisnya. Jangan meng-commit folder hasil instalasi (`node_modules/`, `venv/`, `build/`, dll.).
3. **Jika memakai layanan eksternal** (basis data cloud, API pihak ketiga, auth, dll.), sediakan cara menjalankan tanpa akun pribadi kalian, atau sediakan data/akun uji pada README. Basis data **sangat disarankan** dapat dijalankan lokal (SQLite, atau Docker Compose untuk PostgreSQL/MySQL/MongoDB).
4. **Arsitektur sesuai DPPL.** Pola arsitektur yang kalian pilih di APL/DPPL (MVC, layered, client-server, dll.) harus terlihat pada struktur kode.

Ketentuan tambahan per platform:

| Platform | Ketentuan |
| :--- | :--- |
| **Web** | Berjalan lokal lewat satu-dua perintah yang terdokumentasi. Boleh juga di-*deploy*; jika ya, cantumkan URL, tetapi **tetap wajib bisa dijalankan lokal** (URL deploy bisa mati). |
| **Desktop** | Berjalan dari source lewat perintah yang terdokumentasi. Build/installer opsional. |
| **Mobile** | Berjalan di emulator/simulator atau perangkat. Sertakan langkah menjalankan, dan **sangat disarankan** melampirkan APK/build di Release. |

## A.3 Keamanan Repository

Repo fork kelompok bersifat **public**, sehingga:

- **Dilarang** meng-commit password, API key, token, `.env` asli, sertifikat/private key, atau data pribadi. Hal ini dapat mengurangi nilai.
- Sediakan `.env.example` berisi nama variabel tanpa nilai rahasia, dan masukkan `.env` ke `.gitignore`.
- Jika sudah terlanjur ter-commit, **cabut/ganti** kredensial tersebut. Menghapus commit saja tidak cukup.
- Data uji/seed harus berupa data fiktif.

## A.4 Struktur Folder

Seluruh kode ditempatkan di `src/` pada repo fork. Jangan mengubah folder milestone lama.

```
src/                              # SELURUH kode implementasi
	README.md                     # dokumentasi utama aplikasi (lihat A.5)
	.env.example                  # jika memakai environment variable
	<struktur kode kalian>        # bebas, mengikuti pola arsitektur DPPL
	tests/                        # test case (jika ada)
docs/
	M9/
		KXX_GYY_Implementasi.md   # laporan ini (Bagian B)
		KXX_GYY_Form-Asistensi.md
```

Catatan:
- `README.md` aplikasi diletakkan di **`src/README.md`**, bukan di root repo.
- Jika kerangka kerja kalian mewajibkan struktur tertentu (misalnya Maven `src/main/java`, Flutter `lib/`, monorepo `frontend/` dan `backend/`), letakkan semuanya **di dalam `src/`**.
- Nama file dan folder pada `docs/M9/` mengikuti aturan penamaan milestone sebelumnya (`KXX_GYY_...`).

## A.5 Isi Minimal `src/README.md`

README harus cukup bagi orang yang belum pernah melihat proyek kalian untuk menjalankan aplikasi dari nol. Minimal berisi:

1. **Deskripsi singkat** aplikasi.
2. **Teknologi yang digunakan** beserta versi (bahasa, framework, basis data).
3. **Prasyarat dan instalasi** (software yang harus ada, perintah instalasi dependensi).
4. **Konfigurasi** (environment variable, setup basis data, migrasi/seed) dan langkah demi langkah menjalankannya.
5. **Cara menjalankan aplikasi** (dan cara menjalankan test, jika ada).
6. **Akun/data uji** untuk mencoba tiap peran pengguna (jika ada login).
7. **Daftar modul/fitur yang diimplementasi** beserta pembagian anggota.
8. **Daftar tabel/koleksi basis data** beserta atributnya (atau tautan ke skema/ERD).

## A.6 Best Practices

Kalian dianjurkan menerapkan praktik berikut. Bukti penerapannya dirangkum pada Bagian B.2.

### 1. Branching
Sesuai aturan umum di README repository, `main` fork kelompok dijaga agar tetap bisa menerima sync dari asisten. Pada tugas ini **sangat disarankan** memakai branch per fitur dengan format `<tipe>/<nama-fitur>` (contoh: `feat/login-page`, `fix/null-cart`), lalu digabungkan ke `main` melalui Pull Request. Skema Gitflow penuh (dengan `develop`) boleh dipakai, tetapi tidak diwajibkan.

### 2. Semantic Commit
Gunakan format `<tipe>(<scope>): <deskripsi>`, misalnya `feat(auth): tambah validasi email`.

| Tipe | Kegunaan |
| :--- | :--- |
| `feat` | Menambahkan fitur baru |
| `fix` | Memperbaiki bug |
| `docs` | Mengubah dokumentasi |
| `style` | Perubahan format/spasi, tanpa mengubah logika |
| `refactor` | Perubahan kode yang tidak menambah fitur atau memperbaiki bug |
| `test` | Menambah/memperbaiki pengujian |
| `chore` | Tugas rutin (build, dependensi, konfigurasi) |

### 3. Track Tasks
Gunakan **GitHub Issues** (dan opsional GitHub Projects) untuk membagi tugas dan melacak progres.
- Pecah fitur besar menjadi issue yang lebih kecil dan tetapkan penanggung jawabnya.
- Hubungkan PR dengan issue (`Closes #12`) dan tutup issue ketika selesai.

### 4. Pull Request dan Code Review
- Setiap PR berisi penjelasan deskriptif tentang apa yang dikerjakan, beserta bukti (tangkapan layar/rekaman/hasil test).
- Setiap PR di-*review* minimal **1 anggota lain**, dengan komentar konstruktif atau approval.

### 5. Pengujian dan Optimasi Performa
- Tulis pengujian untuk logika inti (unit test dan/atau pengujian alur utama). Cakupan penuh tidak diwajibkan, tetapi pengujian pada logika utama dinilai.
- Lakukan **profiling** pada setidaknya satu fitur yang berat (query besar, proses pengolahan data, render list panjang, dsb.), lalu catat temuan dan perbaikannya. Contoh alat:

| Platform | Contoh alat |
| :--- | :--- |
| Web (frontend) | Chrome DevTools (Performance/Network), Lighthouse |
| Web (backend) | Profiler bawaan bahasa, `EXPLAIN` pada query basis data, logging waktu respons |
| Python | `cProfile`, `PyInstrument` |
| Java | VisualVM, JProfiler |
| Mobile | Android Studio Profiler, Flutter DevTools, Xcode Instruments |

### 6. Penggunaan AI
Penggunaan AI **tetap harus dicatat** pada `docs/KXX_GYY_AI-Usage.md` sesuai ketentuan yang sudah berlaku.

## A.7 Pengumpulan

Pengumpulan dinilai dari **tag release**, bukan commit terakhir.

1. Pastikan seluruh pekerjaan sudah di-*commit* dan di-*push* ke `main` fork kelompok.
2. Buat release dengan tag **`v9.0`** (revisi berikutnya `v9.1`, `v9.2`, dst.) dengan target branch `main`.
3. Yang dinilai adalah **tag terakhir yang dibuat sebelum deadline**.

## A.8 Aturan Tanya Jawab

Agar semua kelompok mendapat jawaban yang sama, pertanyaan dibagi menjadi dua jalur:

| Jenis Pertanyaan | Jalur |
| :--- | :--- |
| **Ketentuan tugas**, misalnya teknologi yang diperbolehkan, struktur folder, format pengumpulan, dan penilaian | **Sheets QnA:** *[tautan sheets QnA]* |
| **Kendala teknis kelompok sendiri**, misalnya error, setup, dan penggunaan git | Grup kelompok bersama asisten masing-masing |

Ketentuan:
1. Pertanyaan tentang ketentuan tugas **wajib** diajukan melalui Sheets QnA. Periksa terlebih dahulu apakah pertanyaan serupa sudah dijawab.
2. Jika pertanyaan tentang ketentuan tugas tetap diajukan langsung kepada asisten kelompok, asisten **berhak menolak menjawab** dan meminta kelompok memasukkan pertanyaannya ke Sheets QnA.
3. Jika pertanyaan di Sheets QnA **belum dijawab dalam 24 jam**, kelompok boleh menghubungi asisten kelompok masing-masing. Cantumkan pertanyaan yang sudah diajukan di sheets tersebut.
4. Jawaban pada Sheets QnA berlaku untuk **seluruh kelompok** dan menjadi acuan jika terjadi perbedaan pemahaman.

---

# BAGIAN B: Laporan Implementasi

## B.1 Perubahan dari DPPL

Tabel B.1. Perubahan dari DPPL
 
| No | Bagian DPPL | Rancangan Awal | Implementasi Akhir | Alasan |
| :--- | :--- | :--- | :--- | :--- |
| 1 | Kelas C04 Donatur, tabel baru | Tidak ada top-up saldo; saldo hanya berkurang oleh donasi (tidak ada use case top-up di SKPL) | Top-up saldo simulasi tanpa payment gateway. Tabel `topup_saldo` (`id_topup`, `id_donatur`, `nominal`, `metode`, `waktu`); saldo bertambah dalam satu transaksi MySQL. Muncul di riwayat dengan filter Top-ups | Prototipe memiliki top-up dan alur saldo kurang; tanpa top-up donasi tidak dapat didemokan. Tabel terpisah agar atomisitas `transaksi_donasi` (KF15–KF18) tidak tercampur |
| 2 | Kelas C02 Project, atribut `statusPelaksanaan` | Atribut `statusPelaksanaan: String` tanpa daftar nilai | ENUM empat nilai: `persiapan`, `berjalan`, `ditunda`, `selesai`. Awalnya `persiapan` saat project terpublikasi; tiap pembaruan progres menyimpan nilai pada saat itu | Mengikuti empat nilai pada prototipe, dan mencegah nilai di luar daftar |
| 3 | Kelas C02 Project dan C03 Campaign, lokasi dan peta (C05) | Atribut `lokasi: String`; sebaran peta dihitung dengan `ST_Distance_Sphere` | Kolom `provinsi`, `kota`, `latitude`, `longitude`. Lat/lng diisi otomatis dari tabel koordinat provinsi (`src/lib/provinsi.ts`) saat disimpan; query peta tetap memakai `ST_Distance_Sphere` | Formulir tetap sederhana seperti prototipe (pengguna memilih provinsi dan kota), tanpa mengubah algoritma peta di DPPL. Pin dalam satu provinsi berada di titik yang sama |
| 4 | Kelas C02 Project dan C03 Campaign, `status` (UC02, UC03, UC04) | Pembuatan langsung menyimpan data; status mengikuti KF06 (draft, pending verification, published) | Pembuatan dua langkah: simpan draf (`draft`), lalu kirim (`menunggu_verifikasi`); admin mengubah menjadi `terpublikasi` atau `ditolak` (alasan wajib). Yang `ditolak` dapat diedit dan dikirim ulang. `ubahStatus` dipakai pada setiap transisi | Mengikuti prototipe (Draft, Pending review, Published, Rejected) dan KF06; memungkinkan tab "My actions" menampilkan status, alasan penolakan, dan kirim ulang |
| 5 | Kelas C02 Project, atribut jadwal (KF08, KF10, KF22) | Tidak ada atribut jadwal dan titik kumpul pada `Project`, padahal KF08, KF10, dan KF22 memerlukannya | Kolom `jadwal_mulai`, `jadwal_selesai` (DATE, wajib, mulai ≤ selesai) dan `lokasi_kumpul`. `tampilkanInstruksiKegiatan` mengambil lokasi dan jadwal ini untuk relawan berstatus `accepted` | Memenuhi KF10 (jadwal kosong ditolak) dan KF22 tanpa tabel baru; `ketersediaanJadwal` milik relawan tetap terpisah |
| 6 | Halaman Akun (UC10), saldo penggalangan | Tidak ada saldo penggalangan pada rancangan | Kartu "Fundraising balance" dihitung dari `SUM(dana_terkumpul)` project dan campaign milik pengguna; tidak disimpan di kolom | Menghindari dua sumber kebenaran untuk dana yang sama, sehingga tidak perlu sinkronisasi dan atomisitas donasi tidak terganggu |
| 7 | Penyimpanan, `Project.dokumentasiProgres` (UC09) | Berkas dokumentasi disimpan pada object storage (DPPL, Tabel 2.1) | Berkas disimpan di folder lokal `uploads/` (tidak di-commit) melalui satu antarmuka penyimpanan sehingga dapat diganti object storage | Aplikasi harus dapat dijalankan asisten tanpa akun cloud pribadi (ketentuan A.2) |
| 8 | Kelas C08 Volunteer, C10 PembuatProject, C11 AdminSistem | Tiga kelas aktor terpisah | Peran (`volunteer`, `pembuat_project`, `admin`) pada tabel `pengguna`; hak akses ditegakkan oleh `requireRole()` dan pemeriksaan kepemilikan di query | Ketiganya adalah peran satu akun, bukan entitas dengan data berbeda; operasinya dipanggil lewat controller. Dicatat di Tabel B.5 |
| 9 | Halaman Home dan tab My actions | Tidak ada use case untuk beranda dan tab My actions | Beranda (hero, cara kerja, angka dampak, ajakan bertindak) dan tab My actions diimplementasikan sesuai prototipe | Keduanya ada di prototipe dan mendukung navigasi, tetapi tidak dipetakan ke use case SKPL |
| 10 | Kelas C07 BuktiTransaksi dan C31 DetailBuktiTransaksiView (KF17) | Operasi `cetakBukti()` hanya membentuk dan menyimpan rincian bukti di basis data setelah donasi berhasil (Algo-111). Tidak ada fitur untuk mencetak bukti atau menyimpannya sebagai berkas. | Selain penyimpanan bukti oleh `cetakBukti()`, ditambahkan tombol "Print receipt" pada modal bukti dan halaman `/donasi/bukti/[idTransaksi]`. Tombol ini memanggil `window.print()`, sehingga dialog cetak browser terbuka dan pengguna dapat memilih printer atau "Save as PDF". Lembar cetak berisi rincian bukti tanpa elemen antarmuka lain. | Memenuhi kriteria penerimaan issue #28 agar donatur dapat menyimpan atau mencetak bukti donasi. Dialog cetak bawaan browser dipilih agar tidak perlu pustaka pembuat PDF atau pemrosesan tambahan di server. |
| 11 | Tabel 2.1 Rancangan Lingkungan Implementasi, *development tools* (issue #8, #9) | Pengembangan memakai VS Code, Git/GitHub, npm, dan draw.io; aplikasi berjalan di Vercel dengan MySQL | Kerangka Next.js 16 (App Router, `cacheComponents`) + TypeScript + Tailwind CSS di `src/`, dengan folder per lapisan: `components/` (View), `server/controllers`, `server/services`, `server/repositories`, `models/` (entity), dan `shared/` (tipe dan aturan yang dipakai klien dan server). Untuk pengembangan lokal ditambahkan Docker Compose (MySQL 8.4, port 3307; XAMPP port 3306 tetap didukung), ESLint, Prettier, serta `node:test` dan Vitest untuk pengujian | Aplikasi harus dapat dijalankan asisten tanpa akun cloud (ketentuan A.2). Struktur folder yang sama dengan lapisan pada *Layered Architecture* (DPPL 2.2) membuat seluruh anggota menaruh kode di tempat yang sama |
| 12 | Komponen `DatabaseConnection` (Tabel 2.3) dan skema basis data (issue #9) | `DatabaseConnection` sebagai komponen pendukung; DPPL hanya memuat query per operasi (Q-xxx), tanpa DDL lengkap | `DatabaseConnection` diwujudkan sebagai modul `server/db.ts` (bukan kelas) berisi *connection pool* `mysql2` yang dibuat saat pertama dipakai, serta fungsi `query()`, `execute()`, dan `withTransaction()`. Pool menyimpan dan membaca waktu dalam UTC (`timezone: 'Z'`) dan membaca DECIMAL sebagai angka. DDL seluruh entitas ada di `db/migrations/001_schema.sql` dan data contoh di `002_seed.sql`; keduanya dijalankan otomatis saat volume Docker masih kosong | Satu pool bersama mencegah setiap repository membuka koneksi sendiri. Pool disimpan di `globalThis` agar *hot reload* tidak membuat pool baru. Migrasi otomatis membuat basis data anggota tim dan asisten selalu sama |
| 13 | Komponen antarmuka bersama (issue #11) | Tidak ada komponen bersama; DPPL hanya memuat kelas *boundary* per use case | Ditambahkan `AppShell` yang membungkus semua halaman dengan `Navbar` (menampilkan status login, saldo, dan menu akun), `Footer`, `Modal`, dan notifikasi `Toast` di `components/ui/` | Navbar, modal, dan toast ada di seluruh layar prototipe. Satu komponen bersama menjaga tampilan konsisten dan mencegah setiap anggota membuat versinya sendiri. Komponen ini tidak memiliki kelas perancangan karena tidak memuat logika use case |
| 14 | Kelas C14 FormPendaftaranView dan C15 FormLoginView (UC01, issue #15) | Formulir pendaftaran dan login berada pada halaman yang berbeda; setelah login, `arahkanKeHalamanUtama()` mengarahkan pengguna ke halaman utama | Keduanya menjadi dua tab dalam satu modal (`AuthModal`) yang dapat dibuka dari navbar, halaman penghalang login, atau aksi yang memerlukan login. Setelah pendaftaran berhasil, pengguna langsung login. Setelah login, pengguna tetap di halaman yang sama, halaman dirender ulang, dan aksi yang tadi diminta (mis. formulir donasi) langsung dilanjutkan melalui `useWajibLogin()` | Mengikuti prototipe (modal auth dengan tab Daftar/Masuk) dan catatan issue #15 agar pengguna tidak kehilangan konteks. `arahkanKeHalamanUtama()` diwujudkan sebagai pemuatan ulang halaman saat ini |
| 15 | Kelas C16 AutentikasiController (UC01, issue #13, #14) | Atribut `pesanKesalahan` dan operasi `daftarAkun()`, `login()`, `getPesanKesalahan()` | Tidak ada atribut `pesanKesalahan`; galat dikembalikan sebagai JSON `{ ok: false, kode, pesan, bidang? }` dengan status HTTP sesuai kode galat. Ditambahkan `logout()` (`POST /api/auth/keluar`) dan `saya()` (`GET /api/auth/saya`) | Controller berupa *route handler* tanpa keadaan antarpermintaan, sehingga pesan galat dikirim dalam respons. `bidang` menunjuk kolom yang salah sesuai KF01. `logout()` diperlukan untuk menjalankan `akhiriSesi()`. `saya()` diperlukan karena layout bersifat statis (`cacheComponents`), sehingga navbar membaca status login dari klien |
| 16 | Operasi validasi dan penyimpanan pada C12 Akun (Algo-001, Algo-002) | `validasiKelengkapanInput()`, `cekKetersediaanEmail()`, `simpanAkun()`, `validasiKredensial()` mengembalikan `Boolean`; `simpanAkun()` hanya menjalankan Q-002 dan mengembalikan `false` bila email ganda | Validasi melempar `GalatAplikasi` dengan kode (`VALIDASI`, `EMAIL_TERPAKAI`, `KREDENSIAL_SALAH`, `AKUN_NONAKTIF`) dan nama kolom. Penyimpanan akun menulis baris `pengguna`, `akun`, dan `donatur` (saldo 0) dalam satu transaksi, dengan peran awal `volunteer`. Galat *duplicate key* diubah menjadi `EMAIL_TERPAKAI` | Nilai `Boolean` tidak dapat membawa pesan per kolom yang diminta KF01. Akun baru langsung dapat berdonasi dan top-up tanpa langkah tambahan; transaksi mencegah akun setengah jadi. Peletakan operasi pada service dan repository dicatat di Tabel B.5 |
| 17 | Kelas C13 SesiLogin, penyimpanan sesi di peramban (KF04, issue #14) | DPPL tidak menetapkan cara `idSesi` dibawa peramban | `idSesi` disimpan pada cookie `klimpool_sesi` dengan atribut `HttpOnly`, `SameSite=Lax`, `Secure` (di produksi), dan `maxAge` 24 jam, sama dengan `DURASI_SESI`. Logout menghapus cookie dan menandai sesi `berakhir` | Cookie `HttpOnly` tidak dapat dibaca skrip sehingga sesi lebih aman dari XSS, dan `SameSite=Lax` mengurangi risiko CSRF. Masa berlaku cookie disamakan dengan masa sesi di basis data |
| 18 | Operasi C13 `cekStatusLogin()` (Algo-005, Q-005, Q-006) | Q-005 hanya membaca `sesi_login`; sesi kedaluwarsa ditandai `berakhir` melalui Q-006 saat diperiksa | Q-005 digabung dengan `pengguna`, `akun`, dan `donatur` sehingga satu query menghasilkan sesi, data pengguna, saldo, dan status akun. Sesi juga ditolak bila akun berstatus `nonaktif`. Sesi kedaluwarsa cukup ditolak tanpa ditulis ulang; Q-006 dipakai saat logout | Navbar dan controller membutuhkan data pengguna setiap kali sesi diperiksa, sehingga satu query menghindari query kedua. Akun yang dinonaktifkan langsung kehilangan akses. Pemeriksaan tidak menulis ke basis data, sehingga tetap ringan meskipun dipanggil di hampir setiap permintaan |
| 19 | Pemeriksaan login dan peran pada controller UC02–UC10 (KF04, issue #14) | Setiap controller memanggil `SesiLogin.cekStatusLogin()` sendiri | Disediakan `penggunaSaatIni()`, `requireLogin()`, dan `requireRole()` di `server/controllers/guard.ts`; `requireLogin()` melempar `BELUM_LOGIN` dan `requireRole()` melempar `DILARANG`. Modul yang lebih dulu dibuat memakai `getIdPenggunaSaatIni()` di `server/auth/sesiSementara.ts`, yang kini membaca sesi login yang sama. Halaman `/account` memeriksa sesi di server dan menampilkan penghalang login bagi tamu | Satu titik pemeriksaan menjamin semua modul memakai aturan sesi yang sama dan memenuhi catatan issue #14. Nama berkas `sesiSementara.ts` dipertahankan agar modul relawan, dokumentasi, detail, dan progres tidak perlu diubah |
| 20 | Kelas C01 Katalog, atribut dan operasi pencarian (UC05, KF13, KF14, issue #23) | Atribut `kataKunci: String` dan `filter: String`, diisi lewat `terimaKataKunci()` dan `terapkanFilter()`, lalu `cari()` mengembalikan `List<String>` | Kata kunci dan filter menjadi satu objek `FilterKatalog` yang dibentuk per permintaan oleh `bacaFilter()`: `q` (maks. 100 karakter), `tipe` (semua, project, campaign), `kategori`, `lokasi` (provinsi atau kota), `status` (donasi, relawan, selesai), `periode` (berjalan, segera dalam 90 hari, lalu), serta paginasi `halaman` dan `batas` (bawaan 20, maks. 50). Project dan campaign terpublikasi digabung dengan `UNION ALL` menjadi satu daftar `ItemKatalog`. Ditambahkan `getOpsi()` (`GET /api/katalog/opsi`) yang mengembalikan daftar kategori dan provinsi yang memiliki aksi terpublikasi | Halaman Explore pada prototipe memiliki beberapa filter yang dapat dikombinasikan (kriteria issue #23), sehingga satu `String` filter tidak cukup. Service tidak menyimpan keadaan antarpermintaan. Paginasi membatasi ukuran respons dan mendukung tombol "Show more"; opsi provinsi diambil dari data agar filter tidak menawarkan lokasi tanpa hasil |
| 21 | Kelas C28 PencarianController, `pesanKesalahan` dan `getPesanKesalahan()` (UC05, issue #23) | Atribut `pesanKesalahan` dibaca lewat `getPesanKesalahan()` | Parameter yang tidak valid melempar `GalatValidasi` dan dikembalikan sebagai JSON `{ pesan }` dengan status 400 sebelum basis data disentuh; galat lain menjadi status 500 dengan pesan umum. Hasil kosong dikembalikan sebagai `data: []`, bukan galat | Controller berupa *route handler* tanpa keadaan antarpermintaan, sama seperti No. 15. Kriteria issue #23 meminta hasil kosong tidak dianggap galat |
| 22 | Kelas C28 PencarianController, `getDetailProject()` dan `getDetailCampaign()` (UC05, KF14, issue #25) | Detail project dan campaign diambil melalui `PencarianController` lalu ditampilkan oleh `DetailProjectView` (C21) dan `DetailCampaignView` (C18) | Detail diambil oleh `DetailService.ambil(tipe, id, idPengguna)` dan `DetailRepository`, yang dipanggil langsung oleh Server Component `MuatDetail` pada route `/project/[id]` dan `/campaign/[id]`; tidak ada endpoint API detail. Query hanya mengambil data berstatus `terpublikasi`; selain itu halaman 404 ditampilkan. `lokasi_kumpul` hanya disertakan bila pengguna adalah relawan berstatus `accepted` pada project tersebut | Halaman detail dirender di server, sehingga data tidak perlu melewati HTTP. Logika tetap berada di lapisan service dan repository, bukan di View. Pembatasan `terpublikasi` memenuhi kriteria issue #25, dan pembatasan titik kumpul menjaga data KF22 tidak terbuka untuk publik |
| 23 | Kelas C05 PetaWilayah, operasi sebaran (UC06, UC07, issue #29) | `tampilkanSebaranProject(): List<Project>` dan `tampilkanSebaranCampaign(): List<Campaign>` berdasarkan atribut `koordinatPusat` dan `radius`; peta dibuka dalam alur `DonasiController` (UC06) dan `RelawanController` (UC07) | `koordinatPusat` dan `radius` menjadi parameter konstruktor; radius 0 berarti seluruh wilayah, radius > 0 memakai `ST_Distance_Sphere`. Kedua operasi mengembalikan `TitikSebaran` (id, tipe, judul, lokasi, kategori, koordinat, target dan dana terkumpul), bukan objek lengkap. Campaign hanya diambil bila periodenya belum berakhir. Ditambahkan `PetaController` dan `GET /api/peta?jenis=&pusat=lat,lng&radius=` (radius maks. 20.000 km). `DonasiController` dan `RelawanController` tidak memanggil `PetaWilayah` | Pin dan popup hanya memerlukan ringkasan, sehingga respons tetap kecil. Satu kelas dan satu endpoint dipakai untuk UC06 dan UC07 tanpa duplikasi kode (kriteria issue #29). Peta adalah langkah penelusuran sebelum donasi atau pendaftaran, sehingga dipisahkan dari kedua controller tersebut |
| 24 | Kelas C27 FormPencarianView dan C29 FormPetaWilayahView, halaman Explore (UC05, UC06, UC07, issue #24, #29) | Dua kelas *boundary* terpisah: `FormPencarianView` untuk pencarian (UC05) dan `FormPetaWilayahView` untuk peta sebaran (UC06, UC07) | Keduanya berada pada satu halaman `/explore` (`ExploreView`): kolom cari dan filter, daftar kartu hasil, dan peta Indonesia (SVG) berdampingan. Titik peta diambil dari hasil katalog yang sama, sehingga peta selalu mengikuti filter, termasuk aksi yang donasinya sudah tutup. Menyorot kartu ikut menyorot pin, dan memilih pin membuka popup bertaut ke detail. Filter disimpan di URL sehingga tautan footer (mis. "Find volunteer work") langsung membuka filter yang sesuai. `GET /api/peta` dan `PetaSebaranMemuat` tetap tersedia untuk halaman lain | Mengikuti prototipe yang menampilkan pencarian, filter, dan peta dalam satu halaman Explore. Satu sumber data mencegah daftar dan peta menampilkan hasil berbeda, dan menghindari permintaan kedua ke server |

## B.2 Bukti Penerapan Best Practices

Tabel B.2. Bukti Best Practices

| Praktik | Bukti | Keterangan |
| :--- | :--- | :--- |
| Branching | [Daftar branch](https://github.com/Brynpamungkas/IF2150-RPL-K02-G08/branches/all) | Gitflow: branch per issue (`<tipe>/<nama-fitur>`) digabung ke `develop` lewat PR, lalu `develop` ke `main` |
| Semantic commit | [Riwayat commit `develop`](https://github.com/Brynpamungkas/IF2150-RPL-K02-G08/commits/develop) | Format `<tipe>(<scope>): <deskripsi>`. Contoh: `chore(test): tambah kerangka vitest`, `feat(katalog): endpoint searching & opsi filter`, `feat(explore): implement UI for explore + map`, `feat(detail): halaman detail project`, `fix(katalog): campaign yang belum mulai tidak terbuka donasi` |
| Track tasks | [Issues](https://github.com/Brynpamungkas/IF2150-RPL-K02-G08/issues) | 1 issue/fitur dengan PIC dan reviewer. |
| Pull request dan review | [PR #53](https://github.com/Brynpamungkas/IF2150-RPL-K02-G08/pull/53), [PR #54](https://github.com/Brynpamungkas/IF2150-RPL-K02-G08/pull/54), [PR #56](https://github.com/Brynpamungkas/IF2150-RPL-K02-G08/pull/56) | Contoh: PR Neysa (#52 kerangka Vitest, #53 API katalog, #54 dan #75 Explore, #55 detail, #56 peta) di-merge oleh Bryan. |
| Pengujian | [`src/tests/`](https://github.com/Brynpamungkas/IF2150-RPL-K02-G08/tree/develop/src/tests) | Kerangka Vitest (`src/vitest.config.ts`). Contoh: tes katalog, Explore, detail, dan peta: 11 berkas `*.spec.ts`, **143 tes, 143 lulus, 0 gagal** (dijalankan 10 Nov 2026 pada `develop` commit `bb95d5c`, Node v24.13.0). |

### B.2.1 Profiling dan Optimasi

Pilih minimal satu fitur yang diprofil.

| Informasi | Keterangan |
| :--- | :--- |
| Fitur / proses yang diprofil | *[Nama fitur]* |
| Alat | *[mis. Chrome DevTools, cProfile, EXPLAIN]* |
| Temuan (sebelum) | *[Bottleneck yang ditemukan, sertakan angka/tangkapan layar]* |
| Perbaikan | *[Yang diubah]* |
| Hasil (sesudah) | *[Perbandingan dengan sebelumnya]* |

Jika tidak ada perbaikan yang perlu dilakukan, jelaskan hasil profiling dan alasan kenapa fitur tersebut sudah memadai.

## B.3 Kendala dan Catatan Penting

Tuliskan kendala yang ditemui, fitur yang belum sempurna (*known issues*), serta hal yang perlu diketahui asisten saat menjalankan atau menilai aplikasi (misalnya akun uji khusus, urutan menjalankan, atau batasan).

## B.4 Kontribusi Anggota

Tabel B.4. Kontribusi Anggota

| NIM | Nama | Modul / Fitur yang Dikerjakan | Persentase Kontribusi |
| :--- | :--- | :--- | :--- |
| *13525134* | Sahla Nailah Salsabilla | donasi; API atomic, modal + idempotency key, bukti transaksi (#26, #27, #28), halaman Akun dan dompet beserta top-up saldo (#44, #30), riwayat transaksi dan progres (API dan UI; #38, #39), serta pengukuran dan optimasi performa (#42) | *20%* |
| *13525140* | Nayla Putri Ghaisani | Kerangka proyek (#8), basis data dan *connection pool* (#9), komponen UI bersama (#11), UC01 registrasi, login, sesi, dan hak akses (#13–#15), beranda (#40) | *20%* |
| *13525080* | Neysa Alya Mukhbita | UC05 penelusuran: API pencarian dan penyaringan katalog (#23), halaman Explore (#24), halaman detail project dan campaign (#25); peta sebaran project dan campaign untuk UC06 dan UC07 (#29); kerangka pengujian Vitest beserta tes katalog, Explore, detail, dan peta; `src/README.md` | *20%* |
| *...* | *...* | *...* | *...* |

## B.5 Traceability Kelas Perancangan ke Implementasi

Pemetaan dari **setiap kelas perancangan** pada DPPL (Tabel 4.1) ke wujud implementasinya. Bentuk implementasi bebas (kelas, fungsi, komponen, *route/handler*, *stored procedure*, skrip, dsb.), tetapi tiap kelas perancangan harus muncul pada tabel ini. Jika implementasi berupa kelas dengan nama yang sama, tetap dicantumkan.

Tabel B.5. Traceability Kelas Perancangan ke Implementasi

| ID Kelas | Nama Kelas Perancangan | Bentuk Implementasi | Lokasi (File dan Nama) | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| C01 | Katalog | Kelas service, kelas repository, dan tipe | `src/server/services/katalog.service.ts` - `KatalogService`, `keItem()`; `src/server/repositories/katalog.repository.ts` - `KatalogRepository`, `bangunKueri()`; `src/shared/katalog.ts` - `FilterKatalog`, `ItemKatalog` | Atribut `kataKunci` dan `filter` disatukan dalam objek `FilterKatalog` (kata kunci, tipe, kategori, lokasi, status, periode, halaman, batas) yang dikirim per permintaan, bukan disimpan di objek. `terimaKataKunci()` dan `terapkanFilter()` diwujudkan oleh `bacaFilter()` pada C28. `cari()` adalah `KatalogService.cari()`, yang menyusun query berparameter lewat `bangunKueri()` dan hanya mengambil data berstatus `terpublikasi` (KF14). `tampilkanHasil()` diwujudkan oleh `keItem()`, yang membentuk `ItemKatalog` (persentase dana, status donasi dan relawan) |
| C05 | PetaWilayah | Kelas service dan kelas repository | `src/server/services/peta.service.ts` - `PetaWilayah`; `src/server/repositories/peta.repository.ts` - `PetaRepository` | Atribut `koordinatPusat` dan `radius` menjadi parameter konstruktor; radius 0 berarti seluruh wilayah. `tampilkanSebaranProject()` dan `tampilkanSebaranCampaign()` mengembalikan daftar `TitikSebaran` (id, judul, lokasi, koordinat, dana), bukan objek `Project`/`Campaign` lengkap. Bila radius > 0, query memakai `ST_Distance_Sphere` (Q-101 s.d. Q-104); campaign hanya diambil bila periodenya belum berakhir. Dipanggil oleh `PetaController.getSebaran()` (`src/server/controllers/peta.controller.ts`, `GET /api/peta`) |
| C18 | DetailCampaignView | Komponen React dan route halaman | `src/components/views/DetailCampaignView.tsx` - `DetailCampaignView`; `src/app/campaign/[id]/page.tsx`; `src/components/detail/MuatDetail.tsx` - `MuatDetail` | `bukaHalamanCampaign(idCampaign)` diwujudkan oleh route `/campaign/[id]`: `MuatDetail` mengambil data lewat `DetailService.ambil('campaign', id)` dan menampilkan 404 bila campaign tidak ada atau belum terpublikasi. `tampilkanDetail()` diwujudkan oleh `HeroDetail`, `KerangkaDetail` (tab About, Needs, Progress, Use of funds tanpa muat ulang halaman), dan `PanelSamping` dengan slot tombol donasi (`TombolDonasi`) dan aksi pemilik (`AksiPemilik`) |
| C21 | DetailProjectView | Komponen React dan route halaman | `src/components/views/DetailProjectView.tsx` - `DetailProjectView`; `src/app/project/[id]/page.tsx`; `src/components/detail/` - `KerangkaDetail`, `PanelSamping`, `PanelTentang`, `PanelKebutuhan`, `PanelProgres`, `PanelDana` | Sama dengan C18 untuk project. `PanelSamping` memuat slot tombol milik modul lain: `TombolDonasi` (donasi), `TombolRelawan` (pendaftaran relawan), dan `AksiPemilik` (kelola dan progres). Tab Progress hanya menampilkan data. Titik kumpul ditampilkan hanya untuk relawan yang diterima (KF22) |
| C27 | FormPencarianView | Komponen React dan route halaman | `src/components/views/FormPencarianView.tsx` - `FormPencarianView`; `src/components/views/ExploreView.tsx` - `ExploreView`; `src/components/ui/KartuHasil.tsx` - `KartuHasil`; `src/app/explore/page.tsx` | `bukaKatalog()` diwujudkan oleh route `/explore`. `masukkanKriteria()` adalah kolom cari dan filter (tipe, kategori, lokasi, status, periode) yang memperbarui URL dan memanggil `GET /api/katalog`. `tampilkanHasil()` menampilkan `KartuHasil` (progres dana dan status) dengan tombol "Show more" (`src/shared/explorePaging.ts`). `tampilkanPesanKesalahan()` menampilkan pesan galat dengan tombol coba lagi, serta pesan bila tidak ada hasil |
| C28 | PencarianController | Kelas controller dan route handler | `src/server/controllers/pencarian.controller.ts` - `PencarianController`, `bacaFilter()`, `GalatValidasi`; `src/app/api/katalog/route.ts` - `GET /api/katalog`; `src/app/api/katalog/opsi/route.ts` - `GET /api/katalog/opsi` | `cari()` dan `getDaftarDipublikasikan()` sesuai DPPL dan dapat diakses tanpa login; ditambah `getOpsi()` untuk pilihan filter kategori dan provinsi. Atribut `pesanKesalahan` dan `getPesanKesalahan()` diganti `GalatValidasi`, yang dikirim sebagai JSON `{ pesan }` dengan status 400. `getDetailProject()` dan `getDetailCampaign()` tidak berada di controller ini, tetapi diwujudkan oleh `DetailService.ambil()` (`src/server/services/detail.service.ts`) dan `DetailRepository` (`src/server/repositories/detail.repository.ts`), yang dipanggil langsung oleh Server Component `MuatDetail` |
| C29 | FormPetaWilayahView | Komponen React | `src/components/views/FormPetaWilayahView.tsx` - `FormPetaWilayahView`; `src/components/ui/PetaSebaran.tsx` - `PetaSebaran`; `src/components/ui/PetaSebaranMemuat.tsx` - `PetaSebaranMemuat`; `src/shared/peta.ts` | `bukaPeta()` diwujudkan oleh peta pada halaman Explore, yang dipakai baik oleh donatur (UC06) maupun relawan (UC07). `tampilkanPeta(sebaran)` diwujudkan oleh `PetaSebaran`: peta Indonesia (SVG) dengan pin per project/campaign dan popup ringkasan yang bertaut ke halaman detail. `PetaSebaranMemuat` memuat titik dari `GET /api/peta` untuk halaman lain |
| *...* | *...* | *...* | *...* | *...* |

Catatan:
- Satu kelas perancangan boleh diwujudkan oleh beberapa file/unit, dan satu file/unit boleh mewujudkan beberapa kelas perancangan. Tuliskan semuanya.
- Kelas perancangan yang **tidak diimplementasikan** atau **digabung/dipecah** tetap dicantumkan, dan alasannya dicatat di Bagian B.1.
