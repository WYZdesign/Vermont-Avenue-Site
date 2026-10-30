import { Pool, types } from "pg";

// Postgres returns date/timestamp columns as JS Date objects by default.
// React cannot render those directly, so keep them as strings everywhere.
// 1082 = date, 1114 = timestamp, 1184 = timestamptz
types.setTypeParser(1082, (value: string) => value);
types.setTypeParser(1114, (value: string) => value);
types.setTypeParser(1184, (value: string) => value);

const globalForPg = globalThis as unknown as { vaPgPool?: Pool };

export function isDbConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL);
}

export function pool(): Pool {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set");
  }
  if (!globalForPg.vaPgPool) {
    globalForPg.vaPgPool = new Pool({
      connectionString: process.env.DATABASE_URL,
      max: 5,
    });
  }
  return globalForPg.vaPgPool;
}

export async function query<T = Record<string, unknown>>(
  text: string,
  params: unknown[] = []
): Promise<T[]> {
  const result = await pool().query(text, params as never[]);
  return result.rows as T[];
}
