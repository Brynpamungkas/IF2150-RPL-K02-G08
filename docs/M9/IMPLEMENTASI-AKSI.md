# Implementasi Aksi — UC02, UC03, UC04

PIC: Bryan. Reviewer yang ditugaskan: Sahla. Branch lokal: `feat/aksi-pembuat`.
Basis implementasi: `develop` commit `6c3b021`. Perubahan belum dipush/merge.

## Cakupan dan keterlacakan

| Issue / kebutuhan | Implementasi | Pengujian |
| --- | --- | --- |
| #16–17, KF05–KF07, UC02 | Campaign Draft, form lengkap, galat per kolom, notifikasi ID dan tautan detail privat | Validasi nominal/periode/teks, API database, browser create/retry/preview |
| #18–19, KF08–KF10, UC03 | Project dua tahap; informasi pertama menghasilkan ID; Back mempertahankan isian; tahap lengkap menyimpan kebutuhan/jadwal/titik kumpul | API tahap awal/lengkap, browser Back tanpa ID ganda, kebutuhan dana nol |
| #20–22, KF11–KF12, UC04 | Pengajuan pemilik, antrean admin, persetujuan, penolakan beralasan, revisi/pengajuan ulang | Peran/pemilik/sesi/asal request, transisi, dua keputusan bersamaan, browser |
| #45 | Komponen `MyActions`, daftar milik sendiri, empat status, alasan penolakan, Kelola/Ajukan Ulang/Progres | Isolasi pemilik pada API; browser status, alasan, pengajuan ulang dan keberadaan tautan Progres |

Komponen dan kontrak:

- `src/shared/aksi.ts`, `validasiAksi.ts`: DTO dan validasi bersama.
- `AksiRepository` → `AksiService` → controller campaign/project/verifikasi: penyimpanan dan aturan bisnis.
- `src/components/aksi/`: form, detail privat, pengajuan, antrean/keputusan admin, My Actions.
- Tidak mengganti kontrak `CampaignProjectRepository` yang dipakai donasi.
- Tidak memerlukan perubahan skema; menggunakan kolom yang sudah ada.
- JSON rincian dana mengikuti seed dan detail publik: `[{"uraian":"Peralatan","nominal":10000}]`.

## Halaman

| URL | Akses / fungsi |
| --- | --- |
| `/start?type=campaign` | Pembuat Project; membuat campaign Draft |
| `/start?type=project` | Pembuat Project; formulir project dua tahap |
| `/manage/[jenis]/[id]` | Pemilik; preview privat, edit Draft/Ditolak, pengajuan |
| `/my-actions` | Pembuat Project; daftar aksi milik sendiri sementara menunggu integrasi slot Account |
| `/admin` | Admin; hanya antrean Menunggu Verifikasi |
| `/admin/pengajuan/[jenis]/[id]` | Admin; detail dan keputusan |

`jenis` adalah `campaign` atau `project`. Preview Draft **tidak** memakai atau mengubah route detail publik `/campaign/[id]` dan `/project/[id]` milik modul detail.

## API

Respons sukses: `{ "aksi": <DTO atau daftar DTO> }`. Galat: `{ "pesan": "...", "galat": { "namaKolom": "..." } }`; `galat` hanya ada untuk validasi kolom.
Status HTTP: 400 masukan salah, 401 sesi tidak valid, 403 peran/asal salah, 404 aksi tidak ada/bukan miliknya, 409 transisi tidak diizinkan. GET privat memberi `Cache-Control: no-store`.

| Method / URL | Fungsi |
| --- | --- |
| `POST /api/campaigns` | Membuat campaign Draft (201) |
| `POST /api/projects` | Membuat project Draft (201); `tahap: "informasi"` untuk tahap awal |
| `GET /api/aksi/[jenis]/[id]` | Detail privat pemilik atau admin |
| `PATCH /api/aksi/[jenis]/[id]` | Mengubah Draft/Ditolak milik sendiri; mempertahankan kolom yang tidak dikirim |
| `POST /api/aksi/[jenis]/[id]/pengajuan` | Mengajukan/mengajukan ulang; validasi kelengkapan dilakukan lagi di server |
| `GET /api/aksi/milik-saya` | Daftar aksi milik sesi saat ini |
| `GET /api/verifikasi` | Antrean Menunggu Verifikasi; admin saja |
| `POST /api/verifikasi/[jenis]/[id]` | Admin; `{ "keputusan": "setujui" }` atau `{ "keputusan": "tolak", "alasan": "..." }` |

