'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { X, Mic, ChevronDown, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

// Minimal typings for SpeechRecognition API
type SpeechRecognition = any
type SpeechRecognitionEvent = any

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
  selectedCountry: string
  setSelectedCountry: (country: string) => void
}

interface CourseSuggestion {
  id: string
  title: string
  slug: string
  university?: { title: string }
  degreeProgram?: { name: string }
  department?: { name: string }
  studyArea?: { name: string }
  studyYear?: { name: string }
  studyMode?: { name: string }
}

const countries = [
  'Select Country',
  'Malaysia',
  'Singapore',
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
  const [isListening, setIsListening] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const router = useRouter()

  // Setup SpeechRecognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
      if (SpeechRecognition && !recognitionRef.current) {
        recognitionRef.current = new SpeechRecognition()
        recognitionRef.current.continuous = false
        recognitionRef.current.interimResults = false
        recognitionRef.current.lang = 'en-US'

        recognitionRef.current.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript.trim()
          setSearchQuery(transcript)
          setIsListening(false)
        }
        recognitionRef.current.onerror = () => setIsListening(false)
        recognitionRef.current.onend = () => setIsListening(false)
      }
    }
  }, [])

  const handleMicClick = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop()
        setIsListening(false)
      } else {
        recognitionRef.current.start()
        setIsListening(true)
      }
    }
  }

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
          searchQuery: query.trim(),
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

  // Helper to build courses URL with filters and selected country
  const buildCoursesUrl = (filters: Record<string, string>) => {
    const params = new URLSearchParams()
    if (selectedCountry) params.append('countries', selectedCountry)
    Object.entries(filters).forEach(([key, value]) => {
      if (value) params.append(key, value)
    })
    return `/courses?${params.toString()}`
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
            {/* Country Dropdown */}
            <div className="sboxvdivleft relative flex items-center" ref={dropdownRef}>
              <div className="sboxvdivcontry flex items-center gap-2">
                <button
                  onClick={() => setShowCountriesDropdown(!showCountriesDropdown)}
                  className="flex items-center space-x-1 text-2xl font-bold text-gray-900 hover:text-blue-600 min-w-0"
                  type="button"
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
                        type="button"
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
                placeholder="Search courses, universities, programs..."
                className="w-full p-3 pl-4 pr-28 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <div className="sboxvdivmigsech absolute items-center space-x-2">
                <button
                  className={`bthicon p-1 ${isListening ? 'text-blue-600' : 'text-gray-500'} hover:text-blue-600`}
                  type="button"
                  onClick={handleMicClick}
                  aria-label={isListening ? "Stop voice input" : "Start voice input"}
                >
                  <Mic className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} />
                </button>
                {isListening && (
                  <span className="text-xs text-blue-600 ml-2">Listening...</span>
                )}
                <button
                  className="btnsnow bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-md text-sm font-medium"
                  onClick={() => {
                    const params = new URLSearchParams()
                    if (searchQuery.trim()) params.append('searchQuery', searchQuery.trim())
                    if (selectedCountry) params.append('countries', selectedCountry)
                    router.push(`/courses?${params.toString()}`)
                    onClose()
                  }}
                  type="button"
                >
                  Search Now
                </button>
              </div>

              {/* Search Suggestions Dropdown */}
              {searchQuery && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-96 overflow-y-auto serchresultbox">
                  {isLoading ? (
                    <div className="px-4 py-2 text-sm text-gray-500 serchresultitem">Loading...</div>
                  ) : suggestions.length > 0 ? (
                    suggestions.map((course) => (
                      <div key={course.id} className="px-4 py-3 hover:bg-gray-50 flex flex-col border-b border-gray-100 last:border-b-0">
                        {/* Course title - click to detail page */}
                        <button
                          onClick={() => {
                            router.push(`/courses/${course.slug}`)
                            onClose()
                          }}
                          className="font-medium text-gray-900 truncate text-left flex items-center gap-2 w-full mainbtnserch"
                          type="button"
                        >
                          <Image src="/media/book-icon.svg" alt="" width={20} height={20} className="flex-shrink-0" />
                          {course.title}
                          <ArrowRight className="w-4 h-4 text-gray-400 flex-shrink-0 ml-auto" />
                        </button>

                        {/* Pills for filters */}
                        <div className="flex flex-wrap gap-2 mt-2 subbtnlistd">
                          {/* University */}
                          {course.university?.title && (
                            <button
                              className="bg-gray-100 px-2 py-1 rounded text-xs hover:bg-blue-100"
                              onClick={(e) => {
                                e.stopPropagation()
                                router.push(buildCoursesUrl({ universities: course.university!.title }))
                                onClose()
                              }}
                              type="button"
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
                                router.push(buildCoursesUrl({ degreePrograms: course.degreeProgram!.name }))
                                onClose()
                              }}
                              type="button"
                            >
                              {course.degreeProgram.name}
                            </button>
                          )}

                          {/* Department */}
                          {course.department?.name && (
                            <button
                              className="bg-gray-100 px-2 py-1 rounded text-xs hover:bg-blue-100"
                              onClick={(e) => {
                                e.stopPropagation()
                                router.push(buildCoursesUrl({ departments: course.department!.name }))
                                onClose()
                              }}
                              type="button"
                            >
                              {course.department.name}
                            </button>
                          )}

                          {/* Study Area */}
                          {course.studyArea?.name && (
                            <button
                              className="bg-gray-100 px-2 py-1 rounded text-xs hover:bg-blue-100"
                              onClick={(e) => {
                                e.stopPropagation()
                                router.push(buildCoursesUrl({ studyAreas: course.studyArea!.name }))
                                onClose()
                              }}
                              type="button"
                            >
                              {course.studyArea.name}
                            </button>
                          )}

                          {/* Study Year */}
                          {course.studyYear?.name && (
                            <button
                              className="bg-gray-100 px-2 py-1 rounded text-xs hover:bg-blue-100"
                              onClick={(e) => {
                                e.stopPropagation()
                                router.push(buildCoursesUrl({ studyYears: course.studyYear!.name }))
                                onClose()
                              }}
                              type="button"
                            >
                              {course.studyYear.name}
                            </button>
                          )}

                          {/* Study Mode */}
                          {course.studyMode?.name && (
                            <button
                              className="bg-gray-100 px-2 py-1 rounded text-xs hover:bg-blue-100"
                              onClick={(e) => {
                                e.stopPropagation()
                                router.push(buildCoursesUrl({ studyModes: course.studyMode!.name }))
                                onClose()
                              }}
                              type="button"
                            >
                              {course.studyMode.name}
                            </button>
                          )}
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
            <div className="sboxvdivright">
              <button
                onClick={onClose}
                className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100 ml-2 flex-shrink-0"
                type="button"
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