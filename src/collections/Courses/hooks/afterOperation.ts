import type { AfterOperationHook } from 'node_modules/payload/dist/collections/config/types'
import type { Course } from '@/payload-types'

export const addFilterOptions: AfterOperationHook<'courses'> = async ({
  operation,
  result,
}) => {
  try {
    if (operation !== 'find' || !('docs' in result)) {
      return result
    }

    const courses = result.docs as Course[]

    const universities = new Set<string>()
    const countries = new Set<string>()
    const degreePrograms = new Set<string>()
    const departments = new Set<string>()
    const studyAreas = new Set<string>()
    const studyYears = new Set<number>()
    const studyModes = new Set<string>()

    for (const course of courses) {
      try {
        // University processing
        if (course.university) {
          if (typeof course.university === 'object' && course.university !== null) {
            if ('title' in course.university && course.university.title) {
              universities.add(course.university.title)
            }
            if ('country' in course.university && 
                typeof course.university.country === 'object' && 
                course.university.country !== null && 
                'name' in course.university.country) {
              countries.add(course.university.country.name)
            }
          }
        }

        // Other fields
        if (course.degreeProgram) degreePrograms.add(course.degreeProgram)
        if (course.department) departments.add(course.department)
        if (course.studyArea) studyAreas.add(course.studyArea)
        if (course.studyYears) studyYears.add(course.studyYears)
        if (course.studyMode) studyModes.add(course.studyMode)
      } catch (err) {
        console.error(`Error processing course ${course.id}:`, err)
        continue
      }
    }

    return {
      ...result,
      filterOptions: {
        universities: Array.from(universities).sort(),
        countries: Array.from(countries).sort(),
        degreePrograms: Array.from(degreePrograms).sort(),
        departments: Array.from(departments).sort(),
        studyAreas: Array.from(studyAreas).sort(),
        studyYears: Array.from(studyYears).sort((a, b) => a - b),
        studyModes: Array.from(studyModes).sort(),
      },
    }
  } catch (error) {
    console.error('Error in addFilterOptions hook:', error)
    // Return the original result if processing fails
    return result
  }
}