Contoh badan campaign (pemilik dan status ditetapkan server):

```json
{
  "judul": "Pemulihan pesisir",
  "deskripsi": "Pengadaan sarana pemulihan pesisir desa.",
  "provinsi": "Bali",
  "kota": "Tabanan",
  "targetDana": 10000000,
  "mulai": "2026-11-08",
  "selesai": "2026-12-08",
  "rincianDana": [{ "uraian": "Peralatan", "nominal": 10000000 }]
}
```

Project tahap awal wajib `judul`, `deskripsi`, `tujuan`, `provinsi`, `kota`, dan `tahap: "informasi"`. Tahap lengkap (`PATCH`, `tahap: "lengkap"`) juga wajib `targetDana` (boleh nol), `kebutuhan` (logistik), `kriteriaRelawan`, `kuotaRelawan` positif, `mulai`, `selesai`, dan `lokasiKumpul`.
Koordinat opsional, tetapi latitude/longitude harus diisi bersama jika digunakan.

## Aturan dan keamanan

- Status: `draft` → `menunggu_verifikasi` → `terpublikasi` atau `ditolak`; `ditolak` bisa diedit/diajukan ulang. Pending/publik tidak bisa diedit melalui API ini.
- Pengajuan ulang menghapus alasan penolakan serta waktu verifikasi lama.
- Target campaign > 0, maksimal Rp1 miliar, maksimal dua desimal. Project boleh tanpa penggalangan (`targetDana = 0`).
- Mengikuti Algo-007: campaign mulai < selesai, maksimal 365 hari, tanggal selesai tidak lewat. Tanggal mulai yang sudah lewat tetap boleh jika campaign masih berjalan. Tanggal kalender menggunakan WIB.
- Session adapter fitur membaca **hanya `klimpool_sesi`**, lalu memeriksa sesi aktif, waktu mulai/expiry, akun aktif dan peran di database. Tidak ada backdoor `klimpool_dev_user`.
- Pemilik dari sesi, bukan JSON. Query memakai parameter nilai dan whitelist nama tabel/kolom.
- Mutasi menolak Origin yang tidak sesuai Host dan `Sec-Fetch-Site: cross-site`; tidak mempercayai `X-Forwarded-Host` klien.
- Edit/pengajuan/keputusan mengunci baris dalam transaksi. Status update juga bersyarat, sehingga dua pengajuan/keputusan bersamaan tidak menimpa satu sama lain.
- Detail titik kumpul berada pada halaman/API privat ini, bukan diperluas ke endpoint publik.

## Menjalankan pengujian

Dari `src/`, Node 20+:

```sh
npm ci --ignore-scripts --no-audit --no-fund
npm run test:aksi
npm run lint
```

Tanpa `AKSI_TEST_DB=1`, suite integrasi aksi dilewati. Untuk integrasi gunakan **database khusus uji** yang namanya mengandung `test`, dengan skema `db/migrations/001_schema.sql`; jangan gunakan database produksi/pengembangan yang berisi pekerjaan tim.

```sh
export DB_HOST=127.0.0.1
export DB_PORT=13317
export DB_NAME=klimpool_aksi_test
export DB_USER=akun_database_uji
export DB_PASSWORD=password_database_uji
export AKSI_TEST_DB=1
npm run test:aksi
```

Tes membuat fixture ID acak dan hanya membersihkan fixture itu. Jika integrasi diaktifkan tetapi koneksi/skema tidak valid, tes gagal, bukan diam-diam dianggap lulus.

Browser end-to-end memerlukan Playwright dan browser Chromium. Playwright bukan runner unit test baru; skrip ini terpisah dan tidak mengubah konfigurasi Vitest tim. Jika belum tersedia, instal untuk pengujian lokal saja:

