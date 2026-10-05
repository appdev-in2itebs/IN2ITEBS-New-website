import type { Office } from "./types";

/** Addresses for the 4 India offices = deck (SOT-45). Emails/phones = old site.
 *  Global entity legal names = deck; their street addresses = old site (deck gave names only).
 *
 *  Mumbai, Chennai and Kolkata were listed here briefly from the live site's /contact/ page and
 *  removed again on 2026-09-17 at the owner's request. `coords` is the city centre and exists only
 *  to place each office on the map in `components/sections/office-map.tsx`. */
export const offices: Office[] = [
  {
    slug: "bangalore",
    name: "Bangalore",
    legalEntity: "In2IT Enterprise Business Services Pvt Ltd",
    kind: ["india-office", "delivery-centre"],
    address:
      "3rd Floor, Crescent 4, Prestige Shantiniketan, ITPL Main Road, Whitefield, Hoodi, Bangalore North, Karnataka – 560048",
    city: "Bengaluru",
    country: "India",
    email: "info@in2itebs.com",
    phone: "+91 80930 07552",
    coords: [12.9716, 77.5946],
  },
  {
    slug: "bhubaneswar",
    name: "Bhubaneswar",
    legalEntity: "In2IT Enterprise Business Services Pvt Ltd",
    kind: ["india-office", "delivery-centre"],
    address: "Fortune Tower, 1st Floor, Zone-C, Bhubaneswar, Odisha – 751023",
    city: "Bhubaneswar",
    country: "India",
    email: "info@in2itebs.com",
    coords: [20.2961, 85.8245],
  },
  {
    slug: "hyderabad",
    name: "Hyderabad",
    legalEntity: "In2IT Enterprise Business Services Pvt Ltd",
    kind: ["india-office", "delivery-centre"],
    address:
      "4th Floor, Elite, Manjeera Trinity Corporate, JNTU-Hitech City Road, KPHB, Kukatpally, Hyderabad – 500072",
    city: "Hyderabad",
    country: "India",
    email: "info@in2itebs.com",
    coords: [17.385, 78.4867],
  },
  {
    slug: "delhi-ncr",
    name: "Delhi NCR — Noida",
    legalEntity: "In2IT Enterprise Business Services Pvt Ltd",
    kind: ["india-office", "delivery-centre"],
    address: "26th Floor, Unit No. 2615A & 2616, Astralis Tower, Sector-94, Noida – 201301",
    city: "Noida",
    country: "India",
    email: "info@in2itebs.com",
    coords: [28.5355, 77.391],
  },
  {
    slug: "singapore",
    name: "Singapore",
    legalEntity: "In2IT Enterprise Business Services Pte Ltd",
    kind: ["global-entity", "delivery-centre"],
    address: "531A Upper Cross Street, #04-95, Hong Lim Complex, Singapore 051531",
    city: "Singapore",
    country: "Singapore",
    email: "info@in2itebs.sg",
    coords: [1.3521, 103.8198],
  },
  {
    slug: "dubai",
    name: "Dubai",
    legalEntity: "IN2IT EB Solutions LLC",
    kind: ["global-entity", "delivery-centre"],
    address: "Office 805-131, PR1005 Building, Port Saeed, Deira, Dubai, UAE",
    city: "Dubai",
    country: "UAE",
    email: "info@in2itebs.ae",
    coords: [25.2048, 55.2708],
  },
  {
    slug: "kenya",
    name: "Kenya",
    legalEntity: "In2IT Enterprise Business Services Kenya Limited",
    kind: ["global-entity", "delivery-centre"],
    address: "Purshottam Place, 7th Floor, Westlands Road, Museum Hill, P.O. Box 66217-00800, Nairobi",
    city: "Nairobi",
    country: "Kenya",
    email: "info@in2itebs.co.ke",
    coords: [-1.2921, 36.8219],
  },
  {
    slug: "south-africa",
    name: "South Africa",
    legalEntity: "IN2IT Enterprise Business Services (Pty) Ltd",
    kind: ["global-entity", "delivery-centre"],
    address: "9 Kinross Street, Germiston South, Germiston, Gauteng – 1401",
    city: "Germiston",
    country: "South Africa",
    email: "info@in2itebs.co.za",
    phone: "+27 11 873 0234",
    coords: [-26.2178, 28.17],
  },
  {
    slug: "usa",
    name: "USA",
    legalEntity: "In2IT Enterprise Business Services Inc",
    kind: ["global-entity"],
    address: "5900 Balcones Drive, Suite 100, Austin, TX 78731",
    city: "Austin",
    country: "USA",
    email: "info@in2itebs.com",
    coords: [30.2672, -97.7431],
  },
];

/** 10+ delivery centres named in the deck footprint (SOT-03). */
export const deliveryCities = [
  "Bengaluru",
  "Mumbai",
  "Delhi",
  "Bhubaneswar",
  "Hyderabad",
  "Chennai",
  "Singapore",
  "Dubai",
  "Nairobi",
  "Johannesburg",
];

/** Projects delivered across 30+ countries (SOT-03). */
export const countries = [
  "India",
  "UK",
  "US",
  "Canada",
  "Singapore",
  "UAE",
  "Thailand",
  "KSA",
  "Kenya",
  "Australia",
  "South Africa",
  "Belgium",
  "Sri Lanka",
];

/** One entry per distinct mailbox; the shared info@in2itebs.com is labelled Global. */
export function contactsFor(list: Office[]) {
  return Array.from(new Map(list.filter((o) => o.email).map((o) => [o.email as string, o])).values()).map((o) => ({
    region: o.email === "info@in2itebs.com" ? "Global" : o.name,
    email: o.email as string,
  }));
}
export const regionalContacts = contactsFor(offices);

/** Cities in office order, for the footer line. */
export const citiesFor = (list: Office[]) => list.map((o) => o.city);
export const officeCities = citiesFor(offices);
