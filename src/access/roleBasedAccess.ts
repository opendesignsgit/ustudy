import type { Access, FieldAccess } from 'payload'
import type { User } from '@/payload-types'

/**
 * Role-based access control system
 * Checks permissions from RoleSettings collection or falls back to default rules
 */

// Helper function to get user role and university
const getUserInfo = (user: any) => {
  if (user?.collection === 'users') {
    return {
      role: (user as User)?.role,
      university: (user as User)?.university,
      collection: 'users'
    }
  }
  if (user?.collection === 'universities') {
    return {
      role: 'university-role', // Universities collection users act as university-role
      university: user.id,
      collection: 'universities'
    }
  }
  return {
    role: null,
    university: null,
    collection: null
  }
}

/**
 * Create role-based access control for a specific operation and collection
 */
export const createRoleBasedAccess = (
  operation: 'create' | 'read' | 'update' | 'delete',
  collectionSlug: string,
  options: {
    fallbackAdmin?: boolean,
    allowSelfControl?: boolean,
    publicRead?: boolean
  } = {}
): Access => {
  return async ({ req: { user, payload }, id, data }) => {
    const { fallbackAdmin = true, allowSelfControl = true, publicRead = false } = options
    
    // Allow public read if specified
    if (operation === 'read' && publicRead && !user) {
      return true
    }

    // Require authentication for all operations
    if (!user) {
      return false
    }

    const userInfo = getUserInfo(user)
    
    // Admin always has full access (fallback)
    if (fallbackAdmin && userInfo.role === 'admin') {
      return true
    }

    try {
      // Try to get role settings from database
      const roleSettings = await payload.find({
        collection: 'role-settings',
        where: {
          roleName: {
            equals: userInfo.role
          }
        },
        limit: 1
      })

      if (roleSettings.docs.length > 0) {
        const settings = roleSettings.docs[0]
        const permissions = (settings as any).permissions?.[collectionSlug]

        if (permissions && permissions[operation]) {
          // Check if self-control is enabled for this permission
          if (permissions.selfControl && allowSelfControl) {
            return await checkSelfControl(user, payload, collectionSlug, id, data)
          }
          return true
        }
      }
    } catch (error) {
      console.error('Error checking role settings:', error)
    }

    // Fallback to default rules if no role settings found
    return getDefaultPermission(userInfo.role, operation, collectionSlug, user, id, data, payload)
  }
}

/**
 * Check if user can access their own content (self-control)
 */
const checkSelfControl = async (user: any, payload: any, collectionSlug: string, id?: string | number, data?: any) => {
  const userInfo = getUserInfo(user)

  // For university-role users, check university-specific access
  if (userInfo.role === 'university-role' && userInfo.university) {
    switch (collectionSlug) {
      case 'universities':
        // Can only access their own university
        return id ? Number(userInfo.university) === Number(id) : true
        
      case 'university-pages':
      case 'courses':
        // Can only access pages/courses for their university
        if (data?.university) {
          const targetUniversityId = typeof data.university === 'object' ? data.university.id : data.university
          return Number(userInfo.university) === Number(targetUniversityId)
        }
        
        if (id) {
          try {
            const doc = await payload.findByID({
              collection: collectionSlug,
              id,
              user,
            })
            const docUniversityId = typeof doc.university === 'object' ? doc.university.id : doc.university
            return Number(userInfo.university) === Number(docUniversityId)
          } catch (error) {
            return false
          }
        }
        return true
        
      case 'bookings':
        // Can only read bookings for their own courses
        if (data?.course) {
          // Check if the course belongs to their university
          try {
            const courseId = typeof data.course === 'object' ? data.course.id : data.course
            const course = await payload.findByID({
              collection: 'courses',
              id: courseId,
              user,
            })
            const courseUniversityId = typeof course.university === 'object' ? course.university.id : course.university
            return Number(userInfo.university) === Number(courseUniversityId)
          } catch (error) {
            return false
          }
        }
        
        if (id) {
          try {
            const booking = await payload.findByID({
              collection: 'bookings',
              id,
              user,
            })
            const courseId = typeof booking.course === 'object' ? booking.course.id : booking.course
            const course = await payload.findByID({
              collection: 'courses',
              id: courseId,
              user,
            })
            const courseUniversityId = typeof course.university === 'object' ? course.university.id : course.university
            return Number(userInfo.university) === Number(courseUniversityId)
          } catch (error) {
            return false
          }
        }
        return true
        
      default:
        // For other collections, check if user created the content
        if (data?.createdBy) {
          return user.id === data.createdBy
        }
        if (id) {
          try {
            const doc = await payload.findByID({
              collection: collectionSlug,
              id,
              user,
            })
            return user.id === doc.createdBy
          } catch (error) {
            return false
          }
        }
        return true
    }
  }

  // For other roles, check if they created the content
  if (data?.createdBy) {
    return user.id === data.createdBy
  }
  
  if (id) {
    try {
      const doc = await payload.findByID({
        collection: collectionSlug,
        id,
        user,
      })
      return user.id === doc.createdBy
    } catch (error) {
      return false
    }
  }
  
  return true
}

