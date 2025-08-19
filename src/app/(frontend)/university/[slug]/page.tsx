import React from 'react'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'
import configPromise from '@payload-config'
import { getPayload } from 'payload'

type Args = {
  params: Promise<{
    slug?: string
  }>
}

// This route handles university sub-pages like /university/about-us
export default async function UniversitySubPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  
  try {
    const payload = await getPayload({ config: configPromise })
    
    // Look for university pages with matching slug
    const pages = await payload.find({
      collection: 'university-pages',
      where: {
        slug: {
          equals: slug,
        },
        _status: {
          equals: 'published',
        },
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
          <div className="max-w-4xl mx-auto px-4 text-center">
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
      </article>
    )
  } catch (error) {
    console.error('Error fetching university page:', error)
    return notFound()
  }
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  
  try {
    const payload = await getPayload({ config: configPromise })
    
    const pages = await payload.find({
      collection: 'university-pages',
      where: {
        slug: {
          equals: slug,
        },
        _status: {
          equals: 'published',
        },
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
      title: page.title,
      description: page.description || page.title,
    }
  } catch (error) {
    return {
      title: 'Page Not Found',
    }
  }
}