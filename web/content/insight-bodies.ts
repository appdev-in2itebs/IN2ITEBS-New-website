/**
 * Article bodies.
 *
 * ── REWRITTEN 18 NOVEMBER 2026 ───────────────────────────────────────────────────────────────
 * Four of these were transcribed from the live site and were, on inspection, SAP's marketing
 * written in SAP's voice about SAP's products — "a holistic program", "empowers organizations",
 * "in today's fast-paced, technology-driven landscape" — with one carrying SAP's own campaign
 * line as its strapline and another running under a named executive's byline. Three problems in
 * one: a copyright exposure, no argument only we could make, and a voice that contradicts the
 * rest of this site, where /about/where-we-stand/ publishes what we cannot do.
 *
 * They were rewritten rather than deleted, so the slugs, the URLs and the inbound links survive.
 * Every claim in the new text is one this repository already evidences: the module set in
 * content/capability-status.ts, the RISE Validated Partner gap, the hyperscaler boundary, and the
 * narrow AI position. If a claim here stops being true, the capability table is the source of
 * truth and this file follows it, not the other way round.
 *
 * The two Simplify pages are In2IT's own partner packages and are left as the live site has them.
 * ─────────────────────────────────────────────────────────────────────────────────────────────
 *
 * Originally transcribed from in2itebs.com (re-captured 2026-09-21 against the live pages).
 * The text is the live site's, block for block and word for word: its section headings, its bold
 * sub-headings, its inline images (under /public/insights/body) and its author photos, in the live
 * order. Only the site chrome around the article (header, footer, comment form, share bar), the
 * title, which the page header prints, and six author photos whose files the live server no longer
 * has (they 404 there too) are left out. `author`, `authorRole` and `authorDate` carry
 * the byline the article itself prints, where it has one.
 *
 * "grow-with-sap" is an event landing page on the live site rather than a written article — it
 * carries a forum title, a strapline and a "Register Now" button and nothing else, so that is all
 * there is to show. The button keeps the live site's own destination path, which
 * content/redirects.mjs resolves on this site.
 */
export type InsightBlock =
  | { type: "heading" | "paragraph" | "listItem"; text: string; strong?: boolean }
  | { type: "image"; src: string; alt?: string }
  | { type: "link"; text: string; href: string };

export const insightBodies: Record<
  string,
  { author?: string; authorRole?: string; authorDate?: string; blocks: InsightBlock[] }
