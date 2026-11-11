import { site, about } from "./content";

export type ContentType = "text" | "textarea" | "url" | "image";

export type ContentField = {
  key: string;
  label: string;
  group: string;
  type: ContentType;
  default: string;
  help?: string;
};

/**
 * The editable fields on the public site.
 *
 * Every key here is rendered through getContent() (DB value, falling back to
 * `default`). To make a new block editable: add it here and read it on the page.
 */
export const CONTENT_FIELDS: ContentField[] = [
  {
    key: "home.hero.eyebrow",
    label: "Hero eyebrow",
    group: "Home",
    type: "text",
    default: "Independent label, Los Angeles",
  },
  {
    key: "home.hero.lede",
    label: "Hero paragraph",
    group: "Home",
    type: "textarea",
    default: `${site.tagline} A record label and live music collective built with our community in Los Angeles.`,
  },
  {
    key: "home.hero.image",
    label: "Hero image",
    group: "Home",
    type: "image",
    default: "/images/vermont-logo.jpg",
    help: "Pick from the media library or paste a path.",
  },
  {
    key: "home.label.intro",
    label: "The label, lead line",
    group: "Home",
    type: "textarea",
    default: about.intro,
  },
  {
    key: "home.label.body",
    label: "The label, paragraph",
    group: "Home",
    type: "textarea",
    default: about.body[0],
  },
  {
    key: "about.intro",
    label: "Intro paragraph",
    group: "About",
    type: "textarea",
    default: about.intro,
  },
  {
    key: "about.body.1",
    label: "Story paragraph 1",
    group: "About",
    type: "textarea",
    default: about.body[0],
  },
  {
    key: "about.body.2",
    label: "Story paragraph 2",
    group: "About",
    type: "textarea",
    default: about.body[1],
  },
  {
    key: "about.founder",
    label: "Founder line",
    group: "About",
    type: "textarea",
    default: about.founder,
  },
  {
    key: "about.story.image",
    label: "Story image",
    group: "About",
    type: "image",
    default: "/images/artist-ryan.jpg",
    help: "Pick from the media library or paste a path.",
  },
  {
    key: "about.mission",
    label: "Mission",
    group: "About",
    type: "textarea",
    default:
      "Fair pay for artists. An inclusive room. Music that sounds like the people who made it. That is the standard we hold ourselves to.",
  },
];

export const CONTENT_GROUPS: string[] = Array.from(
  new Set(CONTENT_FIELDS.map((field) => field.group))
);

export function fieldDefault(key: string): string {
  return CONTENT_FIELDS.find((field) => field.key === key)?.default ?? "";
}
