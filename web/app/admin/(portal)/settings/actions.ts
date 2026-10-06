"use server";

import { redirect } from "next/navigation";
import { audit, requireAdmin } from "@/lib/admin/session";
import { saveSetting } from "@/lib/cms/store";
import { settingSchemas, type SettingKey } from "@/lib/cms/settings";

/** Reads one settings form (which carries a hidden `key`) into that setting's JSON shape. */
function valueFrom(key: SettingKey, form: FormData) {
  const s = (name: string) => String(form.get(name) ?? "").trim();
  if (key === "announcement")
    return { enabled: form.get("enabled") === "on", text: s("text"), linkUrl: s("linkUrl"), linkLabel: s("linkLabel") };
  if (key === "contact") return { email: s("email"), hrEmail: s("hrEmail"), phone: s("phone") };
  return {
    enabled: form.get("enabled") === "on",
    name: s("name"),
    greeting: s("greeting"),
    quickReplies: s("quickReplies")
      .split("\n")
      .map((q) => q.trim())
      .filter(Boolean),
  };
}

export async function saveSettings(form: FormData) {
  const admin = await requireAdmin("settings");
  const key = String(form.get("key")) as SettingKey;
  // The assistant's settings have their own page (/admin/assistant).
  if (!(key in settingSchemas) || key === "assistant") redirect("/admin/settings/");
  const parsed = settingSchemas[key].safeParse(valueFrom(key, form));
  if (!parsed.success)
    redirect(
      `/admin/settings/?error=${encodeURIComponent(`${key}: ${parsed.error.issues[0].path.join(".")} ${parsed.error.issues[0].message}`)}`,
    );
  try {
    await saveSetting(key, parsed.data, admin.email);
  } catch {
    redirect(`/admin/settings/?error=${encodeURIComponent("Could not save.")}`);
  }
  await audit(admin, "update", "setting", key);
  redirect(`/admin/settings/?saved=${key}`);
}
