import { query } from "@/lib/db";
import type { ContentBlock } from "@/lib/types";
import { updateContentAction } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const rows = await query<ContentBlock>(
    "select * from content_blocks order by key"
  );

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Content</span>
        <h1 className="h2 mt-3">The copy.</h1>
        <p className="mt-2 text-sm muted">
          Editable blocks. The public pages read the source files for now; wiring these
          to the live site is the next step.
        </p>
      </div>

      <div className="space-y-3">
        {rows.map((row) => (
          <form
            key={row.key}
            action={updateContentAction}
            className="border border-[var(--line)] bg-bone p-4"
          >
            <input type="hidden" name="key" value={row.key} />
            <div className="flex items-center justify-between gap-3">
              <span className="text-[0.62rem] uppercase tracking-[0.18em] text-[var(--color-forest)]">
                {row.key}
              </span>
              <span className="text-[0.6rem] text-fog">
                {new Date(row.updated_at).toLocaleDateString()}
              </span>
            </div>
            <textarea
              name="value"
              defaultValue={row.value}
              rows={3}
              className="field mt-2"
            />
            <button type="submit" className="btn mt-3">Save</button>
          </form>
        ))}
        {rows.length === 0 && (
          <p className="border border-[var(--line)] bg-bone p-6 text-center text-sm muted">
            No content blocks yet. Run the seed script.
          </p>
        )}
      </div>
    </div>
  );
}
