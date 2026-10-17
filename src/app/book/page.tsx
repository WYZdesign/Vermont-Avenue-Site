import type { Metadata } from "next";
import { BookingForm } from "@/components/BookingForm";
import { PageHero, SectionLabel } from "@/components/SectionLabel";

export const metadata: Metadata = {
  title: "Book",
  description:
    "Book a Vermont Avenue Records act for your wedding, corporate event, or private party in Los Angeles.",
  alternates: { canonical: "/book" },
};

const steps = [
  {
    title: "Send the details",
    body: "Date, venue, guest count, and the act you have in mind. A few lines is plenty.",
  },
  {
    title: "Get a clear quote",
    body: "We recommend the right configuration and send a quote with what is included.",
  },
  {
    title: "Lock the date",
    body: "A 50% deposit and a signed agreement secure the date. The balance is due before the event.",
  },
];

export default function BookPage() {
  return (
    <>
      <PageHero
        eyebrow="Bookings"
        title={
          <>
            Book the
            <br />
            <span className="serif text-[var(--color-sage)]">band.</span>
          </>
        }
        intro="Tell us the date, the room, and the feeling. We will send the right act and a clear quote."
      />

      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionLabel>How it works</SectionLabel>
            <h2 className="h2 mt-5">Three steps.</h2>
            <ol className="mt-8 space-y-6">
              {steps.map((step, index) => (
                <li key={step.title} className="border-t border-[var(--line)] pt-4">
                  <span className="text-[0.62rem] uppercase tracking-[0.24em] text-forest">
                    0{index + 1}
                  </span>
                  <h3 className="h3 mt-2">{step.title}</h3>
                  <p className="mt-2 text-sm text-[rgba(11,11,11,0.66)]">{step.body}</p>
                </li>
              ))}
            </ol>
            <p className="mt-8 text-[0.68rem] uppercase tracking-[0.16em] muted">
              Every quote is custom. Starting rates are on each service page.
            </p>
          </div>

          <div className="border border-[var(--line)] bg-[var(--color-paper)] p-6 md:p-8">
            <SectionLabel>Request</SectionLabel>
            <h2 className="h3 mt-4">Tell us about the event.</h2>
            <p className="mt-2 text-sm text-[rgba(11,11,11,0.66)]">
              We reply within one business day.
            </p>
            <div className="mt-6">
              <BookingForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
