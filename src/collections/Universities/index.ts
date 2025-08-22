//src\collections\Universities\index.ts
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

import { canAccessOwnUniversity } from '../../access/canAccessOwnUniversity'
import { isAdminOrUniversityUser } from '../../access/isUniversityUser'
import { Banner } from '@/blocks/Banner/config'
import { Code } from '../../blocks/Code/config'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Content } from '../../blocks/Content/config'
import { FormBlock } from '../../blocks/Form/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { SliderBlock } from '@/blocks/SliderBlock/config'
import { YearlyCourses } from '@/blocks/CoursesComponents/YearsModule/config'
import { RegisterFormBlock } from '@/blocks/RegisterForm/config'
import { UniversityHero, UniversityAbout, UniversityPrograms, UniversityContact } from '@/blocks/UniversityTemplateBlocks'
import { slugField } from '@/fields/slug'

export const Universities: CollectionConfig = {
  slug: 'universities',
  access: {
    create: () => true, // Allow registration
    delete: canAccessOwnUniversity,
    read: () => true, // Publicly readable
    update: canAccessOwnUniversity,
  },
  admin: {
    group: 'Universities',
    defaultColumns: ['title', 'email', 'phone', 'country', 'updatedAt'],
    useAsTitle: 'title',
    livePreview: {
      url: ({ data }) => {
        const slug = typeof data?.slug === 'string' ? data.slug : ''
        if (slug) {
          return `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/university/${slug}`
        }
        return ''
      },
    },
    preview: (data) => {
      const slug = typeof data?.slug === 'string' ? data.slug : ''
      if (slug) {
        return `${process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'}/university/${slug}`
      }
      return ''
    },
  },
  auth: true, // Enable authentication for universities
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      label: 'University Name',
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
      unique: true,
      label: 'Phone Number',
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true, // Make email unique
      label: 'Contact Email',
      access: {
        // Make email read-only for university-role users and universities collection users
        update: ({ req: { user } }) => {
          // Allow admin to update email
          if (user?.collection === 'users' && (user as any)?.role === 'admin') {
            return true
          }
          // Make read-only for university-role users and universities collection users
          return false
        },
      },
      admin: {
        description: 'Email is read-only as it serves as the unique identifier for login.',
      },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Basic Information',
          fields: [
            {
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'University Logo',
            },
            {
              name: 'secondaryLogo',
              type: 'upload',
              relationTo: 'media',
              required: false,
              label: 'Secondary Logo',
            },
            {
              name: 'universityImage',
              type: 'upload',
              relationTo: 'media',
              required: false,
              label: 'University Image',
            },
            {
              name: 'country',
              type: 'relationship',
              relationTo: 'countries', // Link to countries collection
              required: true,
              label: 'Country',
            },
            {
              name: 'template',
              type: 'relationship',
              relationTo: 'university-templates',
              required: false,
              label: 'University Template',
              admin: {
                description: 'Select a template for your university website layout',
              },
            },
            {
              name: 'websiteUrl',
              type: 'text',
              label: 'Website URL',
              required: false,
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'University Description',
            },
            {
              name: 'isActive',
              type: 'checkbox',
              label: 'Active',
              defaultValue: true,
              admin: {
                description: 'Inactive universities cannot login',
              },
            },
          ],
        },
        {
          label: 'Content',
          fields: [
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
                        UniversityHero,
                        UniversityAbout,
                        UniversityPrograms,
                        UniversityContact,
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
              label: 'University Content',
              admin: {
                description: 'Content will be filled based on the selected template layout',
              },
            },
          ],
        },
      ],
    },
    ...slugField(),
  ],
  hooks: {
    beforeLogin: [
      async ({ req, user }) => {
        if (user && user.isActive === false) {
          throw new Error('Your university account is inactive. Please contact support.');
        }
        return user;
      },
    ],
    beforeChange: [
      async ({ data, req, operation }) => {
        // Create corresponding university-role user when university is created
        if (operation === 'create' && req.payload) {
          try {
            // Create a university-role user for this university
            const universityUser = await req.payload.create({
              collection: 'users',
              data: {
                name: data.title,
                email: data.email,
                role: 'university-role',
                // We'll associate the university after creation
              },
            })
            
            // Store the user ID to associate later in afterChange hook
            data._universityUserId = universityUser.id
          } catch (error) {
            console.error('Error creating university user:', error)
            throw new Error('Failed to create university user account. Please try again.')
          }
        }

        // Validate country relationship if it exists
        if (data.country !== null && data.country !== undefined && data.country !== '') {
          // Clean up the country value
          let countryId = data.country;
          
          // Handle object format
          if (typeof data.country === 'object' && data.country.id) {
            countryId = data.country.id;
          }
          
          // Convert to string and clean up
          countryId = String(countryId).trim();
          
          // Check for invalid formats with spaces or multiple values
          if (countryId.includes(' ')) {
            // If it looks like "2 0", take the first valid number
            const firstNumber = countryId.split(' ')[0];
            if (/^\d+$/.test(firstNumber)) {
              countryId = firstNumber;
              data.country = countryId;
            } else {
              throw new Error('Invalid country selection. Please choose a valid country from the dropdown.');
            }
          }
          
          // Ensure countryId is a valid number
          if (!/^\d+$/.test(countryId)) {
            throw new Error('Invalid country format. Please select a country from the dropdown.');
          }
          
          // Convert to number for validation
          const countryIdNum = parseInt(countryId);
          if (countryIdNum === 0 || isNaN(countryIdNum)) {
            throw new Error('Invalid country selected. Please choose a valid country.');
          }
          
          // Update the data with cleaned value
          data.country = countryIdNum;
          
          // If we have a payload instance, verify the country exists
          if (req.payload && countryIdNum) {
            try {
              const country = await req.payload.findByID({
                collection: 'countries',
                id: countryIdNum,
              });
              if (!country) {
                throw new Error('Selected country does not exist. Please choose a valid country.');
              }
            } catch (error) {
              console.error('Country validation error:', error);
              throw new Error('Selected country is invalid. Please choose a valid country.');
            }
          }
        }
        
        return data;
      },
    ],
    afterChange: [
      async ({ doc, req, operation }) => {
        // Associate the created user with this university
        if (operation === 'create' && doc._universityUserId && req.payload) {
          try {
            await req.payload.update({
              collection: 'users',
              id: doc._universityUserId,
              data: {
                university: doc.id,
              },
            })
          } catch (error) {
            console.error('Error associating university with user:', error)
            // Don't throw here as the university was already created
          }
        }
      },
    ],
  },
  timestamps: true,
}