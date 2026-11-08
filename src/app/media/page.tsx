import type { Metadata } from "next";
import { PageHero, SectionLabel } from "@/components/SectionLabel";
import { VideoEmbed } from "@/components/VideoEmbed";
import { socialProfiles, site } from "@/lib/content";
import { YOUTUBE_CHANNEL_URL } from "@/lib/youtube";
import { GalleryContent } from "@/app/gallery/GalleryContent";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Media",
  description:
    "Videos, photos, and live footage from Vermont Avenue Records in Los Angeles.",
  alternates: { canonical: "/media" },
};

const ytPlaylistId = "UU5Od8j7DxMtUqbc68WBflQg";

export default function MediaPage() {
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
        intro="Videos, live footage, photos, and the whole visual archive. Watch, scroll, and follow."
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
        </div>
      </PageHero>

      <section className="section">
        <div className="wrap">
          <SectionLabel>Videos</SectionLabel>
          <h2 className="h2 mt-5">On the channel.</h2>
          <div className="mt-10 max-w-4xl">
            <VideoEmbed id={ytPlaylistId} title="Vermont Avenue Records — All Videos" isPlaylist />
          </div>
        </div>
      </section>

      <GalleryContent />

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
        </div>
      </section>
    </>
  );
}