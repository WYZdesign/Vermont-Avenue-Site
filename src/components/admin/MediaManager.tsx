"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState } from "react";

type MediaItem = {
  id: string;
  filename: string;
  mime: string;
  bytes: number;
  alt: string | null;
  created_at: string;
};

function kb(bytes: number): string {
  if (bytes >= 1024 * 1024) return (bytes / 1024 / 1024).toFixed(1) + " MB";
  return Math.max(1, Math.round(bytes / 1024)) + " KB";
}

export function MediaManager() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/media", { cache: "no-store" });
      const json = await res.json();
      if (json.ok) setItems(json.media as MediaItem[]);
    } catch {
      setError("Could not load the library.");
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function upload(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        body: new FormData(form),
      });
      const json = await res.json();
      if (!json.ok) {
        setError(json.error || "Upload failed.");
      } else {
        form.reset();
        await load();
      }
    } catch {
      setError("Upload failed.");
    } finally {
      setBusy(false);
    }
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this image? Pages using it will break.")) return;
    await fetch("/api/admin/media/" + id, { method: "DELETE" });
    await load();
  }

  async function copy(url: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      window.setTimeout(() => setCopied(""), 1500);
    } catch {
      setError("Copy failed. Select the URL manually.");
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={upload} className="border border-[var(--line)] bg-bone p-4">
        <label className="block text-[0.62rem] uppercase tracking-[0.16em] text-fog">
          Upload an image
        </label>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <input
            type="file"
            name="file"
            accept="image/*"
            required
            className="text-sm"
          />
          <button type="submit" className="btn" disabled={busy}>
            {busy ? "Uploading..." : "Upload"}
          </button>
        </div>
        <p className="mt-2 text-[0.68rem] text-fog">
          Images up to 12 MB. Videos stay as links (YouTube, Vimeo, mp4).
        </p>
        {error && <p className="mt-2 text-sm text-red-700">{error}</p>}
      </form>

      {items.length === 0 ? (
        <p className="border border-[var(--line)] bg-bone p-6 text-center text-sm muted">
          No media yet. Upload an image to get started.
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {items.map((item) => {
            const url = "/api/media/" + item.id;
            return (
              <div
                key={item.id}
                className="border border-[var(--line)] bg-bone"
              >
                <div className="relative aspect-square bg-[var(--color-paper)]">
                  <img
                    src={url}
                    alt={item.alt || item.filename}
                    className="h-full w-full object-contain"
                  />
                </div>
                <div className="space-y-2 p-3">
                  <p className="truncate text-xs" title={item.filename}>
                    {item.filename}
                  </p>
                  <p className="text-[0.6rem] uppercase tracking-[0.14em] text-fog">
                    {kb(item.bytes)}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => copy(url)}
                      className="border border-[var(--line)] px-2 py-1 text-[0.58rem] uppercase tracking-[0.12em] hover:bg-ink hover:text-white"
                    >
                      {copied === url ? "Copied" : "Copy URL"}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove(item.id)}
                      className="border border-[var(--line)] px-2 py-1 text-[0.58rem] uppercase tracking-[0.12em] hover:bg-red-700 hover:text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
