'use client'

import React, { useEffect } from 'react'
import { useAuth } from '@payloadcms/ui'

const UniversityRedirect: React.FC = () => {
  const { user } = useAuth()

  useEffect(() => {
    // Check if user is university-role and redirect to their university edit page
    if (user?.collection === 'users' && user?.role === 'university-role' && user?.university) {
      const universityId = typeof user.university === 'object' ? user.university.id : user.university
      if (universityId && typeof window !== 'undefined') {
        // Redirect to edit their own university
        window.location.href = `/admin/collections/universities/${universityId}`
      }
    }

    // Check if user is from universities collection and redirect to edit their own record
    if (user?.collection === 'universities' && user?.id && typeof window !== 'undefined') {
      // Redirect to edit their own university record
      window.location.href = `/admin/collections/universities/${user.id}`
    }
  }, [user])

  return null
}

export default UniversityRedirect