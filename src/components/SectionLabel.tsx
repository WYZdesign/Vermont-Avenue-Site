import type { ReactNode } from "react";

export function SectionLabel({ children }: { children: ReactNode }) {
  return <span className="eyebrow">{children}</span>;
}

export function PageHero({
  eyebrow,
  title,
  intro,
  children,
}: {
  eyebrow: string;
  title: ReactNode;
  intro?: string;
  children?: ReactNode;
}) {
  return (
    <section className="dark relative overflow-hidden">
      <div className="deco-sun" aria-hidden="true" />
      <div className="wrap relative section pt-20">
        <SectionLabel>{eyebrow}</SectionLabel>
        <h1 className="h1 mt-6 max-w-5xl">{title}</h1>
        {intro && <p className="lede mt-6 max-w-2xl">{intro}</p>}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
