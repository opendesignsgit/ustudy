import { NextApiRequest, NextApiResponse } from 'next'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { Where } from 'payload'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const payload = await getPayload({ config: configPromise })
  const { 
    page = 1, 
    limit = 12,
    countries = [],
    universities = [],
    degreePrograms = [],
    departments = [],
    studyAreas = [],
    studyYears = [],
    studyModes = [],
    searchQuery = '',
    getAll = false
  } = req.body

  try {
    const where: Where = {}

    // Text search (if searchQuery is provided)
    if (searchQuery) {
      where.or = [
        { title: { contains: searchQuery } },
        { description: { contains: searchQuery } },
        { 'university.title': { contains: searchQuery } },
        { 'degreeProgram.name': { contains: searchQuery } },
        { 'department.name': { contains: searchQuery } },
        { 'studyArea.name': { contains: searchQuery } },
        { 'studyMode.name': { contains: searchQuery } }
      ]

      // Special case for "PG" search
      if (searchQuery.toLowerCase() === 'pg') {
        where.or.push(
          { 'degreeProgram.name': { contains: 'Postgraduate' } },
          { 'degreeProgram.name': { contains: 'PG' } },
          { 'degreeProgram.name': { contains: 'Master' } },
          { title: { contains: 'Postgraduate' } },
          { title: { contains: 'PG' } },
          { title: { contains: 'Master' } }
        )
      }
    }

    // Country filter
    if (countries.length) where['university.country.name'] = { in: countries }
    
    // University filter
    if (universities.length) where['university.title'] = { in: universities }
    
    // Degree Programs filter
    if (degreePrograms.length) where['degreeProgram.name'] = { in: degreePrograms }
    
    // Departments filter
    if (departments.length) where['department.name'] = { in: departments }
    
    // Study Areas filter
    if (studyAreas.length) where['studyArea.name'] = { in: studyAreas }
    
    // Study Years filter
    if (studyYears.length) where['studyYear.name'] = { in: studyYears }
    
    // Study Modes filter
    if (studyModes.length) where['studyMode.name'] = { in: studyModes }

    const queryOptions = {
      collection: 'courses' as const,
      depth: 3,
      where,
      overrideAccess: true,
    }

    if (getAll) {
      const result = await payload.find({
        ...queryOptions,
        limit: 1000,
      })
      return res.status(200).json({ docs: result.docs })
    } else {
      const result = await payload.find({
        ...queryOptions,
        limit: Number(limit),
        page: Number(page),
      })
      return res.status(200).json({
        docs: result.docs,
        totalDocs: result.totalDocs,
        totalPages: result.totalPages,
        page: result.page,
      })
    }
  } catch (error) {
    console.error('Error fetching courses:', error)
    return res.status(500).json({ error: 'Failed to fetch courses' })
  }
}