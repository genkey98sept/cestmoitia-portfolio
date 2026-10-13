import { z } from "zod";

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Saisissez un nom d’au moins 2 caractères.")
    .max(100, "Votre nom ne doit pas dépasser 100 caractères."),
  email: z.email("Saisissez une adresse email valide."),
  message: z
    .string()
    .trim()
    .min(10, "Votre message doit contenir au moins 10 caractères.")
    .max(5000, "Votre message ne doit pas dépasser 5 000 caractères."),
  // Validation laxiste ici : le vrai check anti-spam est fait runtime-side
  // (server action). Ça évite qu'un autofill navigateur sur le champ masqué
  // bloque un formulaire légitime.
  honeypot: z.string().optional().default(""),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
