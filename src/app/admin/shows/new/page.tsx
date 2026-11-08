import Link from "next/link";
import { createShowAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewShowPage() {
  await requireAdmin();

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <span className="eyebrow">Admin / Band Ops</span>
        <h1 className="h2 mt-3">Add show.</h1>
        <p className="mt-2 text-sm muted">Creates a show on the calendar and the public shows page.</p>
      </div>

      <form action={createShowAction} className="space-y-4 border border-[var(--line)] bg-bone p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="label">Show name *</span>
            <input name="name" required className="field" placeholder="Live at the Rhythm Room" />
          </label>
          <label className="block">
            <span className="label">Date *</span>
            <input name="date" type="date" required className="field" />
          </label>
          <label className="block">
            <span className="label">Venue *</span>
            <input name="venue" required className="field" placeholder="The Rhythm Room" />
          </label>
          <label className="block">
            <span className="label">Act *</span>
            <input name="act" required className="field" placeholder="Full Band / DJ / Solo" />
          </label>
          <label className="block">
            <span className="label">City *</span>
            <input name="city" required className="field" placeholder="Los Angeles" />
          </label>
          <label className="block">
            <span className="label">State *</span>
            <input name="state" required className="field" placeholder="CA" />
          </label>
          <label className="block">
            <span className="label">Status</span>
            <select name="status" className="field" defaultValue="tentative">
              <option value="tentative">Tentative</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="label">Notes</span>
            <textarea name="notes" rows={3} className="field" placeholder="Load-in, set times, contacts..." />
          </label>
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <button type="submit" className="btn">Save show</button>
          <Link href="/admin/shows" className="btn btn-ghost">Cancel</Link>
        </div>
      </form>
    </div>
  );
}