import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PageHero, SectionLabel } from "@/components/SectionLabel";
import { about } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description:
    "Vermont Avenue Records is an independent Los Angeles label and collective, created by musicians, for musicians.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About"
        title={
          <>
            A label built
            <br />
            <span className="serif text-[var(--color-sage)]">with the community.</span>
          </>
        }
        intro={about.intro}
      />

      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="duotone relative aspect-[4/5] w-full border border-[var(--line)]">
            <Image
              src="/images/artist-ryan.jpg"
              alt="Vermont Avenue Records collective"
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
          <div>
            <SectionLabel>The story</SectionLabel>
            <h2 className="h2 mt-5">
              Records first.
              <br />
              <span className="serif text-forest">People always.</span>
            </h2>
            <div className="mt-6 space-y-5 text-[rgba(11,11,11,0.72)]">
              {about.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              <p>{about.founder}</p>
            </div>
            <Link href="/book" className="btn mt-8">
              Work with us
            </Link>
          </div>
        </div>
      </section>

      <section className="section-tight border-y border-[var(--line)] bg-[var(--color-paper)]">
        <div className="wrap grid gap-12 md:grid-cols-2">
          <div>
            <SectionLabel>The collective</SectionLabel>
            <h2 className="h3 mt-4">The players.</h2>
            <ul className="mt-6 space-y-2.5 text-sm text-[rgba(11,11,11,0.72)]">
              {about.credits.map((credit) => (
                <li key={credit} className="border-b border-[var(--line-soft)] pb-2.5">
                  {credit}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionLabel>Where we record</SectionLabel>
            <ul className="mt-6 space-y-2.5 text-sm text-[rgba(11,11,11,0.72)]">
              {about.studios.map((studio) => (
                <li key={studio} className="border-b border-[var(--line-soft)] pb-2.5">
                  {studio}
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <SectionLabel>The mission</SectionLabel>
              <p className="mt-4 text-sm leading-relaxed text-[rgba(11,11,11,0.72)]">
                Fair pay for artists. An inclusive room. Music that sounds like the
                people who made it. That is the standard we hold ourselves to.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap flex flex-col items-start justify-between gap-8 border border-[var(--line)] bg-[var(--color-paper)] p-8 md:flex-row md:items-center md:p-12">
          <div>
            <SectionLabel>Work with us</SectionLabel>
            <h2 className="h2 mt-4">
              Put a band
              <br />
              <span className="serif text-forest">in the room.</span>
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
