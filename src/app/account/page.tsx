import type { Metadata } from "next";
import Link from "next/link";
import { isAdmin, requireUser } from "@/lib/auth";
import { query } from "@/lib/db";
import type { Booking } from "@/lib/types";
import { LogoutButton } from "@/components/LogoutButton";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: false },
};

export default async function AccountPage() {
  const user = await requireUser("/account");
  const bookings = await query<Booking>(
    "select * from bookings where lower(email) = lower($1) order by created_at desc",
    [user.email]
  );

  return (
    <section className="section">
      <div className="wrap max-w-4xl">
        <span className="eyebrow">Account</span>
        <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="h2">Hi, {user.name.split(" ")[0]}.</h1>
            <p className="mt-2 text-sm muted">
              {user.email} · {user.role}
            </p>
          </div>
          <div className="flex gap-2">
            {isAdmin(user) && (
              <Link href="/admin" className="btn">
                Open admin
              </Link>
            )}
            <LogoutButton />
          </div>
        </div>

        <h2 className="h3 mt-12">Your bookings</h2>
        {bookings.length === 0 ? (
          <p className="mt-3 text-sm muted">
            No bookings yet.{" "}
            <Link href="/book" className="underline">
              Start one.
            </Link>
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-[var(--line)] border border-[var(--line)]">
            {bookings.map((booking) => (
              <li key={booking.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div>
                  <p className="text-sm font-medium">
                    {booking.event_type} · {booking.act}
                  </p>
                  <p className="text-xs muted">
                    {booking.event_date || "Date TBD"}
                    {booking.venue ? " · " + booking.venue : ""}
                  </p>
                </div>
                <span className="border border-[var(--color-forest)] px-2 py-1 text-[0.6rem] uppercase tracking-[0.16em] text-[var(--color-forest)]">
                  {booking.status}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
