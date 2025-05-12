import type { CollectionConfig } from 'payload'
import { PayloadRequest } from 'payload';
import { Response } from 'express'
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
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Banner } from '../../blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { populateAuthors } from './hooks/populateAuthors'
import { revalidateDelete, revalidatePost } from './hooks/revalidatePost'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from '@/fields/slug'

export const Courses: CollectionConfig<'courses'> = {
  slug: 'courses',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
      meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    group: 'Courses',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'courses',
          req,
        })

        return path
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'courses',
        req,
      }),
    useAsTitle: 'title',
  },
  endpoints: [
    {
      path: '/filter',
      method: 'get',
      handler: (async (req: PayloadRequest, res: Response) => {
        try {
          const { university, studyArea } = req.query;
          
          const result = await req.payload.find({
            collection: 'courses',
            where: {
              ...(university ? { 'university': { equals: university } } : {}),
              ...(studyArea ? { 'studyArea': { equals: studyArea } } : {})
            },
            limit: 100
          });
          
          res.status(200).json(result);
        } catch (error) {
          console.error('Filter error:', error);
          res.status(500).json({ error: 'Filtering failed' });
        }
      }) as any // This type assertion resolves the TypeScript error
    }
  ],
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
            },
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
            {
              name: 'description',
              type: 'textarea',
            },
          ],
          label: 'Content',
        },
        {
          fields: [
            // {
            //   name: 'relatedPosts',
            //   type: 'relationship',
            //   admin: {
            //     position: 'sidebar',
            //   },
            //   filterOptions: ({ id }) => {
            //     return {
            //       id: {
            //         not_in: [id],
            //       },
            //     }
            //   },
            //   hasMany: true,
            //   relationTo: 'posts',
            // },
            // {
            //   name: 'categories',
            //   type: 'relationship',
            //   admin: {
            //     position: 'sidebar',
            //   },
            //   hasMany: true,
            //   relationTo: 'categories',
            // },
            {
              name: 'university',
              type: 'relationship',
              relationTo: 'universities',
              required: true,
            },
            {
              name: 'degreeProgram',
              type: 'text',
            },
            {
              name: 'department',
              type: 'text',
            },
            {
              name: 'studyArea',
              type: 'text',
            },
            {
              name: 'studyYears',
              type: 'number',
            },
            {
              name: 'studyMode',
              type: 'select',
              options: [
                { label: 'Full-time', value: 'full-time' },
                { label: 'Part-time', value: 'part-time' },
                { label: 'Online', value: 'online' },
              ],
            },
            {
              name: 'intakeMonths',
              type: 'text',
            },
          ],
          label: 'Meta',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'authors',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: 'users',
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidatePost],
    afterRead: [populateAuthors],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}