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

export const SECTIONS = {
  dashboard: { label: "Dashboard", href: "/admin/", roles: ["admin", "sales", "hr", "editor"] },
  leads: { label: "Leads", href: "/admin/leads/", roles: ["admin", "sales"] },
  applications: { label: "Applications", href: "/admin/applications/", roles: ["admin", "hr"] },
  openings: { label: "Job openings", href: "/admin/openings/", roles: ["admin", "hr"] },
  chats: { label: "Chat transcripts", href: "/admin/chats/", roles: ["admin", "sales", "editor"] },
  site: { label: "Visual editor", href: "/admin/site/", roles: ["admin", "editor"] },
  builder: { label: "Page builder", href: "/admin/builder/", roles: ["admin", "editor"] },
  content: { label: "Website content", href: "/admin/content/", roles: ["admin", "editor"] },
  media: { label: "Media library", href: "/admin/media/", roles: ["admin", "editor"] },
  assistant: { label: "AI assistant", href: "/admin/assistant/", roles: ["admin", "editor"] },
  faqs: { label: "Chatbot FAQs", href: "/admin/faqs/", roles: ["admin", "editor"] },
  settings: { label: "Site settings", href: "/admin/settings/", roles: ["admin", "editor"] },
  pages: { label: "Page heroes", href: "/admin/pages/", roles: ["admin", "editor"] },
  users: { label: "Users", href: "/admin/users/", roles: ["admin"] },
} as const satisfies Record<string, { label: string; href: string; roles: readonly Role[] }>;
export type Section = keyof typeof SECTIONS;

export function can(role: Role, section: Section) {
  return (SECTIONS[section].roles as readonly Role[]).includes(role);
}

export const LEAD_STATUSES = ["new", "contacted", "qualified", "won", "lost", "spam"] as const;
export const APPLICATION_STATUSES = ["new", "screening", "interview", "offer", "hired", "rejected"] as const;
