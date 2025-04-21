import type { Block } from 'payload'

import { blockFields } from '@/app/fields/blockFields'

export const MediaBlock: Block = {
  slug: 'mediaBlock',
  fields: [
    blockFields({
      name: 'mediaBlockFields',
      fields: [
        {
          name: 'position',
          type: 'select',
          defaultValue: 'default',
          options: [
            {
              label: 'Default',
              value: 'default',
            },
            {
              label: 'Wide',
              value: 'wide',
            },
            {
              label: 'Full Width',
              value: 'fullWidth',
            },
          ],
        },
        {
          name: 'media',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'caption',
          type: 'richText',
        },
      ],
    }),
  ],
}