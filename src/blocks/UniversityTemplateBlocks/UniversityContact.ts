import type { Block } from 'payload'

export const UniversityContact: Block = {
  slug: 'university-contact',
  interfaceName: 'UniversityContactBlock',
  labels: {
    singular: 'University Contact',
    plural: 'University Contact Sections',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'Section Title',
      defaultValue: 'Contact Us',
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'side-by-side',
      options: [
        { label: 'Side by Side', value: 'side-by-side' },
        { label: 'Contact Info Only', value: 'info-only' },
        { label: 'Form Only', value: 'form-only' },
        { label: 'Stacked', value: 'stacked' },
      ],
      required: true,
    },
    {
      name: 'contactInfo',
      type: 'group',
      fields: [
        {
          name: 'address',
          type: 'textarea',
          label: 'University Address',
        },
        {
          name: 'phone',
          type: 'text',
          label: 'Phone Number',
        },
        {
          name: 'email',
          type: 'email',
          label: 'Contact Email',
        },
        {
          name: 'website',
          type: 'text',
          label: 'Website URL',
        },
        {
          name: 'admissionsEmail',
          type: 'email',
          label: 'Admissions Email',
        },
        {
          name: 'admissionsPhone',
          type: 'text',
          label: 'Admissions Phone',
        },
      ],
    },
    {
      name: 'showContactForm',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show Contact Form',
    },
    {
      name: 'formFields',
      type: 'array',
      label: 'Custom Form Fields',
      admin: {
        condition: (_, { showContactForm }) => showContactForm,
      },
      fields: [
        {
          name: 'fieldType',
          type: 'select',
          required: true,
          options: [
            { label: 'Text', value: 'text' },
            { label: 'Email', value: 'email' },
            { label: 'Textarea', value: 'textarea' },
            { label: 'Select', value: 'select' },
          ],
        },
        {
          name: 'label',
          type: 'text',
          required: true,
        },
        {
          name: 'required',
          type: 'checkbox',
          defaultValue: false,
        },
        {
          name: 'placeholder',
          type: 'text',
        },
        {
          name: 'options',
          type: 'array',
          admin: {
            condition: (_, { fieldType }) => fieldType === 'select',
          },
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'value',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'socialLinks',
      type: 'array',
      maxRows: 6,
      fields: [
        {
          name: 'platform',
          type: 'select',
          required: true,
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Twitter', value: 'twitter' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'Instagram', value: 'instagram' },
            { label: 'YouTube', value: 'youtube' },
            { label: 'Other', value: 'other' },
          ],
        },
        {
          name: 'url',
          type: 'text',
          required: true,
        },
        {
          name: 'customLabel',
          type: 'text',
          admin: {
            condition: (_, { platform }) => platform === 'other',
          },
        },
      ],
    },
  ],
}