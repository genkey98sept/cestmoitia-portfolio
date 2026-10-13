import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { test } from "node:test";

const inspectConfig = String.raw`
  import assert from "node:assert/strict";
  import { registerHooks } from "node:module";
  import { mkdtemp, readFile, rm } from "node:fs/promises";
  import os from "node:os";
  import path from "node:path";

  // Node ne charge pas les styles ; conserver les vrais composants et leur résolution.
  registerHooks({ load(url, context, next) {
    if (/\.(css|scss)$/.test(url)) return { format: "module", source: "", shortCircuit: true };
    return next(url, context);
  } });
  let requests = 0;
  globalThis.fetch = async () => { requests++; throw new Error("Requête réseau interdite dans ce test"); };
  const { default: configPromise } = await import("./src/payload.config.ts");
  const { generateImportMap } = await import("payload");
  const { getFromImportMap } = await import("payload/shared");
  const { importMap } = await import("./src/app/(payload)/admin/importMap.js");
  const config = await configPromise;
  const handler = "@payloadcms/storage-vercel-blob/client#VercelBlobClientUploadHandler";
  const provider = config.admin.components.providers.find(p => p.path === handler);
  assert.ok(provider, "Provider absent de la configuration");
  assert.equal(provider.clientProps.enabled, false);
  assert.equal(typeof getFromImportMap({ importMap, PayloadComponent: provider }), "function");
  const media = config.collections.find(c => c.slug === "media");
  const shape = fields => fields.map(f => ({
    name: f.name, type: f.type, required: f.required ?? false,
    unique: f.unique ?? false, fields: f.fields ? shape(f.fields) : undefined,
  })).sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  assert.ok(!media.fields.some(f => ["prefix", "_objectKey"].includes(f.name)), "Champs SQL supplémentaires");
  const directory = await mkdtemp(path.join(os.tmpdir(), "tia-import-map-"));
  let generated;
  try {
    config.admin.importMap.importMapFile = path.join(directory, "importMap.js");
    await generateImportMap(config, { log: false });
    generated = await readFile(config.admin.importMap.importMapFile, "utf8");
    await generateImportMap(config, { log: false });
    assert.equal(await readFile(config.admin.importMap.importMapFile, "utf8"), generated);
    assert.equal(generated, await readFile("./src/app/(payload)/admin/importMap.js", "utf8"));
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
  assert.equal(requests, 0);
  console.log(JSON.stringify({ fields: shape(media.fields), generated, local: !media.upload.disableLocalStorage }));
`;

test("Blob provider resolves in both modes with a stable import map and unchanged media schema", () => {
  const results = ["", "vercel_blob_rw_setuptest_synthetic123"].map((token) => {
    const result = spawnSync(process.execPath, ["--import", "tsx", "--input-type=module", "-e", inspectConfig], {
      cwd: process.cwd(),
      env: {
        ...process.env,
        PAYLOAD_SECRET: "setup-test-secret-not-real",
        DATABASE_URL: "postgres://test:test@127.0.0.1:1/test",
        BLOB_READ_WRITE_TOKEN: token,
        STORAGE_VERCEL_BLOB_BASE_URL: "",
      },
      encoding: "utf8",
      timeout: 30_000,
    });
    assert.equal(result.status, 0, result.stderr || result.error?.message || result.stdout);
    return JSON.parse(result.stdout);
  });
  assert.deepEqual(results[0].fields, results[1].fields);
  assert.equal(results[0].generated, results[1].generated);
  assert.equal(results[0].local, true);
  assert.equal(results[1].local, false);
});
