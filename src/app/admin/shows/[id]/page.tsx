import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteShowAction, updateShowAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

type Show = {
  id: string;
  name: string;
  date: string;
  venue: string;
  city: string;
  state: string;
  status: string;
  act: string;
  notes: string | null;
};

export default async function EditShowPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const rows = await query<Show>(
    "select id, name, date, venue, city, state, status, act, notes from shows where id = $1",
    [id]
  );
  const show = rows[0];
  if (!show) notFound();

  const dateValue = show.date ? String(show.date).slice(0, 10) : "";

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <span className="eyebrow">Admin / Band Ops</span>
        <h1 className="h2 mt-3">{show.name}</h1>
        <p className="mt-2 text-sm muted">Edit or remove this show.</p>
      </div>

      <form action={updateShowAction} className="space-y-4 border border-[var(--line)] bg-bone p-6">
        <input type="hidden" name="id" value={show.id} />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="label">Show name *</span>
            <input name="name" required defaultValue={show.name} className="field" />
          </label>
          <label className="block">
            <span className="label">Date *</span>
            <input name="date" type="date" required defaultValue={dateValue} className="field" />
          </label>
          <label className="block">
            <span className="label">Venue *</span>
            <input name="venue" required defaultValue={show.venue} className="field" />
          </label>
          <label className="block">
            <span className="label">Act *</span>
            <input name="act" required defaultValue={show.act} className="field" />
          </label>
          <label className="block">
            <span className="label">City *</span>
            <input name="city" required defaultValue={show.city} className="field" />
          </label>
          <label className="block">
            <span className="label">State *</span>
            <input name="state" required defaultValue={show.state} className="field" />
          </label>
          <label className="block">
            <span className="label">Status</span>
            <select name="status" className="field" defaultValue={show.status}>
              <option value="tentative">Tentative</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </label>
          <label className="block sm:col-span-2">
            <span className="label">Notes</span>
            <textarea name="notes" rows={3} defaultValue={show.notes ?? ""} className="field" />
          </label>
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <button type="submit" className="btn">Save changes</button>
          <Link href="/admin/shows" className="btn btn-ghost">Back</Link>
        </div>
      </form>

      <form action={deleteShowAction} className="border border-[var(--line)] bg-bone p-6">
        <input type="hidden" name="id" value={show.id} />
        <p className="text-sm muted mb-3">Delete this show permanently.</p>
        <button type="submit" className="btn border-[var(--color-forest)] bg-transparent text-[var(--color-forest)] hover:bg-[var(--color-forest)] hover:text-bone">
          Delete show
        </button>
      </form>
    </div>
  );
}