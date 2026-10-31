import { query } from "@/lib/db";
import type { SocialPost } from "@/lib/types";
import { updateSocialPostAction, saveSocialPostAction } from "../actions";
import { SocialComposer } from "@/components/admin/SocialComposer";

export const dynamic = "force-dynamic";

const statusStyles: Record<string, string> = {
  draft: "text-fog",
  scheduled: "text-[var(--color-forest)]",
  published: "text-[var(--color-forest)]",
  failed: "text-red-700",
  archived: "text-fog",
};

export default async function AdminSocialPage() {
  const rows = await query<SocialPost>(
    "select * from social_posts order by coalesce(scheduled_for, created_at) desc limit 200"
  );
  const scheduled = rows.filter((row) => row.status === "scheduled");
  const drafts = rows.filter((row) => row.status === "draft");

  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Social</span>
        <h1 className="h2 mt-3">The feed.</h1>
        <p className="mt-2 text-sm muted">
          Write, schedule, and track posts for Instagram, Facebook, TikTok, YouTube, and X.
          Four slots a day: 8 AM, 12 PM, 6 PM, 9 PM.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <div className="border border-[var(--line)] bg-bone px-5 py-3">
          <p className="text-[0.58rem] uppercase tracking-[0.16em] text-fog">Scheduled</p>
          <p className="mt-1 text-xl font-medium">{scheduled.length}</p>
        </div>
        <div className="border border-[var(--line)] bg-bone px-5 py-3">
          <p className="text-[0.58rem] uppercase tracking-[0.16em] text-fog">Drafts</p>
          <p className="mt-1 text-xl font-medium">{drafts.length}</p>
        </div>
        <div className="border border-[var(--line)] bg-bone px-5 py-3">
          <p className="text-[0.58rem] uppercase tracking-[0.16em] text-fog">Published</p>
          <p className="mt-1 text-xl font-medium">
            {rows.filter((row) => row.status === "published").length}
          </p>
        </div>
      </div>

      <SocialComposer />

      <div className="space-y-3">
        {rows.map((row) => (
          <details key={row.id} className="border border-[var(--line)] bg-bone p-4">
            <summary className="flex cursor-pointer flex-wrap items-center gap-3 text-sm">
              <span className="text-[0.6rem] uppercase tracking-[0.16em] font-semibold">
                {row.platform}
              </span>
              <span className={"text-[0.6rem] uppercase tracking-[0.14em] " + (statusStyles[row.status] || "text-fog")}>
                {row.status}
              </span>
              <span className="text-[0.62rem] text-fog">
                {row.scheduled_for
                  ? new Date(row.scheduled_for).toLocaleString()
                  : new Date(row.created_at).toLocaleString()}
              </span>
              <span className="truncate text-xs text-[rgba(11,11,11,0.7)]">
                {row.content.slice(0, 90)}
              </span>
            </summary>

            <div className="mt-3 flex flex-wrap items-center gap-3">
              <form action={updateSocialPostAction} className="flex items-center gap-2">
                <input type="hidden" name="id" value={row.id} />
                <select name="status" defaultValue={row.status} className="field max-w-[10rem]">
                  <option value="draft">draft</option>
                  <option value="scheduled">scheduled</option>
                  <option value="published">published</option>
                  <option value="failed">failed</option>
                  <option value="archived">archived</option>
                </select>
                <button type="submit" className="btn btn-ghost">Update</button>
              </form>
            </div>

            <form action={saveSocialPostAction} className="mt-3 grid gap-2">
              <input type="hidden" name="id" value={row.id} />
              <textarea name="content" defaultValue={row.content} rows={4} className="field" />
              <button type="submit" className="btn w-fit">Save text</button>
            </form>

            {Array.isArray(row.media_urls) && row.media_urls.length > 0 && (
              <ul className="mt-3 space-y-1 text-xs">
                {row.media_urls.map((url) => (
                  <li key={url}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="underline">
                      {url}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </details>
        ))}
        {rows.length === 0 && (
          <p className="border border-[var(--line)] bg-bone p-6 text-center text-sm muted">
            No posts yet. Write the first one above.
          </p>
        )}
      </div>

      <p className="border border-[var(--line)] bg-bone p-4 text-xs text-fog">
        Posting to live platforms needs each platform's API credentials. Until those are
        connected, use this hub to draft, schedule, and copy, then mark the post published.
      </p>
    </div>
  );
}
