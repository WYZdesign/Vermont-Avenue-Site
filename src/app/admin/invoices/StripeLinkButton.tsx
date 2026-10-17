"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function StripeLinkButton({ id }: { id: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function createLink() {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/invoices/" + id + "/stripe", {
        method: "POST",
      });
      const json = (await res.json()) as { ok?: boolean; url?: string; error?: string };
      if (!res.ok || !json.ok || !json.url) {
        setError(json.error || "Could not create the link.");
        return;
      }
      window.open(json.url, "_blank", "noopener,noreferrer");
      router.refresh();
    } catch {
      setError("Network error.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={createLink}
        disabled={busy}
        className="border border-[var(--line)] px-2 py-1 text-[0.58rem] uppercase tracking-[0.12em] hover:bg-ink hover:text-bone disabled:opacity-50"
      >
        {busy ? "Working" : "Stripe link"}
      </button>
      {error && <p className="mt-1 max-w-[220px] text-[0.6rem] text-red-700">{error}</p>}
    </div>
  );
}
