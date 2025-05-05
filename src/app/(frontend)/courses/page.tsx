import CountryFlagSlider from "./components/CountryFlagSlider";
import FiltersClient from "./components/FiltersClient";
import CoursesPaginationClient from "./components/CoursesPaginationClient";

export const dynamic = "force-static";
export const revalidate = 600;

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const courses = await payload.find({
    collection: 'courses',
    depth: 1,
    limit: 7,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
  })
  console.log(courses);
  
  return (
    <div className="pt-24 pb-24">
      {/* Country Slider */}
      <CountryFlagSlider />

      <div className="container flex gap-8">
        {/* Sidebar */}
        <div className="w-1/4">
          <div className="bg-gray-100 rounded p-4">
            <h2 className="font-semibold mb-4">Filters</h2>
            {/* Countries Filter */}
            <FiltersClient />
          </div>
        </div>

        {/* Main Content */}
        <div className="w-3/4">
          <div className="mb-4 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold">76 List of Degrees</h2>
            </div>
          </div>

          <CoursesPaginationClient />
        </div>
      </div>
    </div>
  );
}