"use client";

import { useEffect } from "react";
import type { SocialEmbed } from "@/lib/content";

declare global {
  interface Window {
    instgrm?: { Embeds?: { process?: () => void } };
    tiktokEmbed?: unknown;
  }
}

export function SocialWall({ embeds }: { embeds: SocialEmbed[] }) {
  useEffect(() => {
    if (embeds.some((embed) => embed.platform === "instagram")) {
      const existing = document.getElementById("instagram-embed-script");
      if (!existing) {
        const script = document.createElement("script");
        script.id = "instagram-embed-script";
        script.src = "https://www.instagram.com/embed.js";
        script.async = true;
        document.body.appendChild(script);
      } else {
        window.instgrm?.Embeds?.process?.();
      }
    }

    if (embeds.some((embed) => embed.platform === "tiktok")) {
      const existing = document.getElementById("tiktok-embed-script");
      if (!existing) {
        const script = document.createElement("script");
        script.id = "tiktok-embed-script";
        script.src = "https://www.tiktok.com/embed.js";
        script.async = true;
        document.body.appendChild(script);
      }
    }
  }, [embeds]);

  if (embeds.length === 0) return null;

  return (
    <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {embeds.map((embed, index) => {
        if (embed.platform === "instagram") {
          return (
            <blockquote
              key={index}
              className="instagram-media"
              data-instgrm-permalink={embed.url}
              data-instgrm-version="14"
              style={{ background: "#fff", border: 0, margin: 0, maxWidth: "100%", minWidth: "260px", padding: 0, width: "100%" }}
            />
          );
        }

        if (embed.platform === "tiktok") {
          return (
            <blockquote
              key={index}
              className="tiktok-embed"
              cite={embed.url}
              data-video-id={embed.videoId}
              style={{ maxWidth: "605px", minWidth: "325px", width: "100%" }}
            >
              <section>
                <a target="_blank" rel="noopener noreferrer" href={embed.url}>
                  Watch on TikTok
                </a>
              </section>
            </blockquote>
          );
        }

        return (
          <div key={index} className="relative aspect-video w-full overflow-hidden border border-[var(--line)] bg-ink">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube-nocookie.com/embed/${embed.videoId}?rel=0&modestbranding=1`}
              title={embed.title ?? "Video"}
              loading="lazy"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
        );
      })}
    </div>
  );
}
