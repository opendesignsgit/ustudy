import { Block } from 'payload';

export const RegisterFormBlock: Block = {
  slug: 'registerFormBlock',
  interfaceName: 'RegisterFormBlock',
  fields: [
    {
      name: 'formTitle',
      type: 'text',
      required: true,
      label: 'Form Title',
    },
    {
      name: 'termslink',
      type: 'text',
      required: true,
      label: 'Terms & Conditions Page Link',
    },
  ],
};
