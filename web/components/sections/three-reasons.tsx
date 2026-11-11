import { Stagger, StaggerItem } from "@/components/motion/reveal";

/** SOT-44 — three differentiated capabilities, each backed by evidence. */
const reasons = [
  {
    n: "01",
    title: "Partnership depth",
    body: "SAP Gold Partner, RISE with SAP, PCE and Co-Innovation Partner — a combination held by a narrow group of firms globally.",
    tags: ["Gold", "RISE", "PCE", "Co-Innovation"],
  },
  {
    n: "02",
    title: "Delivery economics",
    body: "500+ professionals across four delivery centres in Bengaluru, Hyderabad, Delhi NCR and Bhubaneswar.",
    tags: ["Follow-the-sun", "Offshore-led AMS"],
  },
  {
    n: "03",
    title: "Accelerated outcomes",
    body: "Our FastForward method, built on SAP Activate and accelerated by pre-built assets, compresses S/4HANA timelines by up to 28%.",
    tags: ["RDS", "Localisation Pack", "Industry templates"],
  },
];

export function ThreeReasons() {
  return (
    <Stagger className="grid gap-10 md:grid-cols-3">
      {reasons.map((r) => (
        <StaggerItem key={r.n} className="flex flex-col gap-4">
          <span className="text-gradient-numeral text-5xl font-bold">{r.n}</span>
          <h3 className="text-h3 font-bold text-foreground">{r.title}</h3>
          <p className="text-[0.95rem] leading-relaxed text-foreground-muted">{r.body}</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {r.tags.map((t) => (
              <span key={t} className="glass-pill text-foreground-muted">
                {t}
              </span>
            ))}
          </div>
        </StaggerItem>
      ))}
    </Stagger>
  );
}
