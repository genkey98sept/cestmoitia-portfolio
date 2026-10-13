import assert from "node:assert/strict";
import { test } from "node:test";
import { revalidationBodySchema } from "../../src/shared/model/revalidation";

test("webhook accepts generated and manually edited ASCII URL-safe slugs", () => {
  for (const slug of ["projet-", "clip_video2024", "project-2024", "Projet_2024-", "_", "-", "a".repeat(255)]) {
    const input = { collection: "projects", slug };
    assert.deepEqual(revalidationBodySchema.parse(input), input);
  }
});

test("webhook rejects empty, oversized, and non-segment targets", () => {
  for (const slug of ["", "a".repeat(256), "/", "../project", "..", "project.name", "a/b", "a\\b", "%2f", "%2e%2e", "a?b", "a#b", "a b", "café", "a\n"]) {
    assert.equal(revalidationBodySchema.safeParse({ collection: "projects", slug }).success, false, slug);
  }
});

test("webhook keeps its supported scopes and rejects mixed or unknown targets", () => {
  for (const input of [{}, { global: "site-info" }, { collection: "projects" }, { collection: "gallery" }]) {
    assert.equal(revalidationBodySchema.safeParse(input).success, true);
  }
  for (const input of [{ collection: "media" }, { global: "other" }, { collection: "gallery", slug: "photo" }, { collection: "projects", global: "site-info" }, { unexpected: true }, { collection: "projects", slug: null }]) {
    assert.equal(revalidationBodySchema.safeParse(input).success, false);
  }
});
