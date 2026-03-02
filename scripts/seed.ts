/**
 * Script de seed — Import des données du site Framer dans Payload CMS.
 *
 * Usage:
 *   npx tsx scripts/seed.ts              # Seed complet
 *   npx tsx scripts/seed.ts --clean      # Nettoyage + seed complet
 *   npx tsx scripts/seed.ts --media-only # Médias uniquement
 *   npx tsx scripts/seed.ts --data-only  # SiteInfo + Projets uniquement (médias déjà uploadés)
 */

import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");

// ─── Charger l'env AVANT tout ────────────────────────
function loadEnvFile(filePath: string) {
  if (!fs.existsSync(filePath)) return;
  const content = fs.readFileSync(filePath, "utf-8");
  for (const line of content.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIndex = trimmed.indexOf("=");
    if (eqIndex === -1) continue;
    const key = trimmed.slice(0, eqIndex).trim();
    let value = trimmed.slice(eqIndex + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

loadEnvFile(path.resolve(PROJECT_ROOT, ".env.local"));
loadEnvFile(path.resolve(PROJECT_ROOT, ".env"));

// ─── Imports dynamiques (après chargement env) ──────
async function main() {
  const { getPayload } = await import("payload");
  const { default: config } = await import("../src/payload.config");
  const { mediaMap, MEDIA_ROOT } = await import("./seed-data/media-map");
  const { siteInfoSeed } = await import("./seed-data/site-info");
  const { projectsSeed } = await import("./seed-data/projects");

  // ─── CLI flags ───────────────────────────────────
  const args = process.argv.slice(2);
  const FLAG_CLEAN = args.includes("--clean");
  const FLAG_MEDIA_ONLY = args.includes("--media-only");
  const FLAG_DATA_ONLY = args.includes("--data-only");

  // ─── Media ID registry ───────────────────────────
  const mediaIdRegistry: Record<string, number | string> = {};

  // ─── Helpers ─────────────────────────────────────
  function log(emoji: string, msg: string) {
    console.log(`${emoji}  ${msg}`);
  }

  function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function resolveMediaPath(sourcePath: string): string {
    return path.resolve(PROJECT_ROOT, MEDIA_ROOT, sourcePath);
  }

  function getMimeType(ext: string): string {
    const mimeTypes: Record<string, string> = {
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".png": "image/png",
      ".webp": "image/webp",
      ".avif": "image/avif",
      ".svg": "image/svg+xml",
      ".mp4": "video/mp4",
      ".webm": "video/webm",
    };
    return mimeTypes[ext.toLowerCase()] || "application/octet-stream";
  }

  function normalizeFilename(key: string, ext: string): string {
    return `${key}${ext.toLowerCase().replace(".jpg.jpg", ".jpg")}`;
  }

  // ─── Phase 0: Clean ──────────────────────────────
  async function cleanDatabase() {
    log("🗑️", "Nettoyage de la base de données...");

    const projects = await payload.find({ collection: "projects", limit: 1000 });
    for (const project of projects.docs) {
      await payload.delete({ collection: "projects", id: project.id });
    }
    log("✓", `${projects.docs.length} projet(s) supprimé(s)`);

    const media = await payload.find({ collection: "media", limit: 1000 });
    for (const m of media.docs) {
      await payload.delete({ collection: "media", id: m.id });
    }
    log("✓", `${media.docs.length} média(s) supprimé(s)`);

    log("✓", "Base de données nettoyée");
  }

  // ─── Phase 1: Upload médias ──────────────────────
  async function uploadMedia() {
    const entries = Object.entries(mediaMap);
    const total = entries.length;
    let uploaded = 0;
    let failed = 0;

    log("📸", `Début de l'upload de ${total} médias...`);

    for (const [key, entry] of entries) {
      const filePath = resolveMediaPath(entry.sourcePath);

      if (!fs.existsSync(filePath)) {
        log("⚠️", `[${uploaded + failed + 1}/${total}] FICHIER MANQUANT: ${entry.sourcePath}`);
        failed++;
        continue;
      }

      const ext = path.extname(filePath);
      const filename = normalizeFilename(key, ext);
      const mimeType = getMimeType(ext);
      const fileBuffer = fs.readFileSync(filePath);
      const fileSize = fs.statSync(filePath).size;

      try {
        const created = await payload.create({
          collection: "media",
          data: {
            alt: entry.alt,
            caption: entry.caption || "",
          },
          file: {
            data: fileBuffer,
            name: filename,
            mimetype: mimeType,
            size: fileSize,
          },
        });

        mediaIdRegistry[key] = created.id;
        uploaded++;

        if (uploaded % 10 === 0 || uploaded === total - failed) {
          log("📤", `[${uploaded}/${total}] Upload en cours... (dernier: ${key})`);
        }

        // Pause pour éviter de surcharger la connexion Neon
        await sleep(200);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        log("❌", `ERREUR ${key}: ${message}`);
        failed++;
      }
    }

    log("✅", `Upload terminé: ${uploaded} réussis, ${failed} échoués`);
  }

  // ─── Phase 1b: Charger IDs existants ─────────────
  async function loadExistingMediaIds() {
    log("🔍", "Chargement des médias existants...");

    const allMedia = await payload.find({ collection: "media", limit: 1000 });

    for (const [key] of Object.entries(mediaMap)) {
      const found = allMedia.docs.find((m) => {
        const mFilename = typeof m.filename === "string" ? m.filename : "";
        return mFilename.startsWith(key);
      });
      if (found) {
        mediaIdRegistry[key] = found.id;
      }
    }

    log("✅", `${Object.keys(mediaIdRegistry).length} médias existants trouvés en DB`);
  }

  // ─── Phase 2: Seed SiteInfo ──────────────────────
  async function seedSiteInfo() {
    log("🏠", "Mise à jour du SiteInfo...");

    await payload.updateGlobal({
      slug: "site-info" as "site-info",
      data: siteInfoSeed as Record<string, unknown>,
    });

    log("✅", "SiteInfo mis à jour avec succès");
  }

  // ─── Phase 3: Seed Projects ──────────────────────
  function resolveMediaId(key: string): number | string | null {
    const id = mediaIdRegistry[key];
    if (!id) {
      log("⚠️", `Média non trouvé pour la clé: ${key}`);
      return null;
    }
    return id;
  }

  async function seedProjects() {
    log("📂", `Création de ${projectsSeed.length} projets...`);

    for (const project of projectsSeed) {
      const coverId = resolveMediaId(project.coverImageKey);
      if (!coverId) {
        log("❌", `SKIP ${project.title}: cover image manquante (${project.coverImageKey})`);
        continue;
      }

      const galleryImages = project.galleryImageKeys
        .map((key) => {
          const id = resolveMediaId(key);
          return id ? { image: id } : null;
        })
        .filter(Boolean);

      const subProjects = project.subProjects.map((sub) => {
        const subMedia = sub.subMediaKeys
          .map((key) => {
            const id = resolveMediaId(key);
            return id ? { image: id } : null;
          })
          .filter(Boolean);

        return {
          subTitle: sub.subTitle,
          subDescription: sub.subDescription,
          subMedia,
        };
      });

      try {
        await payload.create({
          collection: "projects",
          data: {
            title: project.title,
            slug: project.slug,
            client: project.client,
            year: project.year,
            category: project.category,
            description: project.description,
            coverImage: coverId,
            galleryImages,
            videoUrl: project.videoUrl || "",
            subProjects,
            displayOrder: project.displayOrder,
            status: project.status,
          },
        });

        log("✓", `Projet créé: ${project.title} (ordre: ${project.displayOrder})`);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        log("❌", `ERREUR création ${project.title}: ${message}`);
      }
    }

    log("✅", "Tous les projets ont été créés");
  }

  // ─── Exécution ───────────────────────────────────
  const startTime = Date.now();

  log("🚀", "=== SEED PAYLOAD CMS ===");
  log("📋", `Flags: clean=${FLAG_CLEAN} media-only=${FLAG_MEDIA_ONLY} data-only=${FLAG_DATA_ONLY}`);

  // Handler global pour les erreurs de connexion DB non gérées
  process.on("unhandledRejection", (err) => {
    log("⚠️", `Unhandled rejection: ${err instanceof Error ? err.message : String(err)}`);
  });

  log("⚙️", "Initialisation de Payload...");
  const payload = await getPayload({ config });
  log("✅", "Payload initialisé");

  if (FLAG_CLEAN) {
    await cleanDatabase();
  }

  if (!FLAG_DATA_ONLY) {
    await uploadMedia();
  } else {
    await loadExistingMediaIds();
  }

  if (!FLAG_MEDIA_ONLY) {
    await seedSiteInfo();
    await seedProjects();
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);
  log("🎉", "=== SEED TERMINÉ ===");
  log("📊", `Médias en registre: ${Object.keys(mediaIdRegistry).length}`);
  log("⏱️", `Durée totale: ${duration}s`);

  process.exit(0);
}

main().catch((err) => {
  console.error("ERREUR FATALE:", err);
  process.exit(1);
});
