/** Shared content types — see docs/DATA_MODEL.md */

export type DeckSector =
  | "Food & Beverages"
  | "Health & Pharma"
  | "Apparel & Fashion"
  | "Metals & Mining"
  | "IT & Professional Services"
  | "Infra & Housing"
  | "Automotives"
  | "Chemicals"
  | "PSUs"
  | "Services & BFSI"
  | "Real Estate"
  | "Others";

export interface Client {
  slug: string;
  name: string;
  sectors: DeckSector[];
  logo: string | null; // /logos/clients/* or null -> styled wordmark fallback
}

export interface Partner {
  slug: string;
  name: string;
  logo: string | null;
}

export interface Certification {
  slug: string;
  name: string;
  logo: string | null;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Region {
  code: "IN" | "KE" | "ZA" | "ME";
  name: string;
  email: string;
}

export interface Office {
  slug: string;
  name: string;
  legalEntity: string;
  kind: ("india-office" | "global-entity" | "delivery-centre")[];
  address?: string;
  city: string;
  country: string;
  email?: string;
  phone?: string;
  /** City centre, for the office map. [latitude, longitude] in degrees. */
  coords: [number, number];
}

export interface NavItem {
  label: string;
  href: string;
  children?: NavItem[];
}

export interface PracticeSummary {
  slug: string;
  name: string;
  tagline: string;
  href: string;
}

export interface SignatureOffering {
  slug: string;
  name: string;
  summary: string;
  metric?: string;
  href: string;
  cta: string;
}

export interface IndustryMeta {
  slug: string;
  name: string;
  headline: string;
  accentWord: string;
  subhead: string;
  deckSectors: DeckSector[];
}

export interface Insight {
  slug: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  /** The article's own image from the live site, under /public/insights. */
  image?: string;
  /** Exactly the day-and-month label the live listing prints, for articles that state no year. */
  dateLabel?: string;
  /** Where the card goes when this listing entry is not an article page on this site. */
  href?: string;
}

export interface Testimonial {
  slug: string;
  /** Verbatim from the client's published quote on /customer-stories/ — never paraphrased. */
  quote: string;
  name: string;
  role: string;
  /** /testimonials/* — the speaker's own portrait, the same file the live site's slider serves. */
  photo: string;
  /** Slug in content/clients.ts; the section shows that client's mark beside the attribution. */
  clientSlug: string;
}

export interface Leader {
  slug: string;
  name: string;
  title: string;
  bio: string;
  /** /team/*, or null until a cleared photograph is supplied — the card falls back to a monogram. */
  photo: string | null;
  linkedin?: string;
}

export interface Award {
  slug: string;
  /** The award's name exactly as the existing site captions it on /accreditation-awards/. */
  name: string;
  /** /awards/* — the same certificate photograph that page shows, re-encoded for the web. */
  image: string;
  width: number;
  height: number;
}

export interface Accreditation {
  slug: string;
  /** Heading verbatim from /accreditation-awards/, e.g. "ISO 9001:2008 (Quality Management)". */
  name: string;
  /** One paragraph per paragraph on that page, verbatim. */
  body: string[];
  /** /awards/* — the badge the existing page shows beside this heading. All five carry one. */
  logo: string;
}
