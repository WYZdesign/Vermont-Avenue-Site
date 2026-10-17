"use client";

import { useState, type FormEvent } from "react";

export function NewsletterForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const email = new FormData(form).get("email");
    setStatus("sending");
    setMessage("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string };
      if (!res.ok || !json.ok) {
        setStatus("error");
        setMessage(json.error || "Could not add you. Try again.");
        return;
      }
      setStatus("done");
      form.reset();
    } catch {
      setStatus("error");
      setMessage("Network error. Try again.");
    }
  }

  if (status === "done") {
    return (
      <p className="text-sm text-[var(--color-sage)]">
        You are on the list. Watch for the next drop.
      </p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex w-full max-w-sm flex-col gap-2 sm:flex-row">
      <label className="sr-only" htmlFor="newsletter-email">
        Email address
      </label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        required
        placeholder="your@email.com"
        className="field flex-1 !border-[var(--line-invert)] !bg-[rgba(244,241,232,0.04)] !text-bone placeholder:!text-[rgba(244,241,232,0.4)]"
      />
      <button type="submit" className="btn" disabled={status === "sending"}>
        {status === "sending" ? "Adding" : "Join"}
      </button>
      {status === "error" && (
        <p className="text-xs text-red-300 sm:hidden">{message}</p>
      )}
    </form>
  );
}
