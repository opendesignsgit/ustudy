'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Mic, ChevronDown, ArrowRight } from 'lucide-react'
import Image from 'next/image'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  selectedCountry: string
  setSelectedCountry: (country: string) => void
}

interface CourseSuggestion {
  id: string
  title: string
  university?: {
    title: string
  }
  studyArea?: {
    name: string
  }
}

const countries = [
  'Malaysia',
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'India',
]

const popularSearches = ['Law', 'Business', 'Psychology', 'Media']
const popularCourses = [
  'Bachelor of Medicine and Bachelor of Surgery',
  'Bachelor of Information Technology (NONS) (ODL)',
  'Senior Diploma/Charter',
  'MBA in Convenire Law (ODL), BUC',
  'Environmental & Energy (BCE)',
]

export const SearchModal = ({
  isOpen,
  onClose,
  selectedCountry,
  setSelectedCountry,
}: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showCountriesDropdown, setShowCountriesDropdown] = useState(false)
  const [showPopularContent, setShowPopularContent] = useState(false)
  const [suggestions, setSuggestions] = useState<CourseSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/get-courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          page: 1,
          limit: 5,
          filters: {
            searchQuery: query
          }
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to fetch suggestions')
      }

      const data = await response.json()
      setSuggestions(data.docs || [])
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleSearchFocus = () => {
    setShowPopularContent(true)
  }

  const handleSearchBlur = () => {
    setTimeout(() => {
      setShowPopularContent(false)
    }, 200)
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchSuggestions(searchQuery)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchQuery, fetchSuggestions])

  // ... (keep your existing useEffect for click outside and escape key)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 pt-16 searchcontbox">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm searchcontbdrop"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div
        ref={modalRef}
        className="relative bg-white mx-auto rounded-b-lg shadow-xl searchboxview"
      >
        {/* Header Section */}
        <div className="p-6 sboxvdivone">
          <div className="flex items-center justify-between gap-4 sboxvdivtwo">
            {/* Country Dropdown - Made smaller */}
            <div className="sboxvdivleft relative flex items-center" ref={dropdownRef}>
              <div className="sboxvdivcontry flex items-center gap-2">
                <button
                  onClick={() => setShowCountriesDropdown(!showCountriesDropdown)}
                  className="flex items-center space-x-1 text-2xl font-bold text-gray-900 hover:text-blue-600 min-w-0"
                >
                  <span className="truncate">{selectedCountry}</span>
                  <ChevronDown className="w-5 h-5 flex-shrink-0" />
                </button>

                {showCountriesDropdown && (
                  <div className="absolute z-10 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1">
                    {countries.map((country) => (
                      <button
                        key={country}
                        onClick={() => {
                          setSelectedCountry(country)
                          setShowCountriesDropdown(false)
                        }}
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${country === selectedCountry ? 'bg-blue-50 text-blue-600' : 'text-gray-700'}`}
                      >
                        {country}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Expanded Search Bar */}
            <div className="sboxvdivmid flex-1 relative min-w-0 ml-4">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search courses, countries, universities..."
                className="w-full p-3 pl-4 pr-28 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
              />
              <div className="sboxvdivmigsech absolute items-center space-x-2">
                <button
                  className="bthicon p-1 text-gray-500 hover:text-blue-600"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <Mic className="w-5 h-5" />
                </button>
                <button
                  className="btnsnow bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-medium"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  Search Now
                </button>
              </div>

              {/* Search Suggestions Dropdown */}
              {searchQuery && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                  {isLoading ? (
                    <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
                  ) : suggestions.length > 0 ? (
                    suggestions.map((course) => (
                      <button
                        key={course.id}
                        onClick={() => {
                          setSearchQuery(course.title)
                          searchInputRef.current?.focus()
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-gray-50 text-gray-700 flex items-start gap-3 border-b border-gray-100 last:border-b-0"
                      >
                        <Image
                          src="/media/book-icon.svg"
                          alt=""
                          width={20}
                          height={20}
                          className="flex-shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-gray-900 truncate">{course.title}</div>
                          {(course.university?.title || course.studyArea?.name) && (
                            <div className="text-xs text-gray-500 mt-1 truncate">
                              {course.university?.title}
                              {course.studyArea?.name && ` • ${course.studyArea.name}`}
                            </div>
                          )}
                        </div>
                        <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-sm text-gray-500">
                      No results found for "{searchQuery}"
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Close Button */}
            <div className="sboxvdivright">
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 ml-2 flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Popular Content (shown only when search box is focused or empty) */}
        {(showPopularContent || !searchQuery) && (
          <>
            {/* Popular Searches */}
            <div className="p-6 serchsubbox suboxOne">
              <h2 className="font-semibold  mb-4">Popular Searches</h2>
              <div className="flex flex-wrap gap-3 suboxbtnlist ">
                {popularSearches.map((item) => (
                  <button
                    key={item}
                    onClick={() => {
                      setSearchQuery(item)
                      searchInputRef.current?.focus()
                    }}
                    className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium"
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            {/* Popular Courses */}
            <div className="p-6 serchsubbox suboxTwo">
              <h2 className="font-semibold mb-4">Popular Courses</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sbcourselists">
                {popularCourses.map((course) => (
                  <div
                    key={course}
                    className="sbcourseitmes border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => {
                      setSearchQuery(course)
                      searchInputRef.current?.focus()
                    }}
                  >
                    <div className="flex items-center">
                      <Image src="/media/book-icon.svg" alt="" width="25" height="25" />
                      <h3 className="text-gray-800 font-medium">{course}</h3>
                      <ArrowRight className="w-4 h-4 text-gray-400 mt-1 flex-shrink-0 ml-auto" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}