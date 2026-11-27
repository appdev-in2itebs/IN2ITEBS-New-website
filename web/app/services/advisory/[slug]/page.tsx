import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { AdvisoryServicePage } from "@/components/sections/advisory-page";
import { advisoryPages, getAdvisoryPage } from "@/content/advisory";

/** The four Advisory service pages (owner's production brief, 27 Nov 2026). */
export const dynamicParams = false;

export function generateStaticParams() {
  return advisoryPages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getAdvisoryPage(slug);
  if (!page) return pageMetadata(`/services/advisory/${slug}/`, { title: "Advisory" });
  return pageMetadata(`/services/advisory/${page.slug}/`, {
    title: { absolute: page.metaTitle },
    description: page.metaDescription,
  });
}

export default async function AdvisoryService({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getAdvisoryPage(slug);
  if (!page) notFound();
  return (
    <>
      <BreadcrumbJsonLd path={`/services/advisory/${page.slug}/`} name={page.name} />
      <AdvisoryServicePage page={page} />
    </>
  );
}
