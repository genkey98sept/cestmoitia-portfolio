import Image from "next/image";

import { getSiteInfo, type SiteInfo } from "@/entities/site-info";
import { ContactForm } from "@/features/contact-form";

export async function ContactPage() {
  let siteInfo: SiteInfo | null;
  try {
    siteInfo = await getSiteInfo();
  } catch {
    siteInfo = null;
  }

  return (
    <div className="mx-auto max-w-[1440px] px-5 pt-10 tablet:px-[30px] tablet:pt-[100px]">
      {/* Hero + Form — 2 columns */}
      <div className="flex flex-col gap-10 tablet:flex-row">
        {/* Left column: title + form */}
        <div className="tablet:w-1/2">
          <h1 className="font-clash text-[40px] font-semibold uppercase leading-[30px] text-text tablet:text-[90px] tablet:leading-[70px]">
            RING A BELL!
          </h1>
          <p className="mt-4 font-inter text-[16px] leading-[1.5] text-text-muted">
            Contactez-moi et créons ensemble quelque chose
            d&apos;extraordinaire.
          </p>
          <ContactForm />
        </div>

        {/* Right column: hero image */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-[10px] tablet:w-1/2">
          <Image
            src="/contact-tia.jpg"
            alt="Portrait de Tia"
            fill
            className="object-cover"
            sizes="(max-width: 810px) 100vw, 50vw"
            priority
          />
        </div>
      </div>

      {/* Contact info row */}
      <div className="mt-[60px] grid grid-cols-2 gap-8 pb-10 tablet:mt-[100px] tablet:grid-cols-4">
        {/* Follow me */}
        <div className="flex flex-col gap-3">
          <span className="font-clash text-[12px] font-medium uppercase tracking-[0.8px] text-[#808080]">
            FOLLOW ME
          </span>
          {siteInfo?.instagramUrl && (
            <a
              href={siteInfo.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-clash text-[18px] font-semibold uppercase text-text transition-colors hover:text-accent-blue"
              aria-label="Instagram de cestmoitia (ouvre un nouvel onglet)"
            >
              INSTAGRAM ↗
            </a>
          )}
          {siteInfo?.facebookUrl && (
            <a
              href={siteInfo.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-clash text-[18px] font-semibold uppercase text-text transition-colors hover:text-accent-blue"
              aria-label="Facebook de cestmoitia (ouvre un nouvel onglet)"
            >
              FACEBOOK ↗
            </a>
          )}
        </div>

        {/* Current location */}
        <div className="flex flex-col gap-1">
          <span className="font-clash text-[12px] font-medium uppercase tracking-[0.8px] text-[#808080]">
            CURRENT LOCATION
          </span>
          <span className="font-clash text-[18px] font-semibold uppercase text-text">
            {siteInfo?.location?.city ?? "Puna'auia"},{" "}
            {siteInfo?.location?.zipCode ?? "98717"}
          </span>
          <span className="font-clash text-[18px] font-semibold uppercase text-text">
            {siteInfo?.location?.country ?? "Tahiti"}
          </span>
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1">
          <span className="font-clash text-[12px] font-medium uppercase tracking-[0.8px] text-[#808080]">
            PHONE
          </span>
          <span className="font-clash text-[18px] font-semibold uppercase text-text">
            {siteInfo?.location?.countryCode ?? "PF"}
          </span>
          {siteInfo?.phone && (
            <a
              href={`tel:${siteInfo.phone}`}
              className="font-clash text-[18px] font-semibold uppercase text-text transition-colors hover:text-accent-blue"
            >
              {siteInfo.phone}
            </a>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col gap-1">
          <span className="font-clash text-[12px] font-medium uppercase tracking-[0.8px] text-[#808080]">
            EMAIL ME
          </span>
          <a
            href={`mailto:${siteInfo?.email ?? "cestmoitia@gmail.com"}`}
            className="font-clash text-[18px] font-semibold uppercase text-text transition-colors hover:text-accent-blue"
          >
            {siteInfo?.email ?? "cestmoitia@gmail.com"}
          </a>
        </div>
      </div>
    </div>
  );
}
