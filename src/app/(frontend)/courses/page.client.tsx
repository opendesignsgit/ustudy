'use client'

import { useHeaderTheme } from '@/providers/HeaderTheme'
import React, { useEffect, useState, useCallback } from 'react'
import { CollectionArchiveCourses } from '@/components/CollectionArchiveCourses'
import { PageRange } from '@/components/PageRange'
import { CoursesPagination } from '@/components/CoursesPagination'
import FiltersClient from './components/FiltersClient'
import CountryFlagSlider from './components/CountryFlagSlider'
import AppliedFilters from './components/AppliedFilters'

const PageClient = ({ 
  initialCourses,
  defaultLimit = 12 
}: {
  initialCourses: {
    docs: any[]
    totalDocs: number
    totalPages: number
    page: number
  }
  defaultLimit?: number
}) => {
  const { setHeaderTheme } = useHeaderTheme()
  const [courses, setCourses] = useState(initialCourses)
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(initialCourses.page || 1)
  const [limit, setLimit] = useState(defaultLimit)
  const [filters, setFilters] = useState({
    countries: [] as string[],
    universities: [] as string[],
    studyAreas: [] as string[]
  })

  useEffect(() => {
    setHeaderTheme('light')
  }, [setHeaderTheme])

  const fetchCourses = useCallback(async (page: number, limit: number, filters: {
    countries: string[]
    universities: string[]
    studyAreas: string[]
  }) => {
    setIsLoading(true)
    try {
      const filterParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, values]) => {
        if (values && values.length > 0) {
          values.forEach(value => filterParams.append(key, value))
        }
      })

      const response = await fetch(
        `/api/courses?page=${page}&limit=${limit}&${filterParams.toString()}`
      )
      const data = await response.json()
      setCourses(data)
      setCurrentPage(page)
    } catch (error) {
      console.error('Error fetching courses:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCourses(1, limit, filters)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [filters, limit, fetchCourses])

  const handleLimitChange = useCallback((newLimit: number) => {
    setLimit(newLimit)
  }, [])

  const handleFilterChange = useCallback((newFilters: {
    countries: string[]
    universities: string[]
    studyAreas: string[]
  }) => {
    setFilters(newFilters)
  }, [])

  const handleRemoveFilter = useCallback((filter: string) => {
    const updatedFilters = {
      countries: filters.countries.filter(item => item !== filter),
      universities: filters.universities.filter(item => item !== filter),
      studyAreas: filters.studyAreas.filter(item => item !== filter)
    }
    setFilters(updatedFilters)
  }, [filters])

  const clearFilters = useCallback(() => {
    setFilters({
      countries: [],
      universities: [],
      studyAreas: []
    })
  }, [])

  const appliedFilters = [
    ...filters.countries,
    ...filters.universities,
    ...filters.studyAreas
  ]

  return (
    <div className="pt-24 pb-24">
      {/* Country Slider */}
      <CountryFlagSlider />

      <div className="container flex gap-8">
        {/* Sidebar */}
        <div className="w-1/4">
          <div className="bg-gray-100 rounded p-4">
            <h2 className="font-semibold mb-4">Filters</h2>
            <FiltersClient 
              onFilterChange={handleFilterChange}
              courses={courses.docs}  // Pass the array of courses
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="w-3/4">
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
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

            {/* Applied Filters */}
            {appliedFilters.length > 0 && (
              <div className="mb-4">
                <AppliedFilters
                  appliedFilters={appliedFilters}
                  onRemove={handleRemoveFilter}
                  onClear={clearFilters}
                />
              </div>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[...Array(limit)].map((_, i) => (
                <div key={i} className="col-span-12 h-30 bg-gray-200 animate-pulse rounded"></div>
              ))}
            </div>
          ) : (
            <CollectionArchiveCourses 
              posts={courses.docs} 
              numberOfCol={4} 
              relationTo="courses" 
              key={`courses-${currentPage}-${limit}-${JSON.stringify(filters)}`}
            />
          )}

          <div className="container">
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
  )
}

export default PageClient
//final