"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Modal, useLenis } from "@/shared/ui";

const pages = [
  { label: "Accueil", href: "/" },
  { label: "Projets", href: "/work" },
  { label: "Galerie", href: "/photography" },
  { label: "Contact", href: "/contact" },
];
const sections = [
  { label: "Portfolio", href: "/#portfolio" },
  { label: "À propos", href: "/#about" },
  { label: "Services", href: "/#services" },
  { label: "Expérience", href: "/#experience" },
];

export function Menu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const lenis = useLenis();

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);
  return (
    <Modal
      open={open}
      onClose={onClose}
      id="site-menu"
      label="Menu de navigation"
    >
      <nav aria-label="Pages du portfolio" className="py-6">
        <p className="eyebrow mb-4">Explorer</p>
        <ul>
          {pages.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={onClose}
                className="menu-link"
                aria-current={
                  pathname === link.href ||
                  (link.href === "/work" && pathname.startsWith("/work/"))
                    ? "page"
                    : undefined
                }
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <nav
        aria-label="Sections de l’accueil"
        className="border-t border-border pt-6"
      >
        <p className="eyebrow mb-3">Sur la page d’accueil</p>
        <ul className="flex flex-wrap gap-x-6 gap-y-2">
          {sections.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                scroll={false}
                className="inline-flex min-h-12 items-center text-text-muted hover:text-text"
                onClick={(event) => {
                  onClose();
                  if (pathname !== "/") return;
                  event.preventDefault();
                  const hash = link.href.slice(1);
                  window.history.replaceState(null, "", link.href);
                  requestAnimationFrame(() => {
                    const target = document.querySelector<HTMLElement>(hash);
                    if (!target) return;
                    const reduced = window.matchMedia(
                      "(prefers-reduced-motion: reduce)",
                    ).matches;
                    if (lenis && !reduced) {
                      lenis.scrollTo(target, {
                        force: true,
                        onComplete: () => target.focus({ preventScroll: true }),
                      });
                    } else {
                      target.scrollIntoView({
                        behavior: reduced ? "auto" : "smooth",
                      });
                      target.focus({ preventScroll: true });
                    }
                  });
                }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Modal>
  );
}
