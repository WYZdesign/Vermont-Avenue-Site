import Link from "next/link";
import type { ReactNode } from "react";
import { LogoutButton } from "@/components/LogoutButton";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const links: Array<[string, string]> = [
  ["Overview", "/admin"],
  ["Bookings", "/admin/bookings"],
  ["Clients", "/admin/clients"],
  ["Invoices", "/admin/invoices"],
  ["Contracts", "/admin/contracts"],
  ["Campaigns", "/admin/campaigns"],
  ["Logistics", "/admin/logistics"],
  ["Subscribers", "/admin/subscribers"],
  ["Content", "/admin/content"],
  ["Bands & Shows", "https://noco.wyzmind.tech"],
];

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireAdmin();

  return (
    <div className="min-h-screen bg-[var(--color-paper)]">
      <header className="border-b border-[var(--line)] bg-bone">
        <div className="wrap flex h-16 items-center justify-between gap-4">
          <Link href="/admin" className="font-display text-lg tracking-tight">
            VA ADMIN
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden text-[0.62rem] uppercase tracking-[0.16em] text-fog sm:inline">
              {user.name} · {user.role}
            </span>
            <Link href="/" className="text-[0.62rem] uppercase tracking-[0.16em] underline">
              View site
            </Link>
            <LogoutButton />
          </div>
        </div>
      </header>

      <div className="wrap grid gap-8 py-8 lg:grid-cols-[190px_1fr]">
        <nav className="flex flex-wrap gap-2 lg:flex-col lg:gap-1" aria-label="Admin">
          {links.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className="border border-[var(--line)] px-3 py-2 text-[0.66rem] uppercase tracking-[0.14em] transition-colors hover:bg-ink hover:text-bone"
            >
              {label}
            </Link>
          ))}
        </nav>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
