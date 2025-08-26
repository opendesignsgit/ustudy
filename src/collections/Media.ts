import type { CollectionConfig } from 'payload'

import {
  FixedToolbarFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { fileURLToPath } from 'url'
import { slugField } from '@/fields/slug'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { hideFromUniversityRole } from '../access/isAdminOrUniversityAdmin'
import { createRoleBasedAccess, createRoleBasedVisibility } from '../access/roleBasedAccess'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    create: createRoleBasedAccess('create', 'media', { fallbackAdmin: true, allowSelfControl: true }),
    delete: createRoleBasedAccess('delete', 'media', { fallbackAdmin: true, allowSelfControl: true }),
    read: createRoleBasedAccess('read', 'media', { fallbackAdmin: true, publicRead: true }),
    update: createRoleBasedAccess('update', 'media', { fallbackAdmin: true, allowSelfControl: true }),
  },
  admin: {
    group: 'Content Management',
    hidden: createRoleBasedVisibility('media'),
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      //required: true,
    },
    {
      name: 'caption',
      type: 'richText',
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [...rootFeatures, FixedToolbarFeature(), InlineToolbarFeature()]
        },
      }),
    },
  ],
  upload: {
    // Upload to the public/media directory in Next.js making them publicly accessible even outside of Payload
    staticDir: path.resolve(dirname, '../../public/media'),
    adminThumbnail: 'thumbnail',
    focalPoint: true,
    imageSizes: [
      {
        name: 'thumbnail',
        width: 300,
      },
      {
        name: 'square',
        width: 500,
        height: 500,
      },
      {
        name: 'small',
        width: 600,
      },
      {
        name: 'medium',
        width: 900,
      },
      {
        name: 'large',
        width: 1400,
      },
      {
        name: 'xlarge',
        width: 1920,
      },
      {
        name: 'og',
        width: 1200,
        height: 630,
        crop: 'center',
      },
    ],
  },
}
