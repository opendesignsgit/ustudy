import type { Access } from 'payload'
import type { User } from '@/payload-types'

// Helper function to hide collections from roles that don't have permission (return true to hide)
export const hideFromUniversityRole = ({ user }: { user: any }) => {
  // Don't hide from admin users
  if (user?.collection === 'users' && (user as User)?.role === 'admin') {
    return false
  }

  // Hide from university-role users for posts, categories by default
  // They should use the role-based access system to determine visibility
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

// Dynamic admin visibility based on role permissions (non-async version)
export const createRoleBasedAdminVisibility = (collectionSlug: string) => {
  return ({ user }: { user: any }) => {
    if (!user) return true // Hide if not authenticated
    
    // Always show to admin
    if (user?.collection === 'users' && (user as User)?.role === 'admin') {
      return false
    }
    
    // For other users, use basic role check (simplified)
    let userRole: string | null = null
    
    if (user?.collection === 'users') {
      userRole = (user as User)?.role || null
    } else if (user?.collection === 'universities') {
      userRole = 'university-role'
    } else if (user?.collection === 'students') {
      userRole = 'student-role'
    }
    
    if (!userRole) return true // Hide if no role
    
    // Use basic logic without async database calls
    // This is a simplified check - for full permissions use the access controls
    switch (collectionSlug) {
      case 'categories':
      case 'posts':
      case 'pages':
        return userRole === 'university-role' // Hide from university users
      case 'media':
        return false // Show to all authenticated users
      default:
        return false // Show by default
    }
  }
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