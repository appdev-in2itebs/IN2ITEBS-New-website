// 301/308 redirect map: legacy in2itebs.com URLs -> three-pillar IA.
// Imported by next.config.mjs. Destinations point at the FINAL new-IA target
// (no redirect chains). Lorem/demo pages -> home.

const p = (source, destination) => ({ source, destination, permanent: true });

export const redirects = [
  // --- Retired v1 hubs -> new pillar IA ---
  p("/application-development-managed-services", "/services/application-engineering/"),

  // --- SAP cluster -> SAP deep-dive sub-pages ---
  p("/sap-rise-with-sap", "/services/rise-s4hana/"),
  // /sap-concur/ is the *partner* page on the existing site; /sap-concur-2/ is the service page.
  p("/sap-concur", "/about/partnerships/"),
  p("/sap-concur-2", "/services/sap/"),
  p("/sap-sac", "/services/data-engineering-analytics/"),
  p("/sap-qualtrics", "/about/partnerships/"),
  p("/simplifytalent", "/services/successfactors/"),
  p("/simplifyhiring", "/services/successfactors/"),
  // ECC Prism retained at /ecc-prism/

  // --- ADMS / app engineering ---
  p("/application-development-maintenance-services-adms", "/services/application-engineering/"),
  p("/application-development-maintenance-services-adms-2", "/services/application-engineering/"),
  p("/development-maintenance", "/services/application-engineering/"),
  p("/application-maintenance-support", "/services/managed-services/"),
  p("/agile-devops", "/services/application-engineering/"),
  p("/agile-devops-2", "/services/application-engineering/"),

  // --- Digital services -> Digital, Data & AI ---
  p("/digital-services", "/services/digital-data-ai/"),
  p("/digital-transformation-services", "/services/advisory/"),
  p("/other-enterprise-solutions", "/services/enterprise-platforms/"),

  // --- Cloud / infra / security (no dedicated page) -> nearest tech home ---
  p("/cloud-strategy", "/services/advisory/"),
  p("/cloud-migration", "/services/rise-s4hana/"),
  p("/cloud-migration-2", "/services/rise-s4hana/"),
  p("/cloud-hosting-services", "/services/managed-services/"),
  p("/cloud-and-infra-security", "/services/advisory/"),
  // The existing site's "Cloud Infrastructure Services" heading links to this slug (a Cloud Services page).
  p("/security-and-risk-advisory", "/services/advisory/"),
  p("/identity-and-access-management", "/services/advisory/"),

  // --- Future platforms (Oracle / Microsoft) -> Platform Services ---
  // -2 slugs are the existing site's *partner* pages; -3 and the bare slug are its service pages.
  p("/microsoft-2", "/about/partnerships/"),
  p("/ms-office-365", "/services/enterprise-platforms/"),
  p("/microsoft-dynamics-365", "/services/enterprise-platforms/"),

  // --- Data / AI / automation -> Digital, Data & AI ---
  p("/data-analytics-ai", "/services/data-engineering-analytics/"),
  p("/data-analytics-ai-2", "/services/data-engineering-analytics/"),
  p("/database-data-management", "/services/enterprise-data-management/"),
  p("/database-data-management-2", "/services/enterprise-data-management/"),
  p("/ai-machine-learning", "/services/applied-ai/"),
  p("/ai-machine-learning-2", "/services/applied-ai/"),
  p("/big-data", "/services/data-engineering-analytics/"),
  p("/big-data-2", "/services/data-engineering-analytics/"),
  p("/blockchain", "/services/digital-data-ai/"),
  p("/robotic-process-automation", "/services/applied-ai/"),

  // --- Industries ---
  p("/fmcg", "/industries/consumer-goods-distribution/"),
  p("/fmcg-2", "/industries/consumer-goods-distribution/"),
  p("/heavy-engineering", "/industries/manufacturing/"),
  p("/textiles", "/industries/manufacturing/"),
  p("/retail-ecommerce", "/industries/consumer-goods-distribution/"),
  p("/retail-ecommerce-2", "/industries/consumer-goods-distribution/"),
  p("/professional-services", "/industries/technology-digital-natives/"),
  p("/chemical-fertilizers", "/industries/manufacturing/"),
  p("/chemical-fertilizers-2", "/industries/manufacturing/"),
  p("/energy-and-utilities", "/industries/power-utilities/"),
  p("/healthcare-life-science", "/industries/pharma-healthcare-life-sciences/"),
  p("/engineering-constructions-ecno", "/industries/manufacturing/"),

  // --- Partners ---
  p("/hp-2", "/about/partnerships/"),
  p("/aws-2", "/about/partnerships/"),

  // --- About / people ---
  p("/who-we-are", "/about/who-we-are/"),
  p("/our-leadership", "/about/our-leadership/"),

  // --- Customer stories / case studies ---
  p("/ibg-goes-live-with-sap-successfactors", "/case-studies/"),
  p("/wework-rise-with-sap-s4hana", "/case-studies/"),
  p("/sharechat-rise-with-sap-s4hana", "/case-studies/"),

  // --- Lead funnel / news ---
  p("/expert-advice", "/contact/"),

  // --- Region / city pages -> home ---
  p("/in2it-melbourne", "/"),

  // --- Legal ---
  p("/privacy-notice", "/legal/privacy-notice/"),
  p("/privacy-policy", "/legal/privacy-policy/"),
  p("/privacy-policy-2", "/legal/privacy-policy/"),
  p("/disclaimer", "/legal/disclaimer/"),

  // --- Lorem / demo ---
  p("/slide-anything-popup-preview", "/"),
  p("/event-2024", "/insights/"),

  // --- Legacy blog posts with exact new equivalents (audit H4, 2026-09-08) ---
  p(
    "/how-rise-with-sap-s-4hana-cloud-can-transform-your-business",
    "/insights/how-rise-with-sap-s-4hana-cloud-can-transform-your-business/",
  ),
  p(
    "/revolutionizing-hr-with-sap-successfactors-a-strategic-approach-to-modern-hcm-solutions",
    "/insights/revolutionizing-hr-with-sap-successfactors-a-strategic-approach-to-modern-hcm-solutions/",
  ),
  p(
    "/igniting-organizational-potential-sap-successfactors-ai-innovations-revealed-at-sap-successconnect-las-vegas",
    "/insights/igniting-organizational-potential-sap-successfactors-ai-innovations-revealed-at-sap-successconnect-las-vegas/",
  ),
  p("/grow-with-sap", "/insights/grow-with-sap/"),
  p("/sap-grow-fast", "/services/converged-pulse/"),
  p("/grow-with-sap-leadership-forum-event", "/services/rise-s4hana/"),
  // --- SuccessFactors local landing pages and campaigns ---
  p("/in2it-ebs-simplify-hiring", "/insights/in2it-ebs-simplify-hiring/"),
  p("/in2it-ebs-simplify-talent-2", "/insights/in2it-ebs-simplify-talent-2/"),
  p("/sap-successfactors-partner-in-delhi", "/services/successfactors/"),
  p("/unlock-the-power-of-hr-technology-transformation", "/services/successfactors/"),
  p("/unlock-the-power-of-hr-technology-transformation-register-now", "/services/successfactors/"),
  p("/unlock-the-power-of-hr-technology-transformation-register-now1", "/services/successfactors/"),
  // --- Careers, FAQ, leadership profiles, news archive ---
  p("/our-culture", "/careers/our-culture/"),
  p("/faq", "/contact/"),
  p("/news/page/2", "/insights/"),
  p("/global-webinar", "/insights/"),
  // ════════════════════════════════════════════════════════════════════════
  // RESTRUCTURE, NOVEMBER 2026 — flat service URLs, three pillars, nine industries.
  //
  // Ordered by the clicks each source earned in Search Console over the twelve months to
  // 11 November 2026, so the pages that carry real traffic are the ones reviewed first.
  // Every destination is the FINAL target: no chains.
  // ════════════════════════════════════════════════════════════════════════

  // --- Corporate pages with measured traffic ---
  p("/out-leadership", "/about/our-leadership/"), // 109 clicks — a typo slug that ranks; keep it alive
  p("/india", "/about/markets/"), // 114 clicks
  p("/in2it-india", "/about/markets/"),
  p("/home-southafrica", "/about/markets/"),
  p("/home-kenya", "/about/markets/"),
  p("/south-africa", "/about/markets/"),
  p("/kenya", "/about/markets/"),
  p("/in2it-dubai", "/about/markets/"),
  p("/in2it-singapore", "/about/markets/"),
  p("/in2it-malaysia", "/about/markets/"),
  p("/in2it-bangkok", "/about/markets/"),
  p("/in2it-manila", "/about/markets/"),
  p("/accreditation-awards", "/about/credentials/"),
  // The /partners/ hub and its ten partner pages became one page. The wildcard catches every
  // partner slug, including any the old site had that this repo never ported.
  p("/partners", "/about/partnerships/"),
  p("/partners/:slug*", "/about/partnerships/"),
  p("/jobs", "/careers/current-openings/"),
  p("/sap-and-success-factor-consultant", "/careers/current-openings/"), // a job posting slug, not a service page
  p("/join-our-team", "/careers/current-openings/"),
  p("/apply-now", "/careers/current-openings/"),
  p("/news", "/insights/"),
  p("/welspun", "/case-studies/welspun-group/"),
  p("/about/customer-stories", "/case-studies/"),
  p("/about/customer-stories/welspun", "/case-studies/welspun-group/"),
  p("/about/customer-stories/:path*", "/case-studies/"),

  // --- Leadership profile pages: one destination, not nine dead ends ---
  p("/abhijit-shukla", "/about/our-leadership/"),
  p("/rajat-kapoor", "/about/our-leadership/"),
  p("/anil-kumar-soleti", "/about/our-leadership/"),
  p("/dharmendra-sharma", "/about/our-leadership/"),

  // --- The parallel /sap-enterprise-solutions/ tree collapses into /services/sap/ ---
  p("/sap-enterprise-solutions", "/services/sap/"),
  p("/sap-enterprise-solutions/rise-with-sap", "/services/rise-s4hana/"),
  p("/sap-enterprise-solutions/migrations", "/services/rise-s4hana/"),
  p("/sap-enterprise-solutions/grow-fast", "/services/converged-pulse/"),
  p("/sap-enterprise-solutions/successfactors", "/services/successfactors/"),
  p("/sap-enterprise-solutions/rise-vs-grow", "/services/rise-s4hana/"),
  p("/sap-enterprise-solutions/health-check-360", "/services/application-estate-review/"),
  p("/sap-enterprise-solutions/syniti", "/services/enterprise-data-management/"),
  p("/sap-enterprise-solutions/analytics-cloud", "/services/data-engineering-analytics/"),
  p("/sap-enterprise-solutions/joule", "/services/applied-ai/"),
  p("/sap-enterprise-solutions/clean-core", "/services/sap/"),
  p("/sap-enterprise-solutions/abap-factory", "/services/sap/"),
  p("/sap-enterprise-solutions/concur", "/services/sap/"),
  p("/sap-enterprise-solutions/ariba", "/services/sap/"),

  // --- Legacy SAP landing pages, including the city-targeted SuccessFactors set ---
  p("/sap", "/services/sap/"),
  p("/sap-success-factors", "/services/successfactors/"),
  p("/sap-success-factors-in-bangalore", "/services/successfactors/"),
  p("/sap-success-factors-in-hyderabad", "/services/successfactors/"),
  p("/sap-success-factors-in-bhubaneswar", "/services/successfactors/"),
  p("/sap-successfactors-partner-in-india", "/services/successfactors/"),
  p("/sap-successfactors-partner-in-chennai", "/services/successfactors/"),
  p("/sap-successfactors-partner-in-mumbai", "/services/successfactors/"),
  p("/sap-successfactors-partner-in-kolkata", "/services/successfactors/"),

  // --- Hand-built pillar routes replaced by /services/<slug>/ ---
  p("/platform-services", "/services/enterprise-platforms/"),
  p("/platform-services/other-enterprise-solutions", "/services/enterprise-platforms/"),
  p("/advisory", "/services/advisory/"),
  p("/digital-data-ai", "/services/digital-data-ai/"),
  p("/digital-data-ai/application-engineering", "/services/application-engineering/"),
  p("/digital-data-ai/ai-automation", "/services/applied-ai/"),
  p("/ecc-prism", "/services/ecc-prism/"),
  p("/salesforce", "/services/salesforce/"),
  p("/workday", "/services/workday/"),
  p("/what-we-do", "/services/"),
  p("/delivery-excellence", "/services/"),
  p("/why-in2it-ebs", "/about/who-we-are/"),

  // --- Platforms we hold no designation from. The pillar hub says so in plain words. ---
  p("/oracle", "/services/enterprise-platforms/"),
  p("/oracle-2", "/services/enterprise-platforms/"),
  p("/oracle-3", "/services/enterprise-platforms/"),
  p("/oracle-netsuite-2", "/services/enterprise-platforms/"),
  p("/microsoft", "/services/enterprise-platforms/"),
  p("/ibm", "/about/partnerships/"),
  p("/newgen-2", "/about/partnerships/"),
  p("/open-text-2", "/about/partnerships/"),

  // --- Legacy industry slugs -> the nine that have proof behind them ---
  p("/automobiles", "/industries/manufacturing/"),
  p("/textiles-2", "/industries/manufacturing/"),
  p("/heavy-engineering-2", "/industries/manufacturing/"),
  p("/engineering-constructions-ecno-2", "/industries/manufacturing/"),
  p("/manufacturing", "/industries/manufacturing/"),
  p("/healthcare-life-science-2", "/industries/pharma-healthcare-life-sciences/"),
  p("/banking", "/industries/banking-financial-services/"),
  p("/government", "/industries/government-public-sector/"),
  p("/telecom", "/industries/technology-digital-natives/"),
  p("/professional-services-2", "/industries/technology-digital-natives/"),

  // --- Retired standalone service pages -> the page that now covers the work ---
  p("/cyber-security-services", "/services/advisory/"),
  p("/cyber-security-services-2", "/services/advisory/"),
  p("/security-and-risk-advisory-2", "/services/advisory/"),
  p("/identity-and-access-management-2", "/services/advisory/"),
  p("/cloud-strategy-2", "/services/advisory/"),
  p("/robotic-process-automation-2", "/services/applied-ai/"),
  p("/predictive-analysis", "/services/applied-ai/"),
  p("/customer-stories", "/case-studies/"),
  p("/events-celebrations-3", "/careers/events-celebrations/"),

  // ════════════════════════════════════════════════════════════════════════
  //  THE DEPLOYED APP'S OWN URLS, 12 November 2026
  //
  //  The block above catches the legacy WordPress URLs. These are different: they are URLs the
  //  REBUILT app has already been serving, which the flat-URL restructure retires. They are in
  //  the deployed sitemap, so they have been offered to Google, and they must not 404.
  //
  //  Two slugs survive the restructure unchanged and are deliberately absent from this list:
  //  /services/ecc-prism/ and /industries/manufacturing/.
  // ════════════════════════════════════════════════════════════════════════

  // --- Fourteen industry pages become nine ---
  p("/industries/automobiles", "/industries/manufacturing/"),
  p("/industries/banking", "/industries/banking-financial-services/"),
  p("/industries/chemical-fertilizers", "/industries/manufacturing/"),
  p("/industries/energy-and-utilities", "/industries/power-utilities/"),
  p("/industries/engineering-constructions-ecno", "/industries/real-estate-infrastructure/"),
  p("/industries/fmcg", "/industries/consumer-goods-distribution/"),
  p("/industries/government", "/industries/government-public-sector/"),
  p("/industries/healthcare-life-science", "/industries/pharma-healthcare-life-sciences/"),
  p("/industries/heavy-engineering", "/industries/metals-mining-steel/"),
  p("/industries/professional-services", "/industries/technology-digital-natives/"),
  p("/industries/retail-ecommerce", "/industries/consumer-goods-distribution/"),
  // The live telecom page describes metals and mining, so it goes where its content belongs.
  p("/industries/telecom", "/industries/technology-digital-natives/"),
  p("/industries/textiles", "/industries/consumer-goods-distribution/"),
  // The slugs the live site serves on 20 Nov 2026 (its own sitemap); same targets as the names above.
  p("/industries/bfsi", "/industries/banking-financial-services/"),
  p("/industries/chemicals-fertilizers", "/industries/manufacturing/"),
  p("/industries/energy-utilities", "/industries/power-utilities/"),
  p("/industries/engineering-construction", "/industries/real-estate-infrastructure/"),
  p("/industries/government-psu", "/industries/government-public-sector/"),
  p("/industries/healthcare-life-sciences", "/industries/pharma-healthcare-life-sciences/"),
  p("/industries/media-telecom", "/industries/technology-digital-natives/"),
  p("/industries/metals-mining", "/industries/metals-mining-steel/"),
  p("/industries/real-estate", "/industries/real-estate-infrastructure/"),
  p("/industries/textiles-apparel", "/industries/consumer-goods-distribution/"),

  // --- The parallel /services/ tree collapses onto the three pillars ---
  p("/services/sap-enterprise-solutions", "/services/sap/"),
  p("/services/sap-concur", "/services/sap/"),
  p("/services/sap-successfactors", "/services/successfactors/"),
  p("/services/cloud-hcm-solution", "/services/successfactors/"),
  p("/services/sap-grow-fast", "/services/converged-pulse/"),
  // Renamed 18 Nov 2026 — SAP ships a product called SAP GROW Fast. See content/legacy-services.ts.
  p("/services/grow-fast", "/services/converged-pulse/"),
  // Renamed again 18 Nov 2026 to the name SAP has qualified. See content/legacy-services.ts.
  p("/services/fixed-start", "/services/converged-pulse/"),
  p("/services/rise-with-sap", "/services/rise-s4hana/"),
  p("/services/cloud-migration", "/services/rise-s4hana/"),
  p("/services/other-enterprise-solutions", "/services/enterprise-platforms/"),
  p("/services/microsoft", "/services/enterprise-platforms/"),
  p("/services/microsoft-dynamics-365", "/services/enterprise-platforms/"),
  p("/services/ms-office-365", "/services/enterprise-platforms/"),
  p("/services/oracle", "/services/enterprise-platforms/"),

  // Application work, however it was labelled
  p("/services/application-development-maintenance-services-adms", "/services/application-engineering/"),
  p("/services/development-maintenance", "/services/application-engineering/"),
  p("/services/agile-devops", "/services/application-engineering/"),
  p("/services/digital-services", "/services/digital-data-ai/"),
  p("/services/blockchain", "/services/digital-data-ai/"),

  // Data and AI
  p("/services/data-analytics-ai", "/services/data-engineering-analytics/"),
  p("/services/analytics", "/services/data-engineering-analytics/"),
  p("/services/big-data", "/services/data-engineering-analytics/"),
  p("/services/predictive-analysis", "/services/data-engineering-analytics/"),
  p("/services/sap-sac", "/services/data-engineering-analytics/"),
  p("/services/database-data-management", "/services/enterprise-data-management/"),
  p("/services/ai-machine-learning", "/services/applied-ai/"),
  p("/services/robotic-process-automation", "/services/applied-ai/"),

  // Run, and the infrastructure-shaped pages. The published boundary is that infrastructure
  // appears as managed operations, never as hosting or hardware resale, so they land on
  // Managed Services rather than getting pages of their own back.
  p("/services/application-maintenance-support", "/services/managed-services/"),
  p("/services/cloud-infrastructure-services", "/services/managed-services/"),
  p("/services/cloud-hosting-services", "/services/managed-services/"),
  p("/services/cloud-and-infra-security", "/services/managed-services/"),
  p("/services/identity-and-access-management", "/services/managed-services/"),
  p("/services/cyber-security-enterprise-risk", "/services/managed-services/"),

  // Advisory
  p("/services/cloud-strategy", "/services/advisory/"),
  p("/services/digital-transformation-services", "/services/advisory/"),
  p("/services/security-and-risk-advisory", "/services/advisory/"),
];

/** WordPress theme-demo URLs that never held In2IT content: served as HTTP 410 via a rewrite to /api/gone/. */
export const goneSources = [
  "/attract-and-retain-quality-high-paying-customers",
  "/coronavirus-lockdown-leads-to-more-gaming-and-e-sports",
  "/future-where-technology-creates-good-jobs",
  "/live-stream-from-awwwards-showcasing-trends",
  "/solutions-for-all-small-and-large-business",
  "/what-you-do-today-improve-your-tomorrows",
  "/case",
  "/case/:path*",
  "/event",
  "/event/:path*",
];
