import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { hideFromUniversityRole, createRoleBasedAdminVisibility } from '../access/isAdminOrUniversityAdmin'
import { createRoleBasedAccess, createRoleBasedFilter, createRoleBasedAdminAccess } from '../access/roleBasedAccess'
import { slugField } from '@/fields/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: createRoleBasedAccess('categories', 'create'),
    delete: createRoleBasedAccess('categories', 'delete'),
    read: anyone,
    update: createRoleBasedAccess('categories', 'update'),
    admin: createRoleBasedAdminAccess('categories'),
  },
  admin: {
    useAsTitle: 'title',
    hidden: createRoleBasedAdminVisibility('categories'),
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
