import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { Container } from "@/components/ui/container";
import { Reveal, Stagger, StaggerItem } from "@/components/motion/reveal";
import { HeroImage } from "@/components/sections/hero-media";
import { V2Hero, V2StickyNav, V2Overview, V2Section, V2Bento, V2Rail, V2Closing } from "@/components/sections/v2";

export const metadata = pageMetadata("/about/customer-stories/welspun/", {
  title: "Welspun Group: Building a Supportive Culture",
  description:
    "Improving employee experience by centralizing and automating HR processes with SAP SuccessFactors solutions, delivered by In2IT EBS for Welspun Group.",
});

/**
 * Welspun Group — the existing site's /welspun/ customer success story, section for section and
 * word for word: executive overview, objective, solutions, partner role, results and future plans,
 * with the figures that page calls out between them, in the approved design.
 */
const overview = [
  {
    title: "Before: Challenges and Opportunities",
    bullets: [
      "Multiple HR systems with no direct access to finance or manufacturing data",
      "Lack of integration between core HR systems and third-party applications",
      "Time-consuming HR processes involving manual processing of spreadsheets",
      "Minimal visibility of HR data and services for employees",
    ],
  },
  {
    title: "Why SAP and In2IT EBS",
    bullets: [
      "Comprehensive range of HR capabilities provided by SAP® SuccessFactors® Human Experience Management Suite solutions, including recruiting, onboarding, performance and goals, learning, compensation, and succession and development",
      "Ease of integration with SAP Business Suite powered by SAP HANA® software",
      "Strong technical capabilities and functional expertise from In2IT EBS",
    ],
  },
  {
    title: "After: Value-Driven Results",
    bullets: [
      "Provides employees with 24×7 access to a single point of control for HR services",
      "Empowers HR professionals to focus on strategic, value-add activities, not routine administration",
      "Enables straight-through processing with direct integration between SAP and third-party applications",
      "Eliminates spreadsheet-based data management and provides a single source of truth",
      "Streamlines and automates processes across the employee lifecycle",
    ],
  },
];

const figures = [
  {
    value: "99.9%",
    label:
      "Achievement on goals setting, mid-year reviews and annual performance assessment, and compensation planning",
  },
  { value: "800+", label: "Spreadsheets eliminated by integrating data flows with third-party systems" },
  { value: "Satisfied", label: "Employees, managers and HR users" },
  { value: "95%", label: "Process adherence and system usage" },
  { value: "Enables", label: "Integration between SAP SuccessFactors and third-party solutions" },
  { value: "15%", label: "Cost saving in HR technology due to simplification of the software landscape" },
  { value: "24/7", label: "Employee access to self-service HR solutions" },
  { value: "Zero", label: "Manual intervention required for fully automated HR processes" },
];

