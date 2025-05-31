'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Mic, ChevronDown, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  selectedCountry: string
  setSelectedCountry: (country: string) => void
}

interface CourseSuggestion {
  id: string
  slug: string
  title: string
  university?: { title: string }
  degreeProgram?: { name: string }
  department?: { name: string }
  studyArea?: { name: string }
  studyYear?: { name: string }
  studyMode?: { name: string }
}

const countries = [
  'Malaysia',
  'Singapore'
]

export const SearchModal = ({
  isOpen,
  onClose,
  selectedCountry,
  setSelectedCountry,
}: SearchModalProps) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showCountriesDropdown, setShowCountriesDropdown] = useState(false)
  const [suggestions, setSuggestions] = useState<CourseSuggestion[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch('/api/get-courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page: 1,
          limit: 5,
          searchQuery: query
        }),
      })

      if (!response.ok) throw new Error('Failed to fetch suggestions')
      const data = await response.json()
      setSuggestions(data.docs || [])
    } catch (error) {
      console.error('Error fetching suggestions:', error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleSearchSubmit = () => {
    if (!searchQuery) return

    const params = new URLSearchParams()
    params.append('searchQuery', searchQuery)
    if (selectedCountry) {
      params.append('countries', selectedCountry)
    }

    router.push(`/courses?${params.toString()}`)
    onClose()
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchSuggestions(searchQuery)
    }, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery, fetchSuggestions])

  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleEsc)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEsc)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 pt-16">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Content */}
      <div ref={modalRef} className="relative bg-white mx-auto rounded-b-lg shadow-xl max-w-4xl">
        {/* Header Section */}
        <div className="p-6">
          <div className="flex items-center justify-between gap-4">
            {/* Country Dropdown */}
            <div className="relative flex items-center" ref={dropdownRef}>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowCountriesDropdown(!showCountriesDropdown)}
                  className="flex items-center space-x-1 text-lg font-bold text-gray-900 hover:text-blue-600 min-w-0"
                >
                  <span className="truncate max-w-[120px]">{selectedCountry}</span>
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
                        className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-100 ${country === selectedCountry ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                          }`}
                      >
                        {country}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Expanded Search Bar */}
            <div className="flex-1 relative min-w-0 ml-4">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search courses, universities, programs..."
                className="w-full p-3 pl-4 pr-28 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleSearchSubmit()
                  }
                }}
                autoFocus
              />
              <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                <button
                  className="p-1 text-gray-500 hover:text-blue-600"
                  onMouseDown={(e) => e.preventDefault()}
                >
                  <Mic className="w-5 h-5" />
                </button>
                <button
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-medium"
                  onClick={handleSearchSubmit}
                  disabled={!searchQuery}
                >
                  Search
                </button>
              </div>

              {/* Search Suggestions Dropdown */}
              {searchQuery && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                  {isLoading ? (
                    <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
                  ) : suggestions.length > 0 ? (
                    suggestions.map((course) => (
                      <div key={course.id} className="px-4 py-3 hover:bg-gray-50 flex flex-col border-b border-gray-100 last:border-b-0">
                        {/* Course title - click to detail page */}
                        <button
                          onClick={() => {
                            router.push(`/courses/${course.slug}`)
                            onClose()
                          }}
                          className="font-medium text-gray-900 truncate text-left flex items-center gap-2 w-full"
                        >
                          <Image
                            src="/media/book-icon.svg"
                            alt=""
                            width={20}
                            height={20}
                            className="flex-shrink-0"
                          />
                          {course.title}
                          <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 ml-auto" />
                        </button>

                        {/* Pills for filters */}
                        <div className="flex flex-wrap gap-2 mt-2">
                          {/* University */}
                          {course.university?.title && (
                            <button
                              className="bg-gray-100 px-2 py-1 rounded text-xs hover:bg-blue-100"
                              onClick={(e) => {
                                e.stopPropagation()
                                router.push(`/courses?universities=${encodeURIComponent(course.university!.title)}${selectedCountry ? `&countries=${encodeURIComponent(selectedCountry)}` : ''}`)
                                onClose()
                              }}
                            >
                              {course.university.title}
                            </button>
                          )}

                          {/* Degree Program */}
                          {course.degreeProgram?.name && (
                            <button
                              className="bg-gray-100 px-2 py-1 rounded text-xs hover:bg-blue-100"
                              onClick={(e) => {
                                e.stopPropagation()
                                router.push(`/courses?degreePrograms=${encodeURIComponent(course.degreeProgram!.name)}${selectedCountry ? `&countries=${encodeURIComponent(selectedCountry)}` : ''}`)
                                onClose()
                              }}
                            >
                              {course.degreeProgram.name}
                            </button>
                          )}

                          {/* Other filter pills */}
                          {/* ... */}
                        </div>
                      </div>
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
            <div>
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 ml-2 flex-shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}