import type { Access, FieldAccess } from 'payload'
import type { User } from '@/payload-types'

// Get role settings from the database
export const getRoleSettings = async (payload: any, roleName: string) => {
  try {
    const roleSettings = await payload.find({
      collection: 'role-settings',
      where: {
        roleName: {
          equals: roleName,
        },
      },
    })
    
    return roleSettings.docs[0]?.permissions || {}
  } catch (error) {
    console.error('Error fetching role settings:', error)
    return {}
  }
}

// Get user's university ID for self-control checks
const getUserUniversityId = (user: any) => {
  if (user?.collection === 'universities') {
    return user.id
  }
  if (user?.collection === 'users' && user?.university) {
    const university = user.university
    return typeof university === 'object' ? university.id : university
  }
  return null
}

// Check if user can access their own content
const checkSelfControl = async (
  user: any,
  collectionSlug: string,
  payload: any,
  id?: string,
  data?: any
) => {
  if (!user) return false

  const universityId = getUserUniversityId(user)
  
  switch (collectionSlug) {
    case 'universities':
      if (user?.collection === 'universities') {
        return id ? Number(user.id) === Number(id) : true
      }
      if (user?.collection === 'users' && user?.university) {
        const userUniversity = user.university
        const userUniversityId = typeof userUniversity === 'object' ? userUniversity.id : userUniversity
        return id ? Number(userUniversityId) === Number(id) : true
      }
      return false

    case 'courses':
    case 'university-pages':
      if (!universityId) return false
      
      // For create operations
      if (data?.university) {
        const itemUniversityId = typeof data.university === 'object' ? data.university.id : data.university
        return Number(universityId) === Number(itemUniversityId)
      }
      
      // For read/update/delete operations
      if (id) {
        try {
          const item = await payload.findByID({
            collection: collectionSlug,
            id,
            user,
          })
          const itemUniversityId = typeof item.university === 'object' ? item.university.id : item.university
          return Number(universityId) === Number(itemUniversityId)
        } catch (error) {
          return false
        }
      }
      return false

    case 'bookings':
      if (!universityId) return false
      
      // For bookings, check if the course belongs to user's university
      if (data?.course) {
        try {
          const courseId = typeof data.course === 'object' ? data.course.id : data.course
          const course = await payload.findByID({
            collection: 'courses',
            id: courseId,
            user,
          })
          const courseUniversityId = typeof course.university === 'object' ? course.university.id : course.university
          return Number(universityId) === Number(courseUniversityId)
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
          return Number(universityId) === Number(courseUniversityId)
        } catch (error) {
          return false
        }
      }
      return false

    case 'users':
      // Users can only access their own record
      return id ? Number(user.id) === Number(id) : false

    case 'students':
      // Students can only access their own record
      if (user?.collection === 'students') {
        return id ? Number(user.id) === Number(id) : false
      }
      return false

    default:
      // For other collections, only allow access to own created content
      if (id && data?.createdBy) {
        return Number(user.id) === Number(data.createdBy)
      }
      return false
  }
}

// Create role-based access function
export const createRoleBasedAccess = (
  collectionSlug: string,
  operation: 'create' | 'read' | 'update' | 'delete'
): Access => {
  return async ({ req: { user, payload }, id, data }) => {
    if (!user) return false

    // Admin always has access
    if (user?.collection === 'users' && (user as User)?.role === 'admin') {
      return true
    }

    let userRole: string | null = null
    
    // Determine user role
    if (user?.collection === 'users') {
      userRole = (user as User)?.role || null
    } else if (user?.collection === 'universities') {
      userRole = 'university-role'
    } else if (user?.collection === 'students') {
      userRole = 'student-role'
    }

    if (!userRole) return false

    // Get role permissions from settings
    const permissions = await getRoleSettings(payload, userRole)
    const collectionPermissions = permissions[collectionSlug]

    if (!collectionPermissions) return false

    // Check basic permission
    const hasPermission = collectionPermissions[operation] === true

    if (!hasPermission) return false

    // If selfControl is enabled, check if user can access this specific content
    if (collectionPermissions.selfControl === true) {
      return await checkSelfControl(user, collectionSlug, payload, typeof id === 'string' ? id : id?.toString(), data)
    }

    return true
  }
}

