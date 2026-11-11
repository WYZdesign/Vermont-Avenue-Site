import Link from "next/link";
import { query } from "@/lib/db";
import { CONTENT_FIELDS, CONTENT_GROUPS } from "@/lib/content-fields";
import { MediaPicker } from "@/components/admin/MediaPicker";
import { saveAllContentAction } from "../actions";
import type { ContentBlock } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  let rows: ContentBlock[] = [];
  try {
    rows = await query<ContentBlock>("select * from content_blocks");
  } catch {
    rows = [];
  }
  const stored = new Map(rows.map((row) => [row.key, row.value]));

  return (
    <form action={saveAllContentAction} className="space-y-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <span className="eyebrow">Content</span>
          <h1 className="h2 mt-3">The copy.</h1>
          <p className="mt-2 text-sm muted">
            Edit the text and images on the live site. Changes go out as soon as you
            save.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/media"
            className="border border-[var(--line)] px-3 py-2 text-[0.62rem] uppercase tracking-[0.14em] hover:bg-ink hover:text-white"
          >
            Media library
          </Link>
          <button type="submit" className="btn">
            Save changes
          </button>
        </div>
      </div>

      {CONTENT_GROUPS.map((group) => (
        <section key={group} className="space-y-4">
          <h2 className="h3 border-b border-[var(--line)] pb-2">{group}</h2>
          <div className="grid gap-5">
            {CONTENT_FIELDS.filter((field) => field.group === group).map((field) => {
              const current = stored.get(field.key) ?? field.default;
              return (
                <div key={field.key}>
                  <label className="block text-[0.62rem] uppercase tracking-[0.16em] text-fog">
                    {field.label}
                  </label>
                  {field.type === "textarea" ? (
                    <textarea
                      name={field.key}
                      defaultValue={current}
                      rows={3}
                      className="field mt-2"
                    />
                  ) : field.type === "image" ? (
                    <div className="mt-2">
                      <MediaPicker name={field.key} defaultValue={current} />
                    </div>
                  ) : (
                    <input
                      name={field.key}
                      defaultValue={current}
                      className="field mt-2"
                    />
                  )}
                  {field.help && (
                    <p className="mt-1 text-[0.68rem] text-fog">{field.help}</p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <div className="sticky bottom-4 flex justify-end">
        <button type="submit" className="btn shadow-lg">
          Save changes
        </button>
      </div>
    </form>
  );
}
