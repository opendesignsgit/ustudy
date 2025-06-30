'use client'

import React, { useState, useEffect, useRef } from 'react'
import { SearchIcon, MenuIcon, XIcon, User2 } from 'lucide-react'
import { CMSLink } from '@/components/Link'
import type { Header as HeaderType } from '@/payload-types'
import { SearchModal } from './SearchModal'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/providers/Auth'

export const HeaderNav: React.FC<{ data: HeaderType }> = ({ data }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState('Malaysia')
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [showProfileMenuMobile, setShowProfileMenuMobile] = useState(false)
  const navItems = data?.navItems || []
  const router = useRouter()
  const profileMenuRef = useRef<HTMLDivElement>(null)
  const profileMenuMobileRef = useRef<HTMLDivElement>(null)
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null)

  // Use AuthProvider for user info
  const { user: authUser } = useAuth()

  // Extract user info from AuthProvider
  const isLoggedIn = !!authUser?.user?.id
  const userName = authUser?.user?.name || authUser?.user?.username || authUser?.user?.email?.split('@')[0] || 'User'
  const userProfilePic = authUser?.user?.profilePic

  // Dropdown: close on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false)
      }
      if (profileMenuMobileRef.current && !profileMenuMobileRef.current.contains(event.target as Node)) {
        setShowProfileMenuMobile(false)
      }
    }
    if (showProfileMenu || showProfileMenuMobile) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showProfileMenu, showProfileMenuMobile])

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
    window.dispatchEvent(new Event("authchange"))
    router.push('/login')
  }

  // Glitch-free hover logic for dropdown
  function handleTagMouseEnter() {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
    setShowProfileMenu(true)
  }
  function handleTagMouseLeave() {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
    hoverTimeout.current = setTimeout(() => setShowProfileMenu(false), 120)
  }

  function handleDropdownMouseEnter() {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
    setShowProfileMenu(true)
  }
  function handleDropdownMouseLeave() {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current)
    hoverTimeout.current = setTimeout(() => setShowProfileMenu(false), 120)
  }

  return (
    <>
      {/* Mobile controls - hamburger, search, user icon */}
      <div className="md:hidden flex items-center space-x-2">
        <button
          onClick={() => setIsSearchOpen(true)}
          className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
          aria-label="Search"
        >
          <SearchIcon className="w-5 h-5" />
        </button>
        {isLoggedIn && (
          <div className="relative" ref={profileMenuMobileRef}>
            <span
              className="flex items-center justify-center rounded-full border border-[#d1d5db] bg-[#f9fbfc] hover:bg-[#f5faff] transition-all duration-200 p-2 cursor-pointer"
              onClick={() => setShowProfileMenuMobile((s) => !s)}
              tabIndex={0}
            >
              {userProfilePic ? (
                <img
                  src={userProfilePic}
                  alt="Profile"
                  className="w-7 h-7 rounded-full object-cover"
                />
              ) : (
                <User2 className="w-7 h-7 text-[#0056D2]" />
              )}
            </span>
            {/* Mobile Dropdown */}
            <div
              className={`absolute right-0 mt-2 w-56 rounded-xl bg-white border border-gray-100 shadow-2xl z-50 transition-all duration-200
                ${showProfileMenuMobile ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
              style={{ minWidth: 220 }}
            >
              <span className="px-6 py-3 font-bold text-[#232323] text-base border-b border-gray-100 flex items-center gap-2">
                {userProfilePic && (
                  <img src={userProfilePic} alt="Profile" className="w-7 h-7 rounded-full object-cover" />
                )}
                {userName}
              </span>
              <button
                onClick={() => { router.push('/account'); setShowProfileMenuMobile(false); }}
                className="w-full text-left px-6 py-4 text-[17px] text-[#232323] hover:bg-[#f5faff] transition-colors font-normal"
              >
                Account details
              </button>
              <button
                onClick={() => { router.push('/my-courses'); setShowProfileMenuMobile(false); }}
                className="w-full text-left px-6 py-4 text-[17px] text-[#232323] hover:bg-[#f5faff] transition-colors font-normal"
              >
                My Course
              </button>
              <button
                onClick={() => { setShowProfileMenuMobile(false); handleLogout(); }}
                className="w-full text-left px-6 py-4 text-[17px] text-red-600 hover:bg-[#fbeaea] transition-colors font-normal"
              >
                Logout
              </button>
            </div>
          </div>
        )}
        {!isLoggedIn && (
          <>
            <span
              onClick={() => router.push('/login')}
              className="font-bold text-base border border-[#d1d5db] rounded-full px-4 py-2 text-black hover:bg-[#f4f4f4] transition-all duration-200 cursor-pointer"
              style={{ minWidth: 80, fontSize: 13 }}
              tabIndex={0}
            >
              LOG IN
            </span>
            <span
              onClick={() => router.push('/register')}
              className="font-bold text-base rounded-full px-4 py-2 bg-[#0056D2] text-white hover:bg-[#1a73e8] transition-all duration-200 cursor-pointer"
              style={{ minWidth: 80, fontSize: 13 }}
              tabIndex={0}
            >
              SIGN UP
            </span>
          </>
        )}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="text-gray-600 hover:text-blue-600 transition-colors duration-300 ml-1"
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
        {navItems.map(({ link }, i) => (
          <CMSLink
            key={i}
            {...link}
            appearance="link"
            className="transition-colors duration-200 hover:text-blue-600"
          />
        ))}

        {/* Search UI */}
        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex items-center space-x-1 text-gray-600 hover:text-blue-600 transition-colors duration-200"
        >
          <SearchIcon className="w-5 h-5" />
          <span className="hidden md:inline text-sm font-medium">Search</span>
        </button>
        {!isLoggedIn ? (
          <>
            <span
              onClick={() => router.push('/login')}
              className="!ml-4 px-8 py-2 rounded-full border border-[#d1d5db] text-black font-bold text-base hover:bg-[#f4f4f4] transition-all duration-200 cursor-pointer"
              style={{ minWidth: 140, display: 'inline-block', userSelect: 'none' }}
              tabIndex={0}
            >
              LOG IN
            </span>
            <span
              onClick={() => router.push('/register')}
              className="!ml-2 px-8 py-2 rounded-full bg-[#0056D2] text-white font-bold text-base hover:bg-[#1a73e8] transition-all duration-200 cursor-pointer"
              style={{ minWidth: 140, display: 'inline-block', userSelect: 'none' }}
              tabIndex={0}
            >
              SIGN UP
            </span>
          </>
        ) : (
          <div
            className="relative"
            ref={profileMenuRef}
            onMouseEnter={handleTagMouseEnter}
            onMouseLeave={handleTagMouseLeave}
          >
            <span
              className="flex items-center px-6 py-2 rounded-full border border-[#d1d5db] bg-[#f9fbfc] hover:bg-[#f5faff] transition-all duration-200 shadow cursor-pointer select-none"
              style={{
                fontWeight: 700,
                fontSize: 18,
                color: '#232323',
                minWidth: 200,
                boxShadow: showProfileMenu ? "0 6px 24px 0 rgba(31, 61, 102, 0.12)" : undefined,
                userSelect: 'none'
              }}
              tabIndex={0}
            >
              {userProfilePic ? (
                <img
                  src={userProfilePic}
                  alt="Profile"
                  className="w-7 h-7 mr-2 rounded-full object-cover"
                />
              ) : (
                <User2 className="w-7 h-7 text-[#0056D2] mr-2" />
              )}
              <span style={{ fontWeight: 700 }}>{userName}</span>
              <svg className="ml-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" strokeWidth={2}
                viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
            </span>
            <div
              className={`absolute left-0 mt-3 rounded-xl bg-white border border-gray-100 shadow-2xl z-50 transition-all duration-200
     ${showProfileMenu ? 'opacity-100 scale-100 pointer-events-auto' : 'opacity-0 scale-95 pointer-events-none'}`}
              style={{
                minWidth: 260,
                boxShadow: '0 6px 24px 0 rgba(31, 61, 102, 0.13)'
              }}
              onMouseEnter={handleDropdownMouseEnter}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <span className="px-6 py-3 font-bold text-[#232323] text-base border-b border-gray-100 flex items-center gap-2">
                {userProfilePic && (
                  <img src={userProfilePic} alt="Profile" className="w-7 h-7 rounded-full object-cover" />
                )}
                {userName}
              </span>
              <a
                onClick={e => { e.preventDefault(); router.push('/account'); setShowProfileMenu(false); }}
                href="/account"
                className="w-full block text-left px-6 py-4 text-[17px] text-[#232323] hover:bg-[#f5faff] transition-colors font-normal cursor-pointer"
                style={{ border: 'none', background: 'none', outline: 'none' }}
                tabIndex={0}
              >
                Account details
              </a>
              <a
                onClick={e => { e.preventDefault(); router.push('/my-courses'); setShowProfileMenu(false); }}
                href="/my-courses"
                className="w-full block text-left px-6 py-4 text-[17px] text-[#232323] hover:bg-[#f5faff] transition-colors font-normal cursor-pointer"
                style={{ border: 'none', background: 'none', outline: 'none' }}
                tabIndex={0}
              >
                My Course
              </a>
              <a
                onClick={e => { e.preventDefault(); setShowProfileMenu(false); handleLogout(); }}
                href="/"
                className="w-full block text-left px-6 py-4 text-[17px] text-red-600 hover:bg-[#fbeaea] transition-colors font-normal cursor-pointer"
                style={{ border: 'none', background: 'none', outline: 'none' }}
                tabIndex={0}
              >
                Logout
              </a>
            </div>
          </div>
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
              {navItems.map(({ link }, i) => (
                <li key={i} onClick={() => setIsMenuOpen(false)}>
                  <CMSLink
                    {...link}
                    appearance="link"
                    className="block py-3 px-4 text-xl hover:bg-gray-50 rounded-lg transition-all duration-200 hover:pl-6 hover:text-blue-600"
                  />
                </li>
              ))}
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
            {/* Mobile Login/Signup/Profile Dropdown (handled in top bar, so nothing here) */}
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