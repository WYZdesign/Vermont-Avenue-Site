import { NextResponse } from "next/server";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { query } from "@/lib/db";

export const runtime = "nodejs";

const UUID = /^[0-9a-fA-F-]{36}$/;

export async function DELETE(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!isAdmin(user)) {
    return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 401 });
  }

  const { id } = await context.params;
  if (!UUID.test(id)) {
    return NextResponse.json({ ok: false, error: "Invalid id" }, { status: 400 });
  }

  await query("delete from media where id = $1", [id]);
  return NextResponse.json({ ok: true });
}
