"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { m, AnimatePresence } from "motion/react";

import { Menu } from "@/widgets/menu";

export function HeaderAnimated() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav
        className="relative z-50 flex h-[50px] items-center justify-between px-5 desktop:px-[30px]"
        aria-label="Navigation principale"
      >
        {/* Left: Local Time */}
        <div className="flex h-[50px] w-[110px] items-center desktop:w-[240px]">
          <LocalClock />
        </div>

        {/* Center: Menu toggle (4 dots ↔ X) */}
        <div className="flex h-[50px] w-[44px] items-center justify-center desktop:w-[240px]">
          <MenuToggle
            open={menuOpen}
            onClick={() => setMenuOpen((o) => !o)}
          />
        </div>

        {/* Right: CTA Button */}
        <div className="flex w-[110px] justify-end desktop:w-[240px]">
          <CTAButton />
        </div>
      </nav>

      <Menu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

function LocalClock() {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setTime(
        now.toLocaleTimeString("fr-FR", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
          timeZone: "Pacific/Tahiti",
        }),
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-baseline gap-1">
      <span className="hidden font-clash text-[18px] font-medium uppercase leading-[28px] text-text-muted desktop:inline">
        LOCAL/
      </span>
      <span
        className="font-clash text-[18px] font-medium leading-[28px] text-text tabular-nums desktop:leading-[18px]"
        aria-live="polite"
        aria-label={`Heure locale Tahiti : ${time}`}
      >
        {time}
      </span>
    </div>
  );
}

function MenuToggle({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={open ? "Fermer le menu" : "Ouvrir le menu"}
      aria-expanded={open}
      aria-controls="site-menu"
      className="relative grid h-10 w-10 place-items-center rounded-full transition-colors duration-200 hover:bg-bg-alt focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue"
    >
      <AnimatePresence mode="wait" initial={false}>
        {open ? (
          <m.svg
            key="x"
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            className="absolute text-text"
            initial={{ opacity: 0, rotate: -45 }}
            animate={{ opacity: 1, rotate: 0 }}
            exit={{ opacity: 0, rotate: 45 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
          >
            <path d="M5 5l10 10M5 15L15 5" />
          </m.svg>
        ) : (
          <m.span
            key="dots"
            className="absolute grid h-[18px] w-[18px] grid-cols-2 grid-rows-2 place-items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            aria-hidden="true"
          >
            <span className="block h-1 w-1 rounded-full bg-text" />
            <span className="block h-1 w-1 rounded-full bg-text" />
            <span className="block h-1 w-1 rounded-full bg-text" />
            <span className="block h-1 w-1 rounded-full bg-text" />
          </m.span>
        )}
      </AnimatePresence>
    </button>
  );
}

function CTAButton() {
  return (
    <Link
      href="/contact"
      className="group relative inline-flex h-[36px] items-center justify-center overflow-hidden rounded-[60px] border border-text px-[14px] text-[12px] leading-none transition-colors duration-300 ease-out hover:border-bg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-blue desktop:h-[48px] desktop:px-[24px]"
    >
      <span className="relative z-[3] font-clash text-[12px] font-semibold uppercase leading-[12px] text-text transition-colors duration-300 ease-out group-hover:text-bg group-focus-visible:text-bg desktop:text-[18px] desktop:leading-[20px]">
        <span className="desktop:hidden">CONTACT</span>
        <span className="hidden desktop:inline">CONTACTEZ-MOI</span>
      </span>
      <span
        className="absolute inset-x-0 bottom-0 z-[1] h-full translate-y-full bg-text transition-transform duration-300 ease-out group-hover:translate-y-0 group-focus-visible:translate-y-0"
        aria-hidden="true"
      />
    </Link>
  );
}
