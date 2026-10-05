import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlockList } from "@/components/blocks/render";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { getLivePage } from "@/lib/builder/store";
import { getCms } from "@/lib/cms/content";
import { pageMetadata } from "@/lib/metadata";

/**
 * Pages made in the admin's page builder, at the address chosen there. Every route the site's code
 * defines takes precedence over this catch-all, so a builder page can never replace one. Rendered
 * per request, so Publish is live at once and an unpublished page disappears at once.
 */
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string[] }> };

const slugOf = async (params: Props["params"]) => (await params).slug.map(decodeURIComponent).join("/");

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = await getLivePage(await slugOf(params));
  if (!page) return {};
  return pageMetadata(`/${page.slug}/`, {
    title: page.title,
    description: page.description || undefined,
  });
}

export default async function BuiltPage({ params }: Props) {
  const page = await getLivePage(await slugOf(params));
  if (!page) notFound();
  const usesTestimonials = page.blocks.some((b) => b.type === "testimonials");
  const testimonials = usesTestimonials ? (await getCms()).testimonials : undefined;
  return (
    <>
      <BreadcrumbJsonLd path={`/${page.slug}/`} name={page.title} />
      <BlockList blocks={page.blocks} ctx={{ testimonials }} />
    </>
  );
}
