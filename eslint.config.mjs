import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.Config[]} */
const eslintConfig = [
  // Next.js core-web-vitals + TypeScript (loaded via FlatCompat)
  ...compat.extends("next/core-web-vitals", "next/typescript"),

  // Global ignores
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "src/app/(payload)/admin/importMap.js",
      "scripts/**",
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
              group: ["@/pages/*/*", "!@/pages/*/index*"],
              message: "Use pages/* public API only (import from index.ts).",
            },
          ],
        },
      ],
    },
  },
];

export default eslintConfig;
