import { readFileSync } from "node:fs";
import { Pool } from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Add it to .env.local or the environment.");
  process.exit(1);
}

const sql = readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8");
const pool = new Pool({ connectionString: url });

try {
  await pool.query(sql);
  console.log("schema applied");
} catch (error) {
  console.error("migration failed:", error.message);
  process.exitCode = 1;
} finally {
  await pool.end();
}
