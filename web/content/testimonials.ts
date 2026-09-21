import type { Testimonial } from "./types";

/**
 * The "What people say" quotes carried over from the existing site's customer-stories page
 * (scraped/about/customer-stories.md). Every quote is reproduced verbatim; only the shouted
 * ALL-CAPS names are set in title case to match the rest of the site. Nothing here is written
 * by us — see docs/LEGAL_REVIEW.md for the named-client clearance.
 *
 * Re-checked against the live homepage slider on 2026-09-16: all five quotes and attributions
 * match it word for word. The `photo` on each entry is the speaker's own portrait, pulled from
 * that slider and stored in /public/testimonials, so the section now shows the person as well as
 * their employer's mark — the live site's slider order is the order kept here.
 *
 * Only one of those files was altered: Kunal Shah's is a wide desk photograph on the live site, and
 * a circular crop of it cut his face out entirely, so it is stored here squared around him. The
 * other four are the originals.
 */
export const testimonials: Testimonial[] = [
  {
    slug: "mg-motor-india",
    quote:
      "Being one of the world's most celebrated automotive brands, MG India is driven by Innovation, Customer Centricity, Community Care and Diversity. Our aim is to provide an ideal work atmosphere for all employees to nurture and grow in their roles. By implementing SAP SuccessFactors, we bring best of employee experience that results in increased HR productivity and enable us to achieve desired business outcomes. We choose In2IT EBS as our trusted SAP SuccessFactors AMC partner. In2IT EBS is a Gold Partner of SAP, by enabling the partnership we have seen improvements that helps us keeping the pace with our expanding and changing business needs.",
    name: "Mausam Joshi",
    role: "General Manager – HR, MG Motor India",
    photo: "/testimonials/mausam-joshi.jpg",
    clientSlug: "mg-motor",
  },
  {
    slug: "mrs-bectors-food-specialities",
    quote:
      "9th May 2022 is a day to remember and celebrate as a MBFSL team as together are taking a LEAP (Leveraging Effectiveness thru Automating Processes) by moving from manual way of working to online cloud based globally acclaimed Human Capital Management system – SAP SuccessFactors. At this juncture like to thank with lots of humility to each and every team member from HR team for putting their sincere hard work and compete dedicated time to complete the entire LEAP project in record time from end to end in 04 months which by all standard is a stretched target. Also, this feat won't be possible without expert contribution and able project management by our implementation partner In2IT who also worked with HR team shoulder to shoulder to achieve the deadline.",
    name: "Dr. Sanjeev Kumarr Dixit",
    role: "CHRO – Mrs. Bectors Food Specialities Ltd.",
    photo: "/testimonials/sanjeev-kumarr-dixit.jpg",
    clientSlug: "mrs-bectors",
  },
  {
    slug: "trilegal",
    quote:
      "Trileagal is consistently recognised as the best Indian law firm for the quality for their services and client satisfaction. We are recognised for our sheer commitment to diversity, equality and sustainability and to bring best of employee experience we have decided to go for HR Digital Transformation with SAP SuccessFactors. We chosen In2IT EBS as our trusted implementation partner and by enabling the partnership from the day 1 In2IT EBS team has took the ownership of the project, turn it around, tackling the stringent deadline and made this HR Digital Transformation journey successful.",
    name: "Kavita Mathur",
    role: "Chief People Officer at Trilegal",
    photo: "/testimonials/kavita-mathur.jpg",
    clientSlug: "trilegal",
  },
  {
    slug: "aknamed",
    quote:
      "Aknamed was founded in 2018, by a team of founders with decades of experience in healthcare, to streamline Healthcare Delivery in India. We're a new-age support system that helps hospitals evolve and better tackle the complexities in healthcare. We saw the need for a reliable solution to help simplify our Finance, Supply Chain, CRM, SRM, HR, etc",
    name: "Kunal Shah",
    role: "CFO at Aknamed",
    photo: "/testimonials/kunal-shah.jpg",
    clientSlug: "aknamed",
  },
  {
    slug: "accion-labs",
    quote:
      "At Accion Labs, our growth are just not in revenue numbers but also in challenging mindsets of our employees with right interventions via power of analytics, enablement and employee experience. When we started our journey with SAP SuccessFactors, we were looking to enrich our HR Processes with an integrated end to end business solution. In2IT EBS enabled us to achieve our vision through right business planning and governance and implementing the entire SuccessFactors suite of solutions across 27 countries. Congratulations to the Accion Labs and In2IT EBS teams for this milestone achievement.",
    name: "Amy Halter",
    role: "VP Operations and HR at Accion Labs",
    photo: "/testimonials/amy-halter.png",
    clientSlug: "accionlabs",
  },
];
