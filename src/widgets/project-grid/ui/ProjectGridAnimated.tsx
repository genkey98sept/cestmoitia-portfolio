"use client";

import { useRef, Children } from "react";
import { m, useInView, useReducedMotion } from "motion/react";

interface ProjectGridAnimatedProps {
  children: React.ReactNode;
}

export function ProjectGridAnimated({ children }: ProjectGridAnimatedProps) {
  const gridRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(gridRef, {
    once: true,
    margin: "-100px 0px",
  });
  const shouldReduceMotion = useReducedMotion();

  const items = Children.toArray(children);

  if (items.length === 0) {
    return null;
  }

  return (
    <div
      ref={gridRef}
      className="grid grid-cols-1 gap-6 tablet:grid-cols-2 tablet:gap-[28px]"
      role="list"
    >
      {items.map((child, index) => (
        <m.div
          key={index}
          role="listitem"
          initial={{
            opacity: 0,
            y: shouldReduceMotion ? 0 : 30,
          }}
          animate={
            isInView
              ? { opacity: 1, y: 0 }
              : { opacity: 0, y: shouldReduceMotion ? 0 : 30 }
          }
          transition={{
            duration: 0.6,
            ease: [0.25, 0.1, 0.25, 1],
            delay: shouldReduceMotion ? 0 : index * 0.15,
          }}
        >
          {child}
        </m.div>
      ))}
    </div>
  );
}
