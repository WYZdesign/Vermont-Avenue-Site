import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BookingForm } from "@/components/BookingForm";
import { SectionLabel } from "@/components/SectionLabel";
import { actBySlug, acts, priceLabel } from "@/lib/content";

export function generateStaticParams() {
  return acts.map((act) => ({ slug: act.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const act = actBySlug(slug);
  if (!act) return { title: "Service" };
  return {
    title: act.name,
    description: act.description,
    alternates: { canonical: "/services/" + act.slug },
  };
}

export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const act = actBySlug(slug);
  if (!act) notFound();

  const related = acts.filter((a) => a.slug !== act.slug).slice(0, 3);

  return (
    <>
      <section className="dark relative overflow-hidden">
        <div className="deco-sun" aria-hidden="true" />
        <div className="wrap relative grid gap-12 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div className="flex flex-col justify-center">
            <SectionLabel>{act.eyebrow}</SectionLabel>
            <h1 className="h1 mt-5 text-[clamp(2.6rem,8vw,6rem)]">{act.name}</h1>
            <p className="lede mt-5 max-w-xl">{act.tagline}</p>
            <p className="mt-6 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-sage)]">
              {priceLabel(act)}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/book" className="btn">
                Book this act
              </Link>
              <Link href="/services" className="btn btn-ghost">
                All services
              </Link>
            </div>
          </div>
          <div className="duotone relative aspect-[4/5] w-full border border-[var(--line-invert)]">
            <Image
              src={act.image}
              alt={act.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="section">
        <div className="wrap grid gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <SectionLabel>About the act</SectionLabel>
            <h2 className="h2 mt-5">What you get.</h2>
            <p className="mt-5 text-[rgba(11,11,11,0.72)]">{act.description}</p>

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              <div>
                <h3 className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-forest">
                  Included
                </h3>
                <ul className="mt-4 space-y-2.5 text-sm text-[rgba(11,11,11,0.72)]">
                  {act.includes.map((item) => (
                    <li key={item} className="border-b border-[var(--line-soft)] pb-2.5">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-forest">
                  Best for
                </h3>
                <ul className="mt-4 space-y-2.5 text-sm text-[rgba(11,11,11,0.72)]">
                  {act.bestFor.map((item) => (
                    <li key={item} className="border-b border-[var(--line-soft)] pb-2.5">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="border border-[var(--line)] bg-[var(--color-paper)] p-6 md:p-8">
            <SectionLabel>Booking request</SectionLabel>
            <h2 className="h3 mt-4">Start with the date.</h2>
            <p className="mt-2 text-sm text-[rgba(11,11,11,0.66)]">
              We reply within one business day. A 50% deposit secures the date.
            </p>
            <div className="mt-6">
              <BookingForm defaultAct={act.name} />
            </div>
          </div>
        </div>
      </section>

      <section className="section-tight border-t border-[var(--line)] bg-[var(--color-paper)]">
        <div className="wrap">
          <SectionLabel>Also consider</SectionLabel>
          <div className="mt-8 grid gap-5 sm:grid-cols-3">
            {related.map((item) => (
              <Link
                key={item.slug}
                href={"/services/" + item.slug}
                className="group flex items-center justify-between border border-[var(--line)] bg-bone p-5"
              >
                <div>
                  <p className="text-[0.6rem] uppercase tracking-[0.2em] text-fog">
                    {item.eyebrow}
                  </p>
                  <p className="h3 mt-2">{item.name}</p>
                </div>
                <span className="text-forest transition-transform group-hover:translate-x-1">
                  &#8594;
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
