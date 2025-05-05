import type { CollectionConfig } from 'payload'

export const Countries: CollectionConfig = {
  slug: 'countries',
  access: {
    create: ({ req: { user } }) => Boolean(user), // Only authenticated users
    read: () => true, // Publicly readable
    update: ({ req: { user } }) => Boolean(user), // Only authenticated users
    delete: ({ req: { user } }) => Boolean(user), // Only authenticated users
  },
  admin: {
    group: 'Configurations',
    useAsTitle: 'name',
    defaultColumns: ['name', 'code'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Country Name',
    },
    {
      name: 'code',
      type: 'text',
      required: true,
      label: 'Country Code',
    },
  ],
}