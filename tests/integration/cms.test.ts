import "../../scripts/load-env.mjs";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { getPayload } from "payload";
import config from "../../src/payload.config";

process.env.DISABLE_PAYLOAD_HMR = "true";

test("public CMS access hides drafts and exposes published content", async () => {
  const database = new URL(process.env.DATABASE_URL || "");
  assert.ok(["localhost", "127.0.0.1", "[::1]"].includes(database.hostname), "Use a local database");
  const payload = await getPayload({ config });
  let projectId: number | undefined;
  let galleryId: number | undefined;
  try {
    const media = await payload.find({ collection: "media", limit: 1 });
    assert.ok(media.docs[0], "Run pnpm seed:local first");
    const project = await payload.create({
      collection: "projects",
      data: { title: "Local access test", slug: `test-${randomUUID()}`, coverImage: media.docs[0].id, status: "draft", displayOrder: 999 },
    });
    projectId = project.id;
    const gallery = await payload.create({
      collection: "gallery",
      data: { image: media.docs[0].id, status: "draft", displayOrder: 999 },
    });
    galleryId = gallery.id;
    for (const [collection, id] of [["projects", projectId], ["gallery", galleryId]] as const) {
      const draft = await payload.find({ collection, overrideAccess: false, where: { id: { equals: id } } });
      assert.equal(draft.totalDocs, 0, `${collection}: drafts must be private`);
      await payload.update({ collection, id, data: { status: "published" } });
      const published = await payload.find({ collection, overrideAccess: false, where: { id: { equals: id } } });
      assert.equal(published.totalDocs, 1, `${collection}: published content must be public`);
      await assert.rejects(payload.delete({ collection, id, overrideAccess: false }));
    }
  } finally {
    if (projectId) await payload.delete({ collection: "projects", id: projectId });
    if (galleryId) await payload.delete({ collection: "gallery", id: galleryId });
    await payload.destroy();
  }
});
