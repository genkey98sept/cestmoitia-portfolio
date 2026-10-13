import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { cleanSeedCollections, findSeedMedia, isSeedFilename } from "../../scripts/seed-helpers";

type MediaFixture = { id: number; filename: string; filesize?: number };

function mediaPayload(docs: MediaFixture[], directory: string) {
  return {
    config: { collections: [{ slug: "media", upload: { staticDir: directory } }] },
    find: async ({ page, limit }: { page: number; limit: number }) => ({
      docs: docs.slice((page - 1) * limit, page * limit),
      hasNextPage: page * limit < docs.length,
    }),
  } as unknown as Parameters<typeof findSeedMedia>[0];
}

test("seed filenames follow Payload collision suffixes without matching other names", () => {
  for (const candidate of ["photo.jpg", "photo-1.jpg", "photo-12.jpg"]) {
    assert.equal(isSeedFilename(candidate, "photo.jpg"), true);
  }
  assert.equal(isSeedFilename("photo-10.jpg", "photo-9.jpg"), true);
  for (const candidate of ["photo-other.jpg", "photo-1.png", "photo-1-card.jpg", "photo-01.jpg", "other-photo.jpg"]) {
    assert.equal(isSeedFilename(candidate, "photo.jpg"), false);
  }
  assert.equal(isSeedFilename("photo-8.jpg", "photo-9.jpg"), false);
  assert.equal(isSeedFilename("aXb-1.jpg", "a.b.jpg"), false);
});

