"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export function HeaderAnimated() {
  return (
    <nav
      className="flex h-[50px] items-center justify-between px-5 desktop:px-[30px]"
      aria-label="Navigation principale"
    >
      {/* Left: Local Time */}
      <div className="flex h-[50px] w-[110px] items-center desktop:w-[240px]">
        <LocalClock />
      </div>

      {/* Center: Dot Grid (home link) */}
      <div className="flex h-[50px] w-[18px] items-center justify-center desktop:w-[240px]">
        <DotGrid />
      </div>

      {/* Right: CTA Button */}
      <div className="flex w-[110px] justify-end desktop:w-[240px]">
        <CTAButton />
      </div>
    </nav>
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

function DotGrid() {
  return (
    <Link
      href="/"
      className="grid h-[18px] w-[18px] grid-cols-2 grid-rows-2 place-items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-blue"
      aria-label="Accueil cestmoitia"
    >
      <span className="block h-1 w-1 rounded-full bg-text" />
      <span className="block h-1 w-1 rounded-full bg-text" />
      <span className="block h-1 w-1 rounded-full bg-text" />
      <span className="block h-1 w-1 rounded-full bg-text" />
    </Link>
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
