import Image from "next/image";
import Link from "next/link";
import type { Release } from "@/lib/content";

export function ReleaseCard({ release }: { release: Release }) {
  return (
    <Link
      href={release.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block"
    >
      <div className="duotone relative aspect-square w-full border border-[var(--line)]">
        <Image
          src={release.cover}
          alt={release.title + " cover"}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover"
        />
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-3">
        <div>
          <p className="text-sm font-medium">{release.title}</p>
          <p className="text-[0.68rem] uppercase tracking-[0.14em] muted">{release.artist}</p>
        </div>
        <span className="shrink-0 text-[0.68rem] muted">{release.year}</span>
      </div>
    </Link>
  );
}
