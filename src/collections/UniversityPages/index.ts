import type { CollectionConfig } from 'payload'
import {
  lexicalEditor,
  HeadingFeature,
  BoldFeature,
  ItalicFeature,
  LinkFeature,
  UnorderedListFeature,
  OrderedListFeature,
} from '@payloadcms/richtext-lexical'
import { canAccessOwnUniversityPages } from '@/access/canAccessOwnUniversity'
import { createRoleBasedAccess, createRoleBasedVisibility } from '@/access/roleBasedAccess'
import { slugField } from '@/fields/slug'

export const UniversityPages: CollectionConfig = {
  slug: 'university-pages',
  access: {
    create: createRoleBasedAccess('create', 'university-pages', { fallbackAdmin: true, allowSelfControl: true }),
    delete: createRoleBasedAccess('delete', 'university-pages', { fallbackAdmin: true, allowSelfControl: true }),
    read: createRoleBasedAccess('read', 'university-pages', { fallbackAdmin: true, publicRead: true, allowSelfControl: true }),
    update: createRoleBasedAccess('update', 'university-pages', { fallbackAdmin: true, allowSelfControl: true }),
  },
  admin: {
    group: 'Universities',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'university', 'updatedAt'],
    hidden: createRoleBasedVisibility('university-pages'),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'A brief description of this page (used for SEO and meta descriptions)',
      },
    },
    ...slugField(),
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
      name: 'parent',
      type: 'relationship',
      relationTo: 'university-pages',
      admin: {
        description: 'Parent page (for creating hierarchical page structure)',
      },
    },
    {
      name: 'content',
      type: 'richText',
      editor: lexicalEditor({
        features: [
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
          BoldFeature(),
          ItalicFeature(),
          LinkFeature({
            enabledCollections: ['pages', 'posts'],
          }),
          UnorderedListFeature(),
          OrderedListFeature(),
        ],
      }),
    },
    {
      name: 'showInMenu',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this page should appear in the university navigation menu',
      },
    },
    {
      name: 'menuOrder',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Order in which this page appears in the menu (lower numbers appear first)',
      },
    },
  ],
  versions: {
    drafts: true,
  },
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        if (operation === 'create' && !data.slug) {
          data.slug = data.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        }
        return data
      },
    ],
  },
}