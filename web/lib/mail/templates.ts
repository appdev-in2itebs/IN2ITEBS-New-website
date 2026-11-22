/**
 * Admin emails in the In2IT brand (Navy, Accent Blue, Light Blue tiles): a one-time code, a
 * password-changed confirmation and a new-account notice. Table layout and inline styles so they
 * render the same in Outlook, Gmail and on phones; a plain-text twin goes with every message.
 */
const NAVY = "#0b1328";
const NAVY_700 = "#0f1931";
const ACCENT = "#3f75a3";
const TILE = "#e3eef7";
const INK = "#1a2233";
const INK_MUTED = "#5b6472";
const RULE = "#dbe3ec";

export type CodePurpose = "reset" | "change" | "set";

const PURPOSE_TEXT: Record<CodePurpose, { title: string; line: string; self: string }> = {
  reset: {
    title: "Password reset",
    line: "asked to reset the admin password for",
    self: "asked to reset your admin password",
  },
  change: {
    title: "Password change",
    line: "wants to change the admin password for",
    self: "want to change your admin password",
  },
  set: {
    title: "New admin account",
    line: "is setting the first password for the new admin account",
    self: "are setting the first password for your admin account",
  },
};

export function siteOrigin() {
  return (process.env.NEXT_PUBLIC_SITE_URL || "https://www.in2itebs.com").replace(/\/+$/, "");
}

