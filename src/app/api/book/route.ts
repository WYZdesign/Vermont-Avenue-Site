import { NextResponse } from "next/server";
import { isDbConfigured, query } from "@/lib/db";

type Payload = Record<string, unknown>;

function text(payload: Payload, key: string): string {
  const value = payload[key];
  return typeof value === "string" ? value.trim() : "";
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export async function POST(request: Request) {
  let payload: Payload;
  try {
    payload = (await request.json()) as Payload;
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request." },
      { status: 400 }
    );
  }

  // Honeypot: silently accept bot submissions.
  if (text(payload, "company")) {
    return NextResponse.json({ ok: true, delivery: "ignored" });
  }

  const name = text(payload, "name");
  const email = text(payload, "email");
  const eventType = text(payload, "eventType");
  const act = text(payload, "act");
  const phone = text(payload, "phone");
  const eventDate = text(payload, "eventDate");
  const venue = text(payload, "venue");
  const guests = text(payload, "guests");
  const budget = text(payload, "budget");
  const message = text(payload, "message");

  if (!name || !email || !eventType || !act) {
    return NextResponse.json(
      {
        ok: false,
        error: "Please fill in name, email, event type, and act.",
      },
      { status: 400 }
    );
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  const fields: Array<[string, string]> = [
    ["Name", name],
    ["Email", email],
    ["Phone", phone],
    ["Event date", eventDate],
    ["Event type", eventType],
    ["Act", act],
    ["Venue", venue],
    ["Guests", guests],
    ["Budget", budget],
    ["Message", message],
  ];

  const summary = fields
    .filter(([, value]) => value)
    .map(([label, value]) => label + ": " + value)
    .join("\n");

  let stored = false;
  if (isDbConfigured()) {
    try {
      await query(
        `insert into bookings (name, email, phone, event_date, event_type, act, venue, guests, budget, message)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          name,
          email,
          phone || null,
          eventDate || null,
          eventType,
          act,
          venue || null,
          guests || null,
          budget || null,
          message || null,
        ]
      );
      stored = true;
    } catch (error) {
      console.error("[booking] storage failed", error);
    }
  }

  const to = process.env.BOOKING_TO_EMAIL;
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM || "Vermont Avenue Records <onboarding@resend.dev>";

  if (apiKey && to) {
    const rows = fields
      .filter(([, value]) => value)
      .map(
        ([label, value]) =>
          "<tr><td style=\"padding:6px 12px;color:#6f6a60;font:12px sans-serif;white-space:nowrap\">" +
          escapeHtml(label) +
          "</td><td style=\"padding:6px 12px;font:14px sans-serif\">" +
          escapeHtml(value) +
          "</td></tr>"
      )
      .join("");

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        reply_to: email,
        subject: "Booking request: " + eventType + " from " + name,
        html:
          "<div style=\"font-family:sans-serif;max-width:560px\">" +
          "<h2 style=\"margin:0 0 4px\">New booking request</h2>" +
          "<p style=\"color:#6f6a60;margin:0 0 16px\">Vermont Avenue Records</p>" +
          "<table style=\"border-collapse:collapse\">" +
          rows +
          "</table></div>",
      }),
    });

    if (!response.ok) {
      console.error("[booking] email failed", response.status, await response.text());
      if (stored) {
        return NextResponse.json({ ok: true, delivery: "email-failed", stored: true });
      }
      return NextResponse.json(
        { ok: false, error: "We could not send the request. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({ ok: true, delivery: "email", stored });
  }

  // Test mode: no email configured yet. The request is accepted and logged so
  // the public form works while the inbox/DB is being wired.
  console.log("[booking] (email not configured)\n" + summary);
  return NextResponse.json({ ok: true, delivery: "test", stored });
}
