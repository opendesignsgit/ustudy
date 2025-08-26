import type { CollectionConfig } from 'payload'

import { isAdmin, isAdminFieldLevel } from '../../access/isAdmin'
import { isAdminOrSelf } from '../../access/isAdminOrSelf'
import { createRoleBasedAccess, createRoleBasedFilter, createRoleBasedAdminAccess } from '../../access/roleBasedAccess'
import type { User } from '@/payload-types'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: createRoleBasedAdminAccess('users'),
    create: isAdmin,
    delete: createRoleBasedAccess('users', 'delete'),
    read: createRoleBasedFilter('users'),
    update: createRoleBasedAccess('users', 'update'),
  },
  admin: {
    group: 'User Management',
    defaultColumns: ['name', 'email', 'role'],
    useAsTitle: 'name',
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
      type: 'select',
      required: true,
      defaultValue: 'editor',
      // Save this field to JWT so we can use from `req.user`
      saveToJWT: true,
      access: {
        // Only admins can create or update roles
        create: isAdminFieldLevel,
        update: isAdminFieldLevel,
      },
      options: [
        {
          label: 'Admin',
          value: 'admin',
        },
        {
          label: 'Editor', 
          value: 'editor',
        },
        {
          label: 'University Role',
          value: 'university-role',
        },
        {
          label: 'Post Editor',
          value: 'post-editor',
        },
      ],
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
