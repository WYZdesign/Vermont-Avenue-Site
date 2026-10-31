import Link from "next/link";
import { query } from "@/lib/db";
import type { Invoice } from "@/lib/types";
import { updateInvoiceStatusAction } from "../actions";
import { InvoiceBuilder } from "@/components/admin/InvoiceBuilder";
import { StripeLinkButton } from "./StripeLinkButton";

export const dynamic = "force-dynamic";

function money(cents: number): string {
  return "$" + (cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 });
}

export default async function AdminInvoicesPage() {
  const rows = await query<Invoice>("select * from invoices order by created_at desc limit 200");
  const open = rows.filter((row) => row.status !== "paid" && row.status !== "void");
  const outstanding = open.reduce((sum, row) => sum + row.amount_cents, 0);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Invoices</span>
          <h1 className="h2 mt-3">The money.</h1>
          <p className="mt-2 text-sm muted">
            Build line-item invoices, track deposits, and attach a Stripe payment link.
          </p>
        </div>
        <div className="border border-[var(--line)] bg-bone px-5 py-3">
          <p className="text-[0.58rem] uppercase tracking-[0.16em] text-fog">Outstanding</p>
          <p className="mt-1 text-xl font-medium">{money(outstanding)}</p>
        </div>
      </div>

      <InvoiceBuilder />

      <div className="overflow-x-auto border border-[var(--line)] bg-bone">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] text-[0.6rem] uppercase tracking-[0.16em] text-fog">
            <tr>
              <th className="p-3">Number</th>
              <th className="p-3">Client</th>
              <th className="p-3">Total</th>
              <th className="p-3">Status</th>
              <th className="p-3">Due</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-[var(--line-soft)] last:border-0">
                <td className="p-3 font-medium">
                  <Link href={"/admin/invoices/" + row.id} className="underline">
                    {row.number}
                  </Link>
                </td>
                <td className="p-3 text-xs">{row.client_name || "-"}</td>
                <td className="p-3">{money(row.amount_cents)}</td>
                <td className="p-3 text-xs uppercase tracking-[0.12em]">{row.status}</td>
                <td className="p-3 text-xs">{row.due_date || "-"}</td>
                <td className="p-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <form action={updateInvoiceStatusAction} className="flex items-center gap-1">
                      <input type="hidden" name="id" value={row.id} />
                      <select name="status" defaultValue={row.status} className="field !min-h-8 !py-1 text-xs">
                        <option value="draft">draft</option>
                        <option value="sent">sent</option>
                        <option value="paid">paid</option>
                        <option value="void">void</option>
                      </select>
                      <button type="submit" className="border border-[var(--line)] px-2 py-1 text-[0.58rem] uppercase tracking-[0.14em]">
                        Set
                      </button>
                    </form>
                    <StripeLinkButton id={row.id} />
                  </div>
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
