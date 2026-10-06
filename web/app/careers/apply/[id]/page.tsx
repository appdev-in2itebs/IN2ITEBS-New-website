import { permanentRedirect } from "next/navigation";

/** The application form now sits at the bottom of each job post; old apply links go there. */
export default async function ApplyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  permanentRedirect(`/careers/current-openings/${encodeURIComponent(id)}/#apply`);
}
