import type { CollectionConfig } from 'payload';

export const Currencies: CollectionConfig = {
  slug: 'currencies',
    admin: {
    group: 'Universities',
    useAsTitle: 'currencyName',
  },
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
    {
      name: 'isActive',
      type: 'checkbox',
      label: 'Is Active',
      defaultValue: true,
    },
  ],
};