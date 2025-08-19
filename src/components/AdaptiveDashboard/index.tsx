import React from 'react'
import { useAuth } from '@payloadcms/ui'
import BeforeDashboard from '../BeforeDashboard'
import UniversityDashboard from '../UniversityDashboard'

const AdaptiveDashboard: React.FC = () => {
  const { user } = useAuth()
  
  // Check if user is from universities collection
  const isUniversity = user && (user as any).collection === 'universities'
  
  if (isUniversity) {
    return <UniversityDashboard />
  }
  
  // Default to regular admin dashboard
  return <BeforeDashboard />
}

export default AdaptiveDashboard