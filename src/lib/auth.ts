import crypto from "node:crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { query } from "./db";

const COOKIE = "va_session";
const MAX_AGE = 60 * 60 * 24 * 30;

export type Role = "owner" | "team" | "client" | "fan";

export type User = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

export function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString("hex");
  const hash = crypto.scryptSync(password, salt, 64).toString("hex");
  return "scrypt$" + salt + "$" + hash;
}

export function verifyPassword(password: string, stored: string): boolean {
  const [scheme, salt, hash] = stored.split("$");
  if (scheme !== "scrypt" || !salt || !hash) return false;
  const test = crypto.scryptSync(password, salt, 64).toString("hex");
  const a = Buffer.from(hash, "hex");
  const b = Buffer.from(test, "hex");
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

function sha256(value: string): string {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export async function createSession(userId: string): Promise<void> {
  const token = crypto.randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + MAX_AGE * 1000);
  await query(
    "insert into sessions (user_id, token_hash, expires_at) values ($1, $2, $3)",
    [userId, sha256(token), expiresAt]
  );
  const store = await cookies();
  const secure =
    process.env.COOKIE_SECURE !== undefined
      ? process.env.COOKIE_SECURE === "true"
      : process.env.NODE_ENV === "production";
  store.set(COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession(): Promise<void> {
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (token) {
    await query("delete from sessions where token_hash = $1", [sha256(token)]);
  }
  store.delete(COOKIE);
}

export async function getCurrentUser(): Promise<User | null> {
  if (!process.env.DATABASE_URL) return null;
  const store = await cookies();
  const token = store.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const rows = await query<User>(
      `select u.id, u.email, u.name, u.role
         from sessions s
         join users u on u.id = s.user_id
        where s.token_hash = $1 and s.expires_at > now()
        limit 1`,
      [sha256(token)]
    );
    return rows[0] ?? null;
  } catch {
    return null;
  }
}

export function isAdmin(user: User | null): boolean {
  return Boolean(user && (user.role === "owner" || user.role === "team"));
}

export async function requireUser(next = "/account"): Promise<User> {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=" + encodeURIComponent(next));
  return user;
}

export async function requireAdmin(next = "/admin"): Promise<User> {
  const user = await getCurrentUser();
  if (!isAdmin(user)) redirect("/login?next=" + encodeURIComponent(next));
  return user as User;
}
