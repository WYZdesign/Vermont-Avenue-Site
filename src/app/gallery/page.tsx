import type { Metadata } from "next";
import { PageHero, SectionLabel } from "@/components/SectionLabel";
import { VideoEmbed } from "@/components/VideoEmbed";
import { SocialWall } from "@/components/SocialWall";
import { socialEmbeds, socialProfiles } from "@/lib/content";
import { GalleryContent } from "./GalleryContent";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Photos, videos, and visual content from Vermont Avenue Records rehearsals, shoots, events, and releases.",
  alternates: { canonical: "/gallery" },
};

const ytPlaylistId = "UU5Od8j7DxMtUqbc68WBflQg";

export default function GalleryPage() {
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

      <section className="section">
        <div className="wrap">
          <SectionLabel>Videos</SectionLabel>
          <h2 className="h2 mt-5">On the channel.</h2>
          <div className="mt-10 max-w-4xl mx-auto">
            <VideoEmbed id={ytPlaylistId} title="Vermont Avenue Records — All Videos" isPlaylist />
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

      <GalleryContent />
    </>
  );
}