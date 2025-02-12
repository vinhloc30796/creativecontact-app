import { Staff } from '@/app/collections/staff'
import { postgresAdapter } from '@payloadcms/db-postgres'
// import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { buildConfig, SanitizedConfig } from 'payload'
import sharp from 'sharp'

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
    Staff
  ],
  // Tells Payload which collection to use for authentication
  admin: {
    user: 'staff',
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
})

export default payloadConfig;