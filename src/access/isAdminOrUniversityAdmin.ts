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

// Dynamic admin visibility based on role permissions
export const createRoleBasedAdminVisibility = (collectionSlug: string) => {
  return async ({ user, payload }: { user: any, payload: any }) => {
    if (!user) return true // Hide if not authenticated
    
    // Always show to admin
    if (user?.collection === 'users' && (user as User)?.role === 'admin') {
      return false
    }
    
    // For other users, check role permissions
    let userRole = null
    
    if (user?.collection === 'users') {
      userRole = (user as User)?.role
    } else if (user?.collection === 'universities') {
      userRole = 'university-role'
    } else if (user?.collection === 'students') {
      userRole = 'student-role'
    }
    
    if (!userRole) return true // Hide if no role
    
    try {
      // Get role permissions from settings
      const roleSettings = await payload.find({
        collection: 'role-settings',
        where: {
          roleName: {
            equals: userRole,
          },
        },
      })
      
      const permissions = roleSettings.docs[0]?.permissions || {}
      const collectionPermissions = permissions[collectionSlug]
      
      // Hide if no permissions found or no access granted
      if (!collectionPermissions) return true
      
      // Show if user has any permission on this collection
      return !(collectionPermissions.create || 
               collectionPermissions.read || 
               collectionPermissions.update || 
               collectionPermissions.delete)
    } catch (error) {
      console.error('Error checking role permissions for admin visibility:', error)
      return true // Hide on error
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