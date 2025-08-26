import type { Access, FieldAccess } from 'payload'
import type { User, Role } from '@/payload-types'

const checkUniversityRole = (user: any): boolean => {
  if (!user || user.collection !== 'users') return false
  
  // Check for old string-based role system (backward compatibility)
  if (typeof user.role === 'string') {
    return user.role === 'university-role'
  }
  
  // Check for new role collection system
  if (typeof user.role === 'object' && user.role?.name) {
    return user.role.name === 'university-role'
  }
  
  return false
}

const checkAdminRole = (user: any): boolean => {
  if (!user || user.collection !== 'users') return false
  
  // Check for old string-based role system (backward compatibility)
  if (typeof user.role === 'string') {
    return user.role === 'admin'
  }
  
  // Check for new role collection system
  if (typeof user.role === 'object' && user.role?.name) {
    return user.role.name === 'admin'
  }
  
  return false
}

export const isUniversityUser: Access = ({ req: { user } }) => {
  // Return true if user has university-role from Users collection
  return checkUniversityRole(user)
}

export const isUniversityUserFieldLevel: FieldAccess = ({ req: { user } }) => {
  // Return true if user has university-role from Users collection
  return checkUniversityRole(user)
}

export const isAdminOrUniversityUser: Access = ({ req: { user } }) => {
  // Allow if user is admin or university-role from Users collection, or from Universities collection
  return Boolean(
    checkAdminRole(user) || checkUniversityRole(user) || user?.collection === 'universities'
  )
}