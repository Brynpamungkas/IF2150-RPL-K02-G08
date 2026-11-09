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
const MAKS_HARI = 14;

function bacaTanggal(nilai: string | null): Date | null {
  const cocok = nilai?.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!cocok) return null;
  // UTC agar hasilnya sama di zona waktu mana pun.
  return new Date(
    Date.UTC(Number(cocok[1]), Number(cocok[2]) - 1, Number(cocok[3])),
  );
}

/**
 * Pilihan jadwal untuk formulir pendaftaran: satu butir per hari dalam
 * periode kegiatan, misalnya "Sat, 8 Nov 2026". Tidak memakai ";" atau ","
 * karena keduanya pemisah di basis data (lihat shared/relawan.ts).
 */
export function opsiJadwal(
  mulai: string | null,
  selesai: string | null,
): string[] {
  const awal = bacaTanggal(mulai);
  if (!awal) return [];
  const akhir = bacaTanggal(selesai) ?? awal;

  const hasil: string[] = [];
  for (
    let hari = awal;
    hari <= akhir && hasil.length < MAKS_HARI;
    hari = new Date(hari.getTime() + 86_400_000)
  ) {
    hasil.push(
      `${HARI[hari.getUTCDay()]} ${hari.getUTCDate()} ${BULAN[hari.getUTCMonth()]} ${hari.getUTCFullYear()}`,
    );
  }
  return hasil;
}
