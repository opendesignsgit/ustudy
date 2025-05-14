import { NextApiRequest, NextApiResponse } from 'next'
import { getCourses } from '@/utilities/fetchCourses'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  console.log('Request method:', req.method)
  console.log('Request body:', req.body)

  // Uncomment the following block to restrict to POST requests
  // if (req.method !== 'POST') {
  //   return res.status(405).json({ error: 'Method not allowed' })
  // }

  const { page = 1, limit = 5, filters = {} } = req.body
  console.log('Filters received:', filters)

  try {
    const courses = await getCourses({ page, limit, filters })
    res.status(200).json(courses)
  } catch (error) {
    console.error('Error fetching courses:', error)
    res.status(500).json({ error: 'Failed to fetch courses', details: error.message })
  }
}