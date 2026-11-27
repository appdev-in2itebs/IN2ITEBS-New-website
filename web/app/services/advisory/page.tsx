import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { AdvisoryHubPage } from "@/components/sections/advisory-page";
import { advisoryHub } from "@/content/advisory";
import { getService } from "@/lib/cms/content";

/**
 * The Advisory hub, rebuilt from the owner's production brief of 27 Nov 2026 (content/advisory.ts).
 * A static route, so it takes precedence over app/services/[slug]/ for this one address; the
 * [slug] route no longer prerenders "advisory".
 */
export const metadata = pageMetadata("/services/advisory/", {
  title: { absolute: advisoryHub.metaTitle },
  description: advisoryHub.metaDescription,
});

export default async function AdvisoryHub() {
  const page = await getService("advisory");
  return (
    <>
      <BreadcrumbJsonLd path="/services/advisory/" name="Advisory" />
      <AdvisoryHubPage heroImage={page?.heroImage} />
    </>
  );
}
