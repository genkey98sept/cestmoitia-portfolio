"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { m, AnimatePresence } from "motion/react";

import { useLenis } from "@/shared/ui";

interface MenuLink {
  label: string;
  href: string;
}

const PAGE_LINKS: MenuLink[] = [
  { label: "Accueil", href: "/" },
  { label: "Galerie", href: "/photography" },
  { label: "Contact", href: "/contact" },
];

const SECTION_LINKS: MenuLink[] = [
  { label: "Portfolio", href: "/#portfolio" },
  { label: "À propos", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Expérience", href: "/#experience" },
];

interface MenuProps {
  open: boolean;
  onClose: () => void;
}

export function Menu({ open, onClose }: MenuProps) {
  const lenis = useLenis();
  const pathname = usePathname();
  const firstLinkRef = useRef<HTMLAnchorElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);

    lenis?.stop();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const focusTimer = window.setTimeout(() => {
      firstLinkRef.current?.focus();
    }, 250);

    return () => {
      document.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimer);
      lenis?.start();
      document.body.style.overflow = previousOverflow;
    };
  }, [open, lenis, onClose]);

  function handleSectionClick(
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) {
    const hashIndex = href.indexOf("#");
    if (hashIndex === -1) return;
    const hash = href.slice(hashIndex);

    const isHome = pathname === "/";
    if (isHome) {
      e.preventDefault();
      onClose();
      // Wait for menu exit animation (~280ms) and Lenis.start() to run.
      window.setTimeout(() => {
        const target = document.querySelector(hash);
        if (target && lenis) {
          lenis.scrollTo(target as HTMLElement, {
            offset: -100,
            duration: 1.2,
          });
        } else if (target) {
          (target as HTMLElement).scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 320);
    } else {
      // Cross-page nav: unlock scroll BEFORE navigation so the destination
      // page's HashScroller can move the viewport. Otherwise the .lenis-stopped
      // class (overflow:hidden on <html>) blocks window.scrollTo on arrival.
      lenis?.start();
      document.body.style.overflow = "";
      onClose();
      // Default Link behavior triggers navigation with scroll={false}.
    }
  }

  function handlePageClick() {
    // Same unlock for page nav so the destination page can scroll.
    lenis?.start();
    document.body.style.overflow = "";
    onClose();
  }

  const isCurrentPage = (href: string) =>
    href === "/" ? pathname === "/" : !!pathname?.startsWith(href);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <m.div
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navigation"
          id="site-menu"
          className="fixed inset-0 z-40 bg-bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {/* Click backdrop to close — content blocks propagation */}
          <div
            className="absolute inset-0"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Always-accessible close button. Independent of the header so it
              works even if scroll lock breaks sticky positioning. */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer le menu"
            className="fixed right-5 top-[34px] z-10 grid h-12 w-12 place-items-center rounded-full text-text transition-colors duration-200 hover:bg-bg-alt focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-blue tablet:right-[30px]"
          >
            <svg
              width="22"
              height="22"
              viewBox="0 0 22 22"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              <path d="M5 5l12 12M5 17L17 5" />
            </svg>
          </button>

          <div
            className="relative mx-auto flex h-full max-w-[1440px] flex-col justify-between px-5 pb-10 pt-[120px] tablet:px-[30px] tablet:pb-[60px] tablet:pt-[160px]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Pages — primary nav */}
            <div>
              <p className="mb-5 font-clash text-[12px] font-medium uppercase tracking-[0.8px] text-text-secondary tablet:mb-8">
                (Pages)
              </p>
              <ul className="flex flex-col gap-1 tablet:gap-2">
                {PAGE_LINKS.map((link, i) => {
                  const isCurrent = isCurrentPage(link.href);
                  return (
                    <m.li
                      key={link.href}
                      initial={{ opacity: 0, y: 24 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 12 }}
                      transition={{
                        duration: 0.45,
                        delay: 0.12 + i * 0.06,
                        ease: [0.25, 0.1, 0.25, 1],
                      }}
                    >
                      <Link
                        ref={i === 0 ? firstLinkRef : undefined}
                        href={link.href}
                        onClick={handlePageClick}
                        aria-current={isCurrent ? "page" : undefined}
                        className={`group inline-flex items-baseline gap-3 font-clash text-[44px] font-semibold uppercase leading-[1.02] tracking-[-1px] transition-colors duration-200 tablet:text-[80px] tablet:tracking-[-2px] desktop:text-[120px] desktop:tracking-[-3px] ${
                          isCurrent
                            ? "text-text-secondary"
                            : "text-text hover:text-accent-blue"
                        }`}
                      >
                        <span>{link.label}</span>
                        <span
                          className="text-[10px] tracking-normal text-text-secondary opacity-0 transition-opacity duration-200 group-hover:opacity-100 tablet:text-[12px]"
                          aria-hidden="true"
                        >
                          ↗
                        </span>
                      </Link>
                    </m.li>
                  );
                })}
              </ul>
            </div>

            {/* Sections — secondary nav */}
            <div className="mt-10 tablet:mt-0">
              <p className="mb-4 font-clash text-[12px] font-medium uppercase tracking-[0.8px] text-text-secondary tablet:mb-6">
                (Sections)
              </p>
              <ul className="flex flex-wrap gap-x-5 gap-y-2 tablet:gap-x-8">
                {SECTION_LINKS.map((link, i) => (
                  <m.li
                    key={link.href}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{
                      duration: 0.4,
                      delay: 0.32 + i * 0.05,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                  >
                    <Link
                      href={link.href}
                      scroll={false}
                      onClick={(e) => handleSectionClick(e, link.href)}
                      className="font-clash text-[16px] font-medium uppercase tracking-[0.5px] text-text-muted transition-colors duration-200 hover:text-text tablet:text-[22px]"
                    >
                      {link.label}
                    </Link>
                  </m.li>
                ))}
              </ul>
            </div>
          </div>
        </m.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
