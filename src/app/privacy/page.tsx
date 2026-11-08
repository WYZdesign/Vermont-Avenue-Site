import type { Metadata } from "next";
import { site } from "@/lib/content";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How Vermont Avenue Records collects, uses, and protects your information.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="wrap-narrow section">
      <span className="eyebrow">Legal</span>
      <h1 className="h1 mt-4">Privacy policy</h1>
      <p className="muted mt-3 text-sm">Last updated {new Date().getFullYear()}</p>

      <div className="mt-10 space-y-6 text-[0.95rem] leading-relaxed">
        <p>
          Vermont Avenue Records (&quot;we&quot;, &quot;us&quot;) operates {site.url}. This policy
          explains what we collect and how we use it.
        </p>

        <section>
          <h2 className="h3 mb-2">What we collect</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Contact details you submit on the booking form (name, email, phone, event details).</li>
            <li>Account details if you sign up (name, email, a securely hashed password).</li>
            <li>Your email address if you join the newsletter.</li>
            <li>Standard analytics (pages viewed, device and browser type) via Google Analytics and the Meta Pixel.</li>
          </ul>
        </section>

        <section>
          <h2 className="h3 mb-2">How we use it</h2>
          <p>
            To respond to booking inquiries, manage your account, send the newsletter you asked
            for, measure how the site performs, and improve our services. We do not sell your data.
          </p>
        </section>

        <section>
          <h2 className="h3 mb-2">Cookies and tracking</h2>
          <p>
            We use cookies for login sessions and for analytics and advertising measurement
            (Google Analytics, Meta Pixel). You can block cookies in your browser settings.
          </p>
        </section>

        <section>
          <h2 className="h3 mb-2">Your choices</h2>
          <p>
            You can unsubscribe from the newsletter at any time and ask us to delete your data by
            contacting {site.name}. Requests are honored as required by law.
          </p>
        </section>

        <section>
          <h2 className="h3 mb-2">Contact</h2>
          <p>
            Questions about this policy? Reach us through the{" "}
            <a href="/contact" className="underline">contact page</a>.
          </p>
        </section>
      </div>
    </div>
  );
}