/**
 * Default permissions when no role settings are found
 */
const getDefaultPermission = (role: string | null, operation: string, collectionSlug: string, user: any, id?: string | number, data?: any, payload?: any) => {
  switch (role) {
    case 'admin':
      return true
      
    case 'university-role':
      // University users can manage their own university-related content
      switch (collectionSlug) {
        case 'universities':
          return operation !== 'create' && operation !== 'delete' // Can read/update own university
        case 'university-pages':
        case 'courses':
        case 'media':
          return true // Full access to manage their content
        case 'bookings':
          return operation === 'read' // Can only read enrollments for their courses
        default:
          return false
      }
      
    case 'editor':
      // Editors can manage posts, media, and categories
      return ['posts', 'media', 'categories'].includes(collectionSlug)
      
    case 'post-editor':
      // Post editors can only manage posts (no delete)
      return collectionSlug === 'posts' && operation !== 'delete'
      
    default:
      return false
  }
}

/**
 * Create visibility control for admin panel (returns true to hide)
 */
export const createRoleBasedVisibility = (collectionSlug: string) => {
  return ({ user }: { user: any }) => {
    if (!user) return true

    const userInfo = getUserInfo(user)
    
    // Admin can see everything
    if (userInfo.role === 'admin') {
      return false
    }

    // University-role users can only see Universities group collections
    if (userInfo.role === 'university-role') {
      const allowedCollections = ['universities', 'university-pages', 'courses', 'bookings', 'media']
      return !allowedCollections.includes(collectionSlug)
    }

    // Editor can see content management collections
    if (userInfo.role === 'editor') {
      const allowedCollections = ['posts', 'media', 'categories']
      return !allowedCollections.includes(collectionSlug)
    }

    // Post editor can only see posts
    if (userInfo.role === 'post-editor') {
      return collectionSlug !== 'posts'
    }

    // Hide from unknown roles
    return true
  }
}

/**
 * Role-based field access control
 */
export const createRoleBasedFieldAccess = (
  operation: 'create' | 'read' | 'update',
  collectionSlug: string,
  fieldName: string
): FieldAccess => {
  return ({ req: { user } }) => {
    if (!user) return false

    const userInfo = getUserInfo(user)
    
    // Admin always has access
    if (userInfo.role === 'admin') {
      return true
    }

    // Specific field restrictions
    if (fieldName === 'role' || fieldName === 'university') {
      // Only admin can modify role and university associations
      return false
    }

    // For university collections, prevent email updates
    if (collectionSlug === 'universities' && fieldName === 'email' && operation === 'update') {
      return false
    }

    return true
  }
}