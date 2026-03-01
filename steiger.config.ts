import fsd from "@feature-sliced/steiger-plugin";
import { defineConfig } from "steiger";

export default defineConfig([
  ...fsd.configs.recommended,
  {
    // Ignore Next.js routing directory — not part of FSD
    ignores: ["**/app/**"],
  },
  {
    // Ignore Payload collections — not part of FSD
    ignores: ["**/collections/**"],
  },
  {
    // Ignore Payload globals — not part of FSD
    ignores: ["**/globals/**"],
  },
  {
    // Disable insignificant-slice during scaffold — slices are populated incrementally
    rules: {
      "fsd/insignificant-slice": "off",
    },
  },
]);
