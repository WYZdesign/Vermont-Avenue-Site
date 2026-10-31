"use client";

import Image from "next/image";
import { useState } from "react";

export function VideoEmbed({ id, title }: { id?: string; title: string }) {
  const [active, setActive] = useState(false);

  if (!id) {
    return (
      <div className="flex aspect-video w-full items-center justify-center border border-[var(--line)] bg-ink">
        <span className="text-sm text-white/50">Video unavailable</span>
      </div>
    );
  }

  if (active) {
    return (
      <div className="relative aspect-video w-full overflow-hidden border border-[var(--line)] bg-ink">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      className="group relative block aspect-video w-full overflow-hidden border border-[var(--line)] bg-ink"
      aria-label={`Play ${title}`}
    >
      <Image
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt=""
        fill
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover opacity-90 transition-opacity group-hover:opacity-100"
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(11,11,11,0.78)] text-white transition-transform group-hover:scale-110">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path d="M6 3.5v13l11-6.5z" />
          </svg>
        </span>
      </span>
    </button>
  );
}
