import { query } from "@/lib/db";
import type { Client } from "@/lib/types";
import { createClientAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminClientsPage() {
  const rows = await query<Client>(
    "select * from clients order by created_at desc limit 200"
  );

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Clients</span>
        <h1 className="h2 mt-3">The book.</h1>
        <p className="mt-2 text-sm muted">People and companies you work with.</p>
      </div>

      <form
        action={createClientAction}
        className="grid gap-3 border border-[var(--line)] bg-bone p-5 sm:grid-cols-2"
      >
        <div>
          <label className="label" htmlFor="name">Name</label>
          <input className="field" id="name" name="name" required />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input className="field" id="email" name="email" type="email" />
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone</label>
          <input className="field" id="phone" name="phone" />
        </div>
        <div>
          <label className="label" htmlFor="company">Company</label>
          <input className="field" id="company" name="company" />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="notes">Notes</label>
          <textarea className="field" id="notes" name="notes" rows={2} />
        </div>
        <div className="sm:col-span-2">
          <button type="submit" className="btn">Add client</button>
        </div>
      </form>

      <div className="overflow-x-auto border border-[var(--line)] bg-bone">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] text-[0.6rem] uppercase tracking-[0.16em] text-fog">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Company</th>
              <th className="p-3">Added</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-[var(--line-soft)] last:border-0">
                <td className="p-3">{row.name}</td>
                <td className="p-3 text-xs">{row.email || "—"}</td>
                <td className="p-3 text-xs">{row.phone || "—"}</td>
                <td className="p-3 text-xs">{row.company || "—"}</td>
                <td className="p-3 whitespace-nowrap text-xs muted">
                  {new Date(row.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-sm muted">No clients yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
