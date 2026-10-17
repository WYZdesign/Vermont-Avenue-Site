import { query } from "@/lib/db";
import type { Campaign } from "@/lib/types";
import { createCampaignAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminCampaignsPage() {
  const rows = await query<Campaign>(
    "select * from campaigns order by created_at desc limit 200"
  );

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Campaigns</span>
        <h1 className="h2 mt-3">The push.</h1>
        <p className="mt-2 text-sm muted">
          Track email blasts, promo pushes, and social pushes.
        </p>
      </div>

      <form
        action={createCampaignAction}
        className="grid gap-3 border border-[var(--line)] bg-bone p-5 sm:grid-cols-2"
      >
        <div>
          <label className="label" htmlFor="name">Name</label>
          <input className="field" id="name" name="name" required />
        </div>
        <div>
          <label className="label" htmlFor="channel">Channel</label>
          <input className="field" id="channel" name="channel" placeholder="Email, Instagram, ..." />
        </div>
        <div>
          <label className="label" htmlFor="status">Status</label>
          <select className="field" id="status" name="status" defaultValue="draft">
            <option value="draft">draft</option>
            <option value="active">active</option>
            <option value="sent">sent</option>
            <option value="paused">paused</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="audience">Audience</label>
          <input className="field" id="audience" name="audience" placeholder="Block list, past clients, ..." />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="notes">Notes</label>
          <textarea className="field" id="notes" name="notes" rows={2} />
        </div>
        <div className="sm:col-span-2">
          <button type="submit" className="btn">Add campaign</button>
        </div>
      </form>

      <div className="overflow-x-auto border border-[var(--line)] bg-bone">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] text-[0.6rem] uppercase tracking-[0.16em] text-fog">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Channel</th>
              <th className="p-3">Status</th>
              <th className="p-3">Audience</th>
              <th className="p-3">Created</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-[var(--line-soft)] last:border-0">
                <td className="p-3">{row.name}</td>
                <td className="p-3 text-xs">{row.channel || "—"}</td>
                <td className="p-3 text-xs uppercase tracking-[0.12em]">{row.status}</td>
                <td className="p-3 text-xs">{row.audience || "—"}</td>
                <td className="p-3 whitespace-nowrap text-xs muted">
                  {new Date(row.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="p-6 text-center text-sm muted">No campaigns yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
