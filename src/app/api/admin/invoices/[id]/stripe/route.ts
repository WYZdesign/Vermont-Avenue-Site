import { NextResponse } from "next/server";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import { site } from "@/lib/content";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getCurrentUser();
  if (!isAdmin(user)) {
    return NextResponse.json({ ok: false, error: "Not allowed." }, { status: 401 });
  }

  const secret = process.env.STRIPE_SECRET_KEY;
  if (!secret) {
    return NextResponse.json(
      { ok: false, error: "Stripe is not configured yet. Add STRIPE_SECRET_KEY." },
      { status: 503 }
    );
  }

  const { id } = await params;
  const rows = await query<{
    id: string;
    number: string;
    amount_cents: number;
    status: string;
  }>("select id, number, amount_cents, status from invoices where id = $1 limit 1", [id]);

  const invoice = rows[0];
  if (!invoice) {
    return NextResponse.json({ ok: false, error: "Invoice not found." }, { status: 404 });
  }
  if (invoice.amount_cents <= 0) {
    return NextResponse.json({ ok: false, error: "Invoice has no amount." }, { status: 400 });
  }

  const base = process.env.NEXT_PUBLIC_SITE_URL || site.url;
  const body = new URLSearchParams();
  body.set("mode", "payment");
  body.set("success_url", base + "/account?paid=1");
  body.set("cancel_url", base + "/account");
  body.set("client_reference_id", invoice.id);
  body.set("line_items[0][quantity]", "1");
  body.set("line_items[0][price_data][currency]", "usd");
  body.set("line_items[0][price_data][unit_amount]", String(invoice.amount_cents));
  body.set(
    "line_items[0][price_data][product_data][name]",
    "Vermont Avenue Records invoice " + invoice.number
  );

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + secret,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  const json = (await response.json()) as { url?: string; error?: { message?: string } };
  if (!response.ok || !json.url) {
    return NextResponse.json(
      { ok: false, error: json.error?.message || "Stripe could not create the link." },
      { status: 502 }
    );
  }

  await query("update invoices set stripe_payment_link = $1 where id = $2", [
    json.url,
    invoice.id,
  ]);

  return NextResponse.json({ ok: true, url: json.url });
}
