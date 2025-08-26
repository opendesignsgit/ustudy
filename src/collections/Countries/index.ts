import type { CollectionConfig } from 'payload'
import { createRoleBasedAccess, createRoleBasedVisibility } from '../../access/roleBasedAccess'

export const Countries: CollectionConfig = {
  slug: 'countries',
  access: {
    create: createRoleBasedAccess('create', 'countries', { fallbackAdmin: true }),
    read: createRoleBasedAccess('read', 'countries', { fallbackAdmin: true, publicRead: true }),
    update: createRoleBasedAccess('update', 'countries', { fallbackAdmin: true }),
    delete: createRoleBasedAccess('delete', 'countries', { fallbackAdmin: true }),
  },
  admin: {
    group: 'Universities',
    useAsTitle: 'name',
    defaultColumns: ['name', 'code'],
    hidden: createRoleBasedVisibility('countries'),
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