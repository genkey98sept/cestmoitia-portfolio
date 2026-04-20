import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Nom requis (min 2 caractères)").max(100),
  email: z.email("Email valide requis"),
  message: z
    .string()
    .trim()
    .min(10, "Message requis (min 10 caractères)")
    .max(5000),
  // Validation laxiste ici : le vrai check anti-spam est fait runtime-side
  // (server action). Ça évite qu'un autofill navigateur sur le champ masqué
  // bloque un formulaire légitime.
  honeypot: z.string().optional().default(""),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
