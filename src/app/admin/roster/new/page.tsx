import Link from "next/link";
import { createRosterAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function NewRosterPage() {
  await requireAdmin();

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <span className="eyebrow">Admin / Band Ops</span>
        <h1 className="h2 mt-3">Add roster member.</h1>
        <p className="mt-2 text-sm muted">Musicians, crew, and contacts.</p>
      </div>

      <form action={createRosterAction} className="space-y-4 border border-[var(--line)] bg-bone p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="label">Name *</span>
            <input name="name" required className="field" />
          </label>
          <label className="block">
            <span className="label">Role *</span>
            <input name="role" required className="field" placeholder="Musician / Crew / Contact" />
          </label>
          <label className="block">
            <span className="label">Email</span>
            <input name="email" type="email" className="field" />
          </label>
          <label className="block">
            <span className="label">Phone</span>
            <input name="phone" className="field" />
          </label>
          <label className="block">
            <span className="label">Instruments</span>
            <input name="instruments" className="field" placeholder="Guitar, vocals" />
          </label>
          <label className="block">
            <span className="label">Genres</span>
            <input name="genres" className="field" placeholder="Jazz, soul" />
          </label>
          <label className="block sm:col-span-2">
            <span className="label">Avatar URL</span>
            <input name="avatar_url" className="field" placeholder="/images/artist-name.jpg" />
          </label>
          <label className="block sm:col-span-2">
            <span className="label">Bio</span>
            <textarea name="bio" rows={3} className="field" />
          </label>
          <label className="flex items-center gap-2 sm:col-span-2">
            <input name="active" type="checkbox" defaultChecked className="h-4 w-4" />
            <span className="text-sm">Active</span>
          </label>
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <button type="submit" className="btn">Save member</button>
          <Link href="/admin/roster" className="btn btn-ghost">Cancel</Link>
        </div>
      </form>
    </div>
  );
}