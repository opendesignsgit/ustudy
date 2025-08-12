import React from 'react'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import type { University } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import Footer from '@/components/Home/footer'

export async function generateStaticParams() {
  // Return empty array to allow dynamic generation
  // In production, this would query the database
  return []
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

export default async function UniversityPage({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const url = '/university/' + slug
  const university = await queryUniversityBySlug({ slug })

  if (!university) {
    return notFound()
  }

  return (
    <article className="pt-16 pb-24">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="absolute inset-0 bg-black opacity-50"></div>
        <div className="relative max-w-6xl mx-auto px-4 py-16">
          <div className="text-center">
            {university.logo && typeof university.logo === 'object' && (
              <div className="mb-6">
                <img
                  src={university.logo.url || `/api/media/file/${university.logo.filename}`}
                  alt={university.title}
                  className="h-24 w-auto mx-auto"
                />
              </div>
            )}
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {university.title}
            </h1>
            {university.description && (
              <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto">
                {university.description}
              </p>
            )}
            {university.websiteUrl && (
              <div className="mt-8">
                <a
                  href={university.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Visit Official Website
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* University Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        {university.content && Array.isArray(university.content) && university.content.length > 0 && (
          <RenderBlocks blocks={university.content as any} />
        )}
        
        {/* Default content if no custom content exists */}
        {(!university.content || !Array.isArray(university.content) || university.content.length === 0) && (
          <div className="prose prose-lg max-w-none">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">About {university.title}</h2>
                <p className="text-gray-600">
                  {university.description || 'Welcome to our university. We are committed to providing excellent education and fostering innovation.'}
                </p>
              </div>
              {university.universityImage && typeof university.universityImage === 'object' && (
                <div>
                  <img
                    src={university.universityImage.url || `/api/media/file/${university.universityImage.filename}`}
                    alt={university.title}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-6 mb-12">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Contact Information</h3>
                <div className="space-y-2">
                  <p className="text-gray-600">
                    <strong>Email:</strong> {university.email}
                  </p>
                  <p className="text-gray-600">
                    <strong>Phone:</strong> {university.phone}
                  </p>
                  {university.country && typeof university.country === 'object' && (
                    <p className="text-gray-600">
                      <strong>Country:</strong> {(university.country as any).title}
                    </p>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">Quick Links</h3>
                <div className="space-y-2">
                  {university.websiteUrl && (
                    <a
                      href={university.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-blue-600 hover:text-blue-800"
                    >
                      Official Website →
                    </a>
                  )}
                  <a href="/courses" className="block text-blue-600 hover:text-blue-800">
                    Browse Courses →
                  </a>
                  <a href="/register" className="block text-blue-600 hover:text-blue-800">
                    Apply Now →
                  </a>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-bold text-gray-900 mb-3">More Information</h3>
                <p className="text-gray-600 text-sm">
                  For detailed information about programs, admissions, and campus life, 
                  please visit our official website or contact us directly.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args) {
  const { slug = '' } = await paramsPromise
  const university = await queryUniversityBySlug({ slug })

  return generateMeta({
    doc: { 
      title: university?.title || 'University',
      meta: {
        description: university?.description || 'University information and programs'
      }
    } as any,
  })
}

const queryUniversityBySlug = cache(async ({ slug }: { slug: string }) => {
  try {
    const { isEnabled: draft } = await draftMode()
    const payload = await getPayload({ config: configPromise })

    const result = await payload.find({
      collection: 'universities',
      draft,
      limit: 1,
      overrideAccess: draft,
      where: {
        slug: {
          equals: slug,
        },
      },
    })

    return result.docs?.[0] || null
  } catch (error) {
    console.error('Database connection error:', error)
    // Return demo data if slug matches
    if (slug === 'demo-university') {
      return {
        id: 'demo-university',
        title: 'Demo University',
        slug: 'demo-university',
        email: 'contact@demouniversity.edu',
        phone: '+1-555-123-4567',
        websiteUrl: 'https://demouniversity.edu',
        description: 'A demonstration university showcasing the content management features.',
        content: null // Will use default content
      }
    }
    return null
  }
})