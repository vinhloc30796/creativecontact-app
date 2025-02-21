import { Staffs } from '@/app/collections/Staffs'
import { Media } from '@/app/collections/Media'
import { Posts } from '@/app/collections/Posts'
import { postgresAdapter } from '@payloadcms/db-postgres'
// import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig, SanitizedConfig } from 'payload'
import sharp from 'sharp'
import { s3Storage } from '@payloadcms/storage-s3'

const payloadSecret = process.env.PAYLOAD_SECRET!
const databaseUrl = process.env.DATABASE_URL!
console.log('[payload.config.ts] payloadSecret:', payloadSecret, 'databaseUrl:', databaseUrl)

const payloadConfig: Promise<SanitizedConfig> = buildConfig({
  // If you'd like to use Rich Text, pass your editor here
  editor: lexicalEditor(),
  // Routing
  routes: {
    admin: '/payload-cms/admin',
    api: '/payload-cms/api',
  },
  // Define and configure your collections in this array
  collections: [
    Staffs,
    Media,
    Posts,
  ],
  // Tells Payload which collection to use for authentication
  admin: {
    user: 'staffs',
  },
  // Your Payload secret - should be a complex and secure string, unguessable
  secret: payloadSecret,
  // Configure Postgres database connection
  db: postgresAdapter({
    // db: vercelPostgresAdapter({
    pool: {
      connectionString: databaseUrl,
    },
    schemaName: 'payload',
    migrationDir: '../supabase/migrations',
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
      bucket: process.env.S3_BUCKET || 'payload-cms-media',
      config: {
        credentials: {
          accessKeyId: process.env.S3_ACCESS_KEY!,
          secretAccessKey: process.env.S3_SECRET_KEY!,
        },
        region: process.env.S3_REGION || 'local',
        endpoint: process.env.S3_ENDPOINT || 'http://127.0.0.1:54321/storage/v1/s3',
        forcePathStyle: process.env.S3_FORCE_PATH_STYLE === 'true',
      },
    }),
  ],
})

export default payloadConfig;