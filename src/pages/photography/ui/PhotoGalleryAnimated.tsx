"use client";

import Image from "next/image";
import { m, useReducedMotion, useInView } from "motion/react";
import { useRef } from "react";

const photos = [
  { src: "/photography/01-man-workout.jpg", alt: "Man Workout", orientation: "landscape" as const },
  { src: "/photography/02-snow-gliding.jpg", alt: "Snow Gliding", orientation: "portrait" as const },
  { src: "/photography/03-woman-and-dog.jpg", alt: "Woman And Dog", orientation: "portrait" as const },
  { src: "/photography/04-woman-workout.jpg", alt: "Woman Workout", orientation: "landscape" as const },
  { src: "/photography/05-retro-car.jpg", alt: "Retro Car", orientation: "portrait" as const },
  { src: "/photography/06-man-cycling.jpg", alt: "Man Cycling", orientation: "landscape" as const },
  { src: "/photography/07-man-and-woman.jpg", alt: "Man And Woman", orientation: "portrait" as const },
  { src: "/photography/08-eye.jpg", alt: "Eye", orientation: "landscape" as const },
  { src: "/photography/09-car-top-shot.jpg", alt: "Car Top Shot", orientation: "landscape" as const },
  { src: "/photography/10-man.jpg", alt: "Man", orientation: "portrait" as const },
];

function GalleryImage({
  src,
  alt,
  className,
  sizes,
  priority = false,
  delay = 0,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes: string;
  priority?: boolean;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const prefersReducedMotion = useReducedMotion();

  return (
    <m.div
      ref={ref}
      initial={prefersReducedMotion ? false : { opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1], delay }}
      className={`relative overflow-hidden rounded-[10px] ${className ?? ""}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={sizes}
        priority={priority}
      />
    </m.div>
  );
}

export function PhotoGalleryAnimated() {
  return (
    <section
      className="mx-auto w-full max-w-[1440px] px-5 pt-10 tablet:px-[30px] tablet:pt-[60px]"
      aria-label="Galerie photos"
    >
      <div className="flex flex-col gap-5 tablet:gap-6">
        {/* Row 1: Full width landscape */}
        <GalleryImage
          src={photos[0].src}
          alt={photos[0].alt}
          className="aspect-[16/8] w-full"
          sizes="(max-width: 810px) 100vw, 1392px"
          priority
        />

        {/* Row 2: Two equal portrait columns */}
        <div className="grid grid-cols-1 gap-5 tablet:grid-cols-2 tablet:gap-6">
          <GalleryImage
            src={photos[1].src}
            alt={photos[1].alt}
            className="aspect-[3/4] w-full"
            sizes="(max-width: 810px) 100vw, 684px"
            delay={0.1}
          />
          <GalleryImage
            src={photos[2].src}
            alt={photos[2].alt}
            className="aspect-[3/4] w-full"
            sizes="(max-width: 810px) 100vw, 684px"
            delay={0.2}
          />
        </div>

        {/* Row 3: Left stacked (landscape + portrait) | Right tall landscape */}
        <div className="grid grid-cols-1 gap-5 tablet:grid-cols-2 tablet:gap-6">
          {/* Left: stacked */}
          <div className="flex flex-col gap-5 tablet:gap-6">
            <GalleryImage
              src={photos[3].src}
              alt={photos[3].alt}
              className="aspect-[16/9] w-full"
              sizes="(max-width: 810px) 100vw, 684px"
              delay={0.1}
            />
            <GalleryImage
              src={photos[4].src}
              alt={photos[4].alt}
              className="aspect-[16/9] w-full"
              sizes="(max-width: 810px) 100vw, 684px"
              delay={0.2}
            />
          </div>
          {/* Right: tall, matches combined height */}
          <GalleryImage
            src={photos[5].src}
            alt={photos[5].alt}
            className="aspect-[3/4] w-full tablet:aspect-auto tablet:h-full"
            sizes="(max-width: 810px) 100vw, 684px"
            delay={0.15}
          />
        </div>

        {/* Row 4: Left tall portrait | Right stacked landscapes */}
        <div className="grid grid-cols-1 gap-5 tablet:grid-cols-2 tablet:gap-6">
          {/* Left: tall portrait */}
          <GalleryImage
            src={photos[6].src}
            alt={photos[6].alt}
            className="aspect-[3/4] w-full tablet:aspect-auto tablet:h-full"
            sizes="(max-width: 810px) 100vw, 684px"
            delay={0.1}
          />
          {/* Right: stacked */}
          <div className="flex flex-col gap-5 tablet:gap-6">
            <GalleryImage
              src={photos[7].src}
              alt={photos[7].alt}
              className="aspect-[16/9] w-full"
              sizes="(max-width: 810px) 100vw, 684px"
              delay={0.15}
            />
            <GalleryImage
              src={photos[8].src}
              alt={photos[8].alt}
              className="aspect-[16/9] w-full"
              sizes="(max-width: 810px) 100vw, 684px"
              delay={0.2}
            />
          </div>
        </div>

        {/* Row 5: Single portrait (smaller) */}
        <div className="flex justify-start">
          <GalleryImage
            src={photos[9].src}
            alt={photos[9].alt}
            className="aspect-[3/4] w-full tablet:w-1/3"
            sizes="(max-width: 810px) 100vw, 460px"
            delay={0.1}
          />
        </div>
      </div>
    </section>
  );
}
