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
        // Helper function to get display value from relationships
        const getDisplayValue = (field: any): string | undefined => {
          if (typeof field === 'object' && field !== null) {
            // Handle direct relationship with title/name
            if ('title' in field && typeof field.title === 'string') {
              return field.title.trim()
            }
            if ('name' in field && typeof field.name === 'string') {
              return field.name.trim()
            }
            // Handle nested relationships (e.g., studyArea -> name)
            if ('studyArea' in field && typeof field.studyArea === 'object') {
              return getDisplayValue(field.studyArea)
            }
          }
          return undefined
        }

        // Process university
        if (course.university) {
          const uniName = getDisplayValue(course.university)
          if (uniName) universities.add(uniName)
        }

        // Process country
        if (course.university && typeof course.university === 'object' && course.university.country) {
          const countryName = getDisplayValue(course.university.country)
          if (countryName) countries.add(countryName)
        }

        // Process department
        if (course.department) {
          const deptName = getDisplayValue(course.department)
          if (deptName) departments.add(deptName)
        }

        // Process study area
        if (course.studyArea) {
          const areaName = getDisplayValue(course.studyArea)
          if (areaName) studyAreas.add(areaName)
        }

        // Process study mode
        if (course.studyMode) {
          const modeName = getDisplayValue(course.studyMode)
          if (modeName) studyModes.add(modeName)
        }

        // Process degree program
        if (course.degreeProgram) {
          const programName = getDisplayValue(course.degreeProgram)
          if (programName) degreePrograms.add(programName)
        }

        // Process study year (numeric value)
        if (typeof course.studyYear === 'number') {
          studyYears.add(course.studyYear)
        }

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
    return result
  }
}