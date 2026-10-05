import { requireAdmin } from "@/lib/admin/session";
import { getSettings } from "@/lib/cms/store";
import { Card, Field, Notice, PageTitle, input, primaryBtn } from "@/components/admin/ui";
import { saveSettings } from "./actions";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  await requireAdmin("settings");
  const sp = await searchParams;
  const { announcement, contact, chatbot } = await getSettings();

  return (
    <>
      <PageTitle
        title="Site settings"
        intro="Changes reach the live website within about a minute. No rebuild is needed."
      />
      {sp.saved ? <Notice tone="ok">Saved {sp.saved} settings.</Notice> : null}
      {sp.error ? <Notice tone="warn">{sp.error}</Notice> : null}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h2 className="mb-1 text-lg font-semibold">Announcement</h2>
          <p className="mb-4 text-sm text-foreground-muted">
            A small card in the corner of every page, e.g. an event or a new office.
          </p>
          <form action={saveSettings} className="space-y-4">
            <input type="hidden" name="key" value="announcement" />
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" name="enabled" defaultChecked={announcement.enabled} className="h-4 w-4" />
              Show the announcement
            </label>
            <Field label="Text" hint="Up to 200 characters.">
              <textarea name="text" rows={2} maxLength={200} defaultValue={announcement.text} className={input} />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Link (optional)" hint="/careers/current-openings/ or https://…">
                <input name="linkUrl" maxLength={300} defaultValue={announcement.linkUrl} className={input} />
              </Field>
              <Field label="Link text">
                <input name="linkLabel" maxLength={60} defaultValue={announcement.linkLabel} className={input} />
              </Field>
            </div>
            <button type="submit" className={primaryBtn}>
              Save announcement
            </button>
          </form>
        </Card>

        <Card>
          <h2 className="mb-1 text-lg font-semibold">Chat assistant</h2>
          <p className="mb-4 text-sm text-foreground-muted">
            How the assistant introduces itself and the buttons it offers.
          </p>
          <form action={saveSettings} className="space-y-4">
            <input type="hidden" name="key" value="chatbot" />
            <label className="flex items-center gap-2 text-sm font-medium">
              <input type="checkbox" name="enabled" defaultChecked={chatbot.enabled} className="h-4 w-4" />
              Show the assistant on the website
            </label>
            <Field label="Name">
              <input name="name" required maxLength={40} defaultValue={chatbot.name} className={input} />
            </Field>
            <Field label="Greeting">
              <textarea
                name="greeting"
                required
                rows={3}
                maxLength={500}
                defaultValue={chatbot.greeting}
                className={input}
              />
            </Field>
            <Field label="Quick-reply buttons" hint="One per line, up to 8. Keep them short.">
              <textarea name="quickReplies" rows={5} defaultValue={chatbot.quickReplies.join("\n")} className={input} />
            </Field>
            <button type="submit" className={primaryBtn}>
              Save assistant
            </button>
          </form>
        </Card>

        <Card>
          <h2 className="mb-1 text-lg font-semibold">Contact details</h2>
          <p className="mb-4 text-sm text-foreground-muted">Used by the assistant when it cannot answer.</p>
          <form action={saveSettings} className="space-y-4">
            <input type="hidden" name="key" value="contact" />
            <Field label="Enquiries email">
              <input name="email" type="email" required defaultValue={contact.email} className={input} />
            </Field>
            <Field label="HR email">
              <input name="hrEmail" type="email" required defaultValue={contact.hrEmail} className={input} />
            </Field>
            <Field label="Phone">
              <input name="phone" maxLength={40} defaultValue={contact.phone} className={input} />
            </Field>
            <button type="submit" className={primaryBtn}>
              Save contact details
            </button>
          </form>
        </Card>
      </div>
    </>
  );
}
