import type { Endpoint } from "payload";

export const withFiltersEndpoint: Endpoint = {
  path: '/with-filters',
  method: 'get',
  handler: async ({ payload }) => {
    const { docs } = await payload.find({
        collection: 'courses',
        depth: 3,
        limit: 1000,
    });

    const filters = {
      universities: new Set<string>(),
      countries: new Set<string>(),
      degreePrograms: new Set<string>(),
      departments: new Set<string>(),
      studyAreas: new Set<string>(),
      studyYears: new Set<number>(),
      studyModes: new Set<string>(),
    };

    for (const course of docs) {
      if (course.university?.title) filters.universities.add(course.university.title);
      if (course.university?.country?.name) filters.countries.add(course.university.country.name);
      if (course.degreeProgram) filters.degreePrograms.add(course.degreeProgram);
      if (course.department) filters.departments.add(course.department);
      if (course.studyArea) filters.studyAreas.add(course.studyArea);
      if (course.studyYears) filters.studyYears.add(course.studyYears);
      if (course.studyMode) filters.studyModes.add(course.studyMode);
    }

    const result = {
      universities: [...filters.universities],
      countries: [...filters.countries],
      degreePrograms: [...filters.degreePrograms],
      departments: [...filters.departments],
      studyAreas: [...filters.studyAreas],
      studyYears: [...filters.studyYears],
      studyModes: [...filters.studyModes],
    };

    return new Response(JSON.stringify({ filters: result }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  },
};
