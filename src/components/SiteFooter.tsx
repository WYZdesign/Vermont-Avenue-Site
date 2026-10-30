import Link from "next/link";
import { site } from "@/lib/content";
import { Logo } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";

const columns = [
  {
    title: "Label",
    links: [
      { label: "About", href: "/about" },
      { label: "Releases", href: "/releases" },
      { label: "Live", href: "/live" },
    ],
  },
  {
    title: "Book",
    links: [
      { label: "All services", href: "/services" },
      { label: "DJ", href: "/services/dj" },
      { label: "Full band", href: "/services/full-band" },
      { label: "Booking request", href: "/book" },
    ],
  },
  {
    title: "Listen",
    links: [
      { label: "Watch", href: "/watch" },
      { label: "Bandcamp", href: site.bandcamp },
      { label: "Spotify", href: site.spotify },
      { label: "YouTube", href: site.youtube },
      { label: "TikTok", href: site.tiktok },
    ],
  },
  {
    title: "Connect",
    links: [
      { label: "Instagram", href: site.instagram },
      { label: "Facebook", href: site.facebook },
      { label: "Sign in", href: "/login" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="dark">
      <div className="wrap section-tight">
        <div className="flex flex-col gap-10 border-b border-[var(--line-invert)] pb-10 md:flex-row md:items-end md:justify-between">
          <div className="max-w-xl">
            <Logo size={56} />
            <p className="mt-5 max-w-sm text-sm text-[rgba(244,241,232,0.6)]">
              Independent record label and live music collective. Los Angeles, California.
            </p>
          </div>
          <p className="font-serif text-2xl text-[var(--color-sage)] md:text-3xl">
            Created by musicians, for musicians.
          </p>
        </div>

        <div className="grid gap-8 py-10 sm:grid-cols-2 lg:grid-cols-4">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-sage)]">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[rgba(244,241,232,0.66)] transition-colors hover:text-bone"
                      {...(link.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-[var(--line-invert)] py-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div>
              <h3 className="text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[var(--color-sage)]">
                Join the block list
              </h3>
              <p className="mt-2 text-sm text-[rgba(244,241,232,0.6)]">
                New releases, live dates, and label news. No spam.
              </p>
            </div>
            {process.env.DATABASE_URL ? (
              <NewsletterForm />
            ) : (
              <p className="text-sm text-[rgba(244,241,232,0.6)]">The list opens soon.</p>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-3 border-t border-[var(--line-invert)] pt-6 text-[0.68rem] uppercase tracking-[0.16em] text-[rgba(244,241,232,0.42)] sm:flex-row sm:items-center sm:justify-between">
          <span>
            &copy; {new Date().getFullYear()} Vermont Avenue Records
          </span>
          <span>Est. Los Angeles, 2024</span>
        </div>
      </div>
    </footer>
  );
}