> = {
  "revolutionizing-hr-with-sap-successfactors-a-strategic-approach-to-modern-hcm-solutions": {
    blocks: [
      {
        type: "paragraph",
        text: "Most SuccessFactors programmes in India are sequenced around what the HR team wants to fix first. That is the wrong input, and it is the most common reason a rollout stalls at module three.",
      },
      { type: "heading", text: "Why sequencing beats module selection" },
      {
        type: "paragraph",
        text: "The suite is modular, which makes it tempting to treat the order as a matter of priority: recruitment hurts most, so start with Recruiting. The problem is that every module downstream of Employee Central reads its organisational structure, its position management and its employee master from Employee Central. Start elsewhere and you build the second module against a structure you have not yet agreed.",
      },
      {
        type: "paragraph",
        text: "We run Employee Central, Recruiting, Onboarding, Performance and Goals, Compensation, Succession and Learning in production across several sectors. The programmes that went smoothly settled the organisational model first. The ones that did not, re-did it later at three times the cost.",
      },
      { type: "heading", text: "The four decisions to take before configuration starts" },
      {
        type: "paragraph",
        text: "Position management or job-based. This is the one that is genuinely hard to reverse, and in organisations with sanctioned strength — public sector undertakings especially — position management is usually the only model that reconciles with how establishment is actually controlled.",
        strong: true,
      },
      {
        type: "paragraph",
        text: "Where payroll sits. SuccessFactors Employee Central Payroll, a third-party Indian payroll, or the existing SAP payroll kept in place. Each is defensible. What is not defensible is deciding after Employee Central is configured, because the integration pattern differs in each case.",
        strong: true,
      },
      {
        type: "paragraph",
        text: "How many legal entities, and whether they share a process. Groups with multiple registered entities often assume a single template and discover statutory divergence during user acceptance testing.",
        strong: true,
      },
      {
        type: "paragraph",
        text: "Who owns data quality in the legacy system. Migration surfaces every gap in the records you have been living with. Somebody needs to own the cleanup before the cutover, not during it.",
        strong: true,
      },
      { type: "heading", text: "On the AI capability" },
      {
        type: "paragraph",
        text: "SAP has extended AI across the suite and the demonstrations are genuinely impressive. Our position on it is narrower than the marketing: we have delivered advisory work on feasibility, and agents built with Joule Studio on SAP Business AI Platform are an investment for us rather than something we can point at a reference for.",
      },
      {
        type: "paragraph",
        text: "If an implementation partner tells you their AI capability is proven, ask which client, which module and which month it went live. We would expect to be asked the same.",
      },
      { type: "heading", text: "What a realistic first phase looks like" },
      {
        type: "paragraph",
        text: "Employee Central with the organisational model agreed and signed, one payroll integration, and one downstream module chosen because it shares the most data with Employee Central rather than because it is the loudest complaint. Everything else follows more cheaply once that is stable.",
      },
      { type: "link", text: "Our SuccessFactors practice", href: "/services/successfactors/" },
    ],
  },

  "igniting-organizational-potential-sap-successfactors-ai-innovations-revealed-at-sap-successconnect-las-vegas": {
    blocks: [
      {
        type: "paragraph",
        text: "SAP has extended AI across the SuccessFactors suite, and the gap between what is demonstrated at a conference and what you can put in front of an HR team next quarter is wider than the announcements suggest. Here is how we separate the two.",
      },
      { type: "heading", text: "Three capabilities worth understanding" },
      {
        type: "paragraph",
        text: "Generative assistance in authoring. Job descriptions, learning recommendations and summaries generated from data already in the suite. This is the most mature of the three and the easiest to pilot, because a bad output is visible immediately and costs nothing to discard.",
        strong: true,
      },
      {
        type: "paragraph",
        text: "Joule, the natural-language assistant embedded in the solutions. Useful where a user knows what they want but not where the system keeps it. Its value depends almost entirely on how clean your configuration is — an assistant over a badly modelled org structure answers confidently and wrongly.",
        strong: true,
      },
      {
        type: "paragraph",
        text: "The talent intelligence hub, which puts a single skills model behind recruiting, learning, development, performance and succession. This is the one with the largest potential and the longest runway, because it only pays back once the skills data underneath it is real.",
        strong: true,
      },
      { type: "heading", text: "Our position, stated narrowly" },
      {
        type: "paragraph",
        text: "We have delivered advisory work on AI feasibility. Agents built with Joule Studio on SAP Business AI Platform are an investment for us, not a reference we can point you at. We have delivered applied AI in narrow production scopes elsewhere — document and computer vision work at a state undertaking — and the broader agentic claim is not one we make yet.",
      },
      {
        type: "paragraph",
        text: "We publish that distinction because the alternative is letting a demonstration stand in for delivery evidence, and in this market that happens often enough to be worth guarding against.",
      },
      { type: "heading", text: "How we would suggest approaching it" },
      {
        type: "paragraph",
        text: "Pick one process where a wrong answer is cheap and visible, run it for a quarter, and measure whether anybody chose to keep using it once the novelty wore off. Adoption after ninety days is the only metric here that predicts anything.",
      },
      {
        type: "paragraph",
        text: "And before any of it, check the configuration underneath. Every AI capability in the suite reads the same organisational data as every other module, and none of them improve it.",
      },
      { type: "link", text: "Where we stand, capability by capability", href: "/about/where-we-stand/" },
    ],
  },

  "grow-with-sap": {
    blocks: [
      {
        type: "paragraph",
        text: "GROW is SAP's route to S/4HANA Cloud Public Edition for organisations that do not want a two-year programme. The constraint it imposes is the point of it, and it is also the thing most buyers do not price properly.",
      },
      { type: "heading", text: "What the model actually trades" },
      {
        type: "paragraph",
        text: "Public Edition is a standardised cloud ERP on a fixed release cycle. You adopt SAP's process model rather than configuring your own, extensions sit outside the core, and SAP upgrades the system on its schedule rather than yours.",
      },
      {
        type: "paragraph",
        text: "In exchange you get a go-live measured in weeks, a predictable subscription, and no upgrade project ever again. For a business that has outgrown spreadsheets or a local accounting package, that trade is usually correct. For one with twenty years of process variation it usually is not, and a partner who does not tell you which you are is not worth engaging.",
      },
      { type: "heading", text: "Three questions to settle before you sign" },
      {
        type: "paragraph",
        text: "Which of your processes genuinely cannot change? Not which ones you would prefer to keep — which ones are fixed by a regulator, a customer contract or a statutory filing. That list is the real test of whether Public Edition fits, and it is almost always shorter than the first draft.",
        strong: true,
      },
      {
        type: "paragraph",
        text: "What happens to your extensions at the next release? Anything built outside the core has to be regression-tested on SAP's cycle, not yours. Ask who does that work and whether it is inside the price you have been quoted.",
        strong: true,
      },
      {
        type: "paragraph",
        text: "Is the quoted price the whole price? Licence, implementation, integration to the systems you are keeping, data migration and the first year of support are five separate numbers. A fixed price that covers one of them is not a fixed price.",
        strong: true,
      },
      { type: "heading", text: "Our own packaged version of this" },
      {
        type: "paragraph",
        text: "In2IT Converged Pulse for SAP GROW Fast is our own packaged version of this, and one of three packages SAP has reviewed and published. Finance, Sales and Procurement on SAP Cloud ERP with Employee Central alongside, live in twelve weeks, with scope, duration and price all three stated before signature. It is not for everyone, and the conversation that decides whether it fits is deliberately the first one rather than the last.",
      },
      { type: "link", text: "Converged Pulse", href: "/services/converged-pulse/" },
    ],
  },

  "in2it-ebs-simplify-talent-2": {
    blocks: [
      {
        type: "paragraph",
        text: "SimplifyTalent, an SAP Qualified Partner Package which leverages the global best practices of SAP SuccessFactors software solution portfolio aligning with Talent Management aspirations of Indian organizations.",
      },
      {
        type: "paragraph",
        text: "This package enables organizations across all industries to implement end-to-end spectrum of CoreHR, Performance and Goal Management Business Processes in a Rapid Deployment mode within 4 weeks.",
      },
      {
        type: "image",
        src: "/insights/body/1.png",
        alt: "",
      },
      {
        type: "heading",
        text: "Single Source of Truth",
      },
      {
        type: "paragraph",
        text: "Enter information once for all HR tasks. Update on one, reflects on all",
      },
      {
        type: "image",
        src: "/insights/body/2.png",
        alt: "",
      },
      {
        type: "heading",
        text: "Integration of Data",
      },
      {
        type: "paragraph",
        text: "Simplify different parts of the system can talk to each other, allowing more meaningful reporting & analysis capabilities",
      },
      {
        type: "image",
        src: "/insights/body/3.png",
        alt: "",
      },
      {
        type: "heading",
        text: "Self Service",
      },
      {
        type: "paragraph",
        text: "A great time saver for HR. Employees may enter their own data or retrieve data without bothering HR.",
      },
      {
        type: "image",
        src: "/insights/body/4.png",
        alt: "",
      },
      {
        type: "heading",
        text: "Accelerated Business Results",
      },
      {
        type: "listItem",
        text: "Instant retrieval & data processing",
      },
      {
        type: "listItem",
        text: "Availability of accurate & timely employee’s data",
      },
      {
        type: "listItem",
        text: "More transparency in the system",
      },
      {
        type: "image",
        src: "/insights/body/Picture2-1024x194.jpg",
        alt: "",
      },
      {
        type: "heading",
        text: "In the Cloud",
      },
      {
        type: "paragraph",
        text: "With SimplifyTalent cloud solutions, you get a lower, predictable monthly cost and faster time to value. It’s more flexible, scalable, and secure, and it’s faster.",
      },
      {
        type: "heading",
        text: "Platform",
      },
      {
        type: "paragraph",
        text: "SimplifyTalent contains a core set of functionalities common across the entire software suite. Whether you deploy the full HCM Suite or just a part of it.",
      },
      {
        type: "heading",
        text: "Mobile",
      },
      {
        type: "paragraph",
        text: "With smart phones and tablet computers, you can take advantage of the power of SimplifyTalent, anytime, anywhere.",
      },
      {
        type: "heading",
        text: "Extendible",
      },
      {
        type: "paragraph",
        text: "You can take advantage of extending other modules of SuccessFactors to co-exist with SimplifyTalent",
      },
      {
        type: "heading",
        text: "On-Top Optimizations",
      },
      {
        type: "paragraph",
        text: "Possible Integrating RPA/NLP Tools with SimplifyTalent for Souring automation for removing mundane jobs",
      },
      {
        type: "heading",
        text: "One system of record, so a question about the business only has to be asked once",
      },
      {
        type: "image",
        src: "/insights/body/Picture3.jpg",
        alt: "",
      },
      {
        type: "heading",
        text: "Performance & Goal Management",
      },
      {
        type: "image",
        src: "/insights/body/Picture4.jpg",
        alt: "",
      },
      {
        type: "paragraph",
        text: "WHAT DOES In2IT Enterprise Business Services OFFER?",
      },
      {
        type: "listItem",
        text: "SAP best practices implementation methodology – SAP Activate",
      },
      {
        type: "listItem",
        text: "Over 50+ certified SuccessFactors consultants across different modules",
      },
      {
        type: "listItem",
        text: "Extend SuccessFactors with other products",
      },
      {
        type: "listItem",
        text: "Dedicated support team",
      },
      {
        type: "listItem",
        text: "Skilled consultants to work on integration using HANA cloud platform, Dell Boomi",
      },
      {
        type: "listItem",
        text: "Presence across all major cities in Indi",
      },
      {
        type: "paragraph",
        text: "IN2IT EBS will provide:",
        strong: true,
      },
      {
        type: "listItem",
        text: "Data Migration Plan",
      },
      {
        type: "listItem",
        text: "Data Loading Templates",
      },
      {
        type: "listItem",
        text: "Loading the curated Information in Production System",
      },
      {
        type: "listItem",
        text: "Train the Trainer Sessions",
      },
      {
        type: "listItem",
        text: "User & Admin User Manuals",
      },
      {
        type: "listItem",
        text: "External QRGs for Client SPOCs",
      },
    ],
  },
  "in2it-ebs-simplify-hiring": {
    blocks: [
      {
        type: "paragraph",
        text: "Simplify Hiring is an SAP Qualified Partner Package which leverages the global best practices of SAP SuccessFactors solution portfolio, aligning with Recruitment & Onboarding aspirations of Indian organisations.",
      },
      {
        type: "paragraph",
        text: "This package enables organizations to implement end-to-end spectrum of Recruitment and Onboarding modules within a short span of 4 weeks",
      },
      {
        type: "image",
        src: "/insights/body/1.png",
        alt: "",
      },
      {
        type: "paragraph",
        text: "Faster Time to Hire, Lower Cost per Hire",
      },
      {
        type: "image",
        src: "/insights/body/2.png",
        alt: "",
      },
      {
        type: "paragraph",
        text: "Increased Recruiter, Hiring Manager Efficiency",
      },
      {
        type: "image",
        src: "/insights/body/3.png",
        alt: "",
      },
      {
        type: "paragraph",
        text: "Paperless Onboarding",
      },
      {
        type: "image",
        src: "/insights/body/4.png",
        alt: "",
      },
      {
        type: "paragraph",
        text: "A Fully Integrated response to Social Recruiting & Onboarding",
      },
      {
        type: "image",
        src: "/insights/body/hari1-1024x119.jpg",
        alt: "",
      },
      {
        type: "heading",
        text: "In the Cloud",
      },
      {
        type: "paragraph",
        text: "With SimplifyTalent cloud solutions, you get a lower, predictable monthly cost and faster time to value. It’s more flexible, scalable, and secure, and it’s faster.",
      },
      {
        type: "heading",
        text: "Platform",
      },
      {
        type: "paragraph",
        text: "SimplifyTalent contains a core set of functionalities common across the entire software suite. Whether you deploy the full HCM Suite or just a part of it.",
      },
      {
        type: "heading",
        text: "Mobile",
      },
      {
        type: "paragraph",
        text: "With smart phones and tablet computers, you can take advantage of the power of SimplifyTalent, anytime, anywhere.",
      },
      {
        type: "heading",
        text: "Extendible",
      },
      {
        type: "paragraph",
        text: "You can take advantage of extending other modules of SuccessFactors to co-exist with SimplifyTalent",
      },
      {
        type: "heading",
        text: "On-Top Optimizations",
      },
      {
        type: "paragraph",
        text: "Possible Integrating RPA/NLP Tools with SimplifyTalent for Souring automation for removing mundane jobs",
      },
      {
        type: "heading",
        text: "One system of record, so a question about the business only has to be asked once",
      },
      {
        type: "heading",
        text: "SimplifyHiring",
      },
      {
        type: "image",
        src: "/insights/body/t1.png",
        alt: "",
      },
      {
        type: "heading",
        text: "WHAT DOES IN2IT enterprise business services OFFER?",
      },
      {
        type: "listItem",
        text: "SAP best practices implementation methodology – SAP Activate",
      },
      {
        type: "listItem",
        text: "Over 30+ certified SuccessFactors consultants across different modules",
      },
      {
        type: "listItem",
        text: "Extend SuccessFactors with other products",
      },
      {
        type: "listItem",
        text: "Dedicated support team",
      },
      {
        type: "listItem",
        text: "Skilled consultants to work on integration using HANA cloud platform, Dell Boomi",
      },
      {
        type: "listItem",
        text: "Presence across all major cities in India",
      },
      {
        type: "heading",
        text: "IN2IT EBS will provide :",
      },
      {
        type: "listItem",
        text: "Data Migration & Cutover Plan",
      },
      {
        type: "listItem",
        text: "Legacy Data Loading Templates",
      },
      {
        type: "listItem",
        text: "User & Admin User Manuals",
      },
      {
        type: "listItem",
        text: "QRGs for External Participant like Agency Users & Candidates.",
      },
    ],
  },
  "how-rise-with-sap-s-4hana-cloud-can-transform-your-business": {
    author: "Sridhar Ayalam",
    authorRole: "Chief Solutions Officer, In2IT EBS",
    authorDate: "18 November 2026",
    blocks: [
      {
        type: "paragraph",
        text: "RISE with SAP is sold as a destination. It is closer to a contracting model, and the difference decides how much of your migration it actually covers.",
      },
      { type: "heading", text: "What RISE is, stated plainly" },
      {
        type: "paragraph",
        text: "RISE bundles S/4HANA Cloud Private Edition, the infrastructure it runs on, and a defined set of SAP-delivered services into one subscription with one SAP contract. That is the whole of it. It is a commercial wrapper around things that previously sat in three or four agreements, and the value of the wrapper is real: one renewal date, one escalation path, one party accountable for the platform layer.",
      },
      {
        type: "paragraph",
        text: "What it does not do is perform your conversion. The migration, the custom code, the interfaces, the data and the decisions about what your processes should look like afterwards are all still yours, and they are where the programme succeeds or fails.",
      },
      { type: "heading", text: "The question that actually decides your timeline" },
      {
        type: "paragraph",
        text: "Brownfield or greenfield is the decision, and most organisations settle it on the wrong grounds — usually a preference for a clean start that does not survive contact with twenty years of process variation.",
      },
      {
        type: "paragraph",
        text: "A brownfield conversion carries your history across, including the parts you do not like. It is faster, it is cheaper, and it protects the configuration decisions somebody made for a reason nobody now remembers. A greenfield build gives you a standard core and makes you re-earn every deviation from it. That is healthy, and it is also a two-year conversation with your business about why things are the way they are.",
      },
      {
        type: "paragraph",
        text: "Our own position is a matter of record: brownfield conversions and RISE migrations are in production here, including at state utilities and public sector undertakings. That is where our evidence is, and it is where we will argue from.",
      },
      { type: "heading", text: "Who runs the infrastructure, and why it matters to your contract" },
      {
        type: "paragraph",
        text: "Under RISE, SAP contracts with a hyperscaler for the region and the infrastructure. We design and run the estate on top of it. We do not resell hosting or hardware, and we will name the hyperscaler before you sign rather than after.",
      },
      {
        type: "paragraph",
        text: "This matters more than it sounds. Where in-country data residency is a regulatory requirement rather than a preference — which it is for most of the public-sector and utility work we do — the region selection is a contractual term, not an implementation detail. Settle it in the commercial conversation.",
      },
      { type: "heading", text: "One thing to check before a public-sector tender" },
      {
        type: "paragraph",
        text: "Some Indian public-sector tenders now use the RISE with SAP Validated Partner designation as a pre-qualification criterion. We do not hold it. Where a tender requires it, we are not eligible to bid alone and would need to bid with a partner who holds it.",
      },
      {
        type: "paragraph",
        text: "We would rather state that at the start of a pursuit than discover it at submission. If you are building a tender and the designation matters to you, ask every bidder for it in writing and check the answer against SAP's own partner directory.",
      },
      { type: "heading", text: "What we would ask you before quoting" },
      {
        type: "paragraph",
        text: "How much custom code is in scope, and how much of it is still executed. What your database position is today. Whether you have a date you are working to, and where that date came from. Whether in-country hosting is a requirement or a preference. And which of your interfaces have an owner who still works here.",
      },
      {
        type: "paragraph",
        text: "Those five answers move a RISE estimate more than any other input. If a partner quotes you without asking them, the number is a placeholder.",
      },
      { type: "link", text: "Our RISE and S/4HANA practice", href: "/services/rise-s4hana/" },
    ],
  },

  "coronavirus-lockdown-leads-to-more-gaming-and-e-sports": {
    blocks: [
      {
        type: "paragraph",
        text: "The esports and gaming part may end up being an unexpected champ as ~45 M or more Chinese are in lockdown to forestall the spread of the coronavirus. The Chinese are immense gamers and love their esports. As far as clients, China is the world’s biggest game spilling market, with roughly 4.9 occasions the month to month dynamic clients of the U.S. advertising in 2018.",
      },
      {
        type: "paragraph",
        text: "Being restricted to your home methods investing more energy and cash on the web, which may demonstrate a lift to the Chinese esports and gaming division in H1 2020. China coronavirus lockdown may help Chinese gaming and sports some key stocks and ETFs to profit by expanded gaming and esports in China include:",
      },
      {
        type: "paragraph",
        text: "Tencent – The China chief in esports game gushing, and the online gaming division. Tencent obtained Riot Games and now claims the exceptionally mainstream League of Legends game. Tencent possesses the number 2 positioned game gushing stage in China named DouYu. Doug basically centers around the live-gushing of games and had 159.2 MAUs in Q1 2019. Tencent likewise makes different pc and online mobile games.",
      },
      {
        type: "paragraph",
        text: "Huya – Huya is known as the “Jerk of China”, and is the number 1 positioned game gushing stage in China.",
      },
      {
        type: "paragraph",
        text: "Geek and ESPO – For those favoring an esports ETF, at that point NERD and ESPO are two of the best to consider. They do have more extensive worldwide esports and gaming introduction with NERD being progressively adjusted to esports.",
      },
      {
        type: "paragraph",
        text: "A report this week titled: “How an unmistakable B.C. privately-run company made the greatest e-sports gaming system in North America”, took a gander at the historical backdrop of Enthusiast Gaming and the Aquilinis family. Basically the story depicts the Aquilinis family inclusion in building a monster esports unadulterated play organization. What is astounding is the manner by which quick they have advanced but then they despite everything fly under most speculator’s radar.",
      },
      {
        type: "paragraph",
        text: "Lover Gaming Holdings Inc. is one of the quickest developing esports organizations internationally, and one of just a couple traded on an open market, unadulterated play esports and gaming organizations. Lover Gaming has the biggest gaming system in North America and the English talking gaming districts. The drawn-out vision for the Company is to construct the biggest, vertically coordinated esports and gaming organization on the planet. The Company arrives at more gamers than Twitch, IGN, Gamespot in the USA; and reaches more than 200 million gamers on a month to month premise, with 1 billion page views. Atari is opening its own gaming inns in eight US cities Atari is most popular for its games which started, harking back to the ’70s. In any case, presently the Company is reacting to the esports wonder. Atari plans to open their own chain of marked inns that will include spaces for computer-generated reality and enlarged reality, studios for online games , and settings for tossing esports occasions. What a splendid thought.",
      },
    ],
  },
  "future-where-technology-creates-good-jobs": {
    author: "Dr. Sanjeev Kumarr Dixit",
    authorRole: "CHRO – Mrs. Bectors Food Specialities Ltd. (Author – PLAN C)",
    blocks: [
      {
        type: "paragraph",
        text: "9th May 2022 is a day to remember and celebrate as a MBFSL team as together are taking a LEAP (Leveraging Effectiveness thru Automating Processes) by moving from manual way of working to online cloud based globally acclaimed Human Capital Management system – SAP SuccessFactors.",
      },
      {
        type: "paragraph",
        text: "All our self-information, employee master data, personal and professional details, organisation structures , leave management, joining and exit process formalities etc and entire GROW Performance Management system from GROW KRAs setting , Monthly Targets vs actuals review, Annual Performance Review comprising of Self-assessment, managers’ assessment, Reviewers appraisal and finally calibration by HR which will you will experience just through login id and password which will be part of all your onboarding training on the subject post LEAP going LIVE on 9th May.",
      },
      {
        type: "paragraph",
        text: "The entire week of 9th May till 14th May will be LEAP WEEK wherein our implementation partner team from In2IT will facilitate User Training to all of us besides sharing self-help user manuals for usage. All HR Team members and concerned Managers will support all of us to understand, use and leverage LEAP for self, team and organisation effectiveness, better efficiency, productivity, and WOW experience. At this juncture like to thank with lots of humility to each and every team member from HR team for putting their sincere hard work and compete dedicated time to complete the entire LEAP project in record time from end to end in 04 months which by all standard is a stretched target. Also, this feat won’t be possible without expert contribution and able project management by our implementation partner In2IT who also worked with HR team shoulder to shoulder to achieve the deadline. At this juncture like to thank with lots of humility to each and every team member from HR team for putting their sincere hard work and compete dedicated time to complete the entire LEAP project in record time from end to end in 04 months which by all standard is a stretched target. Also, this feat won’t be possible without expert contribution and able project management by our implementation partner In2IT who also worked with HR team shoulder to shoulder to achieve the deadline.",
      },
      {
        type: "paragraph",
        text: "There might be teething issue in the beginning like any new system but we together as a TEAM will ensure that we turn every opportunity into fresh and great learning experience",
      },
      {
        type: "paragraph",
        text: "ENJOY AND REAP THE BENEFITS OF LEAP",
        strong: true,
      },
    ],
  },
  "what-you-do-today-improve-your-tomorrows": {
    author: "Kunwar Krishna Menon",
    authorRole: "Country Sales Manager, In2IT Enterprise Business Services Pvt. Ltd.",
    authorDate: "April 18, 2022",
    blocks: [
      {
        type: "paragraph",
        text: "You’ve probably heard about CRMs but do you know what the benefits are for implementing one at your business?",
      },
      {
        type: "paragraph",
        text: "It’s fair to say that your customers are essential – after all, no business can exist if it has no customer base. Of course, how companies manage their customer database, therefore, has a major impact on their success.",
      },
      {
        type: "paragraph",
        text: "Customer relationships are key, and this is the primary reason why businesses now consider the adoption of a CRM – they wish to improve the consistency and quality of their customer relationships while building better customer loyalty.",
      },
      {
        type: "paragraph",
        text: "But how do CRM’s help companies to improve their customer relationships? Let’s take a closer look at some of the key benefits they offer.",
      },
      {
        type: "heading",
        text: "Understanding Customers Better",
      },
      {
        type: "paragraph",
        text: "CRMs keep all of your customer information in a single location. This makes access to the data a breeze, thus giving sales, customer service and marketing teams the competitive edge. They won’t just know the name, address, email, phone number, and social media connections for each contact, but they’ll also know their position within their company, how they connect with other contacts within the dataset, when their birthday is, and which languages they speak.",
      },
      {
        type: "paragraph",
        text: "With all of that data in easy reach, it’s a breeze to personalise communications.",
      },
      {
        type: "heading",
        text: "Improved Segmentation",
      },
      {
        type: "paragraph",
        text: "A CRM allows your business to segment contacts into separate target audiences. It breaks data down by criteria and categories to create highly focused lists. This allows specific campaigns to be run for specific segments of your audience. It also allows sales processes and lead pools to be analysed effectively.",
      },
      {
        type: "heading",
        text: "Retaining More Customers",
      },
      {
        type: "paragraph",
        text: "A CRM helps to keep existing customers satisfied by prompting regular contact with customers. It also orchestrates effective marketing activities such as sending email campaigns, after-purchase surveys, and free trial offers at the best times.",
      },
      {
        type: "heading",
        text: "Anticipating Needs",
      },
      {
        type: "paragraph",
        text: "A CRM allows you to track each customer’s buying habits so you can present them with the best offers for them at the perfect moment. It also allows timely customer service interaction, for example if the customer has experienced an issue or made a complaint.",
      },
      {
        type: "heading",
        text: "Faster Communication",
      },
      {
        type: "paragraph",
        text: "CRM systems offer a set of ready to use, customisable letters, email templates, documents, quotes, proposals, newsletters and invitations to speed up communications.",
      },
      {
        type: "heading",
        text: "Better Data Privacy",
      },
      {
        type: "paragraph",
        text: "The recent GDPR requirements have meant that CRM systems come with inbuilt functionality in this regard. This saves a huge job for businesses, since GDPR compliancy can be a time-consuming and stressful task that has major legal consequences if you fall foul of the law.",
      },
      {
        type: "heading",
        text: "CRM Systems Are An Ideal Solution For Businesses",
      },
      {
        type: "paragraph",
        text: "In this modern age, all businesses can benefit from having a CRM system in place. Not only can it improve productivity and efficiency in their workplace, but it can also help to maximise the impact of marketing campaigns and help to retain the maximum number of customers.",
      },
      {
        type: "paragraph",
        text: "With so many benefits to offer, it’s certainly time to consider implemented one at your business and harnessing its full potential.",
      },
    ],
  },
  "attract-and-retain-quality-high-paying-customers": {
    author: "Sridhar Ayalam",
    authorRole: "SAP Delivery Head, In2IT Enterprise Business Services Pvt. Ltd.",
    authorDate: "April 05, 2022",
    blocks: [
      {
        type: "paragraph",
        text: "Enterprise Resource Planning (or ERP) software has revolutionised the ways in which companies work in the modern world. Efficiency and speed are now paramount in today’s highly competitive marketplace, and this is where ERP software can really help, since it allows for ongoing tasks and projects to be managed in a timely manner, thus streamlining the routine business of daily work and exponentially boosting productivity and profitability.",
      },
      {
        type: "paragraph",
        text: "There are five key business inefficiencies that ERP software can tackle easily and we’ll take a look at them below.",
      },
      {
        type: "heading",
        text: "Inaccurate Manually Entered Data",
      },
      {
        type: "paragraph",
        text: "Most people will agree that one of the most tedious and time-consuming tasks in any organisation is entering data manually. Being such a repetitive and dull job, it can cause humans to become distracted and make mistakes. It’s no wonder, then, that human error is common in this area. ERP software cannot just save time but also slash costs when it comes to data entry, and it also provides highly precise and accurate results.",
      },
      {
        type: "heading",
        text: "Inefficient Communications",
      },
      {
        type: "paragraph",
        text: "Many businesses have several departments, but if there is a lack of communication between those departments, tasks often take longer to finish and productivity is low. ERP software significantly reduces this problem while also minimising the communication gap with freelancers and vendors via vendor management software.",
      },
      {
        type: "heading",
        text: "No Interconnected Data",
      },
      {
        type: "paragraph",
        text: "When companies have multiple departments, they run the risk of working with no interconnected data – something that can prove costly in terms of bad debts, wasted inventory and lost customers. ERP software helps companies to interconnect their data in real time to boost productivity and efficiency.",
      },
      {
        type: "heading",
        text: "Poor Customer Service",
      },
      {
        type: "paragraph",
        text: "Companies can earn a poor reputation if their customer service is substandard. If the sales of a product are greater than the speed at which that product is replenished, sales departments often lack the knowledge of when it will be restocked.",
      },
      {
        type: "paragraph",
        text: "Being unable to tell customers a precise delivery date can cause dissatisfaction and, eventually, attrition of customers to rival businesses. ERP software boasts helpful functions like sales order management and inventory management software that can make operations run more smoothly.",
      },
      {
        type: "heading",
        text: "No Consolidated Data",
      },
      {
        type: "paragraph",
        text: "In a multi-department organisation, data can vary between them. Should the data not be consolidated and stored in a single location, it takes managers more time to go through every document and spreadsheet to find the information they need. ERP software keeps all of the data in a single spot so it can be accessed with ease. It also ensures more accurate results with minimal effort.",
      },
      {
        type: "heading",
        text: "The Benefits Of ERP Software",
      },
      {
        type: "paragraph",
        text: "The above five business inefficiencies can all easily be identified and resolved by implementing ERP software. This effective solution can make organisations run much more smoothly and in a streamlined way that increases productivity and profitability. It’s easy to see, therefore, why ERP software is such an excellent solution to improving the efficiency of companies across the board and to eliminating many of the issues that cause businesses to be inefficient.",
      },
    ],
  },
  "solutions-for-all-small-and-large-business": {
    author: "Gangadhar Panda",
    authorDate: "April 07, 2022",
    blocks: [
      {
        type: "paragraph",
        text: "Finding ways to automate sales is one of the top priorities of many companies. After all, it’s a solution that can make the business more profitable through more efficient streamlining of operations. The top answer to automating sales today is to use a CRM, but this, in itself, can cause some problems for business leaders who lack expertise and knowledge in the field.",
      },
      {
        type: "paragraph",
        text: "With this in mind, it’s clear that finding the CRM that is best for automating your sales isn’t always an easy task. You need to do your research well so that you can make a well-informed decision. Here, we take a closer look at what you need to consider when it comes to finding the most efficient and effective DRM for your sales automation.",
      },
      {
        type: "heading",
        text: "1. Understand The Requirements Of Your Business",
      },
      {
        type: "paragraph",
        text: "The requirements of your business dictate the type of CRM you’re going to need. Consider the difficulties your business is facing. Are you:",
      },
      {
        type: "listItem",
        text: "Struggling to find customer data?",
      },
      {
        type: "listItem",
        text: "Finding communicating with clients difficult?",
      },
      {
        type: "listItem",
        text: "Finding it hard to create new customers or retain loyal ones?",
      },
      {
        type: "listItem",
        text: "Having difficulty in managing schedules?",
      },
      {
        type: "paragraph",
        text: "These are just some of the areas that you need to weigh up so you can choose the right CR.",
      },
      {
        type: "heading",
        text: "2. Know The Different Kinds Of CRM",
      },
      {
        type: "paragraph",
        text: "There is no such thing as a one-size-fits-all type of CRM. You need to be aware of the differences between operational CRMs, analytical CRMs, and collaborative CRMs. This will help you pinpoint the best choice.",
      },
      {
        type: "heading",
        text: "3. Look At The Features",
      },
      {
        type: "paragraph",
        text: "Some features to consider when choosing the right CRM for your business include:",
      },
      {
        type: "listItem",
        text: "Its main functionality",
      },
      {
        type: "listItem",
        text: "Its collaboration features",
      },
      {
        type: "listItem",
        text: "How customisable it is",
      },
      {
        type: "listItem",
        text: "How easy it is to use and integrate into existing systems",
      },
      {
        type: "listItem",
        text: "How secure it is",
      },
      {
        type: "listItem",
        text: "How much support is available",
      },
      {
        type: "paragraph",
        text: "Look for the following capabilities in any software you choose:",
      },
      {
        type: "listItem",
        text: "Lead management",
      },
      {
        type: "listItem",
        text: "Contact management",
      },
      {
        type: "listItem",
        text: "Automation",
      },
      {
        type: "listItem",
        text: "Campaign management",
      },
      {
        type: "listItem",
        text: "Email tracking",
      },
      {
        type: "listItem",
        text: "Social media management",
      },
      {
        type: "listItem",
        text: "Dashboards and reports",
      },
      {
        type: "listItem",
        text: "Mobile apps",
      },
      {
        type: "heading",
        text: "4. Consider Costs",
      },
      {
        type: "paragraph",
        text: "It’s important to choose a CRM that fits into your business’s budget. There are free solutions available if necessary.",
      },
      {
        type: "heading",
        text: "5. Choose A Reliable Vendor",
      },
      {
        type: "paragraph",
        text: "Make sure you only use a CRM that comes from a reputable vendor that has good customer support and a solid reputation.",
      },
      {
        type: "heading",
        text: "Choose A CRM Which Is Right For You",
      },
      {
        type: "paragraph",
        text: "At the end of the day, there’s no such thing as one “best” CRM. Each business will have its own needs and requirements. Therefore, the best CRM for one company will be completely different from that required by another.",
      },
      {
        type: "paragraph",
        text: "If you consider the points that we’ve addressed here carefully, you should have the information that you need to carry out the necessary research into which CRM software to select. As long as you spend sufficient time considering the essential requirements of your business and the needs that you require your CRM software to address, you will be able to select a product that is perfect for your company’s purposes and that will help to improve the productivity, efficiency, and profitability of your organisation.",
      },
    ],
  },
  "live-stream-from-awwwards-showcasing-trends": {
    author: "Sudhansu Sekhar Mishra",
    authorRole: "AGM IT Application, In2IT Enterprise Business Services Pvt. Ltd.",
    authorDate: "March 29, 2022",
    blocks: [
      {
        type: "paragraph",
        text: "Hubspot’s 2022 Hybrid Work Report focused on the ways in which the world worked during 2021 as well as what is likely to lie ahead in the future. So, what did it say? Here, we take a closer look at its contents and what they reveal.",
      },
      {
        type: "heading",
        text: "The COVID Chaos",
      },
      {
        type: "paragraph",
        text: "The COVID-19 pandemic has certainly had an unimaginably powerful effect on society during the last two years. Now that 2022 has arrived, and a “new normal” appears to be on the horizon, it’s time to consider the impact that the global crisis has had on our working lives.",
      },
      {
        type: "paragraph",
        text: "One key change that arose during the pandemic was the need for remote and home working due to the voluntary and imposed lockdowns around the globe. Therefore, what did the HubSpot survey of four thousand full-time flex, in-office, and remote workers from across the US, UK, Germany, Ireland, France, Japan, Australia, and Canada reveal about culture, collaboration, communication, management, and mental health?",
      },
      {
        type: "heading",
        text: "Better Flexibility",
      },
      {
        type: "paragraph",
        text: "Interestingly, a key feature of the report was the note that employees had enjoyed having the opportunity of working both onsite in the office and remotely. This has, in turn, led to numerous companies considering the possibility of embracing and adopting the hybrid work model.",
      },
      {
        type: "paragraph",
        text: "The report suggested that hybrid working will be around for some time to come, and in 2022, the priority will be to future-proof that work model.",
      },
      {
        type: "heading",
        text: "Collaboration And Communication Present More Challenges",
      },
      {
        type: "paragraph",
        text: "When companies have hybrid workforces, collaboration and communication becomes more challenging. Almost half of all remote workers surveyed reported that they missed in-person, spontaneous connections with other colleagues.",
      },
      {
        type: "paragraph",
        text: "Almost 60% of workers still onsite found that connecting with their teams and staying motivated with the main challenges when it came to transitioning to in-office work from working from home. Meanwhile 61% of flexible workers agreed that they had an effective working relationship with their team within their hybrid environment.",
      },
      {
        type: "paragraph",
        text: "It was perhaps telling that almost 40% of respondents said they’d prefer to go to the dentist every month than go to the office five days each week!",
      },
      {
        type: "heading",
        text: "Employee Experience Helps Culture Thrive",
      },
      {
        type: "paragraph",
        text: "A fifth of flexible workers saw differences between the remote and in-office employee experience as one 20% of flex workers see differences in the in-office and remote employee experience as an obstacle to success.",
      },
      {
        type: "paragraph",
        text: "Meanwhile 60% of people ranked a better work/life balance as their top aspect of their company’s culture. Almost half of all survey respondents said they’d rather have an extra day off during the week than an increased salary, while 31% believed opportunities to supply anonymous feedback would make them feel more included and supported in the workplace.",
      },
      {
        type: "heading",
        text: "Better Communication For Better Long-Term Productivity",
      },
      {
        type: "paragraph",
        text: "In the report, 34% of flexible workers said they actively went to the office in order to communicate more effectively with their colleagues, but 72% of respondents said that too many meetings and calls in the workplace disrupted their concentration.",
      },
      {
        type: "heading",
        text: "Holistic Approaches to Mental Health",
      },
      {
        type: "paragraph",
        text: "In the last year, 40% of respondents said they’d had a better work/life balance, but nevertheless, almost 60% said that they found it hard to set the right boundaries between their work and personal lives. Caregivers and parents especially agreed that they felt under pressure to be “permanently on” in working hours, regardless of their home situations.",
      },
      {
        type: "heading",
        text: "Better Resources For Team Support",
      },
      {
        type: "paragraph",
        text: "Management appeared to be problematic, with almost 30% of flexible workers finding that managing remote workers was their toughest challenge when working with hybrid teams. Meanwhile almost half of all managers reported breakdowns in communication as their top concern. Fortunately, though, 60% of them believed they had the correct tools to manage effectively even in the hybrid working environment.",
      },
    ],
  },
};
