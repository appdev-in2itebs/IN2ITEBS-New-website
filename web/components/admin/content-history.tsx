import { history } from "@/lib/cms/admin-content";
import { restoreVersion } from "@/app/admin/(portal)/content/actions";
import { Card, when } from "./ui";

const labels: Record<string, string> = {
  save: "Saved",
  reset: "Reset to original",
  delete: "Removed",
  restore: "Restored",
};

/** The last saved versions of one item, each restorable in one click. */
export async function ContentHistory({
  type,
  collection,
  itemKey,
}: {
  type: string;
  collection: string;
  itemKey: string;
}) {
  const rows = await history(collection, itemKey);
  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground-muted">History</h2>
      {rows.length ? (
        <ol className="space-y-2 text-sm">
          {rows.map((r, i) => (
            <li key={r.id} className="flex items-center justify-between gap-3">
              <span>
                <span className="font-medium text-foreground">{labels[r.action] ?? r.action}</span>
                <span className="block text-xs text-foreground-muted">
                  {when(r.at)} · {r.by_email}
                </span>
              </span>
              {i > 0 && r.action !== "delete" ? (
                <form action={restoreVersion}>
                  <input type="hidden" name="type" value={type} />
                  <input type="hidden" name="key" value={itemKey} />
                  <input type="hidden" name="version" value={r.id} />
                  <button type="submit" className="text-xs font-semibold text-action hover:underline">
                    Restore
                  </button>
                </form>
              ) : i === 0 ? (
                <span className="text-xs text-foreground-muted">live</span>
              ) : null}
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-sm text-foreground-muted">Not edited yet: the website shows its original text.</p>
      )}
    </Card>
  );
}
