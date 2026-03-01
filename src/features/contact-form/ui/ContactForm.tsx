"use client";

import { useActionState } from "react";

import type { ActionResult } from "@/shared/model";

import { sendContactEmail } from "../api/send-email";

export function ContactForm() {
  const [state, formAction, isPending] = useActionState<
    ActionResult<null> | null,
    FormData
  >(async (_prev, formData) => {
    return sendContactEmail(formData);
  }, null);

  if (state?.success) {
    return (
      <div className="py-10">
        <p className="font-clash text-[24px] font-semibold uppercase text-accent-green">
          Merci !
        </p>
        <p className="mt-2 font-inter text-[16px] text-text-muted">
          Votre message a bien été envoyé. Je vous recontacte très vite.
        </p>
      </div>
    );
  }

  return (
    <form action={formAction} className="mt-8">
      <h3 className="mb-8 font-clash text-[24px] font-semibold uppercase">
        REMPLISSEZ CE FORMULAIRE
      </h3>

      {/* Honeypot */}
      <input
        name="honeypot"
        className="sr-only"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
      />

      {/* Name */}
      <div className="mb-6">
        <label htmlFor="contact-name" className="sr-only">
          Nom
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          placeholder="Nom*"
          required
          minLength={2}
          className="w-full border-0 border-b border-border bg-transparent py-4 font-inter text-[16px] text-text transition-colors placeholder:text-text-muted focus:border-text focus:outline-none"
        />
      </div>

      {/* Email */}
      <div className="mb-6">
        <label htmlFor="contact-email" className="sr-only">
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          placeholder="Email*"
          required
          className="w-full border-0 border-b border-border bg-transparent py-4 font-inter text-[16px] text-text transition-colors placeholder:text-text-muted focus:border-text focus:outline-none"
        />
      </div>

      {/* Message */}
      <div className="mb-6">
        <label htmlFor="contact-message" className="sr-only">
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          placeholder="Message*"
          required
          minLength={10}
          rows={5}
          className="w-full resize-none border-0 border-b border-border bg-transparent py-4 font-inter text-[16px] text-text transition-colors placeholder:text-text-muted focus:border-text focus:outline-none"
        />
      </div>

      {/* Error message */}
      {state && !state.success && (
        <p className="mb-4 font-inter text-[14px] text-accent-red">
          {state.error}
        </p>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-[10px] border border-transparent bg-text py-6 font-inter text-[12px] uppercase tracking-wider text-bg transition-colors duration-300 hover:border-text hover:bg-transparent hover:text-text disabled:cursor-not-allowed disabled:opacity-50"
      >
        {isPending ? "Envoi en cours..." : "Soumettre"}
      </button>
    </form>
  );
}
