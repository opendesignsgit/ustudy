// components/YearlyCourses.tsx
import React from 'react'
import RichText from '@/components/RichText'
import type { YearlyCoursesBlock as YearlyCoursesBlockProps } from '@/payload-types'

export const YearlyCoursesBlock: React.FC<YearlyCoursesBlockProps> = (props) => {
  const { years } = props

  return (
    <div className="yearly-courses-container space-y-16">
      <div className="CourseModuleTitle"> Course Modules </div>
      {years?.map((year, yearIndex) => (
        <div key={yearIndex} className="year-group">
          <h2 className="text-2xl font-bold mb-8 border-b pb-2">
            {year.yearNumber}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="left-column">
              <RichText data={year.leftColumn} />
            </div>
            <div className="right-column">
              <RichText data={year.rightColumn} />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}