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
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (prefersReducedMotion) return;

    const instance = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.1,
      syncTouch: true,
    });
    setLenis(instance);

    let rafId = 0;
    function raf(time: number) {
      instance.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      instance.destroy();
      setLenis(null);
    };
  }, []);

  // Scroll to hash on first paint and on route change carrying a hash.
  // Retries each frame until the target exists (covers cross-page nav where
  // the destination section is not yet in the DOM when the route resolves).
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hash = window.location.hash;
    if (!hash) return;

    let cancelled = false;
    let frameId = 0;
    let attempts = 0;
    const maxAttempts = 90; // ~1.5s at 60fps

    const cleanups: (() => void)[] = [];

    const performScroll = () => {
      const target = document.querySelector(hash) as HTMLElement | null;
      if (!target) return false;
      // Ensure Lenis isn't in a stopped state (which sets html.overflow:hidden
      // and blocks window.scrollTo).
      lenis?.start();
      const top = target.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top, behavior: "auto" });
      lenis?.scrollTo(top, { immediate: true, force: true });
      return true;
    };

    const tryScroll = () => {
      if (cancelled) return;
      if (performScroll()) {
        // Re-apply once the page has had time to settle (fonts, async images,
        // hydration). Catches cases where the section's offset changes after
        // initial layout.
        const tId = window.setTimeout(() => {
          if (!cancelled) performScroll();
        }, 250);
        cleanups.push(() => window.clearTimeout(tId));
        return;
      }
      attempts += 1;
      if (attempts < maxAttempts) {
        frameId = requestAnimationFrame(tryScroll);
      }
    };

    frameId = requestAnimationFrame(tryScroll);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frameId);
      cleanups.forEach((c) => c());
    };
  }, [pathname, lenis]);

  return (
    <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
  );
}
