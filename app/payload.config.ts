import { Events } from "@/app/collections/Events";
import { Media } from "@/app/collections/Media";
import { Posts } from "@/app/collections/Posts";
import { Staffs } from "@/app/collections/Staffs";
import { postgresAdapter } from "@payloadcms/db-postgres";
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { s3Storage } from "@payloadcms/storage-s3";
import { buildConfig, SanitizedConfig } from "payload";
import sharp from "sharp";

const payloadSecret = process.env.PAYLOAD_SECRET!;
const databaseUrl = process.env.DATABASE_URL!;
console.log(
  "[payload.config.ts] payloadSecret:",
  payloadSecret,
  "databaseUrl:",
  databaseUrl,
);

const dbAdapter = process.env.NODE_ENV === "production" ? vercelPostgresAdapter : postgresAdapter;

const payloadConfig: Promise<SanitizedConfig> = buildConfig({
  // If you'd like to use Rich Text, pass your editor here
  editor: lexicalEditor(),
  // Root
  // Routing
  routes: {
    admin: "/payload-admin",
    api: "/payload-api",
  },
  // Define and configure your collections in this array
  collections: [Staffs, Media, Posts, Events],
  // Tells Payload which collection to use for authentication
  admin: {
    user: "staffs",
  },
  // Your Payload secret - should be a complex and secure string, unguessable
  secret: payloadSecret,
  // Configure Postgres database connection
  db: dbAdapter({
    // db: vercelPostgresAdapter({
    pool: {
      connectionString: databaseUrl,
      connectionTimeoutMillis: 10000, // 10 seconds to connect
      idleTimeoutMillis: 15000,       // 15 seconds for an idle connection to be closed
      // You might also consider a 'max' value, e.g., max: 5, if you want to limit connections per function instance
      // but this needs careful consideration with serverless scaling & pgBouncer.
    },
    schemaName: 'payload',
    migrationDir: 'supabase/payload-migrations',
  }),
  // If you want to resize images, crop, set focal point, etc.
  // make sure to install it and pass it to the config.
  // This is optional - if you don't need to do these things,
  // you don't need it!
  sharp,
  plugins: [
    // We're using Supabase S3 Storage for Payload CMS media files
    s3Storage({
      collections: {
        media: true,
      },
      bucket: process.env.S3_BUCKET || "payload-cms-media",
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY!,
          secretAccessKey: process.env.S3_SECRET_KEY!,
        },
        region: process.env.S3_REGION || "local",
        endpoint:
          process.env.S3_ENDPOINT || "http://127.0.0.1:54321/storage/v1/s3",
        forcePathStyle: process.env.S3_FORCE_PATH_STYLE === "true",
      },
    }),
  ],
});

export default payloadConfig;
