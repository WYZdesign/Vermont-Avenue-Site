import type { Metadata } from "next";
import { PageHero, SectionLabel } from "@/components/SectionLabel";
import { VideoEmbed } from "@/components/VideoEmbed";
import { site } from "@/lib/content";
import { getVideos, YOUTUBE_CHANNEL_URL } from "@/lib/youtube";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Watch",
  description:
    "Live sessions, release videos, and studio footage from Vermont Avenue Records in Los Angeles.",
  alternates: { canonical: "/watch" },
};

const socials = [
  { label: "YouTube", href: site.youtube },
  { label: "TikTok", href: site.tiktok },
  { label: "Instagram", href: site.instagram },
  { label: "Facebook", href: site.facebook },
];

export default async function WatchPage() {
  const videos = await getVideos(12);

  return (
    <>
      <PageHero
        eyebrow="Watch"
        title={
          <>
            The
            <br />
            <span className="serif text-[var(--color-sage)]">channel.</span>
          </>
        }
        intro="Live sessions, release videos, and studio footage. Subscribe on YouTube so every new video counts."
      >
        <div className="flex flex-wrap gap-3">
          <a
            href={YOUTUBE_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn"
          >
            Subscribe on YouTube
          </a>
          <a
            href={site.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            TikTok
          </a>
        </div>
      </PageHero>

      <section className="section">
        <div className="wrap">
          <SectionLabel>Latest videos</SectionLabel>
          <h2 className="h2 mt-5">On the channel.</h2>

          {videos.length > 0 ? (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((video) => (
                <div key={video.id}>
                  <VideoEmbed id={video.id} title={video.title} />
                  <h3 className="h3 mt-4 text-lg">{video.title}</h3>
                  <p className="mt-1 text-[0.66rem] uppercase tracking-[0.14em] muted">
                    {video.artist}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-6 text-sm muted">
              New videos are on the way.{" "}
              <a
                href={YOUTUBE_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Watch on YouTube
              </a>
              .
            </p>
          )}

          <div className="mt-12 flex flex-wrap gap-3 border-t border-[var(--line)] pt-8">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-ghost"
              >
                {social.label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
