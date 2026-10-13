"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Menu } from "./Menu";

export function HeaderAnimated() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);
  const pathname = usePathname();

  return (
    <>
      <nav
        className="site-shell flex min-h-[76px] items-center justify-between gap-3"
        aria-label="Navigation principale"
      >
        <Link
          href="/"
          aria-label="cestmoitia — Accueil"
          aria-current={pathname === "/" ? "page" : undefined}
          className="flex min-h-12 items-center font-clash text-lg font-semibold tracking-tight tablet:text-2xl"
        >
          cestmoitia<span className="text-accent-red">.</span>
        </Link>
        <div className="flex items-center gap-2 tablet:gap-6">
          <span className="eyebrow hidden tablet:inline">
            Puna&apos;auia · Tahiti
          </span>
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Ouvrir le menu"
            aria-expanded={menuOpen}
            aria-controls="site-menu"
            aria-haspopup="dialog"
            className="secondary-link !px-4"
          >
            Menu <span aria-hidden="true">☰</span>
          </button>
          <Link
            href="/contact"
            aria-current={pathname === "/contact" ? "page" : undefined}
            className={`hidden tablet:inline-flex ${pathname === "/contact" ? "secondary-link" : "primary-link"}`}
          >
            Contact
          </Link>
        </div>
      </nav>
      <Menu open={menuOpen} onClose={closeMenu} />
    </>
  );
}
