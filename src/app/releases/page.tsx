import type { Metadata } from "next";
import Link from "next/link";
import { PageHero, SectionLabel } from "@/components/SectionLabel";
import { ReleaseItem } from "@/components/ReleaseItem";
import { releases, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Releases",
  description:
    "The Vermont Avenue Records catalog. Albums and singles from The LA Limes, The Dante's Inferno, Sophia Morrow, Ryan Washington, and Isaiah Harden.",
  alternates: { canonical: "/releases" },
};

export default function ReleasesPage() {
  return (
    <>
      <PageHero
        eyebrow="Releases"
        title={
          <>
            The
            <br />
            <span className="serif text-[var(--color-sage)]">catalog.</span>
          </>
        }
        intro="Every record on the label, from the first LA Limes session to the latest singles. Listen on Bandcamp or Spotify."
      />

      <section className="section">
        <div className="wrap">
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-4">
            {releases.map((release) => (
              <ReleaseItem key={release.url + release.cover} release={release} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight border-y border-[var(--line)] bg-[var(--color-paper)]">
        <div className="wrap flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
          <div>
            <SectionLabel>Listen</SectionLabel>
            <h2 className="h2 mt-4">
              The whole
              <br />
              <span className="serif text-forest">catalog.</span>
            </h2>
            <p className="mt-3 max-w-md text-sm text-[rgba(11,11,11,0.66)]">
              Albums are $6 and tracks are $1.50 on Bandcamp. Every purchase goes
              straight to the artists.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href={site.bandcamp}
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
            >
              Bandcamp
            </a>
            <a
              href={site.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost"
            >
              Spotify
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap flex flex-col items-start justify-between gap-8 border border-[var(--line)] bg-[var(--color-paper)] p-8 md:flex-row md:items-center md:p-12">
          <div>
            <SectionLabel>Book the band</SectionLabel>
            <h2 className="h2 mt-4">
              Hear it
              <br />
              <span className="serif text-forest">live.</span>
            </h2>
          </div>
          <Link href="/book" className="btn">
            Start a booking
          </Link>
        </div>
      </section>
    </>
  );
}
