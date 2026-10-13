"use client";

import { useActionState, useEffect, useRef, useState } from "react";

import type { ActionResult } from "@/shared/model";

import { sendContactEmail } from "../api/send-email";
import { contactFormSchema } from "../model/schema";

type ContactField = "name" | "email" | "message";

export function ContactForm() {
  const [fields, setFields] = useState({ name: "", email: "", message: "" });
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<ContactField, string>>
  >({});
  const updateField = (field: keyof typeof fields, value: string) => {
    setFields((current) => ({ ...current, [field]: value }));
    setFieldErrors((current) => ({ ...current, [field]: undefined }));
  };
  const [state, formAction, isPending] = useActionState<
    ActionResult<null> | null,
    FormData
  >(async (_prev, formData) => {
    return sendContactEmail(formData);
  }, null);

  const feedbackRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (state) feedbackRef.current?.focus({ preventScroll: true });
  }, [state]);

  if (state?.success) {
    return (
      <div
        ref={feedbackRef}
        role="status"
        tabIndex={-1}
        className="mt-8 border border-accent-green p-6"
      >
        <p className="font-clash text-[24px] font-semibold uppercase text-accent-green">
          Merci !
        </p>
        <p className="mt-2 font-inter text-[16px] text-text-muted">
          Votre message a bien été envoyé. Merci de m’avoir contacté.
        </p>
      </div>
    );
  }

  return (
    <form
      action={formAction}
      className="mt-8"
      aria-busy={isPending}
      aria-describedby="contact-helper"
      onSubmit={(event) => {
        const data = new FormData(event.currentTarget);
        if (data.get("honeypot")) return;
        const parsed = contactFormSchema.safeParse(Object.fromEntries(data));
        if (parsed.success) {
          setFieldErrors({});
          return;
        }
        event.preventDefault();
        const errors: Partial<Record<ContactField, string>> = {};
        for (const issue of parsed.error.issues) {
          const field = issue.path[0];
          if (field === "name" || field === "email" || field === "message") {
            errors[field] ??= issue.message;
          }
        }
        setFieldErrors(errors);
        const firstField = (["name", "email", "message"] as const).find(
          (field) => errors[field],
        );
        const input =
          firstField && event.currentTarget.elements.namedItem(firstField);
        if (input instanceof HTMLElement) {
          requestAnimationFrame(() => input.focus());
        }
      }}
    >
      <p
        id="contact-helper"
        className="mb-6 font-inter text-sm text-text-secondary"
      >
        Tous les champs sont obligatoires. Décrivez votre besoin et les
        informations utiles à votre projet.
      </p>

      {/* Honeypot — hors écran + nom générique pour éviter l'autofill Chrome */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: "-5000px",
          width: "1px",
          height: "1px",
          overflow: "hidden",
        }}
      >
        <label htmlFor="contact-hp-field">Ne pas remplir</label>
        <input
          id="contact-hp-field"
          name="honeypot"
          type="text"
          tabIndex={-1}
          autoComplete="new-password"
          defaultValue=""
        />
      </div>

      {/* Nom */}
      <div className="mb-6">
        <label
          htmlFor="contact-name"
          className="font-inter text-sm font-medium"
        >
          Nom
        </label>
        <input
          id="contact-name"
          name="name"
          type="text"
          placeholder="Votre nom"
          maxLength={100}
          required
          minLength={2}
          autoComplete="name"
          value={fields.name}
          aria-invalid={fieldErrors.name ? true : undefined}
          aria-describedby={fieldErrors.name ? "contact-name-error" : undefined}
          onChange={(event) => updateField("name", event.currentTarget.value)}
          className="form-field"
        />
        {fieldErrors.name && (
          <p
            id="contact-name-error"
            className="mt-2 font-inter text-sm text-accent-red"
          >
            {fieldErrors.name}
          </p>
        )}
      </div>

      {/* Adresse email */}
      <div className="mb-6">
        <label
          htmlFor="contact-email"
          className="font-inter text-sm font-medium"
        >
          Email
        </label>
        <input
          id="contact-email"
          name="email"
          type="email"
          placeholder="vous@exemple.com"
          maxLength={254}
          required
          autoComplete="email"
          value={fields.email}
          aria-invalid={fieldErrors.email ? true : undefined}
          aria-describedby={fieldErrors.email ? "contact-email-error" : undefined}
          onChange={(event) => updateField("email", event.currentTarget.value)}
          className="form-field"
        />
        {fieldErrors.email && (
          <p
            id="contact-email-error"
            className="mt-2 font-inter text-sm text-accent-red"
          >
            {fieldErrors.email}
          </p>
        )}
      </div>

      {/* Message */}
      <div className="mb-6">
        <label
          htmlFor="contact-message"
          className="font-inter text-sm font-medium"
        >
          Message
        </label>
        <textarea
          id="contact-message"
          name="message"
          placeholder="Votre projet, vos envies, vos contraintes…"
          maxLength={5000}
          aria-describedby={`contact-message-help${fieldErrors.message ? " contact-message-error" : ""}`}
          aria-invalid={fieldErrors.message ? true : undefined}
          required
          minLength={10}
          rows={5}
          value={fields.message}
          onChange={(event) => updateField("message", event.currentTarget.value)}
          className="form-field min-h-36 resize-y"
        />
        <p
          id="contact-message-help"
          className="mt-2 font-inter text-xs text-text-secondary"
        >
          10 caractères minimum.
        </p>
        {fieldErrors.message && (
          <p
            id="contact-message-error"
            className="mt-2 font-inter text-sm text-accent-red"
          >
            {fieldErrors.message}
          </p>
        )}
      </div>

      {/* Retour de l’envoi */}
      {state && !state.success && (
        <div
          ref={feedbackRef}
          role="alert"
          tabIndex={-1}
          className="mb-5 border border-accent-red p-4 font-inter text-sm text-accent-red"
        >
          {state.error}
        </div>
      )}

      {/* Envoi */}
      <button
        type="submit"
        disabled={isPending}
        className="primary-link w-full disabled:opacity-60"
      >
        {isPending ? "Envoi en cours..." : "Envoyer le message"}
      </button>
    </form>
  );
}
