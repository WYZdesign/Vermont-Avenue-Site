import type { Metadata } from "next";
import { BookingForm } from "@/components/BookingForm";
import { PageHero, SectionLabel } from "@/components/SectionLabel";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Vermont Avenue Records. Bookings, press, and general questions. Los Angeles, California.",
  alternates: { canonical: "/contact" },
};

const channels = [
  { label: "Bookings", value: "Use the form", href: "#form" },
  { label: "Instagram", value: "@vermontavenuerecords", href: site.instagram },
  { label: "Facebook", value: "Vermont Avenue Records", href: site.facebook },
  { label: "Bandcamp", value: "vermontavenuerecords", href: site.bandcamp },
];

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title={
          <>
            Say
            <br />
            <span className="serif text-[var(--color-sage)]">hello.</span>
          </>
        }
        intro="Bookings, press, or a question about the label. We read everything."
      />

      <section className="section" id="form">
        <div className="wrap grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionLabel>Reach us</SectionLabel>
            <h2 className="h2 mt-5">The direct lines.</h2>
            <ul className="mt-8 space-y-4">
              {channels.map((channel) => (
                <li key={channel.label} className="border-b border-[var(--line-soft)] pb-4">
                  <p className="text-[0.62rem] uppercase tracking-[0.2em] text-forest">
                    {channel.label}
                  </p>
                  <a
                    href={channel.href}
                    className="mt-1 inline-block text-sm transition-colors hover:text-forest"
                    {...(channel.href.startsWith("http")
                      ? { target: "_blank", rel: "noopener noreferrer" }
                      : {})}
                  >
                    {channel.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="border border-[var(--line)] bg-[var(--color-paper)] p-6 md:p-8">
            <SectionLabel>Message</SectionLabel>
            <h2 className="h3 mt-4">Send it over.</h2>
            <p className="mt-2 text-sm text-[rgba(11,11,11,0.66)]">
              For bookings, the date and venue help us reply faster.
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
