'use client'

import React, { useEffect } from 'react'
import { useAuth } from '@payloadcms/ui'
import { useRouter } from 'next/navigation'

export const UniversityRedirect: React.FC = () => {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Check if user is university-role and redirect to their university edit page
    if (user?.collection === 'users' && user?.role === 'university-role' && user?.university) {
      const universityId = typeof user.university === 'object' ? user.university.id : user.university
      if (universityId) {
        // Redirect to edit their own university
        router.push(`/admin/collections/universities/${universityId}`)
      }
    }
  }, [user, router])

  return null
}