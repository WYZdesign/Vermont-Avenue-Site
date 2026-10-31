import { NextResponse } from "next/server";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { buildPerformanceContract } from "@/lib/contracts";

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
      .map((item) => `- ${item.description}: ${item.quantity} x $${(Number(item.unit_cents) / 100).toFixed(2)}`)
      .join("\n");
    return `Invoice summary\n\nClient: ${context.clientName || "Client"}\nService date: ${context.serviceDate || "TBD"}\nDue: ${context.dueDate || "TBD"}\n\n${lines || "- [add line items]"}\n\nThank you for booking Vermont Avenue Records.`;
  }

  const topic = String(context.topic || "");
  const platform = String(context.platform || "social");
  return `${topic || "New from Vermont Avenue Records."}\n\nLive dates, releases, and studio footage. ${platform === "instagram" ? "Link in bio." : "Listen and follow."}`;
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
    return NextResponse.json({ ok: true, source: "template", text: templateText });
  }
}
