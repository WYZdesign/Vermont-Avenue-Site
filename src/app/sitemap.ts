import type { MetadataRoute } from "next";
import { acts, site } from "@/lib/content";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = site.url;
  const staticPages: Array<{ path: string; priority: number }> = [
    { path: "", priority: 1 },
    { path: "/about", priority: 0.7 },
    { path: "/services", priority: 0.9 },
    { path: "/releases", priority: 0.8 },
    { path: "/watch", priority: 0.8 },
    { path: "/gallery", priority: 0.8 },
    { path: "/book", priority: 0.9 },
    { path: "/contact", priority: 0.6 },
  ];

  return [
    ...staticPages.map((page) => ({
      url: base + page.path,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: page.priority,
    })),
    ...acts.map((act) => ({
      url: base + "/services/" + act.slug,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
