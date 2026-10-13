import { randomBytes } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const template = readFileSync(new URL("../.env.example", import.meta.url), "utf8");
const password = randomBytes(24).toString("hex");
const contents = template
  .replaceAll("change-local-db-password", password)
  .replace("change-payload-secret", randomBytes(32).toString("hex"))
  .replace("change-revalidation-secret", randomBytes(32).toString("hex"));

try {
  writeFileSync(new URL("../.env.local", import.meta.url), contents, {
    flag: "wx",
    mode: 0o600,
  });
  console.log(".env.local créé avec des secrets aléatoires.");
} catch (error) {
  if (error.code !== "EEXIST") throw error;
  console.log(".env.local existe déjà : aucune valeur modifiée.");
}

console.log("Suite : pnpm db:up && pnpm generate && pnpm seed:local && pnpm dev");
