import type { Access, FieldAccess } from 'payload'
import type { User } from '@/payload-types'

export const isUniversityUser: Access = ({ req: { user } }) => {
  // Return true if user has university-role from Users collection
  return Boolean(user?.collection === 'users' && (user as User)?.role === 'university-role')
}

export const isUniversityUserFieldLevel: FieldAccess = ({ req: { user } }) => {
  // Return true if user has university-role from Users collection
  return Boolean(user?.collection === 'users' && (user as User)?.role === 'university-role')
}

export const isAdminOrUniversityUser: Access = ({ req: { user } }) => {
  // Allow if user is admin or university-role from Users collection, or from Universities collection
  return Boolean(
    (user?.collection === 'users' && ((user as User)?.role === 'admin' || (user as User)?.role === 'university-role')) ||
    user?.collection === 'universities'
  )
}