import type { CollectionConfig } from 'payload'
import { isAdmin } from '../access/isAdmin'
import { createRoleBasedAccess, createRoleBasedFilter, createRoleBasedAdminAccess } from '../access/roleBasedAccess'

export const Groups: CollectionConfig = {
  slug: 'groups',
  access: {
    create: createRoleBasedAccess('groups', 'create'),
    delete: createRoleBasedAccess('groups', 'delete'),
    read: createRoleBasedFilter('groups'),
    update: createRoleBasedAccess('groups', 'update'),
    admin: createRoleBasedAdminAccess('groups'),
  },
  admin: {
    group: 'User Management',
    defaultColumns: ['name', 'description', 'updatedAt'],
    useAsTitle: 'name',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Name of the group (e.g., "University Administrators", "Content Editors")',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Description of the group and its purpose',
      },
    },
    {
      name: 'roles',
      type: 'array',
      label: 'Roles in this Group',
      fields: [
        {
          name: 'role',
          type: 'select',
          required: true,
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Editor', value: 'editor' },
            { label: 'University Role', value: 'university-role' },
            { label: 'Post Editor', value: 'post-editor' },
            { label: 'Student Role', value: 'student-role' },
          ],
        },
        {
          name: 'permissions',
          type: 'group',
          label: 'Group-specific Permissions Override',
          admin: {
            description: 'Override specific permissions for this role when part of this group',
          },
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
          ],
        },
      ],
    },
    {
      name: 'users',
      type: 'array',
      label: 'Users in this Group',
      fields: [
        {
          name: 'user',
          type: 'relationship',
          relationTo: 'users',
          required: true,
        },
        {
          name: 'role',
          type: 'select',
          required: true,
          options: [
            { label: 'Admin', value: 'admin' },
            { label: 'Editor', value: 'editor' },
            { label: 'University Role', value: 'university-role' },
            { label: 'Post Editor', value: 'post-editor' },
            { label: 'Student Role', value: 'student-role' },
          ],
          admin: {
            description: 'The role this user has within this group',
          },
        },
      ],
    },
    {
      name: 'isActive',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        description: 'Whether this group is currently active',
      },
    },
  ],
  hooks: {
    beforeChange: [
      ({ data, operation }) => {
        // Set default values for new groups
        if (operation === 'create') {
          data.isActive = data.isActive !== false
        }
        return data
      },
    ],
  },
}