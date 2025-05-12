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
});

  return (
    <div>
      <div className="pt-24 pb-24 couresList">
        <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] mb-8">
        <Image
          src="/api/media/file/iact_area_dmcc_d-2083x1172.webp" // Replace with the actual path to the image
          alt="Academic Path Banner"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-blue-900 bg-opacity-50 flex justify-center items-center text-center text-white px-4">
          <div>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Discover Your Academic Path
            </h1>
            <p className="text-sm md:text-base">
              Explore diverse fields of study and find the perfect program that matches your passion and career goals, equipping you with the skills and knowledge to thrive in a competitive global landscape.
            </p>
          </div>
        </div>
      </div>
        <PageClient 
          initialCourses={{
            docs: initialCourses.docs || [],
            totalDocs: initialCourses.totalDocs || 0,
            totalPages: initialCourses.totalPages || 1,
            page: initialCourses.page || 1
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
