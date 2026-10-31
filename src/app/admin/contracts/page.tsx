import { query } from "@/lib/db";
import type { Contract } from "@/lib/types";
import { updateContractStatusAction, saveContractBodyAction } from "../actions";
import { ContractBuilder, type BookingOption } from "@/components/admin/ContractBuilder";

export const dynamic = "force-dynamic";

export default async function AdminContractsPage() {
  const bookings = await query<BookingOption>(
    `select id, name, event_date, event_type, act, venue
       from bookings
      order by created_at desc
      limit 50`
  );

  const rows = await query<Contract>(
    "select * from contracts order by created_at desc limit 200"
  );

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Contracts</span>
        <h1 className="h2 mt-3">The paper.</h1>
        <p className="mt-2 text-sm muted">
          Generate a full performance agreement from a booking, preview it with AI, then
          send it for signature.
        </p>
      </div>

      <ContractBuilder bookings={bookings} />

      <div className="space-y-3">
        {rows.map((row) => (
          <details key={row.id} className="border border-[var(--line)] bg-bone p-4">
            <summary className="flex cursor-pointer flex-wrap items-center gap-3 text-sm font-medium">
              <span>{row.title}</span>
              <span className="text-[0.6rem] uppercase tracking-[0.14em] text-fog">
                {row.contract_type} | {row.status}
              </span>
              {row.fee_cents > 0 && (
                <span className="text-[0.6rem] uppercase tracking-[0.14em] text-fog">
                  ${(row.fee_cents / 100).toLocaleString()}
                </span>
              )}
            </summary>

            <div className="mt-4 flex flex-wrap items-center gap-3">
              <form action={updateContractStatusAction} className="flex items-center gap-2">
                <input type="hidden" name="id" value={row.id} />
                <select name="status" defaultValue={row.status} className="field max-w-[10rem]">
                  <option value="draft">draft</option>
                  <option value="sent">sent</option>
                  <option value="signed">signed</option>
                  <option value="void">void</option>
                </select>
                <button type="submit" className="btn btn-ghost">Update</button>
              </form>
              {row.signed_at && (
                <span className="text-[0.62rem] text-fog">
                  Signed {new Date(row.signed_at).toLocaleDateString()}
                </span>
              )}
            </div>

            <form action={saveContractBodyAction} className="mt-4 grid gap-2">
              <input type="hidden" name="id" value={row.id} />
              <textarea
                name="body"
                defaultValue={row.body}
                rows={18}
                className="field font-mono text-xs leading-relaxed"
              />
              <button type="submit" className="btn w-fit">Save changes</button>
            </form>
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
