import type { ReactNode } from "react";
import { requireAdmin } from "@/lib/admin/session";
import { AdminShell } from "@/components/admin/shell";

/** Every page inside the portal needs a signed-in admin; the login page sits outside this group. */
export default async function PortalLayout({ children }: { children: ReactNode }) {
  const admin = await requireAdmin();
  return <AdminShell admin={admin}>{children}</AdminShell>;
}
