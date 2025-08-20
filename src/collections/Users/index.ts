import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: ({ req: { user } }) => {
      if (!user) return false
      // Allow admin users (from users collection) 
      if ((user as any).collection === 'users') return true
      // Allow university users (from universities collection) to access admin panel
      if ((user as any).collection === 'universities') return true
      return false
    },
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
