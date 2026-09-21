import {
  Boxes,
  Rocket,
  TrendingUp,
  Receipt,
  Pyramid,
  ChartColumn,
  Users,
  Cloud,
  Map,
  CloudUpload,
  Server,
  Layers,
  Database,
  LayoutGrid,
  FileText,
  Briefcase,
  Shield,
  ShieldAlert,
  Lock,
  KeyRound,
  Sparkles,
  Code,
  Wrench,
  GitBranch,
  Brain,
  ChartLine,
  Cpu,
  HardDrive,
  Link2,
  Bot,
  Search,
  CircleCheck,
  Settings,
  Eye,
  Target,
  Lightbulb,
  Handshake,
  Globe,
  Monitor,
  MessageSquare,
  Mail,
  Table,
  Presentation,
  Folder,
  Smartphone,
  LayoutTemplate,
  Building2,
  Zap,
  RefreshCw,
  Heart,
  type LucideIcon,
} from "lucide-react";
import type { ServiceIconKey } from "@/content/legacy-services";
import { cn } from "@/lib/utils";
import { HeroMark } from "@/components/sections/hero-media";

const icons: Record<ServiceIconKey, LucideIcon> = {
  boxes: Boxes,
  rocket: Rocket,
  "trending-up": TrendingUp,
  receipt: Receipt,
  prism: Pyramid,
  "bar-chart": ChartColumn,
  users: Users,
  cloud: Cloud,
  map: Map,
  "cloud-upload": CloudUpload,
  server: Server,
  layers: Layers,
  database: Database,
  grid: LayoutGrid,
  "file-text": FileText,
  briefcase: Briefcase,
  shield: Shield,
  "shield-alert": ShieldAlert,
  lock: Lock,
  key: KeyRound,
  sparkles: Sparkles,
  code: Code,
  wrench: Wrench,
  "git-branch": GitBranch,
  brain: Brain,
  "line-chart": ChartLine,
  cpu: Cpu,
  "hard-drive": HardDrive,
  link: Link2,
  bot: Bot,
  search: Search,
  "check-circle": CircleCheck,
  settings: Settings,
  eye: Eye,
  target: Target,
  lightbulb: Lightbulb,
  handshake: Handshake,
  globe: Globe,
  monitor: Monitor,
  "message-square": MessageSquare,
  mail: Mail,
  table: Table,
  presentation: Presentation,
  folder: Folder,
  smartphone: Smartphone,
  layout: LayoutTemplate,
  building: Building2,
  zap: Zap,
  refresh: RefreshCw,
  heart: Heart,
};

export function serviceIcon(key: ServiceIconKey | undefined): LucideIcon {
  return (key && icons[key]) || Boxes;
}

/** The icon tile that fronts a service card: the site's `.icon-tile` treatment around a lucide mark. */
export function ServiceIconTile({
  icon,
  size = "md",
  className,
}: {
  icon: ServiceIconKey | undefined;
  size?: "sm" | "md" | "lg";
  className?: string;
}) {
  const Icon = serviceIcon(icon);
  const box = { sm: "h-10 w-10 rounded-control", md: "h-12 w-12 rounded-control", lg: "h-16 w-16 rounded-surface" }[
    size
  ];
  const glyph = { sm: 18, md: 22, lg: 30 }[size];
  return (
    <span aria-hidden className={cn("icon-tile shrink-0", box, className)}>
      <Icon size={glyph} strokeWidth={1.6} />
    </span>
  );
}

/** The hero's media for a service without a photograph: the frameless mark in hero-media.tsx. */
export function ServiceHeroMark({ icon }: { icon: ServiceIconKey }) {
  return <HeroMark icon={serviceIcon(icon)} />;
}
