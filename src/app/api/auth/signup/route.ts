import { NextResponse } from "next/server";
import { createSession, hashPassword } from "@/lib/auth";
import { isDbConfigured, query } from "@/lib/db";

export async function POST(request: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Accounts are not configured yet." },
      { status: 503 }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!name || !email || !password) {
    return NextResponse.json(
      { ok: false, error: "Name, email, and password are required." },
      { status: 400 }
    );
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 }
    );
  }
  if (password.length < 8) {
    return NextResponse.json(
      { ok: false, error: "Password must be at least 8 characters." },
      { status: 400 }
    );
  }

  const existing = await query<{ id: string }>(
    "select id from users where lower(email) = lower($1) limit 1",
    [email]
  );
  if (existing[0]) {
    return NextResponse.json(
      { ok: false, error: "An account with that email already exists." },
      { status: 409 }
    );
  }

  const rows = await query<{ id: string }>(
    "insert into users (email, name, role, password_hash) values ($1, $2, 'fan', $3) returning id",
    [email, name, hashPassword(password)]
  );

  await createSession(rows[0].id);
  return NextResponse.json({ ok: true });
}
