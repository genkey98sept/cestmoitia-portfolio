"use client";

import Image from "next/image";
import { m } from "motion/react";

export interface ProjectCardAnimatedProps {
  title: string;
  category?: string;
  imageUrl: string;
  imageAlt: string;
}

export function ProjectCardAnimated({
  title,
  category,
  imageUrl,
  imageAlt,
}: ProjectCardAnimatedProps) {
  return (
    <m.div
      className="overflow-hidden"
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 390px) 100vw, (max-width: 810px) 50vw, 33vw"
          />
        )}
      </div>
      <div className="mt-3">
        {category && (
          <p className="text-xs uppercase tracking-widest opacity-60">
            {category}
          </p>
        )}
        <h3 className="mt-1 font-semibold uppercase">{title}</h3>
      </div>
    </m.div>
  );
}
