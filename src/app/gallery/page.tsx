import type { Metadata } from "next";
import { PageHero, SectionLabel } from "@/components/SectionLabel";
import { VideoEmbed } from "@/components/VideoEmbed";
import { SocialWall } from "@/components/SocialWall";
import { getGalleryImages, getGalleryVideos, socialEmbeds, socialProfiles } from "@/lib/content";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos, videos, and visual content from Vermont Avenue Records rehearsals, shoots, events, and releases.",
  alternates: { canonical: "/gallery" },
};

const categories = [
  "All",
  "Rehearsals",
  "Shoots",
  "Events",
  "Social",
  "Cover Art",
  "Flyers & Posters",
  "Logos",
  "Merch",
];

export default function GalleryPage() {
  const images = getGalleryImages();
  const videos = getGalleryVideos();

  return (
    <>
      <PageHero
        eyebrow="Gallery"
        title={
          <>
            The
            <br />
            <span className="serif text-[var(--color-sage)]">archive.</span>
          </>
        }
        intro="Rehearsals, shoots, events, cover art, and videos from the Vermont Avenue collective."
      />

      <section className="section-tight">
        <div className="wrap flex flex-wrap gap-2">
          {categories.map((label) => (
            <span
              key={label}
              className="border border-[var(--line)] px-4 py-2 text-[0.62rem] uppercase tracking-[0.14em]"
            >
              {label}
            </span>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionLabel>Videos</SectionLabel>
          <h2 className="h2 mt-5">On the channel.</h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <div key={video.id}>
                <VideoEmbed id={video.videoId} title={video.title ?? "Video"} />
                <h3 className="h3 mt-4 text-lg">{video.title}</h3>
                <p className="mt-1 text-[0.66rem] uppercase tracking-[0.14em] muted">
                  Vermont Avenue Records
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-tight">
        <div className="wrap">
          <SectionLabel>Social</SectionLabel>
          <h2 className="h2 mt-5">Follow the label.</h2>
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {socialProfiles.map((profile) => (
              <a
                key={profile.label}
                href={profile.href}
                target="_blank"
                rel="noopener noreferrer"
                className="border border-[var(--line)] bg-bone p-5 transition-colors hover:bg-ink hover:text-white"
              >
                <p className="text-[0.58rem] uppercase tracking-[0.18em]">{profile.label}</p>
                <p className="mt-1 text-sm">{profile.handle}</p>
              </a>
            ))}
          </div>
          <SocialWall embeds={socialEmbeds} />
        </div>
      </section>

      <section className="section">
        <div className="wrap">
          <SectionLabel>Photos</SectionLabel>
          <h2 className="h2 mt-5">The archive.</h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {images.map((item) => (
              <div
                key={item.id}
                className="group relative aspect-square overflow-hidden border border-[var(--line)] bg-bone"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.src}
                  alt={item.alt}
                  loading="lazy"
                  className="h-full w-full object-cover opacity-85 transition-opacity group-hover:opacity-100"
                />
                <div className="absolute inset-0 flex items-end bg-gradient-to-t from-ink/70 via-transparent to-transparent p-4 opacity-0 transition-opacity group-hover:opacity-100">
                  <div>
                    <p className="text-sm font-semibold text-white">{item.title}</p>
                    <p className="text-[0.62rem] uppercase tracking-[0.14em] text-white/70">
                      {item.category}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
