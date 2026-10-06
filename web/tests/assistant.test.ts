import { test } from "node:test";
import assert from "node:assert/strict";
import { parse } from "../lib/assistant/extract";
import { missing, pick } from "../lib/assistant/tools";
import { cleanText } from "../lib/assistant/llm";
import { settleCvButton } from "../lib/assistant/agent";
import { addLinks } from "../lib/assistant/links";
import type { UiAction } from "../lib/assistant/tools";
import { searchSite } from "../lib/assistant/knowledge";
import { siteIndex } from "../lib/chatbot/site-index";
import { assistantSchema, readSetting } from "../lib/cms/settings";
import { can } from "../lib/admin/permissions";

const openings = [{ id: "08095360-8478-439c-8884-11bb1715c95a" }];

test("the note-taker's JSON is read defensively", () => {
  const ex = parse(
    'Sure! {"purpose":"job","details":{"Full name":"Asha Rao","Notice period":60,"LinkedIn":"null"},"opening_id":"08095360-8478-439c-8884-11bb1715c95a","screening":{"question":"Q1?","answer":"A1"},"confirmed":true,"declined_cv":false,"summary":"x","fit_score":"87"} thanks',
    openings,
  );
  assert.equal(ex.purpose, "job");
  assert.deepEqual(ex.details, { "Full name": "Asha Rao", "Notice period": "60" });
  assert.equal(ex.openingId, openings[0].id);
  assert.deepEqual(ex.screening, { question: "Q1?", answer: "A1" });
  assert.equal(ex.confirmed, true);
  assert.equal(ex.fitScore, 87);
});

test("the note-taker cannot invent an opening, a purpose or a score", () => {
  const ex = parse('{"purpose":"hack","opening_id":"not-an-opening","confirmed":"yes","fit_score":500}', openings);
  assert.equal(ex.purpose, null);
  assert.equal(ex.openingId, null);
  assert.equal(ex.confirmed, false);
  assert.equal(ex.fitScore, 100);
  assert.equal(parse("no json at all", openings).purpose, null);
});

test("remembered answers are found by meaning, and a company name is not a person's name", () => {
  const p = {
    "Company name": "Acme",
    "Full name": "Asha Rao",
    "Work email": "a@acme.com",
    "Phone number (with country code)": "+91 9",
  };
  assert.equal(pick(p, /\bname\b/i, /compan/i), "Asha Rao");
  assert.equal(pick(p, /e-?mail/i), "a@acme.com");
  assert.deepEqual(missing(["Full name", "Timeline", "Budget range (optional)"], p), ["Timeline"]);
});

test("a reasoning model's thinking never reaches the visitor", () => {
  assert.equal(cleanText("<think>plan the answer</think>Hello!"), "Hello!");
  assert.equal(cleanText("half a thought</think> Hi"), "Hi");
});

test("site search finds the right page", () => {
  const hits = searchSite(siteIndex(), [], "RISE with SAP");
  assert.ok(hits.some((h) => h.url === "/services/rise-with-sap/"));
});

test("assistant settings have safe defaults and reject nonsense", () => {
  const d = assistantSchema.parse({});
  assert.equal(d.model, "nvidia/nemotron-3-super-120b-a12b");
  assert.ok(d.leadQuestions.length > 3 && d.candidateQuestions.length > 3);
  assert.equal(readSetting("assistant", { temperature: 7 }).temperature, assistantSchema.parse({}).temperature);
  assert.ok(can("editor", "assistant") && !can("sales", "assistant"));
});

test("guardrails: only an explicit off-topic verdict blocks a message", () => {
  const blocked = parse('{"on_topic": false, "off_topic_reason": "homework"}', openings);
  assert.equal(blocked.onTopic, false);
  assert.equal(blocked.offTopicReason, "homework");
  assert.equal(parse('{"on_topic": true}', openings).onTopic, true);
  // A missing or malformed verdict never blocks a genuine visitor.
  assert.equal(parse('{"purpose": "sales"}', openings).onTopic, true);
  assert.equal(parse("not json", openings).onTopic, true);
});

test("the CV upload button appears only at the CV step of a job application", () => {
  const job = { purpose: "job" as const, openingId: "08095360-8478-439c-8884-11bb1715c95a" };
  const run = (text: string, state: object, actions: UiAction[] = []) => {
    settleCvButton(actions, text, state);
    return actions.some((a) => a.type === "cv_upload");
  };
  assert.equal(run("Please upload your CV using the button below.", job), true);
  assert.equal(run("Could you attach your resume (PDF or Word)?", job), true);
  assert.equal(run("कृपया अपना सीवी अपलोड करें।", job), true);
  // Mentions are not requests.
  assert.equal(run("Our HR team reads every CV carefully.", job), false);
  assert.equal(run("Thanks! What is your notice period?", job), false);
  // Not at the CV step.
  assert.equal(run("Please upload your CV.", { purpose: "sales" }), false);
  assert.equal(run("Please upload your CV.", { purpose: "job" }), false);
  assert.equal(run("Please upload your CV.", { ...job, cvPath: "chat/2026/x.pdf" }), false);
  assert.equal(run("Please upload your CV.", { ...job, applicationId: "a" }), false);
  // A tool request outside the CV step is withdrawn.
  assert.equal(run("Sure.", { purpose: "sales" }, [{ type: "cv_upload" }]), false);
  assert.equal(run("Here is the button.", job, [{ type: "cv_upload" }]), true);
});

