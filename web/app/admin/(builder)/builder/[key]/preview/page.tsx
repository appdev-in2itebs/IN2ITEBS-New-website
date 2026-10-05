import Link from "next/link";
import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin/session";
import { isUuid } from "@/lib/admin/query";
import { getCms } from "@/lib/cms/content";
import { HOME_KEY, defaultHomeBlocks } from "@/lib/builder/blocks";
import { getPageRow } from "@/lib/builder/store";
import { BlockList } from "@/components/blocks/render";
import { homeSections } from "@/components/sections/home-sections";

export const metadata = { title: "Preview" };

/** The saved draft as visitors would see it, before it is published. Only signed-in editors can open it. */
export default async function PreviewPage({ params }: { params: Promise<{ key: string }> }) {
  await requireAdmin("builder");
  const { key } = await params;
  const home = key === HOME_KEY;
  if (!home && !isUuid(key)) notFound();
  const row = await getPageRow(key);
  if (!row && !home) notFound();
  const cms = await getCms();
  const blocks = row?.data.draft.blocks ?? defaultHomeBlocks();
  return (
    <>
      <div className="theme-on-brand sticky top-0 z-[60] flex items-center justify-between gap-4 bg-brand px-4 py-2 text-sm text-on-brand">
        <span>
          <strong>Preview</strong> · the saved draft of {home ? "the homepage" : `“${row?.data.draft.title}”`}. Visitors
          do not see this until it is published.
        </span>
        <Link href={`/admin/builder/${key}/`} className="font-semibold underline">
          Back to the builder
        </Link>
      </div>
      <BlockList
        blocks={blocks}
        ctx={{ testimonials: cms.testimonials, sections: home ? homeSections(cms) : undefined }}
      />
    </>
  );
}
