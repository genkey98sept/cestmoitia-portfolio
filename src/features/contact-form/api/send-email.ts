"use server";

import { Resend } from "resend";

import type { ActionResult } from "@/shared/model";

import { contactFormSchema } from "../model/schema";
import {
  buildAdminNotificationHtml,
  buildAdminNotificationSubject,
  buildAdminNotificationText,
  buildUserConfirmationHtml,
  buildUserConfirmationSubject,
  buildUserConfirmationText,
} from "./templates";

function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY);
}

function getFromAddress() {
  const address = process.env.EMAIL_FROM ?? "onboarding@resend.dev";
  const name = process.env.EMAIL_NAME ?? "Cestmoitia";
  return `${name} <${address}>`;
}

export async function sendContactEmail(
  formData: FormData,
): Promise<ActionResult<null>> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    message: formData.get("message"),
    honeypot: formData.get("honeypot") ?? "",
  };

  const parsed = contactFormSchema.safeParse(raw);
  if (!parsed.success) {
    return { success: false, error: "Données invalides" };
  }
  // Honeypot : si rempli par un bot (ou autofill bug), on fait semblant
  // d'avoir accepté sans envoyer — pas d'erreur visible.
  if (parsed.data.honeypot && parsed.data.honeypot.trim() !== "") {
    return { success: true, data: null };
  }

  const { name, email, message } = parsed.data;
  const submittedAt = new Date();
  const resend = getResendClient();
  const from = getFromAddress();
  const adminEmail = process.env.ADMIN_EMAIL ?? "cestmoitia@gmail.com";

  try {
    const [adminResult, userResult] = await Promise.all([
      resend.emails.send({
        from,
        to: adminEmail,
        replyTo: email,
        subject: buildAdminNotificationSubject(name),
        html: buildAdminNotificationHtml({
          name,
          email,
          message,
          submittedAt,
        }),
        text: buildAdminNotificationText({
          name,
          email,
          message,
          submittedAt,
        }),
      }),
      resend.emails.send({
        from,
        to: email,
        replyTo: adminEmail,
        subject: buildUserConfirmationSubject(),
        html: buildUserConfirmationHtml({ name, email, message }),
        text: buildUserConfirmationText({ name, email, message }),
      }),
    ]);

    if (adminResult.error) {
      return { success: false, error: "Erreur d'envoi. Réessayez." };
    }
    // Si la confirmation utilisateur échoue (ex: email invalide côté Resend),
    // la demande admin est déjà partie — on considère l'action réussie.
    void userResult;

    return { success: true, data: null };
  } catch {
    return { success: false, error: "Erreur d'envoi. Réessayez." };
  }
}
