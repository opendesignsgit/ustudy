import { NextApiRequest, NextApiResponse } from 'next'
import { getCourses } from '@/utilities/fetchCourses'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { page = 1, limit = 5, filters = {} } = req.body

  try {
    const courses = await getCourses({ 
      page, 
      limit, 
      filters: {
        countries: filters.countries,
        universities: filters.universities,
        degreePrograms: filters.degreePrograms,
        departments: filters.departments,
        studyAreas: filters.studyAreas,
        studyYears: filters.studyYears,
        studyModes: filters.studyModes,
      }
    })
    res.status(200).json(courses)
  } catch (error) {
    console.error('Error fetching courses:', error)
    res.status(500).json({ error: 'Failed to fetch courses' })
  }
}