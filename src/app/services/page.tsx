import type { Metadata } from "next";
import Link from "next/link";
import { ActCard } from "@/components/ActCard";
import { PageHero, SectionLabel } from "@/components/SectionLabel";
import { acts } from "@/lib/content";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Book a DJ, soloist, duo, trio, quartet, quintet, DJ plus live combo, or the full Vermont Avenue Allstars for your event in Los Angeles.",
  alternates: { canonical: "/services" },
};

const steps = [
  {
    title: "Tell us the room",
    body: "Date, venue, guest count, and the feeling you want. A few details are enough to start.",
  },
  {
    title: "We send the right act",
    body: "A clear recommendation, a set plan, and a quote. No guessing, no pressure.",
  },
  {
    title: "50% secures the date",
    body: "Sign the agreement, pay the deposit, and we handle the rest through the event.",
  },
];

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title={
          <>
            Book the
            <br />
            <span className="serif text-[var(--color-sage)]">room.</span>
          </>
        }
        intro="Eight ways to put live music in your event. From a single voice to the full Vermont Avenue Allstars."
      />

      <section className="section">
        <div className="wrap">
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {acts.map((act) => (
              <ActCard key={act.slug} act={act} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight border-y border-[var(--line)] bg-[var(--color-paper)]">
        <div className="wrap">
          <SectionLabel>How it works</SectionLabel>
          <h2 className="h2 mt-5">Simple from the first message.</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="border-t border-[var(--line)] pt-5">
                <span className="text-[0.62rem] uppercase tracking-[0.24em] text-forest">
                  0{index + 1}
                </span>
                <h3 className="h3 mt-3">{step.title}</h3>
                <p className="mt-3 text-sm text-[rgba(11,11,11,0.66)]">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap flex flex-col items-start justify-between gap-8 border border-[var(--line)] bg-[var(--color-paper)] p-8 md:flex-row md:items-center md:p-12">
          <div>
            <SectionLabel>Bookings</SectionLabel>
            <h2 className="h2 mt-4">
              Not sure
              <br />
              <span className="serif text-forest">which act?</span>
            </h2>
          </div>
          <div className="flex flex-col gap-3">
            <p className="max-w-sm text-sm text-[rgba(11,11,11,0.66)]">
              Tell us the date and the room. We will recommend the right fit and
              send a quote.
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
