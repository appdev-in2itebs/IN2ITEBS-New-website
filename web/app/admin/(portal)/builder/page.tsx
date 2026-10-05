import Link from "next/link";
import { requireAdmin } from "@/lib/admin/session";
import { listPages, getPageRow } from "@/lib/builder/store";
import { HOME_KEY } from "@/lib/builder/blocks";
import {
  Badge,
  Card,
  Field,
  Notice,
  PageTitle,
  Table,
  input,
  primaryBtn,
  secondaryBtn,
  td,
  when,
} from "@/components/admin/ui";
import { ConfirmSubmit } from "@/components/admin/confirm-submit";
import { createPage, deletePage, duplicatePage } from "./actions";

export const metadata = { title: "Page builder" };

/** The page builder's start screen: the homepage layout, a new-page form and every page made here. */
export default async function BuilderList({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; deleted?: string }>;
}) {
  await requireAdmin("builder");
  const { error, deleted } = await searchParams;
  const [pages, home] = await Promise.all([listPages(), getPageRow(HOME_KEY)]);

  return (
    <>
      <PageTitle
        title="Page builder"
        intro="Build pages from ready-made blocks: drag them into order, edit them on the right and see the result as you type. Pages stay as drafts until you press Publish."
      />
      {error ? <Notice tone="warn">{error}</Notice> : null}
      {deleted ? <Notice tone="ok">The page was deleted. Its versions are kept in the history.</Notice> : null}

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <h2 className="text-lg font-semibold text-foreground">Homepage layout</h2>
          <p className="mt-1 text-sm text-foreground-muted">
            Drag the homepage&apos;s sections into a new order, take some out, or add your own blocks between them.
          </p>
          <p className="mt-3 text-xs text-foreground-muted">
            {home?.data.live ? `Custom layout published ${when(home.data.publishedAt)}` : "Original layout"}
            {home && JSON.stringify(home.data.draft) !== JSON.stringify(home.data.live) ? " · unpublished changes" : ""}
          </p>
          <Link href={`/admin/builder/${HOME_KEY}/`} className={`${primaryBtn} mt-4`}>
            Edit homepage layout
          </Link>
        </Card>

        <Card>
          <h2 className="text-lg font-semibold text-foreground">New page</h2>
          <form action={createPage} className="mt-3 grid gap-3 sm:grid-cols-2">
            <Field label="Title">
              <input name="title" required maxLength={120} className={input} placeholder="SAP Health Check offer" />
            </Field>
            <Field label="Address (optional)" hint="Made from the title if empty.">
              <input name="slug" maxLength={180} className={input} placeholder="offers/sap-health-check" />
            </Field>
            <Field label="Start from">
              <select name="template" className={input} defaultValue="landing">
                <option value="landing">Landing page (hero, picture and text, cards, quote, enquiry form)</option>
                <option value="service">Service page (hero, overview, cards, numbers, FAQ, call to action)</option>
                <option value="blank">Blank (hero only)</option>
              </select>
            </Field>
            <div className="flex items-end">
              <button type="submit" className={primaryBtn}>
                Create and open the builder
              </button>
            </div>
          </form>
        </Card>
      </div>

      <h2 className="mb-3 mt-10 text-lg font-semibold text-foreground">Your pages</h2>
      <Table head={["Page", "Address", "Status", "Last saved", ""]} empty={!pages.length}>
        {pages.map((r) => {
          const live = r.data.live;
          const changed = live && JSON.stringify(r.data.draft) !== JSON.stringify(live);
          return (
            <tr key={r.key}>
              <td className={td}>
                <Link href={`/admin/builder/${r.key}/`} className="font-semibold text-action hover:underline">
                  {r.data.draft.title}
                </Link>
                <span className="block text-xs text-foreground-muted">{r.data.draft.blocks.length} blocks</span>
              </td>
              <td className={td}>
                {live ? (
                  <a href={`/${live.slug}/`} target="_blank" rel="noreferrer" className="text-action hover:underline">
                    /{live.slug}/
                  </a>
                ) : (
                  <span className="text-foreground-muted">/{r.data.draft.slug}/</span>
                )}
              </td>
              <td className={td}>
                <Badge>{live ? (changed ? "changes waiting" : "published") : "draft"}</Badge>
              </td>
              <td className={td}>
                {when(r.updated_at)}
                <span className="block text-xs text-foreground-muted">{r.updated_by}</span>
              </td>
              <td className={`${td} whitespace-nowrap text-right`}>
                <div className="flex justify-end gap-2">
                  <Link href={`/admin/builder/${r.key}/`} className={secondaryBtn}>
                    Edit
                  </Link>
                  <form action={duplicatePage}>
                    <input type="hidden" name="key" value={r.key} />
                    <button type="submit" className={secondaryBtn}>
                      Duplicate
                    </button>
                  </form>
                  <form action={deletePage}>
                    <input type="hidden" name="key" value={r.key} />
                    <ConfirmSubmit
                      className={secondaryBtn}
                      message={
                        live ? "Delete this page? It comes off the website straight away." : "Delete this draft page?"
                      }
                    >
                      Delete
                    </ConfirmSubmit>
                  </form>
                </div>
              </td>
            </tr>
          );
        })}
      </Table>
    </>
  );
}
