import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminFieldLevel } from '../../access/isAdmin'
import { isAdminOrSelf } from '../../access/isAdminOrSelf'
import { roleBasedAccess, roleBasedAdminVisibility } from '../../access/roleBasedAccess'
import type { User } from '@/payload-types'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: ({ req: { user } }) => Boolean(
      (user?.collection === 'users' && ((user as User)?.role === 'admin' || (user as User)?.role === 'university-role')) ||
      user?.collection === 'universities'
    ),
    create: roleBasedAccess('users', 'create'),
    delete: roleBasedAccess('users', 'delete'),
    read: isAdminOrSelf,
    update: isAdminOrSelf,
  },
  admin: {
    defaultColumns: ['name', 'email', 'role'],
    useAsTitle: 'name',
    group: 'User Management',
    hidden: roleBasedAdminVisibility('users'),
  },
  auth: {
    // Include role and university in JWT for access control
    depth: 1,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'role',
      type: 'relationship',
      relationTo: 'roles',
      required: true,
      // Save this field to JWT so we can use from `req.user`
      saveToJWT: true,
      access: {
        // Only admins can create or update roles
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
      admin: {
        description: 'Select the role for this user from the Roles collection',
      },
    },
    {
      name: 'university',
      type: 'relationship',
      relationTo: 'universities',
      // Save this field to JWT so we can use from `req.user`
      saveToJWT: true,
      access: {
        // Only admins can create or update university association
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
      admin: {
        condition: ({ role }) => role === 'university-role',
        description: 'This field associates university-role users with their university.',
      },
    },
  ],
  timestamps: true,
}
