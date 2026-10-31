import Link from "next/link";
import { notFound } from "next/navigation";
import { query } from "@/lib/db";
import type { Invoice } from "@/lib/types";
import { updateInvoiceStatusAction } from "../../actions";

export const dynamic = "force-dynamic";

function money(cents: number): string {
  return "$" + (cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 });
}

function lineTotal(quantity: number, unit: number): number {
  return quantity * unit;
}

export default async function InvoiceDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const rows = await query<Invoice>("select * from invoices where id = $1 limit 1", [id]);
  const invoice = rows[0];
  if (!invoice) notFound();

  const items = Array.isArray(invoice.line_items) ? invoice.line_items : [];
  const subtotal = items.reduce((sum, item) => sum + lineTotal(item.quantity, item.unit_cents), 0);
  const total = subtotal + invoice.tax_cents;
  const balance = Math.max(total - invoice.deposit_cents, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="eyebrow">Invoice</span>
          <h1 className="h2 mt-3">{invoice.number}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/invoices" className="btn btn-ghost">Back</Link>
          <form action={updateInvoiceStatusAction} className="flex items-center gap-2">
            <input type="hidden" name="id" value={invoice.id} />
            <select name="status" defaultValue={invoice.status} className="field max-w-[9rem]">
              <option value="draft">draft</option>
              <option value="sent">sent</option>
              <option value="paid">paid</option>
              <option value="void">void</option>
            </select>
            <button type="submit" className="btn">Update</button>
          </form>
        </div>
      </div>

      <article className="border border-[var(--line)] bg-white p-8 text-ink print:border-0 print:p-0">
        <header className="flex flex-wrap items-start justify-between gap-6 border-b border-[var(--line)] pb-6">
          <div>
            <p className="font-serif text-2xl">Vermont Avenue Records</p>
            <p className="mt-1 text-xs text-fog">Los Angeles, California</p>
            <p className="text-xs text-fog">bookings@vermontavenuerecords.com</p>
          </div>
          <div className="text-right text-xs">
            <p className="text-[0.6rem] uppercase tracking-[0.16em] text-fog">Invoice</p>
            <p className="mt-1 text-lg font-medium">{invoice.number}</p>
            <p className="mt-1">Issued {new Date(invoice.created_at).toLocaleDateString()}</p>
            <p>Due {invoice.due_date || "on receipt"}</p>
            <p className="mt-1 uppercase tracking-[0.12em]">{invoice.status}</p>
          </div>
        </header>

        <section className="grid gap-6 py-6 sm:grid-cols-2">
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.16em] text-fog">Billed to</p>
            <p className="mt-1 text-sm font-medium">{invoice.client_name || "Client"}</p>
            {invoice.client_email && <p className="text-xs text-fog">{invoice.client_email}</p>}
          </div>
          <div>
            <p className="text-[0.6rem] uppercase tracking-[0.16em] text-fog">Service date</p>
            <p className="mt-1 text-sm">{invoice.service_date || "TBD"}</p>
          </div>
        </section>

        <table className="w-full text-left text-sm">
          <thead className="border-y border-[var(--line)] text-[0.58rem] uppercase tracking-[0.16em] text-fog">
            <tr>
              <th className="py-2">Description</th>
              <th className="py-2 text-right">Qty</th>
              <th className="py-2 text-right">Unit</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b border-[var(--line-soft)]">
                <td className="py-2">{item.description}</td>
                <td className="py-2 text-right">{item.quantity}</td>
                <td className="py-2 text-right">{money(item.unit_cents)}</td>
                <td className="py-2 text-right">{money(lineTotal(item.quantity, item.unit_cents))}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr>
                <td colSpan={4} className="py-4 text-center text-xs text-fog">No line items.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="mt-6 flex justify-end">
          <dl className="w-full max-w-xs space-y-1 text-sm">
            <div className="flex justify-between">
              <dt className="text-fog">Subtotal</dt>
              <dd>{money(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-fog">Tax</dt>
              <dd>{money(invoice.tax_cents)}</dd>
            </div>
            <div className="flex justify-between border-t border-[var(--line)] pt-1 font-medium">
              <dt>Total</dt>
              <dd>{money(total)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-fog">Deposit received</dt>
              <dd>-{money(invoice.deposit_cents)}</dd>
            </div>
            <div className="flex justify-between border-t border-[var(--line)] pt-1 text-base font-medium">
              <dt>Balance due</dt>
              <dd>{money(balance)}</dd>
            </div>
          </dl>
        </div>

        {invoice.stripe_payment_link && (
          <p className="mt-6 text-xs">
            Pay online:{" "}
            <a href={invoice.stripe_payment_link} className="underline" target="_blank" rel="noopener noreferrer">
              {invoice.stripe_payment_link}
            </a>
          </p>
        )}

        {invoice.notes && (
          <p className="mt-6 whitespace-pre-wrap border-t border-[var(--line)] pt-4 text-xs text-fog">
            {invoice.notes}
          </p>
        )}

        <p className="mt-6 text-[0.58rem] uppercase tracking-[0.14em] text-fog">
          Payment by cash, Zelle, Cash App, Venmo, PayPal, or card at the venue.
        </p>
      </article>
    </div>
  );
}
