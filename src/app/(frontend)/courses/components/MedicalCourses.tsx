'use client'

import React, { useState, useEffect } from 'react'
import Slider from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

interface Course {
  id: string
  title: string
  description: string
  image: string
}

const MedicalCoursesSlider = () => {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses?category=medical&limit=10')
        const data = await response.json()
        setCourses(data.docs)
      } catch (error) {
        console.error('Error fetching courses:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  const sliderSettings = {
    dots: false,
    arrows: courses.length > 1,
    infinite: false,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  }

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div>Loading...</div>
      </div>
    )

  return (
    <section className="bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center text-3xl font-bold text-blue-800 mb-4">
          Looking Beyond Other Fields? Medical Courses Await!
        </h2>
        <p className="text-center text-gray-600 mb-8">
          If law, business, digital technology, or any other field isn't for
          you, explore our medical programs and embark on your career in
          healthcare.
        </p>
        <div className="relative bg-blue-800 rounded-lg py-6">
          <Slider {...sliderSettings} className="flagSlider">
            {courses.map((course) => (
              <div key={course.id} className="px-6">
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <img
                    src="/api/media/file/veritas_area_digitaltechnology_d-2560x1440.png"
                    alt={course.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-blue-800">
                      {course.title}
                    </h3>
                    <p className="text-gray-600 mt-2">{course.description}</p>
                    <button className="mt-4 text-blue-800 font-semibold underline">
                      Explore More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
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
        </div>
        <div className="text-center mt-6">
          <button className="bg-blue-800 text-white px-6 py-3 rounded-lg font-semibold shadow hover:bg-blue-700">
            VIEW ALL COURSES
          </button>
        </div>
      </div>
    </section>
  )
}

export default MedicalCoursesSlider