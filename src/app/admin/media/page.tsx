import { MediaManager } from "@/components/admin/MediaManager";

export const dynamic = "force-dynamic";

export default function AdminMediaPage() {
  return (
    <div className="space-y-6">
      <div>
        <span className="eyebrow">Media</span>
        <h1 className="h2 mt-3">The library.</h1>
        <p className="mt-2 text-sm muted">
          Upload and reuse images across the site. Copy a URL to drop it into any
          content field.
        </p>
      </div>
      <MediaManager />
    </div>
  );
}
