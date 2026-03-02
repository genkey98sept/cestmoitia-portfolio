/**
 * Patch pour @next/env — corrige l'interopérabilité ESM/CJS de tsx.
 * À charger avec --require avant le seed script.
 */
const path = require("path");
const fs = require("fs");
const Module = require("module");

const projectRoot = path.resolve(__dirname, "..");

// Charger .env.local manuellement
function loadEnvFile(filePath) {
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

loadEnvFile(path.resolve(projectRoot, ".env.local"));
loadEnvFile(path.resolve(projectRoot, ".env"));

// Intercepter le require de @next/env pour fournir un shim compatible
const originalResolveFilename = Module._resolveFilename;
Module._resolveFilename = function (request, parent, isMain, options) {
  if (request === "@next/env") {
    // Retourner un module fictif
    return "@next/env-shim";
  }
  return originalResolveFilename.call(this, request, parent, isMain, options);
};

const originalLoad = Module._cache;

// Créer le shim en cache
const shimModule = new Module("@next/env-shim");
shimModule.exports = {
  __esModule: true,
  default: {
    loadEnvConfig: function (dir, dev) {
      // Les env sont déjà chargées par notre loadEnvFile ci-dessus
      return { combinedEnv: process.env, parsedEnv: {}, loadedEnvFiles: [] };
    },
  },
  loadEnvConfig: function (dir, dev) {
    return { combinedEnv: process.env, parsedEnv: {}, loadedEnvFiles: [] };
  },
};
shimModule.loaded = true;

Module._cache["@next/env-shim"] = shimModule;
