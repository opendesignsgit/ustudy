import React, { useState, useEffect } from 'react'

interface Course {
  _id: string
  book: string
  emp: string
  coverImage?: string
}

export default function CoursesMenu() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await fetch('/api/get-courses')
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`)
        }
        const result = await response.json()
        if (result && Array.isArray(result.data)) {
          setCourses(result.data)
        } else {
          throw new Error('Invalid data structure')
        }
      } catch (err: any) {
        setError(err.message || 'Error fetching courses')
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  if (loading) return <div>Loading courses...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Courses</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => {
          const finalURL = `https://kteccourse.ustudy.academy/#/auth/book/${course._id}`

          return (
            <div key={course._id} className="border p-4 rounded shadow hover:shadow-lg">
              <h2 className="text-xl font-semibold mb-2">{course.book}</h2>
              <p>{course.emp}</p>
              {course.coverImage && (
                <img
                  src={course.coverImage}
                  alt={`${course.book} cover`}
                  className="w-full h-auto mt-2"
                />
              )}
              <a
                href={finalURL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                View Book
              </a>
            </div>
          )
        })}
      </div>
    </div>
  )
}