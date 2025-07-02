'use client'

import React, { useState, useEffect } from 'react'
import AppliedFilters from './AppliedFilters'

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

const FiltersClient = ({
  filters,
  setFilters,
  courses,
  clearFilters,
  isLoading = false,
}: {
  filters: any
  setFilters: (filters: any) => void
  courses: any[]
  clearFilters: () => void
  isLoading?: boolean
}) => {
  const [filterOptions, setFilterOptions] = useState<any>({})
  const [searchTerms, setSearchTerms] = useState<any>({})
  const [collapsedSections, setCollapsedSections] = useState<any>({})
  const showLoading = isLoading && courses.length === 0;

  useEffect(() => {
    const options = {
      countries: new Set<string>(),
      universities: new Set<string>(),
      degreePrograms: new Set<string>(),
      studyAreas: new Set<string>(),
      studyYears: new Set<string>(),
      studyModes: new Set<string>(),
    }

    // Always gather filter options from all courses, not just filtered ones
    courses.forEach((course) => {
      // Handle university and country
      if (course.university) {
        const uniName = getRelationshipLabel(course.university)
        if (uniName) options.universities.add(uniName)

        if (course.university.country) {
          const countryName = getRelationshipLabel(course.university.country)
          if (countryName) options.countries.add(countryName)
        }
      }

      // Handle other relationships
      const processField = (field: any, set: Set<string>) => {
        if (!field) return
        const items = Array.isArray(field) ? field : [field]
        items.forEach(item => {
          const label = getRelationshipLabel(item)
          if (label) set.add(label)
        })
      }

      processField(course.degreeProgram, options.degreePrograms)
      processField(course.studyArea, options.studyAreas)
      processField(course.studyYear, options.studyYears)
      processField(course.studyMode, options.studyModes)
    })

    setFilterOptions({
      countries: Array.from(options.countries).sort(),
      universities: Array.from(options.universities).sort(),
      degreePrograms: Array.from(options.degreePrograms).sort(),
      studyAreas: Array.from(options.studyAreas).sort(),
      studyYears: Array.from(options.studyYears).sort(),
      studyModes: Array.from(options.studyModes).sort(),
    })

    // Initialize collapsed sections
    setCollapsedSections({
      countries: false,
      universities: false,
      degreePrograms: false,
      studyAreas: false,
      studyYears: false,
      studyModes: false,
    })
  }, [courses])

  const handleFilterChange = (category: string, value: string) => {
    setFilters((prev: any) => ({
      ...prev,
      [category]: prev[category].includes(value)
        ? prev[category].filter((item: string) => item !== value)
        : [...prev[category], value],
    }))
  }

  const handleRemoveFilter = (filter: string) => {
    const separatorIndex = filter.indexOf(': ');
    if (separatorIndex === -1) return;

    const type = filter.substring(0, separatorIndex);
    const value = filter.substring(separatorIndex + 2);

    const categoryMap: Record<string, string> = {
      'Country': 'countries',
      'University': 'universities',
      'Program': 'degreePrograms',
      'Area': 'studyAreas',
      'Years': 'studyYears',
      'Mode': 'studyModes',
    };

    const category = categoryMap[type];
    if (category) {
      setFilters((prev: any) => ({
        ...prev,
        [category]: prev[category].filter((item: string) => item !== value),
      }));
    }
  };

  const handleSearchChange = (category: string, value: string) => {
    setSearchTerms((prev: any) => ({ ...prev, [category]: value }))
  }

  const toggleCollapse = (category: string) => {
    setCollapsedSections((prev: any) => ({ ...prev, [category]: !prev[category] }))
  }

  const appliedFilters = [
    ...filters.countries.map((c: string) => `Country: ${c}`),
    ...filters.universities.map((u: string) => `University: ${u}`),
    ...filters.degreePrograms.map((d: string) => `Program: ${d}`),
    ...filters.studyAreas.map((s: string) => `Area: ${s}`),
    ...filters.studyYears.map((y: string) => `Durartion: ${y}`),
    ...filters.studyModes.map((m: string) => `Mode: ${m}`),
  ]

  const filterSections = [
    { key: 'countries', label: 'Countries' },
    { key: 'universities', label: 'Universities' },
    { key: 'degreePrograms', label: 'Degree Programs' },
    { key: 'studyAreas', label: 'Study Areas' },
    { key: 'studyYears', label: 'Study Years' },
    { key: 'studyModes', label: 'Study Modes' },
  ]

  return (
    <div className="FListInrow">
      {showLoading ? (
        <div className="space-y-4">
          {[...Array(7)].map((_, i) => (
            <div key={i} className="ItemBoxs">
              <div className="IboxTitles flex justify-between items-center">
                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-6 w-20 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="IboxSearchlist mt-2">
                <div className="IboxSearinput">
                  <div className="h-10 w-full bg-gray-200 rounded-[30px] animate-pulse"></div>
                </div>
                <div className="itmlistul space-y-2 mt-2">
                  {[...Array(5)].map((_, j) => (
                    <div key={j} className="h-6 w-full bg-gray-200 rounded animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {appliedFilters.length > 0 && (
            <AppliedFilters
              appliedFilters={appliedFilters}
              onRemove={handleRemoveFilter}
              onClear={clearFilters}
            />
          )}

          {filterSections.map(({ key, label }) => {
            return filterOptions[key]?.length > 0 ? (
              <div key={`${key}-${filters[key]?.join(',')}`} className="ItemBoxs">
                <div
                  className="IboxTitles flex justify-between items-center cursor-pointer"
                  onClick={() => toggleCollapse(key)}
                >
                  <h3>{label}</h3>
                  <button>
                    {collapsedSections[key] ? 'Expand' : 'Collapse'}
                  </button>
                </div>

                {!collapsedSections[key] && (
                  <div className="IboxSearchlist">
                    <div className="IboxSearinput">
                      <input
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded-[30px]"
                        placeholder={`Search ${label.toLowerCase()}`}
                        value={searchTerms[key] || ''}
                        onChange={(e) => handleSearchChange(key, e.target.value)}
                      />
                    </div>
                    <div className="itmlistul space-y-2 max-h-40 overflow-y-auto">
                      {filterOptions[key]
                        .filter((option: string) =>
                          option
                            .toLowerCase()
                            .includes((searchTerms[key] || '').toLowerCase())
                        )
                        .map((option: string) => (
                          <div
                            key={`${key}-${option}`}
                            className={`itmlistulli cursor-pointer transition-colors ${filters[key]?.includes(option)
                              ? 'bg-blue-100 text-blue-700 font-semibold'
                              : 'hover:bg-gray-100'
                              }`}
                          >
                            <input
                              type="checkbox"
                              id={`${key}-${option}`}
                              checked={filters[key]?.includes(option)}
                              onChange={() => handleFilterChange(key, option)}
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
        </>
      )}
    </div>
  )
}

export default FiltersClient