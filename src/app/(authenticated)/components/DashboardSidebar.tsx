// components/DashboardSidebar.tsx
"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function DashboardSidebar() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setIsLoggedIn(false)
    window.dispatchEvent(new Event("authchange"))
    router.push('/') // or reload page or redirect as needed
  }

  return (
    <aside style={{ width: '200px', borderRight: '1px solid #ddd', padding: '1rem' }}>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ marginBottom: '1rem' }}>
            <Link href="/dashboard/main">
              Main Page
            </Link>
          </li>
          <li style={{ marginBottom: '1rem' }}>
            <Link href="/dashboard/account">
              Account Details
            </Link>
          </li>
          <li style={{ marginBottom: '1rem' }}>
            <Link href="/dashboard/courses">
              Courses Menu
            </Link>
          </li>
          <li>
            <button onClick={handleLogout} style={{ cursor: 'pointer' }}>
              Logout
            </button>
          </li>
        </ul>
      </nav>
    </aside>
  )
}
