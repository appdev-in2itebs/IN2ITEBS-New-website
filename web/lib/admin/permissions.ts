/**
 * Who may open which part of /admin. Checked on the server for every page and every action, so a
 * hidden menu item is never the only protection.
 */
export const ROLES = ["admin", "sales", "hr", "editor"] as const;
export type Role = (typeof ROLES)[number];

export const ROLE_LABELS: Record<Role, string> = {
  admin: "Admin (everything)",
  sales: "Sales (leads and chats)",
  hr: "HR (openings and applications)",
  editor: "Editor (page builder, website content, media, chatbot, settings)",
};

/** The admin menu's groups, in order. */
export const GROUPS = {
  overview: "Overview",
  customers: "Customers",
  hiring: "Hiring",
  website: "Website",
  ai: "AI assistant",
  admin: "Administration",
} as const;
export type Group = keyof typeof GROUPS;

/**
 * Every part of /admin: its menu name, address, group and who may open it. `menu: false` keeps a
 * part out of the menu (it is opened from another page: Page heroes from Content) while its address
 * and rules stay the same.
 */
export const SECTIONS = {
  dashboard: { label: "Dashboard", href: "/admin/", group: "overview", roles: ["admin", "sales", "hr", "editor"] },
  leads: { label: "Leads", href: "/admin/leads/", group: "customers", roles: ["admin", "sales"] },
  chats: { label: "Conversations", href: "/admin/chats/", group: "customers", roles: ["admin", "sales", "editor"] },
  openings: { label: "Job openings", href: "/admin/openings/", group: "hiring", roles: ["admin", "hr"] },
  applications: { label: "Applications", href: "/admin/applications/", group: "hiring", roles: ["admin", "hr"] },
  site: { label: "Edit website", href: "/admin/site/", group: "website", roles: ["admin", "editor"] },
  builder: { label: "Pages", href: "/admin/builder/", group: "website", roles: ["admin", "editor"] },
  content: { label: "Content", href: "/admin/content/", group: "website", roles: ["admin", "editor"] },
  media: { label: "Media", href: "/admin/media/", group: "website", roles: ["admin", "editor"] },
  pages: { label: "Page heroes", href: "/admin/pages/", group: "website", roles: ["admin", "editor"], menu: false },
  assistant: { label: "Assistant settings", href: "/admin/assistant/", group: "ai", roles: ["admin", "editor"] },
  faqs: { label: "Chatbot answers", href: "/admin/faqs/", group: "ai", roles: ["admin", "editor"] },
  settings: { label: "Settings", href: "/admin/settings/", group: "admin", roles: ["admin", "editor"] },
  users: { label: "Users", href: "/admin/users/", group: "admin", roles: ["admin"] },
} as const satisfies Record<
  string,
  { label: string; href: string; group: Group; roles: readonly Role[]; menu?: false }
>;
export type Section = keyof typeof SECTIONS;

export function can(role: Role, section: Section) {
  return (SECTIONS[section].roles as readonly Role[]).includes(role);
}

export const LEAD_STATUSES = ["new", "contacted", "qualified", "won", "lost", "spam"] as const;
export const APPLICATION_STATUSES = ["new", "screening", "interview", "offer", "hired", "rejected"] as const;
