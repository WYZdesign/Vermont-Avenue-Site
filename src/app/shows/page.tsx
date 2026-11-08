import type { Metadata } from "next";
import Link from "next/link";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Shows",
  description:
    "Upcoming live dates from Vermont Avenue Records — bands, DJs, and the full collective across Los Angeles.",
  alternates: { canonical: "/shows" },
};

type Show = {
  id: string;
  name: string;
  date: string;
  venue: string;
  city: string;
  state: string;
  status: string;
  act: string;
};

function parseDate(value: string | null | undefined) {
  if (!value) return "TBA";
  const d = new Date(value);
  if (isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
}

async function getShows(): Promise<Show[]> {
  try {
    return await query<Show>(
      `select id, name, date, venue, city, state, status, act
       from shows
       where status <> 'cancelled'
       order by date asc`
    );
  } catch {
    return [];
  }
}

export default async function ShowsPage() {
  const shows = await getShows();
  const now = new Date();
  const upcoming = shows.filter((s) => !s.date || new Date(s.date) >= now);
  const past = shows.filter((s) => s.date && new Date(s.date) < now);

  return (
    <div className="wrap section space-y-12">
      <section>
        <span className="eyebrow">Live</span>
        <h1 className="h1 mt-4">Upcoming shows</h1>
        <p className="lede mt-4">
          Catch Vermont Avenue Records live across Los Angeles. Want the band at your
          event? <Link href="/book" className="underline">Book a date.</Link>
        </p>
      </section>

      {upcoming.length === 0 ? (
        <p className="text-sm muted">
          No upcoming shows scheduled yet.{" "}
          <Link href="/book" className="underline">Book the collective</Link> for your event.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {upcoming.map((show) => (
            <div
              key={show.id}
              className="border border-[var(--line)] bg-[var(--color-paper)] p-5 transition-colors hover:border-[var(--color-forest)]"
            >
              <h3 className="display text-lg">{show.name}</h3>
              <p className="text-sm muted mb-2">{parseDate(show.date)}</p>
              <p className="text-sm mb-1">{show.venue}</p>
              <p className="text-sm muted mb-3">
                {show.city}, {show.state}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase tracking-[0.14em] border border-[var(--color-forest)] px-2 py-0.5 text-[var(--color-forest)]">
                  {show.act}
                </span>
                <span className="text-xs uppercase tracking-[0.14em] muted">{show.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {past.length > 0 && (
        <section>
          <h2 className="h3 mb-4">Past shows</h2>
          <ul className="divide-y divide-[var(--line-soft)] border-y border-[var(--line-soft)] text-sm">
            {past.map((show) => (
              <li key={show.id} className="flex flex-wrap items-center justify-between gap-2 py-3">
                <span className="font-medium">{show.name}</span>
                <span className="muted">
                  {show.venue} · {parseDate(show.date)}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}