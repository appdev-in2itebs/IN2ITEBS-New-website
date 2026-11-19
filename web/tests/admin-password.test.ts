import assert from "node:assert/strict";
import test from "node:test";
import {
  codeRecipients,
  hashCode,
  isOwner,
  newCode,
  ownerEmails,
  PASSWORD_MIN,
  sameHash,
  validPassword,
} from "../lib/admin/password";
import { accountCreatedEmail, passwordChangedEmail, passwordCodeEmail } from "../lib/mail/templates";

test("one-time codes are six digits and never stored in clear", () => {
  for (let i = 0; i < 200; i++) assert.match(newCode(), /^\d{6}$/);
  const ticket = "4c1a6d8e-0000-4000-8000-000000000001";
  const h = hashCode(ticket, "123456");
  assert.match(h, /^[0-9a-f]{64}$/);
  assert.ok(!h.includes("123456"));
  assert.ok(sameHash(h, hashCode(ticket, "123456")));
  assert.ok(!sameHash(h, hashCode(ticket, "123457")), "a different code must not match");
  assert.ok(!sameHash(h, hashCode("4c1a6d8e-0000-4000-8000-000000000002", "123456")), "a code is bound to its ticket");
});

test("new passwords need length, a letter and a number", () => {
  assert.equal(validPassword("Converge-2026"), null);
  assert.match(validPassword("short1") ?? "", new RegExp(`${PASSWORD_MIN}`));
  assert.match(validPassword("0123456789012") ?? "", /letters/);
  assert.match(validPassword("onlylettershere") ?? "", /number/);
});

test("the website owners are the only ones who manage users once ADMIN_OWNER_EMAIL is set", () => {
  const before = process.env.ADMIN_OWNER_EMAIL;
  process.env.ADMIN_OWNER_EMAIL = "Owner@in2itebs.com, second@in2itebs.com";
  assert.deepEqual(ownerEmails(), ["owner@in2itebs.com", "second@in2itebs.com"]);
  assert.ok(isOwner("owner@in2itebs.com") && isOwner("Second@in2itebs.com"));
  assert.ok(!isOwner("someone@in2itebs.com"));
  // Everyone gets their own code; only an owner setting another person's password gets that code.
  assert.deepEqual(codeRecipients("owner@in2itebs.com", "owner@in2itebs.com"), ["owner@in2itebs.com"]);
  assert.deepEqual(codeRecipients("Sales@in2itebs.com", null), ["sales@in2itebs.com"]);
  assert.deepEqual(codeRecipients("sales@in2itebs.com", "sales@in2itebs.com"), ["sales@in2itebs.com"]);
  assert.deepEqual(codeRecipients("sales@in2itebs.com", "second@in2itebs.com"), ["second@in2itebs.com"]);
  delete process.env.ADMIN_OWNER_EMAIL;
  assert.ok(isOwner("someone@in2itebs.com"), "without an owner the old rule (any admin) still applies");
  if (before) process.env.ADMIN_OWNER_EMAIL = before;
});

test("admin emails carry the code, the brand and a plain-text twin, with user text escaped", () => {
  const code = passwordCodeEmail({
    code: "482913",
    purpose: "reset",
    targetEmail: "sales@in2itebs.com",
    requestedBy: null,
    expiresMinutes: 10,
  });
  assert.match(code.subject, /^482913 /);
  assert.ok(code.html.includes("in2it-ebs-logo-pale.png"));
  assert.ok(code.html.includes("#0b1328"), "navy header");
  assert.ok(code.text.includes("One-time code: 482913"));
  for (const d of "482913") assert.ok(code.html.includes(`>${d}</span>`));

  const hostile = passwordCodeEmail({
    code: "000000",
    purpose: "change",
    targetEmail: "<img src=x onerror=alert(1)>@x.com",
    requestedBy: null,
    expiresMinutes: 10,
  });
  assert.ok(!hostile.html.includes("<img src=x"), "addresses are escaped in the HTML");

  const own = passwordCodeEmail({
    code: "111222",
    purpose: "change",
    targetEmail: "sales@in2itebs.com",
    requestedBy: "sales@in2itebs.com",
    expiresMinutes: 10,
    toSelf: true,
  });
  assert.ok(own.text.includes("You want to change your admin password (sales@in2itebs.com)"), own.text);
  assert.ok(own.html.includes("Here is your one-time code"));

  const changed = passwordChangedEmail({
    targetEmail: "hr@in2itebs.com",
    purpose: "change",
    changedBy: "hr@in2itebs.com",
    at: new Date("2026-11-19T10:00:00Z"),
  });
  assert.match(changed.subject, /was changed for hr@in2itebs.com/);
  assert.ok(changed.text.includes("/admin/login/"));

  const welcome = accountCreatedEmail({
    targetEmail: "new@in2itebs.com",
    name: "New Person",
    role: "sales",
    ownerEmail: "owner@in2itebs.com",
  });
  assert.ok(welcome.html.includes("New Person") && welcome.html.includes("owner@in2itebs.com"));
  assert.ok(welcome.text.includes("My account"));
});
