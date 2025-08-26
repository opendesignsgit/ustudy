import type { Access } from 'payload'
import type { User, Role } from '@/payload-types'

export const hasRolePrivilege = async (
  req: any,
  collection: string,
  privilege: 'view' | 'create' | 'edit' | 'delete' | 'selfControl'
): Promise<boolean> => {
  try {
    const user = req.user as User

    if (!user) return false

    // Admin always has all privileges
    if (user.collection === 'users' && user.role === 'admin') {
      return true
    }

    // Get user's role
    let role: Role | null = null
    
    if (user.role && typeof user.role === 'object') {
      role = user.role as Role
    } else if (user.role && typeof user.role === 'string') {
      // If role is a string ID, fetch the role
      try {
        role = await req.payload.findByID({
          collection: 'roles',
          id: user.role,
        })
      } catch (error) {
        console.error('Error fetching role:', error)
        return false
      }
    }

    if (!role || !role.privileges) return false

    // Find privilege for the collection
    const collectionPrivilege = role.privileges.find(
      (p: any) => p.collection === collection
    )

    if (!collectionPrivilege) return false

    return Boolean(collectionPrivilege[privilege])
  } catch (error) {
    console.error('Error checking role privilege:', error)
    return false
  }
}

export const roleBasedAccess = (
  collection: string,
  privilege: 'view' | 'create' | 'edit' | 'delete' | 'selfControl'
): Access => {
  return async ({ req, id, data }) => {
    const hasPrivilege = await hasRolePrivilege(req, collection, privilege)
    
    if (!hasPrivilege) return false
    
    // If selfControl is enabled and we have the privilege, check if it's enabled
    const hasSelfControl = await hasRolePrivilege(req, collection, 'selfControl')
    
    if (hasSelfControl) {
      const user = req.user as User
      
      // For university-related collections, check university ownership
      if (collection === 'universities') {
        // For universities collection, check if user is associated with this university
        if (user?.collection === 'users' && user.university) {
          const universityId = typeof user.university === 'object' ? user.university.id : user.university
          return String(universityId) === String(id || data?.id)
        }
        if (user?.collection === 'universities') {
          return String(user.id) === String(id || data?.id)
        }
      }
      
      if (collection === 'university-pages') {
        // For university pages, check if the page belongs to user's university
        if (user?.collection === 'users' && user.university) {
          const universityId = typeof user.university === 'object' ? user.university.id : user.university
          const pageUniversityId = data?.university || (id && req.payload ? 
            (await req.payload.findByID({ collection: 'university-pages', id }))?.university : null)
          
          if (typeof pageUniversityId === 'object') {
            return String(universityId) === String(pageUniversityId.id)
          }
          return String(universityId) === String(pageUniversityId)
        }
      }
      
      // For other collections with selfControl, check ownership
      if (user?.id && (data?.createdBy === user.id || data?.user === user.id)) {
        return true
      }
    }
    
    return true // If no selfControl restriction, allow if has privilege
  }
}

export const roleBasedAdminVisibility = (collection: string) => {
  return async ({ req }: { req: any }): Promise<boolean> => {
    return await hasRolePrivilege(req, collection, 'view')
  }
}