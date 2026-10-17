import Link from "next/link";

export default function NotFound() {
  return (
    <section className="dark relative overflow-hidden">
      <div className="deco-sun" aria-hidden="true" />
      <div className="wrap relative flex min-h-[70vh] flex-col items-start justify-center py-20">
        <span className="eyebrow">404</span>
        <h1 className="h1 mt-5">
          Off the
          <br />
          <span className="serif text-[var(--color-sage)]">block.</span>
        </h1>
        <p className="lede mt-5 max-w-md">
          That page is not here. Head back to the label or send us a booking
          request.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/" className="btn">
            Back home
          </Link>
          <Link href="/book" className="btn btn-ghost">
            Book the band
          </Link>
        </div>
      </div>
    </section>
  );
}
