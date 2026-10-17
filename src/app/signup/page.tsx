import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser, isAdmin } from "@/lib/auth";
import { SignupForm } from "./SignupForm";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Create an account",
  robots: { index: false, follow: false },
};

export default async function SignupPage() {
  const user = await getCurrentUser();
  if (user) redirect(isAdmin(user) ? "/admin" : "/account");

  return (
    <section className="dark min-h-screen">
      <div className="wrap flex min-h-screen items-center justify-center py-16">
        <div className="w-full max-w-md border border-[var(--line-invert)] bg-[rgba(244,241,232,0.03)] p-8">
          <span className="eyebrow">Join the block</span>
          <h1 className="h2 mt-4">Create an account.</h1>
          <p className="mt-2 text-sm text-[rgba(244,241,232,0.6)]">
            Save your bookings, follow the label, and get the list.
          </p>
          <div className="mt-6">
            {process.env.DATABASE_URL ? (
              <SignupForm />
            ) : (
              <p className="text-sm text-[rgba(244,241,232,0.7)]">
                Accounts are being set up. Check back soon.
              </p>
            )}
          </div>
          <p className="mt-6 text-sm text-[rgba(244,241,232,0.6)]">
            Already have one?{" "}
            <Link href="/login" className="text-[var(--color-sage)] underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
