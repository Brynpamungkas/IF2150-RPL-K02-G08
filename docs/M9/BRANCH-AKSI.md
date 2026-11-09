# Pembagian Branch Aksi

Pekerjaan Bryan dibagi menjadi branch bertingkat (**stacked branches**), mengikuti pola dependensi PR tim. Setelah push awal, riwayat ditata ulang dengan izin Bryan agar setiap branch memiliki beberapa commit bermakna. Pengajuan PR mengikuti base pada tabel di bawah dan reviewer yang ditugaskan adalah Sahla Nailah (`shlanailah`).

## Urutan branch dan target PR awal (PR #66–73)

| Branch | Base PR awal | Commit baru | Perubahan baru dibanding base |
| --- | --- | --- | --- |
| `feat/aksi-api` | `develop` | 3 | Validasi bersama, API campaign/project/verifikasi, sesi dan kepemilikan, pengujian backend |
| `feat/form-aksi` | `feat/aksi-api` | 2 | Komponen formulir bersama; halaman Start dan penjagaan akses |
| `feat/pengajuan-verifikasi` | `feat/form-aksi` | 2 | Komponen preview/pengajuan; route Kelola privat pemilik |
| `feat/verifikasi-ui` | `feat/pengajuan-verifikasi` | 2 | Komponen antrean/keputusan; halaman admin terlindungi |
| `feat/my-actions` | `feat/verifikasi-ui` | 2 | Komponen My Actions; halaman pemeriksaan mandiri |
| `fix/aksi-rincian-dana` | `feat/my-actions` | 2 | Pembacaan uraian seed; penulisan kontrak kanonis beserta regression test |
| `test/aksi-integrasi` | `fix/aksi-rincian-dana` | 2 | Skrip browser end-to-end; perintah pengujian fitur |
| `docs/aksi-m9` | `test/aksi-integrasi` | 3 | Panduan API/pengujian; pencatatan M9; peta branch dan pembaruan status |

API campaign/project/verifikasi serta form campaign/project tetap berbagi komponen dan kontrak yang sama. Pembagian ini memisahkan unit review tanpa menduplikasi kode atau mengubah perilaku fitur. Branch tingkat berikutnya memang mencakup dependensi sebelumnya; yang direview adalah **diff terhadap base pada tabel**, bukan semuanya langsung terhadap `develop`.

## Cadangan dan penataan ulang riwayat

- Sebelum rewrite, tip delapan branch disimpan sebagai branch lokal `backup/aksi-20261108/<nama-branch>`. Hash/riwayat push awal tetap tersedia di cadangan tersebut dan tidak diubah.
- `feat/aksi-pembuat` tetap menunjuk `0c00c15` sebagai cadangan hasil lengkap sebelum pembagian branch; jangan dijadikan PR tambahan yang menduplikasi seluruh stack.
- Tiga commit API tetap utuh. Commit turunan dibentuk ulang per komponen, route, kontrak, tes, dan dokumentasi, bukan ditambah commit kosong. Karena parent berubah, hash commit turunan ikut berubah.
- Setiap checkpoint source code dan konfigurasi pengujian dibandingkan dengan cadangan dan hasil akhirnya sama. Tahap awal perbaikan rincian dana terlebih dahulu menerima uraian seed; tahap kedua menyamakan penyimpanan/DTO dan tes. Perubahan tambahan pada hasil lengkap hanya pembaruan dokumentasi status rewrite.
- Push ulang harus menggunakan lease eksplisit terhadap hash remote yang diperiksa sebelum rewrite; jangan memakai `--force` tanpa pengaman. Jangan menimpa commit baru milik pengguna lain.
- Branch dibuat dari basis implementasi lama `6c3b021`, bukan menyalin merge terbaru tim secara diam-diam. Sinkronisasi `develop` dan penyelesaian konflik perlu dilakukan terpisah setelah disetujui.
- Hasil tes implementasi merujuk versi lengkap; tiap PR tetap perlu diperiksa ulang terhadap base integrasinya nanti. Review manusia, UAT login tim, dan perbaikan build keseluruhan belum dinyatakan selesai.

