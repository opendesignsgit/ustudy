//src\collections\Universities\index.ts
import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { slugField } from '@/fields/slug'

export const Universities: CollectionConfig = {
  slug: 'universities',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true, // Publicly readable
    update: authenticated,
  },
  admin: {
    group: 'Universities',
    defaultColumns: ['title', 'country', 'updatedAt'],
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'University Name',
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      label: 'University Logo',
    },
    {
      name: 'secondaryLogo',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Secondary Logo',
    },
    {
      name: 'universityImage',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'University Image',
    },
    {
      name: 'email',
      type: 'email',
      required: false,
      label: 'Contact Email',
    },
    {
      name: 'country',
      type: 'relationship',
      relationTo: 'countries', // Link to countries collection
      required: true,
      label: 'Country',
    },
    ...slugField(),
  ],
}