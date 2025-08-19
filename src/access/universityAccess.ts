import type { AccessArgs } from 'payload'
import type { User, University } from '@/payload-types'

// Type for access functions that work with both User and University
type AccessFunction = (args: AccessArgs<User | University>) => boolean

// Check if the current user is an authenticated university
export const isUniversity: AccessFunction = ({ req: { user } }) => {
  // Check if user exists and is from the universities collection
  return Boolean(user && (user as any).collection === 'universities')
}

// Check if the current user is an authenticated admin (from users collection)
export const isAdmin: AccessFunction = ({ req: { user } }) => {
  // Check if user exists and is from the users collection (admin users)
  return Boolean(user && (user as any).collection === 'users')
}

// Check if the current user is authenticated (either admin or university)
export const isAuthenticated: AccessFunction = ({ req: { user } }) => {
  return Boolean(user)
}

// Access control for universities to only access their own data
export const universitySelfAccess: AccessFunction = ({ req: { user }, id }) => {
  // If no user, deny access
  if (!user) return false
  
  // If admin user, allow access to all
  if ((user as any).collection === 'users') return true
  
  // If university user, only allow access to their own record
  if ((user as any).collection === 'universities') {
    return user.id === id
  }
  
  return false
}

// Access control for university pages - universities can only access their own pages
export const universityPagesAccess = {
  create: ({ req: { user } }: AccessArgs<User | University>) => {
    return Boolean(user) // Any authenticated user can create
  },
  read: () => true, // Public read access for published pages
  update: ({ req: { user }, doc }: AccessArgs<User | University> & { doc: any }) => {
    if (!user) return false
    
    // Admins can edit all pages
    if ((user as any).collection === 'users') return true
    
    // Universities can only edit their own pages
    if ((user as any).collection === 'universities') {
      return doc?.university === user.id
    }
    
    return false
  },
  delete: ({ req: { user }, doc }: AccessArgs<User | University> & { doc: any }) => {
    if (!user) return false
    
    // Admins can delete all pages
    if ((user as any).collection === 'users') return true
    
    // Universities can only delete their own pages
    if ((user as any).collection === 'universities') {
      return doc?.university === user.id
    }
    
    return false
  }
}

// Query constraint for universities to only see their own pages
export const universityPagesFilter = ({ req: { user } }: AccessArgs<User | University>) => {
  // If no user, return false (no access)
  if (!user) return false
  
  // If admin, return true (access to all)
  if ((user as any).collection === 'users') return true
  
  // If university, filter to only their pages
  if ((user as any).collection === 'universities') {
    return {
      university: {
        equals: user.id
      }
    }
  }
  
  return false
}