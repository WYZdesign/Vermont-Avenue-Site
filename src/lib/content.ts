export const site = {
  name: "Vermont Avenue Records",
  shortName: "Vermont Avenue",
  tagline: "Created by musicians, for musicians.",
  description:
    "Vermont Avenue Records is an independent record label and live music collective in Los Angeles. Records, bookings, and a full roster of artists for events.",
  url: "https://vermontavenuerecords.com",
  location: "Los Angeles, California",
  founded: "2024",
  instagram: "https://www.instagram.com/vermontavenuerecords",
  facebook: "https://www.facebook.com/profile.php?id=61576277474112",
  youtube: "https://www.youtube.com/@VermontAvenueRecords",
  tiktok: "https://www.tiktok.com/@vermontavenuerecords",
  bandcamp: "https://vermontavenuerecords.bandcamp.com",
  spotify: "https://open.spotify.com/album/4jYvmYKoTEuG3QTdG6CeE5",
} as const;

export const nav = [
  { label: "Label", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Releases", href: "/releases" },
  { label: "Watch", href: "/watch" },
  { label: "Live", href: "/live" },
] as const;

/* -------------------------------------------------------------------------- */
/* ACTS / BOOKING                                                             */
/* -------------------------------------------------------------------------- */

export type Act = {
  slug: string;
  name: string;
  eyebrow: string;
  tagline: string;
  description: string;
  includes: string[];
  bestFor: string[];
  image: string;
  priceFrom: number | null;
  featured?: boolean;
};

/*
 * NOTE FOR JOHN: priceFrom is intentionally null until you confirm starting
 * rates. The site renders "Starting rate on request" for null. Drop real
 * numbers in and it will show "$X, starting".
 */
export const acts: Act[] = [
  {
    slug: "dj",
    name: "DJ",
    eyebrow: "The selector",
    tagline: "Open-format sets for rooms that move.",
    description:
      "A Vermont Avenue DJ reads the room and builds the night, from cocktail hour to last call. Vinyl-informed selections across soul, funk, jazz, disco, house, hip-hop, and the unexpected. Clean sound, professional kit, and a set that fits your crowd instead of a fixed playlist.",
    includes: [
      "Professional DJ and sound system",
      "Open-format selection",
      "MC and announcements",
      "Load-in, setup, and breakdown",
      "Backup gear on site",
    ],
    bestFor: ["Weddings", "Corporate events", "Private parties", "Brand activations"],
    image: "/images/deal-with-the-devil.jpg",
    priceFrom: null,
    featured: true,
  },
  {
    slug: "dj-live",
    name: "DJ + Live Combo",
    eyebrow: "The hybrid",
    tagline: "A DJ and live players, one sound.",
    description:
      "Our signature setup. A DJ holds the floor while live horns, keys, guitar, or vocals lift the moment. It sits between a band and a DJ: songs people know, played live, with the flexibility to follow the room.",
    includes: [
      "DJ plus one to three live players",
      "Horns, keys, guitar, or vocals",
      "Custom arrangements",
      "Full sound reinforcement",
      "Venue coordination",
    ],
    bestFor: ["Weddings", "Galas", "Corporate events", "Late-night parties"],
    image: "/images/artist-ryan.jpg",
    priceFrom: null,
    featured: true,
  },
  {
    slug: "solo",
    name: "Solo",
    eyebrow: "One voice",
    tagline: "One voice, the right room.",
    description:
      "A solo singer or instrumentalist for the moments that need intimacy: ceremonies, cocktail hours, proposals, and quiet corners. Repertoire shaped to the occasion, from jazz standards to modern soul.",
    includes: [
      "Vocalist or instrumentalist",
      "Curated repertoire",
      "Sound support",
      "Ceremony cues",
      "Travel within Los Angeles",
    ],
    bestFor: ["Ceremonies", "Cocktail hour", "Intimate dinners", "Proposals"],
    image: "/images/artist-sophia.jpg",
    priceFrom: null,
    featured: true,
  },
  {
    slug: "duo",
    name: "Duo",
    eyebrow: "Two voices",
    tagline: "Two players, a full conversation.",
    description:
      "A duo is the sweet spot for rooms that want live music without a full stage. Voice and guitar, keys and horns, or two voices in conversation. Warm, mobile, and easy to place in any venue.",
    includes: [
      "Two musicians",
      "Flexible instrumentation",
      "Compact setup",
      "Sound support",
      "Custom song requests",
    ],
    bestFor: ["Receptions", "Restaurants", "Private dinners", "Brand events"],
    image: "/images/artist-dantes.jpg",
    priceFrom: null,
  },
  {
    slug: "trio",
    name: "Trio",
    eyebrow: "The classic",
    tagline: "The classic jazz configuration.",
    description:
      "The trio is where the music opens up. Bass, drums, and keys or guitar, with room for a vocalist. Loose enough to improvise, tight enough to hold a room.",
    includes: [
      "Three musicians",
      "Jazz, soul, and funk repertoire",
      "Vocalist available",
      "Sound reinforcement",
      "Arrangements for your event",
    ],
    bestFor: ["Cocktail hours", "Jazz nights", "Weddings", "Corporate dinners"],
    image: "/images/freshly-squeezed.jpg",
    priceFrom: null,
  },
  {
    slug: "quartet",
    name: "Quartet",
    eyebrow: "More motion",
    tagline: "More voices, more motion.",
    description:
      "A quartet brings the energy up without losing the detail. Horns, rhythm section, and vocals working together. A strong fit for receptions, galas, and rooms that want a real band feel.",
    includes: [
      "Four musicians",
      "Horns and rhythm section",
      "Vocalist available",
      "Full sound support",
      "Repertoire planning",
    ],
    bestFor: ["Receptions", "Galas", "Corporate events", "Anniversaries"],
    image: "/images/descent.jpg",
    priceFrom: null,
  },
  {
    slug: "quintet",
    name: "Quintet",
    eyebrow: "The big feel",
    tagline: "The big-band feel, scaled.",
    description:
      "A quintet gives you the weight and color of a larger ensemble while staying nimble. Built for dancing, dinner, and the moment the room turns into a party.",
    includes: [
      "Five musicians",
      "Full horn section options",
      "Vocalist available",
      "Sound reinforcement",
      "Set planning with the band",
    ],
    bestFor: ["Weddings", "Galas", "Fundraisers", "Holiday parties"],
    image: "/images/grid-failure.jpg",
    priceFrom: null,
  },
  {
    slug: "full-band",
    name: "Full Band",
    eyebrow: "The Allstars",
    tagline: "The full Vermont Avenue collective.",
    description:
      "The Vermont Avenue Allstars: the label's full collective on one stage. Horns, rhythm section, and voices from across the roster. Built for headline sets, big rooms, and nights that need a band, not a playlist.",
    includes: [
      "Full ensemble from the roster",
      "Horns, rhythm section, and vocals",
      "Custom set list",
      "Full production coordination",
      "Optional DJ between sets",
    ],
    bestFor: ["Headline events", "Festivals", "Galas", "Large weddings"],
    image: "/images/artist-isaiah.jpg",
    priceFrom: null,
    featured: true,
  },
];

export const actBySlug = (slug: string) => acts.find((a) => a.slug === slug);

export function priceLabel(act: Act): string {
  if (act.priceFrom == null) return "Starting rate on request";
  return "From $" + act.priceFrom.toLocaleString("en-US");
}

/* -------------------------------------------------------------------------- */
/* ROSTER                                                                     */
/* -------------------------------------------------------------------------- */

export type Artist = {
  name: string;
  genre: string;
  blurb: string;
  image: string;
  url: string;
  instagram?: string;
};

export const roster: Artist[] = [
  {
    name: "The LA Limes",
    genre: "Jazz-Funk / Fusion",
    blurb:
      "A jazz-funk and fusion septet with a sound built for the room. All the funk that's fit to print.",
    image: "/images/artist-lalimes.jpg",
    url: "https://thelalimes.bandcamp.com",
    instagram: "https://www.instagram.com/la.limes",
  },
  {
    name: "The Dante's Inferno",
    genre: "Fusion / Funk / Jazz",
    blurb: "Fusion from hell, led by Dante Newcombe-Kenealy. Sharp, heavy, and alive.",
    image: "/images/artist-dantes.jpg",
    url: "https://tdantesinferno.bandcamp.com",
    instagram: "https://www.instagram.com/the_dantes_inferno_tdi",
  },
  {
    name: "Sophia Morrow",
    genre: "R&B / Neo-Soul",
    blurb: "Silk, soul, and light. A voice that sits right in the middle of the room.",
    image: "/images/artist-sophia.jpg",
    url: "https://sophiamorrow.bandcamp.com",
    instagram: "https://www.instagram.com/so2morrowthen",
  },
  {
    name: "Ryan Washington",
    genre: "R&B / Soul / Vocal Jazz",
    blurb: "Warmth you can feel. R&B, soul, and vocal jazz with a classic touch.",
    image: "/images/artist-ryan.jpg",
    url: "https://ryanwashington.bandcamp.com",
    instagram: "https://www.instagram.com/theemrwashington",
  },
  {
    name: "Isaiah Harden",
    genre: "Piano / R&B / Hip-Hop / Jazz",
    blurb: "Keys with something to say. A pianist moving between R&B, hip-hop, jazz, and classical.",
    image: "/images/artist-isaiah.jpg",
    url: "https://isaiahharden.bandcamp.com",
    instagram: "https://www.instagram.com/tritonefanatic",
  },
];

/* -------------------------------------------------------------------------- */
/* RELEASES                                                                   */
/* -------------------------------------------------------------------------- */

export type Release = {
  artist: string;
  title: string;
  year: string;
  cover: string;
  url: string;
  spotify?: string;
  embed?: string;
  embedType?: "album" | "track";
};

export const releases: Release[] = [
  {
    artist: "The LA Limes",
    title: "Freshly Squeezed",
    year: "2025",
    cover: "/images/freshly-squeezed.jpg",
    url: "https://thelalimes.bandcamp.com/album/freshly-squeezed",
    embed: "https://bandcamp.com/EmbeddedPlayer/album=1787920115/size=large/bgcol=f4f1e8/linkcol=1f3d2b/transparent=true/",
    embedType: "album",
  },
  {
    artist: "The Dante's Inferno",
    title: "Descent",
    year: "2025",
    cover: "/images/descent.jpg",
    url: "https://tdantesinferno.bandcamp.com/album/descent",
    embed: "https://bandcamp.com/EmbeddedPlayer/album=3292329643/size=large/bgcol=f4f1e8/linkcol=1f3d2b/transparent=true/",
    embedType: "album",
  },
  {
    artist: "The Dante's Inferno",
    title: "Grid Failure",
    year: "2025",
    cover: "/images/grid-failure.jpg",
    url: "https://tdantesinferno.bandcamp.com/album/grid-failure",
    embed: "https://bandcamp.com/EmbeddedPlayer/album=3982058973/size=large/bgcol=f4f1e8/linkcol=1f3d2b/transparent=true/",
    embedType: "album",
  },
  {
    artist: "The Dante's Inferno",
    title: "Deal With the Devil",
    year: "2025",
    cover: "/images/deal-with-the-devil.jpg",
    url: "https://tdantesinferno.bandcamp.com",
    spotify: "https://open.spotify.com/album/4jYvmYKoTEuG3QTdG6CeE5",
    embed: "https://bandcamp.com/EmbeddedPlayer/album=2682256908/size=large/bgcol=f4f1e8/linkcol=1f3d2b/transparent=true/",
    embedType: "album",
  },
  {
    artist: "Ryan Washington",
    title: "Turn Your Heart to Mine",
    year: "2025",
    cover: "/images/ryan-turn-your-heart.jpg",
    url: "https://ryanwashington.bandcamp.com/track/turn-your-heart-to-mine",
    embed: "https://bandcamp.com/EmbeddedPlayer/track=1866020265/size=large/bgcol=f4f1e8/linkcol=1f3d2b/transparent=true/",
    embedType: "track",
  },
  {
    artist: "Ryan Washington x Sophia Morrow",
    title: "What Used to Be",
    year: "2026",
    cover: "/images/ryan-used-to-be.jpg",
    url: "https://ryanwashington.bandcamp.com/track/what-used-to-be",
    embed: "https://bandcamp.com/EmbeddedPlayer/track=1913791062/size=large/bgcol=f4f1e8/linkcol=1f3d2b/transparent=true/",
    embedType: "track",
  },
  {
    artist: "Sophia Morrow x Ryan Washington",
    title: "What Used to Be",
    year: "2026",
    cover: "/images/sophia-used-to-be.jpg",
    url: "https://sophiamorrow.bandcamp.com/track/what-used-to-be",
    embed: "https://bandcamp.com/EmbeddedPlayer/track=3769876458/size=large/bgcol=f4f1e8/linkcol=1f3d2b/transparent=true/",
    embedType: "track",
  },
  {
    artist: "Isaiah Harden",
    title: "Therapy",
    year: "2026",
    cover: "/images/therapy.jpg",
    url: "https://isaiahharden.bandcamp.com/album/therapy",
    embed: "https://bandcamp.com/EmbeddedPlayer/album=1115039623/size=large/bgcol=f4f1e8/linkcol=1f3d2b/transparent=true/",
    embedType: "album",
  },
  {
    artist: "Sophia Morrow",
    title: "What You Mean To Me",
    year: "2025",
    cover: "/images/sophia-what-you-mean-to-me.jpg",
    url: "https://sophiamorrow.bandcamp.com/track/what-you-mean-to-me",
    embed: "https://bandcamp.com/EmbeddedPlayer/track=933679140/size=large/bgcol=f4f1e8/linkcol=1f3d2b/transparent=true/",
    embedType: "track",
  },
];

/* -------------------------------------------------------------------------- */
/* LIVE                                                                       */
/* -------------------------------------------------------------------------- */

export const liveNight = {
  title: "Thursdays on the block",
  venue: "The Stowaway",
  address: "416 S Spring St, Los Angeles, CA 90013",
  day: "Every Thursday",
  time: "Doors 8PM",
  copy:
    "An open mic and jam night in Downtown LA. Musicians and singers are encouraged to play. Hosted by the house band, The LA Limes.",
  mapUrl:
    "https://www.google.com/maps/search/?api=1&query=The+Stowaway%2C+416+S+Spring+St%2C+Los+Angeles%2C+CA+90013",
};

/* -------------------------------------------------------------------------- */
/* ABOUT                                                                      */
/* -------------------------------------------------------------------------- */

export const about = {
  intro:
    "Vermont Avenue Records is an independent record label based out of Los Angeles. A collective built with our community from the Herb Alpert Music Center.",
  body: [
    "We are dedicated to fostering an inclusive and vibrant community that amplifies diverse voices and ensures artists are fairly compensated for their creativity.",
    "The label grew out of a simple idea: give the musicians around us a real home for their work. Records, live shows, and a room full of people who care about the music. That is still the whole plan.",
  ],
  founder:
    "Founded by producer, DJ, and saxophonist John McGrath, the label works with a core collective of Los Angeles players and a roster that keeps growing.",
  credits: [
    "Adrian Riachta, guitar",
    "Dante Newcombe-Kenealy, drums",
    "Cameron Meyers, bass",
    "Louie Zong, keys",
    "John McGrath, saxophone",
    "Marcus Torres, trombone",
    "Kaipo Lee, trumpet",
  ],
  studios: ["Altamira Sound, Alhambra", "That Little Studio", "Vintage Synth Museum, Highland Park"],
};

/* -------------------------------------------------------------------------- */
/* BOOKING FORM                                                               */
/* -------------------------------------------------------------------------- */

export const bookingFields = {
  acts: acts.map((a) => a.name),
  eventTypes: [
    "Wedding",
    "Corporate event",
    "Private party",
    "Gala or fundraiser",
    "Brand activation",
    "Festival",
    "Other",
  ],
};
