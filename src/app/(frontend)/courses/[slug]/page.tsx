import type { Metadata } from 'next'

// import { RelatedPosts } from '@/blocks/RelatedPosts/Component'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { draftMode } from 'next/headers'
import React, { cache } from 'react'
import RichText from '@/components/RichText'

import type { Course } from '@/payload-types'
import type { PaginatedDocs } from 'payload'

import Footer from '@/components/Home/footer'
import FooterForm from '@/components/Home/footer-form'

import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { LivePreviewListener } from '@/components/LivePreviewListener'

import AcademicPathSlider from '@/components/Home/academic-path-slider'
import { SecondaryHeader } from '../components/SecondaryHeader'
import { CourseHero } from '@/heros/CourseHero'
import ModalPopup from '@/components/Courses/ModalForm'
import './coursedetail.css'
import { RegisterFlow } from '../components/Register/RegisterFlow'
import { RazorpayScriptLoader } from '../components/Register/RazorpayScriptLoader'

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
interface UniversityCoursesResponse extends PaginatedDocs<Course> {
  filterOptions?: {
    studyAreas: Array<{ id: string | number; name?: string; title?: string }>
  }
}

// Then modify the queryCoursesByUniversityId function to include study areas
const queryCoursesByUniversityId = cache(async ({ universityId }: { universityId: number }): Promise<UniversityCoursesResponse> => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'courses',
    depth: 3,
    draft,
    limit: 1000,
    overrideAccess: draft,
    pagination: true,
    where: {
      university: {
        in: [universityId],
      },
    },
  })

  // Extract unique study areas from the courses
  const studyAreas = new Map<string | number, { id: string | number; name?: string; title?: string }>()

  result.docs.forEach(course => {
    if (course.studyArea) {
      const studyAreasToProcess = Array.isArray(course.studyArea) ? course.studyArea : [course.studyArea]

      studyAreasToProcess.forEach(area => {
        if (area && typeof area === 'object') {
          studyAreas.set(area.id, {
            id: area.id,
            name: area.name || area.title || String(area.id)
          })
        }
      })
    }

  })

  return {
    ...result,
    filterOptions: {
      studyAreas: Array.from(studyAreas.values())
    }
  }
})




export default async function Post({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = '' } = await paramsPromise
  const url = '/courses/' + slug
  const course = await queryPostBySlug({ slug })

  if (!course) return <PayloadRedirects url={url} />

  const universityId = typeof course.university === 'object' ? course.university.id : course.university;
  const universityCourses = universityId ? await queryCoursesByUniversityId({ universityId }) : []
  console.log(universityCourses);

  const universityLogo = typeof course.university === 'object' &&
    course.university.logo &&
    typeof course.university.logo === 'object'
    ? course.university.logo.url
    : null;


  return (
    <RazorpayScriptLoader>

      <article className="single-course" data-attr="kr">
        <PageClient />

        {/* Allows redirects for valid pages too */}
        <PayloadRedirects disableNotFound url={url} />

        {draft && <LivePreviewListener />}
        <SecondaryHeader
          studyAreas={
            Array.isArray(universityCourses)
              ? []
              : universityCourses.filterOptions?.studyAreas?.map(area => ({
                id: area.id,
                name: area.name || area.title || String(area.id)
              })) || []
          }
          logo={universityLogo}
          university={
            typeof course.university === 'object'
              ? {
                title: course.university.title,
                name: course.university.title,
                slug: course.university.slug || '',  // fallback to empty string
              }
              : undefined
          }

        />

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
        <FooterForm />
        <Footer />
        <ModalPopup />
        <RegisterFlow pageId={course.id} />
      </article>
    </RazorpayScriptLoader >
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = '' } = await paramsPromise
  const post = await queryPostBySlug({ slug })

  if (!post) {
    return {
      title: 'Not found',
      description: 'Course not found',
    }
  }

  return generateMeta({ doc: post })
}

const queryPostBySlug = cache(async ({ slug }: { slug: string }): Promise<Course | null> => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'courses',
    depth: 3,
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
