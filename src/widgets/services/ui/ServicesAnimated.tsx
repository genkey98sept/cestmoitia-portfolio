"use client";

import { useRef, useState } from "react";
import { m, AnimatePresence, useInView, useReducedMotion } from "motion/react";

import { SectionHeader } from "@/shared/ui";

interface ServiceItem {
  id?: string;
  title: string;
  description?: string;
}

interface ServicesAnimatedProps {
  services: ServiceItem[];
}

export function ServicesAnimated({ services }: ServicesAnimatedProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });
  const shouldReduceMotion = useReducedMotion();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <div ref={sectionRef}>
      <SectionHeader
        number="03"
        label={"//Services"}
        detail="Fast Delivery"
      />

      {/* Title */}
      <div className="mb-8 tablet:mb-12">
        <h2 className="font-clash text-[40px] font-semibold uppercase leading-[30px] text-text tablet:text-[90px] tablet:leading-[70px]">
          <span className="block">Services //</span>
          <span className="block">compétence</span>
        </h2>
      </div>

      {/* Intro text */}
      <m.p
        className="mb-10 max-w-[650px] font-inter text-[16px] font-normal leading-[1.5] text-text-muted"
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.6, delay: shouldReduceMotion ? 0 : 0.2 }}
      >
        J&apos;allie créativité et technique pour donner vie vos projets !
      </m.p>

      {/* Accordion */}
      <div>
        {services.map((service, index) => (
          <m.div
            key={service.id ?? index}
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 20 }}
            animate={
              isInView
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: shouldReduceMotion ? 0 : 20 }
            }
            transition={{
              duration: 0.5,
              ease: [0.25, 0.1, 0.25, 1],
              delay: shouldReduceMotion ? 0 : index * 0.1,
            }}
          >
            {/* Separator top */}
            <div className="h-px w-full bg-border" />

            {/* Accordion header */}
            <button
              className="flex w-full cursor-pointer items-center justify-between py-6"
              onClick={() => handleToggle(index)}
              aria-expanded={openIndex === index}
              aria-controls={`service-content-${index}`}
            >
              <span className="font-clash text-[18px] font-semibold uppercase text-text">
                {service.title}
              </span>
              <m.svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-text"
                animate={{
                  rotate: openIndex === index ? 90 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                <path d="M9 18l6-6-6-6" />
              </m.svg>
            </button>

            {/* Accordion content */}
            <AnimatePresence initial={false}>
              {openIndex === index && service.description && (
                <m.div
                  id={`service-content-${index}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{
                    height: {
                      duration: shouldReduceMotion ? 0 : 0.3,
                      ease: [0.25, 0.1, 0.25, 1],
                    },
                    opacity: {
                      duration: shouldReduceMotion ? 0 : 0.2,
                    },
                  }}
                  className="overflow-hidden"
                >
                  <p className="pb-6 font-inter text-[16px] font-normal leading-[1.5] text-text-muted">
                    {service.description}
                  </p>
                </m.div>
              )}
            </AnimatePresence>
          </m.div>
        ))}
        {/* Bottom separator */}
        <div className="h-px w-full bg-border" />
      </div>
    </div>
  );
}
