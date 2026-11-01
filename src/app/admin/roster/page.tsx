import { query } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import Link from "next/link";

export const dynamic = "force-dynamic";

type RosterMember = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  instruments: string;
  genres: string;
  bio: string;
  avatar_url: string;
  active: boolean;
  created_at: string;
};

export default async function RosterPage() {
  await requireAdmin();

  const roster = await query<RosterMember>(`
    select id, name, email, phone, role, instruments, genres, bio, avatar_url, active, created_at
    from roster
    order by name asc
  `);

  return (
    <div className="space-y-10">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <span className="eyebrow">Admin / Band Ops</span>
          <h1 className="h2 mt-3">Roster.</h1>
          <p className="mt-2 text-sm muted">
            All musicians, crew, and contacts. Synced with NocoDB.
          </p>
        </div>
        <Link
          href="/admin/roster/new"
          className="btn whitespace-nowrap"
        >
          Add member
        </Link>
      </div>

      {roster.length === 0 ? (
        <div className="border border-[var(--line)] bg-bone p-10 text-center">
          <p className="text-lg muted mb-4">No roster members yet.</p>
          <Link href="/admin/roster/new" className="btn">
            Add your first member
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {roster.map((member) => (
            <Link
              key={member.id}
              href={`/admin/roster/${member.id}`}
              className="border border-[var(--line)] bg-bone p-5 transition-colors hover:bg-ink hover:text-white flex flex-col"
            >
              <div className="flex items-center gap-4 mb-3">
                <div className="relative w-14 h-14 shrink-0 overflow-hidden rounded-full border border-[var(--line)]">
                  {member.avatar_url ? (
                    <img
                      src={member.avatar_url}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-ink text-white text-xl font-display">
                      {member.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{member.name}</p>
                  <p className="text-[0.6rem] uppercase tracking-[0.14em] opacity-60 truncate">{member.role}</p>
                </div>
              </div>
              <div className="text-xs text-fog space-y-1">
                <p className="truncate">{member.instruments || "—"}</p>
                <p className="truncate">{member.genres || "—"}</p>
              </div>
              <span className={`mt-3 inline-block px-2 py-0.5 text-[0.55rem] uppercase tracking-[0.1em] rounded ${
                member.active
                  ? "bg-[var(--color-forest)]/20 text-[var(--color-forest)] border border-[var(--color-forest)]"
                  : "bg-ink/30 text-fog border border-[var(--line)]"
              }`}>
                {member.active ? "Active" : "Inactive"}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}