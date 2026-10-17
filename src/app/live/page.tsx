import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero, SectionLabel } from "@/components/SectionLabel";
import { liveNight, site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Live",
  description:
    "Vermont Avenue Records live. Open mic and jam night every Thursday at The Stowaway in Downtown Los Angeles.",
  alternates: { canonical: "/live" },
};

export default function LivePage() {
  return (
    <>
      <PageHero
        eyebrow="Live"
        title={
          <>
            Thursdays
            <br />
            <span className="serif text-[var(--color-sage)]">on the block.</span>
          </>
        }
        intro={liveNight.copy}
      />

      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-[1fr_1fr]">
          <div>
            <SectionLabel>The night</SectionLabel>
            <h2 className="h2 mt-5">Pull up and play.</h2>
            <p className="mt-5 text-[rgba(11,11,11,0.72)]">
              Bring your instrument or your voice. The house band, The LA Limes,
              holds the night together. Singers, players, and first-timers are all
              welcome.
            </p>

            <dl className="mt-8 grid gap-5 border-t border-[var(--line)] pt-6 sm:grid-cols-2">
              <div>
                <dt className="text-[0.62rem] uppercase tracking-[0.2em] text-forest">
                  Where
                </dt>
                <dd className="mt-1 text-sm">
                  {liveNight.venue}
                  <br />
                  {liveNight.address}
                </dd>
              </div>
              <div>
                <dt className="text-[0.62rem] uppercase tracking-[0.2em] text-forest">
                  When
                </dt>
                <dd className="mt-1 text-sm">
                  {liveNight.day}
                  <br />
                  {liveNight.time}
                </dd>
              </div>
            </dl>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={liveNight.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn"
              >
                Open map
              </a>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                Set times on Instagram
              </a>
            </div>
          </div>

          <div>
            <div className="duotone relative aspect-[4/5] w-full border border-[var(--line)]">
              <Image
                src="/images/artist-ryan.jpg"
                alt="Vermont Avenue Records live"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <p className="serif mt-4 text-xl text-forest">
              Open mic, every Thursday, The Stowaway.
            </p>
          </div>
        </div>
      </section>

      <section className="section-tight border-y border-[var(--line)] bg-[var(--color-paper)]">
        <div className="wrap">
          <SectionLabel>Good to know</SectionLabel>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              ["Doors", "8PM. Come early, sign up, settle in."],
              ["Backline", "Basic backline provided. Bring your instrument."],
              ["Vibe", "Players and listeners both welcome. Respect the room."],
            ].map(([title, body]) => (
              <div key={title} className="border-t border-[var(--line)] pt-5">
                <h3 className="h3">{title}</h3>
                <p className="mt-3 text-sm text-[rgba(11,11,11,0.66)]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap flex flex-col items-start justify-between gap-8 border border-[var(--line)] bg-[var(--color-paper)] p-8 md:flex-row md:items-center md:p-12">
          <div>
            <SectionLabel>Private events</SectionLabel>
            <h2 className="h2 mt-4">
              Need the band
              <br />
              <span className="serif text-forest">at your place?</span>
            </h2>
          </div>
          <Link href="/book" className="btn">
            Book the band
          </Link>
        </div>
      </section>
    </>
  );
}
