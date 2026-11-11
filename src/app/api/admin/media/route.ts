import { NextResponse } from "next/server";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { isDbConfigured, query } from "@/lib/db";

export const runtime = "nodejs";

const MAX_BYTES = 12 * 1024 * 1024;

export async function GET() {
  const user = await getCurrentUser();
  if (!isAdmin(user)) {
    return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 401 });
  }
  if (!isDbConfigured()) {
    return NextResponse.json({ ok: false, media: [] });
  }
  const media = await query(
    `select id, filename, mime, bytes, alt, created_at
       from media
      order by created_at desc
      limit 300`
  );
  return NextResponse.json({ ok: true, media });
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!isAdmin(user)) {
    return NextResponse.json({ ok: false, error: "Not authorized" }, { status: 401 });
  }
  if (!isDbConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Storage is not configured yet." },
      { status: 503 }
    );
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid upload." }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No file provided." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json(
      { ok: false, error: "Upload images here. For video, add a URL instead." },
      { status: 400 }
    );
  }
  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Images must be 12 MB or smaller." },
      { status: 400 }
    );
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const inserted = await query<{ id: string }>(
    `insert into media (filename, mime, bytes, created_by)
     values ($1, $2, $3, $4)
     returning id`,
    [file.name, file.type, file.size, user!.id]
  );
  const id = inserted[0].id;

  try {
    await query("insert into media_blobs (media_id, data) values ($1, $2)", [id, buffer]);
  } catch (error) {
    await query("delete from media where id = $1", [id]);
    return NextResponse.json({ ok: false, error: "Could not store the file." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id, url: `/api/media/${id}` });
}
