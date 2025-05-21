'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Image from 'next/image'

interface Course {
  id: string
  title: string
  description: string
  image: string
}

interface CoursesResponse {
  docs: Course[]
  total: number
  limit: number
  page: number
  pages: number
}

const MedicalCoursesSlider = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)

  const fetchCourses = useCallback(
    async (
      page: number,
      limit: number,
      filters: {
        countries: string[]
        universities: string[]
        studyAreas: string[]
        degreePrograms: string[]
        departments: string[]
        studyYears: string[]
        studyModes: string[]
      },
    ) => {
      setLoading(true)
      try {
        const response = await fetch('/api/get-courses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            page,
            limit,
            filters,
          }),
        })

        if (!response.ok) {
          throw new Error('Failed to fetch courses')
        }

        const data: CoursesResponse = await response.json()
        setCourses(data.docs)
        setCurrentPage(page)
      } catch (error) {
        console.error('Error fetching courses:', error)
        setCourses([])
      } finally {
        setLoading(false)
      }
    },
    [],
  )

  useEffect(() => {
    fetchCourses(1, 10, {
      countries: [],
      universities: [],
      studyAreas: [],
      degreePrograms: [],
      departments: ['Medical'], // Only fetch Medical department courses
      studyYears: [],
      studyModes: [],
    })
  }, [fetchCourses])

  const sliderSettings = {
    dots: false,
    arrows: courses.length > 1,
    infinite: false,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    centerMode: true,
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div>Loading medical courses...</div>
      </div>
    )
  }

  if (!courses.length && !loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div>No medical courses found</div>
      </div>
    )
  }

  return (
    <section className="bg-[#F0F6FF] secpadblock MediCoursec">
      <div className="container mx-auto px-4">
        <div className="sectitle text-center marbtm">
          <h2>
            Looking Beyond Other Fields? <br />
            Medical Courses Await!
          </h2>
          <p>
            If law, business, digital technology, or any other field is not for you, explore our
            medical programs and embark on your career in healthcare.
          </p>
        </div>
        <div className="relative MediCourConWap">
          <Slider {...sliderSettings} className="MediCourSlider">
            {courses.map((course) => (
              <div key={course.id}>
                <div className="bg-white overflow-hidden flex MCslidItems">
                  <div className="MediCourImgbox">
                    <img
                      src="/api/media/file/veritas_area_digitaltechnology_d-2560x1440.png"
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                  <div className="MediCourContbox">
                    <Image
                      src="/media/medical-icon.png"
                      alt={course.title}
                      width="40"
                      height="40"
                    />
                    <h3 className="text-lg font-bold text-[#0056d2]">{course.title}</h3>
                    <p className="text-gray-600 mt-2">{course.description}</p>
                    <button>Explore More</button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
          {courses.length > 1 && (
            <>
              <div className="absolute inset-y-0 left-0 flex items-center justify-center">
                <button className="w-10 h-10 bg-white text-blue-800 rounded-full shadow flex items-center justify-center">
                  ←
                </button>
              </div>
              <div className="absolute inset-y-0 right-0 flex items-center justify-center">
                <button className="w-10 h-10 bg-white text-blue-800 rounded-full shadow flex items-center justify-center">
                  →
                </button>
              </div>
            </>
          )}
        </div>
        <div className="text-center mt-6">
          <button
            className="bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-700"
            onClick={() =>
              fetchCourses(currentPage + 1, 10, {
                countries: [],
                universities: [],
                studyAreas: [],
                degreePrograms: [],
                departments: ['Medical'],
                studyYears: [],
                studyModes: [],
              })
            }
          >
            VIEW ALL MEDICAL COURSES
          </button>
        </div>
      </div>
    </section>
  )
}

export default MedicalCoursesSlider
