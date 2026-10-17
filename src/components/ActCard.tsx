import Image from "next/image";
import Link from "next/link";
import { priceLabel, type Act } from "@/lib/content";

export function ActCard({ act }: { act: Act }) {
  return (
    <Link href={"/services/" + act.slug} className="group card flex flex-col">
      <div className="duotone relative aspect-[4/3] w-full">
        <Image
          src={act.image}
          alt={act.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <span className="text-[0.6rem] font-semibold uppercase tracking-[0.24em] card-muted">
          {act.eyebrow}
        </span>
        <h3 className="h3 mt-2">{act.name}</h3>
        <p className="mt-2 text-sm card-muted">{act.tagline}</p>
        <span className="mt-auto pt-5 text-[0.64rem] font-semibold uppercase tracking-[0.16em]">
          {priceLabel(act)}
        </span>
      </div>
    </Link>
  );
}
