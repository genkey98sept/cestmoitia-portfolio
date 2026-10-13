<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Projet

- Utiliser Node 22 et pnpm (versions dans `package.json`).
- Les routes Next.js sont dans `src/app/`, les pages FSD dans `src/_pages/`.
- Lire `README.md` pour la base locale, les seeds et les variables. Ne pas écraser `.env.local`.
- `pnpm check` contrôle le code ; les tests CMS et navigateur nécessitent la base locale initialisée.
- Tous les paquets Payload doivent garder la même version. Vérifier les peer dependencies avant une montée de version majeure.
