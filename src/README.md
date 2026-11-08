# KlimPooL

Platform donasi dan relawan untuk proyek iklim.
Tugas Besar IF2150 Rekayasa Perangkat Lunak, Kelas 02 Kelompok 08.

## Teknologi

- Next.js 16.4.4, React 19.3.0, TypeScript
- Tailwind CSS
- Node.js >= 20 (lihat `.nvmrc`)
- MySQL 8 (InnoDB), lihat bagian Menyiapkan Database di bawah

## Prasyarat dan Instalasi

1. Pasang Node.js versi 20 atau lebih baru.
2. Dari root repo, masuk ke folder aplikasi dan pasang dependensi:

```bash
cd src
npm install
```

## Menjalankan Aplikasi

```bash
npm run dev
```

Buka http://localhost:3000.

Perintah lain:

| Perintah         | Fungsi                       |
| ---------------- | ---------------------------- |
| `npm run lint`   | Cek kode dengan ESLint       |
| `npm run format` | Rapikan kode dengan Prettier |
| `npm run build`  | Build untuk produksi         |

## Struktur Folder

## Struktur Folder

```
src/
  app/              entry point Next.js: layout, page; app/api/ = batas HTTP client-server
  components/
    ui/             komponen umum (Modal, Toast, Navbar, Footer)
    views/          kelas boundary (FormLoginView, dst.)
  db/               migration SQL (schema + seed)
  models/           entitas
  scripts/          skrip bantu
  server/           kode server-only
    controllers/
    services/
    repositories/
    db.ts           koneksi MySQL (connection pool)
  shared/           hanya yang aman dibaca browser: tipe, konstanta, validasi murni
  tests/            pengujian
```

## Konfigurasi, Akun Uji, Modul, dan Skema Database

## Konfigurasi, Akun Uji, Modul, dan Skema Database

### Konfigurasi `.env`

Semua konfigurasi koneksi database dibaca dari file `.env` di folder `src/`. File ini **tidak boleh di-commit** (sudah masuk `.gitignore`). Salin dari contoh lalu sesuaikan:

```powershell
# Windows PowerShell
Copy-Item .env.example .env
```

```bash
# macOS / Linux / Git Bash
cp .env.example .env
```

| Variabel | Fungsi | Contoh |
| --- | --- | --- |
| `DB_HOST` | Alamat server MySQL | `localhost` |
| `DB_PORT` | Port MySQL (lihat opsi di bawah) | `3307` (Docker) atau `3306` (XAMPP) |
| `DB_NAME` | Nama database | `klimpool` |
| `DB_USER` | User database | `klimpool` (Docker) atau `root` (XAMPP) |
| `DB_PASSWORD` | Password user database | sesuaikan |
| `DB_ROOT_PASSWORD` | Password root, hanya dipakai Docker | sesuaikan |
| `DB_CONNECTION_LIMIT` | Jumlah maksimum koneksi di pool | `10` |
| `DOKUMENTASI_DRIVER` | Jenis penyimpanan berkas dokumentasi progres | `lokal` |
| `DOKUMENTASI_DIR` | Folder penyimpanan berkas dokumentasi | `./uploads` |

Koneksi dikelola oleh `server/db.ts` (connection pool `mysql2`). Repository memakai fungsi `query`, `execute`, dan `withTransaction` dari file tersebut.

### Berkas Dokumentasi Progres

Berkas dokumentasi yang diunggah Pembuat Project disimpan di sistem berkas lokal,
bukan di layanan penyimpanan objek seperti yang ditulis DPPL, agar aplikasi dapat
dijalankan tanpa akun layanan awan. Perbedaan ini dicatat pada laporan B.1.

- Lokasi default `src/uploads/progres/<id_project>/<uuid>.<ekstensi>`. Folder
  `uploads/` sudah masuk `.gitignore`, jadi berkas unggahan tidak ikut ter-commit.
- Format yang diterima: JPG, PNG, WebP, dan PDF. Ukuran maksimal 50 MB per berkas
  sesuai Tabel 4.2 DPPL.
- Tipe MIME dari peramban diperiksa ulang di peladen terhadap beberapa byte
  pertama berkas, sehingga berkas yang diganti namanya tetap ditolak.
- Berkas disajikan lewat `GET /api/dokumentasi/<id_project>/<nama>`. Dokumentasi
  project yang sudah terpublikasi terbuka untuk umum; project yang masih draft,
  menunggu verifikasi, atau ditolak hanya dapat dilihat pembuatnya dan Admin Sistem.
