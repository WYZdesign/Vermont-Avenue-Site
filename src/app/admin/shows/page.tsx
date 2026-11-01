import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import Link from "next/link";

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
  notes: string;
};

export default async function ShowsPage() {
  await requireAdmin();

  const shows = await query<Show>(`
    select id, name, date, venue, city, state, status, act, notes
    from shows
    order by date desc
  `);

  return (
    <div className="space-y-10">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <span className="eyebrow">Admin / Band Ops</span>
          <h1 className="h2 mt-3">Shows calendar.</h1>
          <p className="mt-2 text-sm muted">
            All shows, bookings, and calendar management. Synced with NocoDB.
          </p>
        </div>
        <Link
          href="/admin/shows/new"
          className="btn whitespace-nowrap"
        >
          Add show
        </Link>
      </div>

      {shows.length === 0 ? (
        <div className="border border-[var(--line)] bg-bone p-10 text-center">
          <p className="text-lg muted mb-4">No shows yet.</p>
          <Link href="/admin/shows/new" className="btn">
            Create your first show
          </Link>
        </div>
      ) : (
        <div className="overflow-x-auto border border-[var(--line)] bg-bone">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--line)] text-[0.6rem] uppercase tracking-[0.16em] text-fog">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Show</th>
                <th className="p-3">Venue</th>
                <th className="p-3">Location</th>
                <th className="p-3">Act</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {shows.map((show) => (
                <tr key={show.id} className="border-b border-[var(--line-soft)] last:border-0">
                  <td className="p-3 whitespace-nowrap">{new Date(show.date).toLocaleDateString()}</td>
                  <td className="p-3 font-medium">{show.name}</td>
                  <td className="p-3">{show.venue}</td>
                  <td className="p-3">{show.city}, {show.state}</td>
                  <td className="p-3">{show.act}</td>
                  <td className="p-3">
                    <span className={`border px-2 py-0.5 text-[0.58rem] uppercase tracking-[0.14em] ${
                      show.status === 'confirmed' ? 'border-[var(--color-forest)] text-[var(--color-forest)]' :
                      show.status === 'pending' ? 'border-[var(--color-sage)] text-[var(--color-sage)]' :
                      'border-[var(--line)] text-fog'
                    }`}>
                      {show.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <Link href={`/admin/shows/${show.id}`} className="text-[0.64rem] uppercase tracking-[0.16em] underline hover:text-[var(--color-forest)]">
                      View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}