/**
 * Format rupiah mengikuti prototipe: "Rp750,000".
 * Locale dikunci ke en-US agar hasil di server dan browser selalu sama
 * (menghindari hydration mismatch).
 */
export const rupiah = (nilai: number): string =>
  `Rp${nilai.toLocaleString('en-US')}`;
