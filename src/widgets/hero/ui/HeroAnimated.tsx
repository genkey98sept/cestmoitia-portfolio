"use client";

import { useRef } from "react";
import Image from "next/image";
import { m, useScroll, useTransform, useReducedMotion } from "motion/react";

export function HeroAnimated() {
  const shouldReduceMotion = useReducedMotion();
  const imageContainerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: imageContainerRef,
    offset: ["start end", "end start"],
  });

  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    shouldReduceMotion ? [0, 0] : [0, -60],
  );

  const fadeUp = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 30 },
    visible: { opacity: 1, y: 0 },
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  return (
    <div className="flex flex-col gap-8 px-5 tablet:gap-[60px] tablet:px-[30px]">
      {/* H1 Title */}
      <m.h1
        className="font-clash text-[40px] font-semibold uppercase leading-[30px] tracking-[-1.2px] text-text tablet:text-[80px] tablet:leading-[65px] tablet:tracking-[-2px] desktop:text-[227.2px] desktop:leading-[181.76px] desktop:tracking-[-3px]"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{
          duration: 0.8,
          ease: [0.25, 0.1, 0.25, 1],
          delay: 0.1,
        }}
      >
        cestmoitia
      </m.h1>

      {/* Details Row */}
      <m.div
        className="flex flex-col gap-6 tablet:flex-row tablet:justify-between"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
        transition={{
          duration: 0.94,
          ease: "linear",
          delay: 0.2,
        }}
      >
        {/* Location */}
        <div className="flex flex-col">
          <p className="font-clash text-[12px] font-medium uppercase leading-[15px] tracking-[0.8px] text-text">
            BASED IN Puna&apos;auia,
          </p>
          <p className="font-clash text-[12px] font-medium uppercase leading-[15px] tracking-[0.8px] text-text-secondary">
            Tahiti
          </p>
        </div>

        {/* Availability */}
        <div className="flex flex-col">
          <p className="font-clash text-[12px] font-medium uppercase leading-[15px] tracking-[0.8px] text-text">
            Available ALL AROUNd
          </p>
          <p className="font-clash text-[12px] font-medium uppercase leading-[15px] tracking-[0.8px] text-text-secondary">
            worldwidE
          </p>
        </div>

        {/* Profession */}
        <div className="flex flex-col">
          <p className="font-clash text-[12px] font-medium uppercase leading-[15px] tracking-[0.8px] text-text">
            filmaker / graphiste
          </p>
          <p className="font-clash text-[12px] font-medium uppercase leading-[15px] tracking-[0.8px] text-text-secondary">
            + motion designer
          </p>
        </div>
      </m.div>

      {/* Separator */}
      <div className="h-px w-full bg-border" />

      {/* Parallax Image */}
      <div
        ref={imageContainerRef}
        className="relative overflow-hidden rounded-[10px]"
      >
        <m.div
          className="relative aspect-[3/2] w-full desktop:aspect-[1380/438]"
          style={{ y: imageY }}
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          transition={{
            duration: 1.02,
            ease: "linear",
            delay: 0.4,
          }}
        >
          <Image
            src="/hero-tia.jpg"
            alt="Portrait de Tia, creatif audiovisuel base a Tahiti"
            fill
            className="object-cover"
            sizes="(max-width: 810px) 100vw, 1380px"
            priority
          />
        </m.div>
      </div>
    </div>
  );
}
