import type { Access, FieldAccess } from 'payload'
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

export const isAdmin: Access = ({ req: { user } }) => {
  // Return true or false based on if the user has an admin role
  return checkAdminRole(user)
}

export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => {
  // Return true or false based on if the user has an admin role  
  return checkAdminRole(user)
}