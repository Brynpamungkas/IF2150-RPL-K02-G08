# KlimPooL UI/UX review artifact

Artefak ini menerjemahkan SKPL, APL, dan DPPL KlimPooL ke prototype yang dapat ditinjau tanpa backend. Brief **Design System Inspired by Expressive** menjadi sumber kebenaran visual: `#DB2777` sebagai CTA, `#2563EB` sebagai secondary, `#16A34A` success, `#D97706` warning, `#DC2626` danger, surface `#FFFFFF`, text `#111827`, dan IBM Plex Mono.

## Cara melihat prototype

Buka `prototype.html` langsung di browser. Navigasi kiri mengganti screen melalui hash URL. Tombol pada screen menjalankan state review yang relevan dengan skenario SKPL, misalnya modal donasi, error saldo, error nominal, form volunteer invalid, dan toast berhasil.

## Cara melihat di Figma

1. Buka Figma dan buat file baru.
2. Pilih **File → Import** atau seret `figma/klimpool-figma-board.svg` ke canvas.
3. SVG akan menjadi objek yang dapat dipisah (`Ungroup`) untuk pemeriksaan token, komponen, dan frame contoh.
4. Prototype HTML dipakai untuk menguji interaksi; SVG dipakai untuk review visual dan handoff.

## Cakupan berdasarkan dokumen

| Artefak UI | Sumber | Isi yang direpresentasikan |
| --- | --- | --- |
| Discovery / katalog | UC05, KF13–KF14 | kata kunci, kategori, lokasi, status, periode, hanya item terpublikasi |
| Detail + donasi | UC06, KF15–KF18, KF26 | saldo, nominal valid, idempotency, status campaign/project, bukti, persentase target |
| Form volunteer | UC07, KF19–KF20 | data diri, keahlian, pengalaman, ketersediaan, pending/duplikasi/kuota |
| Manajemen volunteer | UC08, KF21–KF22 | terima/tolak, status, instruksi lokasi dan jadwal |
| Progres project | UC09, KF23–KF25 | hak akses, milestone, status pelaksanaan, dokumentasi, timestamp |
| Riwayat | UC10 | riwayat donasi dan progres secara kronologis, detail, empty state |

Prototype ini adalah artefak review UI/UX. Pemrosesan nyata tetap mengikuti API, service, repository, dan transaksi atomik pada APL/DPPL.
