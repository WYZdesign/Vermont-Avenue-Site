import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { LoginForm } from "./LoginForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const user = await getCurrentUser();
  if (user) redirect(isAdmin(user) ? "/admin" : "/account");
  const { next } = await searchParams;

  return (
    <section className="dark min-h-screen">
      <div className="wrap flex min-h-screen items-center justify-center py-16">
        <div className="w-full max-w-md border border-[var(--line-invert)] bg-[rgba(244,241,232,0.03)] p-8">
          <span className="eyebrow">Members</span>
          <h1 className="h2 mt-4">Sign in.</h1>
          <p className="mt-2 text-sm text-[rgba(244,241,232,0.6)]">
            Owner, team, clients, and fans.
          </p>
          <div className="mt-6">
            {process.env.DATABASE_URL ? (
              <LoginForm next={next} />
            ) : (
              <p className="text-sm text-[rgba(244,241,232,0.7)]">
                Accounts are being set up. Check back soon.
              </p>
            )}
          </div>
          <p className="mt-6 text-sm text-[rgba(244,241,232,0.6)]">
            New here?{" "}
            <Link href="/signup" className="text-[var(--color-sage)] underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
