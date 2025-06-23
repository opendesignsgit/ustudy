import type { GlobalConfig } from 'payload'

export const WebsiteSettings: GlobalConfig = {
  slug: 'website-settings',
  access: {
    read: () => true,
    update: ({ req: { user } }) => Boolean(user), // Only logged-in users can update
  },
  admin: {
    group: 'Globals',
  },
  fields: [
    {
      name: 'gtagID',
      label: 'Google Analytics Tag ID',
      type: 'text',
    },
    {
      name: 'favicon',
      label: 'Favicon',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Upload the site favicon (should be a square image, e.g. 32x32px)',
      },
    },
    {
      name: 'metaTitle',
      label: 'Default Meta Title',
      type: 'text',
      required: false,
      admin: {
        description: 'This will be used as the default meta title across the site.',
      },
    },
    {
      name: 'metaDescription',
      label: 'Default Meta Description',
      type: 'textarea',
      required: false,
      admin: {
        description: 'This will be used as the default meta description across the site.',
      },
    },
    {
      name: 'metaImage',
      label: 'Default Meta Image',
      type: 'upload',
      relationTo: 'media',
      required: false,
      admin: {
        description: 'Upload the default image for social sharing (OpenGraph, etc).',
      },
    },
  ],
}