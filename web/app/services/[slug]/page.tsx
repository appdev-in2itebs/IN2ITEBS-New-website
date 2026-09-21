import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { ServicePageV2 } from "@/components/sections/service-page-v2";
import { servicePages, getServicePage } from "@/content/legacy-services";

export async function generateStaticParams() {
  return servicePages.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) return pageMetadata(`/services/${slug}/`, { title: "Service" });
  return pageMetadata(`/services/${page.slug}/`, {
    title: page.metaTitle ?? page.name,
    description: page.metaDescription,
  });
}

/**
 * One template for every service the existing site's menu lists. The copy is the existing page's
 * own (content/legacy-services.ts); the design is the one approved on 2026-09-20 (v2.tsx).
 */
export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getServicePage(slug);
  if (!page) notFound();
  return (
    <>
      <BreadcrumbJsonLd path={`/services/${page.slug}/`} name={page.name} />
      <ServicePageV2 page={page} />
    </>
  );
}
