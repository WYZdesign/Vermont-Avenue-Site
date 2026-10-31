"use client";

import { useState } from "react";
import { createContractFromBookingAction } from "@/app/admin/actions";

export type BookingOption = {
  id: string;
  name: string;
  event_date: string | null;
  event_type: string;
  act: string;
  venue: string | null;
};

export function ContractBuilder({ bookings }: { bookings: BookingOption[] }) {
  const [bookingId, setBookingId] = useState(bookings[0]?.id ?? "");
  const [fee, setFee] = useState("");
  const [deposit, setDeposit] = useState("");
  const [setLength, setSetLength] = useState("90");
  const [draft, setDraft] = useState("");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const booking = bookings.find((b) => b.id === bookingId);

  async function draftWithAi() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/ai/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "contract",
          context: {
            clientName: booking?.name ?? "Client",
            eventDate: booking?.event_date ?? null,
            venue: booking?.venue ?? null,
            act: booking?.act ?? null,
            eventType: booking?.event_type ?? null,
            feeCents: Math.round((Number(fee) || 0) * 100),
            depositCents: Math.round((Number(deposit) || 0) * 100),
            setLengthMinutes: Number(setLength) || null,
          },
        }),
      });
      const json = (await res.json()) as { ok?: boolean; text?: string; source?: string };
      if (!json.ok || !json.text) throw new Error("no draft");
      setDraft(json.text);
      setSource(json.source || "template");
    } catch {
      setError("Could not draft right now.");
    } finally {
      setLoading(false);
    }
  }

  if (bookings.length === 0) {
    return (
      <p className="border border-[var(--line)] bg-bone p-6 text-sm muted">
        No bookings yet. Create a booking first, then generate the contract here.
      </p>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form
        action={createContractFromBookingAction}
        className="grid gap-3 border border-[var(--line)] bg-bone p-5"
      >
        <div>
          <label className="label" htmlFor="booking_id">Booking</label>
          <select
            className="field"
            id="booking_id"
            name="booking_id"
            value={bookingId}
            onChange={(event) => setBookingId(event.target.value)}
          >
            {bookings.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name} | {option.event_date || "no date"} | {option.act}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="fee">Fee (USD)</label>
            <input
              className="field"
              id="fee"
              name="fee"
              inputMode="decimal"
              placeholder="2500"
              value={fee}
              onChange={(event) => setFee(event.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="deposit">Deposit (USD)</label>
            <input
              className="field"
              id="deposit"
              name="deposit"
              inputMode="decimal"
              placeholder="Half by default"
              value={deposit}
              onChange={(event) => setDeposit(event.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="set_length">Set length (min)</label>
            <input
              className="field"
              id="set_length"
              name="set_length"
              inputMode="numeric"
              value={setLength}
              onChange={(event) => setSetLength(event.target.value)}
            />
          </div>
          <div>
            <label className="label" htmlFor="contract_type">Type</label>
            <select className="field" id="contract_type" name="contract_type" defaultValue="performance">
              <option value="performance">Performance</option>
              <option value="rehearsal">Rehearsal space</option>
              <option value="recording">Recording session</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          <button type="submit" className="btn">Generate contract</button>
          <button
            type="button"
            onClick={draftWithAi}
            disabled={loading}
            className="btn btn-ghost"
          >
            {loading ? "Drafting" : "Preview with AI"}
          </button>
        </div>
        {error && <p className="text-xs text-red-700">{error}</p>}
      </form>

      <div className="border border-[var(--line)] bg-bone p-5">
        <div className="flex items-center justify-between">
          <span className="text-[0.62rem] uppercase tracking-[0.18em] text-[var(--color-forest)]">
            Draft preview
          </span>
          {source && (
            <span className="text-[0.58rem] uppercase tracking-[0.14em] text-fog">
              {source === "ai" ? "AI draft" : "Template"}
            </span>
          )}
        </div>
        <pre className="mt-3 max-h-[520px] overflow-auto whitespace-pre-wrap text-xs leading-relaxed text-[rgba(11,11,11,0.75)]">
          {draft || "Pick a booking, set the fee, then press Preview with AI."}
        </pre>
      </div>
    </div>
  );
}
