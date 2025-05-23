'use client'

import React, { useState, useEffect, useRef } from 'react'
import { SearchIcon, X } from 'lucide-react'
import { CMSLink } from '@/components/Link'
import type { Header as HeaderType } from '@/payload-types'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const searchInputRef = useRef<HTMLInputElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)
  const navItems = data?.navItems || []

  // Toggle search modal
  const toggleSearch = () => {
    setIsSearchOpen(prev => !prev)
  }

  // Close modal when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false)
      }
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsSearchOpen(false)
      }
    }

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside)
      document.addEventListener('keydown', handleEscape)
      searchInputRef.current?.focus()
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = ''
    }
  }, [isSearchOpen])

  return (
    <>
      {/* Original Navigation with Search Button */}
      <nav className="flex gap-6 items-center relative z-30">
        {navItems.map(({ link }, i) => {
          return <CMSLink key={i} {...link} appearance="link" />
        })}
        
        <button
          onClick={toggleSearch}
          className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 transition-colors duration-200"
          aria-label="Search"
        >
          <SearchIcon className="w-5 h-5 flex-shrink-0" />
          <span className="hidden md:inline text-sm font-medium">Search</span>
        </button>
      </nav>

      {/* Enhanced Overlapping Modal */}
      <div 
        className={`fixed inset-0 z-40 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${isSearchOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        style={{ top: 'var(--header-height, 64px)' }} // Use CSS variable for flexibility
      >
        {/* Sophisticated Backdrop */}
        <div 
          className={`absolute inset-0 bg-gradient-to-b from-black/40 to-black/20 backdrop-blur-md transition-opacity duration-500 ${isSearchOpen ? 'opacity-100' : 'opacity-0'}`}
          onClick={() => setIsSearchOpen(false)}
        />
        
        {/* Premium Modal Content */}
        <div 
          ref={modalRef}
          className={`relative bg-white shadow-2xl w-full mx-auto transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isSearchOpen ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}
        >
          <div className="px-6 py-5 border-b border-gray-100">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900">What do you want to learn today?</h2>
              <button 
                onClick={() => setIsSearchOpen(false)}
                className="p-1.5 rounded-full hover:bg-gray-50 transition-colors duration-200"
                aria-label="Close search"
              >
                <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
              </button>
            </div>
          </div>
          
          <div className="p-6">
            <div className="relative">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search courses, countries, universities..."
                className="w-full p-4 pl-5 pr-32 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-700 placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg transition-all duration-200 hover:shadow-md"
                onClick={() => console.log('Searching for:', searchQuery)}
              >
                <span className="font-medium">Search Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Add this to your global CSS or layout component */}
      <style jsx global>{`
        :root {
          --header-height: 64px; /* Adjust to match your header height */
        }
      `}</style>
    </>
  )
}