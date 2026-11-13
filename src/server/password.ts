import bcrypt from 'bcryptjs';

/** Cost 12, sama dengan hash pada seed (002_seed.sql). */
const BIAYA_BCRYPT = 12;

/** Dipakai agar login email tak dikenal tetap memakan waktu bcrypt. */
const HASH_PALSU =
  '$2b$12$CM2/P9zuwFCa1BJj517TWegGNjq0fNBfG1JbWr.dhSA2pqrEXy9zu';

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BIAYA_BCRYPT);
}

/** hash null = akun tidak ada; tetap membandingkan agar waktu respons seragam. */
export async function cocokPassword(
  password: string,
  hash: string | null,
): Promise<boolean> {
  const cocok = await bcrypt.compare(password, hash ?? HASH_PALSU);
  return hash !== null && cocok;
}
