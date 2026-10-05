import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/session";
import { CONTENT_TYPES, isContentType } from "@/lib/cms/registry";
import { formValue, listItems, officeFields } from "@/lib/cms/admin-content";
import { pictureOptions } from "@/lib/cms/picture-options";
import { Badge, Card, Notice, PageTitle, Table, primaryBtn, secondaryBtn, td } from "@/components/admin/ui";
import { ContentForm } from "@/components/admin/content-form";
import { ContentHistory } from "@/components/admin/content-history";
import { resetContent, saveContent } from "../actions";

type Search = { saved?: string; error?: string; reset?: string; restored?: string };

/** A content type: the list of its pages or articles, or (for leadership, offices, testimonials) the list editor itself. */
export default async function ContentTypePage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<Search>;
}) {
  await requireAdmin("content");
  const { type } = await params;
  const sp = await searchParams;
  if (!isContentType(type)) notFound();
  const def = CONTENT_TYPES[type];

  const notices = (
    <>
      {sp.saved ? <Notice tone="ok">Saved and live on the website.</Notice> : null}
      {sp.reset ? <Notice tone="ok">Back to the original text.</Notice> : null}
      {sp.restored ? <Notice tone="ok">That version is live again.</Notice> : null}
      {sp.error ? <Notice tone="warn">{sp.error}</Notice> : null}
    </>
  );

  if (def.shape === "list") {
    const [value, pictures] = await Promise.all([formValue(type, "list"), pictureOptions()]);
    return (
      <>
        <Link href="/admin/content/" className="mb-3 inline-block text-sm text-action hover:underline">
          ← Website content
        </Link>
        <PageTitle title={def.label} intro={def.intro} />
        {notices}
        <div className="grid gap-6 xl:grid-cols-[1fr_18rem]">
          <Card>
            <ContentForm
              fields={type === "offices" ? officeFields() : def.fields}
              initial={value ?? {}}
              action={saveContent}
              hidden={{ type, key: "list" }}
              pictures={pictures}
              footer={
                <button
                  type="submit"
                  formAction={resetContent}
                  className="text-sm text-foreground-muted hover:underline"
                  formNoValidate
                >
                  Reset to original
                </button>
              }
            />
          </Card>
          <ContentHistory type={type} collection={def.collection} itemKey="list" />
        </div>
      </>
    );
  }

  const items = await listItems(type);
  return (
    <>
      <Link href="/admin/content/" className="mb-3 inline-block text-sm text-action hover:underline">
        ← Website content
      </Link>
      <PageTitle
        title={def.label}
        intro={def.intro}
        actions={
          type === "news" ? (
            <Link href="/admin/content/news/new/" className={primaryBtn}>
              Add article
            </Link>
          ) : null
        }
      />
      {notices}
      <Table head={["Page", "Status", ""]} empty={!items.length}>
        {items.map((item) => (
          <tr key={item.key}>
            <td className={td}>
              <Link
                href={`/admin/content/${type}/${encodeURIComponent(item.key)}/`}
                className="font-semibold text-action hover:underline"
              >
                {item.label}
              </Link>
              <span className="block text-xs text-foreground-muted">{item.key}</span>
            </td>
            <td className={td}>
              {item.hidden ? (
                <Badge>removed</Badge>
              ) : item.added ? (
                <Badge>new</Badge>
              ) : item.edited ? (
                <Badge>edited</Badge>
              ) : (
                <Badge>original</Badge>
              )}
            </td>
            <td className={td}>
              <Link href={`/admin/content/${type}/${encodeURIComponent(item.key)}/`} className={secondaryBtn}>
                Edit
              </Link>
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
