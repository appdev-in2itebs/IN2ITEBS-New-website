import Link from "next/link";
import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin/session";
import { pictureOptions, recentPictures } from "@/lib/cms/picture-options";
import { Card, Field, Notice, PageTitle, input, primaryBtn } from "@/components/admin/ui";
import { PicturePreview, PictureSelect } from "@/components/admin/picture-select";
import { saveHero } from "../actions";
import { editablePaths } from "../paths";

export default async function EditHeroPage({
  searchParams,
}: {
  searchParams: Promise<{ path?: string; saved?: string; error?: string }>;
}) {
  await requireAdmin("pages");
  const sp = await searchParams;
  const path = sp.path ?? "";
  if (!(await editablePaths()).includes(path)) notFound();
  const [{ data: h }, recent, all] = await Promise.all([
    supabaseAdmin().from("page_heroes").select("*").eq("path", path).maybeSingle(),
    recentPictures({ heroPath: path }),
    pictureOptions(),
  ]);

  return (
    <>
      <Link href="/admin/pages/" className="mb-3 inline-block text-sm text-action hover:underline">
        ← All pages
      </Link>
      <PageTitle
        title={`Hero: ${path}`}
        intro="Leave a field empty to keep what the page shows today. Saving puts the change live within seconds."
      />
      {sp.saved ? (
        <Notice tone="ok">
          Saved and live.{" "}
          <Link href={path} target="_blank" className="font-semibold underline">
            Open the page
          </Link>
        </Notice>
      ) : null}
      {sp.error ? <Notice tone="warn">That did not save. Please try again.</Notice> : null}
      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card>
          <form action={saveHero} className="space-y-4">
            <input type="hidden" name="path" value={path} />
            <Field label="Title" hint="The big headline. Up to 160 characters.">
              <input name="title" maxLength={160} defaultValue={h?.title ?? ""} className={input} />
            </Field>
            <Field label="Intro text" hint="The paragraph under the headline. Up to 600 characters.">
              <textarea name="intro" rows={4} maxLength={600} defaultValue={h?.intro ?? ""} className={input} />
            </Field>
            <Field
              label="Picture"
              hint="Pictures used before on this page are listed first. Upload new images under Media library."
            >
              <PictureSelect name="image_key" value={h?.image_key} options={[...recent, ...all]} />
            </Field>
            <button type="submit" className={primaryBtn}>
              Save and publish
            </button>
          </form>
        </Card>
        <Card>
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-foreground-muted">Saved picture</p>
          <PicturePreview value={h?.image_key} />
        </Card>
      </div>
    </>
  );
}
