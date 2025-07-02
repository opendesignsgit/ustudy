// lib/courseFetch.ts
import configPromise from '@payload-config'
import { getPayload } from 'payload'

// Update your fetch-courses.ts
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

  const where: any = {}

  // Handle array relationships properly
  const buildWhereForRelationship = (path: string, values: string[]) => {
    if (values.length === 1) {
      return { [path]: { equals: values[0] } }
    }
    return { [path]: { in: values } }
  }

  if (filters.countries?.length) {
    where['university.country.name'] = { in: filters.countries }
  }

  if (filters.universities?.length) {
    where['university.title'] = { in: filters.universities }
  }

  if (filters.degreePrograms?.length) {
    where['degreeProgram.title'] = buildWhereForRelationship('degreeProgram.title', filters.degreePrograms)
  }

  if (filters.departments?.length) {
    where['department.title'] = buildWhereForRelationship('department.title', filters.departments)
  }

  if (filters.studyAreas?.length) {
    where['studyArea.title'] = buildWhereForRelationship('studyArea.title', filters.studyAreas)
  }

  if (filters.studyYears?.length) {
    where['studyYear.title'] = buildWhereForRelationship('studyYear.title', filters.studyYears)
  }

  if (filters.studyModes?.length) {
    where['studyMode.title'] = buildWhereForRelationship('studyMode.title', filters.studyModes)
  }

  const result = await payload.find({
    collection: 'courses',
    depth: 3,
    limit,
    page,
    where,
    overrideAccess: true,
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
    overrideAccess: true,
  })

  return result.docs || []
}
//Final