import { test } from "node:test";
import assert from "node:assert/strict";
import { reply, tokens, type Faq } from "../lib/chatbot/engine";
import { siteIndex } from "../lib/chatbot/site-index";
import { applySchema, chatLeadSchema, cvType } from "../lib/cms/schemas";
import { defaultSettings, readSetting } from "../lib/cms/settings";
import { can, SECTIONS } from "../lib/admin/permissions";
import { csvCell, searchTerm } from "../lib/admin/query";

const faqs: Faq[] = [
  {
    question: "Which SAP services do you offer?",
    answer: "We deliver RISE with SAP and S/4HANA migrations.",
    keywords: ["sap", "s4hana", "rise", "migration"],
    link_url: "/sap-enterprise-solutions/",
    link_label: "SAP Enterprise Solutions",
  },
  { question: "Where are your offices?", answer: "Bangalore and more.", keywords: ["office", "offices", "address"] },
];
const knowledge = {
  faqs,
  site: siteIndex(),
  openings: [
    {
      id: "00000000-0000-0000-0000-000000000001",
      title: "Java Developer",
      location: "Bangalore",
      employment_type: "Full Time",
    },
  ],
};

test("the assistant answers from the best-matching FAQ and links its page", () => {
  const r = reply("Do you do SAP S4HANA migration projects?", knowledge);
  assert.equal(r.intent, "faq");
  assert.equal(r.text, faqs[0].answer);
  assert.deepEqual(r.links, [{ label: "SAP Enterprise Solutions", url: "/sap-enterprise-solutions/" }]);
});

test("a visitor who wants to share a requirement gets the details form", () => {
  for (const text of ["Share my requirement", "can someone call me back?", "I need a quote for Workday"])
    assert.equal(reply(text, knowledge).action, "collect-lead", text);
});

test("careers questions list the open roles", () => {
  const r = reply("are you hiring java developers?", knowledge);
  assert.equal(r.intent, "careers");
  assert.equal(r.openings?.[0].title, "Java Developer");
});

test("questions the FAQs do not cover point to matching site pages", () => {
  const r = reply("tell me about blockchain", { ...knowledge, faqs: [] });
  assert.equal(r.intent, "pages");
  assert.ok(r.links?.some((l) => l.url === "/services/blockchain/"));
});

test("anything unknown gets an honest fallback that offers to take the requirement", () => {
  const r = reply("what is the weather on mars", { ...knowledge, contactEmail: "info@in2itebs.com" });
  assert.equal(r.intent, "fallback");
  assert.match(r.text, /info@in2itebs\.com/);
  assert.ok(r.suggestions?.includes("Share my requirement"));
});

test("greetings are answered briefly with the quick replies", () => {
  const r = reply("Hello", { ...knowledge, quickReplies: ["Our services"] });
  assert.equal(r.intent, "greeting");
  assert.deepEqual(r.suggestions, ["Our services"]);
});

test("tokens drop punctuation and filler words", () => {
  assert.deepEqual(tokens("What is SAP's RISE, please?"), ["sap", "rise"]);
});

test("the site index covers services, industries, partners and the contact page", () => {
  const urls = siteIndex().map((e) => e.url);
  for (const url of ["/services/sap-sac/", "/industries/automobiles/", "/partners/oracle/", "/contact/"])
    assert.ok(urls.includes(url), url);
});

test("a CV is recognised by its first bytes, not its name", () => {
  assert.equal(cvType(new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d]))?.ext, "pdf");
  assert.equal(cvType(new Uint8Array([0x50, 0x4b, 0x03, 0x04]))?.ext, "docx");
  assert.equal(cvType(new Uint8Array([0xd0, 0xcf, 0x11, 0xe0]))?.ext, "doc");
  assert.equal(cvType(new Uint8Array([0x4d, 0x5a, 0x90, 0x00])), null); // a Windows .exe
});

test("the apply form needs consent, a real phone and a LinkedIn link if one is given", () => {
  const ok = {
    openingId: "00000000-0000-4000-8000-000000000001",
    name: "Asha Rao",
    email: "asha@example.com",
    phone: "+91 98450 12345",
    consent: "yes",
  };
  assert.equal(applySchema.safeParse(ok).success, true);
  assert.equal(applySchema.safeParse({ ...ok, consent: undefined }).success, false);
  assert.equal(applySchema.safeParse({ ...ok, phone: "call me" }).success, false);
  assert.equal(applySchema.safeParse({ ...ok, linkedinUrl: "https://evil.example/x" }).success, false);
  assert.equal(applySchema.safeParse({ ...ok, linkedinUrl: "https://www.linkedin.com/in/asha" }).success, true);
});

test("a chat lead needs a name, a valid email and a real requirement", () => {
  const ok = { name: "Ravi", email: "ravi@example.com", requirement: "SuccessFactors rollout for 800 staff" };
  assert.equal(chatLeadSchema.safeParse(ok).success, true);
  assert.equal(chatLeadSchema.safeParse({ ...ok, email: "ravi@" }).success, false);
  assert.equal(chatLeadSchema.safeParse({ ...ok, requirement: "hi" }).success, false);
});