test("media surviving a database reset can cause one collision, then seeds reuse its record", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "tia-seed-"));
  try {
    const source = Buffer.from("original photo content");
    await writeFile(path.join(directory, "photo.jpg"), source);
    const docs: MediaFixture[] = [];
    const payload = mediaPayload(docs, directory);
    assert.equal(await findSeedMedia(payload, "photo.jpg", source), undefined);
    // Reproduire le nom choisi par Payload lorsque le fichier original existe encore.
    await writeFile(path.join(directory, "photo-1.jpg"), source);
    docs.push({ id: 1, filename: "photo-1.jpg" });
    for (let run = 0; run < 2; run++) {
      assert.equal((await findSeedMedia(payload, "photo.jpg", source))?.id, 1);
    }
    assert.deepEqual(await readFile(path.join(directory, "photo.jpg")), source);
    assert.equal(docs.length, 1);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("reuse verifies bytes even for an exact filename and searches every page", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "tia-seed-"));
  try {
    const source = Buffer.from("same size A");
    const docs = Array.from({ length: 101 }, (_, id) => ({ id, filename: `photo-other-${id}.jpg` }));
    docs.unshift({ id: 200, filename: "photo.jpg" });
    docs.push({ id: 201, filename: "photo-2.jpg" });
    await writeFile(path.join(directory, "photo.jpg"), Buffer.from("same size B"));
    await writeFile(path.join(directory, "photo-2.jpg"), source);
    const payload = mediaPayload(docs, directory);
    assert.equal((await findSeedMedia(payload, "photo.jpg", source))?.id, 201);
    assert.equal(await findSeedMedia(payload, "unrelated.jpg", source), undefined);
    assert.equal(await findSeedMedia(payload, "photo.jpg", Buffer.from("same size C")), undefined);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("data-only requires source bytes for renamed files and preserves exact filename lookup", async () => {
  const docs = [{ id: 1, filename: "photo-1.jpg" }, { id: 2, filename: "photo-other.jpg" }];
  const payload = mediaPayload(docs, "unused");
  await assert.rejects(findSeedMedia(payload, "photo.jpg"), /archive nécessaire/);
  docs.push({ id: 3, filename: "photo-2.jpg" });
  await assert.rejects(findSeedMedia(payload, "photo.jpg"), /archive nécessaire/);
  docs.push({ id: 4, filename: "photo.jpg" });
  assert.equal((await findSeedMedia(payload, "photo.jpg"))?.id, 4);
  // photo-10.jpg peut être le nom d'un autre média, pas une collision de photo-9.jpg.
  await assert.rejects(findSeedMedia(mediaPayload([{ id: 5, filename: "photo-10.jpg" }], "unused"), "photo-9.jpg"), /archive nécessaire/);
});

test("a storage read failure aborts reuse rather than creating another duplicate", async () => {
  const payload = mediaPayload([{ id: 1, filename: "photo-1.jpg" }], "unused");
  await assert.rejects(findSeedMedia(payload, "photo.jpg", Buffer.from("content"), async () => {
    throw new Error("Lecture impossible");
  }), /Lecture impossible/);
});

test("Blob reuse reads the stored collision filename and verifies content with a mocked transport", async () => {
  const previousFetch = globalThis.fetch;
  const previousToken = process.env.BLOB_READ_WRITE_TOKEN;
  const previousBase = process.env.STORAGE_VERCEL_BLOB_BASE_URL;
  process.env.BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_setuptest_synthetic123";
  delete process.env.STORAGE_VERCEL_BLOB_BASE_URL;
  const payload = mediaPayload([{ id: 1, filename: "photo-1.jpg" }], "unused");
  const upload = payload.config.collections[0].upload;
  assert.ok(upload);
  upload.disableLocalStorage = true;
  try {
    const urls: string[] = [];
    globalThis.fetch = async (input) => {
      urls.push(String(input));
      return new Response("source content");
    };
    assert.equal((await findSeedMedia(payload, "photo.jpg", Buffer.from("source content")))?.id, 1);
    assert.equal(await findSeedMedia(payload, "photo.jpg", Buffer.from("other content!")), undefined);
    assert.deepEqual(urls, Array(2).fill("https://setuptest.public.blob.vercel-storage.com/photo-1.jpg"));
    globalThis.fetch = async () => new Response(null, { status: 503 });
    await assert.rejects(findSeedMedia(payload, "photo.jpg", Buffer.from("source content")), /503/);
  } finally {
    globalThis.fetch = previousFetch;
    if (previousToken === undefined) delete process.env.BLOB_READ_WRITE_TOKEN;
    else process.env.BLOB_READ_WRITE_TOKEN = previousToken;
    if (previousBase === undefined) delete process.env.STORAGE_VERCEL_BLOB_BASE_URL;
    else process.env.STORAGE_VERCEL_BLOB_BASE_URL = previousBase;
  }
});

test("clean drains all batches and removes references before media", async () => {
  const rows = {
    projects: Array.from({ length: 1203 }, (_, id) => ({ id })),
    gallery: Array.from({ length: 105 }, (_, id) => ({ id })),
    media: Array.from({ length: 1001 }, (_, id) => ({ id })),
  };
  type Collection = keyof typeof rows;
  const order: Collection[] = [];
  const counts: [string, number][] = [];
  const payload = {
    find: async ({ collection, limit }: { collection: Collection; limit: number }) => ({
      docs: rows[collection].slice(0, limit),
    }),
    delete: async ({ collection, id }: { collection: Collection; id: number }) => {
      if (collection === "media") {
        assert.equal(rows.projects.length + rows.gallery.length, 0, "Références encore présentes");
      }
      order.push(collection);
      rows[collection] = rows[collection].filter((doc) => doc.id !== id);
    },
  } as unknown as Parameters<typeof cleanSeedCollections>[0];
  await cleanSeedCollections(payload, (collection, count) => counts.push([collection, count]));
  assert.deepEqual(counts, [["projects", 1203], ["gallery", 105], ["media", 1001]]);
  assert.deepEqual([...new Set(order)], ["projects", "gallery", "media"]);
  assert.deepEqual(rows, { projects: [], gallery: [], media: [] });
});

test("clean stops before deleting media if gallery deletion fails", async () => {
  const deleted: string[] = [];
  const payload = {
    find: async ({ collection }: { collection: string }) => ({ docs: collection === "projects" ? [] : [{ id: 1 }] }),
    delete: async ({ collection }: { collection: string }) => {
      deleted.push(collection);
      throw new Error("Suppression impossible");
    },
  } as unknown as Parameters<typeof cleanSeedCollections>[0];
  await assert.rejects(cleanSeedCollections(payload), /Suppression impossible/);
  assert.deepEqual(deleted, ["gallery"]);
});
