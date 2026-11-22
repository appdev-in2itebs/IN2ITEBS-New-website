import nodemailer from "nodemailer";

/**
 * Outgoing email for the admin (one-time codes, password confirmations, new-account notices).
 * Plain SMTP, configured with SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS and MAIL_FROM; without
 * them nothing is sent and callers show a clear message instead of failing silently. Server-only.
 */
export function mailConfigured() {
  return Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
}

export function mailFrom() {
  return process.env.MAIL_FROM || `In2IT EBS Admin <${process.env.SMTP_USER ?? "no-reply@in2itebs.com"}>`;
}

let transport: nodemailer.Transporter | null = null;

function transporter() {
  if (transport) return transport;
  const port = Number(process.env.SMTP_PORT) || 587;
  transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465,
    requireTLS: port !== 465,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
    connectionTimeout: 15_000,
    greetingTimeout: 15_000,
    socketTimeout: 30_000,
  });
  return transport;
}

export type Mail = { to: string | string[]; subject: string; html: string; text: string; replyTo?: string };

export async function sendMail(mail: Mail) {
  if (!mailConfigured()) throw new Error("Email is not configured: set SMTP_HOST, SMTP_USER and SMTP_PASS.");
  await transporter().sendMail({ from: mailFrom(), ...mail });
}