// Create role-based query filter for read operations
export const createRoleBasedFilter = (collectionSlug: string): Access => {
  return async ({ req: { user, payload } }): Promise<boolean | any> => {
    if (!user) return false

    // Admin always has access to everything
    if (user?.collection === 'users' && (user as User)?.role === 'admin') {
      return true
    }

    let userRole: string | null = null
    
    // Determine user role
    if (user?.collection === 'users') {
      userRole = (user as User)?.role || null
    } else if (user?.collection === 'universities') {
      userRole = 'university-role'
    } else if (user?.collection === 'students') {
      userRole = 'student-role'
    }

    if (!userRole) return false

    // Get role permissions from settings
    const permissions = await getRoleSettings(payload, userRole)
    const collectionPermissions = permissions[collectionSlug]

    if (!collectionPermissions || !collectionPermissions.read) return false

    // If selfControl is enabled, filter to only user's content
    if (collectionPermissions.selfControl === true) {
      const universityId = getUserUniversityId(user)

      switch (collectionSlug) {
        case 'universities':
          if (user?.collection === 'universities') {
            return {
              id: {
                equals: Number(user.id),
              }
            }
          }
          if (user?.collection === 'users' && user?.university) {
            const userUniversity = user.university
            const userUniversityId = typeof userUniversity === 'object' ? userUniversity.id : userUniversity
            return {
              id: {
                equals: Number(userUniversityId),
              }
            }
          }
          return false

        case 'courses':
        case 'university-pages':
          if (universityId) {
            return {
              university: {
                equals: Number(universityId),
              }
            }
          }
          return false

        case 'bookings':
          if (universityId) {
            // Filter bookings for courses that belong to user's university
            return {
              'course.university': {
                equals: Number(universityId),
              }
            }
          }
          return false

        case 'users':
          return {
            id: {
              equals: Number(user.id),
            }
          }

        case 'students':
          if (user?.collection === 'students') {
            return {
              id: {
                equals: Number(user.id),
              }
            }
          }
          return false

        default:
          return false
      }
    }

    return true
  }
}

// Field-level access control
export const createRoleBasedFieldAccess = (
  collectionSlug: string,
  fieldName: string,
  operation: 'create' | 'read' | 'update'
): FieldAccess => {
  return async ({ req: { user, payload } }) => {
    if (!user) return false

    // Admin always has access
    if (user?.collection === 'users' && (user as User)?.role === 'admin') {
      return true
    }

    let userRole: string | null = null
    
    // Determine user role
    if (user?.collection === 'users') {
      userRole = (user as User)?.role || null
    } else if (user?.collection === 'universities') {
      userRole = 'university-role'
    } else if (user?.collection === 'students') {
      userRole = 'student-role'
    }

    if (!userRole) return false

    // Get role permissions from settings
    const permissions = await getRoleSettings(payload, userRole)
    const collectionPermissions = permissions[collectionSlug]

    if (!collectionPermissions) return false

    // Check if user has the required operation permission on the collection
    return collectionPermissions[operation] === true
  }
}

// Admin panel access - simplified to return boolean only
export const createRoleBasedAdminAccess = (collectionSlug: string) => {
  return async ({ req: { user, payload } }: { req: { user: any, payload: any } }): Promise<boolean> => {
    if (!user) return false

    // Admin always has access
    if (user?.collection === 'users' && (user as User)?.role === 'admin') {
      return true
    }

    let userRole: string | null = null
    
    // Determine user role
    if (user?.collection === 'users') {
      userRole = (user as User)?.role || null
    } else if (user?.collection === 'universities') {
      userRole = 'university-role'
    } else if (user?.collection === 'students') {
      userRole = 'student-role'
    }

    if (!userRole) return false

    // Get role permissions from settings
    const permissions = await getRoleSettings(payload, userRole)
    const collectionPermissions = permissions[collectionSlug]

    // User can access admin panel for this collection if they have any permission
    return !!(collectionPermissions && (
      collectionPermissions.create ||
      collectionPermissions.read ||
      collectionPermissions.update ||
      collectionPermissions.delete
    ))
  }
}