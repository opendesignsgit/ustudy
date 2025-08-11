import type { CollectionConfig } from 'payload'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
  OrderedListFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { Banner } from '@/blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { SliderBlock } from '@/blocks/SliderBlock/config'
import { YearlyCourses } from '@/blocks/CoursesComponents/YearsModule/config'
import { RegisterFormBlock } from '@/blocks/RegisterForm/config'
import { UniversityHero, UniversityAbout, UniversityPrograms, UniversityContact } from '@/blocks/UniversityTemplateBlocks'
import { slugField } from '@/fields/slug'

export const UniversityTemplates: CollectionConfig = {
  slug: 'university-templates',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true, // Publicly readable for universities to use
    update: authenticated,
  },
  admin: {
    group: 'Universities',
    defaultColumns: ['title', 'status', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Template Name',
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Template Description',
    },
    {
      name: 'status',
      type: 'select',
      options: [
        {
          label: 'Active',
          value: 'active',
        },
        {
          label: 'Inactive',
          value: 'inactive',
        },
        {
          label: 'Draft',
          value: 'draft',
        },
      ],
      defaultValue: 'draft',
      required: true,
    },
    {
      name: 'previewImage',
      type: 'upload',
      relationTo: 'media',
      label: 'Template Preview Image',
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }),
            BlocksFeature({
              blocks: [
                Banner,
                Code,
                MediaBlock,
                CallToAction,
                Content,
                Archive,
                FormBlock,
                SliderBlock,
                YearlyCourses,
                RegisterFormBlock,
                UniversityHero,
                UniversityAbout,
                UniversityPrograms,
                UniversityContact,
              ],
            }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
            HorizontalRuleFeature(),
            OrderedListFeature(),
            UnorderedListFeature(),
          ]
        },
      }),
      label: 'Template Content Skeleton',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      options: [
        {
          label: 'Landing Page',
          value: 'landing',
        },
        {
          label: 'About Page',
          value: 'about',
        },
        {
          label: 'Courses Page',
          value: 'courses',
        },
        {
          label: 'Contact Page',
          value: 'contact',
        },
        {
          label: 'Custom',
          value: 'custom',
        },
      ],
      defaultValue: 'landing',
    },
    ...slugField(),
  ],
  timestamps: true,
}