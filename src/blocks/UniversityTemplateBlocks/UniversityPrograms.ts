import type { Block } from 'payload'

export const UniversityPrograms: Block = {
  slug: 'university-programs',
  interfaceName: 'UniversityProgramsBlock',
  labels: {
    singular: 'University Programs',
    plural: 'University Programs Sections',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Section Title',
      defaultValue: 'Our Programs',
    },
    {
      name: 'subtitle',
      type: 'textarea',
      label: 'Section Subtitle',
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'grid',
      options: [
        { label: 'Grid', value: 'grid' },
        { label: 'List', value: 'list' },
        { label: 'Carousel', value: 'carousel' },
      ],
      required: true,
    },
    {
      name: 'programs',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'duration',
          type: 'text',
          label: 'Program Duration',
        },
        {
          name: 'level',
          type: 'select',
          options: [
            { label: 'Undergraduate', value: 'undergraduate' },
            { label: 'Graduate', value: 'graduate' },
            { label: 'Doctoral', value: 'doctoral' },
            { label: 'Certificate', value: 'certificate' },
          ],
        },
        {
          name: 'link',
          type: 'text',
          label: 'Program Link (optional)',
        },
      ],
    },
    {
      name: 'showAll',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show "View All Programs" button',
    },
    {
      name: 'allProgramsLink',
      type: 'text',
      label: 'All Programs Link',
      admin: {
        condition: (_, { showAll }) => showAll,
      },
    },
  ],
}