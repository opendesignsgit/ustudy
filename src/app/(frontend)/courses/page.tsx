import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const courses = await payload.find({
    collection: 'courses',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1>Courses</h1>
        </div>
      </div>

      <div className="container mb-8">
        <PageRange
          collection="courses"
          currentPage={courses.page}
          limit={12}
          totalDocs={courses.totalDocs}
        />
      </div>

      <CollectionArchive posts={courses.docs} />

      <div className="container">
        {courses.totalPages > 1 && courses.page && (
          <Pagination page={courses.page} totalPages={courses.totalPages} />
        )}
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Payload Website Template Posts`,
  }
}
