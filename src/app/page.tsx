import Image from "next/image";
import Link from "next/link";
import { ActCard } from "@/components/ActCard";
import { Marquee } from "@/components/Marquee";
import { ReleaseItem } from "@/components/ReleaseItem";
import { SectionLabel } from "@/components/SectionLabel";
import { about, acts, liveNight, releases, roster, site } from "@/lib/content";

const featuredActs = acts.filter((act) => act.featured);
const featuredReleases = releases.slice(0, 4);
const stats = [
  ["5", "Roster artists"],
  ["8", "Live configurations"],
  ["2025", "First release"],
];

export default function HomePage() {
  return (
    <>
      <section className="dark relative overflow-hidden">
        <div className="deco-sun" aria-hidden="true" />
        <div className="wrap relative grid min-h-[86vh] items-center gap-14 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div>
            <span className="eyebrow">Independent label, Los Angeles</span>
            <h1 className="h1 mt-6">
              <span className="block">VERMONT</span>
              <span className="block text-[var(--color-sage)]">AVENUE</span>
            </h1>
            <div className="mt-5 flex items-baseline gap-4">
              <span className="serif text-3xl text-[var(--color-sage)] md:text-4xl">Records</span>
              <span className="hidden h-px flex-1 bg-[var(--line-invert)] sm:block" />
              <span className="hidden text-[0.62rem] uppercase tracking-[0.28em] text-[rgba(244,241,232,0.5)] sm:block">
                Est. 2024
              </span>
            </div>
            <p className="lede mt-6 max-w-lg">
              {site.tagline} A record label and live music collective built with our
              community in Los Angeles.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/book" className="btn">
                Book the band
              </Link>
              <Link href="/services" className="btn btn-ghost">
                Explore services
              </Link>
            </div>
            <dl className="mt-12 grid max-w-lg grid-cols-3 gap-4 border-t border-[var(--line-invert)] pt-6">
              {stats.map(([value, label]) => (
                <div key={label}>
                  <dt className="text-[0.6rem] uppercase tracking-[0.2em] text-[rgba(244,241,232,0.5)]">
                    {label}
                  </dt>
                  <dd className="display mt-1 text-2xl text-bone">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="duotone relative aspect-[4/5] w-full border border-[var(--line-invert)]">
              <Image
                src="/images/artist-lalimes.jpg"
                alt="Freshly Squeezed album art"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-5 left-4 right-4 flex items-center justify-between gap-4 border border-[var(--line-invert)] bg-[rgba(11,11,11,0.92)] px-4 py-3 backdrop-blur">
              <span className="text-[0.58rem] uppercase tracking-[0.22em] text-[rgba(244,241,232,0.55)]">
                Out now
              </span>
              <span className="text-sm text-bone">Freshly Squeezed</span>
            </div>
          </div>
        </div>
      </section>

      <Marquee />

      <section className="section">
        <div className="wrap grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionLabel>01 / The label</SectionLabel>
            <h2 className="h2 mt-5">
              Created by musicians,
              <br />
              <span className="serif text-forest">for musicians.</span>
            </h2>
          </div>
          <div className="space-y-5">
            <p className="lede">{about.intro}</p>
            <p className="text-[rgba(11,11,11,0.7)]">{about.body[0]}</p>
            <Link href="/about" className="link-arrow mt-2">
              More about us
            </Link>
          </div>
        </div>
      </section>

      <section className="section-tight border-y border-[var(--line)] bg-[var(--color-paper)]">
        <div className="wrap">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionLabel>02 / Book</SectionLabel>
              <h2 className="h2 mt-5">The right band for the room.</h2>
            </div>
            <Link href="/services" className="link-arrow">
              All services
            </Link>
          </div>
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featuredActs.map((act) => (
              <ActCard key={act.slug} act={act} />
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionLabel>03 / Roster</SectionLabel>
              <h2 className="h2 mt-5">
                The people
                <br />
                <span className="serif text-forest">on the records.</span>
              </h2>
            </div>
            <p className="max-w-sm text-sm text-[rgba(11,11,11,0.62)]">
              A collective of Los Angeles players. Every act on the roster can be
              booked for your event.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-8 lg:grid-cols-5">
            {roster.map((artist) => (
              <Link
                key={artist.name}
                href={artist.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group block"
              >
                <div className="duotone relative aspect-square w-full border border-[var(--line)]">
                  <Image
                    src={artist.image}
                    alt={artist.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                    className="object-cover"
                  />
                </div>
                <h3 className="mt-3 text-sm font-medium">{artist.name}</h3>
                <p className="text-[0.64rem] uppercase tracking-[0.14em] muted">
                  {artist.genre}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight border-y border-[var(--line)] bg-[var(--color-paper)]">
        <div className="wrap">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <SectionLabel>04 / Releases</SectionLabel>
              <h2 className="h2 mt-5">
                Fresh from
                <br />
                <span className="serif text-forest">the block.</span>
              </h2>
            </div>
            <Link href="/releases" className="link-arrow">
              All releases
            </Link>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {featuredReleases.map((release) => (
              <ReleaseItem key={release.url + release.cover} release={release} />
            ))}
          </div>
        </div>
      </section>

      <section className="dark relative overflow-hidden">
        <div className="deco-arc -right-40 top-1/2 h-[34rem] w-[34rem] -translate-y-1/2" aria-hidden="true" />
        <div className="deco-arc -right-24 top-1/2 h-[22rem] w-[22rem] -translate-y-1/2" aria-hidden="true" />
        <div className="wrap relative grid gap-12 py-20 lg:grid-cols-2 lg:py-28">
          <div>
            <SectionLabel>05 / Live</SectionLabel>
            <h2 className="h2 mt-5">{liveNight.title}</h2>
            <p className="lede mt-5 max-w-lg">{liveNight.copy}</p>
            <dl className="mt-8 grid gap-5 border-t border-[var(--line-invert)] pt-6 sm:grid-cols-3">
              <div>
                <dt className="text-[0.6rem] uppercase tracking-[0.2em] text-[rgba(244,241,232,0.5)]">
                  Where
                </dt>
                <dd className="mt-1 text-sm text-bone">{liveNight.venue}</dd>
              </div>
              <div>
                <dt className="text-[0.6rem] uppercase tracking-[0.2em] text-[rgba(244,241,232,0.5)]">
                  When
                </dt>
                <dd className="mt-1 text-sm text-bone">
                  {liveNight.day}, {liveNight.time}
                </dd>
              </div>
              <div>
                <dt className="text-[0.6rem] uppercase tracking-[0.2em] text-[rgba(244,241,232,0.5)]">
                  Bring
                </dt>
                <dd className="mt-1 text-sm text-bone">Your instrument, your voice</dd>
              </div>
            </dl>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/live" className="btn">
                Live details
              </Link>
              <a
                href={liveNight.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                Map
              </a>
            </div>
          </div>
          <div className="relative">
            <div className="duotone relative aspect-[4/3] w-full border border-[var(--line-invert)]">
              <Image
                src="/images/artist-ryan.jpg"
                alt="Vermont Avenue Records live"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <p className="serif mt-4 text-xl text-[var(--color-sage)]">
              Open mic, every Thursday, The Stowaway.
            </p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap flex flex-col items-start justify-between gap-8 border border-[var(--line)] bg-[var(--color-paper)] p-8 md:flex-row md:items-center md:p-12">
          <div>
            <SectionLabel>Bookings</SectionLabel>
            <h2 className="h2 mt-4">
              Put a band
              <br />
              <span className="serif text-forest">in the room.</span>
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            <p className="max-w-sm text-sm text-[rgba(11,11,11,0.66)]">
              Tell us the date, the room, and the feeling. We will send the right
              act and a clear quote.
            </p>
            <Link href="/book" className="btn w-fit">
              Start a booking
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
