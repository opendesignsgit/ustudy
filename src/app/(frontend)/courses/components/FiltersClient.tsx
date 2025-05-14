'use client'

import React, { useState, useEffect } from 'react'
import AppliedFilters from './AppliedFilters'

type FilterState = {
  countries: string[]
  universities: string[]
  degreePrograms: string[]
  departments: string[]
  studyAreas: string[]
  studyYears: string[]
  studyModes: string[]
}

type SearchTermsState = {
  countries: string
  universities: string
  degreePrograms: string
  departments: string
  studyAreas: string
  studyYears: string
  studyModes: string
}

type CollapsedSectionsState = {
  countries: boolean
  universities: boolean
  degreePrograms: boolean
  departments: boolean
  studyAreas: boolean
  studyYears: boolean
  studyModes: boolean
}

const FiltersClient = ({
  onFilterChange,
  courses,
}: {
  onFilterChange: (filters: FilterState) => void
  courses: any[]
}) => {
  // Generate all possible filter options from courses data
  const generateFilterOptions = () => {
    const options = {
      countries: new Set<string>(),
      universities: new Set<string>(),
      degreePrograms: new Set<string>(),
      departments: new Set<string>(),
      studyAreas: new Set<string>(),
      studyYears: new Set<string>(),
      studyModes: new Set<string>(),
    }

    courses.forEach((course) => {
      // Handle country (nested under university.country)
      if (course.university?.country?.name) {
        options.countries.add(course.university.country.name)
      }

      // Handle other fields
      if (course.university?.title) options.universities.add(course.university.title)
      if (course.degreeProgram) options.degreePrograms.add(course.degreeProgram)
      if (course.department) options.departments.add(course.department)
      if (course.studyArea) options.studyAreas.add(course.studyArea)
      if (course.studyYears) options.studyYears.add(course.studyYears.toString())
      if (course.studyMode) options.studyModes.add(course.studyMode)
    })

    return {
      countries: Array.from(options.countries).sort(),
      universities: Array.from(options.universities).sort(),
      degreePrograms: Array.from(options.degreePrograms).sort(),
      departments: Array.from(options.departments).sort(),
      studyAreas: Array.from(options.studyAreas).sort(),
      studyYears: Array.from(options.studyYears).sort(),
      studyModes: Array.from(options.studyModes).sort(),
    }
  }

  // State management
  const [filterOptions, setFilterOptions] = useState(generateFilterOptions())
  const [filters, setFilters] = useState<FilterState>({
    countries: [],
    universities: [],
    degreePrograms: [],
    departments: [],
    studyAreas: [],
    studyYears: [],
    studyModes: [],
  })
  const [searchTerms, setSearchTerms] = useState<SearchTermsState>({
    countries: '',
    universities: '',
    degreePrograms: '',
    departments: '',
    studyAreas: '',
    studyYears: '',
    studyModes: '',
  })
  const [collapsedSections, setCollapsedSections] = useState<CollapsedSectionsState>({
    countries: false,
    universities: false,
    degreePrograms: false,
    departments: false,
    studyAreas: false,
    studyYears: false,
    studyModes: false,
  })

  // Update filter options when courses change
  useEffect(() => {
    setFilterOptions(generateFilterOptions())
  }, [courses])

  // Notify parent when filters change
  useEffect(() => {
    onFilterChange(filters)
  }, [filters, onFilterChange])

  // Handle filter selection changes
  const handleFilterChange = (category: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item) => item !== value)
        : [...prev[category], value],
    }))
  }

  // Handle search term changes
  const handleSearchChange = (category: keyof SearchTermsState, value: string) => {
    setSearchTerms((prev) => ({ ...prev, [category]: value }))
  }

  // Toggle filter section collapse
  const toggleCollapse = (category: keyof CollapsedSectionsState) => {
    setCollapsedSections((prev) => ({ ...prev, [category]: !prev[category] }))
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      countries: [],
      universities: [],
      degreePrograms: [],
      departments: [],
      studyAreas: [],
      studyYears: [],
      studyModes: [],
    })
  }

  // Remove specific filter
  const handleRemoveFilter = (filter: string) => {
    // Split the filter string into type and value
    const [type, ...valueParts] = filter.split(': ')
    const value = valueParts.join(': ') // Rejoin in case value contains ': '
    
    const categoryMap: Record<string, keyof FilterState> = {
      Country: 'countries',
      University: 'universities',
      Program: 'degreePrograms',
      Department: 'departments',
      Area: 'studyAreas',
      Years: 'studyYears',
      Mode: 'studyModes',
    }

    const category = categoryMap[type]
    if (category) {
      setFilters((prev) => ({
        ...prev,
        [category]: prev[category].filter((item) => item !== value),
      }))
    }
  }

  // Generate applied filters with labels
  const appliedFilters = [
    ...filters.countries.map((c) => `Country: ${c}`),
    ...filters.universities.map((u) => `University: ${u}`),
    ...filters.degreePrograms.map((d) => `Program: ${d}`),
    ...filters.departments.map((d) => `Department: ${d}`),
    ...filters.studyAreas.map((s) => `Area: ${s}`),
    ...filters.studyYears.map((y) => `Years: ${y}`),
    ...filters.studyModes.map((m) => `Mode: ${m}`),
  ]

  // Filter sections configuration
  const filterSections = [
    { key: 'countries', label: 'Countries' },
    { key: 'universities', label: 'Universities' },
    { key: 'degreePrograms', label: 'Degree Programs' },
    { key: 'departments', label: 'Departments' },
    { key: 'studyAreas', label: 'Study Areas' },
    { key: 'studyYears', label: 'Study Years' },
    { key: 'studyModes', label: 'Study Modes' },
  ]

  return (
    <div className="FListInrow">
      {/* Applied Filters */}
      {appliedFilters.length > 0 && (
        <AppliedFilters
          appliedFilters={appliedFilters}
          onRemove={handleRemoveFilter}
          onClear={clearFilters}
        />
      )}

      {/* Filter Sections */}
      {filterSections.map(({ key, label }) => {
        const filterKey = key as keyof typeof filterOptions
        return filterOptions[filterKey].length > 0 ? (
          <div key={key} className="ItemBoxs">
            <div
              className="IboxTitles flex justify-between items-center cursor-pointer"
              onClick={() => toggleCollapse(key as keyof CollapsedSectionsState)}
            >
              <h3>{label}</h3>
              <button>
                {collapsedSections[key as keyof CollapsedSectionsState] ? 'Expand' : 'Collapse'}
              </button>
            </div>

            {!collapsedSections[key as keyof CollapsedSectionsState] && (
              <div className="IboxSearchlist">
                <div className="IboxSearinput">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-[30px]"
                    placeholder={`Search ${label.toLowerCase()}`}
                    value={searchTerms[key as keyof SearchTermsState]}
                    onChange={(e) =>
                      handleSearchChange(key as keyof SearchTermsState, e.target.value)
                    }
                  />
                </div>
                <div className="itmlistul space-y-2 max-h-40 overflow-y-auto">
                  {filterOptions[filterKey]
                    .filter((option) =>
                      option
                        .toLowerCase()
                        .includes(searchTerms[key as keyof SearchTermsState].toLowerCase()),
                    )
                    .map((option) => (
                      <div
                        key={`${key}-${option}`}
                        className={`itmlistulli cursor-pointer transition-colors ${
                          filters[filterKey].includes(option)
                            ? 'bg-blue-100 text-blue-700 font-semibold'
                            : 'hover:bg-gray-100'
                        }`}
                      >
                        <input
                          type="checkbox"
                          id={`${key}-${option}`}
                          checked={filters[filterKey].includes(option)}
                          onChange={() => handleFilterChange(filterKey, option)}
                          className="mr-2 accent-blue-500"
                        />
                        <label htmlFor={`${key}-${option}`} className="">
                          {option}
                        </label>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </div>
        ) : null
      })}
    </div>
  )
}

export default FiltersClient
//final
