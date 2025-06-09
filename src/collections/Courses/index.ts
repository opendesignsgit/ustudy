import type { CollectionConfig } from 'payload'
import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
  OrderedListFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Banner } from '@/blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { SliderBlock } from '@/blocks/SliderBlock/config'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'
import { populateAuthors } from './hooks/populateAuthors'
import { revalidateDelete, revalidatePost } from './hooks/revalidatePost'
// import { withFiltersEndpoint } from '../endpoints/withFilters'
import { addFilterOptions } from './hooks/afterOperation'
import { YearlyCourses } from '@/blocks/CoursesComponents/YearsModule/config'
import { RegisterFormBlock } from '@/blocks/RegisterForm/config'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from '@/fields/slug'

const SimpleHiddenCollection = (slug: string): CollectionConfig => ({
  slug,
  access: {
    read: () => true,
  },
  admin: {
    hidden: true,
    useAsTitle: 'name', // or 'title' depending on your preference
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      required: false,
      label: 'Image',
    },
    ...slugField(),
  ],
})

export const IntakeMonths: CollectionConfig = SimpleHiddenCollection('intake-months')
export const StudyModes: CollectionConfig = SimpleHiddenCollection('study-modes')
export const StudyYears: CollectionConfig = SimpleHiddenCollection('study-years')
export const StudyAreas: CollectionConfig = SimpleHiddenCollection('study-areas')
export const Departments: CollectionConfig = SimpleHiddenCollection('departments')
export const DegreePrograms: CollectionConfig = SimpleHiddenCollection('degree-programs')

export const Courses: CollectionConfig<'courses'> = {
  slug: 'courses',
  // endpoints: [withFiltersEndpoint],
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    meta: {
      image: true,
      description: true,
    },
  },
  admin: {
    group: 'Universities',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          collection: 'courses',
          req,
        })

        return path
      },
    },
    preview: (data, { req }) =>
      generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        collection: 'courses',
        req,
      }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
            },
            {
              name: 'content',
              type: 'richText',
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }),
                    BlocksFeature({
                      blocks: [
                        Banner,
                        Code,
                        MediaBlock,
                        CallToAction,
                        Content,
                        Archive,
                        FormBlock,
                        SliderBlock,
                        YearlyCourses,
                        RegisterFormBlock,
                      ],
                    }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                    OrderedListFeature(),
                    UnorderedListFeature(),
                  ]
                },
              }),
              label: false,
              required: true,
            },
          ],
          label: 'Content',
        },
        {
          fields: [
            {
              name: 'university',
              type: 'relationship',
              relationTo: 'universities',
              required: true,
            },
            {
              name: 'subUniversity',
              type: 'relationship',
              relationTo: 'universities',
              required: false,
              label: 'Sub University',
            },
            {
              name: 'degreeProgram',
              label: 'Degree Program',
              type: 'relationship',
              relationTo: 'degree-programs',
              required: false,
            },
            {
              name: 'department',
              label: 'Department',
              type: 'relationship',
              relationTo: 'departments',
              required: false,
            },
            {
              name: 'studyArea',
              label: 'Study Area',
              type: 'relationship',
              relationTo: 'study-areas',
              required: false,
            },
            {
              name: 'studyYear',
              label: 'Study Duration',
              type: 'relationship',
              relationTo: 'study-years',
              required: false,
            },
            {
              name: 'studyMode',
              label: 'Study Mode',
              type: 'relationship',
              relationTo: 'study-modes',
              required: false,
            },
            {
              name: 'intakeMonths',
              label: 'Intake Months',
              type: 'relationship',
              relationTo: 'intake-months',
              hasMany: true,
              required: false,
            },
            {
              name: 'programmeAccreditationCode',
              type: 'text',
            },
            {
              name: 'pathway',
              type: 'text',
            },
            {
              name: 'assessments',
              type: 'text',
            },
            {
              name: 'fees',
              type: 'array',
              label: 'Fees',
              fields: [
                {
                  name: 'feeName',
                  type: 'text',
                  label: 'Fee Name',
                  required: true,
                },
                {
                  name: 'feeAmount',
                  type: 'number',
                  label: 'Fee Amount',
                  required: true,
                },
              ],
            },
            
          ],
          label: 'Meta',
        },

        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'authors',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: 'users',
    },
    ...slugField(),
  ],
  hooks: {
    afterChange: [revalidatePost],
    afterRead: [populateAuthors],
    afterDelete: [revalidateDelete],
    afterOperation: [addFilterOptions],
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
}
