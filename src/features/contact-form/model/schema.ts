import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Nom requis (min 2 caractères)").max(100),
  email: z.string().email("Email valide requis"),
  message: z.string().min(10, "Message requis (min 10 caractères)").max(5000),
  honeypot: z.string().max(0, ""),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
