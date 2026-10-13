import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  ...nextVitals,
  ...nextTypescript,

  // Global ignores
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "src/app/(payload)/admin/importMap.js",
      "src/payload-types.ts",
      "_bmad/**",
      "_bmad-output/**",
      ".agents/**",
      ".claude/**",
      ".cursor/**",
      "media/**",
      "playwright-report/**",
      "test-results/**",
      ".local/**",
      // Historical one-off scraper; its untyped browser snapshots are not app code.
      "scripts/scrape-framer.ts",
    ],
  },

  // FSD: enforce public API imports (no deep imports into slices)
  {
    rules: {
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["@/entities/*/*", "!@/entities/*/index*"],
              message:
                "Use entities/* public API only (import from index.ts).",
            },
            {
              group: ["@/features/*/*", "!@/features/*/index*"],
              message:
                "Use features/* public API only (import from index.ts).",
            },
            {
              group: ["@/widgets/*/*", "!@/widgets/*/index*"],
              message:
                "Use widgets/* public API only (import from index.ts).",
            },
            {
              group: ["@/_pages/*/*", "!@/_pages/*/index*"],
              message: "Use _pages/* public API only (import from index.ts).",
            },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
