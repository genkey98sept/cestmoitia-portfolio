import Image from "next/image";
import Link from "next/link";

import type { SiteInfoLocation } from "@/entities/site-info";

export function HeroAnimated({
  location,
  tagline,
}: {
  location?: SiteInfoLocation;
  tagline?: string;
}) {
  return (
    <div>
      <h1 className="font-clash text-[clamp(40px,14vw,205px)] font-semibold uppercase leading-[.95] tracking-[-.045em]">
        cestmoitia
      </h1>
      <div className="my-7 flex flex-col justify-between gap-5 border-t border-border pt-6 tablet:my-10 tablet:flex-row tablet:items-end">
        <div>
          <p className="text-lg font-medium tablet:text-2xl">
            {tagline?.replace(/\bfilmaker\b/gi, "vidéaste") ||
              "Vidéaste, graphiste & motion designer"}
          </p>
          <p className="mt-2 font-inter text-sm text-text-secondary">
            {location?.city || "Puna’auia"} · {location?.country || "Tahiti"}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Link href="/work" className="primary-link">
            Explorer les projets <span aria-hidden="true">↗</span>
          </Link>
          <Link href="/photography" className="secondary-link">
            La galerie
          </Link>
        </div>
      </div>
      <div className="relative aspect-[4/3] overflow-hidden tablet:aspect-[2.6/1]">
        <Image
          src="/hero-tia.jpg"
          alt="Portrait de Tia, créatif audiovisuel à Tahiti"
          fill
          className="object-cover object-[50%_24%]"
          sizes="(max-width: 1440px) 92vw, 1320px"
          preload
        />
      </div>
    </div>
  );
}
