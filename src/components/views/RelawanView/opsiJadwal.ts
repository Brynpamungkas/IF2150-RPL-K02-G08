const HARI = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const BULAN = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/** Paling banyak hari yang ditawarkan, agar pilihan tetap terbaca. */
export const MAKS_HARI = 14;

const SEHARI = 86_400_000;

function bacaTanggal(nilai: string | null): Date | null {
  const cocok = nilai?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!cocok) return null;
  // UTC agar hasilnya sama di zona waktu mana pun.
  return new Date(
    Date.UTC(Number(cocok[1]), Number(cocok[2]) - 1, Number(cocok[3])),
  );
}

function awalHari(waktu: Date): Date {
  return new Date(
    Date.UTC(waktu.getUTCFullYear(), waktu.getUTCMonth(), waktu.getUTCDate()),
  );
}

export interface OpsiJadwal {
  /** Satu butir per hari yang masih bisa dipilih. */
  hari: string[];
  /** True bila periode kegiatan lebih panjang dari `MAKS_HARI` hari. */
  terpotong: boolean;
}

/**
 * Pilihan jadwal untuk formulir pendaftaran: satu butir per hari dalam
 * periode kegiatan, misalnya "Sat 8 Nov 2026". Tidak memakai ";" atau ","
 * karena keduanya pemisah di basis data (lihat shared/relawan.ts).
 *
 * Hari yang sudah lewat tidak ditawarkan: hitungan dimulai dari yang lebih
 * akhir antara tanggal mulai dan `hariIni` (keduanya dalam UTC). Bila tanggal
 * kosong, tidak terbaca, atau selesai lebih awal dari mulai, hasilnya kosong.
 */
export function opsiJadwal(
  mulai: string | null,
  selesai: string | null,
  hariIni: Date = new Date(),
): OpsiJadwal {
  const awalKegiatan = bacaTanggal(mulai);
  if (!awalKegiatan) return { hari: [], terpotong: false };
  const akhir = bacaTanggal(selesai) ?? awalKegiatan;
  if (akhir < awalKegiatan) return { hari: [], terpotong: false };

  const sekarang = awalHari(hariIni);
  const awal = awalKegiatan > sekarang ? awalKegiatan : sekarang;

  const hari: string[] = [];
  let terpotong = false;
  for (let tgl = awal; tgl <= akhir; tgl = new Date(tgl.getTime() + SEHARI)) {
    if (hari.length >= MAKS_HARI) {
      terpotong = true;
      break;
    }
    hari.push(
      `${HARI[tgl.getUTCDay()]} ${tgl.getUTCDate()} ${BULAN[tgl.getUTCMonth()]} ${tgl.getUTCFullYear()}`,
    );
  }
  return { hari, terpotong };
}
