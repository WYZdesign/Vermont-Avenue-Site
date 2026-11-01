"use client";

import Image from "next/image";
import { useState } from "react";

export function VideoEmbed({
  id,
  title,
  isPlaylist = false,
}: { id?: string; title: string; isPlaylist?: boolean }) {
  const [active, setActive] = useState(false);

  if (!id) {
    return (
      <div className="flex aspect-video w-full items-center justify-center border border-[var(--line)] bg-ink">
        <span className="text-sm text-white/50">Video unavailable</span>
      </div>
    );
  }

  const embedSrc = isPlaylist
    ? `https://www.youtube-nocookie.com/embed/videoseries?list=${id}&autoplay=1&rel=0&modestbranding=1`
    : `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`;

  if (active) {
    return (
      <div className="relative aspect-video w-full overflow-hidden border border-[var(--line)] bg-ink">
        <iframe
          className="absolute inset-0 h-full w-full"
          src={embedSrc}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  // For playlist, use first video thumbnail as placeholder
  const thumbId = isPlaylist ? "playlist" : id;
  const thumbSrc = isPlaylist
    ? "https://i.ytimg.com/vi/ztB1xYO1cAg/hqdefault.jpg" // first video from channel
    : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;

  return (
    <button
      type="button"
      onClick={() => setActive(true)}
      className="group relative block aspect-video w-full overflow-hidden border border-[var(--line)] bg-ink"
      aria-label={`Play ${title}`}
    >
      <Image
        src={thumbSrc}
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
      {isPlaylist && (
        <span className="absolute bottom-3 right-3 text-[0.58rem] uppercase tracking-[0.12em] bg-[rgba(11,11,11,0.8)] text-white px-2 py-1 rounded">
          Playlist
        </span>
      )}
    </button>
  );
}
