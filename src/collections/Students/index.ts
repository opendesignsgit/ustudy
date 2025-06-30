// collections/Students/index.ts
import type { CollectionConfig } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Students: CollectionConfig = {
  slug: 'students',
  access: {
    create: () => true,
    read: () => true,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    group: 'Universities',
    defaultColumns: ['name', 'email', 'phone'],
    useAsTitle: 'name',
  },
  auth: true,
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'college',
      type: 'text',
      required: true,
    },
    {
      name: 'dept',
      type: 'text',
      required: true,
    },
    {
      name: 'profilePic',
      type: 'upload',
      relationTo: 'media',
      required: false,
    },
    {
      name: 'terms',
      type: 'checkbox',
      required: true,
    },
    {
      name: 'is_mobile_verified',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'is_email_verified',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        hidden: true,
      },
    },
    {
      name: 'interestedCourses',
      type: 'array',
      label: 'Interested Courses',
      fields: [
        {
          name: 'course',
          type: 'relationship',
          relationTo: 'courses',
          required: true,
          admin: {
            hidden: true,
          },
        },
        {
          name: 'dateAdded',
          type: 'date',
          defaultValue: () => new Date(),
          admin: {
            hidden: true,
          },
        }
      ]
    },
    {
      name: 'browsedCourses',
      type: 'array',
      label: 'Browsed Courses',
      fields: [
        {
          name: 'course',
          type: 'relationship',
          relationTo: 'courses',
          required: true,
          admin: {
            hidden: true,
          },
        },
        {
          name: 'dateBrowsed',
          type: 'date',
          defaultValue: () => new Date(),
          admin: {
            hidden: true,
          },
        }
      ]
    },
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Active',
      defaultValue: true,
    }    
  ],
  hooks: {
    beforeLogin: [
      async ({ req, user }) => {
        if (user && user.isActive === false) {
          throw new Error('Your account is inactive. Please contact support.');
        }
        return user;
      },
    ],
  },
  timestamps: true,
};