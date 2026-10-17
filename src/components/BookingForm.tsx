"use client";

import { useState, type FormEvent } from "react";
import { bookingFields } from "@/lib/content";

type Status = "idle" | "sending" | "success" | "error";

export function BookingForm({ defaultAct }: { defaultAct?: string }) {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    setStatus("sending");
    setMessage("");

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setStatus("error");
        setMessage(json.error || "Something went wrong. Please try again.");
        return;
      }
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again, or DM us on Instagram.");
    }
  }

  if (status === "success") {
    return (
      <div className="border border-[var(--color-forest)] bg-[var(--color-forest)] p-8 text-bone">
        <p className="eyebrow !text-[var(--color-sage)]">Request received</p>
        <h3 className="h3 mt-4">Thanks. We&rsquo;ll be in touch.</h3>
        <p className="mt-3 max-w-md text-sm text-[rgba(244,241,232,0.75)]">
          We read every request and reply within one business day. If it is urgent,
          message us on Instagram.
        </p>
        <button
          type="button"
          className="btn mt-6 !border-bone !bg-bone !text-ink hover:!bg-ink hover:!text-bone"
          onClick={() => setStatus("idle")}
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-1">
        <label className="label" htmlFor="name">
          Name
        </label>
        <input className="field" id="name" name="name" required autoComplete="name" />
      </div>
      <div className="sm:col-span-1">
        <label className="label" htmlFor="email">
          Email
        </label>
        <input className="field" id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div className="sm:col-span-1">
        <label className="label" htmlFor="phone">
          Phone
        </label>
        <input className="field" id="phone" name="phone" type="tel" autoComplete="tel" />
      </div>
      <div className="sm:col-span-1">
        <label className="label" htmlFor="eventDate">
          Event date
        </label>
        <input className="field" id="eventDate" name="eventDate" type="date" />
      </div>
      <div className="sm:col-span-1">
        <label className="label" htmlFor="eventType">
          Event type
        </label>
        <select className="field" id="eventType" name="eventType" required defaultValue="">
          <option value="" disabled>
            Select one
          </option>
          {bookingFields.eventTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:col-span-1">
        <label className="label" htmlFor="act">
          Act
        </label>
        <select className="field" id="act" name="act" required defaultValue={defaultAct ?? ""}>
          <option value="" disabled>
            Select one
          </option>
          {bookingFields.acts.map((act) => (
            <option key={act} value={act}>
              {act}
            </option>
          ))}
          <option value="Not sure yet">Not sure yet</option>
        </select>
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="venue">
          Venue and location
        </label>
        <input className="field" id="venue" name="venue" placeholder="Venue name, city" />
      </div>
      <div className="sm:col-span-1">
        <label className="label" htmlFor="guests">
          Guest count
        </label>
        <input className="field" id="guests" name="guests" inputMode="numeric" />
      </div>
      <div className="sm:col-span-1">
        <label className="label" htmlFor="budget">
          Budget
        </label>
        <input className="field" id="budget" name="budget" placeholder="Optional" />
      </div>
      <div className="sm:col-span-2">
        <label className="label" htmlFor="message">
          Tell us about the event
        </label>
        <textarea className="field min-h-32" id="message" name="message" rows={4} />
      </div>

      <div className="hidden" aria-hidden="true">
        <label htmlFor="company">Company</label>
        <input id="company" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      {status === "error" && (
        <p className="sm:col-span-2 border border-red-700/30 bg-red-700/5 px-4 py-3 text-sm text-red-800">
          {message}
        </p>
      )}

      <div className="sm:col-span-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[0.7rem] uppercase tracking-[0.14em] muted">
          50% deposit secures the date
        </p>
        <button type="submit" className="btn" disabled={status === "sending"}>
          {status === "sending" ? "Sending" : "Send request"}
        </button>
      </div>
    </form>
  );
}
