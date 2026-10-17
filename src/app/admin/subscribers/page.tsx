import { query } from "@/lib/db";
import type { Subscriber } from "@/lib/types";
import { addSubscriberAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminSubscribersPage() {
  const rows = await query<Subscriber>(
    "select * from subscribers order by created_at desc limit 500"
  );

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Subscribers</span>
        <h1 className="h2 mt-3">The list.</h1>
        <p className="mt-2 text-sm muted">Everyone who joined the block list.</p>
      </div>

      <form
        action={addSubscriberAction}
        className="grid gap-3 border border-[var(--line)] bg-bone p-5 sm:grid-cols-3"
      >
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input className="field" id="email" name="email" type="email" required />
        </div>
        <div>
          <label className="label" htmlFor="name">Name</label>
          <input className="field" id="name" name="name" />
        </div>
        <div>
          <label className="label" htmlFor="source">Source</label>
          <input className="field" id="source" name="source" defaultValue="manual" />
        </div>
        <div className="sm:col-span-3">
          <button type="submit" className="btn">Add subscriber</button>
        </div>
      </form>

      <div className="overflow-x-auto border border-[var(--line)] bg-bone">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] text-[0.6rem] uppercase tracking-[0.16em] text-fog">
            <tr>
              <th className="p-3">Email</th>
              <th className="p-3">Name</th>
              <th className="p-3">Source</th>
              <th className="p-3">Joined</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-[var(--line-soft)] last:border-0">
                <td className="p-3">{row.email}</td>
                <td className="p-3 text-xs">{row.name || "—"}</td>
                <td className="p-3 text-xs">{row.source || "—"}</td>
                <td className="p-3 whitespace-nowrap text-xs muted">
                  {new Date(row.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={4} className="p-6 text-center text-sm muted">No subscribers yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
