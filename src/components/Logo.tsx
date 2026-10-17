import Image from "next/image";
import Link from "next/link";

export function Logo({
  size = 44,
  withText = true,
}: {
  size?: number;
  withText?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="Vermont Avenue Records home"
      className="group inline-flex items-center gap-3"
    >
      <span
        className="relative block shrink-0 overflow-hidden border border-[var(--line)]"
        style={{ width: size, height: size }}
      >
        <Image
          src="/images/label-art.jpg"
          alt=""
          fill
          sizes="56px"
          className="object-cover"
        />
      </span>
      {withText && (
        <span className="leading-none">
          <span className="block font-display text-[1.02rem] tracking-tight">
            VERMONT AVENUE
          </span>
          <span className="mt-1 block text-[0.52rem] font-semibold uppercase tracking-[0.3em] opacity-60">
            Records
          </span>
        </span>
      )}
    </Link>
  );
}
