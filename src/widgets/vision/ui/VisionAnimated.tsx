"use client";

import { useRef } from "react";
import { m, useScroll, useTransform, useReducedMotion } from "motion/react";

import { SectionHeader } from "@/shared/ui";

const STATEMENT_WORDS = [
  "JEUNE",
  "Créatif",
  "AMOUREUX",
  "DE",
  "L'AUDIOVISUEL:",
  "VOTRE",
  "IDÉE,",
  "MA",
  "VISION.",
];

function ScrollWord({
  word,
  index,
  total,
  scrollYProgress,
  shouldReduceMotion,
}: {
  word: string;
  index: number;
  total: number;
  scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
  shouldReduceMotion: boolean | null;
}) {
  const start = index / (total + 2);
  const end = start + 2 / (total + 2);

  const opacity = useTransform(
    scrollYProgress,
    [start, end],
    shouldReduceMotion ? [1, 1] : [0.001, 1],
  );

  const y = useTransform(
    scrollYProgress,
    [start, end],
    shouldReduceMotion ? [0, 0] : [20, 0],
  );

  return (
    <m.span className="mr-2 inline-block tablet:mr-3" style={{ opacity, y }}>
      {word}
    </m.span>
  );
}

export function VisionAnimated() {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const signatureX = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [-500, 0],
  );

  return (
    <div ref={containerRef}>
      <SectionHeader number="04" label="//" detail="Since 2001" />

      {/* Statement text */}
      <div className="mb-10 tablet:mb-16">
        <p className="font-clash text-[25px] font-semibold leading-[19.8px] text-text tablet:text-[48px] tablet:leading-[38.8px]">
          {STATEMENT_WORDS.map((word, i) => (
            <ScrollWord
              key={i}
              word={word}
              index={i}
              total={STATEMENT_WORDS.length}
              scrollYProgress={scrollYProgress}
              shouldReduceMotion={shouldReduceMotion}
            />
          ))}
        </p>
      </div>

      {/* Signature / decorative element */}
      <div className="overflow-hidden">
        <m.div
          className="font-clash text-[60px] font-semibold uppercase leading-[50px] tracking-[-1.6px] text-text opacity-10 tablet:text-[140px] tablet:leading-[110px] tablet:tracking-[-3.2px]"
          style={{ x: signatureX }}
          aria-hidden="true"
        >
          CESTMOITIA
        </m.div>
      </div>
    </div>
  );
}
