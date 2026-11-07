/**
 * Format rupiah mengikuti prototipe: "Rp750,000".
 * Locale dikunci ke en-US agar hasil di server dan browser selalu sama
 * (menghindari hydration mismatch).
 */
export const rupiah = (n: number): string => `Rp${n.toLocaleString('en-US')}`;

export const waktuLokal = (iso: string): string => {
  const d = new Date(iso);
  const tanggal = d.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta',
  });
  const jam = d.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
    timeZone: 'Asia/Jakarta',
  });
  return `${tanggal}, ${jam} WIB`;
};