const chapters = [
  {
    id: "objective",
    eyebrow: "Objective",
    title: "Empowering Employees to Achieve Their Full Potential",
    paragraphs: [
      "Welspun Group is an Indian success story. The conglomerate has enjoyed a sustained period of global growth, expanding beyond its domestic market area to establish a presence in more than 50 countries worldwide. Its diverse businesses are increasingly recognized as leaders in their fields, which include the manufacture of welded line pipes, home textiles, and infrastructure development projects for the road, water, and energy sectors.",
      "Welspun's rapid progress towards its strategic goals – the company aims to become one of the top two value creators in each of its business areas by 2022 – is a result of its investment in its people. Its HR function focuses on building a 'One Welspun' culture that empowers the company's 26,000 employees and associates to achieve their full potential.",
      "Jonathan D'Souza, Group COE Head – Performance, Talent & Rewards, explains: \"We provide all Welspunites with opportunities to grow and invest in developing their skills. We take great pride in maintaining a congenial work environment that represents and encourages the culture of 'One Welspun'. With transactions simplified and seamless, our talent can focus on the priorities that matter most for their customers and the business.\"",
      "Welspun wanted to ensure its HR technology would support these goals. The company already had a strong foundation of HR data, but it wanted to be able to integrate this information with finance and manufacturing data to enable predictive analytics for better decision-making.",
      "The HR team also saw significant opportunities to streamline processes, increase efficiencies, and boost employee satisfaction by centralizing its HR platforms and enabling easier integration between core and third-party applications.",
    ],
  },
  {
    id: "solutions",
    eyebrow: "Solutions",
    title: "Enhancing Processes Across the Entire Employee Lifecycle",
    paragraphs: [
      "Working with SAP and In2IT EBS, Welspun Group implemented a suite of SAP® SuccessFactors® Human Experience Management (HXM) Suite solutions and integrated them with its existing SAP Business Suite powered by SAP HANA® software.",
      "The SAP SuccessFactors Employee Central solution acts as a central source of master data, capturing the complete employment lifecycle from hire to retire. Every event in an employee's career at Welspun is logged and documented, and the solution provides a single point of access to HR services that all employees can use to serve themselves.",
      "Meanwhile, the SAP SuccessFactors Performance & Goals solution captures all employee goals, which the company assesses mid-year in an annual process to inform career planning and promotion discussions. Similarly, the SAP SuccessFactors Compensation solution handles all compensation related activity, automatically assessing employees' eligibility for rewards and streamlining the payout process.",
      "The SAP SuccessFactors Recruiting, SAP SuccessFactors Onboarding, and SAP SuccessFactors Learning solutions work together to streamline the entire process of bringing new Welspunites into the company through hiring, onboarding, and training. Welspun Group harnesses the SAP SuccessFactors Job Profile Builder tool, which pulls data from all SAP SuccessFactors solutions, to auto-populate attributes in new job postings. Employees can see how their current competencies stack up against the role, and the system will recommend suitable training courses.",
      "Finally, with the SAP SuccessFactors Succession & Development solution, Welspun Group can better support career development planning by capturing all the attributes needed for a successor to each position, such as career history, assessments, and qualifications.",
    ],
  },
  {
    id: "partner-role",
    eyebrow: "Partner Role",
    title: "Establishing Trusted Partnerships",
    paragraphs: [
      "Welspun Group selected In2IT EBS as main implementation partner to help its in-house team deliver the SAP SuccessFactors project.",
      "Amit Sood Shastri, Senior General Manager (Head HRIS) at Welspun Group comments: \"From the beginning, we were impressed by In2IT EBS's strong technical capabilities and functional expertise. Their partnership brought significant value to the project, because we knew we could trust them to deliver high-quality work. Thanks to In2IT EBS, we have full confidence in the integrations we've built between our SAP SuccessFactors solutions, our SAP Business Suite software, and our third-party applications.\"",
      "Welspun also believes that In2IT EBS was a particularly appropriate choice of partner for this project due to its strong relationship with SAP, and its combination of both local knowledge of the Indian technology market, and experience of delivering large-scale international projects. As a multinational conglomerate and one of the first companies in India to adopt SAP SuccessFactors solutions, Welspun welcomed the expertise that In2IT EBS had gained working on similar projects for other international companies.",
    ],
  },
  {
    id: "results",
    eyebrow: "Results",
    title: "Unlocking New Efficiencies and Boosting Employee Satisfaction",
    paragraphs: [
      "With the SAP SuccessFactors HXM solutions in place, Welspun Group has delivered on its commitment to put its employees at the center of its 'One Welspun' culture.",
      "Today, employees have a one-stop shop where they can access all the HR services they need, throughout their life as a Welspun employee. For example, when they join the company, they are automatically given access to relevant resources, systems, and documents, helping them hit the ground running from day one. At the same time, metrics such as time-to-recruit have improved significantly. The SAP SuccessFactors solution also streamlines the offboarding experience by automating the process and helping to ensuring that all compliance requirements are met.",
      "Meanwhile, the high level of automation and integration provided by the SAP SuccessFactors solutions has liberated the company's HR professionals from many hours of routine administrative work. As one example: in the past, the company needed to pull nearly 800 spreadsheets of data to manage employee insurance renewals. Today, this process is entirely automated and requires zero manual intervention.",
      "Adoption of the SAP SuccessFactors solutions has been high, thanks in large part to extensive employee training. Welspun Group created detailed help guides, and users receive refresher training every six months",
    ],
  },
  {
    id: "future-plans",
    eyebrow: "Future Plans",
    title: "Taking Integration to the Next Level",
    paragraphs: [
      "With the SAP SuccessFactors HXM solutions in place, Welspun Group has delivered on its commitment to put its employees at the center of its 'One Welspun' culture.",
      "Today, employees have a one-stop shop where they can access all the HR services they need, throughout their life as a Welspun employee. For example, when they join the company, they are automatically given access to relevant resources, systems, and documents, helping them hit the ground running from day one. At the same time, metrics such as time-to-recruit have improved significantly. The SAP SuccessFactors solution also streamlines the offboarding experience by automating the process and helping to ensuring that all compliance requirements are met.",
      "Meanwhile, the high level of automation and integration provided by the SAP SuccessFactors solutions has liberated the company's HR professionals from many hours of routine administrative work. As one example: in the past, the company needed to pull nearly 800 spreadsheets of data to manage employee insurance renewals. Today, this process is entirely automated and requires zero manual intervention.",
      "Adoption of the SAP SuccessFactors solutions has been high, thanks in large part to extensive employee training. Welspun Group created detailed help guides, and users receive refresher training every six months",
    ],
  },
];

