import type { Block } from 'payload'

export const UniversityAbout: Block = {
  slug: 'university-about',
  interfaceName: 'UniversityAboutBlock',
  labels: {
    singular: 'University About',
    plural: 'University About Sections',
  },
  fields: [
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'side-by-side',
      options: [
        { label: 'Side by Side', value: 'side-by-side' },
        { label: 'Image Top', value: 'image-top' },
        { label: 'Text Only', value: 'text-only' },
        { label: 'Centered', value: 'centered' },
      ],
      required: true,
    },
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Section Title',
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      label: 'About Content',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: 'About Image',
    },
    {
      name: 'stats',
      type: 'array',
      maxRows: 4,
      fields: [
        {
          name: 'number',
          type: 'text',
          required: true,
          label: 'Statistic Number',
        },
        {
          name: 'label',
          type: 'text',
          required: true,
          label: 'Statistic Label',
        },
        {
          name: 'description',
          type: 'text',
          label: 'Description (optional)',
        },
      ],
    },
  ],
}