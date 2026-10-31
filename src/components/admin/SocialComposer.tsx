"use client";

import { useMemo, useState } from "react";
import { createSocialPostAction } from "@/app/admin/actions";

const platforms = [
  { value: "instagram", label: "Instagram" },
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "youtube", label: "YouTube" },
  { value: "x", label: "X" },
];

const limits: Record<string, number> = {
  instagram: 2200,
  facebook: 5000,
  tiktok: 2200,
  youtube: 5000,
  x: 280,
};

function nextSlot(hour: number): string {
  const now = new Date();
  const slot = new Date(now);
  slot.setHours(hour, 0, 0, 0);
  if (slot.getTime() <= now.getTime()) slot.setDate(slot.getDate() + 1);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${slot.getFullYear()}-${pad(slot.getMonth() + 1)}-${pad(slot.getDate())}T${pad(slot.getHours())}:00`;
}

export function SocialComposer() {
  const [platform, setPlatform] = useState("instagram");
  const [content, setContent] = useState("");
  const [media, setMedia] = useState("");
  const [scheduled, setScheduled] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const mediaList = useMemo(
    () => media.split("\n").map((line) => line.trim()).filter(Boolean).slice(0, 10),
    [media]
  );

  const limit = limits[platform] ?? 2200;

  async function draftWithAi() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/ai/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "social",
          context: { platform, topic: content, notes },
        }),
      });
      const json = (await res.json()) as { ok?: boolean; text?: string };
      if (json.ok && json.text) setContent(json.text.slice(0, limit));
      else setError("No draft returned.");
    } catch {
      setError("Could not draft right now.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={createSocialPostAction} className="grid gap-4 border border-[var(--line)] bg-bone p-5">
      <input type="hidden" name="media_json" value={JSON.stringify(mediaList)} />

      <div className="grid gap-3 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="platform">Platform</label>
          <select
            className="field"
            id="platform"
            name="platform"
            value={platform}
            onChange={(event) => setPlatform(event.target.value)}
          >
            {platforms.map((option) => (
              <option key={option.value} value={option.value}>{option.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="label" htmlFor="scheduled_for">Schedule (blank saves as draft)</label>
          <input
            className="field"
            id="scheduled_for"
            name="scheduled_for"
            type="datetime-local"
            value={scheduled}
            onChange={(event) => setScheduled(event.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setScheduled(nextSlot(8))} className="border border-[var(--line)] px-3 py-1 text-[0.58rem] uppercase tracking-[0.14em]">8 AM</button>
        <button type="button" onClick={() => setScheduled(nextSlot(12))} className="border border-[var(--line)] px-3 py-1 text-[0.58rem] uppercase tracking-[0.14em]">12 PM</button>
        <button type="button" onClick={() => setScheduled(nextSlot(18))} className="border border-[var(--line)] px-3 py-1 text-[0.58rem] uppercase tracking-[0.14em]">6 PM</button>
        <button type="button" onClick={() => setScheduled(nextSlot(21))} className="border border-[var(--line)] px-3 py-1 text-[0.58rem] uppercase tracking-[0.14em]">9 PM</button>
        <button type="button" onClick={() => setScheduled("")} className="border border-[var(--line)] px-3 py-1 text-[0.58rem] uppercase tracking-[0.14em]">Clear</button>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="label" htmlFor="content">Caption</label>
          <span className={"text-[0.58rem] " + (content.length > limit ? "text-red-700" : "text-fog")}>
            {content.length} / {limit}
          </span>
        </div>
        <textarea
          className="field"
          id="content"
          name="content"
          rows={5}
          value={content}
          onChange={(event) => setContent(event.target.value)}
          required
        />
        <div className="mt-2 flex flex-wrap gap-2">
          <button type="button" onClick={draftWithAi} disabled={loading} className="btn btn-ghost">
            {loading ? "Drafting" : "Write with AI"}
          </button>
        </div>
        {error && <p className="mt-2 text-xs text-red-700">{error}</p>}
      </div>

      <div>
        <label className="label" htmlFor="media">Media URLs (one per line)</label>
        <textarea
          className="field"
          id="media"
          rows={3}
          value={media}
          onChange={(event) => setMedia(event.target.value)}
          placeholder="https://.../photo.jpg"
        />
        {mediaList.length > 0 && (
          <p className="mt-1 text-[0.6rem] text-fog">{mediaList.length} media item(s)</p>
        )}
      </div>

      <div>
        <label className="label" htmlFor="notes">Internal notes</label>
        <input className="field" id="notes" name="notes" value={notes} onChange={(event) => setNotes(event.target.value)} />
      </div>

      <div>
        <button type="submit" className="btn">Save post</button>
      </div>
    </form>
  );
}
