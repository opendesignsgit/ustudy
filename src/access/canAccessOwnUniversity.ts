import type { Access } from 'payload'
import type { User, University, Role } from '@/payload-types'

const checkAdminRole = (user: any): boolean => {
  if (!user || user.collection !== 'users') return false
  
  // Check for old string-based role system (backward compatibility)
  if (typeof user.role === 'string') {
    return user.role === 'admin'
  }
  
  // Check for new role collection system
  if (typeof user.role === 'object' && user.role?.name) {
    return user.role.name === 'admin'
  }
  
  return false
}

const checkUniversityRole = (user: any): boolean => {
  if (!user || user.collection !== 'users') return false
  
  // Check for old string-based role system (backward compatibility)
  if (typeof user.role === 'string') {
    return user.role === 'university-role'
  }
  
  // Check for new role collection system
  if (typeof user.role === 'object' && user.role?.name) {
    return user.role.name === 'university-role'
  }
  
  return false
}

export const canAccessOwnUniversity: Access = async ({ req: { user, payload }, id }) => {
  // Check if user is from Users collection and has admin role
  if (checkAdminRole(user)) {
    return true
  }

  // For university-role users from Users collection, check if they're accessing their own university
  if (checkUniversityRole(user) && (user as User)?.university && id) {
    // If user.university is a relationship, compare the ID
    const userUniversity = (user as User).university
    const universityId = typeof userUniversity === 'object' && userUniversity ? userUniversity.id : userUniversity
    return Number(universityId) === Number(id)
  }

  // For university users from Universities collection, they can only access their own record
  if (user?.collection === 'universities' && id) {
    return Number(user.id) === Number(id)
  }

  return false
}

export const canAccessOwnUniversityPages: Access = async ({ req: { user, payload }, data, id }) => {
  // Check if user is from Users collection and has admin role
  if (checkAdminRole(user)) {
    return true
  }

  // For university-role users from Users collection, check if they're accessing pages for their own university
  if (checkUniversityRole(user) && (user as User)?.university) {
    const userUniversity = (user as User).university
    const universityId = typeof userUniversity === 'object' && userUniversity ? userUniversity.id : userUniversity

    // For create operations, check the university field in data
    if (data?.university) {
      const pageUniversityId = typeof data.university === 'object' && data.university ? data.university.id : data.university
      return Number(universityId) === Number(pageUniversityId)
    }

    // For read/update/delete operations, fetch the page and check its university
    if (id) {
      try {
        const page = await payload.findByID({
          collection: 'university-pages',
          id,
          user,
        })
        const pageUniversityId = typeof page.university === 'object' && page.university ? page.university.id : page.university
        return Number(universityId) === Number(pageUniversityId)
      } catch (error) {
        return false
      }
    }
  }

  // For university users from Universities collection, they can access pages for their university
  if (user?.collection === 'universities') {
    // For create operations, check the university field in data
    if (data?.university) {
      const pageUniversityId = typeof data.university === 'object' && data.university ? data.university.id : data.university
      return Number(user.id) === Number(pageUniversityId)
    }

    // For read/update/delete operations, fetch the page and check its university
    if (id) {
      try {
        const page = await payload.findByID({
          collection: 'university-pages',
          id,
          user,
        })
        const pageUniversityId = typeof page.university === 'object' && page.university ? page.university.id : page.university
        return Number(user.id) === Number(pageUniversityId)
      } catch (error) {
        return false
      }
    }
  }

  return false
}