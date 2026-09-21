import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

interface PracticeLink {
  name: string;
  href: string;
  logo: string;
}

const links: PracticeLink[] = [
  { name: "SAP", href: "/sap-enterprise-solutions/", logo: "/logos/partners/sap.svg" },
  { name: "SuccessFactors", href: "/sap-enterprise-solutions/successfactors/", logo: "/logos/partners/sap.svg" },
  { name: "Workday", href: "/workday/", logo: "/logos/partners/workday.svg" },
  { name: "Salesforce", href: "/salesforce/", logo: "/logos/partners/salesforce.svg" },
  { name: "Oracle", href: "/oracle/", logo: "/logos/partners/oracle.svg" },
  { name: "Microsoft", href: "/microsoft/", logo: "/logos/partners/microsoft.svg" },
];

export function PlatformPracticeLinks() {
  return (
    <nav
      aria-label="Platform practices"
      className="grid grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6"
    >
      {links.map(({ name, href, logo }) => (
        <Link
          key={name}
          href={href}
          className="glass-card group flex min-h-20 min-w-0 items-center justify-between gap-3 rounded-surface px-4 py-3.5 text-base font-semibold text-foreground transition-all duration-300 [overflow-wrap:anywhere] hover:border-action/40 hover:text-action hover:shadow-md"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={logo} alt="" className="h-6 w-6 sm:h-7 sm:w-7 object-contain shrink-0" />
            <span className="truncate">{name}</span>
          </div>
          <ArrowUpRight
            aria-hidden
            size={16}
            className="shrink-0 text-gold group-hover:text-action transition-colors"
          />
        </Link>
      ))}
    </nav>
  );
}
