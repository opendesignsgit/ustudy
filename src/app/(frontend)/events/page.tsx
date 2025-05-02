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

  const events = await payload.find({
    collection: 'events',
    depth: 1,
    limit: 12,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
      heroImage: true,
      externalLink: true,
      eventfrom: true,
      eventto: true,
    },
  })

  return (
    <div className="pt-24 pb-24 events">
      <PageClient />
      <div className="container mb-16">
        <div className="prose dark:prose-invert max-w-none">
          <h1 className="mt-0 mb-0 text-[60px] font-medium leading-[76.8px] font-[Biennale,_sans-serif] tracking-[-0.6px] text-[rgb(0,_0,_0)] pt-[25px] bg-[rgb(255,_255,_255)] m-0 text-center">All Events</h1>
        </div>
      </div>

      {/* <div className="container mb-8">
        <PageRange
          collection="events"
          currentPage={events.page}
          limit={12}
          totalDocs={events.totalDocs}
        />
      </div> */}

      <CollectionArchive posts={events.docs} relationTo="events" customClass="eventsArchieve" numberOfCol={3} />
      

      <div className="container">
        {events.totalPages > 1 && events.page && (
          <Pagination page={events.page} totalPages={events.totalPages} />
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
