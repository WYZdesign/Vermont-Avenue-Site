import { query } from "@/lib/db";
import type { Contract } from "@/lib/types";
import { createContractAction } from "../actions";

export const dynamic = "force-dynamic";

const template =
  "Agreement between Vermont Avenue Records and the Client for the performance described in the booking. " +
  "A 50% deposit secures the date. The balance is due before the event. " +
  "The Client provides a safe performance area, power, and a load-in window. " +
  "Cancellation terms: the deposit is non-refundable within 14 days of the event.";

export default async function AdminContractsPage() {
  const rows = await query<Contract>(
    "select * from contracts order by created_at desc limit 200"
  );

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Contracts</span>
        <h1 className="h2 mt-3">The paper.</h1>
        <p className="mt-2 text-sm muted">
          Draft agreements now; wire e-sign when the provider is set up.
        </p>
      </div>

      <form
        action={createContractAction}
        className="grid gap-3 border border-[var(--line)] bg-bone p-5"
      >
        <div>
          <label className="label" htmlFor="title">Title</label>
          <input className="field" id="title" name="title" defaultValue="Performance agreement" />
        </div>
        <div>
          <label className="label" htmlFor="body">Body</label>
          <textarea className="field" id="body" name="body" rows={6} defaultValue={template} />
        </div>
        <div>
          <label className="label" htmlFor="status">Status</label>
          <select className="field max-w-xs" id="status" name="status" defaultValue="draft">
            <option value="draft">draft</option>
            <option value="sent">sent</option>
            <option value="signed">signed</option>
            <option value="void">void</option>
          </select>
        </div>
        <div>
          <button type="submit" className="btn">Create contract</button>
        </div>
      </form>

      <div className="space-y-3">
        {rows.map((row) => (
          <details key={row.id} className="border border-[var(--line)] bg-bone p-4">
            <summary className="cursor-pointer text-sm font-medium">
              {row.title}
              <span className="ml-3 text-[0.6rem] uppercase tracking-[0.14em] text-fog">
                {row.status}
              </span>
            </summary>
            <p className="mt-3 whitespace-pre-wrap text-sm text-[rgba(11,11,11,0.7)]">
              {row.body}
            </p>
          </details>
        ))}
        {rows.length === 0 && (
          <p className="border border-[var(--line)] bg-bone p-6 text-center text-sm muted">
            No contracts yet.
          </p>
        )}
      </div>
    </div>
  );
}
