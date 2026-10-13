"use client";

import { useEffect, useRef } from "react";

import { useLenis } from "./SmoothScroll";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  label: string;
  id?: string;
  children: React.ReactNode;
  onKeyDown?: (event: React.KeyboardEvent<HTMLDialogElement>) => void;
}

// Le dialogue natif isole le document et restitue le focus à la fermeture.
export function Modal({
  open,
  onClose,
  label,
  id,
  children,
  onKeyDown,
}: ModalProps) {
  const ref = useRef<HTMLDialogElement>(null);
  const lenis = useLenis();

  useEffect(() => {
    const dialog = ref.current;
    if (!open || !dialog) return;
    const opener = document.activeElement as HTMLElement | null;
    const overflow = document.body.style.overflow;
    const wasStopped = lenis?.isStopped;
    lenis?.stop();
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
      if (!wasStopped) lenis?.start();
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, [open, lenis]);

  return (
    <dialog
      ref={ref}
      id={id}
      aria-label={label}
      className="modal"
      data-lenis-prevent
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const box = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < box.left ||
          event.clientX > box.right ||
          event.clientY < box.top ||
          event.clientY > box.bottom
        )
          onClose();
      }}
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.key !== "Tab") return;
        const controls = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex="0"]',
          ),
        ).filter((node) => node.getClientRects().length > 0);
        const first = controls[0];
        const last = controls[controls.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
    >
      <button
        type="button"
        className="modal-close"
        onClick={onClose}
        aria-label={id === "site-menu" ? "Fermer le menu" : "Fermer la photo"}
      >
        Fermer <span aria-hidden="true">×</span>
      </button>
      {children}
    </dialog>
  );
}
