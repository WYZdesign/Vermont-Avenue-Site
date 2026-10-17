"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "sending" | "error">("idle");
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    setError("");
    const data = new FormData(event.currentTarget);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: data.get("email"),
          password: data.get("password"),
        }),
      });
      const json = (await res.json()) as { ok?: boolean; error?: string; role?: string };
      if (!res.ok || !json.ok) {
        setStatus("error");
        setError(json.error || "Could not sign in.");
        return;
      }
      const admin = json.role === "owner" || json.role === "team";
      router.push(next || (admin ? "/admin" : "/account"));
      router.refresh();
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4">
      <div>
        <label className="label" htmlFor="email">
          Email
        </label>
        <input className="field" id="email" name="email" type="email" required autoComplete="email" />
      </div>
      <div>
        <label className="label" htmlFor="password">
          Password
        </label>
        <input className="field" id="password" name="password" type="password" required autoComplete="current-password" />
      </div>

      {status === "error" && (
        <p className="border border-red-700/30 bg-red-700/5 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      <button type="submit" className="btn" disabled={status === "sending"}>
        {status === "sending" ? "Signing in" : "Sign in"}
      </button>
    </form>
  );
}
