import "./load-env.mjs";
import fs from "node:fs";
import path from "node:path";
import { getPayload } from "payload";
import config from "../src/payload.config";
import { siteInfoSeed } from "./seed-data/site-info";
import { findSeedMedia } from "./seed-helpers";

process.env.DISABLE_PAYLOAD_HMR = "true";

const database = new URL(process.env.DATABASE_URL || "");
if (!["localhost", "127.0.0.1", "[::1]"].includes(database.hostname)) {
  throw new Error("seed:local est réservé à une base PostgreSQL locale.");
}
if (process.env.BLOB_READ_WRITE_TOKEN) {
  throw new Error("seed:local utilise les fichiers locaux : retirez BLOB_READ_WRITE_TOKEN.");
}

const payload = await getPayload({ config });
try {
  const siteInfo = await payload.findGlobal({ slug: "site-info" });
  if (!siteInfo.email) {
    await payload.updateGlobal({ slug: "site-info", data: siteInfoSeed });
    console.log("Informations du site initialisées.");
  }

  const directory = path.resolve("public/photography");
  const filenames = fs.readdirSync(directory).filter((name) => /\.jpe?g$/i.test(name)).sort();
  for (const [index, filename] of filenames.entries()) {
    const filePath = path.join(directory, filename);
    const existingMedia = await findSeedMedia(payload, filename, fs.readFileSync(filePath));
    const media = existingMedia ?? await payload.create({
      collection: "media",
      data: { alt: filename.replace(/^\d+-|\.jpg$/g, "").replaceAll("-", " ") },
      filePath,
    });
    const existingPhoto = await payload.find({
      collection: "gallery",
      where: { image: { equals: media.id } },
      limit: 1,
    });
    if (!existingPhoto.docs.length) {
      await payload.create({
        collection: "gallery",
        data: {
          image: media.id,
          caption: media.alt,
          featured: index === 0,
          displayOrder: index,
          status: "published",
        },
      });
    }
  }
  console.log(`Galerie prête (${filenames.length} photos du dépôt, sans doublons).`);
  console.log("Les projets nécessitent l'archive originale : voir README.md.");
  console.log(`Créez votre compte administrateur : ${process.env.NEXT_PUBLIC_SITE_URL}/admin`);
} finally {
  await payload.destroy();
}

// Payload's PostgreSQL adapter keeps a reserved connection after destroy().
// All writes are awaited above; terminate this one-shot CLI explicitly.
process.exit(0);
