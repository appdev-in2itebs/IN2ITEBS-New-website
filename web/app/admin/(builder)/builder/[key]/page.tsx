import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/session";
import { supabaseAdmin } from "@/lib/supabase";
import { isUuid } from "@/lib/admin/query";
import { pictureOptions } from "@/lib/cms/picture-options";
import { HOME_KEY, defaultHomeBlocks, type BuiltPage, type PageDoc } from "@/lib/builder/blocks";
import { PAGE_COLLECTION, getPageRow } from "@/lib/builder/store";
import { SITE_URL } from "@/lib/utils";
import { Builder } from "@/components/admin/builder/builder";
import {
  loadVersion,
  publishPage,
  refreshPictures,
  savePage,
  unpublishPage,
} from "@/app/admin/(portal)/builder/actions";

export const metadata = { title: "Page builder" };

/** One page (or the homepage layout) open in the builder. */
export default async function BuilderPage({ params }: { params: Promise<{ key: string }> }) {
  await requireAdmin("builder");
  const { key } = await params;
  const home = key === HOME_KEY;
  if (!home && !isUuid(key)) notFound();
  const row = await getPageRow(key);
  if (!row && !home) notFound();
  const initial: BuiltPage = row?.data ?? {
    draft: { title: "Homepage", slug: "", blocks: defaultHomeBlocks() },
    live: null,
  };
  const [pictures, history] = await Promise.all([
    pictureOptions(),
    supabaseAdmin()
      .from("cms_history")
      .select("id, action, at, by_email")
      .eq("collection", PAGE_COLLECTION)
      .eq("key", key)
      .in("action", ["save", "publish", "create"])
      .order("at", { ascending: false })
      .limit(30),
  ]);
  return (
    <Builder
      pageKey={key}
      home={home}
      initial={initial}
      pictures={pictures}
      versions={(history.data ?? []).map((v) => ({ id: v.id, action: v.action, at: v.at, by: v.by_email }))}
      siteUrl={SITE_URL}
      actions={{
        save: savePage as (key: string, doc: PageDoc) => ReturnType<typeof savePage>,
        publish: publishPage as (key: string, doc: PageDoc) => ReturnType<typeof publishPage>,
        unpublish: unpublishPage,
        loadVersion,
        pictures: refreshPictures,
      }}
    />
  );
}
