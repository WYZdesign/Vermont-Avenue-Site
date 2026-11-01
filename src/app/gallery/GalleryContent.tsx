"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { SectionLabel } from "@/components/SectionLabel";
import { getGalleryImages } from "@/lib/content";
import type { GalleryItem as GalleryItemType } from "@/lib/content";

const categories = [
  "All",
  "Rehearsals",
  "Shoots",
  "Events",
  "Social",
  "Cover Art",
  "Flyers & Posters",
  "Branding",
  "Merch",
] as const;

type Category = typeof categories[number];

const categoryMap: Record<Category, GalleryItemType["category"]> = {
  All: "cover",
  Rehearsals: "rehearsal",
  Shoots: "shoot",
  Events: "event",
  Social: "social",
  "Cover Art": "cover",
  "Flyers & Posters": "flyer",
  Branding: "brand",
  Merch: "cover",
};

export function GalleryContent() {
  const allImages = getGalleryImages();
  const [activeCategory, setActiveCategory] = useState<Category>("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxItem, setLightboxItem] = useState<GalleryItemType | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filteredImages = activeCategory === "All"
    ? allImages
    : allImages.filter((img) => img.category === categoryMap[activeCategory]);

  const openLightbox = useCallback((item: GalleryItemType, index: number) => {
    setLightboxItem(item);
    setLightboxIndex(index);
    setLightboxOpen(true);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
    setLightboxItem(null);
    document.body.style.overflow = "";
  }, []);

  const navigateLightbox = useCallback((direction: number) => {
    if (filteredImages.length === 0) return;
    const newIndex = (lightboxIndex + direction + filteredImages.length) % filteredImages.length;
    setLightboxIndex(newIndex);
    setLightboxItem(filteredImages[newIndex]);
  }, [filteredImages, lightboxIndex]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowLeft") navigateLightbox(-1);
      if (e.key === "ArrowRight") navigateLightbox(1);
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxOpen, closeLightbox, navigateLightbox]);

  return (
    <>
      <section className="section-tight">
        <div className="wrap flex flex-wrap gap-2" role="tablist" aria-label="Gallery categories">
          {categories.map((label) => (
            <button
              key={label}
              role="tab"
              aria-selected={activeCategory === label}
              aria-controls="gallery-panel"
              onClick={() => setActiveCategory(label as Category)}
              className={`border px-4 py-2 text-[0.62rem] uppercase tracking-[0.14em] transition-all ${
                activeCategory === label
                  ? "bg-ink text-white border-ink"
                  : "bg-bone border-[var(--line)] hover:border-ink/50"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </section>

      <section className="section" id="gallery-panel" role="tabpanel" aria-label="Gallery content">
        <div className="wrap">
          <SectionLabel>Photos</SectionLabel>
          <h2 className="h2 mt-5">The archive.</h2>
          <p className="mt-2 text-sm text-[rgba(11,11,11,0.5)]">
            {filteredImages.length} {activeCategory === "All" ? "items" : activeCategory.toLowerCase()} found
          </p>
          <div
            className="mt-10 masonry"
            style={{
              columnCount: 1,
              columnGap: "1rem",
            } as React.CSSProperties}
            role="list"
            aria-label={`${activeCategory} gallery`}
          >
            {filteredImages.map((item, index) => (
              <div
                key={item.id}
                className="masonry-item break-inside-avoid mb-4"
                role="listitem"
                onClick={() => openLightbox(item, index)}
                style={{ cursor: "zoom-in" }}
              >
                <div className="relative border border-[var(--line)] bg-bone overflow-hidden aspect-[4/3]">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                    className="object-cover transition-transform duration-300 hover:scale-[1.02]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <div className="w-full">
                      <p className="text-sm font-semibold text-white">{item.title ?? item.alt}</p>
                      <p className="text-[0.62rem] uppercase tracking-[0.14em] text-white/70">
                        {item.category}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {filteredImages.length === 0 && (
            <div className="mt-10 text-center text-[rgba(11,11,11,0.5)]">
              No items in this category yet.
            </div>
          )}
        </div>
      </section>

      {lightboxOpen && lightboxItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(11,11,11,0.96)] p-4"
          onClick={closeLightbox}
          role="dialog"
          aria-modal="true"
          aria-label={`${lightboxItem.title ?? lightboxItem.alt}, ${lightboxItem.category}`}
        >
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 p-2 rounded-full bg-ink/50 hover:bg-ink text-white transition-colors"
            aria-label="Close"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigateLightbox(-1); }}
            className="absolute left-4 z-10 p-4 rounded-full bg-ink/50 hover:bg-ink text-white transition-colors hidden sm:block"
            aria-label="Previous"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); navigateLightbox(1); }}
            className="absolute right-4 z-10 p-4 rounded-full bg-ink/50 hover:bg-ink text-white transition-colors hidden sm:block"
            aria-label="Next"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>
          <div
            className="relative max-w-[90vw] max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={lightboxItem.src}
              alt={lightboxItem.alt}
              fill
              sizes="90vw"
              className="object-contain"
              priority
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-ink/90 to-transparent text-white">
              <p className="text-lg font-semibold">{lightboxItem.title ?? lightboxItem.alt}</p>
              <p className="text-[0.62rem] uppercase tracking-[0.14em] text-white/70 mt-1">
                {lightboxItem.category} &bull; {lightboxIndex + 1} of {filteredImages.length}
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .masonry {
          column-count: 1;
          column-gap: 1rem;
        }
        @media (min-width: 640px) {
          .masonry { column-count: 2; }
        }
        @media (min-width: 1024px) {
          .masonry { column-count: 3; }
        }
        @media (min-width: 1280px) {
          .masonry { column-count: 4; }
        }
        .masonry-item {
          break-inside: avoid;
          margin-bottom: 1rem;
        }
        .masonry-item > div {
          display: block;
        }
      `}</style>
    </>
  );
}