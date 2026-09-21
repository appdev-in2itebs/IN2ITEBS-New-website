// 301/308 redirect map: legacy in2itebs.com URLs -> three-pillar IA.
// Imported by next.config.mjs. Destinations point at the FINAL new-IA target
// (no redirect chains). Lorem/demo pages -> home.

const p = (source, destination) => ({ source, destination, permanent: true });

export const redirects = [
  // --- Retired v1 hubs -> new pillar IA ---
  p("/application-development-managed-services", "/digital-data-ai/application-engineering/"),

  // --- SAP cluster -> SAP deep-dive sub-pages ---
  p("/sap-rise-with-sap", "/services/rise-with-sap/"),
  p("/sap-success-factors", "/services/sap-successfactors/"),
  // /sap-concur/ is the *partner* page on the existing site; /sap-concur-2/ is the service page.
  p("/sap-concur", "/partners/sap-concur/"),
  p("/sap-concur-2", "/services/sap-concur/"),
  p("/sap-sac", "/services/sap-sac/"),
  p("/sap-qualtrics", "/partners/sap-qualtrics/"),
  p("/simplifytalent", "/sap-enterprise-solutions/successfactors/"),
  p("/simplifyhiring", "/sap-enterprise-solutions/successfactors/"),
  // ECC Prism retained at /ecc-prism/

  // --- ADMS / app engineering ---
  p(
    "/application-development-maintenance-services-adms",
    "/services/application-development-maintenance-services-adms/",
  ),
  p(
    "/application-development-maintenance-services-adms-2",
    "/services/application-development-maintenance-services-adms/",
  ),
  p("/development-maintenance", "/services/development-maintenance/"),
  p("/application-maintenance-support", "/services/application-maintenance-support/"),
  p("/agile-devops", "/services/agile-devops/"),
  p("/agile-devops-2", "/services/agile-devops/"),

  // --- Digital services -> Digital, Data & AI ---
  p("/digital-services", "/services/digital-services/"),
  p("/digital-transformation-services", "/services/digital-transformation-services/"),
  p("/other-enterprise-solutions", "/services/other-enterprise-solutions/"),

  // --- Cloud / infra / security (no dedicated page) -> nearest tech home ---
  p("/cloud-strategy", "/services/cloud-strategy/"),
  p("/cloud-strategy-2", "/services/cloud-strategy/"),
  p("/cloud-migration", "/services/cloud-migration/"),
  p("/cloud-migration-2", "/services/cloud-migration/"),
  p("/cloud-hosting-services", "/services/cloud-hosting-services/"),
  p("/cloud-and-infra-security", "/services/cloud-and-infra-security/"),
  p("/cyber-security-services", "/services/cyber-security-enterprise-risk/"),
  // The existing site's "Cloud Infrastructure Services" heading links to this slug (a Cloud Services page).
  p("/cyber-security-services-2", "/services/cloud-infrastructure-services/"),
  p("/security-and-risk-advisory", "/services/security-and-risk-advisory/"),
  p("/security-and-risk-advisory-2", "/services/security-and-risk-advisory/"),
  p("/identity-and-access-management", "/services/identity-and-access-management/"),
  p("/identity-and-access-management-2", "/services/identity-and-access-management/"),

  // --- Future platforms (Oracle / Microsoft) -> Platform Services ---
  // -2 slugs are the existing site's *partner* pages; -3 and the bare slug are its service pages.
  p("/oracle-2", "/partners/oracle/"),
  p("/oracle-3", "/services/oracle/"),
  p("/microsoft-2", "/partners/microsoft/"),
  p("/ms-office-365", "/services/ms-office-365/"),
  p("/microsoft-dynamics-365", "/services/microsoft-dynamics-365/"),

  // --- Data / AI / automation -> Digital, Data & AI ---
  p("/data-analytics-ai", "/services/data-analytics-ai/"),
  p("/data-analytics-ai-2", "/services/data-analytics-ai/"),
  p("/database-data-management", "/services/database-data-management/"),
  p("/database-data-management-2", "/services/database-data-management/"),
  p("/predictive-analysis", "/services/predictive-analysis/"),
  p("/ai-machine-learning", "/services/ai-machine-learning/"),
  p("/ai-machine-learning-2", "/services/ai-machine-learning/"),
  p("/big-data", "/services/big-data/"),
  p("/big-data-2", "/services/big-data/"),
  p("/blockchain", "/services/blockchain/"),
  p("/robotic-process-automation", "/services/robotic-process-automation/"),
  p("/robotic-process-automation-2", "/services/robotic-process-automation/"),

  // --- Industries ---
  p("/fmcg", "/industries/fmcg/"),
  p("/fmcg-2", "/industries/fmcg/"),
  p("/manufacturing", "/industries/manufacturing/"),
  p("/heavy-engineering", "/industries/heavy-engineering/"),
  p("/heavy-engineering-2", "/industries/heavy-engineering/"),
  p("/textiles", "/industries/textiles/"),
  p("/textiles-2", "/industries/textiles/"),
  p("/retail-ecommerce", "/industries/retail-ecommerce/"),
  p("/retail-ecommerce-2", "/industries/retail-ecommerce/"),
  p("/professional-services", "/industries/professional-services/"),
  p("/professional-services-2", "/industries/professional-services/"),
  p("/chemical-fertilizers", "/industries/chemical-fertilizers/"),
  p("/chemical-fertilizers-2", "/industries/chemical-fertilizers/"),
  p("/energy-and-utilities", "/industries/energy-and-utilities/"),
  p("/banking", "/industries/banking/"),
  p("/government", "/industries/government/"),
  p("/healthcare-life-science", "/industries/healthcare-life-science/"),
  p("/healthcare-life-science-2", "/industries/healthcare-life-science/"),
  p("/telecom", "/industries/telecom/"),
  p("/engineering-constructions-ecno", "/industries/engineering-constructions-ecno/"),
  p("/engineering-constructions-ecno-2", "/industries/engineering-constructions-ecno/"),
  p("/automobiles", "/industries/automobiles/"),

  // --- Partners ---
  p("/sap", "/partners/sap/"),
  p("/open-text-2", "/partners/open-text/"),
  p("/ibm", "/partners/ibm/"),
  p("/newgen-2", "/partners/newgen/"),
  p("/hp-2", "/partners/hp/"),
  p("/aws-2", "/partners/aws/"),

  // --- About / people ---
  p("/who-we-are", "/about/who-we-are/"),
  p("/our-leadership", "/about/our-leadership/"),
  p("/out-leadership", "/about/our-leadership/"),

  // --- Customer stories / case studies ---
  p("/customer-stories", "/about/customer-stories/"),
  p("/welspun", "/about/customer-stories/welspun/"),
  p("/ibg-goes-live-with-sap-successfactors", "/about/customer-stories/"),
  p("/wework-rise-with-sap-s4hana", "/about/customer-stories/"),
  p("/sharechat-rise-with-sap-s4hana", "/about/customer-stories/"),

  // --- Lead funnel / news ---
  p("/expert-advice", "/contact/"),
  p("/news", "/insights/"),

  // --- Region / city pages -> home ---
  p("/home-kenya", "/"),
  p("/home-southafrica", "/"),
  p("/in2it-india", "/"),
  p("/in2it-singapore", "/"),
  p("/in2it-dubai", "/"),
  p("/in2it-melbourne", "/"),
  p("/in2it-manila", "/"),
  p("/in2it-malaysia", "/"),
  p("/in2it-bangkok", "/"),

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
  p("/sap-grow-fast", "/services/sap-grow-fast/"),
  p("/grow-with-sap-leadership-forum-event", "/sap-enterprise-solutions/rise-vs-grow/"),
  // --- SuccessFactors local landing pages and campaigns ---
  p("/in2it-ebs-simplify-hiring", "/insights/in2it-ebs-simplify-hiring/"),
  p("/in2it-ebs-simplify-talent-2", "/insights/in2it-ebs-simplify-talent-2/"),
  p("/sap-successfactors-partner-in-india", "/sap-enterprise-solutions/successfactors/"),
  p("/sap-success-factors-in-bangalore", "/sap-enterprise-solutions/successfactors/"),
  p("/sap-successfactors-partner-in-mumbai", "/sap-enterprise-solutions/successfactors/"),
  p("/sap-successfactors-partner-in-chennai", "/sap-enterprise-solutions/successfactors/"),
  p("/sap-successfactors-partner-in-delhi", "/sap-enterprise-solutions/successfactors/"),
  p("/sap-successfactors-partner-in-kolkata", "/sap-enterprise-solutions/successfactors/"),
  p("/sap-success-factors-in-hyderabad", "/sap-enterprise-solutions/successfactors/"),
  p("/sap-success-factors-in-bhubaneswar", "/sap-enterprise-solutions/successfactors/"),
  p("/unlock-the-power-of-hr-technology-transformation", "/sap-enterprise-solutions/successfactors/"),
  p("/unlock-the-power-of-hr-technology-transformation-register-now", "/sap-enterprise-solutions/successfactors/"),
  p("/unlock-the-power-of-hr-technology-transformation-register-now1", "/sap-enterprise-solutions/successfactors/"),
  // --- Careers, FAQ, leadership profiles, news archive ---
  p("/join-our-team", "/careers/"),
  p("/apply-now", "/careers/"),
  p("/our-culture", "/careers/our-culture/"),
  p("/sap-and-success-factor-consultant", "/careers/current-openings/"),
  p("/events-celebrations-3", "/careers/events-celebrations/"),
  p("/faq", "/contact/"),
  p("/dharmendra-sharma", "/about/"),
  p("/anil-kumar-soleti", "/about/"),
  p("/rajat-kapoor", "/about/"),
  p("/news/page/2", "/insights/"),
  p("/global-webinar", "/insights/"),
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
