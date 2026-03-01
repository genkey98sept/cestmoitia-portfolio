"use client";

import { m, useReducedMotion } from "motion/react";

export function MoreWorksAnimated() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="overflow-hidden py-8 tablet:py-12" aria-hidden="true">
      <m.div
        className="flex whitespace-nowrap"
        animate={
          shouldReduceMotion
            ? {}
            : {
                x: ["0%", "-50%"],
              }
        }
        transition={{
          x: {
            duration: 20,
            repeat: Infinity,
            ease: "linear",
          },
        }}
      >
        {[0, 1].map((copy) => (
          <span
            key={copy}
            className="mr-8 font-clash text-[60px] font-semibold uppercase leading-[50px] text-text tablet:text-[120px] tablet:leading-[100px]"
          >
            MORE WORKS MORE WORKS!&nbsp;&nbsp;&nbsp;
          </span>
        ))}
      </m.div>
    </div>
  );
}
