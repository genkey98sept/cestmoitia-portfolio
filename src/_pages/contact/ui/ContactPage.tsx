import Image from "next/image";

import { getSiteInfo } from "@/entities/site-info";
import { ContactForm } from "@/features/contact-form";

export async function ContactPage() {
  const siteInfo = await getSiteInfo().catch(() => null);
  const email = siteInfo?.email || "cestmoitia@gmail.com";
  return (
    <div className="site-shell section-space">
      <div className="grid items-start gap-10 tablet:grid-cols-2 tablet:gap-16">
        <div className="min-w-0">
          <p className="eyebrow mb-5">Contact</p>
          <h1 className="font-clash text-[clamp(42px,5.5vw,76px)] font-semibold uppercase leading-[1.05] tracking-[-.03em]">
            Parlons de votre projet.
          </h1>
          <p className="mt-5 max-w-lg font-inter text-lg leading-relaxed text-text-muted">
            Une vidéo, une identité visuelle, une idée à développer ?
            Racontez-moi ce que vous avez en tête.
          </p>
          <ContactForm />
          <p className="mt-6 font-inter text-sm leading-relaxed text-text-muted">
            Vous préférez écrire directement ?{" "}
            <a
              href={`mailto:${email}`}
              className="text-text underline decoration-accent-red underline-offset-4 [overflow-wrap:anywhere]"
            >
              {email}
            </a>
          </p>
        </div>
        <div className="relative aspect-[4/5] overflow-hidden">
          <Image
            src="/contact-tia.jpg"
            alt="Portrait de Tia"
            fill
            className="object-cover"
            sizes="(max-width: 810px) 92vw, (max-width: 1440px) 46vw, 630px"
            preload
          />
        </div>
      </div>
      <div className="mt-12 grid gap-8 border-t border-border pt-8 tablet:mt-20 tablet:grid-cols-3">
        <div>
          <p className="eyebrow mb-3">Basé à</p>
          <p>
            {siteInfo?.location?.city || "Puna’auia"} ·{" "}
            {siteInfo?.location?.country || "Tahiti"}
          </p>
        </div>
        {siteInfo?.phone && (
          <div>
            <p className="eyebrow mb-3">Téléphone</p>
            <a href={`tel:${siteInfo.phone}`} className="hover:text-accent-red">
              {siteInfo.phone}
            </a>
          </div>
        )}
        {(siteInfo?.instagramUrl || siteInfo?.facebookUrl) && (
          <div>
            <p className="eyebrow mb-3">Retrouvez-moi</p>
            <div className="flex flex-wrap gap-5">
              {siteInfo.instagramUrl && (
                <a
                  href={siteInfo.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram de cestmoitia (ouvre un nouvel onglet)"
                  className="hover:text-accent-red"
                >
                  Instagram ↗
                </a>
              )}
              {siteInfo.facebookUrl && (
                <a
                  href={siteInfo.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook de cestmoitia (ouvre un nouvel onglet)"
                  className="hover:text-accent-red"
                >
                  Facebook ↗
                </a>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
