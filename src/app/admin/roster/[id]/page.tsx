import Link from "next/link";
import { notFound } from "next/navigation";
import { deleteRosterAction, updateRosterAction } from "@/app/admin/actions";
import { requireAdmin } from "@/lib/auth";
import { query } from "@/lib/db";

export const dynamic = "force-dynamic";

type Member = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  instruments: string | null;
  genres: string | null;
  bio: string | null;
  avatar_url: string | null;
  active: boolean;
};

export default async function EditRosterPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const rows = await query<Member>(
    `select id, name, email, phone, role, instruments, genres, bio, avatar_url, active
     from roster where id = $1`,
    [id]
  );
  const member = rows[0];
  if (!member) notFound();

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <span className="eyebrow">Admin / Band Ops</span>
        <h1 className="h2 mt-3">{member.name}</h1>
        <p className="mt-2 text-sm muted">Edit or remove this member.</p>
      </div>

      <form action={updateRosterAction} className="space-y-4 border border-[var(--line)] bg-bone p-6">
        <input type="hidden" name="id" value={member.id} />
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="label">Name *</span>
            <input name="name" required defaultValue={member.name} className="field" />
          </label>
          <label className="block">
            <span className="label">Role *</span>
            <input name="role" required defaultValue={member.role} className="field" />
          </label>
          <label className="block">
            <span className="label">Email</span>
            <input name="email" type="email" defaultValue={member.email ?? ""} className="field" />
          </label>
          <label className="block">
            <span className="label">Phone</span>
            <input name="phone" defaultValue={member.phone ?? ""} className="field" />
          </label>
          <label className="block">
            <span className="label">Instruments</span>
            <input name="instruments" defaultValue={member.instruments ?? ""} className="field" />
          </label>
          <label className="block">
            <span className="label">Genres</span>
            <input name="genres" defaultValue={member.genres ?? ""} className="field" />
          </label>
          <label className="block sm:col-span-2">
            <span className="label">Avatar URL</span>
            <input name="avatar_url" defaultValue={member.avatar_url ?? ""} className="field" />
          </label>
          <label className="block sm:col-span-2">
            <span className="label">Bio</span>
            <textarea name="bio" rows={3} defaultValue={member.bio ?? ""} className="field" />
          </label>
          <label className="flex items-center gap-2 sm:col-span-2">
            <input name="active" type="checkbox" defaultChecked={member.active} className="h-4 w-4" />
            <span className="text-sm">Active</span>
          </label>
        </div>
        <div className="flex flex-wrap gap-3 pt-2">
          <button type="submit" className="btn">Save changes</button>
          <Link href="/admin/roster" className="btn btn-ghost">Back</Link>
        </div>
      </form>

      <form action={deleteRosterAction} className="border border-[var(--line)] bg-bone p-6">
        <input type="hidden" name="id" value={member.id} />
        <p className="text-sm muted mb-3">Remove this member permanently.</p>
        <button type="submit" className="btn border-[var(--color-forest)] bg-transparent text-[var(--color-forest)] hover:bg-[var(--color-forest)] hover:text-bone">
          Delete member
        </button>
      </form>
    </div>
  );
}