import { pageMetadata } from "@/lib/metadata";
import { getCms } from "@/lib/cms/content";
import { BlockList } from "@/components/blocks/render";
import { homeSections } from "@/components/sections/home-sections";
import { getLiveHome } from "@/lib/builder/store";
import { defaultHomeBlocks } from "@/lib/builder/blocks";

export const metadata = pageMetadata("/", {
  title: { absolute: "In2IT EBS — Enterprise transformation under control" },
  description:
    "SAP-led enterprise transformation, advisory, digital engineering and managed operations across more than 30 countries.",
});

export default async function HomePage() {
  const [cms, layout] = await Promise.all([getCms(), getLiveHome()]);
  return (
    <BlockList
      blocks={layout ?? defaultHomeBlocks()}
      ctx={{ sections: homeSections(cms), testimonials: cms.testimonials }}
    />
  );
}
