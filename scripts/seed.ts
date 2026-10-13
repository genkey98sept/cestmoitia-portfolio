/**
 * Script de seed — Import des données du site Framer dans Payload CMS.
 *
 * Usage:
 *   npx tsx scripts/seed.ts              # Seed complet
 *   npx tsx scripts/seed.ts --clean      # Nettoyage + seed complet
 *   npx tsx scripts/seed.ts --media-only # Médias uniquement
 *   npx tsx scripts/seed.ts --data-only  # SiteInfo + Projets uniquement (médias déjà uploadés)
 */

import "./load-env.mjs";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { cleanSeedCollections, findSeedMedia } from "./seed-helpers";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");
process.env.DISABLE_PAYLOAD_HMR = "true";

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
  if (FLAG_MEDIA_ONLY && FLAG_DATA_ONLY) {
    throw new Error("--media-only et --data-only sont incompatibles.");
  }
  if (FLAG_CLEAN && FLAG_DATA_ONLY) {
    throw new Error("--clean supprimerait les médias nécessaires à --data-only.");
  }
  let failures = 0;

  // ─── Media ID registry ───────────────────────────
  const mediaIdRegistry: Record<string, number> = {};

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

  // Validate the complete archive before connecting or deleting any content.
  if (!FLAG_DATA_ONLY) {
    const missing = Object.values(mediaMap).filter(
      ({ sourcePath }) => !fs.existsSync(resolveMediaPath(sourcePath)),
    );
    if (missing.length) {
      throw new Error(`${missing.length} médias absents de ${MEDIA_ROOT}. Renseignez SEED_MEDIA_ROOT ou utilisez pnpm seed:local pour les photos incluses dans Git.`);
    }
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

    await cleanSeedCollections(payload, (collection, count) => {
      log("✓", `${count} document(s) supprimé(s) de ${collection}`);
    });

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
      const fileBuffer = fs.readFileSync(filePath);
      const existing = await findSeedMedia(payload, filename, fileBuffer);
      if (existing) {
        mediaIdRegistry[key] = existing.id;
        continue;
      }
      const mimeType = getMimeType(ext);
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
    failures += failed;
  }

  // ─── Phase 1b: Charger IDs existants ─────────────
  async function loadExistingMediaIds() {
    log("🔍", "Chargement des médias existants...");

    for (const [key, entry] of Object.entries(mediaMap)) {
      const filePath = resolveMediaPath(entry.sourcePath);
      const filename = normalizeFilename(key, path.extname(filePath));
      const source = fs.existsSync(filePath) ? fs.readFileSync(filePath) : undefined;
      const found = await findSeedMedia(payload, filename, source);
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
      slug: "site-info",
      data: siteInfoSeed as Record<string, unknown>,
    });

    log("✅", "SiteInfo mis à jour avec succès");
  }

  // ─── Phase 3: Seed Projects ──────────────────────
  function resolveMediaId(key: string): number | null {
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
        failures++;
        continue;
      }

      const existing = await payload.find({
        collection: "projects",
        where: { slug: { equals: project.slug } },
        limit: 1,
      });
      if (existing.docs.length) {
        log("✓", `Projet existant conservé : ${project.title}`);
        continue;
      }

      const galleryImages = project.galleryImageKeys
        .map((key) => {
          const id = resolveMediaId(key);
          return id ? { image: id } : null;
        })
        .filter((item): item is { image: number } => item !== null);

      const subProjects = project.subProjects.map((sub) => {
        const subMedia = sub.subMediaKeys
          .map((key) => {
            const id = resolveMediaId(key);
            return id ? { image: id } : null;
          })
          .filter((item): item is { image: number } => item !== null);

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
        failures++;
      }
    }

    log("✓", "Import des projets terminé");
  }

  // ─── Exécution ───────────────────────────────────
  const startTime = Date.now();

  log("🚀", "=== SEED PAYLOAD CMS ===");
  log("📋", `Flags: clean=${FLAG_CLEAN} media-only=${FLAG_MEDIA_ONLY} data-only=${FLAG_DATA_ONLY}`);

  log("⚙️", "Initialisation de Payload...");
  const payload = await getPayload({ config });
  log("✅", "Payload initialisé");

  try {
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

    if (failures) throw new Error(`Import incomplet : ${failures} erreur(s).`);
  } finally {
    await payload.destroy();
  }
}

main().then(() => process.exit(0)).catch((err) => {
  console.error("ERREUR FATALE:", err);
  process.exit(1);
});
