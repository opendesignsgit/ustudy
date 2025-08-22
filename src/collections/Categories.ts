import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { hideFromUniversityRole } from '../access/isAdminOrUniversityAdmin'
import { slugField } from '@/fields/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    hidden: hideFromUniversityRole,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    ...slugField(),
  ],
}