## Aturan PR dan review

1. Bryan telah memberi izin untuk push ulang dengan `--force-with-lease`, pembuatan PR, penautan issue, dan request review. Gunakan nama/base sesuai tabel agar perubahan tidak tampil berulang dalam setiap PR.
2. Tulis dependensi PR sebelumnya pada deskripsi; jangan merge branch turunan lebih dulu.
3. Setelah parent masuk `develop`, tinjau kembali base dan diff branch turunannya sebelum melanjutkan. Integrasi harus mempertahankan riwayat commit terpisah, bukan squash seluruh stack menjadi satu commit.
4. Gunakan identitas Git Bryan untuk commit baru, tanpa trailer co-author/bot. Jangan mengubah author commit anggota tim yang menjadi basis.
5. Tautkan issue #16–22 dan #45 sesuai cakupan. Jangan menutup issue atau mencentang acceptance yang masih bergantung integrasi login, slot Account, detail, atau Progres. Request review ke `shlanailah` tidak berarti review sudah disetujui.

Untuk memeriksa **versi awal** secara lokal gunakan `docs/aksi-m9` (atau cadangan `feat/aksi-pembuat`). Untuk review per bagian, pilih branch terkait dan bandingkan dengan base tabel, misalnya:

```sh
git log --oneline feat/aksi-api..feat/form-aksi
git diff --stat feat/aksi-api...feat/form-aksi
```

Keterlacakan issue, cara menjalankan tes, dan batas integrasi ada di [Implementasi Aksi](IMPLEMENTASI-AKSI.md).

## Lanjutan integrasi, 9 November 2026

PR #66–73 terlihat approved/merged, tetapi parent utama masuk `develop` lebih dulu daripada beberapa PR turunannya. Akibatnya status merged tidak otomatis berarti seluruh UI sudah berada pada `develop`. Basis `origin/develop` `a562a6f` baru memuat API aksi; stack lengkap yang sudah disetujui masih tersedia pada `origin/test/aksi-integrasi` `6fdb482`.

| Branch lanjutan | Base review | Commit pada pekerjaan lanjutan | Fungsi |
| --- | --- | --- | --- |
| `fix/aksi-stack-integration` | `develop` | 2 commit first-parent baru | Merge lokal stack yang sudah disetujui, resolusi konflik tanpa membuang perubahan tim, lalu discovery node:test agar tes aksi ikut `npm test` |
| `feat/my-actions-account` | `fix/aksi-stack-integration` | 2 | Loader sesi/role beserta unit test; pemasangan slot Account dan browser regression test |
| `fix/runtime-suspense` | `feat/my-actions-account` | 4 | Boundary navbar; loading boundary donasi; browser mode produksi; dokumentasi hasil dan sisa integrasi |

Catatan jumlah: rentang `develop..fix/aksi-stack-integration` memuat **18 commit**, bukan hanya dua, karena juga membawa 16 commit/riwayat stack lama yang belum terjangkau `develop`. Dua adalah commit baru yang dibuat pada tahap integrasi ini. Riwayat lama tidak di-squash atau diubah author-nya.

- Versi lanjutan lengkap berada pada `fix/runtime-suspense` dalam worktree `IF2150-RPL-K02-G08-integrasi`.
- Tiga branch lanjutan masih lokal dan belum dipush/dibuatkan PR; tidak ada merge ke branch tim pada tahap ini.
- Tidak mengambil branch auth #57, detail #55, atau progres #60 yang masih terbuka. Header/dompet Account tetap preview yang ditandai jelas; daftar aksi menggunakan sesi server sendiri.
- Review baru diperlukan untuk perubahan lanjutan. Jangan menganggap approval delapan PR awal mencakup perubahan ini.
