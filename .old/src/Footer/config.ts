import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'
import { Banner } from '../blocks/Banner/config'
import { Code } from '../blocks/Code/config'
import { Archive } from '../blocks/ArchiveBlock/config'
import { CallToAction } from '../blocks/CallToAction/config'
import { Content } from '../blocks/Content/config'
import { FormBlock } from '../blocks/Form/config'
import { MediaBlock } from '../blocks/MediaBlock/config'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
  UnorderedListFeature,
  OrderedListFeature,
  BlocksFeature,
  HorizontalRuleFeature,
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
    // {
    //     name: 'customclass',
    //     type: 'text',
    //     label: 'Custom Class',
    //   },
    //   {
    //     name: 'size',
    //     type: 'select',
    //     defaultValue: 'oneThird',
    //     options: [
    //       {
    //         label: 'One Third',
    //         value: 'oneThird',
    //       },
    //       {
    //         label: 'Half',
    //         value: 'half',
    //       },
    //       {
    //         label: 'Two Thirds',
    //         value: 'twoThirds',
    //       },
    //       {
    //         label: 'Full',
    //         value: 'full',
    //       },
    //     ],
    //   },
      {
        name: 'content',
        type: 'richText',
        editor: lexicalEditor({
          features: ({ rootFeatures }) => {
            return [
              ...rootFeatures,
              HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
              BlocksFeature({ blocks: [Banner, Code, MediaBlock, CallToAction, Content, Archive, FormBlock] }),
              FixedToolbarFeature(),
              InlineToolbarFeature(),
              HorizontalRuleFeature(),
              OrderedListFeature(),
              UnorderedListFeature()
            ]
          },
        }),
        label: false,
        required: true,
      },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
