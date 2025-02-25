import type { CollectionConfig } from 'payload'

import { admins } from './access/admins'

const s3AccessKey = process.env.S3_ACCESS_KEY || '625729a08b95bf1b7ff351a663f_ENDPOINT'
const s3SecretKey = process.env.S3_SECRET_KEY || '850181e4652dd023b7a98c58ae0d2d34bd487ee0cc3254aed6eda37307425907'
const s3Bucket = process.env.S3_BUCKET || 'creativecontact-app'
const s3Region = process.env.S3_REGION
const s3Endpoint = process.env.S3_ENDPOINT
const s3ForcePathStyle = process.env.S3_FORCE_PATH_STYLE

export const Media: CollectionConfig<'media'> = {
  slug: 'media',
  access: {
    create: admins,
    delete: admins,
    read: () => true,
    update: admins,
  },
  defaultPopulate: {
    alt: true,
    darkModeFallback: true,
    filename: true,
    height: true,
    mimeType: true,
    url: true,
    width: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: false,
    },
    {
      name: 'alt',
      type: 'text',
      required: false,
    },
    {
      name: 'darkModeFallback',
      type: 'upload',
      admin: {
        description: 'Choose an upload to render if the visitor is using dark mode.',
      },
      relationTo: 'media',
    },
  ],
  upload: {
    adminThumbnail: () => false,
  },
}