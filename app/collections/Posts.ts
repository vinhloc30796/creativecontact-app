import type { CollectionConfig } from 'payload'

import { revalidatePath } from 'next/cache'

import { Banner } from '@/app/blocks/Banner'
import { BlogContent } from '@/app/blocks/BlogContent'
import { MediaBlock } from '@/app/blocks/Media'
import richText from '@/app/fields/richText'
import { slugField } from '@/app/fields/slug'
import { formatPreviewURL } from '@/lib/formatPreviewUrl'
import { admins } from './access/admins'
import { publishedOnly } from './access/publishedOnly'

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    create: admins,
    delete: admins,
    read: publishedOnly,
    readVersions: admins,
    update: admins,
  },
  admin: {
    livePreview: {
      url: ({ data }) => formatPreviewURL('posts', data),
    },
    preview: (doc) => formatPreviewURL('posts', doc),
    useAsTitle: 'title',
  },
  defaultPopulate: {
    slug: true,
    authors: true,
    image: true,
    publishedOn: true,
    title: true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'excerpt',
      type: 'text',
      maxLength: 149,
      admin: {
        description: 'Brief summary of the post (max 149 characters)',
      },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'useVideo',
      type: 'checkbox',
      label: 'Use Youtube video as header image',
    },
    {
      name: 'videoUrl',
      type: 'text',
      admin: {
        condition: (_, siblingData) => siblingData?.useVideo,
      },
      label: 'Video URL',
    },
    {
      name: 'lexicalContent',
      type: 'richText',
    },
    {
      name: 'relatedPosts',
      type: 'relationship',
      filterOptions: ({ id }) => {
        return {
          id: {
            not_in: [id],
          },
        }
      },
      hasMany: true,
      relationTo: 'posts',
    },
    slugField(),
    {
      name: 'authors',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: 'staffs',
      required: true,
    },
    {
      name: 'publishedOn',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      required: true,
    },
  ],
  hooks: {
    afterChange: [
      ({ doc }) => {
        revalidatePath(`/blog/${doc.slug}`)
        revalidatePath(`/blog`, 'page')
        console.log(`Revalidated: /blog/${doc.slug}`)
      },
    ],
  },
  versions: {
    drafts: true,
  },
}