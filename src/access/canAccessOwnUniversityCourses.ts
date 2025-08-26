import type { Access } from 'payload'
import type { User, Role } from '@/payload-types'

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

export const canAccessOwnUniversityCourses: Access = async ({ req: { user, payload }, data, id }) => {
  // Check if user is from Users collection and has admin role
  if (checkAdminRole(user)) {
    return true
  }

  // For university-role users from Users collection, check if they're accessing courses for their own university
  if (checkUniversityRole(user) && (user as User)?.university) {
    const userUniversity = (user as User).university
    const universityId = typeof userUniversity === 'object' && userUniversity ? userUniversity.id : userUniversity

    // For create operations, check the university field in data
    if (data?.university) {
      const courseUniversityId = typeof data.university === 'object' && data.university ? data.university.id : data.university
      return Number(universityId) === Number(courseUniversityId)
    }

    // For read/update/delete operations, fetch the course and check its university
    if (id) {
      try {
        const course = await payload.findByID({
          collection: 'courses',
          id,
          user,
        })
        const courseUniversityId = typeof course.university === 'object' && course.university ? course.university.id : course.university
        return Number(universityId) === Number(courseUniversityId)
      } catch (error) {
        return false
      }
    }
  }

  // For university users from Universities collection, they can access courses for their university
  if (user?.collection === 'universities') {
    // For create operations, check the university field in data
    if (data?.university) {
      const courseUniversityId = typeof data.university === 'object' && data.university ? data.university.id : data.university
      return Number(user.id) === Number(courseUniversityId)
    }

    // For read/update/delete operations, fetch the course and check its university
    if (id) {
      try {
        const course = await payload.findByID({
          collection: 'courses',
          id,
          user,
        })
        const courseUniversityId = typeof course.university === 'object' && course.university ? course.university.id : course.university
        return Number(user.id) === Number(courseUniversityId)
      } catch (error) {
        return false
      }
    }
  }

  return false
}

// For queries, filter courses to only show those for the user's university
export const filterCoursesForOwnUniversity: Access = ({ req: { user } }) => {
  // Allow all for admin
  if (checkAdminRole(user)) {
    return true
  }

  // For university-role users from Users collection
  if (checkUniversityRole(user) && (user as User)?.university) {
    const userUniversity = (user as User).university
    const universityId = typeof userUniversity === 'object' && userUniversity ? userUniversity.id : userUniversity
    
    return {
      university: {
        equals: universityId,
      },
    }
  }

  // For university users from Universities collection
  if (user?.collection === 'universities') {
    return {
      university: {
        equals: user.id,
      },
    }
  }

  return false
}