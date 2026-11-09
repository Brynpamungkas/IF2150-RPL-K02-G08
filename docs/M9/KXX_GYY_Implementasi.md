<h1>
IF2150 REKAYASA PERANGKAT LUNAK
<br>
TUGAS 9
<br>
IMPLEMENTASI PERANGKAT LUNAK
</h1>
<br>

## KlimPooL
### *[Logo Perangkat Lunak]*
 
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
**Asistensi akbar:** *[Hari, DD Bulan YYYY, HH.MM WIB, lokasi/link]*

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

## B.2 Bukti Penerapan Best Practices

Tabel B.2. Bukti Best Practices

| Praktik | Bukti | Keterangan |
| :--- | :--- | :--- |
| Branching | *[Tautan ke daftar branch / graph commit]* | *[Skema yang dipakai]* |
| Semantic commit | *[Tautan ke riwayat commit]* | *[Ringkasan]* |
| Track tasks | *[Tautan ke Issues/Projects]* | *[Jumlah issue, pembagian]* |
| Pull request dan review | *[Tautan ke 2-3 PR representatif]* | *[Siapa me-review siapa]* |
| Pengujian | *[Tautan ke `src/tests/` dan hasil test]* | *[Apa yang diuji, cara menjalankan]* |

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
| *[NIM 1]* | *[Nama]* | *[Modul/fitur]* | *[%]* |
| *13525140* | Nayla Putri Ghaisani | Kerangka proyek (#8), basis data dan *connection pool* (#9), komponen UI bersama (#11), UC01 registrasi, login, sesi, dan hak akses (#13–#15), beranda (#40) | *20%* |
| *...* | *...* | *...* | *...* |

## B.5 Traceability Kelas Perancangan ke Implementasi

Pemetaan dari **setiap kelas perancangan** pada DPPL (Tabel 4.1) ke wujud implementasinya. Bentuk implementasi bebas (kelas, fungsi, komponen, *route/handler*, *stored procedure*, skrip, dsb.), tetapi tiap kelas perancangan harus muncul pada tabel ini. Jika implementasi berupa kelas dengan nama yang sama, tetap dicantumkan.

Tabel B.5. Traceability Kelas Perancangan ke Implementasi

| ID Kelas | Nama Kelas Perancangan | Bentuk Implementasi | Lokasi (File dan Nama) | Keterangan |
| :--- | :--- | :--- | :--- | :--- |
| *[C01]* | *[Nama kelas pada DPPL]* | *[mis. Kelas / Fungsi / Komponen / Route / Tabel]* | *[mis. `src/models/user.py` - `User`]* | *[Cara atribut dan operasi kelas diwujudkan; "-" jika tidak ada penjelasan tambahan]* |
| *[C02]* | *[Nama kelas pada DPPL]* | *[Bentuk implementasi]* | *[mis. `src/components/LoginForm.tsx` - `LoginForm`]* | *[mis. atribut menjadi *state*, operasi menjadi *handler*]* |
| *[C03]* | *[Nama kelas pada DPPL]* | *[Bentuk implementasi]* | *[mis. `src/routes/auth.js` - `POST /login`]* | *[Keterangan]* |
| *...* | *...* | *...* | *...* | *...* |

Catatan:
- Satu kelas perancangan boleh diwujudkan oleh beberapa file/unit, dan satu file/unit boleh mewujudkan beberapa kelas perancangan. Tuliskan semuanya.
- Kelas perancangan yang **tidak diimplementasikan** atau **digabung/dipecah** tetap dicantumkan, dan alasannya dicatat di Bagian B.1.
