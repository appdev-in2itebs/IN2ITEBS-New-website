import { requireAdmin } from "@/lib/admin/session";
import { listMedia } from "@/lib/cms/media";
import { Card, Field, Notice, PageTitle, input, primaryBtn, when } from "@/components/admin/ui";
import { deleteMedia, updateAlt } from "./actions";

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string }>;
}) {
  await requireAdmin("media");
  const sp = await searchParams;
  const media = await listMedia(300);

  return (
    <>
      <PageTitle
        title="Media library"
        intro="Upload images here, then choose them as a page's hero picture, an article's cover, a leader's photo or a section picture."
      />
      {sp.saved === "deleted" ? <Notice tone="ok">Image deleted.</Notice> : null}
      {sp.saved === "alt" ? <Notice tone="ok">Description saved.</Notice> : null}
      {sp.saved && /^\d+$/.test(sp.saved) ? <Notice tone="ok">{sp.saved} image(s) uploaded.</Notice> : null}
      {sp.error ? <Notice tone="warn">{sp.error}</Notice> : null}
      <Card className="mb-6">
        <form
          action="/admin/media/upload/"
          method="post"
          encType="multipart/form-data"
          className="grid gap-4 md:grid-cols-[1fr_1fr_auto] md:items-end"
        >
          <Field label="Images" hint="PNG, JPG or WebP, up to 5 MB each. Wide images around 1600 px work best.">
            <input
              name="files"
              type="file"
              multiple
              required
              accept="image/png,image/jpeg,image/webp"
              className="mt-1 block w-full text-sm text-foreground-muted file:mr-3 file:rounded-full file:border-0 file:bg-action file:px-4 file:py-2 file:text-sm file:font-semibold file:text-on-action"
            />
          </Field>
          <Field
            label="Description (alt text)"
            hint="What the picture shows. Used by screen readers and search engines."
          >
            <input name="alt" maxLength={200} className={input} />
          </Field>
          <button type="submit" className={primaryBtn}>
            Upload
          </button>
        </form>
      </Card>
      {media.length ? (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {media.map((m) => (
            <li key={m.id}>
              <Card className="flex h-full flex-col gap-3 p-3">
                {/* eslint-disable-next-line @next/next/no-img-element -- admin thumbnail of an uploaded image */}
                <img
                  src={m.url}
                  alt={m.alt}
                  loading="lazy"
                  className="h-40 w-full rounded-lg bg-surface-subtle object-contain"
                />
                <p className="text-xs text-foreground-muted">
                  {m.width && m.height ? `${m.width}×${m.height}` : ""} {when(m.created_at)}
                </p>
                <form action={updateAlt} className="flex gap-2">
                  <input type="hidden" name="id" value={m.id} />
                  <input
                    name="alt"
                    defaultValue={m.alt}
                    maxLength={200}
                    aria-label="Description"
                    className={`${input} mt-0`}
                  />
                  <button type="submit" className="text-xs font-semibold text-action hover:underline">
                    Save
                  </button>
                </form>
                <div className="mt-auto flex items-center justify-between text-xs">
                  <a
                    href={m.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-action hover:underline"
                  >
                    Open
                  </a>
                  <form action={deleteMedia}>
                    <input type="hidden" name="id" value={m.id} />
                    <button type="submit" className="text-foreground-muted hover:text-foreground hover:underline">
                      Delete
                    </button>
                  </form>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      ) : (
        <Card>
          <p className="text-sm text-foreground-muted">No images yet. Upload the first one above.</p>
        </Card>
      )}
    </>
  );
}
