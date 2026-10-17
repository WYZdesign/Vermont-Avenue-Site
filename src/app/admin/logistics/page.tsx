import { query } from "@/lib/db";
import type { Logistics } from "@/lib/types";
import { createLogisticsAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminLogisticsPage() {
  const rows = await query<Logistics>(
    "select * from logistics order by created_at desc limit 200"
  );

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Logistics</span>
        <h1 className="h2 mt-3">The day of.</h1>
        <p className="mt-2 text-sm muted">
          Crew, gear, and the checklist for each event.
        </p>
      </div>

      <form
        action={createLogisticsAction}
        className="grid gap-3 border border-[var(--line)] bg-bone p-5 sm:grid-cols-2"
      >
        <div>
          <label className="label" htmlFor="event_date">Event date</label>
          <input className="field" id="event_date" name="event_date" type="date" />
        </div>
        <div>
          <label className="label" htmlFor="venue">Venue</label>
          <input className="field" id="venue" name="venue" />
        </div>
        <div>
          <label className="label" htmlFor="crew">Crew</label>
          <input className="field" id="crew" name="crew" placeholder="Names and roles" />
        </div>
        <div>
          <label className="label" htmlFor="equipment">Equipment</label>
          <input className="field" id="equipment" name="equipment" placeholder="PA, mics, stands, ..." />
        </div>
        <div>
          <label className="label" htmlFor="status">Status</label>
          <select className="field" id="status" name="status" defaultValue="planning">
            <option value="planning">planning</option>
            <option value="confirmed">confirmed</option>
            <option value="loaded-in">loaded in</option>
            <option value="done">done</option>
            <option value="canceled">canceled</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="notes">Notes</label>
          <input className="field" id="notes" name="notes" />
        </div>
        <div className="sm:col-span-2">
          <label className="label" htmlFor="checklist">Checklist</label>
          <textarea
            className="field"
            id="checklist"
            name="checklist"
            rows={4}
            placeholder="Load-in 4pm, soundcheck 5pm, set 8pm, ..."
          />
        </div>
        <div className="sm:col-span-2">
          <button type="submit" className="btn">Add event</button>
        </div>
      </form>

      <div className="space-y-3">
        {rows.map((row) => (
          <div key={row.id} className="border border-[var(--line)] bg-bone p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm font-medium">
                {row.event_date || "Date TBD"}
                {row.venue ? " · " + row.venue : ""}
              </p>
              <span className="border border-[var(--color-forest)] px-2 py-0.5 text-[0.58rem] uppercase tracking-[0.14em] text-[var(--color-forest)]">
                {row.status}
              </span>
            </div>
            {row.crew && <p className="mt-2 text-xs muted">Crew: {row.crew}</p>}
            {row.equipment && <p className="text-xs muted">Gear: {row.equipment}</p>}
            {row.checklist && (
              <p className="mt-2 whitespace-pre-wrap text-sm text-[rgba(11,11,11,0.7)]">
                {row.checklist}
              </p>
            )}
          </div>
        ))}
        {rows.length === 0 && (
          <p className="border border-[var(--line)] bg-bone p-6 text-center text-sm muted">
            No events yet.
          </p>
        )}
      </div>
    </div>
  );
}
