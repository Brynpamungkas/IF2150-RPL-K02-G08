# Implementasi Aksi — UC02, UC03, UC04

PIC: Bryan. Reviewer yang ditugaskan: Sahla (`shlanailah`). Acuan lanjutan lengkap: `fix/runtime-suspense`; cadangan implementasi awal tetap `feat/aksi-pembuat`.
Implementasi awal berbasis `6c3b021` sudah diajukan pada PR #66–73 dan berstatus approved/merged di GitHub. Namun sebagian hasil masih berada pada branch parent, bukan `develop`. Lanjutan ini berbasis `develop` `a562a6f`, membawa kembali stack yang sudah disetujui ke branch integrasi lokal, kemudian menyambungkan Account dan memperbaiki batas rendering. Branch lanjutan belum dipush/merge ke branch tim. Peta branch ada di [Pembagian Branch Aksi](BRANCH-AKSI.md).

## Cakupan dan keterlacakan

| Issue / kebutuhan | Implementasi | Pengujian |
| --- | --- | --- |
| #16–17, KF05–KF07, UC02 | Campaign Draft, form lengkap, galat per kolom, notifikasi ID dan tautan detail privat | Validasi nominal/periode/teks, API database, browser create/retry/preview |
| #18–19, KF08–KF10, UC03 | Project dua tahap; informasi pertama menghasilkan ID; Back mempertahankan isian; tahap lengkap menyimpan kebutuhan/jadwal/titik kumpul | API tahap awal/lengkap, browser Back tanpa ID ganda, kebutuhan dana nol |
| #20–22, KF11–KF12, UC04 | Pengajuan pemilik, antrean admin, persetujuan, penolakan beralasan, revisi/pengajuan ulang | Peran/pemilik/sesi/asal request, transisi, dua keputusan bersamaan, browser |
| #45 | `TabMyActions` pada slot Account: daftar dari sesi server, empat status, alasan, Kelola/Ajukan Ulang; rute mandiri tetap tersedia | Browser Account untuk pemilik/tamu/volunteer/admin/sesi kedaluwarsa, empat status, refresh tab, isolasi HTML/Flight; tautan Progres saja |

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
| `/account` → My actions | Slot Account memakai sesi server; pemilik melihat daftar, tamu/sesi usang mendapat pesan login, peran lain mendapat penjelasan |
| `/my-actions` | Daftar mandiri milik Pembuat Project, tetap kompatibel setelah slot Account dipasang |
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

Skrip browser membaca DB_* dan `AKSI_TEST_DB=1`, menyalakan Next dev di `127.0.0.1:3196`, membuat sesi uji sah, menjalankan UI/API/database asli, lalu membersihkan fixture dan menghentikan server Next. Skenario kegagalan jaringan sengaja membatalkan satu request; respons sukses dan data tetap dari API/database asli. Opsi: `AKSI_TEST_PORT`, `AKSI_BROWSER_LOG`, `PLAYWRIGHT_MODULE`, dan `PLAYWRIGHT_EXECUTABLE_PATH`.

Untuk menguji **build produksi**, bangun tanpa kredensial fixture lalu jalankan dengan koneksi database uji:

```sh
npm run build
# DB_*, AKSI_TEST_DB=1, dan Playwright tetap harus tersedia seperti di atas.
AKSI_TEST_SERVER_MODE=production npm run test:aksi:browser
```

Mode ini menjalankan `next start`, bukan `next dev`. Nilai `AKSI_TEST_SERVER_MODE` lain selain `dev` dan `production` ditolak. Skrip juga mengecek API katalog/opsi serta respons 401 donasi tamu pada runtime, agar kegagalan prerender tidak dianggap keberhasilan API.

### Hasil awal, 8 November 2026 (historis, sebelum integrasi)

- 15 tes fitur lulus: 6 validasi, 3 akses/asal request, 6 integrasi database; tidak ada skip pada run integrasi.
- Browser Chromium lulus: validasi inline, retry jaringan tanpa kehilangan isian, privasi pemilik, campaign ditolak/diajukan ulang/publik, project dua tahap/Back/satu ID/publik, My Actions, keberadaan tautan Progres, form mobile 375px.
- Rincian dana diuji sampai bentuk JSON yang benar tersimpan di database.
- Lint dan typecheck lulus. Untuk checkout baru, jalankan `npx next typegen` sebelum `npx tsc --noEmit` jika tipe route Next belum dihasilkan.
- Database uji lokal adalah **MariaDB terisolasi**, bukan klaim validasi MySQL 8 produksi. Tes donasi pada MariaDB gagal pada sintaks `FOR UPDATE OF d` milik modul donasi; modul tersebut tidak diubah.
- `npm run build` compile/typecheck berhasil tetapi gagal prerender halaman donasi: `usePathname`/`useParams` di luar Suspense. Kegagalan yang sama direproduksi pada basis `develop` `6c3b021`. Build keseluruhan belum hijau; browser diuji pada Next dev, bukan produksi.
- `npm test` basis branch masih menggunakan glob yang tidak didukung Node 20. Gunakan `test:aksi` untuk fitur ini; perbaikan skrip tim pada PR #52/#53 sudah di-approve dan terlihat merged di GitHub pada pemeriksaan terakhir, tetapi belum disinkronkan ke branch lokal ini. Jangan melupakan file tes aksi ketika memperbarui daftar eksplisit `test:node` dari perubahan tersebut.

