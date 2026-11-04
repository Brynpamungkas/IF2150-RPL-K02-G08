# KlimPooL

Platform donasi dan relawan untuk proyek iklim.
Tugas Besar IF2150 Rekayasa Perangkat Lunak, Kelas 02 Kelompok 08.

## Teknologi

- Next.js 16.4.4, React 19.3.0, TypeScript
- Tailwind CSS
- Node.js >= 20 (lihat `.nvmrc`)
- MySQL (akan dilengkapi)

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

| Perintah | Fungsi |
| --- | --- |
| `npm run lint` | Cek kode dengan ESLint |
| `npm run format` | Rapikan kode dengan Prettier |
| `npm run build` | Build untuk produksi |

## Struktur Folder

Arsitektur berlapis (View, Controller, Service, Repository) sesuai DPPL.

- `app/`: halaman dan route (View)
- `controllers/`: Controller
- `services/`: logika bisnis (Service)
- `repositories/`: akses database (Repository)
- `lib/`: utilitas bersama
- `tests/`: pengujian

## Konfigurasi, Akun Uji, Modul, dan Skema Database

Bagian ini akan dilengkapi seiring pengerjaan: konfigurasi `.env` dan database, akun uji tiap peran, daftar modul beserta pembagian anggota, dan daftar tabel.

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

| Tipe | Kegunaan |
| --- | --- |
| `feat` | Menambahkan fitur baru |
| `fix` | Memperbaiki bug |
| `docs` | Mengubah dokumentasi |
| `style` | Perubahan format, tanpa mengubah logika |
| `refactor` | Perubahan kode tanpa menambah fitur atau memperbaiki bug |
| `test` | Menambah atau memperbaiki pengujian |
| `chore` | Tugas rutin (build, dependensi, konfigurasi) |