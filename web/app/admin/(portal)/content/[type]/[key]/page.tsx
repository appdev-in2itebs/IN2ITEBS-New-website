import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/session";
import { CONTENT_TYPES, isContentType, pathsToRefresh } from "@/lib/cms/registry";
import { formValue, listItems } from "@/lib/cms/admin-content";
import { originalPicture, pictureOptions, recentPictures } from "@/lib/cms/picture-options";
import { supabaseAdmin } from "@/lib/supabase";
import { Card, Notice, PageTitle, secondaryBtn } from "@/components/admin/ui";
import { ContentForm } from "@/components/admin/content-form";
import { ContentHistory } from "@/components/admin/content-history";
import { deleteArticle, resetContent, saveContent, showOwnPicture } from "../../actions";
import { insights } from "@/content/insights";

/** The editor for one service, industry or partner page, or one article. */
export default async function ContentItemPage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string; key: string }>;
  searchParams: Promise<{ saved?: string; error?: string; reset?: string; restored?: string }>;
}) {
  await requireAdmin("content");
  const { type, key: rawKey } = await params;
  const key = decodeURIComponent(rawKey);
  const sp = await searchParams;
  if (!isContentType(type) || CONTENT_TYPES[type].shape === "list") notFound();
  const def = CONTENT_TYPES[type];
  const [value, all, items, recent] = await Promise.all([
    formValue(type, key),
    pictureOptions(),
    listItems(type),
    recentPictures({ collection: def.collection, key, original: originalPicture(type, key) }),
  ]);
  const pictures = [...recent, ...all];
  if (!value) notFound();
  const item = items.find((i) => i.key === key);
  const isNew = type === "news" && key === "new";
  const livePath = isNew || item?.hidden ? null : pathsToRefresh(type, key)[0].path;
  const shippedArticle = type === "news" && insights.some((a) => a.slug === key);
  // A picture chosen in Page heroes shows instead of this page's own: say so, so it is never a mystery.
  const { data: heroPicture } =
    livePath && def.shape === "pages"
      ? await supabaseAdmin().from("page_heroes").select("image_key").eq("path", livePath).maybeSingle()
      : { data: null };

  return (
    <>
      <Link href={`/admin/content/${type}/`} className="mb-3 inline-block text-sm text-action hover:underline">
        ← {def.label}
      </Link>
      <PageTitle
        title={isNew ? "New article" : (item?.label ?? key)}
        intro={item?.hidden ? "This article is removed from the website. Reset it to bring it back." : undefined}
        actions={
          livePath ? (
            <Link href={livePath} target="_blank" className={secondaryBtn}>
              View on the website
            </Link>
          ) : null
        }
      />
      {sp.saved ? <Notice tone="ok">Saved and live on the website.</Notice> : null}
      {sp.reset ? <Notice tone="ok">Back to the original text.</Notice> : null}
      {sp.restored ? <Notice tone="ok">That version is live again.</Notice> : null}
      {sp.error ? <Notice tone="warn">{sp.error}</Notice> : null}
      {heroPicture?.image_key ? (
        <Notice tone="warn">
          This page currently shows a picture chosen in{" "}
          <Link
            href={`/admin/pages/edit/?path=${encodeURIComponent(livePath ?? "")}`}
            className="font-semibold underline"
          >
            Page heroes
          </Link>
          , not the Hero picture below. Choosing a different Hero picture here and saving replaces it.
          <form action={showOwnPicture} className="mt-2">
            <input type="hidden" name="type" value={type} />
            <input type="hidden" name="key" value={key} />
            <button type="submit" className="font-semibold text-action underline">
              Show this page&apos;s Hero picture instead
            </button>
          </form>
        </Notice>
      ) : null}
      <div className="grid gap-6 xl:grid-cols-[1fr_18rem]">
        <Card>
          <ContentForm
            fields={def.fields}
            initial={value}
            action={saveContent}
            hidden={{ type, key }}
            pictures={pictures}
            submitLabel={isNew ? "Publish article" : "Save and publish"}
            footer={
              isNew ? null : (
                <>
                  {item?.edited ? (
                    <button
                      type="submit"
                      formAction={resetContent}
                      formNoValidate
                      className="text-sm text-foreground-muted hover:underline"
                    >
                      {type === "news" && !shippedArticle
                        ? "Delete article"
                        : item?.hidden
                          ? "Bring back the original"
                          : "Reset to original"}
                    </button>
                  ) : null}
                  {type === "news" && !item?.hidden ? (
                    <button
                      type="submit"
                      formAction={deleteArticle}
                      formNoValidate
                      className="text-sm text-foreground-muted hover:underline"
                    >
                      Remove from the website
                    </button>
                  ) : null}
                </>
              )
            }
          />
        </Card>
        {isNew ? null : <ContentHistory type={type} collection={def.collection} itemKey={key} />}
      </div>
    </>
  );
}
