import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/*
 * Deprecated. The public shows page now reads Postgres directly.
 * This proxy previously accepted ?table= and ?limit= and forwarded the
 * server's NocoDB token, which could expose any table once configured.
 * Kept only to return a clear response for any old callers.
 */
export async function GET() {
  return NextResponse.json(
    { error: "Gone. Use the /shows page or the admin shows table." },
    { status: 410 }
  );
}