import Link from "next/link";

export function Wordmark({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const scale =
    size === "lg" ? "text-[1.6rem] md:text-[2rem]" : size === "sm" ? "text-[1.05rem]" : "text-[1.25rem]";

  return (
    <Link
      href="/"
      aria-label="Vermont Avenue Records home"
      className="group inline-flex items-baseline gap-2 leading-none"
    >
      <span className={`font-display ${scale} tracking-tight`}>VERMONT</span>
      <span className={`font-serif ${scale} text-forest transition-colors group-hover:text-ink`}>
        Avenue
      </span>
      <span className="hidden text-[0.55rem] font-semibold uppercase tracking-[0.32em] text-fog sm:inline">
        Records
      </span>
    </Link>
  );
}
