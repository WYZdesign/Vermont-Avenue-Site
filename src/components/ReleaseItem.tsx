"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Release } from "@/lib/content";

export function ReleaseItem({ release }: { release: Release }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="group">
      <div className="duotone relative aspect-square w-full border border-[var(--line)]">
        <Image
          src={release.cover}
          alt={release.title + " cover"}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover"
        />
      </div>

      <div className="mt-3 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            href={release.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium hover:underline"
          >
            {release.title}
          </Link>
          <p className="truncate text-[0.66rem] uppercase tracking-[0.14em] muted">
            {release.artist}
          </p>
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="text-[0.66rem] muted">{release.year}</span>
          {release.embed && (
            <button
              type="button"
              onClick={() => setOpen((value) => !value)}
              className="border border-[var(--line)] px-2 py-0.5 text-[0.54rem] font-semibold uppercase tracking-[0.14em] transition-colors hover:bg-forest hover:text-bone"
              aria-expanded={open}
            >
              {open ? "Close" : "Play"}
            </button>
          )}
        </div>
      </div>

      {open && release.embed && (
        <div className="mt-3 border border-[var(--line)]">
          <iframe
            src={release.embed}
            title={release.title + " on Bandcamp"}
            width="100%"
            height={release.embedType === "album" ? 470 : 120}
            loading="lazy"
            style={{ border: 0 }}
            allow="autoplay; encrypted-media"
          />
        </div>
      )}
    </div>
  );
}
