import { Pool } from "pg";

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
