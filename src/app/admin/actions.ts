"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";

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