- Mengganti ke penyimpanan objek nanti cukup menambah satu implementasi
  `PenyimpananDokumentasi` di `server/storage/dokumentasiStorage.ts` dan satu
  cabang pada `getPenyimpananDokumentasi()`.

### API Relawan

Pendaftaran relawan dan pengelolaannya (UC07, UC08) ditangani `RelawanController`
(C34) di `server/controllers/`, dengan aturan bisnis di `server/services/relawanService.ts`.
Sesi sementara dibaca dari cookie `klimpool_dev_user` sampai issue #14 selesai.

| Metode dan alamat | Fungsi | Akses |
| --- | --- | --- |
| `POST /api/projects/<id>/relawan` | Mendaftar sebagai relawan, status awal `pending` | Pengguna yang sudah masuk |
| `GET /api/projects/<id>/relawan` | Daftar pendaftar (kosong bila belum ada) | Pembuat project |
| `PATCH /api/projects/<id>/relawan/<idPendaftaran>` | Terima atau tolak, badan `{"keputusan":"accepted"}` atau `"rejected"` | Pembuat project |

Badan `POST`: `{ "dataDiri": { "nama", "telepon", "kota" }, "keahlian": [], "pengalaman": "", "jadwal": [] }`.
Semua kolom wajib diisi; kesalahan per kolom dikembalikan pada `galat` dengan status 400.
Pendaftaran ditolak (409) bila pendaftaran project ditutup, pengguna sudah pernah
mendaftar, atau kuota relawan yang berstatus `accepted` sudah penuh. Pendaftaran ganda
juga dijaga `UNIQUE KEY (id_volunteer, id_project)` di basis data.

### Menyiapkan Database

Pilih salah satu opsi. Keduanya memakai file migration yang sama di `db/migrations/`:

1. `001_schema.sql`: membuat semua tabel (MySQL 8, InnoDB, utf8mb4).
2. `002_seed.sql`: mengisi data contoh dari prototipe (semua fiktif). Jalankan **setelah** `001_schema.sql`.

#### Opsi A: Docker (port 3307)

Prasyarat: Docker Desktop terpasang dan berjalan. Dari folder `src/`:

```bash
cp .env.example .env      # PowerShell: Copy-Item .env.example .env
npm run db:up             # sama dengan: docker compose up -d
```

- Migration dijalankan otomatis, berurutan, hanya saat volume masih kosong.
- Port host default **3307** supaya tidak bentrok dengan MySQL/XAMPP lokal di 3306.
- Matikan database: `npm run db:down`.
- Ulang dari nol (hapus data lalu seed ulang): `npm run db:reset`.

#### Opsi B: XAMPP (port 3306)

Prasyarat: XAMPP terpasang, modul **MySQL** sudah di-start di XAMPP Control Panel.

Isi `.env` seperti ini (password root XAMPP default-nya kosong):

```
DB_HOST=localhost
DB_PORT=3306
DB_NAME=klimpool
DB_USER=root
DB_PASSWORD=
DB_ROOT_PASSWORD=
DB_CONNECTION_LIMIT=10
```

Lalu dari folder `src/` (PowerShell), sesuaikan path XAMPP jika berbeda:

```powershell
$mysql = "C:\xampp\mysql\bin\mysql.exe"
& $mysql -u root -e "CREATE DATABASE klimpool CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
cmd /c "$mysql -u root klimpool < db\migrations\001_schema.sql"
cmd /c "$mysql -u root klimpool < db\migrations\002_seed.sql"
```

Alternatif lewat phpMyAdmin (`http://localhost/phpmyadmin`): buat database `klimpool`, lalu tab **Import** untuk `001_schema.sql` dan setelah itu `002_seed.sql`.

Untuk mengulang dari nol: `& $mysql -u root -e "DROP DATABASE klimpool;"` lalu ulangi perintah di atas.

#### Memeriksa Hasilnya

```powershell
& $mysql -u root klimpool -e "SHOW TABLES; SELECT id_pengguna, nama, peran FROM pengguna;"
```

Hasil yang benar: 11 tabel dan 10 pengguna. Untuk Docker, ganti dengan klien MySQL milikmu dan port 3307, atau jalankan `docker exec -it klimpool-db mysql -uroot -p klimpool`.

Setelah database siap, jalankan aplikasi dengan `npm run dev`.

### Akun Uji

Semua akun demo memakai password **`klimpool123`** (disimpan sebagai hash bcrypt cost 12). Data hanya untuk pengembangan dan sepenuhnya fiktif.

