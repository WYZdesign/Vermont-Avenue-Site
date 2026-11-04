import { NextResponse } from "next/server";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { buildPerformanceContract } from "@/lib/contracts";
import Anthropic from "@anthropic-ai/sdk";

export const runtime = "nodejs";
export const maxDuration = 60;

type Body = {
  kind?: "contract" | "invoice" | "social";
  context?: Record<string, unknown>;
};

const VOICE = [
  "Write in plain, direct English.",
  "No em dashes or en dashes.",
  "No corporate filler.",
  "Do not invent facts that are not in the input.",
].join(" ");

function fallback(kind: string, context: Record<string, unknown>): string {
  if (kind === "contract") {
    return buildPerformanceContract({
      clientName: String(context.clientName || "Client"),
      clientEmail: context.clientEmail ? String(context.clientEmail) : null,
      clientPhone: context.clientPhone ? String(context.clientPhone) : null,
      eventDate: context.eventDate ? String(context.eventDate) : null,
      venue: context.venue ? String(context.venue) : null,
      act: context.act ? String(context.act) : null,
      eventType: context.eventType ? String(context.eventType) : null,
      feeCents: Math.round(Number(context.feeCents) || 0),
      depositCents: Math.round(Number(context.depositCents) || 0),
      setLengthMinutes: context.setLengthMinutes ? Number(context.setLengthMinutes) : null,
    });
  }

  if (kind === "invoice") {
    const items = Array.isArray(context.items) ? (context.items as Array<Record<string, unknown>>) : [];
    const lines = items
      .map((item) => {
        const qty = Number(item.quantity) || 1;
        const unit = Number(item.unit_cents) || 0;
        const total = qty * unit;
        return `${item.description || "Item"}\t${qty}\t$${(unit / 100).toFixed(2)}\t$${(total / 100).toFixed(2)}`;
      })
      .join("\n");
    const subtotalCents = items.reduce((sum, item) => sum + (Number(item.quantity) || 1) * (Number(item.unit_cents) || 0), 0);
    const taxCents = Number(context.tax_cents) || 0;
    const depositCents = Number(context.deposit_cents) || 0;
    const totalCents = subtotalCents + taxCents;
    const balanceCents = Math.max(totalCents - depositCents, 0);
    return `VERMONT AVENUE RECORDS — INVOICE

Invoice #: ${context.invoiceNumber || "[auto]"}
Date: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
Due: ${context.dueDate || "On receipt"}

Bill To:
${context.clientName || "Client"}
${context.clientEmail ? context.clientEmail + "\n" : ""}${context.clientPhone ? context.clientPhone + "\n" : ""}

Service Date: ${context.serviceDate || "TBD"}
Venue/Event: ${context.venue || context.eventName || "TBD"}

ITEMS
Description\tQty\tUnit\tTotal
${lines || "- [add line items]\t1\t$0.00\t$0.00"}

Subtotal: $${(subtotalCents / 100).toFixed(2)}
Tax: $${(taxCents / 100).toFixed(2)}
Total: $${(totalCents / 100).toFixed(2)}
Deposit Paid: $${(depositCents / 100).toFixed(2)}
Balance Due: $${(balanceCents / 100).toFixed(2)}

Payment: cash, Zelle, Cash App, Venmo, PayPal, or card. Net 0 — due on receipt.
Make payments to: Vermont Avenue Records

Thank you for booking Vermont Avenue Records.`;
  }

  const topic = String(context.topic || "");
  const platform = String(context.platform || "instagram");
  const handle = platform === "instagram" ? "@vermontavenuerecords" : platform === "tiktok" ? "@vermontavenuerecords" : "Vermont Avenue Records";
  const base = topic || "New from Vermont Avenue Records — live dates, releases, and studio footage.";
  const cta = platform === "instagram" ? "Link in bio for tickets and merch." : platform === "tiktok" ? "Follow for more." : "Listen and follow.";
  const tags = platform === "instagram" ? "\n#VermontAvenueRecords #LAEvents #LiveMusic #IndependentLabel" : platform === "tiktok" ? "\n#VermontAvenueRecords #LAEvents #LiveMusic" : "";
  return `${base}\n\n${cta}${tags}`;
}

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!isAdmin(user)) {
    return NextResponse.json({ ok: false, error: "Not allowed." }, { status: 401 });
  }

  let body: Body;
  try {
    body = (await request.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  const kind = body.kind || "contract";
  const context = body.context || {};
  const templateText = fallback(kind, context);

  const base = process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434";
  const model = process.env.AI_MODEL || "llama3.2:3b";

  const instruction =
    kind === "contract"
      ? "Draft a complete, plain-English live performance agreement. Include parties, engagement details, fee and deposit, late payment, cancellation by client, cancellation by artist, force majeure, venue and technical requirements, conduct, travel, recording and media, independent contractor status, insurance and liability, overtime, governing law (California), entire agreement, and signature blocks. End with a one-line note that this is a template and not legal advice."
      : kind === "invoice"
        ? "Write a short, professional invoice summary with a line item table in plain text, subtotal, tax, deposit, and balance due. Keep it under 200 words."
        : "Write one social media caption under 180 characters, plus a second slightly longer version under 300 characters. No hashtags unless topic words clearly need them.";

  const prompt = `${instruction}\n\n${VOICE}\n\nInput data:\n${JSON.stringify(context, null, 2)}`;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 25000);
    const res = await fetch(`${base}/api/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        prompt,
        stream: false,
        keep_alive: "5m",
        options: { temperature: 0.4, num_ctx: 4096 },
      }),
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timer);

    if (!res.ok) throw new Error("model " + res.status);
    const json = (await res.json()) as { response?: string };
    const text = (json.response || "").trim();
    if (!text) throw new Error("empty");
    return NextResponse.json({ ok: true, source: "ai", text });
  } catch {
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (anthropicKey) {
      try {
        const anthropic = new Anthropic({ apiKey: anthropicKey });
        const msg = await anthropic.messages.create({
          model: "claude-3-5-sonnet-20241022",
          max_tokens: 1500,
          temperature: 0.4,
          system: VOICE,
          messages: [{ role: "user", content: prompt }],
        });
        const text = msg.content[0].type === "text" ? msg.content[0].text.trim() : "";
        if (text) {
          return NextResponse.json({ ok: true, source: "anthropic", text });
        }
      } catch {
        // fall through to template
      }
    }
    return NextResponse.json({ ok: true, source: "template", text: templateText });
  }
}
