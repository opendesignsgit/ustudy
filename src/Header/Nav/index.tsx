'use client'

import React, { useState, useEffect } from 'react'
import { SearchIcon, MenuIcon, XIcon } from 'lucide-react'
import { CMSLink } from '@/components/Link'
import type { Header as HeaderType } from '@/payload-types'
import { SearchModal } from './SearchModal'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState('Malaysia')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const navItems = data?.navItems || []
  const router = useRouter()

  // Check login state on mount and on custom "authchange" event (for live updates)
  useEffect(() => {
    const checkLogin = () => {
      setIsLoggedIn(!!localStorage.getItem("token"))
    }
    checkLogin()
    window.addEventListener("authchange", checkLogin)
    return () => window.removeEventListener("authchange", checkLogin)
  }, [])

  useEffect(() => {
    if (isSearchOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isSearchOpen])

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    window.dispatchEvent(new Event("authchange"))
    router.push('/') // or reload page or redirect as needed
  }

  return (
    <>
      {/* Mobile controls - hamburger and search */}
      <div className="md:hidden flex items-center space-x-4">
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

        {/* Login/Signup/Logout Buttons */}
        {!isLoggedIn && (
          <>
            <button
              onClick={() => {
                router.push('/login')
                // fire authchange event for immediate update on login in single-page apps
                window.dispatchEvent(new Event("authchange"))
              }}
              className="ml-4 px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
            >
              Login
            </button>
            <button
              onClick={() => {
                router.push('/register')
                window.dispatchEvent(new Event("authchange"))
              }}
              className="ml-2 px-4 py-2 rounded border border-blue-600 text-blue-600 font-semibold hover:bg-blue-600 hover:text-white transition"
            >
              Sign Up
            </button>
          </>
        )}
        {isLoggedIn && (
          <button
            onClick={handleLogout}
            className="ml-4 px-4 py-2 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
          >
            Logout
          </button>
        )}
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
                  <li key={i} onClick={() => setIsMenuOpen(false)}>
                    <CMSLink
                      {...link}
                      appearance="link"
                      className="block py-3 px-4 text-xl hover:bg-gray-50 rounded-lg transition-all duration-200 hover:pl-6 hover:text-blue-600"
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

            {/* Mobile Login/Signup/Logout Buttons */}
            <div className="mt-8 flex space-x-4">
              {!isLoggedIn && (
                <>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      router.push('/login')
                      window.dispatchEvent(new Event("authchange"))
                    }}
                    className="flex-1 px-4 py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => {
                      setIsMenuOpen(false)
                      router.push('/register')
                      window.dispatchEvent(new Event("authchange"))
                    }}
                    className="flex-1 px-4 py-2 rounded border border-blue-600 text-blue-600 font-semibold hover:bg-blue-600 hover:text-white transition"
                  >
                    Sign Up
                  </button>
                </>
              )}
              {isLoggedIn && (
                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    handleLogout()
                  }}
                  className="flex-1 px-4 py-2 rounded bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition"
                >
                  Logout
                </button>
              )}
            </div>
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