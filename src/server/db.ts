import mysql, {
  type Pool,
  type PoolConnection,
  type ResultSetHeader,
  type RowDataPacket,
} from 'mysql2/promise';

/**
 * Connection pool MySQL bersama untuk seluruh repository.
 * Konfigurasi dibaca dari environment variable (lihat .env.example).
 * Pool dibuat saat pertama dipakai (lazy) dan disimpan di globalThis agar
 * hot-reload Next.js pada mode dev tidak membuat pool baru setiap kali.
 */
const globalForDb = globalThis as unknown as { klimpoolPool?: Pool };

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Environment variable ${name} belum diatur. Salin .env.example menjadi .env.`,
    );
  }
  return value;
}

function createPool(): Pool {
  return mysql.createPool({
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3307),
    database: requireEnv('DB_NAME'),
    user: requireEnv('DB_USER'),
    password: requireEnv('DB_PASSWORD'),
    waitForConnections: true,
    connectionLimit: Number(process.env.DB_CONNECTION_LIMIT ?? 10),
    queueLimit: 0,
    charset: 'utf8mb4',
    timezone: 'Z', // simpan dan baca waktu sebagai UTC
    decimalNumbers: true, // DECIMAL (saldo, nominal) dibaca sebagai number, bukan string
  });
}

export function getPool(): Pool {
  if (!globalForDb.klimpoolPool) {
    globalForDb.klimpoolPool = createPool();
  }
  return globalForDb.klimpoolPool;
}

/**
 * Menjalankan SELECT dan mengembalikan baris.
 * Isi `conn` (dari withTransaction) agar query ikut transaksi yang sedang berjalan.
 */
export async function query<T extends RowDataPacket = RowDataPacket>(
  sql: string,
  params: unknown[] = [],
  conn?: PoolConnection,
): Promise<T[]> {
  const [rows] = await (conn ?? getPool()).query<T[]>(sql, params);
  return rows;
}

/**
 * Menjalankan INSERT/UPDATE/DELETE dan mengembalikan ringkasan (affectedRows, dst.).
 * Isi `conn` (dari withTransaction) agar query ikut transaksi yang sedang berjalan.
 */
export async function execute(
  sql: string,
  params: unknown[] = [],
  conn?: PoolConnection,
): Promise<ResultSetHeader> {
  const [result] = await (conn ?? getPool()).execute<ResultSetHeader>(
    sql,
    params as never[],
  );
  return result;
}

/** true bila galat berasal dari pelanggaran unique index (ER_DUP_ENTRY). */
export function adalahKunciGanda(e: unknown): boolean {
  return (
    typeof e === 'object' &&
    e !== null &&
    (e as { code?: unknown }).code === 'ER_DUP_ENTRY'
  );
}

/**
 * Menjalankan beberapa query dalam satu transaksi (dipakai donasi, KF15-KF18).
 * COMMIT bila fungsi selesai, ROLLBACK bila melempar error.
 */
export async function withTransaction<T>(
  work: (conn: PoolConnection) => Promise<T>,
): Promise<T> {
  const conn = await getPool().getConnection();
  try {
    await conn.beginTransaction();
    const result = await work(conn);
    await conn.commit();
    return result;
  } catch (error) {
    await conn.rollback();
    throw error;
  } finally {
    conn.release();
  }
}
