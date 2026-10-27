import Link from "next/link";

export const revalidate = 0;

type NocoRecord = {
  id: string;
  Band_s?: string;
  Type_s?: string;
  Date?: string;
  Venue_s?: string;
  Status_s?: string;
};

type ShowsResponse = {
  list: NocoRecord[];
};

async function fetchShows(): Promise<NocoRecord[]> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/noco/shows?table=Shows&limit=100`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  const data = (await res.json()) as ShowsResponse;
  return data.list ?? [];
}

function parseDate(dateStr: string | undefined) {
  if (!dateStr) return "TBA";
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

export default async function ShowsPage() {
  const shows: NocoRecord[] = await fetchShows();

  const upcoming = shows.filter((s: NocoRecord) => !s.Date || new Date(s.Date) >= new Date());
  const past = shows.filter((s) => s.Date && new Date(s.Date) < new Date());

  return (
    <div className="space-y-12">
      <section>
        <h1 className="h1 mb-4">Upcoming Shows</h1>
        <p className="muted">All scheduled gigs for John and the band.</p>
      </section>

      {upcoming.length === 0 && (
        <p className="text-sm text-muted">No upcoming shows scheduled. Check back later!</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {upcoming.map((show: NocoRecord) => (
          <div
            key={show.id}
            className="border border-[var(--line)] bg-[color:var(--color-paper)] p-5 transition-colors hover:border-[var(--color-forest)]"
          >
            <h3 className="display text-lg">{show.Band_s || "JB Set"}</h3>
            <p className="text-sm muted mb-2">{parseDate(show.Date)}</p>
            <p className="text-sm mb-2">{show.Venue_s || "Venue"}</p>
            <span className="text-xs uppercase tracking-[0.14em] border border-[var(--color-forest)] px-2 py-0.5 text-[var(--color-forest)]">
              {show.Status_s || "Upcoming"}
            </span>
          </div>
        ))}
      </div>

      <section>
        <h2 className="h3 mb-4">Past Shows</h2>
        {past.length === 0 && <p className="text-sm text-muted">No past shows recorded.</p>}
      </section>
    </div>
  );
}