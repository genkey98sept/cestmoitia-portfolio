"use client";

import { useRef } from "react";
import { m, useInView, useReducedMotion } from "motion/react";

import { SectionHeader } from "@/shared/ui";

interface ExperienceItem {
  id?: string;
  company: string;
  position: string;
  year: string;
  description?: string;
}

interface ExperienceAnimatedProps {
  experiences: ExperienceItem[];
}

export function ExperienceAnimated({ experiences }: ExperienceAnimatedProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });
  const shouldReduceMotion = useReducedMotion();

  if (experiences.length === 0) return null;

  return (
    <div ref={sectionRef}>
      <SectionHeader
        number="05"
        label={"//Experience"}
        detail="EXPERIENCE"
        detailMuted={false}
      />

      {/* Title */}
      <div className="mb-8 tablet:mb-12">
        <h2 className="font-clash text-[40px] font-semibold uppercase leading-[30px] text-text tablet:text-[90px] tablet:leading-[70px]">
          EXPERIENCE
        </h2>
      </div>

      {/* Experience cards */}
      <div>
        {experiences.map((exp, index) => (
          <m.div
            key={exp.id ?? index}
            initial={{
              opacity: 0,
              y: shouldReduceMotion ? 0 : 50,
            }}
            animate={
              isInView
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: shouldReduceMotion ? 0 : 50 }
            }
            transition={{
              duration: 0.6,
              ease: [0.25, 0.1, 0.25, 1],
              delay: shouldReduceMotion ? 0 : index * 0.15,
            }}
          >
            {/* Separator */}
            <div className="h-px w-full bg-border" />

            <div className="py-6">
              {/* Company */}
              <h3 className="font-clash text-[34px] font-semibold uppercase leading-[34px] text-text">
                {exp.company}
              </h3>

              {/* Position + Year row */}
              <div className="mt-2 flex items-baseline justify-between">
                <span className="font-clash text-[12px] font-medium uppercase leading-[15px] tracking-[0.8px] text-text-secondary">
                  {exp.position}
                </span>
                <span className="font-clash text-[12px] font-medium uppercase leading-[15px] tracking-[0.8px] text-text-secondary">
                  {exp.year}
                </span>
              </div>

              {/* Description */}
              {exp.description && (
                <p className="mt-3 font-inter text-[16px] font-normal leading-[1.5] text-text-muted">
                  {exp.description}
                </p>
              )}
            </div>
          </m.div>
        ))}
        {/* Bottom separator */}
        <div className="h-px w-full bg-border" />
      </div>
    </div>
  );
}
