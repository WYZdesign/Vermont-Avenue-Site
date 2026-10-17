import type { Metadata } from "next";
import { Bodoni_Moda, Instrument_Serif, Jost } from "next/font/google";
import "./globals.css";
import { Chrome } from "@/components/Chrome";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { site } from "@/lib/content";

const bodoni = Bodoni_Moda({
  subsets: ["latin"],
  variable: "--font-bodoni",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  variable: "--font-jost",
  display: "swap",
});

const instrument = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Vermont Avenue Records | Independent label and live music, Los Angeles",
    template: "%s | Vermont Avenue Records",
  },
  description: site.description,
  keywords: [
    "Vermont Avenue Records",
    "Los Angeles record label",
    "live music Los Angeles",
    "book a band Los Angeles",
    "jazz band Los Angeles",
    "DJ Los Angeles",
    "wedding band Los Angeles",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title: "Vermont Avenue Records",
    description: site.description,
    images: [
      {
        url: "/images/og-share.png",
        width: 1200,
        height: 630,
        alt: "Vermont Avenue Records",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vermont Avenue Records",
    description: site.description,
    images: ["/images/og-share.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
    other: [{ rel: "mask-icon", url: "/favicon.svg", color: "#1f3d2b" }],
  },
  manifest: "/manifest.webmanifest",
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": site.url + "/#organization",
  name: site.name,
  alternateName: "Vermont Ave Records",
  url: site.url + "/",
  logo: site.url + "/images/label-art.jpg",
  image: site.url + "/images/og-share.png",
  description: site.description,
  foundingDate: site.founded,
  foundingLocation: { "@type": "Place", name: site.location },
  sameAs: [site.bandcamp, site.instagram, site.facebook, site.youtube],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${bodoni.variable} ${jost.variable} ${instrument.variable}`}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-bone"
        >
          Skip to content
        </a>
        <Chrome header={<SiteHeader />} footer={<SiteFooter />}>
          {children}
        </Chrome>
        <GoogleAnalytics />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
