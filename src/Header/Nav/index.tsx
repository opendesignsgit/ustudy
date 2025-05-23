'use client'

import React, { useState } from 'react'
import { SearchIcon, MenuIcon, XIcon } from 'lucide-react'
import { CMSLink } from '@/components/Link'
import type { Header as HeaderType } from '@/payload-types'
import { SearchModal } from './SearchModal'
import Image from 'next/image'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState('Malaysia')
  const navItems = data?.navItems || []

  return (
    <>
      {/* Mobile controls - hamburger and search */}
      <div className="md:hidden flex items-center space-x-4">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-600 hover:text-blue-600 transition-colors duration-300"
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {isMenuOpen ? (
            <XIcon className="w-6 h-6 transition-transform duration-300 rotate-180" />
          ) : (
            <MenuIcon className="w-6 h-6 transition-transform duration-300" />
          )}
        </button>

        <button
          onClick={() => {
            setIsSearchOpen(true)
            setIsMenuOpen(false)
          }}
          className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
          aria-label="Search"
        >
          <SearchIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Desktop navigation */}
      <nav className="hidden md:flex items-center space-x-6">
        {navItems.map(({ link }, i) => {
          return (
            <CMSLink
              key={i}
              {...link}
              appearance="link"
              className="transition-colors duration-200 hover:text-blue-600"
            />
          )
        })}

        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors duration-200"
        >
          <SearchIcon className="w-5 h-5" />
          <span className="hidden md:inline text-sm font-medium">Search</span>
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={` hamburgerNavs
        md:hidden fixed top-0 left-0 w-full h-full bg-white z-50
        transition-all duration-300 ease-in-out
        ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <div className="humnavheader">
          <div className="container">
            <div className="humnavlogo flex justify-between items-center">
              <div className="humlogo">
                <Image
                  src="/media/ustudylogo/ustudy-logo.png"
                  alt=""
                  width="100"
                  height="80"
                ></Image>
              </div>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-600 hover:text-blue-600 transition-colors duration-200 closebtn"
              >
                <XIcon className="w-8 h-8" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-6 humnavLists">
          <div className="container">
            <ul>
              {navItems.map(({ link }, i) => {
                return (
                  <li key={i}>
                    <CMSLink
                      key={i}
                      {...link}
                      appearance="link"
                      className="
                    block py-3 px-4 text-xl
                    hover:bg-gray-50 rounded-lg
                    transition-all duration-200
                    hover:pl-6 hover:text-blue-600
                  "
                      onClick={() => setIsMenuOpen(false)}
                    />
                  </li>
                )
              })}
            </ul>
            <button
              onClick={() => {
                setIsSearchOpen(true)
                setIsMenuOpen(false)
              }}
              className="
                flex items-center space-x-3 
                text-gray-600 hover:text-blue-600 
                transition-colors duration-200
                py-3 px-4 text-xl
                hover:bg-gray-50 rounded-lg
              "
            >
              <SearchIcon className="w-6 h-6" />
              <span className="font-medium">Search</span>
            </button>
          </div>
        </div>
      </div>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
      />
    </>
  )
}
