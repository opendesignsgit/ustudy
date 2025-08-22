import type { Access } from 'payload'
import type { User } from '@/payload-types'

// Helper function to hide collections from university-role users (return true to hide)
export const hideFromUniversityRole = ({ user }: { user: any }) => {
  // Hide from university-role users (they should only see Universities group)
  if (user?.collection === 'users' && (user as User)?.role === 'university-role') {
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
  if (user?.collection === 'users' && (user as User)?.role === 'admin') {
    return true
  }

  // Allow university-role users for Universities group collections
  if (user?.collection === 'users' && (user as User)?.role === 'university-role') {
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