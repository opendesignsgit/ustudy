'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
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


interface FetchCoursesParams {
  page?: number
  limit?: number
  filters?: {
    countries?: string[]
    universities?: string[]
    studyAreas?: string[]
    degreePrograms?: string[]
    departments?: string[]
    studyYears?: string[]
    studyModes?: string[]
    searchQuery?: string
  }
  getAll?: boolean
}

type CoursesResponse = {
  docs: Course[]
  totalDocs: number
  totalPages: number
  page: number
}

const PageClient = () => {
  const { setHeaderTheme } = useHeaderTheme()
  const searchParams = useSearchParams() ?? new URLSearchParams()
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
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])

  // Initialize filters from URL params
  useEffect(() => {
    const initialFilters = {
      countries: searchParams.getAll('countries'),
      universities: searchParams.getAll('universities'),
      studyAreas: searchParams.getAll('studyAreas'),
      degreePrograms: searchParams.getAll('degreePrograms'),
      departments: searchParams.getAll('departments'),
      studyYears: searchParams.getAll('studyYears'),
      studyModes: searchParams.getAll('studyModes'),
    }
    setFilters(initialFilters)
  }, [searchParams])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()

    Object.entries(filters).forEach(([key, values]) => {
      if (values.length > 0) {
        values.forEach(value => params.append(key, value))
      }
    })

    const newUrl = `${window.location.pathname}?${params.toString()}`
    if (newUrl !== window.location.href) {
      window.history.pushState(null, '', newUrl)
    }
  }, [filters])

  const fetchCourses = useCallback(
    async (
      page: number,
      limit: number,
      filters: {
        countries?: string[]
        universities?: string[]
        studyAreas?: string[]
        degreePrograms?: string[]
        departments?: string[]
        studyYears?: string[]
        studyModes?: string[]
        searchQuery?: string
      },
      getAll: boolean = false
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
            countries: filters.countries || [],
            universities: filters.universities || [],
            degreePrograms: filters.degreePrograms || [],
            departments: filters.departments || [],
            studyAreas: filters.studyAreas || [],
            studyYears: filters.studyYears || [],
            studyModes: filters.studyModes || [],
            searchQuery: filters.searchQuery || '',
            getAll
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to fetch courses')
        }

        const data = await response.json()

        if (getAll) {
          setAllCourses(data.docs)
        } else {
          setCourses(data)
          setCurrentPage(page)
        }
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  // Fetch initial data
  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true)
      try {
        // First get all courses for filters
        await fetchCourses(1, 1000, filters, true)
        // Then get paginated courses
        await fetchCourses(1, limit, filters)
      } catch (error) {
        console.error('Error fetching initial data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInitialData()
  }, [limit, fetchCourses])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses(currentPage, limit, filters)
    }, 300)

    return () => clearTimeout(timer)
  }, [filters, limit, currentPage, fetchCourses])

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

  const handleCountryToggle = useCallback((countryName: string) => {
    setFilters(prev => ({
      ...prev,
      countries: prev.countries.includes(countryName)
        ? prev.countries.filter(c => c !== countryName)
        : [...prev.countries, countryName]
    }))
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

  return (
    <div className="pt-24 pb-24 couresLInBox">
      <CountryFlagSlider
        selectedCountries={filters.countries}
        onCountryToggle={handleCountryToggle}
      />
      <section className="ListFilerSec">
        <div className="container mx-auto">
          <div className="ListFilerRow flex gap-8">
            <div className="mobfilterbtn md:hidden ">
              <button
                onClick={() => setIsMobileFiltersOpen(true)}
                className="flex px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Filters
              </button>
            </div>

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
                <div className="coursListBox grid grid-cols-1 md:grid-cols-1 lg:grid-cols-1 gap-4">
                  {[...Array(limit)].map((_, i) => (
                    <div
                      key={i}
                      className="h-64 bg-gray-200 animate-pulse rounded-lg"
                      style={{ animationDelay: `${i * 0.1}s` }}
                    ></div>
                  ))}
                </div>
              ) : (
                <CollectionArchiveCourses
                  courses={courses.docs as CardPostData[]}
                  numberOfCol={4}
                  relationTo="courses"
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