```sh
npm install --no-save --package-lock=false playwright
npx playwright install chromium
npm run test:aksi:browser
```

Skrip browser membaca DB_* dan `AKSI_TEST_DB=1`, menyalakan Next dev di `127.0.0.1:3196`, membuat sesi uji sah, menjalankan UI/API/database asli tanpa API mock, lalu membersihkan fixture dan menghentikan server Next. Opsi: `AKSI_TEST_PORT`, `AKSI_BROWSER_LOG`, `PLAYWRIGHT_MODULE` (modul yang sudah terpasang di luar repo), dan `PLAYWRIGHT_EXECUTABLE_PATH` (binary Chromium yang sudah tersedia).

### Hasil lokal, 8 November 2026

- 15 tes fitur lulus: 6 validasi, 3 akses/asal request, 6 integrasi database; tidak ada skip pada run integrasi.
- Browser Chromium lulus: validasi inline, retry jaringan tanpa kehilangan isian, privasi pemilik, campaign ditolak/diajukan ulang/publik, project dua tahap/Back/satu ID/publik, My Actions, keberadaan tautan Progres, form mobile 375px.
- Rincian dana diuji sampai bentuk JSON yang benar tersimpan di database.
- Lint dan typecheck lulus. Untuk checkout baru, jalankan `npx next typegen` sebelum `npx tsc --noEmit` jika tipe route Next belum dihasilkan.
- Database uji lokal adalah **MariaDB terisolasi**, bukan klaim validasi MySQL 8 produksi. Tes donasi pada MariaDB gagal pada sintaks `FOR UPDATE OF d` milik modul donasi; modul tersebut tidak diubah.
- `npm run build` compile/typecheck berhasil tetapi gagal prerender halaman donasi: `usePathname`/`useParams` di luar Suspense. Kegagalan yang sama direproduksi pada basis `develop` `6c3b021`. Build keseluruhan belum hijau; browser diuji pada Next dev, bukan produksi.
- `npm test` basis branch masih menggunakan glob yang tidak didukung Node 20. Gunakan `test:aksi` untuk fitur ini; perbaikan skrip tim pada PR #52/#53 sudah di-approve dan terlihat merged di GitHub pada pemeriksaan terakhir, tetapi belum disinkronkan ke branch lokal ini. Jangan melupakan file tes aksi ketika memperbarui daftar eksplisit `test:node` dari perubahan tersebut.

## Integrasi tim yang masih diperlukan

1. **Login #57:** adapter fitur bersifat kompatibel dengan cookie/schema sesi sekarang, tetapi harus disatukan dengan guard auth resmi setelah tersedia. Jangan mengganti dengan cookie ID pengguna sementara. Navbar/login basis branch masih placeholder; browser test menanam sesi fixture, bukan mengklaim UI login selesai.
2. **Account #58:** `MyActions` disediakan sebagai isi slot `aksi` tanpa mengganti halaman Account Sahla. #58 sudah masuk `origin/develop` setelah branch ini dibuat, tetapi belum ditarik ke branch lokal ini. Setelah sinkronisasi yang disetujui, pasang `aksi={<MyActions aksi={await AksiService.milikSaya(pengguna)} />}` pada `FormRiwayatView` dari komponen server yang terlindungi sesi. Route `/my-actions` bisa dipakai untuk memeriksa fitur sekarang.
3. **Detail #55:** hubungkan kontrol pemilik ke `TombolPengajuan` atau tautan `/manage/[jenis]/[id]` pada slot `AksiPemilik`. Jangan membuka Draft pada detail publik. JSON rincian memakai `uraian` sesuai seed dan pembaca detail.
4. **Progres #37/#60:** My Actions mengarah ke `/progress/[idProject]` untuk project terpublikasi. Tujuan UI ini milik modul Nathan dan belum tersedia pada basis branch; pengujian hanya memeriksa tautannya, bukan keberhasilan halaman progres.
5. Reviewer manusia perlu memeriksa perubahan, menjalankan UAT dengan login tim, dan mengonfirmasi kesesuaian antarmuka terhadap prototipe. Belum ada klaim review manusia selesai, acceptance semua modul terpenuhi, atau rilis siap.
