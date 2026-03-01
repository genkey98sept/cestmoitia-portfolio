"use server";

import { Resend } from "resend";

import type { ActionResult } from "@/shared/model";

import { contactFormSchema } from "../model/schema";

function getResendClient() {
  return new Resend(process.env.RESEND_API_KEY);
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
  if (parsed.data.honeypot) {
    return { success: false, error: "Spam détecté" };
  }

  try {
    await getResendClient().emails.send({
      from: process.env.RESEND_FROM ?? "Contact <onboarding@resend.dev>",
      to: process.env.CONTACT_EMAIL ?? "cestmoitia@gmail.com",
      subject: `Nouveau message de ${parsed.data.name}`,
      text: `Nom: ${parsed.data.name}\nEmail: ${parsed.data.email}\n\n${parsed.data.message}`,
    });
    return { success: true, data: null };
  } catch {
    return { success: false, error: "Erreur d'envoi. Réessayez." };
  }
}
