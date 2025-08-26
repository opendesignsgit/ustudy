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
  return async ({ req }) => {
    return await hasRolePrivilege(req, collection, privilege)
  }
}

export const roleBasedAdminVisibility = (collection: string) => {
  return async ({ req }: { req: any }): Promise<boolean> => {
    return await hasRolePrivilege(req, collection, 'view')
  }
}