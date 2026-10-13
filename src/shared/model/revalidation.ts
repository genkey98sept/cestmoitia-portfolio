import { z } from "zod";

export const revalidationBodySchema = z.union([
  z.strictObject({ global: z.literal("site-info") }),
  z.strictObject({
    collection: z.literal("projects"),
    // Un seul segment ASCII ; garder une marge sous la limite Next de 1024 caractères.
    slug: z.string().min(1).max(255).regex(/^[a-zA-Z0-9_-]+$/).optional(),
  }),
  z.strictObject({ collection: z.literal("gallery") }),
  z.strictObject({}),
]);
