import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Payload } from "payload";

type SeedPayload = Pick<Payload, "find" | "config">;
type StoredMedia = {
  id: number;
  filename?: string | null;
  alt?: string | null;
};

// Payload incrémente le suffixe existant : photo-9.jpg devient photo-10.jpg.
export function isSeedFilename(filename: string, original: string): boolean {
  if (filename === original) return true;
  const extension = path.extname(original);
  const stem = original.slice(0, -extension.length);
  const suffix = /^(.*)-(\d+)$/.exec(stem);
  const base = suffix ? suffix[1] : stem;
  const escaped = base.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const escapedExtension = extension.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = new RegExp(`^${escaped}-([1-9]\\d*)${escapedExtension}$`).exec(filename);
  return Boolean(match && Number(match[1]) > Number(suffix?.[2] || 0));
}

async function readStoredMedia(payload: SeedPayload, media: StoredMedia) {
  const upload = payload.config.collections.find(({ slug }) => slug === "media")?.upload;
  if (!upload || !media.filename || path.basename(media.filename) !== media.filename) {
    throw new Error("Métadonnées de stockage du média invalides.");
  }
  if (!upload.disableLocalStorage) {
    if (!upload.staticDir) throw new Error("Répertoire de stockage local absent.");
    try {
      return await readFile(path.join(upload.staticDir, media.filename));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === "ENOENT") return undefined;
      throw error;
    }
  }
  // Même origine et même clé que le plugin configuré (public, sans préfixe).
  const storeId = process.env.BLOB_READ_WRITE_TOKEN?.match(/^vercel_blob_rw_([a-z\d]+)_[a-z\d]+$/i)?.[1]?.toLowerCase();
  if (!storeId) throw new Error("Token Blob requis pour vérifier le contenu existant.");
  const baseURL = process.env.STORAGE_VERCEL_BLOB_BASE_URL || `https://${storeId}.public.blob.vercel-storage.com`;
  const response = await fetch(`${baseURL}/${encodeURIComponent(media.filename)}`, {
    redirect: "error",
  });
  if (response.status === 404) return undefined;
  if (!response.ok) throw new Error(`Lecture du média Blob impossible (${response.status}).`);
  return Buffer.from(await response.arrayBuffer());
}

export async function findSeedMedia(
  payload: SeedPayload,
  filename: string,
  source?: Buffer,
  readStored = (media: StoredMedia) => readStoredMedia(payload, media),
): Promise<StoredMedia | undefined> {
  const candidates: StoredMedia[] = [];
  const stem = path.parse(filename).name.replace(/-\d+$/, "");
  const sourceHash = source && createHash("sha256").update(source).digest("hex");
  let page = 1;
  while (true) {
    const result = await payload.find({
      collection: "media",
      where: { filename: { contains: stem } },
      depth: 0,
      limit: 100,
      page,
      sort: "id",
    });
    for (const media of result.docs) {
      if (!media.filename || !isSeedFilename(media.filename, filename)) continue;
      if (!sourceHash) {
        if (media.filename === filename) return media;
        candidates.push(media);
        continue;
      }
      const stored = await readStored(media);
      if (stored && createHash("sha256").update(stored).digest("hex") === sourceHash) {
        return media;
      }
    }
    if (!result.hasNextPage) break;
    page++;
  }
  // Sans archive, seul le nom d'origine identifie le média avec certitude.
  if (candidates.length) {
    throw new Error(`Média renommé pour ${filename} : archive nécessaire pour vérifier son contenu.`);
  }
  return undefined;
}

export async function cleanSeedCollections(
  payload: Pick<Payload, "find" | "delete">,
  onDeleted: (collection: string, count: number) => void = () => {},
) {
  for (const collection of ["projects", "gallery", "media"] as const) {
    let count = 0;
    while (true) {
      // Relire la première page après chaque lot pour ne pas sauter de documents.
      const result = await payload.find({ collection, limit: 100, depth: 0 });
      if (!result.docs.length) break;
      for (const doc of result.docs) {
        await payload.delete({ collection, id: doc.id });
        count++;
      }
    }
    onDeleted(collection, count);
  }
}