test("answers link the website's own pages", () => {
  const index = siteIndex();
  const linked = addLinks("We offer SAP Enterprise Solutions and Digital Services. Our RISE with SAP team can help.", {
    index,
    faqs: [],
  });
  assert.match(linked, /\[SAP Enterprise Solutions\]\(\/[^)]+\)/);
  assert.match(linked, /\[Digital Services\]\(\/[^)]+\)/);
  assert.match(linked, /\[RISE with SAP\]\(\/services\/rise-with-sap\/\)/);
  // Not twice, and never inside an existing link.
  const once = addLinks("See [RISE with SAP](/services/rise-with-sap/). RISE with SAP is our offer.", {
    index,
    faqs: [],
  });
  assert.equal(once.match(/\(\/services\/rise-with-sap\/\)/g)?.length, 1);
  // A bare path becomes a proper link.
  assert.match(addLinks("The contact page lists every office. [/contact/]", { index, faqs: [] }), /\]\(\/contact\/\)/);
  // A question answered without links gets one; a non-question does not.
  assert.match(
    addLinks("Yes, we do.", { index, faqs: [], question: "Do you do SAP S/4HANA migration?" }),
    /Read more: \[/,
  );
  assert.doesNotMatch(addLinks("Thanks, noted.", { index, faqs: [], question: "Pune" }), /Read more/);
  // Bare paths the model copies after names become links, without doubles.
  const tidy = addLinks(
    "- [Digital Services](/services/digital-services/) (/services/digital-services/)\n- Analytics (/services/sap-sac/)",
    {
      index,
      faqs: [],
    },
  );
  assert.equal(tidy.includes("(/services/digital-services/) (/services/digital-services/)"), false);
  assert.match(tidy, /\[Analytics\]\(\/services\/sap-sac\/\)/);
  // A short name is never linked inside a longer one; names of several words match in any case.
  const nested = addLinks("Our Data Analytics & AI portfolio and our digital services.", { index, faqs: [] });
  assert.match(nested, /\[Data Analytics & AI\]\(\/services\/data-analytics-ai\/\)/);
  assert.doesNotMatch(nested, /Data \[Analytics\]/);
  assert.match(nested, /\[digital services\]\(\/services\/digital-services\/\)/);
});

test("the leadership and the global footprint are found and linked", () => {
  const index = siteIndex();
  assert.equal(searchSite(index, [], "who is the coo")[0]?.title, "Sudhansu Mishra");
  assert.equal(searchSite(index, [], "who is the MD of the company")[0]?.url, "/about/our-leadership/");
  assert.ok(searchSite(index, [], "global footprint").some((h) => h.url === "/contact/"));
  const team = addLinks("Rudra Shankar Shatapathy leads the company with Sudhansu Mishra and Abhijit Shukla.", {
    index,
    faqs: [],
  });
  assert.match(team, /\[Rudra Shankar Shatapathy\]\(\/about\/our-leadership\/\)/);
  assert.match(team, /\[Sudhansu Mishra\]\(\/about\/#leadership\)/);
  assert.match(team, /\[Abhijit Shukla\]\(\/about\/#leadership\)/);
});

test("location, team and contact questions link the website's own sections", () => {
  const index = siteIndex();
  const links = (q: string) =>
    [...addLinks("Here you go.", { index, faqs: [], question: q }).matchAll(/\]\(([^)]+)\)/g)].map((m) => m[1]);
  assert.deepEqual(links("Where are your offices?"), ["/#offices", "/about/#footprint", "/contact/"]);
  assert.deepEqual(links("What is the global footprint of this company?"), [
    "/#offices",
    "/about/#footprint",
    "/contact/",
  ]);
  assert.deepEqual(links("Who is the MD?"), ["/#team", "/about/#leadership"]);
  assert.deepEqual(links("Tell me about your team"), ["/#team", "/about/#leadership"]);
  assert.deepEqual(links("How can I contact you?"), ["/contact/"]);
  // Not for a service question that happens to mention a team.
  assert.equal(links("Can your team help with SAP S/4HANA?").includes("/#team"), false);
  for (const q of [
    "What is your company location?",
    "Global presence?",
    "In which cities are you present?",
    "आपका ऑफिस कहाँ है?",
  ])
    assert.equal(links(q)[0], "/#offices", q);
  assert.equal(links("Do you offer AI-based analytics?").includes("/#offices"), false);
  // Links the answer already has are not repeated.
  const once = addLinks("See the [Contact and offices](/contact/) page.", {
    index,
    faqs: [],
    question: "Where are you located?",
  });
  assert.equal(once.match(/\(\/contact\/\)/g)?.length, 1);
});

test("a link called 'here' gets the section's name", () => {
  assert.match(
    addLinks("See the map [here](/#offices).", { index: siteIndex(), faqs: [] }),
    /\[Global footprint: Where we are \(office map\)\]\(\/#offices\)/,
  );
});
