// lib/courseFetch.ts
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export async function getCourses({
  limit = 5,
  page = 1,
  filters = {},
}: {
  limit?: number
  page?: number
  filters?: {
    countries?: string[]
    universities?: string[]
    degreePrograms?: string[]
    departments?: string[]
    studyAreas?: string[]
    studyYears?: string[]
    studyModes?: string[]
  }
}) {
  const payload = await getPayload({ config: configPromise })

  // Build the where query from filters
  const where: any = {}

  if (filters.countries?.length) {
    where['university.country.name'] = { in: filters.countries }
  }

  if (filters.universities?.length) {
    where['university.title'] = { in: filters.universities }
  }

  if (filters.degreePrograms?.length) {
    where['degreeProgram.title'] = { in: filters.degreePrograms }
  }

  if (filters.departments?.length) {
    where['department.title'] = { in: filters.departments }
  }

  if (filters.studyAreas?.length) {
    where['studyArea.title'] = { in: filters.studyAreas }
  }

  if (filters.studyYears?.length) {
    where['studyYear.title'] = { in: filters.studyYears }
  }

  if (filters.studyModes?.length) {
    where['studyMode.title'] = { in: filters.studyModes }
  }

  const result = await payload.find({
    collection: 'courses',
    depth: 4, // Ensure relationships are properly populated
    limit,
    page,
    where,
    overrideAccess: false,
  })

  return {
    docs: result.docs || [],
    totalDocs: result.totalDocs || 0,
    totalPages: result.totalPages || 1,
    page: result.page || 1,
  }
}

export async function getAllCoursesForFilters() {
  const payload = await getPayload({ config: configPromise })
  
  const result = await payload.find({
    collection: 'courses',
    depth: 3, // Ensure relationships are properly populated
    limit: 1000,
    overrideAccess: false,
  })

  return result.docs || []
}