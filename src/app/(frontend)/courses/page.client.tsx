'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useState, useCallback } from 'react'
import { CollectionArchiveCourses } from '@/components/Courses/CollectionArchiveCourses'
import { PageRange } from '@/components/PageRange'
import { CoursesPagination } from '@/components/Courses/CoursesPagination'
import FiltersClient from './components/FiltersClient'
import CountryFlagSlider from './components/CountryFlagSlider'
import AppliedFilters from './components/AppliedFilters'
import { CoursesCard, CardPostData } from '@/components/Courses/CoursesCard'

type Course = CardPostData & {
  id: string
  title: string
  slug: string
  description?: string
  heroImage?: any
  university: {
    id: string
    title: string
    logo?: {
      url: string
    }
    country: {
      name: string
    }
    updatedAt: string
    createdAt: string
  }
  degreeProgram: { id: string | number; name?: string; title?: string } | null
  department: { id: string | number; name?: string; title?: string } | null
  studyArea: { id: string | number; name?: string; title?: string } | null
  studyYears: { id: string | number; name?: string; title?: string } | null
  studyMode: { id: string | number; name?: string; title?: string } | null
  intakeMonths?: string
  meta?: {
    image?: any
    description?: string
  }
  categories?: Array<{ title?: string }>
}

type CoursesResponse = {
  docs: Course[]
  totalDocs: number
  totalPages: number
  page: number
}

