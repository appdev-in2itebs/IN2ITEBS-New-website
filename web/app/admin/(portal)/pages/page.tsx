import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase";
import { requireAdmin } from "@/lib/admin/session";
import { PageTitle, Table, input, secondaryBtn, td, when } from "@/components/admin/ui";
import { editablePaths } from "./paths";

export default async function PagesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  await requireAdmin("pages");
  const sp = await searchParams;
  const { data: heroes } = await supabaseAdmin()
    .from("page_heroes")
    .select("path, title, intro, image_key, updated_at, updated_by");
  const byPath = new Map((heroes ?? []).map((h) => [h.path, h]));
  const q = (sp.q ?? "").trim().toLowerCase();
  const paths = (await editablePaths()).filter((p) => !q || p.includes(q));

  return (
    <>
      <PageTitle
        title="Page heroes"
        intro="Change the title, intro text or picture at the top of any page. A save is live on the website within seconds."
      />
      <form className="mb-4 flex gap-3" role="search">
        <input name="q" defaultValue={q} placeholder="Filter pages, e.g. services or sap" className={input} />
        <button type="submit" className={secondaryBtn}>
          Filter
        </button>
      </form>
      <Table head={["Page", "Edited title", "Picture", "Last edit", ""]} empty={!paths.length}>
        {paths.map((p) => {
          const h = byPath.get(p);
          return (
            <tr key={p}>
              <td className={td}>
                <Link href={p} target="_blank" className="text-action hover:underline">
                  {p}
                </Link>
              </td>
              <td className={`${td} max-w-72 truncate`}>
                {h?.title ?? <span className="text-foreground-muted">page default</span>}
              </td>
              <td className={`${td} max-w-48 truncate text-xs`}>
                {h?.image_key ? (
                  h.image_key.startsWith("https://") ? (
                    "uploaded image"
                  ) : (
                    h.image_key
                  )
                ) : (
                  <span className="text-foreground-muted">default</span>
                )}
              </td>
              <td className={`${td} whitespace-nowrap text-xs`}>
                {h ? `${when(h.updated_at)} · ${h.updated_by ?? ""}` : "—"}
              </td>
              <td className={td}>
                <Link
                  href={`/admin/pages/edit/?path=${encodeURIComponent(p)}`}
                  className="font-semibold text-action hover:underline"
                >
                  Edit
                </Link>
              </td>
            </tr>
          );
        })}
      </Table>
    </>
  );
}
