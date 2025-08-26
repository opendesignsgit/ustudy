import type { Access } from 'payload'
import type { User, Role } from '@/payload-types'

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

export const isAdminOrSelf: Access = ({ req: { user }, id }) => {
  // Allow if user is admin from Users collection
  if (checkAdminRole(user)) {
    return true
  }

  // Allow if user is accessing their own record
  return Boolean(user && id && user.id === id)
}