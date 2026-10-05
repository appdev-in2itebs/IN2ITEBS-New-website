import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin/session";
import { CONTENT_TYPES, type ContentType } from "@/lib/cms/registry";
import { Card, PageTitle } from "@/components/admin/ui";

/** The website-content hub: one card per kind of content the editors can change. */
export default async function ContentHub() {
  await requireAdmin("content");
  const { data: rows } = await supabaseAdmin().from("cms_entries").select("collection");
  const edits = new Map<string, number>();
  for (const r of rows ?? []) edits.set(r.collection, (edits.get(r.collection) ?? 0) + 1);

  return (
    <>
      <PageTitle
        title="Website content"
        intro="Edit the text and pictures visitors see. Every save is live on the website within seconds, every version is kept, and any page can be reset to its original text."
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {(Object.keys(CONTENT_TYPES) as ContentType[]).map((type) => {
          const t = CONTENT_TYPES[type];
          const n = edits.get(t.collection) ?? 0;
          return (
            <Link key={type} href={`/admin/content/${type}/`}>
              <Card className="h-full transition-colors hover:border-action/50">
                <h2 className="text-lg font-semibold text-foreground">{t.label}</h2>
                <p className="mt-1 text-sm text-foreground-muted">{t.intro}</p>
                <p className="mt-3 text-xs font-semibold text-action">{n ? `${n} edited` : "No edits yet"}</p>
              </Card>
            </Link>
          );
        })}
        <Link href="/admin/pages/">
          <Card className="h-full transition-colors hover:border-action/50">
            <h2 className="text-lg font-semibold text-foreground">Page heroes</h2>
            <p className="mt-1 text-sm text-foreground-muted">The title, intro and picture at the top of any page.</p>
          </Card>
        </Link>
        <Link href="/admin/media/">
          <Card className="h-full transition-colors hover:border-action/50">
            <h2 className="text-lg font-semibold text-foreground">Media library</h2>
            <p className="mt-1 text-sm text-foreground-muted">Upload images to use anywhere above.</p>
          </Card>
        </Link>
      </div>
    </>
  );
}
