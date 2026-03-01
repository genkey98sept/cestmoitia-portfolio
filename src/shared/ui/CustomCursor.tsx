"use client";

import { useEffect, useRef, useCallback } from "react";
import { useReducedMotion } from "motion/react";

export function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();
  const rafId = useRef<number>(0);
  const pos = useRef({ x: -100, y: -100 });

  const onMouseMove = useCallback(
    (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY };

      if (!rafId.current) {
        rafId.current = requestAnimationFrame(() => {
          if (cursorRef.current) {
            cursorRef.current.style.transform = `translate(-50%, -50%) translateX(${pos.current.x}px) translateY(${pos.current.y}px)`;
            cursorRef.current.style.opacity = "1";
          }
          rafId.current = 0;
        });
      }
    },
    [],
  );

  const onMouseLeave = useCallback(() => {
    if (cursorRef.current) cursorRef.current.style.opacity = "0";
  }, []);

  const onMouseEnter = useCallback(() => {
    if (cursorRef.current) cursorRef.current.style.opacity = "1";
  }, []);

  useEffect(() => {
    if (shouldReduceMotion) return;

    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return;

    document.documentElement.classList.add("has-custom-cursor");

    document.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);

    return () => {
      document.documentElement.classList.remove("has-custom-cursor");
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      if (rafId.current) cancelAnimationFrame(rafId.current);
    };
  }, [shouldReduceMotion, onMouseMove, onMouseLeave, onMouseEnter]);

  if (shouldReduceMotion) return null;

  return (
    <div
      ref={cursorRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: 16,
        height: 16,
        backgroundColor: "#ffffff",
        borderRadius: 259,
        pointerEvents: "none",
        zIndex: 9999,
        opacity: 0,
        transform: "translate(-50%, -50%)",
        mixBlendMode: "difference",
      }}
    />
  );
}
