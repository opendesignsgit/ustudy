import type { Metadata } from 'next/types'

import { CollectionArchive } from '@/components/CollectionArchive'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import PageClient from './page.client'
import { log } from 'console'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const learninglab = await payload.find({
    collection: 'learning-lab',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      externalLink: true,
      heroImage: true,
      excerpt: true,
    },
  })

  return (
    <div className="pt-24 pb-24">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none text-center">
          <strong className="font-bold mb-0 text-[rgb(0,_0,_0)] text-[48px] m-0 text-center leading-[61.44px] tracking-[-0.48px] font-[Biennale,_sans-serif]">More stories from Learning Lab</strong>
        </div>
      </div>

      {/* <div className="container mb-8">
        <PageRange
          collection="learning-lab"
          currentPage={learninglab.page}
          limit={12}
          totalDocs={learninglab.totalDocs}
        />
      </div> */}

      <CollectionArchive posts={learninglab.docs} relationTo="learning-lab" numberOfCol={4}/>

      <div className="container">
        {learninglab.totalPages > 1 && learninglab.page && (
          <Pagination page={learninglab.page} totalPages={learninglab.totalPages} />
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
