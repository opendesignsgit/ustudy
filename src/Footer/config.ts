import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
  UnorderedListFeature,
  UploadFeature,
  EXPERIMENTAL_TableFeature,
} from '@payloadcms/richtext-lexical'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 6,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Footer/RowLabel#RowLabel',
        },
      },
    },
    {
        name: 'customclass',
        type: 'text',
        label: 'Custom Class',
      },
      {
        name: 'size',
        type: 'select',
        defaultValue: 'oneThird',
        options: [
          {
            label: 'One Third',
            value: 'oneThird',
          },
          {
            label: 'Half',
            value: 'half',
          },
          {
            label: 'Two Thirds',
            value: 'twoThirds',
          },
          {
            label: 'Full',
            value: 'full',
          },
        ],
      },
      {
        name: 'richText',
        type: 'richText',
        editor: lexicalEditor({
          features: ({ rootFeatures }) => {
            return [
              ...rootFeatures,
              HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
              FixedToolbarFeature(),
              InlineToolbarFeature(),
              UnorderedListFeature(), 
              UploadFeature(),
              EXPERIMENTAL_TableFeature(),
            ]
          },
        }),
        label: false,
      },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
