import Link from "next/link";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

type Stats = {
  new_bookings: string;
  quoted: string;
  booked: string;
  open_invoices: string;
  paid_cents: string;
  subscribers: string;
};

type Recent = {
  id: string;
  name: string;
  email: string;
  event_type: string;
  act: string;
  status: string;
  created_at: string;
};

function money(cents: number): string {
  return "$" + (cents / 100).toLocaleString("en-US", { maximumFractionDigits: 0 });
}

export default async function AdminHome() {
  const [stats] = await query<Stats>(`
    select
      (select count(*) from bookings where status = 'new') as new_bookings,
      (select count(*) from bookings where status = 'quoted') as quoted,
      (select count(*) from bookings where status = 'booked') as booked,
      (select count(*) from invoices where status in ('draft', 'sent')) as open_invoices,
      (select coalesce(sum(amount_cents), 0) from invoices where status = 'paid') as paid_cents,
      (select count(*) from subscribers) as subscribers
  `);
  const recent = await query<Recent>(
    "select id, name, email, event_type, act, status, created_at from bookings order by created_at desc limit 6"
  );

  const cards: Array<[string, string, string]> = [
    ["New bookings", stats?.new_bookings ?? "0", "/admin/bookings"],
    ["Quoted", stats?.quoted ?? "0", "/admin/bookings"],
    ["Booked", stats?.booked ?? "0", "/admin/bookings"],
    ["Open invoices", stats?.open_invoices ?? "0", "/admin/invoices"],
    ["Paid", money(Number(stats?.paid_cents ?? 0)), "/admin/invoices"],
    ["Subscribers", stats?.subscribers ?? "0", "/admin/subscribers"],
  ];

  return (
    <div className="space-y-10">
      <div>
        <span className="eyebrow">Admin</span>
        <h1 className="h2 mt-3">The desk.</h1>
        <p className="mt-2 text-sm muted">
          Bookings, clients, money, and the list. Everything in one place.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map(([label, value, href]) => (
          <Link
            key={label}
            href={href}
            className="border border-[var(--line)] bg-bone p-5 transition-colors hover:bg-ink hover:text-bone"
          >
            <p className="text-[0.6rem] uppercase tracking-[0.2em] opacity-60">{label}</p>
            <p className="display mt-2 text-3xl">{value}</p>
          </Link>
        ))}
      </div>

      <div className="border border-[var(--line)] bg-bone p-5">
        <div className="flex items-center justify-between gap-3 mb-3">
          <h2 className="h3">Band Ops (external)</h2>
          <Link
            href="https://noco.wyzmind.tech"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[0.6rem] uppercase tracking-[0.14em] underline transition-colors hover:text-[var(--color-forest)]"
          >
            Open NocoDB
          </Link>
        </div>
        <p className="text-[0.62rem] text-fog mb-4">
          Roster, show calendar, and task tracking for DJs, solos, bands, and crew.
          Opens in a new window.
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <div className="border border-[var(--line-soft)] p-3 text-center">
            <p className="text-[0.58rem] uppercase tracking-[0.14em] opacity-60 mb-1">Bands</p>
            <p className="display text-2xl mt-1">View roster</p>
          </div>
          <div className="border border-[var(--line-soft)] p-3 text-center">
            <p className="text-[0.58rem] uppercase tracking-[0.14em] opacity-60 mb-1">Shows</p>
            <p className="display text-2xl mt-1">Calendar</p>
          </div>
          <div className="border border-[var(--line-soft)] p-3 text-center">
            <p className="text-[0.58rem] uppercase tracking-[0.14em] opacity-60 mb-1">Tasks</p>
            <p className="display text-2xl mt-1">To-do list</p>
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-end justify-between">
          <h2 className="h3">Recent bookings</h2>
          <Link href="/admin/bookings" className="text-[0.64rem] uppercase tracking-[0.16em] underline">
            All bookings
          </Link>
        </div>
        <div className="mt-4 overflow-x-auto border border-[var(--line)] bg-bone">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-[var(--line)] text-[0.6rem] uppercase tracking-[0.16em] text-fog">
              <tr>
                <th className="p-3">Received</th>
                <th className="p-3">Name</th>
                <th className="p-3">Event</th>
                <th className="p-3">Act</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((row) => (
                <tr key={row.id} className="border-b border-[var(--line-soft)] last:border-0">
                  <td className="p-3 whitespace-nowrap muted">{new Date(row.created_at).toLocaleDateString()}</td>
                  <td className="p-3">
                    <span className="block">{row.name}</span>
                    <span className="block text-xs muted">{row.email}</span>
                  </td>
                  <td className="p-3">{row.event_type}</td>
                  <td className="p-3">{row.act}</td>
                  <td className="p-3">
                    <span className="border border-[var(--color-forest)] px-2 py-0.5 text-[0.58rem] uppercase tracking-[0.14em] text-[var(--color-forest)]">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
              {recent.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-sm muted">
                    No bookings yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
