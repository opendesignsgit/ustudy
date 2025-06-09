import type { CollectionConfig } from 'payload';

import { authenticated } from '../../access/authenticated';
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished';
import { generatePreviewPath } from '../../utilities/generatePreviewPath';
import { populateAuthors } from './hooks/populateAuthors';
import { revalidateDelete, revalidatePost } from './hooks/revalidatePost';

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    course: true,
    customer: true,
  },
  admin: {
    group: 'Universities',
    defaultColumns: ['customer', 'course'],
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'bookings',
          req,
        });
        return path;
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'bookings',
        req,
      }),
    useAsTitle: 'student',
  },
  fields: [
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      label: 'Course Booked',
    },
    {
      name: 'student',
      type: 'relationship',
      relationTo: 'students', 
      required: true,
      label: 'Student',
    },
    {
      name: 'orderDate',
      type: 'date',
      required: true,
      label: 'Order Date',
      admin: {
        date: {
          pickerAppearance: 'dayOnly',
        },
      },
    },
    {
      name: 'originalAmount',
      type: 'number',
      label: 'Original Amount',
    },
    {
      name: 'convertedAmount',
      type: 'number',
      label: 'Amount Paid',
    },
    {
      name: 'currencyRate',
      type: 'number',
      label: 'Currency Rate',
    },
    {
      name: 'razorpayResponse',
      type: 'textarea',
      required: true,
      label: 'Razorpay Response Data',
      admin: {
        readOnly: true,
      },
    },
  ],
  hooks: {
    afterChange: [revalidatePost],
    afterRead: [populateAuthors],
    afterDelete: [revalidateDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
};