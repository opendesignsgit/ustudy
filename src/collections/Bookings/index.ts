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

export const Orders: CollectionConfig<'orders'> = {
  slug: 'orders',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  // This config controls what's populated by default when a post is referenced
  // https://payloadcms.com/docs/queries/select#defaultpopulate-collection-config-property
  // Type safe if the collection slug generic is passed to `CollectionConfig` - `CollectionConfig<'courses'>
  defaultPopulate: {
    customerName: true,
  },
  admin: {
    
    group: 'Courses',
    defaultColumns: ['customerName'],
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'orders',
          req,
        })

        return path
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'orders',
        req,
      }),
    useAsTitle: 'customerName',
  },
  fields: [
    {
      name: 'courseName',
      type: 'text',
      required: true,
      label: 'Course Name',
    },
    {
      name: 'courseID',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'book',
      type: 'text',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'customerName',
      type: 'text',
      required: true,
      label: 'Customer Name',
    },
    {
      name: 'customerID',
      type: 'text',
      label: 'Customer Name',
      admin: {
        hidden: true,
      },
    },
    {
      name: 'orderDate',
      type: 'date',
      required: true,
      label: 'Order Date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'razorpayResponse',
      type: 'textarea',
      required: true,
      label: 'Razorpay Response Data',
      admin: {
        readOnly: true,
      },
    },
  ],
  hooks: {
    afterChange: [revalidatePost],
    afterRead: [populateAuthors],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
