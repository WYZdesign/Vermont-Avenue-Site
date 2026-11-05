import { query } from "@/lib/db";
import type { Booking } from "@/lib/types";
import { BookingStatusSelect } from "./BookingStatusSelect";

function money(cents: number | string | null | undefined): string {
  if (!cents) return "TBD";
  const num = typeof cents === "string" ? parseInt(cents, 10) : cents;
  if (Number.isNaN(num)) return "TBD";
  return "$" + (num / 100).toLocaleString("en-US", { minimumFractionDigits: 2 });
}

function fmtDate(value: string | null | undefined): string {
  if (!value) return "TBD";
  const d = new Date(value + "T12:00:00");
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" });
}

function fmtDateTime(value: string | null | undefined): string {
  if (!value) return "TBD";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString("en-US", { year: "numeric", month: "2-digit", day: "2-digit" });
}

export const dynamic = "force-dynamic";

export default async function AdminBookingsPage() {
  const rows = await query<Booking>(
    "select * from bookings order by created_at desc limit 200"
  );

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Bookings</span>
        <h1 className="h2 mt-3">Requests.</h1>
        <p className="mt-2 text-sm muted">
          Every booking request from the site. Update the status as you work it.
        </p>
      </div>

      <div className="overflow-x-auto border border-[var(--line)] bg-bone">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-[var(--line)] text-[0.6rem] uppercase tracking-[0.16em] text-fog">
            <tr>
              <th className="p-3">Received</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Event</th>
              <th className="p-3">Act</th>
              <th className="p-3">Date</th>
              <th className="p-3">Venue</th>
              <th className="p-3">Budget</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-[var(--line-soft)] last:border-0 align-top">
                <td className="p-3 whitespace-nowrap muted">{fmtDateTime(row.created_at)}</td>
                <td className="p-3">
                  <span className="block">{row.name}</span>
                  <a href={"mailto:" + row.email} className="block text-xs underline">{row.email}</a>
                  {row.phone && <span className="block text-xs muted">{row.phone}</span>}
                </td>
                <td className="p-3">{row.event_type}</td>
                <td className="p-3">{row.act}</td>
                <td className="p-3 whitespace-nowrap">{fmtDate(row.event_date)}</td>
                <td className="p-3">{row.venue || "TBD"}</td>
                <td className="p-3">{money(row.budget)}</td>
                <td className="p-3">
                  <BookingStatusSelect id={row.id} status={row.status} />
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={8} className="p-6 text-center text-sm muted">
                  No bookings yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
