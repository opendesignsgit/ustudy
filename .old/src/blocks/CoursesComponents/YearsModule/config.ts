import { baseBlockFields, type Block, type Field } from 'payload'
import { Banner } from '../../../blocks/Banner/config'
import { Code } from '../../../blocks/Code/config'
import { Archive } from '../../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../../blocks/CallToAction/config'
import { FormBlock } from '../../../blocks/Form/config'
import { MediaBlock } from '../../../blocks/MediaBlock/config'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
  UnorderedListFeature,
  UploadFeature,
  EXPERIMENTAL_TableFeature,
  AlignFeature,
  // TreeViewFeature,
  IndentFeature,
  InlineCodeFeature,
  RelationshipFeature,
  BlocksFeature,
  BlockFields
} from '@payloadcms/richtext-lexical'


import { link } from '@/fields/link'
import { BlockContent } from 'node_modules/@payloadcms/richtext-lexical/dist/features/blocks/client/component/BlockContent'

// config.ts
// config.ts
export const YearlyCourses: Block = {
  slug: 'yearlyCourses',
  interfaceName: 'YearlyCoursesBlock',
  labels: {
    singular: 'Course Module',
    plural: 'Course Modules',
  },
  fields: [
    {
      name: 'years',
      type: 'array',
      label: 'Course Module by Years',
      fields: [
        {
          name: 'yearNumber',
          type: 'text',
          label: 'Year Title (e.g., "Year 1", "Year 2")',
          required: true,
        },
        {
          name: 'leftColumn',
          type: 'richText',
          label: 'Left Column Content',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                HeadingFeature({ enabledHeadingSizes: ['h3'] }), // Only allow h3 for course titles
                FixedToolbarFeature(),
                InlineToolbarFeature(),
                UnorderedListFeature(),
              ]
            },
          }),
          required: true,
        },
        {
          name: 'rightColumn',
          type: 'richText',
          label: 'Right Column Content',
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                HeadingFeature({ enabledHeadingSizes: ['h3'] }), // Only allow h3 for course titles
                FixedToolbarFeature(),
                InlineToolbarFeature(),
                UnorderedListFeature(),
              ]
            },
          }),
          required: true,
        },
      ],
      admin: {
        initCollapsed: true,
        
      }
    },
  ],
}