### Hasil lanjutan, 9 November 2026

- `npm test` berhasil menjalankan kedua runner: **85 tes Vitest** dan **15 tes unit node:test** lulus. Enam integrasi donasi dilewati tanpa koneksi DB; suite integrasi aksi diaktifkan pada perintah terpisah.
- `test:node` sekarang menemukan seluruh `*.test.ts` secara rekursif dan tidak menyerahkan `*.spec.ts` ke node:test. Empat regression test memeriksa discovery, subfolder, pemisahan Vitest dan symlink.
- `AKSI_TEST_DB=1 npm run test:aksi` dengan DB_* ke MariaDB terisolasi: **15/15 lulus tanpa skip**, termasuk enam tes integrasi API/database aksi.
- `npm run build` **lulus**, termasuk compile, typecheck dan prerender. `Suspense` navbar dan loading boundary route donasi memperbaiki kegagalan sebelumnya, tanpa perubahan logika transaksi.
- Build masih mencetak log percobaan prerender API (termasuk DB_NAME yang tidak diatur saat build) serta warning tracing penyimpanan dokumentasi. Ini bukan klaim build tanpa warning. Endpoint tetap dynamic dan respons runtime diverifikasi pada smoke test.
- Browser Chromium dengan **`serverMode: production` / `next start` lulus**: empat status aksi pada Account, alasan penolakan/pengajuan ulang, tab tetap aktif setelah refresh, Back project dua tahap/satu ID, serta form mobile 375px.
- Akun pembuat lain tidak melihat daftar pemilik; ID aksi privat juga tidak ditemukan pada payload HTML/Flight Account akun lain. Tamu, volunteer, admin, dan sesi kedaluwarsa diuji terpisah.
- API katalog dan opsi memberikan 200 ketika runtime mendapat DB_* yang benar; donasi tanpa sesi memberikan 401; halaman donasi dinamis berhasil dimuat. Tidak menguji transaksi uang melalui smoke test ini.
- Lint tidak memiliki error; satu warning `<img>` dari peta Explore basis masih ada. Typecheck mandiri juga lulus.
- Pengujian memakai **MariaDB terisolasi dan sesi fixture sah**, bukan login UI tim atau validasi MySQL 8 produksi. Review/UAT manusia atas lanjutan ini masih diperlukan.

## Integrasi tim yang masih diperlukan

1. **Login #57:** adapter fitur bersifat kompatibel dengan cookie/schema sesi sekarang, tetapi harus disatukan dengan guard auth resmi setelah tersedia. Jangan mengganti dengan cookie ID pengguna sementara. Navbar/login basis branch masih placeholder; browser test menanam sesi fixture, bukan mengklaim UI login selesai.
2. **Account #58 / #45:** slot `aksi` sudah terhubung melalui `TabMyActions` di balik `Suspense`, menggunakan sesi asli di server. Header dan dompet Account masih preview milik integrasi auth/wallet; peringatan tampil agar identitas/saldo dummy tidak disangka data sesi. Modul riwayat/relawan tetap disediakan bagi pemiliknya. Ini bukan penyelesaian auth/wallet tim.
3. **Detail #55:** hubungkan kontrol pemilik ke `TombolPengajuan` atau tautan `/manage/[jenis]/[id]` pada slot `AksiPemilik`. Jangan membuka Draft pada detail publik. JSON rincian memakai `uraian` sesuai seed dan pembaca detail.
4. **Progres #37/#60:** My Actions mengarah ke `/progress/[idProject]` untuk project terpublikasi. Tujuan UI ini milik modul Nathan dan belum tersedia pada basis branch; pengujian hanya memeriksa tautannya, bukan keberhasilan halaman progres.
5. PR awal #66–73 sudah berstatus approved/merged. **Perubahan lanjutan lokal** tetap memerlukan review baru, UAT dengan login tim, serta konfirmasi antarmuka/prototipe. Issue #45 belum layak ditutup karena tujuan Progres dan integrasi auth tim belum lengkap; build yang lulus tidak berarti seluruh acceptance atau rilis siap.
