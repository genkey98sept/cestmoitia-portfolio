"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const pathname = usePathname();

  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let instance: Lenis | null = null;
    let frame = 0;

    const stop = () => {
      cancelAnimationFrame(frame);
      instance?.destroy();
      instance = null;
    };
    const update = () => {
      stop();
      if (!preference.matches) {
        instance = new Lenis({
          lerp: 0.08,
          wheelMultiplier: 0.9,
          anchors: { offset: -90 },
        });
        const raf = (time: number) => {
          instance?.raf(time);
          frame = requestAnimationFrame(raf);
        };
        frame = requestAnimationFrame(raf);
      }
      setLenis(instance);
    };
    update();
    preference.addEventListener("change", update);
    return () => {
      preference.removeEventListener("change", update);
      stop();
    };
  }, []);

  // Les sections peuvent arriver après la navigation : attendre leur rendu.
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) return;
    let targetId: string;
    try {
      targetId = decodeURIComponent(hash.slice(1));
    } catch {
      return;
    }
    let frame = 0;
    let attempts = 0;
    const scroll = () => {
      const target = document.getElementById(targetId);
      if (target) {
        const top = target.getBoundingClientRect().top + window.scrollY - 90;
        if (lenis) lenis.scrollTo(top, { immediate: true });
        else window.scrollTo({ top, behavior: "auto" });
      } else if (++attempts < 90) frame = requestAnimationFrame(scroll);
    };
    frame = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(frame);
  }, [pathname, lenis]);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
