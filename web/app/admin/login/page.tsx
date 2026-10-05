import Image from "next/image";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/admin/session";
import { LoginForm } from "./login-form";

export default async function AdminLoginPage() {
  if (await getAdmin()) redirect("/admin/");
  return (
    <div className="flex min-h-svh items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border-subtle bg-surface p-8 shadow-glass">
        <Image src="/brand/in2it-ebs-navy.svg" alt="In2IT EBS" width={150} height={36} className="h-9 w-auto" />
        <h1 className="mt-6 text-xl font-bold text-foreground">Sign in to the admin</h1>
        <p className="mt-1 text-sm text-foreground-muted">Leads, applications, chats and site settings.</p>
        <LoginForm />
      </div>
    </div>
  );
}
