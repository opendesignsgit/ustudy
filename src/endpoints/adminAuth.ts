import type { Endpoint } from 'payload'

/**
 * Custom admin authentication endpoint that supports multi-collection authentication
 * 
 * This endpoint allows users from both Users and Universities collections to access
 * the admin panel by implementing a unified authentication flow.
 */

const adminAuth: Endpoint = {
  path: '/admin-auth',
  method: 'post',
  handler: async (req) => {
    // For PayloadCMS endpoints, the request body is already parsed
    const { email, password } = req.data || {}

    if (!email || !password) {
      return Response.json(
        { error: 'Email and password are required' },
        { status: 400 }
      )
    }

    try {
      // First, try to authenticate against Universities collection
      try {
        const universityResult = await req.payload.login({
          collection: 'universities',
          data: { email, password },
          req,
        })

        if (universityResult.user) {
          // Successful university authentication
          return Response.json({
            user: {
              ...universityResult.user,
              collection: 'universities',
            },
            token: universityResult.token,
            exp: universityResult.exp,
          })
        }
      } catch (universityError) {
        console.log('University authentication failed, trying Users collection')
      }

      // If university auth fails, try Users collection
      try {
        const userResult = await req.payload.login({
          collection: 'users',
          data: { email, password },
          req,
        })

        if (userResult.user) {
          // Successful user authentication - create a session compatible with admin panel
          // We'll use the Universities collection session format since that's the admin collection
          
          // Create a compatible user object for admin access
          const adminCompatibleUser = {
            ...userResult.user,
            collection: 'universities', // Map to admin collection for session compatibility
            originalCollection: 'users', // Keep track of original collection
          }

          return Response.json({
            user: adminCompatibleUser,
            token: userResult.token,
            exp: userResult.exp,
          })
        }
      } catch (userError) {
        console.log('Users authentication failed')
      }

      // Both authentication attempts failed
      return Response.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    } catch (error) {
      console.error('Admin authentication error:', error)
      return Response.json(
        { error: 'Authentication failed' },
        { status: 500 }
      )
    }
  },
}

export default adminAuth