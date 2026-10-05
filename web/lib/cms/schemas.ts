import { z } from "zod";

/** A client's details collected step by step in the chat widget. */
export const chatLeadSchema = z.object({
  conversationId: z.string().max(40).nullish(),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  company: z.string().trim().max(160).optional().default(""),
  phone: z
    .string()
    .trim()
    .max(40)
    .regex(/^[+()\d\s-]*$/, "Phone may contain digits, spaces, +, - and brackets.")
    .optional()
    .default(""),
  requirement: z.string().trim().min(5).max(3000),
});

/** The careers apply form. The CV is checked separately (type, size and file signature). */
export const applySchema = z.object({
  openingId: z.string().uuid(),
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(254),
  phone: z
    .string()
    .trim()
    .min(6)
    .max(40)
    .regex(/^[+()\d\s-]+$/, "Phone may contain digits, spaces, +, - and brackets."),
  location: z.string().trim().max(120).optional().default(""),
  currentRole: z.string().trim().max(160).optional().default(""),
  noticePeriod: z.string().trim().max(60).optional().default(""),
  expectedCtc: z.string().trim().max(60).optional().default(""),
  linkedinUrl: z
    .string()
    .trim()
    .max(300)
    .optional()
    .default("")
    .refine((v) => !v || /^https?:\/\/([a-z0-9-]+\.)*linkedin\.com\//i.test(v), "Use a linkedin.com profile link."),
  coverNote: z.string().trim().max(3000).optional().default(""),
  consent: z.literal("yes"),
  website: z.string().max(200).optional().default(""), // honeypot: people leave it empty
});

export const CV_MAX_BYTES = 5 * 1024 * 1024;

/** The CV's real type from its first bytes, so a renamed file cannot pass as a PDF. */
export function cvType(bytes: Uint8Array): { ext: "pdf" | "doc" | "docx"; mime: string } | null {
  const starts = (sig: number[]) => sig.every((b, i) => bytes[i] === b);
  if (starts([0x25, 0x50, 0x44, 0x46])) return { ext: "pdf", mime: "application/pdf" };
  if (starts([0xd0, 0xcf, 0x11, 0xe0])) return { ext: "doc", mime: "application/msword" };
  if (starts([0x50, 0x4b, 0x03, 0x04]))
    return { ext: "docx", mime: "application/vnd.openxmlformats-officedocument.wordprocessingml.document" };
  return null;
}
