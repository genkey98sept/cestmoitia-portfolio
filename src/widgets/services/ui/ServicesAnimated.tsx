"use client";

import { useId, useState } from "react";

import { SectionHeader } from "@/shared/ui";

interface ServiceItem {
  id?: string;
  title: string;
  description?: string;
}

export function ServicesAnimated({ services }: { services: ServiceItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const prefix = useId();
  return (
    <div>
      <SectionHeader number="03" label="Services" />
      <div className="grid gap-8 tablet:grid-cols-[.85fr_1.15fr] tablet:gap-16">
        <div>
          <h2 className="section-heading text-[clamp(32px,4.2vw,60px)]">
            Services & compétences
          </h2>
          <p className="mt-6 max-w-md font-inter text-lg leading-relaxed text-text-muted">
            J&apos;allie créativité et technique pour donner vie à vos projets !
          </p>
        </div>
        <div className="border-b border-border">
          {services.map((service, index) => (
            <div key={service.id || index} className="border-t border-border">
              <h3>
                <button
                  type="button"
                  id={`${prefix}-trigger-${index}`}
                  aria-expanded={openIndex === index}
                  aria-controls={`${prefix}-panel-${index}`}
                  className="flex min-h-20 w-full items-center justify-between gap-6 py-6 text-left font-clash text-xl font-semibold uppercase tablet:text-2xl"
                  onClick={() =>
                    setOpenIndex((current) =>
                      current === index ? null : index,
                    )
                  }
                >
                  <span>{service.title}</span>
                  <span className="shrink-0 text-accent-red" aria-hidden="true">
                    {openIndex === index ? "−" : "+"}
                  </span>
                </button>
              </h3>
              <div
                id={`${prefix}-panel-${index}`}
                role="region"
                aria-labelledby={`${prefix}-trigger-${index}`}
                hidden={openIndex !== index}
              >
                <p className="max-w-xl pb-6 font-inter leading-relaxed text-text-muted">
                  {service.description ||
                    "Contactez-moi pour en savoir plus sur ce service."}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
