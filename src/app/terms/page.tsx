import type { Metadata } from "next";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "Terms for using the Vermont Avenue Records website and booking services.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="wrap-narrow section">
      <span className="eyebrow">Legal</span>
      <h1 className="h1 mt-4">Terms of use</h1>
      <p className="muted mt-3 text-sm">Last updated {new Date().getFullYear()}</p>

      <div className="mt-10 space-y-6 text-[0.95rem] leading-relaxed">
        <p>
          By using {site.url} you agree to these terms. If you do not agree, please do not use
          the site.
        </p>

        <section>
          <h2 className="h3 mb-2">Bookings</h2>
          <p>
            Submitting a booking request does not create a contract. Dates are confirmed only
            after we agree on terms in writing. A deposit may be required to hold a date.
          </p>
        </section>

        <section>
          <h2 className="h3 mb-2">Accounts</h2>
          <p>
            You are responsible for keeping your login credentials secure and for activity under
            your account. Do not misuse the site or attempt to access accounts or data that are
            not yours.
          </p>
        </section>

        <section>
          <h2 className="h3 mb-2">Content</h2>
          <p>
            All music, artwork, logos, photos, and text on this site belong to Vermont Avenue
            Records or their respective owners and may not be reused without permission.
          </p>
        </section>

        <section>
          <h2 className="h3 mb-2">Limitation of liability</h2>
          <p>
            The site is provided &quot;as is.&quot; To the extent permitted by law, we are not
            liable for indirect or incidental damages arising from your use of the site.
          </p>
        </section>

        <section>
          <h2 className="h3 mb-2">Contact</h2>
          <p>
            Questions about these terms? Reach us through the{" "}
            <a href="/contact" className="underline">contact page</a>.
          </p>
        </section>
      </div>
    </div>
  );
}