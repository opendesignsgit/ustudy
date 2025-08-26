import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'

export const RoleSettings: CollectionConfig = {
  slug: 'role-settings',
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: ({ req: { user } }) => {
      // Allow admin and university-role users to read settings
      if (user?.collection === 'users') {
        return (user as any)?.role === 'admin' || (user as any)?.role === 'university-role'
      }
      if (user?.collection === 'universities') {
        return true
      }
      return false
    },
    update: isAdmin,
  },
  admin: {
    group: 'Settings',
    defaultColumns: ['roleName', 'updatedAt'],
    useAsTitle: 'roleName',
  },
  fields: [
    {
      name: 'roleName',
      type: 'select',
      required: true,
      unique: true,
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
        { label: 'University Role', value: 'university-role' },
        { label: 'Post Editor', value: 'post-editor' },
      ],
      admin: {
        description: 'Select the role to configure permissions for',
      },
    },
    {
      name: 'permissions',
      type: 'group',
      fields: [
        {
          name: 'users',
          type: 'group',
          label: 'Users Collection',
          fields: [
            { name: 'create', type: 'checkbox', defaultValue: false },
            { name: 'read', type: 'checkbox', defaultValue: false },
            { name: 'update', type: 'checkbox', defaultValue: false },
            { name: 'delete', type: 'checkbox', defaultValue: false },
            { name: 'selfControl', type: 'checkbox', defaultValue: false },
          ],
        },
        {
          name: 'universities',
          type: 'group',
          label: 'Universities Collection',
          fields: [
            { name: 'create', type: 'checkbox', defaultValue: false },
            { name: 'read', type: 'checkbox', defaultValue: false },
            { name: 'update', type: 'checkbox', defaultValue: false },
            { name: 'delete', type: 'checkbox', defaultValue: false },
            { name: 'selfControl', type: 'checkbox', defaultValue: false },
          ],
        },
        {
          name: 'university-pages',
          type: 'group',
          label: 'University Pages Collection',
          fields: [
            { name: 'create', type: 'checkbox', defaultValue: false },
            { name: 'read', type: 'checkbox', defaultValue: false },
            { name: 'update', type: 'checkbox', defaultValue: false },
            { name: 'delete', type: 'checkbox', defaultValue: false },
            { name: 'selfControl', type: 'checkbox', defaultValue: false },
          ],
        },
        {
          name: 'courses',
          type: 'group',
          label: 'Courses Collection',
          fields: [
            { name: 'create', type: 'checkbox', defaultValue: false },
            { name: 'read', type: 'checkbox', defaultValue: false },
            { name: 'update', type: 'checkbox', defaultValue: false },
            { name: 'delete', type: 'checkbox', defaultValue: false },
            { name: 'selfControl', type: 'checkbox', defaultValue: false },
          ],
        },
        {
          name: 'students',
          type: 'group',
          label: 'Students Collection',
          fields: [
            { name: 'create', type: 'checkbox', defaultValue: false },
            { name: 'read', type: 'checkbox', defaultValue: false },
            { name: 'update', type: 'checkbox', defaultValue: false },
            { name: 'delete', type: 'checkbox', defaultValue: false },
            { name: 'selfControl', type: 'checkbox', defaultValue: false },
          ],
        },
        {
          name: 'posts',
          type: 'group',
          label: 'Posts Collection',
          fields: [
            { name: 'create', type: 'checkbox', defaultValue: false },
            { name: 'read', type: 'checkbox', defaultValue: false },
            { name: 'update', type: 'checkbox', defaultValue: false },
            { name: 'delete', type: 'checkbox', defaultValue: false },
            { name: 'selfControl', type: 'checkbox', defaultValue: false },
          ],
        },
        {
          name: 'media',
          type: 'group',
          label: 'Media Collection',
          fields: [
            { name: 'create', type: 'checkbox', defaultValue: false },
            { name: 'read', type: 'checkbox', defaultValue: false },
            { name: 'update', type: 'checkbox', defaultValue: false },
            { name: 'delete', type: 'checkbox', defaultValue: false },
            { name: 'selfControl', type: 'checkbox', defaultValue: false },
          ],
        },
        {
          name: 'categories',
          type: 'group',
          label: 'Categories Collection',
          fields: [
            { name: 'create', type: 'checkbox', defaultValue: false },
            { name: 'read', type: 'checkbox', defaultValue: false },
            { name: 'update', type: 'checkbox', defaultValue: false },
            { name: 'delete', type: 'checkbox', defaultValue: false },
            { name: 'selfControl', type: 'checkbox', defaultValue: false },
          ],
        },
        {
          name: 'bookings',
          type: 'group',
          label: 'Bookings Collection',
          fields: [
            { name: 'create', type: 'checkbox', defaultValue: false },
            { name: 'read', type: 'checkbox', defaultValue: false },
            { name: 'update', type: 'checkbox', defaultValue: false },
            { name: 'delete', type: 'checkbox', defaultValue: false },
            { name: 'selfControl', type: 'checkbox', defaultValue: false },
          ],
        },
      ],
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Optional description for this role configuration',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Set default permissions for new roles
        if (operation === 'create' && data.roleName) {
          switch (data.roleName) {
            case 'admin':
              // Admin has full access to everything
              const collections = ['users', 'universities', 'university-pages', 'courses', 'students', 'posts', 'media', 'categories', 'bookings']
              collections.forEach(collection => {
                if (!data.permissions[collection]) {
                  data.permissions[collection] = {}
                }
                data.permissions[collection] = {
                  create: true,
                  read: true,
                  update: true,
                  delete: true,
                  selfControl: true,
                }
              })
              break
            
            case 'university-role':
              // University role can manage their own university and related pages
              data.permissions.universities = {
                create: false,
                read: true,
                update: true,
                delete: false,
                selfControl: true,
              }
              data.permissions['university-pages'] = {
                create: true,
                read: true,
                update: true,
                delete: true,
                selfControl: true,
              }
              data.permissions.courses = {
                create: true,
                read: true,
                update: true,
                delete: true,
                selfControl: true,
              }
              data.permissions.media = {
                create: true,
                read: true,
                update: true,
                delete: true,
                selfControl: true,
              }
              break
              
            case 'editor':
              // Editor can manage posts and media
              data.permissions.posts = {
                create: true,
                read: true,
                update: true,
                delete: true,
                selfControl: false,
              }
              data.permissions.media = {
                create: true,
                read: true,
                update: true,
                delete: true,
                selfControl: false,
              }
              break
              
            case 'post-editor':
              // Post editor can only manage posts
              data.permissions.posts = {
                create: true,
                read: true,
                update: true,
                delete: false,
                selfControl: false,
              }
              break
          }
        }
        return data
      },
    ],
  },
}