import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { adminAccessControl } from '../../auth/adminAuth'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: adminAccessControl,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
    hidden: ({ user }: { user: any }) => {
      // Hide Users collection from university users
      return user?.collection === 'universities'
    },
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
  timestamps: true,
}
