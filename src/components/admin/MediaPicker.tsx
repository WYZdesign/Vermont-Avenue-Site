"use client";

/* eslint-disable @next/next/no-img-element */
import { useCallback, useEffect, useState } from "react";

type MediaItem = { id: string; filename: string };

export function MediaPicker({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue: string;
}) {
  const [value, setValue] = useState(defaultValue || "");
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<MediaItem[]>([]);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/admin/media", { cache: "no-store" });
      const json = await res.json();
      if (json.ok) setItems(json.media as MediaItem[]);
    } catch {
      setItems([]);
    }
  }, []);

  useEffect(() => {
    if (open && items.length === 0) void load();
  }, [open, items.length, load]);

  return (
    <div>
      <input type="hidden" name={name} value={value} readOnly />

      <div className="flex flex-wrap items-center gap-2">
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder="/api/media/... or /images/..."
          className="field flex-1"
        />
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="border border-[var(--line)] px-3 py-2 text-[0.6rem] uppercase tracking-[0.14em] hover:bg-ink hover:text-white"
        >
          Library
        </button>
      </div>

      {value && (
        <div className="mt-2 h-24 w-24 border border-[var(--line)] bg-[var(--color-paper)]">
          <img src={value} alt="" className="h-full w-full object-contain" />
        </div>
      )}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(11,11,11,0.9)] p-4"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="max-h-[85vh] w-full max-w-3xl overflow-auto border border-[var(--line)] bg-bone p-4"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-3 flex items-center justify-between">
              <h3 className="h3">Media library</h3>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-[0.62rem] uppercase tracking-[0.14em] underline"
              >
                Close
              </button>
            </div>
            {items.length === 0 ? (
              <p className="text-sm muted">
                No media yet. Upload images in the Media tab, then pick them here.
              </p>
            ) : (
              <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                {items.map((item) => {
                  const url = "/api/media/" + item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setValue(url);
                        setOpen(false);
                      }}
                      className="border border-[var(--line)] bg-[var(--color-paper)] hover:border-[var(--color-forest)]"
                      title={item.filename}
                    >
                      <div className="relative aspect-square">
                        <img
                          src={url}
                          alt={item.filename}
                          className="h-full w-full object-contain"
                        />
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
