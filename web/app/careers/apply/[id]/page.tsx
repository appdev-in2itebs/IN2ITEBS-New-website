import { notFound } from "next/navigation";
import { pageMetadata } from "@/lib/metadata";
import { BreadcrumbJsonLd } from "@/components/seo/json-ld";
import { getOpening } from "@/lib/cms/store";
import { V2Hero, V2Section } from "@/components/sections/v2";
import { ApplyForm } from "@/components/forms/apply-form";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const opening = await getOpening(id);
  return pageMetadata(`/careers/apply/${id}/`, {
    title: opening ? `Apply: ${opening.title}` : "Apply",
    description: opening
      ? `Apply for ${opening.title} at In2IT EBS in ${opening.location}. Send us your details and CV online and our HR team will be in touch.`
      : "Apply for a role at In2IT EBS. Send us your details and CV online and our HR team will be in touch.",
  });
}

/** The on-site application for one opening; HR sees what is sent in /admin/applications. */
export default async function ApplyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const opening = await getOpening(id);
  if (!opening) notFound();
  return (
    <>
      <BreadcrumbJsonLd path={`/careers/apply/${opening.id}/`} name={`Apply: ${opening.title}`} />
      <V2Hero
        path={[
          { label: "Career", href: "/careers/" },
          { label: "Current Openings", href: "/careers/current-openings/" },
          { label: "Apply" },
        ]}
        title={opening.title}
        lead={`${opening.employment_type} · ${opening.location}${opening.department ? ` · ${opening.department}` : ""}`}
        cta={false}
        exploreId="apply"
      />
      <V2Section id="apply" eyebrow="Apply" heading="Send your application.">
        <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr]">
          <div className="space-y-6 text-foreground-muted">
            {opening.description ? (
              <div>
                <h3 className="text-h3 font-semibold text-foreground">About the role</h3>
                <p className="mt-3 whitespace-pre-line leading-relaxed">{opening.description}</p>
              </div>
            ) : null}
            {opening.requirements ? (
              <div>
                <h3 className="text-h3 font-semibold text-foreground">What we are looking for</h3>
                <p className="mt-3 whitespace-pre-line leading-relaxed">{opening.requirements}</p>
              </div>
            ) : null}
            {!opening.description && !opening.requirements ? (
              <p className="leading-relaxed">
                Tell us about yourself and attach your CV. Our HR team reads every application and will contact you if
                your profile fits the role.
              </p>
            ) : null}
          </div>
          <ApplyForm openingId={opening.id} title={opening.title} />
        </div>
      </V2Section>
    </>
  );
}
