import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { hero } from '@/heros/config'
import { slugField } from '@/fields/slug'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const UniversityPages: CollectionConfig<'university-pages'> = {
  slug: 'university-pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    university: true,
  },
  admin: {
    group: 'Universities',
    defaultColumns: ['title', 'slug', 'university', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) => {
        if (data?.university && typeof data.university === 'object' && data.university.slug) {
          const universitySlug = data.university.slug
          const pageSlug = typeof data?.slug === 'string' ? data.slug : ''
          return `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/university/${universitySlug}/${pageSlug}`
        }
        return `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}`
      },
    },
    preview: (data, { req }) => {
      if (data?.university && typeof data.university === 'object' && data.university.slug) {
        const universitySlug = data.university.slug
        const pageSlug = typeof data?.slug === 'string' ? data.slug : ''
        return `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/university/${universitySlug}/${pageSlug}`
      }
      return `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}`
    },
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'university',
      type: 'relationship',
      relationTo: 'universities',
      required: true,
      admin: {
        description: 'The university this page belongs to',
      },
    },
    {
      name: 'published',
      type: 'checkbox',
      admin: {
        position: 'sidebar',
        description: 'Check to publish this page',
      },
      defaultValue: false,
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData.published && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: [CallToAction, Content, MediaBlock, Archive, FormBlock],
              required: true,
              admin: {
                initCollapsed: true,
              },
            },
          ],
          label: 'Content',
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
    ...slugField(),
  ],
  hooks: {
    beforeChange: [populatePublishedAt],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
    },
    maxPerDoc: 50,
  },
}