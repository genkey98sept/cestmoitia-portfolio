import nextEnv from "@next/env";

// Set the production mode before preloading PORT for `next start`.
if (process.argv[1]?.replaceAll("\\", "/").endsWith("/next/dist/bin/next") && process.argv[2] === "start") {
  process.env.NODE_ENV ??= "production";
}

// The same precedence and variable expansion as Next.js, including .env.local.
nextEnv.loadEnvConfig(process.cwd(), process.env.NODE_ENV !== "production");