const PageClient = () => {
  const { setHeaderTheme } = useHeaderTheme()
  const [courses, setCourses] = useState<CoursesResponse>({
    docs: [],
    totalDocs: 0,
    totalPages: 1,
    page: 1,
  })
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(5)
  const [filters, setFilters] = useState({
    countries: [] as string[],
    universities: [] as string[],
    studyAreas: [] as string[],
    degreePrograms: [] as string[],
    departments: [] as string[],
    studyYears: [] as string[],
    studyModes: [] as string[],
  })
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false) // State for mobile filters

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])

  const fetchCourses = useCallback(
    async (
      page: number,
      limit: number,
      filters: {
        countries: string[]
        universities: string[]
        studyAreas: string[]
        degreePrograms: string[]
        departments: string[]
        studyYears: string[]
        studyModes: string[]
      },
    ) => {
      setIsLoading(true)
      try {
        const response = await fetch('/api/get-courses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page,
            limit,
            filters,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to fetch courses')
        }

        const data: CoursesResponse = await response.json()
        setCourses(data)
        setCurrentPage(page)
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  const fetchAllCourses = useCallback(async () => {
    try {
      const response = await fetch('/api/get-courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          limit: 5, // Adjust based on your expected maximum courses
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch all courses')
      }

      const data: CoursesResponse = await response.json()
      setAllCourses(data.docs)
    } catch (error) {
      console.error('Error fetching all courses:', error)
    }
  }, [])

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true)
      try {
        await Promise.all([fetchCourses(1, limit, filters), fetchAllCourses()])
      } catch (error) {
        console.error('Error fetching initial data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInitialData()
  }, [limit, fetchCourses, fetchAllCourses])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses(1, limit, filters)
    }, 300)

    return () => clearTimeout(timer)
  }, [filters, limit, fetchCourses])

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit)
  }, [])

  const handleFilterChange = useCallback(
    (newFilters: {
      countries: string[]
      universities: string[]
      studyAreas: string[]
      degreePrograms: string[]
      departments: string[]
      studyYears: string[]
      studyModes: string[]
    }) => {
      setFilters(newFilters)
    },
    [],
  )

  const handleRemoveFilter = useCallback(
    (filter: string) => {
      const updatedFilters = {
        countries: filters.countries.filter((item) => item !== filter),
        universities: filters.universities.filter((item) => item !== filter),
        studyAreas: filters.studyAreas.filter((item) => item !== filter),
        degreePrograms: filters.degreePrograms.filter((item) => item !== filter),
        departments: filters.departments.filter((item) => item !== filter),
        studyYears: filters.studyYears.filter((item) => item !== filter),
        studyModes: filters.studyModes.filter((item) => item !== filter),
      }
      setFilters(updatedFilters)
    },
    [filters],
  )

  const clearFilters = useCallback(() => {
    setFilters({
      countries: [],
      universities: [],
      studyAreas: [],
      degreePrograms: [],
      departments: [],
      studyYears: [],
      studyModes: [],
    })
  }, [])

  const appliedFilters = [
    ...filters.countries.map((c) => `Country: ${c}`),
    ...filters.universities.map((u) => `University: ${u}`),
    ...filters.degreePrograms.map((d) => `Program: ${d}`),
    ...filters.departments.map((d) => `Department: ${d}`),
    ...filters.studyAreas.map((s) => `Area: ${s}`),
    ...filters.studyYears.map((y) => `Years: ${y}`),
    ...filters.studyModes.map((m) => `Mode: ${m}`),
  ]
  console.log(allCourses);

  return (
    <div className="pt-24 pb-24 couresLInBox">
      <CountryFlagSlider />
      <section className="ListFilerSec">
        <div className="container mx-auto">
          {/* Mobile Filter Button - only visible on small screens */}

          <div className="ListFilerRow flex gap-8">
            <div className="mobfilterbtn md:hidden ">
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="flex px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Filters
              </button>
            </div>

            {/* Mobile Filters Overlay */}
            <div
              className={`mobfitflColLeft fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity duration-300 ${isMobileFiltersOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                } md:hidden`}
              onClick={() => setIsMobileFiltersOpen(false)}
            >
              <div
                className={`absolute left-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-lg transform transition-transform duration-300 ${isMobileFiltersOpen ? 'translate-x-0' : '-translate-x-full'
                  }`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-4 overflow-y-auto h-full">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold">Filters</h3>
                    <button
                      onClick={() => setIsMobileFiltersOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      ✕
                    </button>
                  </div>
                  <FiltersClient
                    filters={filters}
                    setFilters={setFilters}
                    courses={allCourses}
                    clearFilters={clearFilters}
                  />
                </div>
              </div>
            </div>


            {/* Desktop Filters - hidden on mobile */}
            <div className="FlistCol flColLeft w-1/4 hidden md:block">
              <FiltersClient
                filters={filters}
                setFilters={setFilters}
                courses={allCourses}
                clearFilters={clearFilters}
              />
            </div>

            <div className="FlistCol flColRight w-full md:w-3/4">
              <div className="listshowtopbox">
                <div className="flex justify-between items-center">
                  <PageRange
                    collection="courses"
                    currentPage={courses.page}
                    limit={limit}
                    totalDocs={courses.totalDocs}
                  />

                  <select
                    value={limit}
                    onChange={(e) => handleLimitChange(Number(e.target.value))}
                    className="px-3 py-1 border rounded"
                  >
                    <option value="5">5 per page</option>
                    <option value="12">12 per page</option>
                    <option value="24">24 per page</option>
                    <option value="48">48 per page</option>
                  </select>
                </div>

                {appliedFilters.length > 0 && (
                  <div className="">
                    <AppliedFilters
                      appliedFilters={appliedFilters}
                      onRemove={handleRemoveFilter}
                      onClear={clearFilters}
                    />
                  </div>
                )}
              </div>

              {isLoading ? (
                <div className="coursListBox">
                  {[...Array(limit)].map((_, i) => (
                    <div
                      key={i}
                      className="col-span-12 h-30 bg-gray-200 animate-pulse rounded"
                    ></div>
                  ))}
                </div>
              ) : (
                <CollectionArchiveCourses
                  courses={courses.docs as CardPostData[]}
                  numberOfCol={4}
                  relationTo="courses"
                  key={`courses-${currentPage}-${limit}-${JSON.stringify(filters)}`}
                />
              )}

              <div className="coursPaginBox">
                {courses.totalPages > 1 && courses.page && (
                  <CoursesPagination
                    page={currentPage}
                    totalPages={courses.totalPages}
                    onPageChange={(page) => fetchCourses(page, limit, filters)}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PageClient

//final
