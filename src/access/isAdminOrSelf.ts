import type { Access } from 'payload'
import type { User } from '@/payload-types'

export const isAdminOrSelf: Access = ({ req: { user }, id }) => {
  // Allow if user is admin from Users collection
  if (user?.collection === 'users' && (user as User)?.role === 'admin') {
    return true
  }

  // Allow if user is accessing their own record
  return Boolean(user && id && user.id === id)
}