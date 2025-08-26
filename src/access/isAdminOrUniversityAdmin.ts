import type { Access } from 'payload'
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

// Helper function to hide collections from university-role users (return true to hide)
export const hideFromUniversityRole = ({ user }: { user: any }) => {
  // Hide from university-role users (they should only see Universities group)
  if (checkUniversityRole(user)) {
    return true
  }

  // Hide from university collection users (they should only access via their dashboard)
  if (user?.collection === 'universities') {
    return true
  }

  // Show to admin and other roles
  return false
}

// Helper function for university-role users to only access Universities group collections
export const isUniversityGroupAccess: Access = ({ req: { user } }) => {
  // Allow if user is admin from Users collection
  if (checkAdminRole(user)) {
    return true
  }

  // Allow university-role users for Universities group collections
  if (checkUniversityRole(user)) {
    return true
  }

  // Allow for other roles (editor, post-editor)  
  if (user?.collection === 'users') {
    return true
  }

  // Allow university collection users for their own operations
  if (user?.collection === 'universities') {
    return true
  }

  return false
}