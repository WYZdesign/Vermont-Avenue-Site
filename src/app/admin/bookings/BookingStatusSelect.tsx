"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const statuses = ["new", "quoted", "booked", "closed", "lost"];

export function BookingStatusSelect({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [saving, setSaving] = useState(false);

  async function change(next: string) {
    setValue(next);
    setSaving(true);
    try {
      await fetch("/api/admin/bookings/" + id, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  return (
    <select
      value={value}
      onChange={(event) => change(event.target.value)}
      disabled={saving}
      className="border border-[var(--line)] bg-paper px-2 py-1 text-xs uppercase tracking-[0.1em]"
      aria-label="Booking status"
    >
      {statuses.map((status) => (
        <option key={status} value={status}>
          {status}
        </option>
      ))}
    </select>
  );
}
