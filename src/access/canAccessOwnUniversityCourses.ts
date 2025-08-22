import type { Access } from 'payload'
import type { User } from '@/payload-types'

export const canAccessOwnUniversityCourses: Access = async ({ req: { user, payload }, data, id }) => {
  // Check if user is from Users collection and has admin role
  if (user?.collection === 'users' && (user as User)?.role === 'admin') {
    return true
  }

  // For university-role users from Users collection, check if they're accessing courses for their own university
  if (user?.collection === 'users' && (user as User)?.role === 'university-role' && (user as User)?.university) {
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
  if (user?.collection === 'users' && (user as User)?.role === 'admin') {
    return true
  }

  // For university-role users from Users collection
  if (user?.collection === 'users' && (user as User)?.role === 'university-role' && (user as User)?.university) {
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