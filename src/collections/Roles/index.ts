import type { CollectionConfig } from 'payload'
import { isAdmin } from '../../access/isAdmin'

export const Roles: CollectionConfig = {
  slug: 'roles',
  access: {
    create: isAdmin,
    delete: isAdmin,
    read: ({ req: { user } }) => Boolean(user), // All authenticated users can read roles
    update: isAdmin,
  },
  admin: {
    defaultColumns: ['name', 'description'],
    useAsTitle: 'name',
    group: 'User Management',
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Unique name for this role (e.g., "admin", "editor", "university-role")',
      },
    },
    {
      name: 'description',
      type: 'text',
      admin: {
        description: 'Human-readable description of this role',
      },
    },
    {
      name: 'privileges',
      type: 'array',
      label: 'Collection Privileges',
      admin: {
        description: 'Define CRUD + Self Control privileges for each collection',
      },
      fields: [
        {
          name: 'collection',
          type: 'text',
          required: true,
          admin: {
            description: 'Collection slug (e.g., "users", "posts", "universities")',
          },
        },
        {
          name: 'view',
          type: 'checkbox',
          label: 'View',
          defaultValue: false,
          admin: {
            description: 'Show collection in admin panel/nav only if this is enabled',
          },
        },
        {
          name: 'create',
          type: 'checkbox',
          label: 'Create',
          defaultValue: false,
          admin: {
            description: 'Allow creating new records in this collection',
          },
        },
        {
          name: 'edit',
          type: 'checkbox',
          label: 'Edit',
          defaultValue: false,
          admin: {
            description: 'Allow editing existing records in this collection',
          },
        },
        {
          name: 'delete',
          type: 'checkbox',
          label: 'Delete',
          defaultValue: false,
          admin: {
            description: 'Allow deleting records from this collection',
          },
        },
        {
          name: 'selfControl',
          type: 'checkbox',
          label: 'Self Control',
          defaultValue: false,
          admin: {
            description: 'Restrict access to entries created by (or assigned to) the logged-in user',
          },
        },
      ],
    },
  ],
  hooks: {
    afterChange: [
      ({ doc, operation, req }) => {
        // When a role is created or updated, we could trigger updates to collection configs
        // This would be implemented based on specific requirements
        console.log(`Role ${doc.name} was ${operation}d`)
      }
    ],
  },
  timestamps: true,
}