import React from 'react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

type Args = {
  params: Promise<{
    slug?: string
    path?: string[]
  }>
}

// This route handles university sub-pages with flexible nesting
// /universities/harvard/about-us (path = ['about-us'])
// /universities/harvard/academics/computer-science (path = ['academics', 'computer-science'])
export default async function UniversitySubPages({ params: paramsPromise }: Args) {
  const { slug = '', path = [] } = await paramsPromise
  
  if (!slug || path.length === 0) {
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
    
    // Handle different path structures
    if (path.length === 1) {
      // Single level: /universities/harvard/about-us
      return await renderSinglePage(university, path[0], payload)
    } else if (path.length === 2) {
      // Two levels: /universities/harvard/academics/computer-science
      return await renderNestedPage(university, path[0], path[1], payload)
    } else {
      // More than 2 levels not supported yet
      return notFound()
    }
  } catch (error) {
    console.error('Error fetching university sub-page:', error)
    return notFound()
  }
}

async function renderSinglePage(university: any, pageSlug: string, payload: any) {
  // Look for university pages with matching slug for this university
  const pages = await payload.find({
    collection: 'university-pages',
    where: {
      and: [
        {
          slug: {
            equals: pageSlug,
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
          </div>
        </div>
      </div>
    </article>
  )
}

async function renderNestedPage(university: any, parentSlug: string, childSlug: string, payload: any) {
  // Find the parent page
  const parentPages = await payload.find({
    collection: 'university-pages',
    where: {
      and: [
        {
          slug: {
            equals: parentSlug,
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

  if (!parentPages.docs || parentPages.docs.length === 0) {
    return notFound()
  }

  const parentPage = parentPages.docs[0]
  
  // Find the child page
  const childPages = await payload.find({
    collection: 'university-pages',
    where: {
      and: [
        {
          slug: {
            equals: childSlug,
          },
        },
        {
          university: {
            equals: university.id,
          },
        },
        {
          parent: {
            equals: parentPage.id,
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

  if (!childPages.docs || childPages.docs.length === 0) {
    return notFound()
  }

  const childPage = childPages.docs[0]

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
          
          {/* Breadcrumb navigation */}
          <div className="flex items-center text-sm opacity-75 mb-4">
            <a href={`/universities/${university.slug}`} className="hover:underline">
              {university.title}
            </a>
            <span className="mx-2">›</span>
            <a href={`/universities/${university.slug}/${parentSlug}`} className="hover:underline">
              {parentPage.title}
            </a>
            <span className="mx-2">›</span>
            <span>{childPage.title}</span>
          </div>
          
          <h1 className="text-4xl font-bold mb-4">{childPage.title}</h1>
          {childPage.description && (
            <p className="text-xl opacity-90">{childPage.description}</p>
          )}
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div 
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: childPage.content || '' }}
        />
      </div>

      {/* University Navigation */}
      <div className="bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h3 className="text-lg font-semibold mb-4">Navigation</h3>
          <div className="flex flex-wrap gap-4">
            <a
              href={`/universities/${university.slug}`}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              University Home
            </a>
            <a
              href={`/universities/${university.slug}/${parentSlug}`}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              {parentPage.title}
            </a>
          </div>
        </div>
      </div>
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '', path = [] } = await paramsPromise
  
  if (!slug || path.length === 0) {
    return {
      title: 'Page Not Found',
    }
  }

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
    
    if (path.length === 1) {
      // Single page
      const pages = await payload.find({
        collection: 'university-pages',
        where: {
          and: [
            {
              slug: {
                equals: path[0],
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

      if (pages.docs && pages.docs.length > 0) {
        const page = pages.docs[0]
        return {
          title: `${page.title} - ${university.title}`,
          description: page.description || `${page.title} at ${university.title}`,
        }
      }
    } else if (path.length === 2) {
      // Nested page
      const parentPages = await payload.find({
        collection: 'university-pages',
        where: {
          and: [
            {
              slug: {
                equals: path[0],
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

      if (parentPages.docs && parentPages.docs.length > 0) {
        const parentPage = parentPages.docs[0]
        
        const childPages = await payload.find({
          collection: 'university-pages',
          where: {
            and: [
              {
                slug: {
                  equals: path[1],
                },
              },
              {
                university: {
                  equals: university.id,
                },
              },
              {
                parent: {
                  equals: parentPage.id,
                },
              },
            ],
          },
          limit: 1,
        })

        if (childPages.docs && childPages.docs.length > 0) {
          const childPage = childPages.docs[0]
          return {
            title: `${childPage.title} - ${parentPage.title} - ${university.title}`,
            description: childPage.description || `${childPage.title} under ${parentPage.title} at ${university.title}`,
          }
        }
      }
    }

    return {
      title: 'Page Not Found',
    }
  } catch (error) {
    return {
      title: 'Page Not Found',
    }
  }
}