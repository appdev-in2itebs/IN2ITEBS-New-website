import type { Leader } from "./types";

/** "RSS" from "Rudra Shankar Shatapathy" — used wherever a leader has no cleared photograph. */
export function leaderInitials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 3)
    .map((part) => part[0])
    .join("");
}

/**
 * Senior leadership, shared by the About page and the homepage "Meet our team" section.
 *
 * Copied 1:1 from the live site on 2026-09-16: the roster, order, titles and photographs are the
 * homepage "Meet Our Team" carousel at in2itebs.com, and the photographs in /public/team are the
 * same files that carousel serves (Rudra's was already byte-identical to ours). Where the carousel
 * truncates a bio with "..", the full text is taken from that leader's own page — Rudra from
 * /our-leadership/, Abhijit Shukla from /abhijit-shukla/ — and is otherwise verbatim.
 *
 * Two people the previous roster carried, Parichay Joshi and Gangadhar Panda, are no longer on the
 * live site in any form (/our-leadership/ now lists Shatapathy alone, and the old /out-leadership/
 * URL is a 404). They were dropped here on the owner's ruling of 2026-09-16 to keep this list and
 * the live site identical. Sudhansu Mishra's title moved from "AGM IT Application" to Chief
 * Operating Officer on the same pass, and Abhijit Shukla is new.
 *
 * Every leader now carries a LinkedIn profile: Rudra's from the earlier scrape, and the other
 * three supplied by the owner on 2026-09-18. They are stored as canonical `/in/<profile>/` URLs —
 * the links as sent were LinkedIn share links carrying `utm_source=share_via` tracking, which has
 * no business being published on the site. The live cards themselves link only to a leader's own
 * page. Named leadership remains a `docs/LEGAL_REVIEW.md` item.
 */
export const leadership: Leader[] = [
  {
    slug: "sudhansu-mishra",
    name: "Sudhansu Mishra",
    title: "Chief Operating Officer (COO)",
    photo: "/team/sudhansu-mishra.png",
    linkedin: "https://www.linkedin.com/in/sudhansu-s-mishra/",
    bio: "An IT professional with 21 years' experience in Pre-Sales, Project Management, Bid Management and Tender Management.",
  },
  {
    slug: "rudra-shankar-shatapathy",
    name: "Rudra Shankar Shatapathy",
    title: "Managing Director",
    photo: "/team/rudra-shankar-shatapathy.png",
    linkedin: "https://www.linkedin.com/in/rudra-shankar-shatapathy-34b798a3/",
    bio: "Rudra has provided vision and dedicated leadership in building and aligning solutions to clients across multiple geographies. His vast experience in opening up and growing large geographies for IT organizations has helped multiple IT companies expand in India, USA, Africa and Singapore within a short span of time. Rudra's unwavering focus has been towards simplifying the complex corporate world by connecting technology seamlessly to business. He is a passionate advocate of ordinary people coming together to do extraordinary things. Rudra holds an MBA in International Business and B. Tech in Mechanical Engineering.",
  },
  {
    slug: "abhijit-shukla",
    name: "Abhijit Shukla",
    title: "Chief Revenue Officer (CRO)",
    photo: "/team/abhijit-shukla.png",
    linkedin: "https://www.linkedin.com/in/abhijitshukla/",
    bio: "Abhijit Shukla serves as Chief Revenue Officer (CRO) at In2IT EBS, leading global sales, revenue growth, strategic partnerships, and market expansion. With extensive experience in enterprise technology and digital transformation, he has a proven track record of building high-performing teams and delivering customer-centric outcomes across international markets. Abhijit combines strategic vision with execution excellence to accelerate sustainable growth and strengthen the company's global footprint.",
  },
  {
    slug: "kunwar-krishna-menon",
    name: "Kunwar Krishna Menon",
    title: "Country Sales Manager",
    photo: "/team/kunwar-krishna-menon.png",
    linkedin: "https://www.linkedin.com/in/kunwar-krishna-a3a24a1a/",
    bio: "A committed Business Development Manager with experience in selling products like SAP SuccessFactors and S/4HANA.",
  },
];
