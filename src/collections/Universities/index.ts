//src\collections\Universities\index.ts
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
import { slugField } from '@/fields/slug'

export const Universities: CollectionConfig = {
  slug: 'universities',
  access: {
    create: () => true, // Allow registration
    delete: authenticated,
    read: () => true, // Publicly readable
    update: authenticated,
  },
  admin: {
    group: 'Universities',
    defaultColumns: ['title', 'email', 'phone', 'country', 'updatedAt'],
    useAsTitle: 'title',
  },
  auth: true, // Enable authentication for universities
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'University Name',
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      unique: true,
      label: 'Phone Number',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true, // Make email unique
      label: 'Contact Email',
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basic Information',
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'University Logo',
            },
            {
              name: 'secondaryLogo',
              type: 'upload',
              relationTo: 'media',
              required: false,
              label: 'Secondary Logo',
            },
            {
              name: 'universityImage',
              type: 'upload',
              relationTo: 'media',
              required: false,
              label: 'University Image',
            },
            {
              name: 'country',
              type: 'relationship',
              relationTo: 'countries', // Link to countries collection
              required: true,
              label: 'Country',
            },
            {
              name: 'template',
              type: 'relationship',
              relationTo: 'university-templates',
              required: false,
              label: 'University Template',
              admin: {
                description: 'Select a template for your university website layout',
              },
            },
            {
              name: 'websiteUrl',
              type: 'text',
              label: 'Website URL',
              required: false,
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'University Description',
            },
            {
              name: 'isActive',
              type: 'checkbox',
              label: 'Active',
              defaultValue: true,
              admin: {
                description: 'Inactive universities cannot login',
              },
            },
          ],
        },
        {
          label: 'Content',
          fields: [
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
              label: 'University Content',
              admin: {
                description: 'Content will be filled based on the selected template layout',
              },
            },
          ],
        },
      ],
    },
    ...slugField(),
  ],
  hooks: {
    beforeLogin: [
      async ({ req, user }) => {
        if (user && user.isActive === false) {
          throw new Error('Your university account is inactive. Please contact support.');
        }
        return user;
      },
    ],
  },
  timestamps: true,
}