"use client";

import { useRef } from "react";
import Image from "next/image";
import {
  m,
  useInView,
  useScroll,
  useTransform,
  useReducedMotion,
} from "motion/react";

import { SectionHeader } from "@/shared/ui";

interface AboutAnimatedProps {
  cvUrl?: string;
}

export function AboutAnimated({ cvUrl }: AboutAnimatedProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px 0px" });
  const shouldReduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: imageRef,
    offset: ["start end", "end start"],
  });

  const imageScale = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [1, 1] : [2, 1],
  );

  const titleWords = ["a", "propos", "de"];

  return (
    <div ref={sectionRef}>
      <SectionHeader
        number="02"
        label={"//a propos de moi"}
        detail="Since 2000"
      />

      {/* Title */}
      <div className="mb-8 tablet:mb-12">
        <h2 className="font-clash text-[40px] font-semibold uppercase leading-[30px] text-text tablet:text-[90px] tablet:leading-[70px]">
          <span className="block">
            {titleWords.map((word, i) => (
              <m.span
                key={i}
                className="mr-3 inline-block tablet:mr-5"
                initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
                animate={
                  isInView
                    ? { opacity: 1, y: 0 }
                    : { opacity: 0, y: shouldReduceMotion ? 0 : 30 }
                }
                transition={{
                  duration: 0.6,
                  ease: [0.25, 0.1, 0.25, 1],
                  delay: shouldReduceMotion ? 0 : i * 0.1,
                }}
              >
                {word}
              </m.span>
            ))}
          </span>
          <m.span
            className="block"
            initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 30 }}
            animate={
              isInView
                ? { opacity: 1, y: 0 }
                : { opacity: 0, y: shouldReduceMotion ? 0 : 30 }
            }
            transition={{
              duration: 0.6,
              ease: [0.25, 0.1, 0.25, 1],
              delay: shouldReduceMotion ? 0 : 0.3,
            }}
          >
            MOi
          </m.span>
        </h2>
      </div>

      {/* Content: text + image */}
      <div className="flex flex-col gap-10 tablet:flex-row tablet:gap-[60px]">
        {/* Text column */}
        <m.div
          className="flex flex-col gap-6 tablet:w-1/2"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{
            duration: 0.6,
            ease: "easeOut",
            delay: shouldReduceMotion ? 0 : 0.3,
          }}
        >
          <p className="font-inter text-[18px] font-medium leading-[1.5] text-text">
            Moi, c&apos;est Tia, un jeune créatif passionné par
            l&apos;audiovisuel, avec plus de 7 ans d&apos;expérience
            professionnelle en entreprise et en freelance.
          </p>
          <p className="font-inter text-[16px] font-normal leading-[1.5] text-text-muted">
            Je crée, j&apos;imagine et je construis dans le monde digital, là
            où tout devient possible.
          </p>
          <p className="font-inter text-[16px] font-normal leading-[1.5] text-text-muted">
            Curieux et motivé, je continue chaque jour à apprendre à travers de
            nouvelles expériences et de nouveaux projets. Parfois un peu
            désordonné, mais toujours animé par la créativité et
            l&apos;efficacité.
          </p>
          {cvUrl && (
            <a
              href={cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="font-inter text-[16px] text-text underline transition-colors hover:text-accent-blue"
              aria-label="Télécharger le CV de Tia (ouvre un nouvel onglet)"
            >
              Mon CV
            </a>
          )}
        </m.div>

        {/* Image column with perspective zoom */}
        <div
          ref={imageRef}
          className="overflow-hidden rounded-[10px] tablet:w-1/2"
          style={{ perspective: "1200px" }}
        >
          <m.div
            className="relative aspect-[3/4] w-full"
            style={{ scale: imageScale }}
          >
            <Image
              src="/about-tia.jpg"
              alt="Portrait de Tia"
              fill
              className="object-cover"
              sizes="(max-width: 810px) 100vw, 50vw"
            />
          </m.div>
        </div>
      </div>
    </div>
  );
}
