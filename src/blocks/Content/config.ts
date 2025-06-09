import { baseBlockFields, type Block, type Field } from 'payload'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
  UnorderedListFeature,
  UploadFeature,
  EXPERIMENTAL_TableFeature,
  AlignFeature,
  IndentFeature,
  InlineCodeFeature,
  RelationshipFeature,
  BlocksFeature,
  BlockFields,
  LinkFeature,
} from '@payloadcms/richtext-lexical'
// import { MyFeature } from '@/app/(payload)/features/myFeature/feature.server'


import { link } from '@/fields/link'
import { BlockContent } from 'node_modules/@payloadcms/richtext-lexical/dist/features/blocks/client/component/BlockContent'

const columnFields: Field[] = [
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
        label: 'One Fourth',
        value: 'oneFourth',
      },
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
      admin: {
        hideGutter: true,
        placeholder: 'Type your content here...',
      },
      features: ({ rootFeatures }) => {
        return [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4', 'h5', 'h6'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
          UnorderedListFeature(),
          UploadFeature(),
          EXPERIMENTAL_TableFeature(),
          AlignFeature(),
          IndentFeature(),
          InlineCodeFeature(),
          RelationshipFeature(),
          BlocksFeature({ blocks: [Banner, Code, MediaBlock, CallToAction, Archive, FormBlock] }),
          LinkFeature({
            fields: ({ defaultFields }) => [
              ...defaultFields,
              {
                name: 'className',
                type: 'text',
                label: 'Class Name',
                admin: {
                  description: 'Add a CSS class to the link.',
                },
              },
            ],
          }),

        ]
      },
    }),
    label: false,
  },
  {
    name: 'colbackgroundimage',
    type: 'upload',
    relationTo: 'media',
  },
  {
    name: 'enableLink',
    type: 'checkbox',
  },
  link({
    overrides: {
      admin: {
        condition: (_, { enableLink }) => Boolean(enableLink),
      },
    },
  }),
]

export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  fields: [
    {
      name: 'columns',
      type: 'array',
      admin: {
        initCollapsed: true,
      },
      fields: columnFields,
    },
    {
      name: 'customcontainerclass',
      type: 'text',
      label: 'Custom Container Class',
    },
    {
      name: 'backgroundimage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
