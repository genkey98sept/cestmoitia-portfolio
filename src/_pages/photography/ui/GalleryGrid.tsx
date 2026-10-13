"use client";

import { useRef } from "react";
import Image from "next/image";
import { m, useInView, useReducedMotion } from "motion/react";

import type { GalleryPhoto } from "@/entities/gallery";

interface GalleryGridProps {
  featured: GalleryPhoto | null;
  photos: GalleryPhoto[];
}

export function GalleryGrid({ featured, photos }: GalleryGridProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      className="mx-auto w-full max-w-[1440px] px-5 pt-10 tablet:px-[30px] tablet:pt-[60px]"
      aria-label="Mosaique de photos"
    >
      {featured && (
        <FeaturedPhoto
          photo={featured}
          shouldReduceMotion={!!shouldReduceMotion}
        />
      )}

      {photos.length > 0 && (
        <div
          className={`gap-5 tablet:gap-6 ${
            featured ? "mt-5 tablet:mt-6" : ""
          } columns-1 tablet:columns-2 desktop:columns-3`}
        >
          {photos.map((photo, i) => (
            <MasonryItem
              key={photo.id}
              photo={photo}
              index={i}
              shouldReduceMotion={!!shouldReduceMotion}
            />
          ))}
        </div>
      )}
    </section>
  );
}

function FeaturedPhoto({
  photo,
  shouldReduceMotion,
}: {
  photo: GalleryPhoto;
  shouldReduceMotion: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  if (!photo.image?.url) return null;

  const ratio =
    photo.image.width && photo.image.height
      ? photo.image.width / photo.image.height
      : 16 / 9;

  return (
    <m.figure
      ref={ref}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative w-full overflow-hidden rounded-[10px]"
      style={{ aspectRatio: ratio }}
    >
      <Image
        src={photo.image.url}
        alt={photo.image.alt ?? photo.caption ?? "Photo"}
        fill
        priority
        sizes="(max-width: 1440px) 100vw, 1380px"
        className="object-cover"
      />
      {photo.caption && (
        <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/70 to-transparent p-4 font-clash text-[12px] font-medium uppercase tracking-[0.8px] text-text opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 tablet:p-6 tablet:text-[14px]">
          {photo.caption}
        </figcaption>
      )}
    </m.figure>
  );
}

function MasonryItem({
  photo,
  index,
  shouldReduceMotion,
}: {
  photo: GalleryPhoto;
  index: number;
  shouldReduceMotion: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  if (!photo.image?.url) return null;

  // Stagger across columns by index modulo a small number to avoid long delays.
  const delay = shouldReduceMotion ? 0 : Math.min(index * 0.06, 0.3);
  const w = photo.image.width ?? 1200;
  const h = photo.image.height ?? 1600;

  return (
    <m.figure
      ref={ref}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.55, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className="group relative mb-5 break-inside-avoid overflow-hidden rounded-[10px] tablet:mb-6"
    >
      <Image
        src={photo.image.url}
        alt={photo.image.alt ?? photo.caption ?? "Photo"}
        width={w}
        height={h}
        sizes="(max-width: 810px) 100vw, (max-width: 1440px) 50vw, 33vw"
        className="h-auto w-full"
      />
      {photo.caption && (
        <figcaption className="pointer-events-none absolute inset-x-0 bottom-0 translate-y-2 bg-gradient-to-t from-black/70 to-transparent p-3 font-clash text-[11px] font-medium uppercase tracking-[0.6px] text-text opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 tablet:p-4 tablet:text-[12px]">
          {photo.caption}
        </figcaption>
      )}
    </m.figure>
  );
}
