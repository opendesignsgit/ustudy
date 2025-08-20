import type { CollectionConfig } from 'payload'
import type { PayloadRequest } from 'payload'

/**
 * Multi-Collection Admin Authentication Strategy
 * 
 * This module provides authentication strategies to allow both Users and Universities
 * collections to access the PayloadCMS admin panel. Since PayloadCMS admin.user
 * configuration only supports a single collection, this creates a bridge for
 * cross-collection authentication.
 */

/**
 * Custom authentication logic for admin access that validates against both collections
 */
export const adminAccessControl = ({ req: { user } }: { req: { user: any } }) => {
  if (!user) return false
  
  // Allow admin users from Users collection full access
  if ((user as any).collection === 'users') return true
  
  // Allow university users from Universities collection access to admin panel
  if ((user as any).collection === 'universities') return true
  
  return false
}

/**
 * Enhanced beforeLogin hook that ensures proper collection identification
 * for cross-collection authentication in the admin panel
 */
export const enhancedBeforeLogin = async ({ req, user }: { req: PayloadRequest; user: any }) => {
  if (!user) return user

  // Collection should already be properly set by PayloadCMS
  // Don't override it - let PayloadCMS handle collection identification
  
  // Log successful authentication for debugging
  console.log(`Admin authentication: ${user.email} (collection: ${user.collection || 'unknown'})`)

  return user
}

/**
 * Create a unified auth configuration that supports both collections
 */
export const createMultiCollectionAuthConfig = (primaryCollection: string = 'universities') => {
  return {
    // Use Universities as primary auth collection for admin
    adminUser: primaryCollection,
    
    // Custom access control that works across collections
    adminAccess: adminAccessControl,
    
    // Enhanced login hook for proper session management
    beforeLoginHook: enhancedBeforeLogin,
  }
}

/**
 * Authentication middleware that can validate users from either collection
 * This can be used in endpoints or custom routes
 */
export const validateAdminUser = async (req: PayloadRequest): Promise<boolean> => {
  const { user } = req

  if (!user) return false

  try {
    // Check if user exists in Users collection
    if ((user as any).collection === 'users') {
      const userRecord = await req.payload.findByID({
        collection: 'users',
        id: user.id,
      })
      return !!userRecord
    }

    // Check if user exists in Universities collection  
    if ((user as any).collection === 'universities') {
      const universityRecord = await req.payload.findByID({
        collection: 'universities',
        id: user.id,
      })
      return !!universityRecord
    }

    return false
  } catch (error) {
    console.error('Admin user validation error:', error)
    return false
  }
}