function Quote({ text, by }: { text: string; by?: string }) {
  return (
    <section className="bg-canvas py-14 md:py-16">
      <Container>
        <Reveal>
          <article className="theme-on-brand relative overflow-hidden rounded-feature bg-brand p-8 text-on-brand md:p-12">
            <div aria-hidden className="pointer-events-none absolute inset-0 hero-ambient opacity-70" />
            <p className="relative max-w-[60ch] text-xl font-medium leading-relaxed md:text-2xl">{text}</p>
            {by ? <p className="relative mt-4 text-sm text-on-brand/80">{by}</p> : null}
          </article>
        </Reveal>
      </Container>
    </section>
  );
}

export default function WelspunStoryPage() {
  return (
    <>
      <BreadcrumbJsonLd path="/about/customer-stories/welspun/" name="Welspun Group" />
      <V2Hero
        path={[
          { label: "About", href: "/about/" },
          { label: "Customer Stories", href: "/about/customer-stories/" },
          { label: "Welspun Group" },
        ]}
        title="Welspun Group: Building a Supportive Culture for Employees to Grow and Develop their Skills"
        lead="As a fast-growing conglomerate, Welspun Group attributes its success to the passion, innovation and productivity of its people. The company takes pride in its 'One Welspun' culture, which focuses on nurturing talent and enabling team members with the requisite skills and capabilities to help them discover their full potential. To this end, Welspun wanted to increase the integration between its HR, finance, operational, and manufacturing processes to support better decision-making across the entire talent lifecycle and provide employees with a one-stop shop for all their needs"
        media={<HeroImage src="/stories/istockphoto-1146472948-612x612-1.jpg" alt="Welspun Group" />}
        cta={false}
      />
      <V2StickyNav
        anchors={[
          { id: "overview", label: "Executive overview" },
          ...chapters.map((chapter) => ({ id: chapter.id, label: chapter.eyebrow })),
          { id: "talk", label: "Talk to us" },
        ]}
      />
      <V2Section
        id="overview"
        eyebrow="Executive overview"
        heading="Improving Employee Experience by Centralizing and Automating HR Processes with SAP® SuccessFactors® Solutions"
        tone="canvas"
      >
        <V2Bento items={overview} />
      </V2Section>
      <Quote
        text="“SAP SuccessFactors solutions act as a one-stop shop for all our HR needs and help us embed a culture of ‘One Welspun’ for all our employees across various businesses.”"
        by="Amit Sood Shastri - Senior General Manager (Head HRIS), Welspun Group"
      />
      <section className="bg-surface-subtle py-14 md:py-16">
        <Container>
          <Stagger className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {figures.map((figure) => (
              <StaggerItem key={figure.label}>
                <div className="rounded-feature border border-border-subtle/70 bg-surface p-5">
                  <p className="text-gradient-numeral text-3xl font-bold tracking-tight">{figure.value}</p>
                  <p className="mt-2 text-sm leading-relaxed text-foreground-muted">{figure.label}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Container>
      </section>
      {chapters.map((chapter, index) => (
        <V2Overview
          key={chapter.id}
          id={chapter.id}
          eyebrow={chapter.eyebrow}
          heading={chapter.title}
          paragraphs={chapter.paragraphs}
          tone={index % 2 === 0 ? "canvas" : "subtle"}
        />
      ))}
      <Quote text="“With SAP SuccessFactors solutions, our leadership and HR teams are free to focus on more strategic and value-add activities for the business – and for our employees, all the services they need are just one click away.”" />
      <V2Rail
        eyebrow="Customer Stories"
        heading="More customer stories."
        items={[
          { label: "All customer stories", href: "/about/customer-stories/" },
          { label: "Clients & Case Studies", href: "/case-studies/" },
          { label: "SAP SuccessFactors", href: "/services/sap-successfactors/" },
        ]}
      />
      <V2Closing body="Tell us where you want to go. We will bring the platforms, the people and the proof, and map your first move in a single conversation." />
    </>
  );
}
