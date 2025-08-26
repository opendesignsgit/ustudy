import type { CollectionConfig } from 'payload'

import { anyone } from '../access/anyone'
import { authenticated } from '../access/authenticated'
import { hideFromUniversityRole } from '../access/isAdminOrUniversityAdmin'
import { createRoleBasedAccess, createRoleBasedVisibility } from '../access/roleBasedAccess'
import { slugField } from '@/fields/slug'

export const Categories: CollectionConfig = {
  slug: 'categories',
  access: {
    create: createRoleBasedAccess('create', 'categories', { fallbackAdmin: true }),
    delete: createRoleBasedAccess('delete', 'categories', { fallbackAdmin: true }),
    read: createRoleBasedAccess('read', 'categories', { fallbackAdmin: true, publicRead: true }),
    update: createRoleBasedAccess('update', 'categories', { fallbackAdmin: true }),
  },
  admin: {
    group: 'Content Management',
    useAsTitle: 'title',
    hidden: createRoleBasedVisibility('categories'),
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
