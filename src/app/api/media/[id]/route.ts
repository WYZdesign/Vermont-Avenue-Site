import { query } from "@/lib/db";

export const runtime = "nodejs";

const UUID = /^[0-9a-fA-F-]{36}$/;

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  if (!UUID.test(id)) return new Response("Not found", { status: 404 });

  let row: { data: Buffer; mime: string } | undefined;
  try {
    const rows = await query<{ data: Buffer; mime: string }>(
      `select b.data, m.mime
         from media m
         join media_blobs b on b.media_id = m.id
        where m.id = $1`,
      [id]
    );
    row = rows[0];
  } catch {
    return new Response("Not found", { status: 404 });
  }

  if (!row) return new Response("Not found", { status: 404 });

  const body = new Uint8Array(row.data);
  return new Response(body, {
    headers: {
      "Content-Type": row.mime || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
