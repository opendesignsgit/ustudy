import React from 'react'
import { draftMode } from 'next/headers'
import { notFound } from 'next/navigation'

import type { University, UniversityPage } from '@/payload-types'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'

import Footer from '@/components/Home/footer'
import '../../university-content.css'

export async function generateStaticParams() {
  // Return empty array to allow dynamic generation
  return []
}

type Args = {
  params: Promise<{
    slug?: string
    pageSlug?: string
  }>
}

export default async function UniversitySubPage({ params: paramsPromise }: Args) {
  const { slug = '', pageSlug = '' } = await paramsPromise
  
  // First get the university
  const university = await queryUniversityBySlug({ slug })
  if (!university) {
    return notFound()
  }

  // Then get the specific page
  const page = await queryUniversityPageBySlug({ 
    universityId: university.id, 
    slug: pageSlug 
  })
  
  if (!page) {
    return notFound()
  }

  return (
    <article className="pt-16 pb-24">
      {/* University Header */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            {university.logo && typeof university.logo === 'object' && (
              <img
                src={university.logo.url || `/api/media/file/${university.logo.filename}`}
                alt={university.title}
                className="h-8 w-auto"
              />
            )}
            <div>
              <h1 className="text-xl font-bold text-gray-900">{university.title}</h1>
              <p className="text-sm text-gray-600">{page.title}</p>
            </div>
          </div>
          
          {/* Navigation breadcrumb */}
          <nav className="mt-4">
            <ol className="flex items-center space-x-2 text-sm">
              <li>
                <a href={`/universities/${university.slug}`} className="text-blue-600 hover:text-blue-800">
                  {university.title}
                </a>
              </li>
              <li className="text-gray-500">/</li>
              <li className="text-gray-900">{page.title}</li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Render page hero if exists */}
        {page.hero && <RenderHero {...page.hero} />}
        
        {/* Render page layout blocks */}
        {page.layout && <RenderBlocks blocks={page.layout} />}
      </div>
      
      <Footer />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args) {
  const { slug = '', pageSlug = '' } = await paramsPromise
  
  const university = await queryUniversityBySlug({ slug })
  if (!university) return {}
  
  const page = await queryUniversityPageBySlug({ 
    universityId: university.id, 
    slug: pageSlug 
  })
  
  if (!page) return {}

  return generateMeta({
    title: `${page.title} | ${university.title}`,
    description: page.meta?.description || `${page.title} page for ${university.title}`,
    image: page.meta?.image,
  })
}

const queryUniversityBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: isDraftMode } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'universities',
    limit: 1,
    where: {
      slug: {
        equals: slug,
      },
    },
    draft: isDraftMode,
  })

  return result.docs?.[0] || null
})

const queryUniversityPageBySlug = cache(async ({ 
  universityId, 
  slug 
}: { 
  universityId: string | number
  slug: string 
}) => {
  const { isEnabled: isDraftMode } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'university-pages',
    limit: 1,
    where: {
      and: [
        {
          university: {
            equals: universityId,
          },
        },
        {
          slug: {
            equals: slug,
          },
        },
        {
          published: {
            equals: true,
          },
        },
      ],
    },
    draft: isDraftMode,
  })

  return result.docs?.[0] || null
})