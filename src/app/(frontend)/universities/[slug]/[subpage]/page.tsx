import React from 'react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

type Args = {
  params: Promise<{
    slug?: string
    subpage?: string
  }>
}

// This route handles university sub-pages like /universities/harvard/about-us
export default async function UniversitySubPage({ params: paramsPromise }: Args) {
  const { slug = '', subpage = '' } = await paramsPromise
  
  if (!slug || !subpage) {
    return notFound()
  }
  
  try {
    const payload = await getPayload({ config: configPromise })
    
    // First, verify the university exists
    const universities = await payload.find({
      collection: 'universities',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
    })

    if (!universities.docs || universities.docs.length === 0) {
      return notFound()
    }

    const university = universities.docs[0]
    
    // Look for university pages with matching slug for this university
    const pages = await payload.find({
      collection: 'university-pages',
      where: {
        and: [
          {
            slug: {
              equals: subpage,
            },
          },
          {
            university: {
              equals: university.id,
            },
          },
          {
            _status: {
              equals: 'published',
            },
          },
        ],
      },
      limit: 1,
    })

    if (!pages.docs || pages.docs.length === 0) {
      return notFound()
    }

    const page = pages.docs[0]

    return (
      <article className="pt-16 pb-24">
        {/* Page Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
          <div className="max-w-4xl mx-auto px-4">
            {/* University branding */}
            <div className="flex items-center mb-4">
              {university.logo && typeof university.logo === 'object' && (
                <img
                  src={university.logo.url || `/api/media/file/${university.logo.filename}`}
                  alt={university.title}
                  className="h-8 w-auto mr-3"
                />
              )}
              <span className="text-lg opacity-90">{university.title}</span>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
            {page.description && (
              <p className="text-xl opacity-90">{page.description}</p>
            )}
          </div>
        </div>

        {/* Page Content */}
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content || '' }}
          />
        </div>

        {/* University Navigation */}
        <div className="bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <h3 className="text-lg font-semibold mb-4">More about {university.title}</h3>
            <div className="flex flex-wrap gap-4">
              <a
                href={`/universities/${university.slug}`}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                University Home
              </a>
              {/* We can add links to other pages here later */}
            </div>
          </div>
        </div>
      </article>
    )
  } catch (error) {
    console.error('Error fetching university sub-page:', error)
    return notFound()
  }
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '', subpage = '' } = await paramsPromise
  
  try {
    const payload = await getPayload({ config: configPromise })
    
    // Find the university
    const universities = await payload.find({
      collection: 'universities',
      where: {
        slug: {
          equals: slug,
        },
      },
      limit: 1,
    })

    if (!universities.docs || universities.docs.length === 0) {
      return {
        title: 'Page Not Found',
      }
    }

    const university = universities.docs[0]
    
    // Find the page
    const pages = await payload.find({
      collection: 'university-pages',
      where: {
        and: [
          {
            slug: {
              equals: subpage,
            },
          },
          {
            university: {
              equals: university.id,
            },
          },
        ],
      },
      limit: 1,
    })

    if (!pages.docs || pages.docs.length === 0) {
      return {
        title: 'Page Not Found',
      }
    }

    const page = pages.docs[0]

    return {
      title: `${page.title} - ${university.title}`,
      description: page.description || `${page.title} at ${university.title}`,
    }
  } catch (error) {
    return {
      title: 'Page Not Found',
    }
  }
}