import { requireAdmin } from "@/lib/admin/session";
import { BuilderCanvas } from "@/components/admin/builder/canvas";

export const metadata = { title: "Builder canvas" };

/** The page builder's live preview, loaded in the builder's iframe. It draws what the builder sends. */
export default async function CanvasPage() {
  await requireAdmin("builder");
  return <BuilderCanvas />;
}