| Peran               | Nama           | Email                 |
| ------------------- | -------------- | --------------------- |
| Admin               | Review Team    | `admin@klimpool.id`   |
| Pembuat project     | Sari Wulandari | `sari@klimpool.id`    |
| Pembuat project     | Dimas Pratama  | `dimas@klimpool.id`   |
| Pembuat project     | Rina Hapsari   | `rina@klimpool.id`    |
| Volunteer / donatur | Andi Rahman    | `andi@klimpool.id`    |
| Volunteer / donatur | Nadia Putri    | `nadia@klimpool.id`   |
| Volunteer / donatur | Fajar Nugroho  | `fajar@klimpool.id`   |
| Volunteer / donatur | Lestari Ayu    | `lestari@klimpool.id` |
| Volunteer / donatur | Bima Saputra   | `bima@klimpool.id`    |
| Volunteer / donatur | Sekar Ningrum  | `sekar@klimpool.id`   |

### Modul dan Pembagian Anggota

| Modul                                                                                                                                                  | PIC  | Reviewer |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---- | -------- |
| Kerangka aplikasi, database, autentikasi (login, sesi, `requireLogin()` dan `requireRole()`), komponen bersama (navbar, footer, modal, toast), beranda | Naya | Ney      |
| Explore (pencarian, filter, peta) dan halaman detail                                                                                                   | Ney  | -        |

Anggota lain: lengkapi baris modul masing-masing di tabel ini.

### Skema Database

Ada 11 tabel, semuanya InnoDB. Acuan: DPPL Tabel 4.1 dan 4.2, query Q-001 sampai Q-137, serta Tabel B.1 laporan M9.

| Tabel                 | Fungsi                                                                                   |
| --------------------- | ---------------------------------------------------------------------------------------- |
| `pengguna`            | Data profil pengguna dan perannya (`volunteer`, `pembuat_project`, `admin`)              |
| `akun`                | Kredensial login: email (unik) dan hash password                                         |
| `sesi_login`          | Sesi login aktif beserta waktu kedaluwarsa                                               |
| `donatur`             | Saldo donasi tiap pengguna non-admin (`saldo >= 0`)                                      |
| `campaign`            | Campaign penggalangan dana beserta status verifikasi                                     |
| `project`             | Project lapangan beserta kuota relawan dan status pelaksanaan                            |
| `transaksi_donasi`    | Riwayat donasi (`nominal > 0`, `idempotency_key` unik agar donasi tidak terproses ganda) |
| `bukti_transaksi`     | Bukti/rincian untuk setiap transaksi donasi (satu per transaksi)                         |
| `pendaftaran_relawan` | Pendaftaran relawan ke project (unik per pasangan `id_volunteer` dan `id_project`)       |
| `progres_project`     | Catatan progres, milestone, dan dana terpakai tiap project                               |
| `topup_saldo`         | Riwayat top up saldo donatur (`nominal > 0`)                                             |

Catatan: `dana_terkumpul` pada data seed memakai angka prototipe (statis), sehingga tidak sama dengan jumlah di `transaksi_donasi`. Donasi baru akan menambahkannya.

## Aturan Git

### Branch

- `main`: dijaga agar tetap bisa disinkronkan asisten. Rilis `v9.0` dibuat dari sini.
- `develop`: branch integrasi, dibuat dari `main`.
- `feat/*`: fitur baru.
- `fix/*`: perbaikan bug.
- `refactor/*`: perbaikan kode tanpa menambah fitur.

### Alur Kerja

1. Buat branch dari `develop`.
2. Kerjakan fitur.
3. `git pull` dari `develop` untuk menarik perubahan terbaru dan menghindari merge conflict.
4. Buat Pull Request ke `develop` (cantumkan `Closes #<nomor issue>`).
5. Code review oleh minimal 1 anggota lain.
6. Merge setelah di-approve.

### Format Commit

`<tipe>(<scope>): <deskripsi>`, contoh `feat(auth): add email validation`.

| Tipe       | Kegunaan                                                 |
| ---------- | -------------------------------------------------------- |
| `feat`     | Menambahkan fitur baru                                   |
| `fix`      | Memperbaiki bug                                          |
| `docs`     | Mengubah dokumentasi                                     |
| `style`    | Perubahan format, tanpa mengubah logika                  |
| `refactor` | Perubahan kode tanpa menambah fitur atau memperbaiki bug |
| `test`     | Menambah atau memperbaiki pengujian                      |
| `chore`    | Tugas rutin (build, dependensi, konfigurasi)             |
