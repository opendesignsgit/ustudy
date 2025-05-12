import type { Metadata } from 'next/types'
import { CollectionArchiveCourses } from '@/components/CollectionArchiveCourses'
import { PageRange } from '@/components/PageRange'
import { Pagination } from '@/components/Pagination'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import PageClient from './page.client'
import Image from 'next/image'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })
  const initialLimit = 5 // Default limit for initial load

  const initialCourses = await payload.find({
    collection: 'courses',
    depth: 3, // Changed from 1 to 3 to properly populate nested relationships
    limit: initialLimit,
    overrideAccess: false,
  })

  return (
    <div>
      <div className="couresList">
        <section className="inerpageban servbansec relative">
          <div className="inpbanimg relative">
            <img src="/media/innerbanimg.jpg" alt="Services" />
          </div>
          <div className="inpbancont absolute top-0 left-0 w-full h-full z-10">
            <div className="container relative h-full flex flex-col items-center justify-center text-center">
              <h1 className="ffamilyTNR">Discover Your Academic Path</h1>
              <p className="fonteighteen">
                Explore diverse fields of study and find the perfect program that matches <br />
                your passion and career goals, equipping you with the skills and <br />
                knowledge to thrive in a competitive global landscape.
              </p>
            </div>
          </div>
        </section>
        <PageClient
          initialCourses={{
            docs: initialCourses.docs || [],
            totalDocs: initialCourses.totalDocs || 0,
            totalPages: initialCourses.totalPages || 1,
            page: initialCourses.page || 1,
          }}
          defaultLimit={initialLimit}
        />
      </div>
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Ktec Ustudy Academy - All Courses Page`,
  }
}
//final
