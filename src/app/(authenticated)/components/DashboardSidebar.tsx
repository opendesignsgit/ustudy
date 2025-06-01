// components/DashboardSidebar.tsx
"use client"
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'

export default function DashboardSidebar() {
  const router = useRouter()

  const handleLogout = () => {
    // Implement your logout logic (e.g., clear tokens, session, etc.)
    router.push('/login')
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
