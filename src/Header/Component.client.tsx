'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  /* Storing the value in a useState to avoid hydration errors */
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()
  const [sticky, setSticky] = useState(false)

  useEffect(() => {
    setHeaderTheme(null)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [headerTheme])

  useEffect(() => {
    const handleScroll = () => {
      setSticky(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <header
      className={`relative z-20 ${sticky ? 'sticky top-0' : ''}`}
      style={{
        backgroundColor: sticky ? '#fff' : '#fff',
        boxShadow: sticky ? '0px 2px 4px rgba(0, 0, 0, 0.1)' : 'none',
      }}
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="container">
        <div className="py-8 flex justify-between">
          <div className='headlogo'><Link href="/">
            <Logo loading="eager" priority="high" className="" />
          </Link></div>
          <HeaderNav data={data} />
        </div>
      </div>
    </header>
  )
}