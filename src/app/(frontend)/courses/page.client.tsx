'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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

type Suggestion = {
  label: string
  filters: typeof initialFilters
}

const initialFilters = {
  countries: [] as string[],
  universities: [] as string[],
  studyAreas: [] as string[],
  degreePrograms: [] as string[],
  studyYears: [] as string[],
  studyModes: [] as string[],
  searchQuery: '',
}

function filtersAreEqual(f1: typeof initialFilters, f2: typeof initialFilters) {
  // Compare all filter keys except pagination controls (which are not in filters)
  return (
    JSON.stringify({
      countries: f1.countries,
      universities: f1.universities,
      studyAreas: f1.studyAreas,
      degreePrograms: f1.degreePrograms,
      studyYears: f1.studyYears,
      studyModes: f1.studyModes,
      searchQuery: f1.searchQuery,
    }) ===
    JSON.stringify({
      countries: f2.countries,
      universities: f2.universities,
      studyAreas: f2.studyAreas,
      degreePrograms: f2.degreePrograms,
      studyYears: f2.studyYears,
      studyModes: f2.studyModes,
      searchQuery: f2.searchQuery,
    })
  );
}

export default function PageClient() {
  const { setHeaderTheme } = useHeaderTheme()
  const router = useRouter()
  const searchParams = useSearchParams() ?? new URLSearchParams()
  const couresLInBoxRef = useRef<HTMLDivElement | null>(null)
  const lastFiltersRef = useRef<typeof initialFilters>(initialFilters)
  const [filtersInitialized, setFiltersInitialized] = useState(false)
  const [courses, setCourses] = useState<CoursesResponse>({
    docs: [],
    totalDocs: 0,
    totalPages: 1,
    page: 1,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [limit, setLimit] = useState(5)
  const [filters, setFilters] = useState(initialFilters)
  const [allCourses, setAllCourses] = useState<Course[]>([])
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false)
  const [suggestedFilters, setSuggestedFilters] = useState<Suggestion[] | null>(null)

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])

  // Initialize filters from URL params, including searchQuery
  useEffect(() => {
    const initialFilters = {
      countries: searchParams.getAll('countries'),
      universities: searchParams.getAll('universities'),
      studyAreas: searchParams.getAll('studyAreas'),
      degreePrograms: searchParams.getAll('degreePrograms'),
      studyYears: searchParams.getAll('studyYears'),
      studyModes: searchParams.getAll('studyModes'),
      searchQuery: searchParams.get('searchQuery') || '',
    }
    setFilters(initialFilters)
    setFiltersInitialized(true)
  }, [searchParams])

  // Initialize page from query param if present
  useEffect(() => {
    const pageFromUrl = parseInt(searchParams.get('page') || '1', 10)
    setCurrentPage(pageFromUrl > 0 ? pageFromUrl : 1)
  }, [searchParams])

  // Update URL when filters or page change, include searchQuery and page
  useEffect(() => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, values]) => {
      if (key === 'searchQuery') {
        if (values) {
          params.append(key, values as string)
        }
      } else if (Array.isArray(values) && values.length > 0) {
        values.forEach(value => params.append(key, value))
      }
    })
    if (currentPage && currentPage !== 1) {
      params.set('page', currentPage.toString())
    }
    const paramsString = params.toString()
    const newUrl = paramsString
      ? `${window.location.pathname}?${paramsString}`
      : window.location.pathname
    if (newUrl !== window.location.href) {
      window.history.replaceState(null, '', newUrl)
    }
  }, [filters, currentPage])

  // Fetch all courses only once, unfiltered, for filter options
  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        const response = await fetch('/api/get-courses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page: 1,
            limit: 1000,
            countries: [],
            universities: [],
            degreePrograms: [],
            studyAreas: [],
            studyYears: [],
            studyModes: [],
            searchQuery: '',
            getAll: true,
          }),
        })
        if (!response.ok) throw new Error('Failed to fetch all courses')
        const data = await response.json()
        setAllCourses(data.docs)
      } catch (e) {
        setAllCourses([])
      }
    }
    fetchAllCourses()
  }, [])

  const fetchCourses = useCallback(
    async (
      page: number,
      limit: number,
      filters: typeof initialFilters
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
            studyAreas: filters.studyAreas || [],
            studyYears: filters.studyYears || [],
            studyModes: filters.studyModes || [],
            searchQuery: filters.searchQuery || '',
            getAll: false
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to fetch courses')
        }

        const data = await response.json()
        setCourses(data)
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setIsLoading(false)
      }
    },
    [],
  )

  // Fetch paginated, filtered courses: only after filters are initialized
  useEffect(() => {
    if (!filtersInitialized) return;
    let active = true
    setIsLoading(true)
    const timer = setTimeout(async () => {
      if (active) await fetchCourses(currentPage, limit, filters)
      setIsLoading(false)
    }, 300)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [filters, limit, currentPage, fetchCourses, filtersInitialized])

  // Scroll to couresLInBox ONLY when filter (not page) changes
  useEffect(() => {
    if (!filtersInitialized) return;

    // Only scroll if the filters (excluding pagination) have changed
    if (
      typeof window !== 'undefined' &&
      couresLInBoxRef.current &&
      !filtersAreEqual(filters, lastFiltersRef.current)
    ) {
      setTimeout(() => {
        couresLInBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 200);
    }
    lastFiltersRef.current = filters;
    // eslint-disable-next-line
  }, [
    filtersInitialized,
    filters.countries,
    filters.universities,
    filters.degreePrograms,
    filters.studyAreas,
    filters.studyYears,
    filters.studyModes,
    filters.searchQuery,
  ])

  // (Optional) Scroll to couresLInBox if searchQuery is present and changes
  // If you want searchQuery to not scroll, remove this effect.
  useEffect(() => {
    if (
      filters.searchQuery &&
      typeof window !== 'undefined' &&
      couresLInBoxRef.current
    ) {
      setTimeout(() => {
        couresLInBoxRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 200)
    }
  }, [filters.searchQuery])

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit)
    setCurrentPage(1)
  }, [])

  const handleFilterChange = useCallback(
    (newFilters: typeof initialFilters) => {
      setFilters(prev => ({
        ...prev,
        ...newFilters,
      }))
      setCurrentPage(1)
      setSuggestedFilters(null)
    },
    [],
  )

  const handleRemoveFilter = useCallback(
    (type: string, value: string) => {
      const categoryMap: Record<string, keyof typeof filters> = {
        'Country': 'countries',
        'University': 'universities',
        'Program': 'degreePrograms',
        'Courses': 'studyAreas',
        'Duration': 'studyYears',
        'Mode': 'studyModes',
        'Search': 'searchQuery'
      };

      const category = categoryMap[type];
      if (!category) return;

      if (category === 'searchQuery') {
        setFilters(prev => ({ ...prev, searchQuery: '' }));
      } else {
        setFilters(prev => ({
          ...prev,
          [category]: prev[category].filter((item: string) => item !== value)
        }));
      }
      setCurrentPage?.(1)
      setSuggestedFilters?.(null)
    },
    [],
  )

  const clearFilters = useCallback(() => {
    setFilters(initialFilters)
    setCurrentPage(1)
    setSuggestedFilters(null)
  }, [])

  const handleCountryToggle = useCallback((countryName: string) => {
    setFilters(prev => ({
      ...prev,
      countries: prev.countries.includes(countryName)
        ? prev.countries.filter(c => c !== countryName)
        : [...prev.countries, countryName]
    }))
    setCurrentPage(1)
    setSuggestedFilters(null)
  }, [])

  const appliedFilters = [
    ...filters.countries.map((c) => `Country: ${c}`),
    ...filters.universities.map((u) => `University: ${u}`),
    ...filters.degreePrograms.map((d) => `Program: ${d}`),
    ...filters.studyAreas.map((s) => `Area: ${s}`),
    ...filters.studyYears.map((y) => `Years: ${y}`),
    ...filters.studyModes.map((m) => `Mode: ${m}`),
    ...(filters.searchQuery ? [`Search: ${filters.searchQuery}`] : []),
  ]

  // Pagination handler: only set page, let useEffect do fetching!
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page)
      setSuggestedFilters(null)
      // Do NOT scroll here!
    },
    []
  )

  // Suggestion logic: suggest filters by loosening one at a time
  const handleShowSuggestions = () => {
    const suggestions: Suggestion[] = []
    // Remove searchQuery
    if (filters.searchQuery) {
      const f = { ...filters, searchQuery: '' }
      const result = filterCoursesPreview(allCourses, f)
      if (result.length) {
        suggestions.push({ label: 'Remove search query', filters: f })
      }
    }
    // Remove each array filter one at a time
    for (const key of ['countries', 'universities', 'degreePrograms', 'studyAreas', 'studyYears', 'studyModes'] as const) {
      if (filters[key] && filters[key].length > 0) {
        const f = { ...filters, [key]: [] }
        const result = filterCoursesPreview(allCourses, f)
        if (result.length) {
          suggestions.push({ label: `Remove ${key.replace(/[A-Z]/g, m => ' ' + m).replace(/^./, s => s.toUpperCase())}`, filters: f })
        }
      }
    }
    // Remove all filters
    if (suggestions.length === 0) {
      suggestions.push({ label: "Clear all filters", filters: initialFilters })
    }
    setSuggestedFilters(suggestions)
  }

  // Preview filter logic for suggestions (must match backend logic for get-courses)
  function filterCoursesPreview(courses: Course[], f: typeof initialFilters): Course[] {
    return courses.filter(course => {
      if (f.countries.length && (!course.university || !f.countries.includes(course.university.country?.name))) return false
      if (f.universities.length && (!course.university || !f.universities.includes(course.university.title))) return false
      if (f.degreePrograms.length) {
        const deg = course.degreeProgram?.title || course.degreeProgram?.name
        if (!deg || !f.degreePrograms.includes(deg)) return false
      }
      if (f.studyAreas.length) {
        const area = course.studyArea?.title || course.studyArea?.name
        if (!area || !f.studyAreas.includes(area)) return false
      }
      if (f.studyYears.length) {
        const years = course.studyYears?.title || course.studyYears?.name
        if (!years || !f.studyYears.includes(years)) return false
      }
      if (f.studyModes.length) {
        const mode = course.studyMode?.title || course.studyMode?.name
        if (!mode || !f.studyModes.includes(mode)) return false
      }
      if (f.searchQuery && !(
        course.title?.toLowerCase().includes(f.searchQuery.toLowerCase()) ||
        course.description?.toLowerCase().includes(f.searchQuery.toLowerCase())
      )) return false
      return true
    })
  }

  // Apply suggestion
  const applySuggestedFilters = (newFilters: typeof initialFilters) => {
    setFilters(newFilters)
    setCurrentPage(1)
    setSuggestedFilters(null)
  }

  return (
    <div className="pt-14 pb-24 couresLInBox" ref={couresLInBoxRef}>
      <CountryFlagSlider
        selectedCountries={filters.countries}
        onCountryToggle={handleCountryToggle}
      />
      <section className="ListFilerSec">
        <div className="container mx-auto">
          <div className="ListFilerRow flex gap-8 items-start">
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
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>

            <div className="FlistCol flColLeft w-1/4 hidden md:block">
              <div className="relative h-full">
                <div
                  className="sticky top-28"
                  style={{
                    // This keeps the filter visible and scrollable, but not overflowing the viewport.
                    maxHeight: 'calc(100vh - 7rem)', // adjust 7rem if your header/footer is a different height
                    overflowY: 'auto',
                  }}
                >
                  <FiltersClient
                    filters={filters}
                    setFilters={setFilters}
                    courses={allCourses}
                    clearFilters={clearFilters}
                    isLoading={isLoading}
                  />
                </div>
              </div>
            </div>

            <div className="FlistCol flColRight w-full md:w-3/4">
              <div className="listshowtopbox">
                {isLoading ? (
                  <>
                    <div className="flex justify-between items-center">
                      <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                      <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="mt-4 h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                  </>
                ) : (
                  <>
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
                      <AppliedFilters
                        appliedFilters={appliedFilters}
                        onRemove={handleRemoveFilter}
                        onClear={clearFilters}
                      />
                    )}
                  </>
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
              ) : courses.docs.length === 0 ? (
                <div className="text-center py-16 text-gray-500 text-lg font-medium searchnoresult">
                  <h4>Search produced no results.</h4>
                  <div className="mt-4">
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                      onClick={handleShowSuggestions}
                    >
                      Show Suggestions
                    </button>
                  </div>
                  {suggestedFilters && (
                    <div className="mt-6">
                      <h4 className="text-base font-semibold mb-2">Try these filters:</h4>
                      {suggestedFilters.map((suggestion, idx) => (
                        <button
                          key={idx}
                          className="block w-full text-left px-3 py-2 mb-2 border rounded hover:bg-gray-100"
                          onClick={() => applySuggestedFilters(suggestion.filters)}
                        >
                          {suggestion.label}
                        </button>
                      ))}
                    </div>
                  )}
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
                    onPageChange={handlePageChange}
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