import type { CollectionConfig } from 'payload';

import { authenticated } from '../../access/authenticated';
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished';
import { createRoleBasedAccess, createRoleBasedFilter, createRoleBasedAdminAccess } from '../../access/roleBasedAccess';
import { generatePreviewPath } from '../../utilities/generatePreviewPath';
import { populateAuthors } from './hooks/populateAuthors';
import { revalidateDelete, revalidatePost } from './hooks/revalidatePost';

export const Bookings: CollectionConfig = {
  slug: 'bookings',
  labels: {
    singular: 'Enrollment',
    plural: 'Enrollments',
  },
  access: {
    create: createRoleBasedAccess('bookings', 'create'),
    delete: createRoleBasedAccess('bookings', 'delete'),
    read: createRoleBasedFilter('bookings'),
    update: createRoleBasedAccess('bookings', 'update'),
    admin: createRoleBasedAdminAccess('bookings'),
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
      useAsTitle: 'id',
  },
  fields: [
    {
      name: 'course',
      type: 'relationship',
      relationTo: 'courses',
      required: true,
      label: 'Enrolled Course',
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
      label: 'Date Of Enrollment',
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
    {
      name: 'bookingStatus',
      type: 'select',
      label: 'Booking Status',
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Completed', value: 'completed' },
        { label: 'Failed', value: 'failed' },
        { label: 'Cancelled', value: 'cancelled' },
      ],
      defaultValue: 'completed',
      required: true,
      admin: {
        description: 'Set the status of the booking (like WooCommerce orders)',
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