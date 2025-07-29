// university-templates/index.ts
import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { slugField } from '@/fields/slug'
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

export const UniversityTemplates: CollectionConfig = {
  slug: 'university-templates',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  admin: {
    group: 'Universities',
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'status',
      type: 'select',
      options: ['active', 'inactive'],
      defaultValue: 'active',
      required: true,
    },
    {
      name: 'blocks',
      type: 'array',
      label: 'Available Blocks',
      fields: [
        {
          name: 'block',
          type: 'select',
          options: [
            { label: 'Banner', value: 'banner' },
            { label: 'Content', value: 'content' },
            { label: 'Media', value: 'media' },
            { label: 'Call to Action', value: 'cta' },
            { label: 'Form', value: 'form' },
            { label: 'Slider', value: 'slider' },
            { label: 'Courses', value: 'courses' },
            { label: 'Registration', value: 'registration' },
          ],
          required: true,
        }
      ]
    },
    ...slugField(),
  ],
}