const ESCAPES: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ESCAPES[c]);
const host = () => esc(siteOrigin().replace(/^https?:\/\//, ""));

function shell({
  preheader,
  overline,
  title,
  body,
  aside,
}: {
  preheader: string;
  overline: string;
  title: string;
  body: string;
  aside?: string;
}) {
  const origin = siteOrigin();
  const year = new Date().getUTCFullYear();
  const side = `border-left:1px solid ${RULE};border-right:1px solid ${RULE};`;
  const asideRow = aside
    ? `<tr><td style="background:#ffffff;padding:0 32px 28px;${side}"><div style="border-top:1px solid ${RULE};padding-top:18px;font-size:13px;line-height:20px;color:${INK_MUTED};">${aside}</div></td></tr>`
    : `<tr><td style="background:#ffffff;padding:0 32px 24px;${side}"></td></tr>`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width">
<meta name="color-scheme" content="light only">
<title>${esc(title.replace(/<[^>]+>/g, ""))}</title>
</head>
<body style="margin:0;padding:0;background:#f3f6fa;font-family:'IBM Plex Sans',Calibri,Arial,Helvetica,sans-serif;color:${INK};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f3f6fa;">
<tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;width:100%;">
  <tr><td style="background:${NAVY};background-image:linear-gradient(135deg,${NAVY},${NAVY_700});border-radius:20px 20px 0 0;padding:26px 32px;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0"><tr>
      <td><img src="${origin}/brand/in2it-ebs-logo-pale.png" width="132" height="41" alt="In2IT EBS" style="display:block;border:0;width:132px;height:auto;"></td>
      <td align="right" style="font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#a9c4dc;font-weight:600;">Website admin</td>
    </tr></table>
  </td></tr>
  <tr><td style="background:#ffffff;padding:32px 32px 8px;${side}">
    <p style="margin:0 0 10px;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:${ACCENT};font-weight:600;">${esc(overline)}</p>
    <h1 style="margin:0 0 18px;font-family:Newsreader,Cambria,Georgia,serif;font-weight:700;font-size:28px;line-height:34px;letter-spacing:-.02em;color:${NAVY};">${title}</h1>
    ${body}
  </td></tr>
  ${asideRow}
  <tr><td style="background:${TILE};border-radius:0 0 20px 20px;padding:18px 32px;font-size:12px;line-height:18px;color:${INK_MUTED};">
    <strong style="color:${NAVY};">In2IT EBS</strong> &nbsp;|&nbsp; Converged Intelligence<br>
    Sent by the website admin at <a href="${origin}/admin/" style="color:${ACCENT};text-decoration:none;">${host()}/admin</a> &middot; Confidential &middot; ${year}
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

const p = (html: string) => `<p style="margin:0 0 14px;font-size:15px;line-height:23px;color:${INK};">${html}</p>`;
const strong = (s: string) => `<strong style="color:${NAVY};">${esc(s)}</strong>`;
const em = (s: string) => `<em style="font-style:italic;color:${ACCENT};">${esc(s)}</em>`;

export function passwordCodeEmail(input: {
  code: string;
  purpose: CodePurpose;
  targetEmail: string;
  requestedBy: string | null;
  expiresMinutes: number;
  /** True when the code goes to the person whose password changes. */
  toSelf?: boolean;
}) {
  const { code, purpose, targetEmail, requestedBy, expiresMinutes, toSelf } = input;
  const who = requestedBy && requestedBy !== targetEmail ? requestedBy : targetEmail;
  const t = PURPOSE_TEXT[purpose];
  const digit = (d: string) =>
    `<span style="display:inline-block;width:40px;height:52px;line-height:52px;margin:0 3px;background:#ffffff;border:1px solid #c7d7e6;border-radius:10px;font-family:'JetBrains Mono',Consolas,'Courier New',monospace;font-size:28px;font-weight:600;color:${NAVY};text-align:center;">${d}</span>`;
  const intro = toSelf
    ? p(`You ${esc(t.self)} (${strong(targetEmail)}). Here is your one-time code.`)
    : p(
        `${strong(who)} ${esc(t.line)} ${strong(targetEmail)}. Give them this one-time code only if you expect this request.`,
      );
  const body = `
    ${intro}
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin:22px 0 18px;"><tr>
      <td align="center" style="background:${TILE};border-radius:16px;padding:22px 12px;">
        <div style="font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:${INK_MUTED};font-weight:600;margin-bottom:12px;">One-time code</div>
        <div style="white-space:nowrap;">${code.split("").map(digit).join("")}</div>
        <div style="font-size:13px;color:${INK_MUTED};margin-top:12px;">Valid for ${expiresMinutes} minutes &middot; works once</div>
      </td>
    </tr></table>
    ${p(
      toSelf
        ? `Enter it on the admin screen together with your new password. Nothing changes until the code is entered.`
        : `They enter it on the admin screen together with the new password. Nothing changes until the code is entered.`,
    )}`;
  const aside = `${toSelf ? "Did not ask for this?" : "Did not expect this?"} Do nothing: the code expires on its own and the password stays as it is. The request came through the admin at ${host()}.`;
  const subject = `${code} is your In2IT admin code (${t.title.toLowerCase()} for ${targetEmail})`;
  const text = [
    `In2IT EBS website admin: ${t.title}`,
    ``,
    toSelf ? `You ${t.self} (${targetEmail}).` : `${who} ${t.line} ${targetEmail}.`,
    ``,
    `One-time code: ${code}`,
    `Valid for ${expiresMinutes} minutes, works once.`,
    ``,
    toSelf
      ? `Enter it on the admin screen with your new password. If you did not ask for this, do nothing: the code expires on its own.`
      : `They enter it on the admin screen with the new password. If you did not expect this, do nothing: the code expires on its own.`,
    ``,
    `In2IT EBS | Converged Intelligence | ${siteOrigin()}/admin/`,
  ].join("\n");
  return {
    subject,
    text,
    html: shell({
      preheader: `One-time code ${code}: ${who} ${t.line} ${targetEmail}`,
      overline: t.title,
      title: `Your one-time code is ${em("ready")}`,
      body,
      aside,
    }),
  };
}

export function passwordChangedEmail(input: {
  targetEmail: string;
  purpose: CodePurpose;
  changedBy: string | null;
  at: Date;
}) {
  const { targetEmail, purpose, changedBy, at } = input;
  const when = at.toUTCString().replace(/:\d\d GMT$/, " UTC");
  const what = purpose === "set" ? "has its first password" : "was changed";
  const by = changedBy && changedBy !== targetEmail ? `, confirmed by ${strong(changedBy)}` : "";
  const body = `
    ${p(`The admin password for ${strong(targetEmail)} ${what} on ${strong(when)}${by}.`)}
    ${p(`Sign in at <a href="${siteOrigin()}/admin/login/" style="color:${ACCENT};font-weight:600;text-decoration:none;">${host()}/admin/login</a> with the new password.`)}`;
  const aside = `If this was not you, reset the password straight away from the sign-in page and tell the website owners.`;
  const subject = `In2IT admin password ${what} for ${targetEmail}`;
  const byText = changedBy && changedBy !== targetEmail ? `, confirmed by ${changedBy}` : "";
  const text = `In2IT EBS website admin\n\nThe admin password for ${targetEmail} ${what} on ${when}${byText}.\nSign in at ${siteOrigin()}/admin/login/ with the new password.\n\nIf this was not you, reset the password from the sign-in page and tell the website owners.`;
  return {
    subject,
    text,
    html: shell({
      preheader: `Admin password ${what} for ${targetEmail}`,
      overline: "Security notice",
      title: `Password ${em(what === "was changed" ? "changed" : "set")}`,
      body,
      aside,
    }),
  };
}

export function accountCreatedEmail(input: {
  targetEmail: string;
  name: string | null;
  role: string;
  ownerEmail: string;
}) {
  const { targetEmail, name, role, ownerEmail } = input;
  const body = `
    ${p(`Hello${name ? ` ${esc(name)}` : ""}, an account on the In2IT EBS website admin was created for ${strong(targetEmail)} with the role ${strong(role)}.`)}
    ${p(`${strong(ownerEmail)} sets your first password and will share it with you privately. After that you can change it yourself under <em>My account</em>; every change is confirmed with a one-time code sent to your own inbox.`)}
    <p style="margin:22px 0 10px;"><a href="${siteOrigin()}/admin/login/" style="display:inline-block;background:${ACCENT};color:#ffffff;font-weight:600;font-size:15px;padding:13px 22px;border-radius:12px;text-decoration:none;">Open the admin</a></p>`;
  const subject = `Your In2IT admin account (${role})`;
  const text = `Hello${name ? ` ${name}` : ""},\n\nAn account on the In2IT EBS website admin was created for ${targetEmail} with the role ${role}.\n${ownerEmail} sets your first password and will share it with you privately. You can change it later under My account; every change is confirmed with a one-time code sent to your own inbox.\n\nSign in: ${siteOrigin()}/admin/login/`;
  return {
    subject,
    text,
    html: shell({
      preheader: `Admin account created for ${targetEmail}`,
      overline: "Welcome",
      title: `Your admin account is ${em("ready")}`,
      body,
    }),
  };
}
