import CountryFlagSlider from "./components/CountryFlagSlider";
import FiltersClient from "./components/FiltersClient";
import CoursesPaginationClient from "./components/CoursesPaginationClient";

export const dynamic = "force-static";
export const revalidate = 600;

import configPromise from "@payload-config";
import { getPayload } from "payload";
import React from "react";
import Image from "next/image"; // Ensure this is imported

export default async function Page() {
  const payload = await getPayload({ config: configPromise });

  const courses = await payload.find({
    collection: "courses",
    depth: 1,
    limit: 7,
    overrideAccess: false,
    select: {
      title: true,
      slug: true,
      categories: true,
      meta: true,
    },
  });
  console.log(courses);

  return (
    <div className="pt-24 pb-24">
      {/* Banner Image */}
      <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] mb-8">
        <Image
          src="/path/to/banner-image.jpg" // Replace with the actual path to the image
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
          <CoursesPaginationClient />
        </div>
      </div>
    </div>
  );
}
//final