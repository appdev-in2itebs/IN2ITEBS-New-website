import { requireAdmin } from "@/lib/admin/session";
import { pictureOptions } from "@/lib/cms/picture-options";
import { takenPaths } from "@/app/admin/(portal)/pages/paths";
import { VisualEditor } from "@/components/admin/visual/visual-editor";
import { refreshPictures } from "@/app/admin/(portal)/builder/actions";
import { pageTargets, saveTarget } from "./actions";

export const metadata = { title: "Visual editor" };

/** The website, editable in place: /admin/site/?path=/services/agile-devops/ opens that page. */
export default async function SitePage({ searchParams }: { searchParams: Promise<{ path?: string }> }) {
  await requireAdmin("site");
  const { path } = await searchParams;
  const start = path && path.startsWith("/") && !path.startsWith("//") && !path.startsWith("/admin") ? path : "/";
  const [pages, pictures] = await Promise.all([takenPaths(), pictureOptions()]);
  return (
    <VisualEditor
      initialPath={start}
      pages={[...pages].sort()}
      pictures={pictures}
      actions={{ targets: pageTargets, save: saveTarget, pictures: refreshPictures }}
    />
  );
}
