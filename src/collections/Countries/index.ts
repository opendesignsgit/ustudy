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
    group: 'Universities',
    useAsTitle: 'name',
    defaultColumns: ['name', 'code'],
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Country Details',
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
            {
              name: 'logo',
              type: 'upload',
              label: 'Country Flag/Logo',
              relationTo: 'media', // This assumes you have a media collection
              filterOptions: {
                mimeType: { contains: 'image' }, // Only allow image files
              },
            },
            {
              name: 'countryImage',
              type: 'upload',
              label: 'Country Image',
              relationTo: 'media',
              filterOptions: {
                mimeType: { contains: 'image' },
              },
            },
          ],
        },
        {
          label: 'Currency Details',
          fields: [
            {
              name: 'currencyName',
              type: 'text',
              label: 'Currency Name',
              required: true,
            },
            {
              name: 'currencyCode',
              type: 'text',
              label: 'Currency Code',
              required: true,
            },
            {
              name: 'currencyValue',
              type: 'number',
              label: 'Currency Value (in INR)',
              required: true,
            },
          ],
        },
      ],
    },
  ],
}