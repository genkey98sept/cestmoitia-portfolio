import { postgresAdapter } from "@payloadcms/db-postgres";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { vercelBlobStorage } from "@payloadcms/storage-vercel-blob";
import path from "path";
import { buildConfig } from "payload";
import { fileURLToPath } from "url";
import sharp from "sharp";

import { Gallery } from "./collections/Gallery";
import { Media } from "./collections/Media";
import { Projects } from "./collections/Projects";
import { Users } from "./collections/Users";
import { SiteInfo } from "./globals/SiteInfo";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Projects, Gallery],
  globals: [SiteInfo],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || "",
  typescript: {
    outputFile: path.resolve(dirname, "payload-types.ts"),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || "",
    },
  }),
  sharp,
  plugins: [
    async (config) => {
      // Enregistrer le provider même en local pour stabiliser l'import map.
      const withStorage = await vercelBlobStorage({
        collections: { media: true },
        clientUploads: false,
        enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
        token: process.env.BLOB_READ_WRITE_TOKEN || "",
      })(config);

      // Sans préfixe ni upload client, filename suffit à retrouver les fichiers.
      // Le champ technique ajouté par le plugin ne doit pas modifier le schéma SQL.
      for (const collection of withStorage.collections || []) {
        if (collection.slug === "media") {
          collection.fields = collection.fields.filter(
            (field) => !("name" in field && field.name === "_objectKey"),
          );
        }
      }
      return withStorage;
    },
  ],
});
