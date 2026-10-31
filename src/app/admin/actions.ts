"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";
import { buildPerformanceContract } from "@/lib/contracts";

function str(form: FormData, key: string): string {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export async function createClientAction(form: FormData): Promise<void> {
  await requireAdmin();
  const name = str(form, "name");
  if (!name) return;
  await query(
    `insert into clients (name, email, phone, company, notes)
     values ($1, $2, $3, $4, $5)`,
    [name, str(form, "email") || null, str(form, "phone") || null, str(form, "company") || null, str(form, "notes") || null]
  );
  revalidatePath("/admin/clients");
}

export async function createInvoiceAction(form: FormData): Promise<void> {
  await requireAdmin();
  const number = str(form, "number") || "INV-" + Date.now().toString().slice(-8);
  const amount = Math.round(Number(str(form, "amount") || "0") * 100);
  await query(
    `insert into invoices (number, amount_cents, status, due_date, stripe_payment_link, notes)
     values ($1, $2, $3, $4, $5, $6)`,
    [
      number,
      Number.isFinite(amount) ? amount : 0,
      str(form, "status") || "draft",
      str(form, "due_date") || null,
      str(form, "stripe_payment_link") || null,
      str(form, "notes") || null,
    ]
  );
  revalidatePath("/admin/invoices");
}

export async function createContractAction(form: FormData): Promise<void> {
  await requireAdmin();
  const body =
    str(form, "body") ||
    "Agreement between Vermont Avenue Records and the Client for the performance described in the booking. A 50% deposit secures the date; the balance is due before the event.";
  await query(
    "insert into contracts (title, body, status) values ($1, $2, $3)",
    [str(form, "title") || "Performance agreement", body, str(form, "status") || "draft"]
  );
  revalidatePath("/admin/contracts");
}

export async function createCampaignAction(form: FormData): Promise<void> {
  await requireAdmin();
  const name = str(form, "name");
  if (!name) return;
  await query(
    "insert into campaigns (name, channel, status, audience, notes) values ($1, $2, $3, $4, $5)",
    [name, str(form, "channel") || null, str(form, "status") || "draft", str(form, "audience") || null, str(form, "notes") || null]
  );
  revalidatePath("/admin/campaigns");
}

export async function addSubscriberAction(form: FormData): Promise<void> {
  await requireAdmin();
  const email = str(form, "email").toLowerCase();
  if (!email) return;
  await query(
    `insert into subscribers (email, name, source) values ($1, $2, $3)
     on conflict (email) do nothing`,
    [email, str(form, "name") || null, str(form, "source") || "manual"]
  );
  revalidatePath("/admin/subscribers");
}

export async function updateContentAction(form: FormData): Promise<void> {
  await requireAdmin();
  const key = str(form, "key");
  if (!key) return;
  await query(
    `insert into content_blocks (key, value, updated_at) values ($1, $2, now())
     on conflict (key) do update set value = excluded.value, updated_at = now()`,
    [key, str(form, "value")]
  );
  revalidatePath("/admin/content");
}

export async function createLogisticsAction(form: FormData): Promise<void> {
  await requireAdmin();
  const eventDate = str(form, "event_date");
  await query(
    `insert into logistics (event_date, venue, crew, equipment, checklist, status, notes)
     values ($1, $2, $3, $4, $5, $6, $7)`,
    [
      eventDate || null,
      str(form, "venue") || null,
      str(form, "crew") || null,
      str(form, "equipment") || null,
      str(form, "checklist") || null,
      str(form, "status") || "planning",
      str(form, "notes") || null,
    ]
  );
  revalidatePath("/admin/logistics");
}

/* -------------------------------------------------------------------------- */
/* CONTRACTS                                                                  */
/* -------------------------------------------------------------------------- */

function cents(form: FormData, key: string): number {
  const value = Math.round(Number(str(form, key) || "0") * 100);
  return Number.isFinite(value) ? value : 0;
}

export async function createContractFromBookingAction(form: FormData): Promise<void> {
  await requireAdmin();
  const bookingId = str(form, "booking_id");
  if (!bookingId) return;

  const rows = await query<{
    name: string;
    email: string;
    phone: string | null;
    event_date: string | null;
    event_type: string;
    act: string;
    venue: string | null;
  }>(
    "select name, email, phone, event_date, event_type, act, venue from bookings where id = $1",
    [bookingId]
  );
  const booking = rows[0];
  if (!booking) return;

  const feeCents = cents(form, "fee");
  const depositCents = cents(form, "deposit") || Math.round(feeCents / 2);
  const setLength = Number(str(form, "set_length")) || null;

  const body = buildPerformanceContract({
    clientName: booking.name,
    clientEmail: booking.email,
    clientPhone: booking.phone,
    eventDate: booking.event_date,
    venue: booking.venue,
    act: booking.act,
    eventType: booking.event_type,
    feeCents,
    depositCents,
    setLengthMinutes: setLength,
  });

  await query(
    `insert into contracts
      (booking_id, title, body, status, client_name, client_email, client_phone,
       event_date, venue, act, contract_type, fee_cents, deposit_cents, set_length_minutes)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14)`,
    [
      bookingId,
      "Live performance agreement - " + booking.name,
      body,
      "draft",
      booking.name,
      booking.email,
      booking.phone,
      booking.event_date,
      booking.venue,
      booking.act,
      str(form, "contract_type") || "performance",
      feeCents,
      depositCents,
      setLength,
    ]
  );
  revalidatePath("/admin/contracts");
}

export async function updateContractStatusAction(form: FormData): Promise<void> {
  await requireAdmin();
  const id = str(form, "id");
  const status = str(form, "status");
  if (!id || !["draft", "sent", "signed", "void"].includes(status)) return;
  await query(
    "update contracts set status = $1, signed_at = case when $1 = 'signed' then now() else signed_at end, updated_at = now() where id = $2",
    [status, id]
  );
  revalidatePath("/admin/contracts");
}

export async function saveContractBodyAction(form: FormData): Promise<void> {
  await requireAdmin();
  const id = str(form, "id");
  const body = str(form, "body");
  if (!id || !body) return;
  await query("update contracts set body = $1, updated_at = now() where id = $2", [body, id]);
  revalidatePath("/admin/contracts");
}

/* -------------------------------------------------------------------------- */
/* INVOICES                                                                   */
/* -------------------------------------------------------------------------- */

type LineItem = { description: string; quantity: number; unit_cents: number };

export async function createInvoiceFullAction(form: FormData): Promise<void> {
  await requireAdmin();
  const number = str(form, "number") || "INV-" + Date.now().toString().slice(-8);

  let items: LineItem[] = [];
  try {
    const parsed = JSON.parse(str(form, "items_json") || "[]");
    if (Array.isArray(parsed)) {
      items = parsed
        .map((item) => ({
          description: String(item.description || "").slice(0, 200),
          quantity: Number(item.quantity) || 0,
          unit_cents: Math.round(Number(item.unit_cents) || 0),
        }))
        .filter((item) => item.description && item.quantity > 0);
    }
  } catch {
    items = [];
  }

  const subtotal = items.reduce((sum, item) => sum + item.quantity * item.unit_cents, 0);
  const taxCents = cents(form, "tax");
  const depositCents = cents(form, "deposit");
  const amount = subtotal + taxCents;

  await query(
    `insert into invoices
      (number, amount_cents, status, due_date, stripe_payment_link, notes,
       line_items, tax_cents, deposit_cents, client_name, client_email, service_date)
     values ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)`,
    [
      number,
      amount,
      str(form, "status") || "draft",
      str(form, "due_date") || null,
      str(form, "stripe_payment_link") || null,
      str(form, "notes") || null,
      JSON.stringify(items),
      taxCents,
      depositCents,
      str(form, "client_name") || null,
      str(form, "client_email") || null,
      str(form, "service_date") || null,
    ]
  );
  revalidatePath("/admin/invoices");
}

export async function updateInvoiceStatusAction(form: FormData): Promise<void> {
  await requireAdmin();
  const id = str(form, "id");
  const status = str(form, "status");
  if (!id || !["draft", "sent", "paid", "void"].includes(status)) return;
  await query(
    "update invoices set status = $1, paid_at = case when $1 = 'paid' then now() else paid_at end, updated_at = now() where id = $2",
    [status, id]
  );
  revalidatePath("/admin/invoices");
  revalidatePath("/admin/invoices/" + id);
}

/* -------------------------------------------------------------------------- */
/* SOCIAL HUB                                                                 */
/* -------------------------------------------------------------------------- */

export async function createSocialPostAction(form: FormData): Promise<void> {
  await requireAdmin();
  const content = str(form, "content");
  const platform = str(form, "platform");
  if (!content || !platform) return;

  let media: string[] = [];
  try {
    const parsed = JSON.parse(str(form, "media_json") || "[]");
    if (Array.isArray(parsed)) media = parsed.map(String).filter(Boolean).slice(0, 10);
  } catch {
    media = [];
  }

  const scheduled = str(form, "scheduled_for");
  const status = scheduled ? "scheduled" : "draft";

  await query(
    `insert into social_posts (platform, content, media_urls, scheduled_for, status, notes)
     values ($1,$2,$3,$4,$5,$6)`,
    [platform, content, JSON.stringify(media), scheduled || null, status, str(form, "notes") || null]
  );
  revalidatePath("/admin/social");
}

export async function updateSocialPostAction(form: FormData): Promise<void> {
  await requireAdmin();
  const id = str(form, "id");
  const status = str(form, "status");
  if (!id) return;
  if (!["draft", "scheduled", "published", "failed", "archived"].includes(status)) return;
  await query("update social_posts set status = $1, updated_at = now() where id = $2", [status, id]);
  revalidatePath("/admin/social");
}

export async function saveSocialPostAction(form: FormData): Promise<void> {
  await requireAdmin();
  const id = str(form, "id");
  const content = str(form, "content");
  if (!id || !content) return;
  await query("update social_posts set content = $1, updated_at = now() where id = $2", [content, id]);
  revalidatePath("/admin/social");
}
