import type { Block } from 'payload'

import { blockFields } from '@/app/fields/blockFields'
import richText from '@/app/fields/richText'

export const BlogContent: Block = {
  slug: 'blogContent',
  fields: [
    blockFields({
      name: 'blogContentFields',
      fields: [richText()],
    }),
  ],
}