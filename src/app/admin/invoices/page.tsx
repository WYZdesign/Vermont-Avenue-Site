import { query } from "@/lib/db";
import type { Invoice } from "@/lib/types";
import { createInvoiceAction } from "../actions";

export const dynamic = "force-dynamic";

function money(cents: number): string {
  return "$" + (cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 });
}

export default async function AdminInvoicesPage() {
  const rows = await query<Invoice>(
    "select * from invoices order by created_at desc limit 200"
  );

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Invoices</span>
        <h1 className="h2 mt-3">The money.</h1>
        <p className="mt-2 text-sm muted">
          Create invoices and attach a Stripe payment link when the account is live.
        </p>
      </div>

      <form
        action={createInvoiceAction}
        className="grid gap-3 border border-[var(--line)] bg-bone p-5 sm:grid-cols-2"
      >
        <div>
          <label className="label" htmlFor="number">Invoice number</label>
          <input className="field" id="number" name="number" placeholder="Auto" />
        </div>
        <div>
          <label className="label" htmlFor="amount">Amount (USD)</label>
          <input className="field" id="amount" name="amount" inputMode="decimal" placeholder="0.00" />
        </div>
        <div>
          <label className="label" htmlFor="status">Status</label>
          <select className="field" id="status" name="status" defaultValue="draft">
            <option value="draft">draft</option>
            <option value="sent">sent</option>
            <option value="paid">paid</option>
            <option value="void">void</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="due_date">Due date</label>
          <input className="field" id="due_date" name="due_date" type="date" />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="stripe_payment_link">Stripe payment link</label>
          <input className="field" id="stripe_payment_link" name="stripe_payment_link" placeholder="https://buy.stripe.com/..." />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="notes">Notes</label>
          <textarea className="field" id="notes" name="notes" rows={2} />
        </div>
        <div className="sm:col-span-2">
          <button type="submit" className="btn">Create invoice</button>
        </div>
      </form>

      <div className="overflow-x-auto border border-[var(--line)] bg-bone">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] text-[0.6rem] uppercase tracking-[0.16em] text-fog">
            <tr>
              <th className="p-3">Number</th>
              <th className="p-3">Amount</th>
              <th className="p-3">Status</th>
              <th className="p-3">Due</th>
              <th className="p-3">Stripe link</th>
              <th className="p-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-[var(--line-soft)] last:border-0">
                <td className="p-3 font-medium">{row.number}</td>
                <td className="p-3">{money(row.amount_cents)}</td>
                <td className="p-3 text-xs uppercase tracking-[0.12em]">{row.status}</td>
                <td className="p-3 text-xs">{row.due_date || "—"}</td>
                <td className="p-3 text-xs">
                  {row.stripe_payment_link ? (
                    <a href={row.stripe_payment_link} target="_blank" rel="noopener noreferrer" className="underline">
                      Open
                    </a>
                  ) : (
                    "—"
                  )}
                </td>
                <td className="p-3 whitespace-nowrap text-xs muted">
                  {new Date(row.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={6} className="p-6 text-center text-sm muted">No invoices yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
