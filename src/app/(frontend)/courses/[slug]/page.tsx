import type { Metadata } from 'next'

// import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Post } from '@/payload-types'

import AcademicPathSlider from '@/components/Home/academic-path-slider'
import Footer from '@/components/Home/footer'
import FooterForm from '@/components/Home/footer-form'
import { SecondaryHeader } from '../components/SecondaryHeader'

import { CourseHero } from '@/heros/CourseHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

import ModalPopup from '@/components/Courses/ModalForm'
import './coursedetail.css'


export async function generateStaticParams() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({
    collection: 'courses',
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: {
      slug: true,
    },
  })

  const params = posts.docs.map(({ slug }) => {
    return { slug }
  })

  return params
}

type Args = {
  params: Promise<{
    slug?: string
  }>
}

const queryCoursesByUniversityId = cache(async ({ universityId }: { universityId: number }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'courses',
    draft,
    limit: 1000, // or whatever limit you need
    overrideAccess: draft,
    pagination: false,
    where: {
      university: {
        in: [universityId],
      },
    },
  })
  return result.docs || []
})

const studyAreas = [
  { id: '1', name: 'Pre University', slug: 'pre-university' },
  { id: '2', name: 'Law', slug: 'law' },
  { id: '3', name: 'Business', slug: 'business' },
  { id: '4', name: 'Digital & Creative Communications', slug: 'digital-creative-communications' },
  { id: '5', name: 'Digital Technology', slug: 'digital-technology' },
  { id: '6', name: 'Education', slug: 'education' },
  { id: '7', name: 'Psychology', slug: 'psychology' },
]

export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const url = '/courses/' + slug
  const course = await queryPostBySlug({ slug })

  if (!course) return <PayloadRedirects url={url} />
  console.log(course)
  // Get university ID from the course
  const universityId = typeof course.university === 'object' ? course.university.id : null

  // Query related courses from the same university
  const universityCourses = universityId ? await queryCoursesByUniversityId({ universityId }) : []
  return (
    <article className="single-course" data-attr="kr">
      <PageClient />

      {/* Allows redirects for valid pages too */}
      <PayloadRedirects disableNotFound url={url} />

      {draft && <LivePreviewListener />}
      <SecondaryHeader studyAreas={studyAreas} />
      <CourseHero post={course} />

      <div className="coursecontainer">
        <RichText className="max-w-[100rem] mx-auto" data={course.content} enableGutter={false} />
        <AcademicPathSlider />

        {/* {post.relatedPosts && post.relatedPosts.length > 0 && (
            <RelatedPosts
              className="mt-12 max-w-[52rem] lg:grid lg:grid-cols-subgrid col-start-1 col-span-3 grid-rows-[2fr]"
              docs={post.relatedPosts.filter((post) => typeof post === 'object')}
            />
          )} */}
      </div>
      <FooterForm/>
      <Footer />
      <ModalPopup />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const post = await queryPostBySlug({ slug })

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'courses',
    draft,
    limit: 1,
    overrideAccess: draft,
    pagination: false,
    where: {
      slug: {
        equals: slug,
      },
    },
  })

  return result.docs?.[0] || null
})
