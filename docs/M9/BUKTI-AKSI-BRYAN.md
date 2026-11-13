# Bukti Pekerjaan Bryan — UC02, UC03, UC04 dan My Actions

Tanggal pembaruan: **13 November 2026**. PIC: Bryan Pamungkas Prahara (13525092). Reviewer yang diminta: Sahla Nailah Salsabilla (`shlanailah`).

## Versi dan batas atribusi

- **Alur publikasi:** atas arahan Bryan, tambahan dokumentasi miliknya dimasukkan **langsung ke main**, tanpa menunggu review PR dokumentasi; [PR #86](https://github.com/Brynpamungkas/IF2150-RPL-K02-G08/pull/86) menjadi jejak pengajuan awal. Review perubahan kode tetap melalui [PR #85](https://github.com/Brynpamungkas/IF2150-RPL-K02-G08/pull/85), yang belum merged.
- **Bloker #83 sudah selesai:** PR tim [#83](https://github.com/Brynpamungkas/IF2150-RPL-K02-G08/pull/83) merged ke develop `13838ee`. Bryan menyelaraskan branch aksi melalui merge `81f2f85`, mempertahankan perbaikan login/top-up tim dan boundary Suspense, lalu menjalankan ulang seluruh tes/build/browser produksi yang dicatat di bawah. PR #85 bukan draft lagi; head baru `6ee2f54` dimintakan konfirmasi ulang Sahla karena approval sebelumnya ada pada `6e66e38`. Belum ada merge kode PR #85. Bloker pada `2b0d242` dan pengujian API langsung pada versi tersebut merupakan catatan historis, bukan status bloker saat ini.
- Basis kode terbaru yang diintegrasikan dan diuji ulang: `develop` `13838eed24bc66255936cb9dfec1c75c848b09b1`.
- Kode lanjutan: [`fix/aksi-current-integration`](https://github.com/Brynpamungkas/IF2150-RPL-K02-G08/tree/fix/aksi-current-integration). Head terbaru: `6ee2f54`; merge integrasi kode `81f2f85` (dokumen dapat diperbarui sesudahnya).
- Laporan resmi: [K02_G08_Implementasi.md](K02_G08_Implementasi.md), bagian tambahan Bryan pada B.1–B.5. Branch `docs/bryan-m9-completion` berbasis `main` `2a832b455b5ce5360f24e8840e101e11b72d4d37`; tidak menyalin atau mengganti laporan anggota lain.
- Implementasi milik Bryan: campaign, project dua tahap, preview privat, pengajuan/pengajuan ulang, antrean dan keputusan admin, My Actions, validasi/akses/transaksi serta tesnya; penghubung Account/auth/progres, runner tes dan batas rendering yang diperlukan untuk integrasi.
- **Bukan klaim implementasi Bryan:** autentikasi inti, halaman/dompet Account, UI/API progres, relawan, riwayat, katalog, detail publik, peta dan beranda milik anggota lain. Memakai atau menguji modul tersebut tidak memindahkan atribusinya. Profiling donasi di B.2.1 tetap pekerjaan Sahla, bukan Bryan.
- PR awal #66–73 telah merged pada parent bertingkat. Audit menemukan UI belum seluruhnya sampai develop; status tersebut tidak dipakai sebagai bukti integrasi akhir. Perubahan lanjutan memerlukan review/penggabungan baru.

## Ketercakupan tugas sendiri

| Issue | Implementasi dan bukti otomatis |
| --- | --- |
| #16–17, UC02, KF05–KF07 | Draft campaign, validasi nominal/periode/kolom, retry tanpa kehilangan isian, notifikasi ID dan preview privat |
| #18–19, UC03, KF08–KF10 | Informasi lalu kebutuhan project, tombol Kembali mempertahankan isian, satu ID, dana boleh nol, jadwal dan titik kumpul |
| #20–22, UC04, KF11–KF12 | Pengajuan, antrean pending, penolakan beralasan, revisi/pengajuan ulang dan persetujuan; pemeriksaan sesi/peran/pemilik/asal serta keputusan bersamaan |
| #45 | Account My Actions memuat hanya aksi pemilik dari server, empat status dan alasan penolakan, Kelola/pengajuan ulang, tujuan Progres privat yang memakai form/API tim |

## Pengujian 13 November 2026

Pengujian dilakukan secara otomatis pada lingkungan lokal; bukan UAT manusia. Seluruh hasil integrasi pada tabel berikut dijalankan ulang sesudah penyelarasan dengan develop `13838ee` (#83 merged), bukan hanya hasil sebelum bloker selesai.

| Perintah / skenario | Hasil | Batasan |
| --- | --- | --- |
| `npm ci --no-audit --no-fund` | Berhasil | Memakai lockfile dan dependensi tim, tanpa menambah dependency browser pada manifest |
| `npm test` | **83 node:test lulus, 37 dilewati; 175 Vitest lulus; 0 gagal** | Tanpa DB pada run default; integrasi aksi opt-in diuji terpisah. Runner rekursif juga menemukan tes tim yang sebelumnya tidak tercantum pada daftar eksplisit |
| `AKSI_TEST_DB=1 npm run test:aksi` dengan DB_* khusus uji | **15/15 lulus, tanpa skip** | MariaDB 11.8.6 terisolasi, bukan MySQL 8.4 produksi |
| `npm run lint` | Lulus, 0 error | Tidak mengklaim seluruh aturan/prototipe telah di-UAT |
| `npx tsc --noEmit --incremental false` | Lulus | Tipe route telah dihasilkan oleh build |
| `npm run build` | Lulus compile, typecheck dan prerender | Ada warning tracing filesystem dokumentasi serta log percobaan prerender/cookies/DB_NAME yang belum diatur saat build; bukan build tanpa warning |
| Browser Chromium, `AKSI_TEST_SERVER_MODE=production` (`next start`) | Lulus | API dan database asli; satu request dibatalkan secara sengaja untuk skenario retry jaringan |

Skenario browser: login pemilik melalui modal/UI resmi dan password bcrypt fixture; campaign Draft → ajukan → tolak → ajukan ulang → setujui; project dua tahap/Kembali/satu ID → setujui; empat status My Actions; tab tetap aktif setelah pengajuan ulang; akun lain tidak menerima ID privat pada HTML/Flight; tamu, volunteer, admin dan sesi kedaluwarsa; tautan Progres membuka form tim dan menyimpan satu milestone ke database; halaman publik setelah publikasi; akun lain ditolak pada penghubung Progres; viewport form 375 px tanpa overflow. Akun selain pemilik utama memakai fixture sesi sah untuk pengujian peran, bukan semua melalui UI login.

Tes diperbarui agar fixture sesi yang sudah diakhiri layanan auth tidak dianggap aktif hanya dengan mengubah expiry. Locator browser dibatasi ke formulir terlihat karena Next mempertahankan DOM rute tersembunyi. Penyesuaian ini tidak mengganti API sukses dengan mock.

## Verifikasi issue API pada develop terbaru

API #16 (campaign), #18 (project dua tahap) dan #20 (verifikasi admin) sudah berada pada develop melalui [PR #67](https://github.com/Brynpamungkas/IF2150-RPL-K02-G08/pull/67), yang approved oleh Sahla dan merged. Pada 13 November, kode dan tes bawaan snapshot **`2b0d2428d2b38215cc8be8829634c8584be926cb`** diuji ulang tanpa mengambil implementasi yang masih tertahan di PR #85:

```sh
# Dari src/ snapshot develop terbaru, dengan DB_* khusus uji yang sudah disiapkan:
AKSI_TEST_DB=1 node --import tsx --test tests/aksi.akses.test.ts tests/aksi.validasi.test.ts tests/aksi.integrasi.test.ts
```

Hasil: **15/15 lulus, 0 gagal, 0 skip**, MariaDB terisolasi. Mencakup validasi campaign/target/periode, project tahap informasi/lengkap/ubah informasi, pemilik/peran/sesi, antrean pending, persetujuan/penolakan beralasan, revisi/pengajuan ulang dan keputusan bersamaan. Ini dasar penutupan **issue API #16, #18, #20**, bukan pernyataan UI/integrasi aplikasi lengkap sudah selesai. Tes memanggil controller/API dan database langsung, **tidak membangun atau membuka AppShell/AlurDonasi yang sedang terblokir**. Adapter auth/rincian dana lanjutan tetap tercakup pada PR #85.

Issue UI #19, #21, #22 dan #45 tetap terbuka sampai integrasi/review PR #85 selesai; #17 sudah ditutup sebelumnya, bukan ditutup ulang pada tahap ini.

## Kontribusi review PR #84

Bryan memberi [approval #84](https://github.com/Brynpamungkas/IF2150-RPL-K02-G08/pull/84#pullrequestreview-5889452567) pada head `3b9a409`, sesudah memadukannya secara lokal dengan develop `13838ee` untuk pengujian. Ini **review atas implementasi Nathan**, bukan implementasi progres oleh Bryan; branch #84 yang belum merged tidak dimasukkan ke branch #85.

Browser produksi, API dan DB uji asli memastikan: admin melihat tombol progres tanpa kelola relawan, daftar relawan admin tetap 403, pengiriman form admin menghasilkan 201 dan menyimpan milestone dengan ID admin; pemilik melihat kedua kontrol; pembuat lain/volunteer/tamu tidak melihat kontrol dan POST langsung ditolak 403/401; campaign tanpa tombol progres; draft ditolak 409; tidak ada browser pageerror. `npm test` pada snapshot review: **44 node:test + 152 Vitest lulus**, 26 integrasi DB dilewati pada run default; lint/build lulus dengan warning/log bawaan. Pengujian peran browser/API dijalankan terpisah memakai MariaDB khusus uji. Tidak ada merge #84 oleh Bryan dan tidak ada klaim UAT manusia.

## Reproduksi

Checkout branch kode di atas, lalu dari `src/`:

```sh
npm ci
npm test
npm run lint
npm run build
# Atur DB_* ke database kosong khusus test (nama mengandung "test").
# Impor db/migrations/001_schema.sql, jangan memakai data tim/produksi.
AKSI_TEST_DB=1 npm run test:aksi
# Sediakan Playwright/Chromium lokal atau PLAYWRIGHT_MODULE/PLAYWRIGHT_EXECUTABLE_PATH.
AKSI_TEST_DB=1 AKSI_TEST_SERVER_MODE=production npm run test:aksi:browser
```

Fixture menggunakan ID acak dan membersihkan data miliknya setelah tes. Jangan menambahkan kredensial database ke Git. Untuk menjalankan aplikasi demo, gunakan setup dan akun demo pada `src/README.md` branch kode; snapshot `main` sebelum penggabungan belum berisi aplikasi terintegrasi.

## Yang masih memerlukan keputusan manusia/tim

1. Review Sahla atas lanjutan kode, kemudian penggabungan ke develop dan main. Dokumentasi dimasukkan langsung ke main atas arahan Bryan. Penutupan issue API memakai verifikasi khusus di atas; issue UI tidak ditutup otomatis oleh dokumen ini.
2. UAT manusia dan kesesuaian prototipe; tidak digantikan oleh tes otomatis.
3. Persentase kontribusi Bryan belum dikonfirmasi. Durasi **4 + 5 + 4 = 13 jam** untuk 8/9/13 November telah dikonfirmasi Bryan dan masuk logbook; bukan durasi yang diperkirakan alat.
4. Tanggal/catatan asistensi dan rilis `v9` adalah koordinasi tim. Saat audit belum ditemukan tag/release `v9*`. Pekerjaan 13 November dilakukan setelah tenggat 11 November dan tidak dinyatakan sebagai pengumpulan tepat waktu; tidak ada tanggal yang dibackdate.
