"use client";

import { useMemo, useState } from "react";
import { createInvoiceFullAction } from "@/app/admin/actions";

type Item = { description: string; quantity: string; unit: string };

const blank: Item = { description: "", quantity: "1", unit: "" };

function cents(value: string): number {
  return Math.round((Number(value) || 0) * 100);
}

export function InvoiceBuilder() {
  const [number, setNumber] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [serviceDate, setServiceDate] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [tax, setTax] = useState("");
  const [deposit, setDeposit] = useState("");
  const [status, setStatus] = useState("draft");
  const [notes, setNotes] = useState("");
  const [stripe, setStripe] = useState("");
  const [items, setItems] = useState<Item[]>([{ ...blank }]);
  const [draft, setDraft] = useState("");
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);

  const normalized = useMemo(
    () =>
      items
        .map((item) => ({
          description: item.description,
          quantity: Number(item.quantity) || 0,
          unit_cents: cents(item.unit),
        }))
        .filter((item) => item.description && item.quantity > 0),
    [items]
  );

  const subtotal = normalized.reduce((sum, item) => sum + item.quantity * item.unit_cents, 0);
  const total = subtotal + cents(tax);
  const balance = Math.max(total - cents(deposit), 0);

  function update(index: number, patch: Partial<Item>) {
    setItems((current) => current.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  }

  async function draftWithAi() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/ai/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "invoice",
          context: {
            clientName,
            serviceDate,
            dueDate,
            items: normalized,
            taxCents: cents(tax),
            depositCents: cents(deposit),
            totalCents: total,
          },
        }),
      });
      const json = (await res.json()) as { ok?: boolean; text?: string; source?: string };
      if (json.ok && json.text) {
        setDraft(json.text);
        setSource(json.source || "template");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={createInvoiceFullAction} className="grid gap-5 border border-[var(--line)] bg-bone p-5">
      <input type="hidden" name="items_json" value={JSON.stringify(normalized)} />

      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="label" htmlFor="number">Invoice number</label>
          <input
            className="field"
            id="number"
            name="number"
            placeholder="Auto"
            value={number}
            onChange={(event) => setNumber(event.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="client_name">Client name</label>
          <input
            className="field"
            id="client_name"
            name="client_name"
            value={clientName}
            onChange={(event) => setClientName(event.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="client_email">Client email</label>
          <input
            className="field"
            id="client_email"
            name="client_email"
            type="email"
            value={clientEmail}
            onChange={(event) => setClientEmail(event.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="service_date">Service date</label>
          <input
            className="field"
            id="service_date"
            name="service_date"
            type="date"
            value={serviceDate}
            onChange={(event) => setServiceDate(event.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="due_date">Due date</label>
          <input
            className="field"
            id="due_date"
            name="due_date"
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="status">Status</label>
          <select
            className="field"
            id="status"
            name="status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option value="draft">draft</option>
            <option value="sent">sent</option>
            <option value="paid">paid</option>
            <option value="void">void</option>
          </select>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <span className="label mb-0">Line items</span>
          <button
            type="button"
            onClick={() => setItems((current) => [...current, { ...blank }])}
            className="text-[0.62rem] uppercase tracking-[0.14em] underline"
          >
            Add line
          </button>
        </div>
        <div className="mt-2 space-y-2">
          {items.map((item, index) => (
            <div key={index} className="grid gap-2 sm:grid-cols-[1fr_5rem_7rem_2rem]">
              <input
                className="field"
                placeholder="Description"
                value={item.description}
                onChange={(event) => update(index, { description: event.target.value })}
              />
              <input
                className="field"
                placeholder="Qty"
                inputMode="numeric"
                value={item.quantity}
                onChange={(event) => update(index, { quantity: event.target.value })}
              />
              <input
                className="field"
                placeholder="Unit $"
                inputMode="decimal"
                value={item.unit}
                onChange={(event) => update(index, { unit: event.target.value })}
              />
              <button
                type="button"
                aria-label="Remove line"
                onClick={() => setItems((current) => current.filter((_, i) => i !== index))}
                className="border border-[var(--line)] text-sm"
              >
                x
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="tax">Tax (USD)</label>
          <input
            className="field"
            id="tax"
            name="tax"
            inputMode="decimal"
            placeholder="0.00"
            value={tax}
            onChange={(event) => setTax(event.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="deposit">Deposit received (USD)</label>
          <input
            className="field"
            id="deposit"
            name="deposit"
            inputMode="decimal"
            placeholder="0.00"
            value={deposit}
            onChange={(event) => setDeposit(event.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="stripe_payment_link">Stripe payment link</label>
          <input
            className="field"
            id="stripe_payment_link"
            name="stripe_payment_link"
            placeholder="https://buy.stripe.com/..."
            value={stripe}
            onChange={(event) => setStripe(event.target.value)}
          />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="notes">Notes</label>
          <textarea
            className="field"
            id="notes"
            name="notes"
            rows={2}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-4 border-t border-[var(--line)] pt-4">
        <dl className="grid grid-cols-3 gap-6 text-sm">
          <div>
            <dt className="text-[0.58rem] uppercase tracking-[0.16em] text-fog">Subtotal</dt>
            <dd className="mt-1 font-medium">${(subtotal / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}</dd>
          </div>
          <div>
            <dt className="text-[0.58rem] uppercase tracking-[0.16em] text-fog">Total</dt>
            <dd className="mt-1 font-medium">${(total / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}</dd>
          </div>
          <div>
            <dt className="text-[0.58rem] uppercase tracking-[0.16em] text-fog">Balance</dt>
            <dd className="mt-1 font-medium">${(balance / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}</dd>
          </div>
        </dl>
        <div className="flex flex-wrap gap-2">
          <button type="submit" className="btn">Create invoice</button>
          <button type="button" onClick={draftWithAi} disabled={loading} className="btn btn-ghost">
            {loading ? "Drafting" : "Preview with AI"}
          </button>
        </div>
      </div>

      {(draft || source) && (
        <div className="border border-[var(--line)] p-4">
          <div className="flex items-center justify-between">
            <span className="text-[0.62rem] uppercase tracking-[0.18em] text-[var(--color-forest)]">
              Preview
            </span>
            <span className="text-[0.58rem] uppercase tracking-[0.14em] text-fog">
              {source === "ai" ? "AI draft" : "Template"}
            </span>
          </div>
          <pre className="mt-2 max-h-64 overflow-auto whitespace-pre-wrap text-xs text-[rgba(11,11,11,0.75)]">
            {draft}
          </pre>
        </div>
      )}
    </form>
  );
}
