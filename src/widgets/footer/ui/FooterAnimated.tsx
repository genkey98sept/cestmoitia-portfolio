"use client";

import Link from "next/link";

import type { SiteInfoLocation } from "@/entities/site-info";

interface FooterAnimatedProps {
  location?: SiteInfoLocation;
  instagramUrl?: string;
  facebookUrl?: string;
}

export function FooterAnimated({
  location,
  instagramUrl,
  facebookUrl,
}: FooterAnimatedProps) {
  const currentYear = new Date().getFullYear();

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-[60px]">
      {/* CTA Section */}
      <div className="flex flex-col items-start gap-6">
        <h2 className="font-clash text-[40px] font-semibold uppercase leading-[30px] tablet:text-[90px] tablet:leading-[70px]">
          Un projet ?
        </h2>
        <FooterCTAButton />
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 gap-10 tablet:grid-cols-3 tablet:gap-8">
        {/* Column 1: Location + Profession */}
        <div className="flex flex-col gap-6">
          <div>
            <p className="font-clash text-[12px] font-medium uppercase leading-[15px] tracking-[0.8px] text-text">
              BASED {location?.city?.toUpperCase() ?? "PUNA'AUIA"},
            </p>
            <p className="font-clash text-[12px] font-medium uppercase leading-[15px] tracking-[0.8px] text-text-secondary">
              {location?.country?.toUpperCase() ?? "TAHITI"}
            </p>
          </div>
          <div>
            <p className="font-clash text-[12px] font-medium uppercase leading-[15px] tracking-[0.8px] text-text">
              Filmaker / graphiste
            </p>
            <p className="font-clash text-[12px] font-medium uppercase leading-[15px] tracking-[0.8px] text-text">
              + Motion designer
            </p>
          </div>
        </div>

        {/* Column 2: Bio */}
        <div>
          <p className="font-inter text-[16px] leading-[1.5] text-text-muted">
            Installé à Puna&apos;auia, Tahiti, je suis un artiste digital. Mon
            but est de mettre ma passion pour l&apos;image au service de projets
            qui ont du sens.
          </p>
        </div>

        {/* Column 3: Social Links */}
        <div className="flex flex-col gap-3">
          {instagramUrl && (
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-inter text-[16px] text-text transition-colors hover:text-accent-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
              aria-label="Instagram de cestmoitia (ouvre un nouvel onglet)"
            >
              Instagram
            </a>
          )}
          {facebookUrl && (
            <a
              href={facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-clash text-[12px] font-medium uppercase tracking-[0.8px] text-text transition-colors hover:text-accent-blue focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
              aria-label="Facebook de cestmoitia (ouvre un nouvel onglet)"
            >
              FACEBOOK
            </a>
          )}
        </div>
      </div>

      {/* Large Decorative Name */}
      <div className="overflow-hidden" aria-hidden="true">
        <p className="font-clash text-[60px] font-semibold uppercase leading-[50px] tracking-[-1.6px] text-text opacity-10 tablet:text-[140px] tablet:leading-[110px] tablet:tracking-[-3.2px]">
          CESTMOITIA
        </p>
      </div>

      {/* Bottom Bar */}
      <div className="flex items-center justify-between border-t border-border pt-6">
        <a
          href="https://x.com/MandroDesign"
          target="_blank"
          rel="noopener noreferrer"
          className="font-clash text-[12px] font-medium uppercase tracking-[0.8px] text-text-muted transition-colors hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
        >
          &copy;{currentYear}
        </a>
        <button
          onClick={handleScrollToTop}
          className="font-clash text-[12px] font-medium uppercase tracking-[0.8px] text-text-muted transition-colors hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
          aria-label="Retour en haut de la page"
          type="button"
        >
          Retour en haut
        </button>
      </div>
    </div>
  );
}

function FooterCTAButton() {
  return (
    <Link
      href="/contact"
      className="group relative inline-flex items-center justify-center overflow-hidden rounded-[60px] border border-text px-[24px] py-[14px] transition-colors duration-300 ease-out hover:border-bg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-blue"
    >
      <span className="relative z-[3] font-clash text-[18px] font-semibold uppercase text-text transition-colors duration-300 ease-out group-hover:text-bg group-focus-visible:text-bg">
        CONTACTEZ-MOI
      </span>
      <span
        className="absolute inset-x-0 bottom-0 z-[1] h-full translate-y-full bg-text transition-transform duration-300 ease-out group-hover:translate-y-0 group-focus-visible:translate-y-0"
        aria-hidden="true"
      />
    </Link>
  );
}