test("stored settings fall back to the defaults field by field", () => {
  assert.equal(readSetting("chatbot", { greeting: "Hello there" }).greeting, "Hello there");
  assert.deepEqual(
    readSetting("chatbot", { greeting: "Hello there" }).quickReplies,
    defaultSettings.chatbot.quickReplies,
  );
  assert.deepEqual(readSetting("contact", { email: "not-an-email" }), defaultSettings.contact);
});

test("each role sees only its own sections of the admin", () => {
  assert.equal(can("admin", "users"), true);
  assert.equal(can("sales", "leads"), true);
  assert.equal(can("sales", "applications"), false);
  assert.equal(can("hr", "applications"), true);
  assert.equal(can("hr", "leads"), false);
  assert.equal(can("editor", "faqs"), true);
  assert.equal(can("editor", "users"), false);
  for (const s of Object.keys(SECTIONS) as (keyof typeof SECTIONS)[]) assert.equal(can("admin", s), true, s);
});

test("CSV cells are quoted and cannot start a spreadsheet formula", () => {
  assert.equal(csvCell('He said "hi"'), '"He said ""hi"""');
  assert.equal(csvCell("=HYPERLINK(1)"), `"'=HYPERLINK(1)"`);
  assert.equal(csvCell(null), '""');
});

test("admin search terms cannot inject PostgREST filter syntax", () => {
  assert.equal(searchTerm("acme),email.eq.(x"), "acme email.eq. x");
});

// ------------------------------------------------------------------ website content (instant CMS)
import { applyEdits } from "../lib/cms/content";
import { sanitize, CONTENT_TYPES } from "../lib/cms/registry";
import { imageInfo } from "../lib/cms/media";
import { servicePages } from "../content/legacy-services";
import { insights } from "../content/insights";

test("an edit is laid over the shipped page, touching only the fields it sets", () => {
  const slug = servicePages[0].slug;
  const cms = applyEdits([{ collection: "service", key: slug, data: { title: "New headline" }, deleted: false }]);
  const page = cms.services.find((p) => p.slug === slug)!;
  assert.equal(page.title, "New headline");
  assert.deepEqual(page.intro, servicePages[0].intro);
  assert.equal(page.name, servicePages[0].name);
  assert.ok(cms.edited.has(`service/${slug}`));
});

test("articles can be hidden, edited and added; new ones come first", () => {
  const [first, second] = insights;
  const cms = applyEdits([
    { collection: "article", key: first.slug, data: {}, deleted: true },
    { collection: "article", key: second.slug, data: { title: "Edited" }, deleted: false },
    {
      collection: "article",
      key: "brand-new",
      data: { slug: "brand-new", title: "Brand new", date: "2026-10-05", category: "AI", excerpt: "x" },
      deleted: false,
    },
  ]);
  assert.equal(cms.articles[0].slug, "brand-new");
  assert.ok(!cms.articles.some((a) => a.slug === first.slug));
  assert.equal(cms.articles.find((a) => a.slug === second.slug)?.title, "Edited");
});

test("an edited list replaces the shipped one; a malformed one is ignored", () => {
  const leaders = [{ slug: "a", name: "A", title: "CEO", bio: "", photo: null }];
  assert.deepEqual(
    applyEdits([{ collection: "leadership", key: "list", data: leaders, deleted: false }]).leadership,
    leaders,
  );
  assert.ok(
    applyEdits([{ collection: "leadership", key: "list", data: { not: "a list" }, deleted: false }]).leadership.length >
      0,
  );
});

test("a submitted form keeps only the defined fields, capped, and only safe pictures", () => {
  const clean = sanitize(
    CONTENT_TYPES.services.fields,
    {
      title: "  Hello  ",
      intro: ["One", "", "Two"],
      heroImage: "https://evil.example/x.png",
      sections: [{ title: "S", bullets: ["a", ""], icon: "zap", evil: "<script>" }],
      injected: "nope",
    },
    (v) => v.startsWith("services/"),
  );
  assert.equal(clean.title, "Hello");
  assert.deepEqual(clean.intro, ["One", "Two"]);
  assert.equal(clean.heroImage, undefined);
  assert.deepEqual(clean.sections, [{ title: "S", bullets: ["a"], icon: "zap" }]);
  assert.equal(clean.injected, undefined);
});

test("uploaded images are recognised by their bytes, with their size", () => {
  const png = new Uint8Array(32);
  png.set([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  png.set([0, 0, 0x06, 0x40], 16); // width 1600
  png.set([0, 0, 0x03, 0x84], 20); // height 900
  assert.deepEqual(imageInfo(png), { ext: "png", mime: "image/png", width: 1600, height: 900 });
  assert.equal(imageInfo(new TextEncoder().encode("<svg xmlns='http://www.w3.org/2000/svg'/>")), null);
});
