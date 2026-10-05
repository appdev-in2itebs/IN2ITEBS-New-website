import { z } from "zod";

/**
 * The site settings an admin edits in /admin/settings, one JSON value per key in `site_settings`.
 * Each has a schema (used when saving) and a default (used until Supabase is configured or the row
 * is missing), so the public site never depends on the database being reachable.
 */
export const announcementSchema = z.object({
  enabled: z.boolean().default(false),
  text: z.string().trim().max(200).default(""),
  linkUrl: z.string().trim().max(300).default(""),
  linkLabel: z.string().trim().max(60).default(""),
});

export const contactSchema = z.object({
  email: z.string().trim().email().max(254).default("info@in2itebs.com"),
  hrEmail: z.string().trim().email().max(254).default("hr@in2itebs.com"),
  phone: z.string().trim().max(40).default(""),
});

export const chatbotSchema = z.object({
  enabled: z.boolean().default(true),
  name: z.string().trim().min(1).max(40).default("In2IT Assistant"),
  greeting: z
    .string()
    .trim()
    .min(1)
    .max(500)
    .default(
      "Hi! I am the In2IT EBS assistant. Ask me about our services, industries, partners, offices or careers, or share your requirement and our team will get back to you.",
    ),
  quickReplies: z
    .array(z.string().trim().min(1).max(40))
    .max(8)
    .default(["Our services", "Industries we serve", "Current openings", "Share my requirement", "Office locations"]),
});

export const settingSchemas = { announcement: announcementSchema, contact: contactSchema, chatbot: chatbotSchema };
export type SettingKey = keyof typeof settingSchemas;
export type Settings = {
  announcement: z.infer<typeof announcementSchema>;
  contact: z.infer<typeof contactSchema>;
  chatbot: z.infer<typeof chatbotSchema>;
};

export const defaultSettings: Settings = {
  announcement: announcementSchema.parse({}),
  contact: contactSchema.parse({}),
  chatbot: chatbotSchema.parse({}),
};

/** Parse whatever is stored, falling back field by field to the defaults. */
export function readSetting<K extends SettingKey>(key: K, raw: unknown): Settings[K] {
  const parsed = settingSchemas[key].safeParse({ ...(defaultSettings[key] as object), ...((raw as object) ?? {}) });
  return (parsed.success ? parsed.data : defaultSettings[key]) as Settings[K];
}
