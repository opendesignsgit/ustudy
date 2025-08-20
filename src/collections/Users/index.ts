import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'
import { adminAccessControl, enhancedBeforeLogin } from '../../auth/adminAuth'

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
  hooks: {
    beforeLogin: [
      enhancedBeforeLogin, // Multi-collection admin authentication
      async ({ req, user }) => {
        // Log successful admin user login for debugging
        if (user && (user as any).collection === 'users') {
          console.log(`Admin user login successful: ${user.email || user.id}`);
        }
        
        return user;
      },
    ],
  },
  timestamps: true,
}
