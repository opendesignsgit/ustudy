'use client'
  
import React, { useState, useEffect } from 'react'
import AppliedFilters from './AppliedFilters'

// Helper to safely extract a display label from a relationship field
function getRelationshipLabel<T extends { title?: string; name?: string; id?: string | number }>(
  value: T | string | number | undefined | null
): string | undefined {
  if (!value) return undefined
  if (typeof value === 'string' || typeof value === 'number') return String(value)
  if ('title' in value && typeof value.title === 'string' && value.title.trim()) return value.title
  if ('name' in value && typeof value.name === 'string' && value.name.trim()) return value.name
  if ('id' in value && (typeof value.id === 'string' || typeof value.id === 'number')) return String(value.id)
  return undefined
}

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
  filters,
  setFilters,
  courses,
  clearFilters,
}: {
  filters: FilterState
  setFilters: (filters: FilterState) => void
  courses: any[]
  clearFilters: () => void
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
      if (course.university?.country) {
        const name = getRelationshipLabel(course.university.country)
        if (name) options.countries.add(name)
      }

      // Universities
      if (course.university) {
        const uniTitle = getRelationshipLabel(course.university)
        if (uniTitle) options.universities.add(uniTitle)
      }

      // Degree Programs
      if (course.degreeProgram) {
        if (Array.isArray(course.degreeProgram)) {
          course.degreeProgram.forEach((dp: any) => {
            const dpLabel = getRelationshipLabel(dp)
            if (dpLabel) options.degreePrograms.add(dpLabel)
          })
        } else {
          const dpLabel = getRelationshipLabel(course.degreeProgram)
          if (dpLabel) options.degreePrograms.add(dpLabel)
        }
      }

      // Departments
      if (course.department) {
        if (Array.isArray(course.department)) {
          course.department.forEach((dep: any) => {
            const depLabel = getRelationshipLabel(dep)
            if (depLabel) options.departments.add(depLabel)
          })
        } else {
          const depLabel = getRelationshipLabel(course.department)
          if (depLabel) options.departments.add(depLabel)
        }
      }

      // Study Areas
      if (course.studyArea) {
        if (Array.isArray(course.studyArea)) {
          course.studyArea.forEach((sa: any) => {
            const saLabel = getRelationshipLabel(sa)
            if (saLabel) options.studyAreas.add(saLabel)
          })
        } else {
          const saLabel = getRelationshipLabel(course.studyArea)
          if (saLabel) options.studyAreas.add(saLabel)
        }
      }

      // Study Years (may be number or relationship or array)
      if (course.studyYears !== undefined && course.studyYears !== null) {
        if (Array.isArray(course.studyYears)) {
          course.studyYears.forEach((sy: any) => {
            const label = getRelationshipLabel(sy)
            if (label) options.studyYears.add(label)
          })
        } else {
          const syLabel = getRelationshipLabel(course.studyYears)
          if (syLabel) options.studyYears.add(syLabel)
        }
      }

      // Study Modes (may be relationship or array)
      if (course.studyMode) {
        if (Array.isArray(course.studyMode)) {
          course.studyMode.forEach((sm: any) => {
            const label = getRelationshipLabel(sm)
            if (label) options.studyModes.add(label)
          })
        } else {
          const smLabel = getRelationshipLabel(course.studyMode)
          if (smLabel) options.studyModes.add(smLabel)
        }
      }
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
    // eslint-disable-next-line
  }, [courses])

  // Handle filter selection changes
  const handleFilterChange = (category: keyof FilterState, value: string) => {
    const newFilters = {
      ...filters,
      [category]: filters[category].includes(value)
        ? filters[category].filter((item) => item !== value)
        : [...filters[category], value],
    }
    setFilters(newFilters)
  }

  const handleRemoveFilter = (type: string, value: string) => {
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
      const newFilters = {
        ...filters,
        [category]: filters[category].filter((item) => item !== value),
      }
      setFilters(newFilters)
    }
  }

  // Handle search term changes
  const handleSearchChange = (category: keyof SearchTermsState, value: string) => {
    setSearchTerms((prev) => ({ ...prev, [category]: value }))
  }

  // Toggle filter section collapse
  const toggleCollapse = (category: keyof CollapsedSectionsState) => {
    setCollapsedSections((prev) => ({ ...prev, [category]: !prev[category] }))
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
          <div key={`${key}-${filters[filterKey].join(',')}`} className="ItemBoxs">
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