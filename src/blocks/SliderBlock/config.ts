import type { Block } from 'payload'

export const SliderBlock: Block = {
  slug: 'slider',
  fields: [
    {
      name: 'sliderType',
      type: 'radio',
      options: [
        {
          label: 'Manual Items',
          value: 'manual',
        },
        {
          label: 'Select from Collection',
          value: 'collection',
        },
      ],
      defaultValue: 'manual',
      required: true,
      admin: {
        layout: 'horizontal',
      },
    },
    {
      name: 'manualItems',
      type: 'array',
      label: 'Slider Items',
      labels: {
        singular: 'Item',
        plural: 'Items',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
      admin: {
        condition: (_, siblingData) => siblingData?.sliderType === 'manual',
      },
    },
    {
      name: 'collectionItems',
      type: 'relationship',
      relationTo: ['posts'], // Add your collection names here
      hasMany: true,
      admin: {
        condition: (_, siblingData) => siblingData?.sliderType === 'collection',
      },
    },
    {
      name: 'displayOptions',
      type: 'group',
      fields: [
        {
          name: 'autoplay',
          type: 'checkbox',
          label: 'Enable Autoplay',
        },
        {
          name: 'autoplaySpeed',
          type: 'number',
          label: 'Autoplay Speed (ms)',
          defaultValue: 3000,
          admin: {
            condition: (data) => data?.displayOptions?.autoplay === true,
          },
        },
        {
          name: 'showArrows',
          type: 'checkbox',
          label: 'Show Navigation Arrows',
          defaultValue: true,
        },
        {
          name: 'showDots',
          type: 'checkbox',
          label: 'Show Pagination Dots',
          defaultValue: true,
        },
      ],
    },
  ],
};