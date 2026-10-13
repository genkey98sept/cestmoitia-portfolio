"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { SiteInfoLocation } from "@/entities/site-info";
import { useLenis } from "@/shared/ui";

export function FooterAnimated({
  location,
  instagramUrl,
  facebookUrl,
}: {
  location?: SiteInfoLocation;
  instagramUrl?: string;
  facebookUrl?: string;
}) {
  const pathname = usePathname();
  const lenis = useLenis();
  return (
    <div>
      {pathname !== "/contact" && (
        <div className="mb-12 flex flex-col items-start justify-between gap-6 tablet:mb-16 tablet:flex-row tablet:items-center">
          <h2 className="section-heading">Un projet en tête ?</h2>
          <Link href="/contact" className="primary-link shrink-0">
            Contactez-moi <span aria-hidden="true">↗</span>
          </Link>
        </div>
      )}
      <div className="flex flex-wrap justify-between gap-8 border-t border-border pt-8">
        <div>
          <p className="font-clash text-xl font-medium">
            Vidéaste / graphiste / motion designer
          </p>
          <p className="mt-2 font-inter text-sm text-text-secondary">
            {location?.city || "Puna’auia"} · {location?.country || "Tahiti"}
          </p>
        </div>
        {(instagramUrl || facebookUrl) && (
          <nav aria-label="Réseaux sociaux" className="flex flex-wrap gap-6">
            {instagramUrl && (
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram de cestmoitia (ouvre un nouvel onglet)"
                className="inline-flex min-h-12 items-center hover:text-accent-red"
              >
                Instagram ↗
              </a>
            )}
            {facebookUrl && (
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook de cestmoitia (ouvre un nouvel onglet)"
                className="inline-flex min-h-12 items-center hover:text-accent-red"
              >
                Facebook ↗
              </a>
            )}
          </nav>
        )}
      </div>
      <p
        aria-hidden="true"
        className="my-8 font-clash text-[clamp(46px,14vw,196px)] font-semibold uppercase leading-none tracking-[-.045em] text-white/15"
      >
        cestmoitia
      </p>
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 font-inter text-xs text-text-secondary">
        <p>© {new Date().getFullYear()} cestmoitia</p>
        <button
          type="button"
          className="min-h-12 hover:text-text"
          aria-label="Retour en haut de la page"
          onClick={() => {
            const reduced = window.matchMedia(
              "(prefers-reduced-motion: reduce)",
            ).matches;
            if (lenis && !reduced) lenis.scrollTo(0);
            else
              window.scrollTo({
                top: 0,
                behavior: reduced ? "auto" : "smooth",
              });
          }}
        >
          Retour en haut ↑
        </button>
      </div>
    </div>
  );
}
