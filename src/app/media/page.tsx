import type { Metadata } from "next";
import { PageHero, SectionLabel } from "@/components/SectionLabel";
import { VideoEmbed } from "@/components/VideoEmbed";
import { getGalleryImages, gallery, socialProfiles, site } from "@/lib/content";
import { YOUTUBE_CHANNEL_URL } from "@/lib/youtube";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Media",
  description:
    "All videos, photos, and live streams from Vermont Avenue Records — the complete media archive.",
  alternates: { canonical: "/media" },
};

export default function MediaPage() {
  const images = getGalleryImages();
  const videos = gallery.filter((item) => item.type !== "image");

  return (
    <>
      <PageHero
        eyebrow="Media"
        title={
          <>
            The
            <br />
            <span className="serif text-[var(--color-sage)]">archive.</span>
          </>
        }
        intro="All videos, photos, and live streams from Vermont Avenue Records."
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
          <a
            href={site.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            Instagram
          </a>
          <a
            href={site.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            Facebook
          </a>
        </div>
      </PageHero>

      <section className="section">
        <div className="wrap">
          <SectionLabel>Videos</SectionLabel>
          <h2 className="h2 mt-5">On the channel.</h2>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {videos.map((video) => (
              <div key={video.id}>
                <VideoEmbed id={video.id} title={video.title || "Video"} />
                <h3 className="h3 mt-4 text-lg">{video.title || "Video"}</h3>
                <p className="mt-1 text-[0.66rem] uppercase tracking-[0.14em] muted">
                  {video.category}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="wrap">
          <SectionLabel>Photos</SectionLabel>
          <h2 className="h2 mt-5">Gallery archive.</h2>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {images.map((item) => (
              <a
                key={item.id}
                href={item.src}
                target="_blank"
                rel="noopener noreferrer"
                className="relative group cursor-zoom-in border border-[var(--line)] overflow-hidden rounded-md hover:scale-[105%] transition-transform duration-300"
              >
                <img
                  src={item.src}
                  alt={item.alt}
                  className="w-full h-48 object-cover transition-opacity duration-300 group-hover:opacity-90"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center text-white text-xs uppercase">
                  {item.category}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tight">
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
        </div>
      </section>
    </>
  );
}